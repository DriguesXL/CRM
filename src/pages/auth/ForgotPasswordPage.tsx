import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase, isDemoMode } from '@/lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (!isDemoMode()) {
        await supabase.auth.resetPasswordForEmail(email);
      }
      setSent(true);
    } catch (e) {
      console.error(e);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xl shadow-md">
            LF
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recuperar Senha</h1>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Redefinição de Acesso</CardTitle>
            <CardDescription className="text-xs">
              Informe seu e-mail para receber as instruções de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-3 py-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="font-semibold text-slate-900 text-sm">Instruções enviadas!</h3>
                <p className="text-xs text-slate-500">
                  Verifique sua caixa de entrada para redefinir sua senha com segurança.
                </p>
                <Link to="/login" className="inline-block mt-4">
                  <Button variant="outline" size="sm">
                    Voltar ao Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Seu E-mail</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>

                <div className="text-center pt-2">
                  <Link to="/login" className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Voltar para Login</span>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
