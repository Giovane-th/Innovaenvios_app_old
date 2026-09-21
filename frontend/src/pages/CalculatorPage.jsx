import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AppShell from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapPin, Package2, Loader2, Calculator, Ruler, Weight, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { weights } from '../mock';
import { useToast } from '../hooks/use-toast';
import { calcularFrete, criarEnvio, walletSaldo } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const formatCEP = (v) => v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');

const weightToGrams = (label) => {
  if (label === 'Até 300g') return 300;
  const kg = parseInt(label.replace('kg', ''), 10);
  return kg * 1000;
};

const CalculatorPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState('calc'); // 'calc' | 'emit'
  const [form, setForm] = useState({
    origin: '', destination: '', weightLabel: 'Até 300g',
    length: '16', width: '11', height: '2',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);

  // Emit form
  const [emitForm, setEmitForm] = useState({
    recipient_name: '', recipient_doc: '', recipient_phone: '',
    endereco_destino: '', cidade_destino: '', uf_destino: '',
  });
  const [emitLoading, setEmitLoading] = useState(false);

  const handleCalc = async (e) => {
    e.preventDefault();
    if (form.origin.replace(/\D/g, '').length !== 8 || form.destination.replace(/\D/g, '').length !== 8) {
      toast({ title: 'CEP inválido', description: 'Insira CEPs com 8 dígitos.' });
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const payload = {
        cep_origem: form.origin.replace(/\D/g, ''),
        cep_destino: form.destination.replace(/\D/g, ''),
        peso_g: weightToGrams(form.weightLabel),
        comprimento: parseFloat(form.length) || 16,
        largura: parseFloat(form.width) || 11,
        altura: parseFloat(form.height) || 2,
      };
      const data = await calcularFrete(payload);
      const validos = (data.resultados || []).filter((r) => !r.erro && r.valor > 0);
      if (validos.length === 0) {
        toast({ title: 'Sem opções disponíveis', description: 'Verifique os CEPs ou dimensões informados.' });
      }
      setResults(validos.sort((a, b) => a.valor - b.valor));
    } catch (err) {
      toast({ title: 'Erro ao calcular', description: err?.response?.data?.detail || 'Tente novamente em instantes.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEscolher = (r) => {
    if (!user) {
      toast({ title: 'Faça login para continuar', description: 'Crie sua conta gratuitamente e ganhe R$ 5.' });
      navigate('/cadastro');
      return;
    }
    setSelected(r);
    setStep('emit');
  };

  const handleEmit = async (e) => {
    e.preventDefault();
    if (!emitForm.recipient_name || !emitForm.endereco_destino || !emitForm.cidade_destino || !emitForm.uf_destino) {
      toast({ title: 'Preencha os dados do destinatário' });
      return;
    }
    setEmitLoading(true);
    try {
      const payload = {
        recipient_name: emitForm.recipient_name,
        recipient_doc: emitForm.recipient_doc || null,
        recipient_phone: emitForm.recipient_phone || null,
        cep_origem: form.origin.replace(/\D/g, ''),
        cep_destino: form.destination.replace(/\D/g, ''),
        endereco_destino: emitForm.endereco_destino,
        cidade_destino: emitForm.cidade_destino,
        uf_destino: emitForm.uf_destino.toUpperCase().slice(0, 2),
        peso_g: weightToGrams(form.weightLabel),
        comprimento: parseFloat(form.length) || 16,
        largura: parseFloat(form.width) || 11,
        altura: parseFloat(form.height) || 2,
        servico: selected.codigo,
        servico_nome: selected.nome,
        valor: selected.valor,
      };
      await criarEnvio(payload);
      await refreshUser();
      toast({ title: 'Envio criado!', description: `R$ ${selected.valor.toFixed(2).replace('.', ',')} debitados da sua carteira.` });
      navigate('/envios');
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Tente novamente.';
      if (err?.response?.status === 402) {
        toast({ title: 'Saldo insuficiente', description: detail });
        setTimeout(() => navigate('/carteira'), 1500);
      } else {
        toast({ title: 'Erro ao emitir envio', description: detail });
      }
    } finally {
      setEmitLoading(false);
    }
  };

  // ---------------- RENDER ----------------
  const calculatorForm = (
    <div className="bg-white rounded-3xl p-7 border border-slate-100 inn-shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#EAF1FF] flex items-center justify-center">
          <Calculator className="w-6 h-6 text-[#2A5BC7]" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-slate-900">Dados do envio</h2>
          <p className="text-sm text-slate-500">Preencha origem, destino e dimensões</p>
        </div>
      </div>
      <form onSubmit={handleCalc} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase font-semibold text-slate-700 tracking-wide">CEP origem</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A5BC7]" />
              <Input value={form.origin} onChange={(e)=>setForm({...form, origin: formatCEP(e.target.value)})} placeholder="00000-000" className="pl-9 h-11" />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase font-semibold text-slate-700 tracking-wide">CEP destino</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F77820]" />
              <Input value={form.destination} onChange={(e)=>setForm({...form, destination: formatCEP(e.target.value)})} placeholder="00000-000" className="pl-9 h-11" />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs uppercase font-semibold text-slate-700 tracking-wide flex items-center gap-1"><Weight className="w-3 h-3" /> Peso</Label>
          <Select value={form.weightLabel} onValueChange={(v)=>setForm({...form, weightLabel: v})}>
            <SelectTrigger className="h-11 mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              {weights.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase font-semibold text-slate-700 tracking-wide flex items-center gap-1"><Ruler className="w-3 h-3" /> Dimensões (cm)</Label>
          <div className="grid grid-cols-3 gap-3 mt-1.5">
            <Input placeholder="Comp." value={form.length} onChange={(e)=>setForm({...form, length: e.target.value})} className="h-11" />
            <Input placeholder="Larg." value={form.width} onChange={(e)=>setForm({...form, width: e.target.value})} className="h-11" />
            <Input placeholder="Alt." value={form.height} onChange={(e)=>setForm({...form, height: e.target.value})} className="h-11" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full inn-btn-primary h-12 rounded-full mt-2">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Consultando Correios...</> : 'Calcular frete com desconto'}
        </Button>
      </form>
    </div>
  );

  const resultsCard = (
    <div className="bg-white rounded-3xl p-7 border border-slate-100 inn-shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#FFF1E5] flex items-center justify-center">
          <Package2 className="w-6 h-6 text-[#F77820]" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-slate-900">Resultado da simulação</h2>
          <p className="text-sm text-slate-500">Escolha a melhor opção para você</p>
        </div>
      </div>

      {!results && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
          <Package2 className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">Preencha o formulário ao lado para ver os preços disponíveis.</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#2A5BC7]" />
          <p className="text-sm">Consultando os Correios em tempo real...</p>
        </div>
      )}

      {results && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
          <p className="font-semibold text-slate-700">Nenhum serviço disponível</p>
          <p className="text-sm text-slate-500 mt-1">Verifique os CEPs informados.</p>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((c, i) => (
            <div key={c.codigo} className={`rounded-xl p-4 border ${i===0 ? 'border-[#F77820] bg-[#FFF1E5]/40' : 'border-slate-100 bg-slate-50'} hover:bg-[#EAF1FF] transition-colors flex items-center justify-between gap-3`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900">{c.nome}</p>
                  {i === 0 && <span className="text-[10px] font-bold bg-[#F77820] text-white px-2 py-0.5 rounded-full">MELHOR PREÇO</span>}
                </div>
                <p className="text-xs text-slate-500">{c.prazo_dias ? `Entrega em até ${c.prazo_dias} dia(s) útil(eis)` : 'Prazo a confirmar'}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-xl text-[#2A5BC7]">R$ {Number(c.valor).toFixed(2).replace('.', ',')}</p>
                <Button onClick={() => handleEscolher(c)} className="inn-btn-primary h-8 px-3 rounded-full text-xs mt-1">Escolher</Button>
              </div>
            </div>
          ))}
          <div className="bg-[#EAF1FF] rounded-xl p-4 mt-4 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2A5BC7] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700">Valores consultados em tempo real na API CWS dos Correios. O valor será debitado da sua carteira.</p>
          </div>
        </div>
      )}
    </div>
  );

  const emitView = selected && (
    <div className="bg-white rounded-3xl p-7 border border-slate-100 inn-shadow-card max-w-2xl mx-auto">
      <button onClick={()=>setStep('calc')} className="flex items-center text-sm text-slate-500 hover:text-[#2A5BC7] mb-5">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para resultados
      </button>
      <div className="flex items-center justify-between bg-gradient-to-r from-[#EAF1FF] to-[#FFF1E5] rounded-xl p-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Serviço escolhido</p>
          <p className="font-bold text-slate-900">{selected.nome}</p>
          <p className="text-xs text-slate-500">{selected.prazo_dias} dia(s) útil(eis)</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Valor</p>
          <p className="font-extrabold text-2xl text-[#2A5BC7]">R$ {Number(selected.valor).toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      <h3 className="font-bold text-lg text-slate-900 mb-4">Dados do destinatário</h3>
      <form onSubmit={handleEmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Nome completo *</Label>
            <Input value={emitForm.recipient_name} onChange={(e)=>setEmitForm({...emitForm, recipient_name: e.target.value})} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label>CPF/CNPJ</Label>
            <Input value={emitForm.recipient_doc} onChange={(e)=>setEmitForm({...emitForm, recipient_doc: e.target.value})} className="mt-1.5 h-11" placeholder="000.000.000-00" />
          </div>
        </div>
        <div>
          <Label>Telefone</Label>
          <Input value={emitForm.recipient_phone} onChange={(e)=>setEmitForm({...emitForm, recipient_phone: e.target.value})} className="mt-1.5 h-11" placeholder="(00) 00000-0000" />
        </div>
        <div>
          <Label>Endereço completo *</Label>
          <Input value={emitForm.endereco_destino} onChange={(e)=>setEmitForm({...emitForm, endereco_destino: e.target.value})} className="mt-1.5 h-11" placeholder="Rua, número, complemento" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label>Cidade *</Label>
            <Input value={emitForm.cidade_destino} onChange={(e)=>setEmitForm({...emitForm, cidade_destino: e.target.value})} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label>UF *</Label>
            <Input value={emitForm.uf_destino} onChange={(e)=>setEmitForm({...emitForm, uf_destino: e.target.value})} className="mt-1.5 h-11 uppercase" maxLength={2} />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p><strong>Atenção:</strong> ao confirmar, R$ {Number(selected.valor).toFixed(2).replace('.', ',')} serão debitados da sua carteira. Saldo atual: <strong>R$ {(user?.saldo || 0).toFixed(2).replace('.', ',')}</strong>.</p>
        </div>

        <Button type="submit" disabled={emitLoading} className="w-full inn-btn-primary h-12 rounded-full">
          {emitLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Emitindo...</> : `Confirmar e debitar R$ ${Number(selected.valor).toFixed(2).replace('.', ',')}`}
        </Button>
      </form>
    </div>
  );

  // Página com layout logado vs deslogado
  if (user) {
    return (
      <AppShell title="Novo envio" subtitle="Calcule e emita seu frete">
        {step === 'calc' ? (
          <div className="grid lg:grid-cols-2 gap-6">{calculatorForm}{resultsCard}</div>
        ) : emitView}
      </AppShell>
    );
  }

  // Layout público (não logado) — mantém Navbar + Footer
  return (
    <div>
      <Navbar />
      <main className="bg-gradient-to-b from-[#EAF1FF]/40 to-white py-12 lg:py-16 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-10">
            <span className="inn-stat-pill">Calculadora In&apos;Nova</span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
              Simule seu <span className="inn-text-gradient">frete</span> em segundos
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Compare valores entre serviços dos Correios com desconto.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">{calculatorForm}{resultsCard}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalculatorPage;
