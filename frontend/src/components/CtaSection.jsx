import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Shield, Zap, Award } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="inn-section">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E429F] via-[#2A5BC7] to-[#3970E0] p-10 lg:p-16">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#F77820]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Conquiste clientes e venda mais com <span className="text-[#FFD43B]">frete barato</span>
              </h2>
              <p className="mt-4 text-white/85 text-lg">
                Cadastre-se gratuitamente e comece a economizar agora mesmo. Sem mensalidades, sem surpresas.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link to="/cadastro">
                  <Button className="inn-btn-primary h-12 px-7 rounded-full text-base">
                    Emitir frete com desconto <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/calcular">
                  <Button className="h-12 px-7 rounded-full text-base bg-white text-[#2A5BC7] hover:bg-slate-100 font-semibold">
                    Simular agora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {[
                { icon: Shield, title: '100% seguro', desc: 'Pagamento protegido' },
                { icon: Zap, title: 'Em minutos', desc: 'Cadastro rápido' },
                { icon: Award, title: 'Avaliado 4,8/5', desc: 'Por milhares de lojistas' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#FFD43B] text-[#1E429F] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="text-sm text-white/75">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
