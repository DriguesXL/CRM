import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, CheckCircle2, Lock, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { LoadingState } from '@/components/shared/LoadingState';
import { teamService, type TeamMemberWithProfile } from '@/services/team';
import { usePermissions } from '@/hooks/usePermissions';
import { formatDate } from '@/lib/formatters';
import type { OrganizationRole } from '@/types';

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { canManageTeam } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('Mudar@123');
  const [employeeRole, setEmployeeRole] = useState<OrganizationRole>('seller');
  const [submitting, setSubmitting] = useState(false);

  // Success summary modal
  const [createdEmployee, setCreatedEmployee] = useState<{
    name: string;
    email: string;
    password?: string;
    role: OrganizationRole;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await teamService.getMembers();
      setMembers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeEmail.trim() || !employeeName.trim() || !employeePassword.trim()) return;
    setSubmitting(true);
    try {
      await teamService.createEmployee({
        name: employeeName,
        email: employeeEmail,
        password: employeePassword,
        role: employeeRole,
      });

      setCreatedEmployee({
        name: employeeName,
        email: employeeEmail,
        password: employeePassword,
        role: employeeRole,
      });

      setIsModalOpen(false);
      setEmployeeName('');
      setEmployeeEmail('');
      setEmployeePassword('Mudar@123');
      fetchTeam();
    } catch (e) {
      console.error(e);
      alert('Erro ao cadastrar funcionário');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Deseja revogar o acesso do funcionário ${name}?`)) return;
    try {
      await teamService.deleteMember(id);
      fetchTeam();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyAccess = () => {
    if (!createdEmployee) return;
    const text = `Acesso ao LeadFlow CRM:\nLink: ${window.location.origin}/login\nE-mail: ${createdEmployee.email}\nSenha: ${createdEmployee.password}\nCargo: ${createdEmployee.role === 'seller' ? 'Vendedor' : createdEmployee.role === 'manager' ? 'Gerente' : 'Administrador'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const roleBadge = (r: OrganizationRole) => {
    if (r === 'admin') return <Badge variant="default">Administrador</Badge>;
    if (r === 'manager') return <Badge variant="purple">Gerente</Badge>;
    return <Badge variant="secondary">Vendedor</Badge>;
  };

  if (loading) return <LoadingState message="Carregando equipe..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Equipe Comercial</h1>
          <p className="text-sm text-slate-500">
            Cadastre seus vendedores e gerentes para que cada um acesse o CRM com sua própria conta.
          </p>
        </div>
        {canManageTeam() && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 shadow-xs">
            <UserPlus className="h-4 w-4" />
            <span>Cadastrar Funcionário</span>
          </Button>
        )}
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start gap-3">
        <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-blue-950">Como funciona o acesso dos funcionários:</span>
          <p className="text-blue-800">
            Ao cadastrar um funcionário com e-mail, senha e cargo, ele poderá acessar diretamente a tela de login. Vendedores têm visão de seus próprios leads e tarefas, enquanto gerentes e administradores acompanham todo o pipeline.
          </p>
        </div>
      </div>

      {/* Team Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Nome / Colaborador</th>
              <th className="px-6 py-3.5">E-mail de Login</th>
              <th className="px-6 py-3.5">Cargo / Nível</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Cadastrado em</th>
              <th className="px-6 py-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs">
                      {m.profile.full_name ? m.profile.full_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-slate-900">{m.profile.full_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{m.profile.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{roleBadge(m.role)}</td>
                <td className="px-6 py-4">
                  <Badge variant="success">Ativo</Badge>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {formatDate(m.joined_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  {members.length > 1 && (
                    <button
                      onClick={() => handleDeleteMember(m.id, m.profile.full_name)}
                      className="text-slate-300 hover:text-red-600 transition-colors p-1"
                      title="Revogar Acesso"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Employee Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
            <DialogDescription className="text-xs">
              Crie a conta de acesso para um membro da sua equipe comercial
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Nome Completo *</label>
              <Input
                required
                placeholder="Ex: Amanda Silva"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">E-mail Profissional (Login) *</label>
              <Input
                type="email"
                required
                placeholder="amanda@empresa.com.br"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Senha Inicial de Acesso *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  required
                  placeholder="Mudar@123"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  className="pl-9"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                O funcionário poderá utilizar esta senha para entrar no sistema.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Nível de Acesso (Cargo) *</label>
              <Select
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value as OrganizationRole)}
                className="mt-1"
              >
                <option value="seller">Vendedor (visualiza seus leads, clientes e tarefas)</option>
                <option value="manager">Gerente (relatórios gerais, equipe e pipeline total)</option>
                <option value="admin">Administrador (controle completo da empresa e equipe)</option>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Criando conta...' : 'Cadastrar e Liberar Acesso'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Account Created Success Modal */}
      {createdEmployee && (
        <Dialog open={true} onOpenChange={() => setCreatedEmployee(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-bold text-sm">Conta Criada com Sucesso!</span>
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Acesso do Funcionário {createdEmployee.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Copie os dados de acesso abaixo para entregar ao funcionário:
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 font-mono">
              <div>
                <span className="text-slate-400">Link de Acesso: </span>
                <span className="text-slate-900 font-semibold">{window.location.origin}/login</span>
              </div>
              <div>
                <span className="text-slate-400">E-mail: </span>
                <span className="text-slate-900 font-semibold">{createdEmployee.email}</span>
              </div>
              <div>
                <span className="text-slate-400">Senha: </span>
                <span className="text-slate-900 font-semibold">{createdEmployee.password}</span>
              </div>
              <div>
                <span className="text-slate-400">Cargo: </span>
                <span className="text-slate-900 font-semibold">
                  {createdEmployee.role === 'seller' ? 'Vendedor' : createdEmployee.role === 'manager' ? 'Gerente' : 'Administrador'}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-2 flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyAccess}
                className="gap-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Dados de Acesso'}</span>
              </Button>
              <Button type="button" onClick={() => setCreatedEmployee(null)}>
                Concluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
