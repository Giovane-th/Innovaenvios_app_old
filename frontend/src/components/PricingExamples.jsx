import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import { pricingExamples } from '../mock';

const PricingExamples = () => {
  return (
    <section className="inn-section bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="inn-stat-pill">Até 80% de desconto</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Envie para <span className="inn-text-gradient">todo o Brasil</span>
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Veja quanto você pode economizar em algumas das rotas mais comuns:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pricingExamples.map((p) => (
            <div key={p.from + p.to} className="bg-white border border-slate-100 rounded-2xl p-6 inn-shadow-card">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <MapPin className="w-4 h-4 text-[#2A5BC7]" />
                <span>Rota</span>
              </div>
              <p className="font-bold text-slate-900 text-lg leading-snug">
                {p.from}
                <span className="block text-xs font-normal text-slate-500 my-1">para</span>
                {p.to}
              </p>
              <div className="mt-5 pt-5 border-t border-dashed border-slate-200 space-y-1">
                <p className="text-sm text-slate-500">De: <span className="line-through">R$ {p.originalPrice.toFixed(2).replace('.', ',')}</span> sem desconto</p>
                <p className="text-sm text-slate-700">Por: <span className="font-extrabold text-2xl text-[#F77820]">R$ {p.discountPrice.toFixed(2).replace('.', ',')}</span></p>
                <p className="text-xs text-slate-500">com In&apos;Nova Envios</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 text-center mt-6 max-w-2xl mx-auto">
          *Simulação de frete realizada para pacotes de 2x11x16cm e 0,3kg. Sujeito a alteração.
        </p>

        <div className="text-center mt-10">
          <Link to="/cadastro">
            <Button className="inn-btn-primary h-12 px-7 rounded-full">
              Emitir frete com desconto
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingExamples;
