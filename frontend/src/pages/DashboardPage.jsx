import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, DollarSign, Truck, TrendingUp, Plus, Wallet, ArrowRight } from 'lucide-react';
import { listarEnvios, enviosStats, walletSaldo } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  'Em trânsito': 'bg-blue-100 text-blue-700',
  'Entregue': 'bg-emerald-100 text-emerald-700',
  'Aguardando postagem': 'bg-amber-100 text-amber-700',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, em_transito: 0, entregues: 0, economia_total: 0, taxa_entrega: 0 });
  const [envios, setEnvios] = useState([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([enviosStats(), listarEnvios(), walletSaldo()]).then(([s, e, w]) => {
      setStats(s);
      setEnvios(e.slice(0, 5));
      setSaldo(w.saldo);
    }).catch(() => {});
  }, [user]);

  if (!user) return null;

  const cards = [
    { label: 'Envios totais', value: stats.total, change: '', icon: Package, color: 'bg-[#EAF1FF] text-[#2A5BC7]' },
    { label: 'Saldo na carteira', value: `R$ ${saldo.toFixed(2).replace('.', ',')}`, change: '', icon: Wallet, color: 'bg-[#FFF1E5] text-[#F77820]' },
    { label: 'Em trânsito', value: stats.em_transito, change: '', icon: Truck, color: 'bg-amber-50 text-amber-600' },
    { label: 'Taxa de entrega', value: `${stats.taxa_entrega}%`, change: '', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <AppShell title={`Olá, ${user.name.split(' ')[0]} 👋`} subtitle="Veja o resumo dos seus envios">
      {/* Welcome / saldo card */}
      {stats.total === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E429F] via-[#2A5BC7] to-[#3970E0] text-white p-6 lg:p-8">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#F77820]/30 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <Badge className="bg-[#FFD43B] text-[#1E429F] border-0 font-bold mb-3">Bônus de boas-vindas</Badge>
              <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight">Você tem R$ {saldo.toFixed(2).replace('.', ',')} de crédito!</h2>
              <p className="mt-2 text-white/85">Use para emitir seu primeiro frete com desconto. Calcule agora mesmo:</p>
              <div className="mt-5 flex gap-3 flex-wrap">
                <Link to="/calcular"><Button className="inn-btn-primary rounded-full h-11 px-5">Calcular frete <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
                <Link to="/carteira"><Button className="h-11 px-5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20">Recarregar carteira</Button></Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Package className="w-32 h-32 opacity-30 ml-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Últimos envios</h2>
            <p className="text-sm text-slate-500">Acompanhe seus envios recentes</p>
          </div>
          <Link to="/envios" className="text-sm font-semibold text-[#2A5BC7] hover:text-[#F77820] inline-flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {envios.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">Nenhum envio ainda</p>
            <p className="text-sm mt-1">Crie seu primeiro envio agora mesmo!</p>
            <Link to="/calcular"><Button className="mt-5 inn-btn-primary rounded-full"><Plus className="w-4 h-4 mr-1" /> Criar envio</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Destinatário</th>
                  <th className="text-left px-5 py-3 font-semibold">Destino</th>
                  <th className="text-left px-5 py-3 font-semibold">Serviço</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {envios.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-900 font-medium">{s.recipient_name}</td>
                    <td className="px-5 py-4 text-slate-600">{s.cidade_destino}/{s.uf_destino}</td>
                    <td className="px-5 py-4 text-slate-600">{s.servico_nome || s.servico}</td>
                    <td className="px-5 py-4"><Badge className={`${statusColors[s.status] || 'bg-slate-100 text-slate-700'} border-0 font-medium`}>{s.status}</Badge></td>
                    <td className="px-5 py-4 text-right font-bold text-slate-900">R$ {Number(s.valor).toFixed(2).replace('.', ',')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default DashboardPage;
