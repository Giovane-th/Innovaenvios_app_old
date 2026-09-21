import React from 'react';
import { UserPlus, Calculator, TrendingUp } from 'lucide-react';
import { howItWorks } from '../mock';

const iconMap = { UserPlus, Calculator, TrendingUp };

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="inn-section bg-gradient-to-b from-[#EAF1FF]/40 to-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Usar a In&apos;Nova Envios é muito <span className="inn-text-gradient">simples</span>
          </h2>
          <p className="mt-3 text-lg text-slate-600">Em 3 passos você já está enviando com desconto.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-[#2A5BC7] via-[#F77820] to-[#2A5BC7] opacity-20" />

          {howItWorks.map((step, idx) => {
            const Icon = iconMap[step.icon];
            return (
              <div key={step.step} className="relative bg-white rounded-2xl p-7 border border-slate-100 inn-shadow-card text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#EAF1FF] to-[#FFF1E5] flex items-center justify-center mb-4 relative">
                  <Icon className="w-7 h-7 text-[#2A5BC7]" strokeWidth={2.2} />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#F77820] text-white text-xs font-bold flex items-center justify-center shadow-md">{idx + 1}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
