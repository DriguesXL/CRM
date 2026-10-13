import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error.message || 'Credenciais inválidas.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Erro ao efetuar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xl shadow-md">
            LF
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">LeadFlow CRM</h1>
          <p className="text-sm text-slate-500 max-w-xs">
            Acesse seu espaço de trabalho comercial.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Acesse sua conta</CardTitle>
            <CardDescription className="text-xs">
              Entre com o e-mail fornecido pelo administrador da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">E-mail de Acesso</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    placeholder="seu.email@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Senha</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Validando acesso...' : 'Entrar no Sistema'}
              </Button>
            </form>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Acesso para Funcionários e Administrador:</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Funcionários utilizam o e-mail e senha cadastrados pelo gestor na aba <strong>Equipe</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Signup Link */}
        <p className="text-center text-xs text-slate-500">
          É o proprietário e quer cadastrar sua empresa?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Criar nova empresa
          </Link>
        </p>
      </div>
    </div>
  );
};
