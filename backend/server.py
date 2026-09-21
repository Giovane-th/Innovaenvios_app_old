from fastapi import FastAPI, APIRouter, Depends, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# Load environment variables FIRST before importing modules that need them
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from auth import (
    hash_password, verify_password, create_access_token, require_user
)
from correios_client import correios

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="In'Nova Envios API")
api_router = APIRouter(prefix='/api')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============================================================
# Models
# ============================================================
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    saldo: float = 0.0


class TokenOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserOut


class CalcularFreteIn(BaseModel):
    cep_origem: str
    cep_destino: str
    peso_g: int = Field(..., ge=1, le=30000)
    comprimento: float = Field(16.0, ge=11, le=105)
    largura: float = Field(11.0, ge=6, le=105)
    altura: float = Field(2.0, ge=0.4, le=105)
    servicos: Optional[List[str]] = None  # ex: ['04510', '04014']


class EnvioCreate(BaseModel):
    recipient_name: str
    recipient_doc: Optional[str] = None
    recipient_phone: Optional[str] = None
    cep_origem: str
    cep_destino: str
    endereco_destino: str
    cidade_destino: str
    uf_destino: str
    peso_g: int
    comprimento: float = 16
    largura: float = 11
    altura: float = 2
    servico: str
    servico_nome: Optional[str] = None
    valor: float


class RecargaIn(BaseModel):
    valor: float = Field(..., gt=0, le=10000)
    metodo: str = 'pix'  # 'pix' | 'cartao' | 'cupom'


WELCOME_BONUS = 5.00


# ============================================================
# Auth
# ============================================================
@api_router.post('/auth/register', response_model=TokenOut)
async def register(data: RegisterIn):
    existing = await db.users.find_one({'email': data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail='E-mail já cadastrado')
    user_id = str(uuid.uuid4())
    user = {
        'id': user_id,
        'name': data.name,
        'email': data.email.lower(),
        'phone': data.phone,
        'password_hash': hash_password(data.password),
        'saldo': WELCOME_BONUS,
        'created_at': datetime.utcnow(),
    }
    await db.users.insert_one(user)
    # Lança o bônus no extrato
    await db.wallet_tx.insert_one({
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'tipo': 'credito',
        'categoria': 'bonus',
        'descricao': 'Bônus de boas-vindas',
        'valor': WELCOME_BONUS,
        'saldo_apos': WELCOME_BONUS,
        'created_at': datetime.utcnow(),
    })
    token = create_access_token(user_id)
    return TokenOut(access_token=token, user=UserOut(**user))


@api_router.post('/auth/login', response_model=TokenOut)
async def login(data: LoginIn):
    user = await db.users.find_one({'email': data.email.lower()})
    if not user or not verify_password(data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='E-mail ou senha inválidos')
    token = create_access_token(user['id'])
    return TokenOut(access_token=token, user=UserOut(**user))


@api_router.get('/auth/me', response_model=UserOut)
async def me(user_id: str = Depends(require_user)):
    user = await db.users.find_one({'id': user_id})
    if not user:
        raise HTTPException(status_code=404, detail='Usuário não encontrado')
    return UserOut(**user)


# ============================================================
# Frete (Correios)
# ============================================================
DEFAULT_SERVICOS = ['04510', '04014']  # PAC, SEDEX (varejo/contrato comum)
SERVICOS_NOMES = {
    '04510': 'Correios PAC',
    '04014': 'Correios SEDEX',
    '04669': 'PAC Contrato',
    '04162': 'SEDEX Contrato',
    '04316': 'SEDEX 10',
    '04804': 'SEDEX 12',
}


@api_router.post('/frete/calcular')
async def calcular_frete(data: CalcularFreteIn):
    servicos = data.servicos or DEFAULT_SERVICOS
    try:
        precos = await correios.calcular_preco(
            cep_origem=data.cep_origem,
            cep_destino=data.cep_destino,
            peso_g=data.peso_g,
            comprimento=data.comprimento,
            largura=data.largura,
            altura=data.altura,
            servicos=servicos,
        )
        prazos = await correios.calcular_prazo(
            cep_origem=data.cep_origem,
            cep_destino=data.cep_destino,
            servicos=servicos,
        )
    except RuntimeError as e:
        logger.exception('Erro Correios')
        raise HTTPException(status_code=502, detail=str(e))

    prazo_map = {p.get('coProduto'): p for p in (prazos or [])}
    results = []
    for p in precos or []:
        cod = p.get('coProduto')
        prazo = prazo_map.get(cod, {})
        try:
            valor = float(str(p.get('pcFinal', '0')).replace(',', '.'))
        except Exception:
            valor = 0.0
        # preço sem desconto (estimado)
        try:
            valor_orig = float(str(p.get('pcBase', valor)).replace(',', '.'))
        except Exception:
            valor_orig = valor
        results.append({
            'codigo': cod,
            'nome': SERVICOS_NOMES.get(cod, cod),
            'valor': round(valor, 2),
            'valor_sem_desconto': round(valor_orig, 2),
            'prazo_dias': int(prazo.get('prazoEntrega', 0) or 0),
            'data_maxima_entrega': prazo.get('dataMaxima'),
            'erro': p.get('txErro') or None,
        })
    return {'resultados': results}


# ============================================================
# Envios
# ============================================================
@api_router.post('/envios')
async def criar_envio(data: EnvioCreate, user_id: str = Depends(require_user)):
    user = await db.users.find_one({'id': user_id})
    if not user:
        raise HTTPException(status_code=404, detail='Usuário não encontrado')
    saldo_atual = float(user.get('saldo', 0) or 0)
    if saldo_atual < data.valor:
        raise HTTPException(
            status_code=402,
            detail=f'Saldo insuficiente. Saldo atual: R$ {saldo_atual:.2f}. Valor do envio: R$ {data.valor:.2f}.'
        )
    novo_saldo = round(saldo_atual - data.valor, 2)
    envio_id = str(uuid.uuid4())
    envio = {
        'id': envio_id,
        'user_id': user_id,
        'status': 'Aguardando postagem',
        'created_at': datetime.utcnow(),
        **data.dict(),
    }
    await db.envios.insert_one(envio)
    await db.users.update_one({'id': user_id}, {'$set': {'saldo': novo_saldo}})
    await db.wallet_tx.insert_one({
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'tipo': 'debito',
        'categoria': 'envio',
        'descricao': f'Envio para {data.recipient_name} - {data.servico_nome or data.servico}',
        'valor': data.valor,
        'saldo_apos': novo_saldo,
        'envio_id': envio_id,
        'created_at': datetime.utcnow(),
    })
    envio.pop('_id', None)
    envio['saldo_apos'] = novo_saldo
    return envio


# ============================================================
# Carteira / Wallet
# ============================================================
@api_router.get('/wallet/saldo')
async def wallet_saldo(user_id: str = Depends(require_user)):
    user = await db.users.find_one({'id': user_id})
    if not user:
        raise HTTPException(status_code=404, detail='Usuário não encontrado')
    return {'saldo': float(user.get('saldo', 0) or 0)}


@api_router.post('/wallet/recarga')
async def wallet_recarga(data: RecargaIn, user_id: str = Depends(require_user)):
    """Recarga MOCKADA - será substituída por Mercado Pago futuramente."""
    user = await db.users.find_one({'id': user_id})
    if not user:
        raise HTTPException(status_code=404, detail='Usuário não encontrado')
    saldo_atual = float(user.get('saldo', 0) or 0)
    novo_saldo = round(saldo_atual + data.valor, 2)
    tx_id = str(uuid.uuid4())
    metodo_label = {'pix': 'Pix', 'cartao': 'Cartão de Crédito', 'cupom': 'Cupom'}.get(data.metodo, data.metodo)
    await db.users.update_one({'id': user_id}, {'$set': {'saldo': novo_saldo}})
    await db.wallet_tx.insert_one({
        'id': tx_id,
        'user_id': user_id,
        'tipo': 'credito',
        'categoria': 'recarga',
        'descricao': f'Recarga via {metodo_label} (simulado)',
        'valor': data.valor,
        'saldo_apos': novo_saldo,
        'metodo': data.metodo,
        'created_at': datetime.utcnow(),
    })
    return {'sucesso': True, 'saldo': novo_saldo, 'transacao_id': tx_id}


@api_router.get('/wallet/extrato')
async def wallet_extrato(user_id: str = Depends(require_user), limit: int = 50):
    cursor = db.wallet_tx.find({'user_id': user_id}).sort('created_at', -1).limit(limit)
    out = []
    async for tx in cursor:
        tx.pop('_id', None)
        out.append(tx)
    return out


@api_router.get('/envios')
async def listar_envios(user_id: str = Depends(require_user)):
    cursor = db.envios.find({'user_id': user_id}).sort('created_at', -1).limit(100)
    out = []
    async for e in cursor:
        e.pop('_id', None)
        out.append(e)
    return out


@api_router.get('/envios/stats')
async def envios_stats(user_id: str = Depends(require_user)):
    cursor = db.envios.find({'user_id': user_id})
    total = 0
    em_transito = 0
    entregues = 0
    economia = 0.0
    async for e in cursor:
        total += 1
        if e.get('status') == 'Em trânsito':
            em_transito += 1
        if e.get('status') == 'Entregue':
            entregues += 1
        economia += float(e.get('economia', 0) or 0)
    taxa = round((entregues / total) * 100) if total else 0
    return {
        'total': total,
        'em_transito': em_transito,
        'entregues': entregues,
        'economia_total': round(economia, 2),
        'taxa_entrega': taxa,
    }


# ============================================================
# Rastreamento
# ============================================================
@api_router.get('/rastreio/{codigo}')
async def rastrear(codigo: str):
    try:
        return await correios.rastrear(codigo)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


# ============================================================
# Root
# ============================================================
@api_router.get('/')
async def root():
    return {'app': "In'Nova Envios", 'status': 'ok'}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()
