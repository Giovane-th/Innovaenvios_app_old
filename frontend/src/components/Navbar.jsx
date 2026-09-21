import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_delivery-desk-12/artifacts/76spvmi3_3D4A54DE-AC29-47B8-ABEA-5150F325A161.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'Como funciona', href: '/#como-funciona' },
    { label: 'Calcular frete', href: '/calcular' },
    { label: 'Integrações', href: '/#integracoes' },
    { label: 'Blog', href: '/#blog' },
    { label: 'Ajuda', href: '/#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={LOGO_URL} alt="In'Nova Envios" className="inn-logo-img" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-slate-700 hover:text-[#2A5BC7] transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-slate-700 hover:text-[#2A5BC7] hover:bg-[#EAF1FF]">Entrar</Button>
          </Link>
          <Link to="/cadastro">
            <Button className="inn-btn-primary rounded-full px-5">Emitir frete com desconto</Button>
          </Link>
        </div>

        <button className="lg:hidden p-2 text-slate-700" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="px-5 py-4 space-y-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-[#2A5BC7]">
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login"><Button variant="outline" className="w-full">Entrar</Button></Link>
              <Link to="/cadastro"><Button className="w-full inn-btn-primary">Emitir frete</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
