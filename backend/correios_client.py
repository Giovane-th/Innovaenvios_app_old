import os
import base64
import time
import logging
from typing import Optional, List, Dict, Any
import httpx

logger = logging.getLogger(__name__)


class CorreiosClient:
    """Cliente para a API CWS dos Correios (modelo A: contrato único da plataforma).

    Faz cache do token JWT em memória e renova automaticamente.
    """

    def __init__(self):
        self.usuario = os.environ.get('CORREIOS_USUARIO')
        self.senha = os.environ.get('CORREIOS_SENHA')
        self.cartao = os.environ.get('CORREIOS_CARTAO_POSTAGEM')
        self.contrato = os.environ.get('CORREIOS_CONTRATO')
        self.cod_admin = os.environ.get('CORREIOS_COD_ADMIN')
        amb = (os.environ.get('CORREIOS_AMBIENTE') or 'homologacao').lower()
        self.base_url = (
            os.environ.get('CORREIOS_API_URL_HOM') if amb == 'homologacao'
            else os.environ.get('CORREIOS_API_URL_PROD')
        )
        self._token: Optional[str] = None
        self._expires_at: float = 0.0

    # ---------- Auth ----------
    async def _authenticate(self) -> str:
        """Faz POST em /token/v1/autentica/cartaopostagem para gerar token."""
        url = f"{self.base_url}/token/v1/autentica/cartaopostagem"
        creds = f"{self.usuario}:{self.senha}".encode('utf-8')
        basic = base64.b64encode(creds).decode('ascii')
        headers = {
            'Authorization': f'Basic {basic}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        payload = {
            'numero': self.cartao,
            'contrato': self.contrato,
            'dr': int(self.cod_admin) if self.cod_admin else None,
        }
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
        if resp.status_code >= 400:
            logger.error(f"Correios auth falhou: {resp.status_code} {resp.text}")
            raise RuntimeError(f"Falha ao autenticar nos Correios: {resp.status_code}")
        data = resp.json()
        self._token = data.get('token')
        # Token é válido por ~24h; cacheamos por 23h
        self._expires_at = time.time() + 23 * 3600
        return self._token

    async def get_token(self) -> str:
        if not self._token or time.time() >= self._expires_at:
            await self._authenticate()
        return self._token

    async def _headers(self) -> Dict[str, str]:
        token = await self.get_token()
        return {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

    # ---------- Preço ----------
    async def calcular_preco(self, cep_origem: str, cep_destino: str, peso_g: int,
                              comprimento: float, largura: float, altura: float,
                              servicos: List[str]) -> List[Dict[str, Any]]:
        """Consulta preco/prazo para uma lista de códigos de serviço."""
        url = f"{self.base_url}/preco/v1/nacional"
        headers = await self._headers()
        payload = {
            'idLote': '1',
            'parametrosProduto': [
                {
                    'coProduto': s,
                    'nuRequisicao': str(i + 1),
                    'nuContrato': self.contrato,
                    'nuDR': self.cod_admin,
                    'cepOrigem': cep_origem.replace('-', '').replace('.', ''),
                    'cepDestino': cep_destino.replace('-', '').replace('.', ''),
                    'psObjeto': str(peso_g),
                    'tpObjeto': '2',
                    'comprimento': str(comprimento),
                    'largura': str(largura),
                    'altura': str(altura),
                    'servicosAdicionais': [],
                }
                for i, s in enumerate(servicos)
            ]
        }
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
        if resp.status_code >= 400:
            logger.error(f"Correios preco err: {resp.status_code} {resp.text[:500]}")
            raise RuntimeError(f"Falha consulta de preco: {resp.status_code}")
        return resp.json()

    # ---------- Prazo ----------
    async def calcular_prazo(self, cep_origem: str, cep_destino: str, servicos: List[str]) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/prazo/v1/nacional"
        headers = await self._headers()
        payload = {
            'idLote': '1',
            'parametrosPrazo': [
                {
                    'coProduto': s,
                    'nuRequisicao': str(i + 1),
                    'cepOrigem': cep_origem.replace('-', ''),
                    'cepDestino': cep_destino.replace('-', ''),
                }
                for i, s in enumerate(servicos)
            ]
        }
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
        if resp.status_code >= 400:
            logger.error(f"Correios prazo err: {resp.status_code} {resp.text[:500]}")
            return []
        return resp.json()

    # ---------- Rastreio ----------
    async def rastrear(self, codigo: str) -> Dict[str, Any]:
        url = f"{self.base_url}/srorastro/v1/objetos/{codigo}"
        headers = await self._headers()
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(url, headers=headers)
        if resp.status_code >= 400:
            return {'codigo': codigo, 'eventos': [], 'erro': resp.text[:300]}
        return resp.json()


correios = CorreiosClient()
