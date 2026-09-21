import React from 'react';
import { mediaMentions } from '../mock';
import { Quote } from 'lucide-react';

const MediaMentions = () => {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">In&apos;Nova Envios na Mídia</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {mediaMentions.map((m) => (
            <div key={m.source} className="flex gap-3 items-start p-5 rounded-xl bg-slate-50 hover:bg-[#EAF1FF] transition-colors">
              <Quote className="w-7 h-7 text-[#2A5BC7] flex-shrink-0" />
              <div>
                <p className="text-slate-800 font-medium leading-snug">&ldquo;{m.quote}&rdquo;</p>
                <p className="mt-2 text-xs font-semibold text-[#F77820] uppercase tracking-wider">{m.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaMentions;
