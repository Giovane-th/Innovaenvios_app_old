import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Package2, Calculator, Loader2 } from 'lucide-react';
import { weights, carriers } from '../mock';
import { useToast } from '../hooks/use-toast';

const formatCEP = (v) => v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');

const HeroCalculator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('Até 300g');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const handleCalc = (e) => {
    e.preventDefault();
    if (origin.replace(/\D/g, '').length !== 8 || destination.replace(/\D/g, '').length !== 8) {
      toast({ title: 'CEP inválido', description: 'Informe os CEPs de origem e destino completos (8 dígitos).' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const wIndex = weights.indexOf(weight);
      const factor = 1 + wIndex * 0.18;
      const computed = carriers.map((c) => ({ ...c, price: +(c.price * factor).toFixed(2), originalPrice: +(c.price * factor * (100 / (100 - c.discount))).toFixed(2) }));
      setResults(computed);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 inn-shadow-card p-6 sm:p-8 max-w-md mx-auto lg:ml-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-[#EAF1FF] flex items-center justify-center">
          <Calculator className="w-5 h-5 text-[#2A5BC7]" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">Simule seu frete</h3>
          <p className="text-xs text-slate-500">Rápido, grátis e sem cadastro</p>
        </div>
      </div>

      {!results ? (
        <form onSubmit={handleCalc} className="space-y-4">
          <div>
            <Label htmlFor="origin" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">CEP de origem</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input id="origin" placeholder="00000-000" value={origin} onChange={(e) => setOrigin(formatCEP(e.target.value))} className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#2A5BC7]" />
            </div>
          </div>
          <div>
            <Label htmlFor="destination" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">CEP de destino</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F77820]" />
              <Input id="destination" placeholder="00000-000" value={destination} onChange={(e) => setDestination(formatCEP(e.target.value))} className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#2A5BC7]" />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Peso</Label>
            <Select value={weight} onValueChange={setWeight}>
              <SelectTrigger className="h-11 mt-1.5 bg-slate-50 border-slate-200">
                <Package2 className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {weights.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full inn-btn-primary h-12 rounded-full text-sm uppercase tracking-wide">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculando...</> : 'Calcular frete com desconto'}
          </Button>
          <p className="text-[11px] text-slate-500 text-center">* Preço simulado. O valor final pode variar conforme dimensões.</p>
        </form>
      ) : (
        <div className="space-y-3">
          <button onClick={() => setResults(null)} className="text-xs text-[#2A5BC7] font-semibold hover:underline">&larr; Nova simulação</button>
          <p className="text-xs text-slate-500">Resultados para pacote de {weight.toLowerCase()}</p>
          {results.map((c) => (
            <div key={c.name} className="flex items-center justify-between bg-slate-50 hover:bg-[#EAF1FF] transition-colors rounded-xl p-3 border border-slate-100">
              <div>
                <p className="font-semibold text-sm text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.deliveryDays}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 line-through">R$ {c.originalPrice.toFixed(2).replace('.', ',')}</p>
                <p className="font-bold text-[#2A5BC7]">R$ {c.price.toFixed(2).replace('.', ',')}</p>
                <span className="text-[10px] font-semibold bg-[#FFF1E5] text-[#DD6210] px-1.5 py-0.5 rounded">-{c.discount}%</span>
              </div>
            </div>
          ))}
          <Button className="w-full inn-btn-primary h-11 rounded-full mt-2" onClick={() => window.location.href = '/cadastro'}>Emitir com desconto</Button>
        </div>
      )}
    </div>
  );
};

export default HeroCalculator;
