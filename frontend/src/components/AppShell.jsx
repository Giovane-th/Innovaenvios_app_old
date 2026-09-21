import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Home, FileText, Wallet, BarChart3, Settings, LogOut, Bell, Plus, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_delivery-desk-12/artifacts/76spvmi3_3D4A54DE-AC29-47B8-ABEA-5150F325A161.png';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/envios', icon: Package, label: 'Envios' },
  { to: '/calcular', icon: FileText, label: 'Novo envio' },
  { to: '/carteira', icon: Wallet, label: 'Carteira' },
];

const AppShell = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  const Sidebar = ({ onItemClick }) => (
    <aside className="flex flex-col h-full bg-white border-r border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <Link to="/"><img src={LOGO_URL} alt="In'Nova Envios" className="h-12" /></Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={onItemClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#EAF1FF] text-[#2A5BC7]' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          <BarChart3 className="w-4 h-4" /> Relatórios
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Settings className="w-4 h-4" /> Configurações
        </button>
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2A5BC7] to-[#F77820] flex items-center justify-center text-white font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-[#F77820]" title="Sair"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 z-10">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white">
            <Sidebar onItemClick={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between px-5 lg:px-8 h-16 gap-3">
            <button className="lg:hidden p-2 text-slate-700" onClick={() => setOpen(true)} aria-label="Menu"><Menu className="w-5 h-5" /></button>
            <div className="hidden lg:block">
              <h1 className="font-bold text-lg text-slate-900">{title || `Olá, ${user.name?.split(' ')[0] || ''}`}</h1>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Link to="/carteira" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF1FF] text-[#2A5BC7] hover:bg-[#dbe6fd] transition-colors text-sm font-semibold">
                <Wallet className="w-4 h-4" /> R$ {(user.saldo || 0).toFixed(2).replace('.', ',')}
              </Link>
              <button className="relative p-2 text-slate-600 hover:text-[#2A5BC7]">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F77820] rounded-full" />
              </button>
              <Link to="/calcular">
                <Button className="inn-btn-primary rounded-full h-10 px-4 sm:px-5">
                  <Plus className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Novo envio</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
