import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Package, Plus, Loader2 } from 'lucide-react';
import { listarEnvios } from '../lib/api';

const statusColors = {
  'Em trânsito': 'bg-blue-100 text-blue-700',
  'Entregue': 'bg-emerald-100 text-emerald-700',
  'Aguardando postagem': 'bg-amber-100 text-amber-700',
  'Cancelado': 'bg-red-100 text-red-700',
};

const ShipmentsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listarEnvios().then(setItems).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((s) =>
    s.id?.toLowerCase().includes(search.toLowerCase()) ||
    s.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.cidade_destino?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Meus envios" subtitle="Gerencie todos os seus envios">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por código, destinatário, cidade..." value={search} onChange={(e)=>setSearch(e.target.value)} className="pl-9" />
          </div>
          <Link to="/calcular"><Button className="inn-btn-primary rounded-full h-10 px-5"><Plus className="w-4 h-4 mr-1" /> Novo envio</Button></Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">Nenhum envio ainda</p>
            <p className="text-sm mt-1">Crie seu primeiro envio para começar a economizar.</p>
            <Link to="/calcular"><Button className="mt-5 inn-btn-primary rounded-full">Criar primeiro envio</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Data</th>
                  <th className="text-left px-5 py-3 font-semibold">Destinatário</th>
                  <th className="text-left px-5 py-3 font-semibold">Destino</th>
                  <th className="text-left px-5 py-3 font-semibold">Serviço</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-600 text-xs">{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
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

export default ShipmentsPage;
