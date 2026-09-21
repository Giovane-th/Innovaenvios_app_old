import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../mock';

const Testimonials = () => {
  return (
    <section className="inn-section bg-gradient-to-b from-white to-[#FFF1E5]/30">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Mais de <span className="inn-text-gradient">2,5M</span> de envios e nota 4,8/5
          </h2>
          <p className="mt-3 text-lg text-slate-600">O que nossos clientes dizem sobre nós</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 inn-shadow-card flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F77820] text-[#F77820]" />
                ))}
                <span className="ml-2 text-xs text-slate-500">{t.date}</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">Cliente In&apos;Nova</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
