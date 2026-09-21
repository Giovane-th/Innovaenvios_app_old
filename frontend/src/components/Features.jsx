import React from 'react';
import { Smartphone, Percent, Package, Plug, Headphones } from 'lucide-react';
import { features } from '../mock';

const iconMap = { Smartphone, Percent, Package, Plug, Headphones };

const Features = () => {
  return (
    <section id="integracoes" className="inn-section bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            A In&apos;Nova Envios facilita o frete para <span className="inn-text-gradient">você</span>
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">Tudo que você precisa para enviar seus pedidos com eficiência e economia.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => {
            const Icon = iconMap[f.icon];
            const isWide = idx === 4;
            return (
              <div key={f.title} className={`group bg-white rounded-2xl p-6 border border-slate-100 inn-shadow-card ${isWide ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <div className="w-14 h-14 rounded-xl bg-[#EAF1FF] flex items-center justify-center mb-4 group-hover:bg-[#FFF1E5] transition-colors">
                  <Icon className="w-6 h-6 text-[#2A5BC7] group-hover:text-[#F77820] transition-colors" strokeWidth={2.2} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
