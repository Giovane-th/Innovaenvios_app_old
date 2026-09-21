import React from 'react';
import { Instagram, Linkedin, Youtube, Twitter, Facebook } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_delivery-desk-12/artifacts/76spvmi3_3D4A54DE-AC29-47B8-ABEA-5150F325A161.png';

const Footer = () => {
  return (
    <footer className="bg-[#0B1B3A] text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2">
            <img src={LOGO_URL} alt="In'Nova Envios" className="h-14 mb-5" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              O jeito inteligente de enviar. A plataforma nº 1 para calcular e emitir fretes com desconto no Brasil. Sem mensalidades, sem burocracia.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Linkedin, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F77820] flex items-center justify-center transition-colors" aria-label="social">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Sobre</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#F77820]">Como funciona</a></li>
              <li><a href="#" className="hover:text-[#F77820]">Integre seu site</a></li>
              <li><a href="#" className="hover:text-[#F77820]">Convide e ganhe</a></li>
              <li><a href="#" className="hover:text-[#F77820]">Trabalhe conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Conhecimento</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#F77820]">Ferramentas grátis</a></li>
              <li><a href="#" className="hover:text-[#F77820]">Blog e conteúdos</a></li>
              <li><a href="#" className="hover:text-[#F77820]">Histórias de sucesso</a></li>
              <li><a href="#" className="hover:text-[#F77820]">Central de ajuda</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Fale com a gente</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:suporte@innovaenvios.com.br" className="hover:text-[#F77820] break-all">suporte@innovaenvios.com.br</a></li>
              <li><a href="mailto:parcerias@innovaenvios.com.br" className="hover:text-[#F77820] break-all">parcerias@innovaenvios.com.br</a></li>
              <li className="text-slate-500 pt-2">Termos de Uso</li>
              <li className="text-slate-500">Política de Privacidade</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 In&apos;Nova Envios. Todos os direitos reservados.</p>
          <p>Av. Paulista, 1234 - Bela Vista, São Paulo - SP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
