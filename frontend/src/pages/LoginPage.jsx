import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_delivery-desk-12/artifacts/76spvmi3_3D4A54DE-AC29-47B8-ABEA-5150F325A161.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Preencha todos os campos' });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Login realizado!', description: 'Bem-vindo de volta à In\'Nova Envios.' });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Erro ao entrar', description: err?.response?.data?.detail || 'Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1E429F] via-[#2A5BC7] to-[#3970E0] text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-10 w-72 h-72 bg-[#F77820]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <Link to="/" className="relative z-10"><img src={LOGO_URL} alt="In'Nova Envios" className="h-16" /></Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight">O jeito inteligente de enviar.</h2>
          <p className="mt-4 text-white/85 text-lg max-w-md">Acesse sua conta e continue economizando até 80% em seus fretes pelo Brasil.</p>
          <ul className="mt-8 space-y-3 text-white/90">
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#FFD43B]" /> Carteira com Pix ou cartão</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#FFD43B]" /> Correios direto da plataforma</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#FFD43B]" /> Suporte humanizado</li>
          </ul>
        </div>
        <p className="relative z-10 text-sm text-white/60">© 2025 In&apos;Nova Envios</p>
      </div>

      <div className="flex flex-col p-6 sm:p-10 lg:p-12 bg-white">
        <Link to="/" className="flex items-center text-sm text-slate-500 hover:text-[#2A5BC7] mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o site
        </Link>
        <div className="lg:hidden mb-8"><img src={LOGO_URL} alt="In'Nova Envios" className="h-12" /></div>

        <div className="max-w-md w-full mx-auto lg:mx-0 flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Entrar na sua conta</h1>
          <p className="mt-2 text-slate-600">Bem-vindo de volta! Insira seus dados para continuar.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="email" type="email" placeholder="voce@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="pl-9 h-11" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} className="pl-9 pr-10 h-11" />
                <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" /> Lembrar de mim
              </label>
              <a href="#" className="text-[#2A5BC7] font-semibold hover:text-[#F77820]">Esqueci a senha</a>
            </div>
            <Button type="submit" disabled={loading} className="w-full inn-btn-primary h-12 rounded-full">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</> : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Ainda não tem conta? <Link to="/cadastro" className="font-semibold text-[#2A5BC7] hover:text-[#F77820]">Crie agora grátis</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
