import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signup({
        companyName,
        fullName,
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message);
      } else if (res.needsConfirmation) {
        alert('Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.');
        navigate('/login');
      } else {
        alert('Cadastro realizado! Acesse seu CRM.');
        navigate('/');
      }
    } catch (err) {
      setError('Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xl shadow-md">
            LF
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Criar Conta no LeadFlow</h1>
          <p className="text-sm text-slate-500">
            Comece seu teste grátis de 14 dias sem compromisso.
          </p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Dados da Empresa e Acesso</CardTitle>
            <CardDescription className="text-xs">
              Preencha para configurar o workspace da sua equipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Nome da Empresa</label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    placeholder="Ex: Prime Consultoria"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Seu Nome Completo</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    placeholder="Ex: Carlos Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Seu E-mail Corporativo</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    placeholder="carlos@suaempresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Senha Segura</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="Pelo menos 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? 'Criando Conta...' : 'Começar Agora'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Já possui conta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};
