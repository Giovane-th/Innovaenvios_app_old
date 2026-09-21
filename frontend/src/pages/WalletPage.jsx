import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, Gift, CreditCard, QrCode, Loader2, TrendingUp } from 'lucide-react';
import { walletSaldo, walletRecarga, walletExtrato } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const presets = [25, 50, 100, 200, 500];

const categoriaLabel = {
  bonus: { label: 'Bônus', icon: Gift, color: 'text-emerald-600 bg-emerald-50' },
  recarga: { label: 'Recarga', icon: ArrowDownLeft, color: 'text-[#2A5BC7] bg-[#EAF1FF]' },
  envio: { label: 'Envio', icon: ArrowUpRight, color: 'text-[#F77820] bg-[#FFF1E5]' },
};

const WalletPage = () => {
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [saldo, setSaldo] = useState(0);
  const [extrato, setExtrato] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [valor, setValor] = useState('50');
  const [metodo, setMetodo] = useState('pix');
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, e] = await Promise.all([walletSaldo(), walletExtrato()]);
      setSaldo(s.saldo);
      setExtrato(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRecarga = async () => {
    const v = parseFloat(String(valor).replace(',', '.'));
    if (!v || v <= 0) {
      toast({ title: 'Valor inválido' });
      return;
    }
    setProcessing(true);
    try {
      await walletRecarga(v, metodo);
      toast({ title: 'Recarga realizada!', description: `R$ ${v.toFixed(2).replace('.', ',')} adicionados à sua carteira.` });
      setOpenDialog(false);
      await refreshUser();
      await load();
    } catch (err) {
      toast({ title: 'Erro na recarga', description: err?.response?.data?.detail || 'Tente novamente.' });
    } finally { setProcessing(false); }
  };

  const totais = extrato.reduce((acc, tx) => {
    if (tx.tipo === 'credito') acc.creditos += Number(tx.valor) || 0;
    else acc.debitos += Number(tx.valor) || 0;
    return acc;
  }, { creditos: 0, debitos: 0 });

  return (
    <AppShell title="Minha Carteira" subtitle="Gerencie seu saldo e veja o histórico de movimentações">
      {/* Saldo principal */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E429F] via-[#2A5BC7] to-[#3970E0] text-white p-7">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#F77820]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider text-white/85">Saldo disponível</span>
            </div>
            <p className="text-5xl font-extrabold leading-none">
              R$ {saldo.toFixed(2).replace('.', ',')}
            </p>
            <p className="mt-2 text-white/75 text-sm">Use para emitir fretes com desconto</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => setOpenDialog(true)} className="inn-btn-primary h-11 px-5 rounded-full">
                <Plus className="w-4 h-4 mr-1" /> Adicionar saldo
              </Button>
              <Button onClick={() => window.location.href='/calcular'} className="h-11 px-5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20">
                Calcular frete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> Entradas
            </div>
            <p className="text-2xl font-extrabold text-slate-900">R$ {totais.creditos.toFixed(2).replace('.', ',')}</p>
            <p className="text-xs text-slate-500 mt-1">Total recarregado + bônus</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <ArrowUpRight className="w-4 h-4 text-[#F77820]" /> Saídas
            </div>
            <p className="text-2xl font-extrabold text-slate-900">R$ {totais.debitos.toFixed(2).replace('.', ',')}</p>
            <p className="text-xs text-slate-500 mt-1">Total gasto em envios</p>
          </div>
        </div>
      </div>

      {/* Extrato */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Extrato</h2>
            <p className="text-sm text-slate-500">Histórico completo de movimentações</p>
          </div>
          <TrendingUp className="w-5 h-5 text-slate-400" />
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : extrato.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wallet className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Nenhuma movimentação ainda</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {extrato.map((tx) => {
              const cat = categoriaLabel[tx.categoria] || { label: tx.categoria, icon: ArrowUpRight, color: 'text-slate-600 bg-slate-100' };
              const Icon = cat.icon;
              const isCred = tx.tipo === 'credito';
              return (
                <li key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{tx.descricao}</p>
                    <p className="text-xs text-slate-500">
                      {cat.label} · {new Date(tx.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isCred ? 'text-emerald-600' : 'text-[#F77820]'}`}>
                      {isCred ? '+' : '−'} R$ {Number(tx.valor).toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-slate-400">Saldo: R$ {Number(tx.saldo_apos).toFixed(2).replace('.', ',')}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Dialog Recarga */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar saldo à carteira</DialogTitle>
            <DialogDescription>Escolha o valor e o método de pagamento.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Valor (R$)</label>
              <Input type="number" min="5" step="5" value={valor} onChange={(e)=>setValor(e.target.value)} className="h-11 mt-1.5 text-lg font-bold" />
              <div className="flex flex-wrap gap-2 mt-3">
                {presets.map((v) => (
                  <button key={v} type="button" onClick={()=>setValor(String(v))} className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${String(valor)===String(v) ? 'bg-[#2A5BC7] text-white border-[#2A5BC7]' : 'border-slate-200 text-slate-700 hover:border-[#2A5BC7]'}`}>
                    R$ {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Método de pagamento</label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <button type="button" onClick={()=>setMetodo('pix')} className={`p-3 rounded-xl border-2 transition-colors text-left ${metodo==='pix' ? 'border-[#2A5BC7] bg-[#EAF1FF]' : 'border-slate-200 hover:border-slate-300'}`}>
                  <QrCode className={`w-5 h-5 mb-1 ${metodo==='pix' ? 'text-[#2A5BC7]' : 'text-slate-500'}`} />
                  <p className="font-semibold text-sm text-slate-900">Pix</p>
                  <p className="text-xs text-slate-500">Instantâneo</p>
                </button>
                <button type="button" onClick={()=>setMetodo('cartao')} className={`p-3 rounded-xl border-2 transition-colors text-left ${metodo==='cartao' ? 'border-[#2A5BC7] bg-[#EAF1FF]' : 'border-slate-200 hover:border-slate-300'}`}>
                  <CreditCard className={`w-5 h-5 mb-1 ${metodo==='cartao' ? 'text-[#2A5BC7]' : 'text-slate-500'}`} />
                  <p className="font-semibold text-sm text-slate-900">Cartão</p>
                  <p className="text-xs text-slate-500">Crédito</p>
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ⚠️ <strong>Recarga em modo simulado.</strong> A integração com Mercado Pago será ativada em breve.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleRecarga} disabled={processing} className="inn-btn-primary rounded-full px-6">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...</> : 'Recarregar agora'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default WalletPage;
