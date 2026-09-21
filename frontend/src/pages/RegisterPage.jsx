import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Lock, Phone, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_delivery-desk-12/artifacts/76spvmi3_3D4A54DE-AC29-47B8-ABEA-5150F325A161.png';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast({ title: 'Preencha os campos obrigatórios' });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: 'Senha muito curta', description: 'Mínimo 6 caracteres.' });
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone || null, password: form.password });
      toast({ title: 'Conta criada!', description: 'Você ganhou R$ 5,00 de bônus de boas-vindas 🎉' });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Erro ao cadastrar', description: err?.response?.data?.detail || 'Tente novamente.' });
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
          <h2 className="text-4xl font-extrabold leading-tight">Ganhe R$ 5 ao se cadastrar!</h2>
          <p className="mt-4 text-white/85 text-lg max-w-md">Crie sua conta gratuitamente e já comece a emitir seus primeiros fretes com desconto.</p>
          <ul className="mt-8 space-y-3 text-white/90">
            {['Bônus de R$ 5 na carteira','Cadastro com CPF ou CNPJ','Sem mensalidade ou taxas','Suporte humanizado'].map(t => (
              <li key={t} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#FFD43B]" /> {t}</li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-sm text-white/60">© 2025 In&apos;Nova Envios</p>
      </div>

      <div className="flex flex-col p-6 sm:p-10 lg:p-12 bg-white">
        <Link to="/" className="flex items-center text-sm text-slate-500 hover:text-[#2A5BC7] mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>
        <div className="lg:hidden mb-8"><img src={LOGO_URL} alt="In'Nova Envios" className="h-12" /></div>

        <div className="max-w-md w-full mx-auto lg:mx-0 flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Criar sua conta grátis</h1>
          <p className="mt-2 text-slate-600">Em menos de 2 minutos você já está emitindo fretes com desconto.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="name" placeholder="Seu nome" value={form.name} onChange={update('name')} className="pl-9 h-11" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="email" type="email" placeholder="voce@email.com" value={form.email} onChange={update('email')} className="pl-9 h-11" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="phone" placeholder="(00) 00000-0000" value={form.phone} onChange={update('phone')} className="pl-9 h-11" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Crie uma senha</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={update('password')} className="pl-9 h-11" />
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300" />
              <span>Aceito os <a href="#" className="text-[#2A5BC7] font-semibold">Termos de Uso</a> e a <a href="#" className="text-[#2A5BC7] font-semibold">Política de Privacidade</a>.</span>
            </label>
            <Button type="submit" disabled={loading} className="w-full inn-btn-primary h-12 rounded-full">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando conta...</> : 'Criar conta gratuita'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Já tem conta? <Link to="/login" className="font-semibold text-[#2A5BC7] hover:text-[#F77820]">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
