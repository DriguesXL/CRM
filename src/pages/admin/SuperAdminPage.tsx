import React, { useState } from 'react';
import { ShieldCheck, Building2, Users, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

interface TenantOrg {
  id: string;
  name: string;
  plan: string;
  usersCount: number;
  leadsCount: number;
  dealsCount: number;
  status: 'active' | 'suspended';
  mrr: number;
  created_at: string;
}

const mockTenants: TenantOrg[] = [
  {
    id: 'org-1',
    name: 'TechStar Soluções',
    plan: 'Pro (R$ 297/mês)',
    usersCount: 8,
    leadsCount: 145,
    dealsCount: 32,
    status: 'active',
    mrr: 297,
    created_at: '15/01/2024',
  },
  {
    id: 'org-2',
    name: 'Alpha Contabilidade & BPO',
    plan: 'Pro (R$ 297/mês)',
    usersCount: 5,
    leadsCount: 89,
    dealsCount: 19,
    status: 'active',
    mrr: 297,
    created_at: '02/02/2024',
  },
  {
    id: 'org-3',
    name: 'Nexus Logística e Transportes',
    plan: 'Basic (R$ 147/mês)',
    usersCount: 3,
    leadsCount: 42,
    dealsCount: 11,
    status: 'active',
    mrr: 147,
    created_at: '10/03/2024',
  },
  {
    id: 'org-4',
    name: 'Bella Cosméticos Distribuição',
    plan: 'Pro (R$ 297/mês)',
    usersCount: 6,
    leadsCount: 210,
    dealsCount: 45,
    status: 'active',
    mrr: 297,
    created_at: '18/04/2024',
  },
];

export const SuperAdminPage: React.FC = () => {
  const [tenants, setTenants] = useState<TenantOrg[]>(mockTenants);

  const toggleStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' }
          : t
      )
    );
  };

  const totalMRR = tenants.filter((t) => t.status === 'active').reduce((sum, t) => sum + t.mrr, 0);
  const totalUsers = tenants.reduce((sum, t) => sum + t.usersCount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>Painel Master do SaaS</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Super Admin LeadFlow</h1>
        <p className="text-sm text-slate-500">
          Visão geral de todas as empresas assinantes da plataforma.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              MRR (Receita Recorrente)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalMRR)}/mês</div>
            <div className="text-xs text-slate-500 mt-1">Total faturado em assinaturas ativas</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total de Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{tenants.length}</div>
            <div className="text-xs text-slate-500 mt-1">organizações cadastradas</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Usuários Ativos no Sistema
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
            <div className="text-xs text-slate-500 mt-1">vendedores e gestores ativos</div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Empresas Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Empresa</th>
                  <th className="px-6 py-3.5">Plano</th>
                  <th className="px-6 py-3.5">Usuários</th>
                  <th className="px-6 py-3.5">Leads Cadastrados</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Criada em</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{t.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="purple">{t.plan}</Badge>
                    </td>
                    <td className="px-6 py-4">{t.usersCount} contas</td>
                    <td className="px-6 py-4">{t.leadsCount} leads</td>
                    <td className="px-6 py-4">
                      {t.status === 'active' ? (
                        <Badge variant="success">Ativa</Badge>
                      ) : (
                        <Badge variant="destructive">Suspensa</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{t.created_at}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant={t.status === 'active' ? 'outline' : 'default'}
                        onClick={() => toggleStatus(t.id)}
                        className="text-xs h-8"
                      >
                        {t.status === 'active' ? 'Suspender' : 'Reativar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
