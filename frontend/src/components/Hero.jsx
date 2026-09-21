import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { CheckCircle2, Sparkles, ArrowRight, Star } from 'lucide-react';
import HeroCalculator from './HeroCalculator';

const Hero = () => {
  return (
    <section className="inn-gradient-hero relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="inn-fade-up">
            <div className="inn-stat-pill mb-6">
              <Sparkles className="w-4 h-4" />
              <span>+2,5M de envios já emitidos</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              Calcular frete e emitir com <span className="inn-text-gradient">desconto</span>
            </h1>
            <p className="mt-5 text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl">
              Venda mais com fretes <strong className="text-slate-900">até 80% mais baratos</strong> com a In&apos;Nova Envios: sem mensalidades, sem taxas escondidas. O jeito inteligente de enviar.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link to="/cadastro">
                <Button className="inn-btn-primary h-12 px-7 text-base rounded-full">
                  Emitir frete com desconto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/calcular">
                <Button className="inn-btn-outline h-12 px-7 text-base rounded-full bg-white">
                  Simular agora
                </Button>
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {[
                'Sem mensalidades ou tarifas',
                'Cadastro com CPF ou CNPJ',
                'Correios, Jadlog e Loggi',
                'Pagamento por Pix ou cartão',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#2A5BC7] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#2A5BC7] to-[#F77820]" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-[#F77820] text-[#F77820]" />)}
                  <span className="ml-1 text-sm font-semibold text-slate-900">4,8/5</span>
                </div>
                <p className="text-xs text-slate-600">Avaliado por milhares de lojistas</p>
              </div>
            </div>
          </div>

          {/* Right side - Calculator card */}
          <div className="inn-fade-up" style={{animationDelay: '0.15s'}}>
            <HeroCalculator />
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-24 w-96 h-96 bg-[#F77820]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-[#2A5BC7]/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default Hero;
