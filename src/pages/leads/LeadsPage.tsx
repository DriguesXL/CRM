import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  MoreVertical,
  Trash2,
  CheckCircle2,
  ExternalLink,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingState } from '@/components/shared/LoadingState';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { leadsService } from '@/services/leads';
import { sourcesService } from '@/services/sources';
import { teamService } from '@/services/team';
import { formatCurrency, formatPhone } from '@/lib/formatters';
import type { Lead, LeadStatus, LeadSource, Profile } from '@/types';

const statusBadgeMap: Record<LeadStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'purple' }> = {
  new: { label: 'Novo', variant: 'info' },
  contacted: { label: 'Contatado', variant: 'secondary' },
  qualified: { label: 'Qualificado', variant: 'purple' },
  proposal: { label: 'Proposta', variant: 'warning' },
  negotiation: { label: 'Negociação', variant: 'default' },
  won: { label: 'Ganho', variant: 'success' },
  lost: { label: 'Perdido', variant: 'destructive' },
};

export const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [assignedFilter, setAssignedFilter] = useState<string>('');

  const [sources, setSources] = useState<LeadSource[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadsService.getLeads({
        search: search || undefined,
        status: (statusFilter as LeadStatus) || undefined,
        source_id: sourceFilter || undefined,
        assigned_to: assignedFilter || undefined,
      });
      setLeads(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sourcesService.getSources().then(setSources);
    teamService.getMembers().then((m) => setTeam(m.map((i) => i.profile)));
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, sourceFilter, assignedFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente excluir este lead?')) return;
    try {
      await leadsService.deleteLead(id);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir lead');
    }
  };

  const handleConvert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Converter este lead em cliente?')) return;
    try {
      const cust = await leadsService.convertLeadToCustomer(id);
      alert('Lead convertido em cliente com sucesso!');
      navigate(`/customers/${cust.id}`);
    } catch (err) {
      console.error(err);
      alert('Erro ao converter lead');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-sm text-slate-500">
            Acompanhe e gerencie todos os potenciais clientes da sua base.
          </p>
        </div>
        <Button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} className="gap-1.5 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Novo Lead</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, empresa, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          >
            <option value="">Status: Todos</option>
            <option value="new">Novo</option>
            <option value="contacted">Contatado</option>
            <option value="qualified">Qualificado</option>
            <option value="proposal">Proposta</option>
            <option value="negotiation">Negociação</option>
            <option value="won">Ganho</option>
            <option value="lost">Perdido</option>
          </Select>

          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-36"
          >
            <option value="">Origem: Todas</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          <Select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="w-40"
          >
            <option value="">Vendedor: Todos</option>
            {team.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <LoadingState message="Carregando leads..." />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="Nenhum lead encontrado"
          description="Cadastre um novo lead para começar a organizar suas negociações."
          actionLabel="Cadastrar Primeiro Lead"
          onAction={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Nome / Empresa</th>
                <th className="px-6 py-3.5">Contato</th>
                <th className="px-6 py-3.5">Origem</th>
                <th className="px-6 py-3.5">Valor Estimado</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Responsável</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{lead.name}</div>
                    {lead.company && (
                      <div className="text-xs text-slate-500">{lead.company}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-xs">
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{formatPhone(lead.phone)}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{lead.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">
                      {lead.source?.name || 'Não informada'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      {lead.potential_value ? formatCurrency(lead.potential_value) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusBadgeMap[lead.status]?.variant || 'default'}>
                      {statusBadgeMap[lead.status]?.label || lead.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                        {lead.assigned_user?.full_name ? lead.assigned_user.full_name[0] : 'U'}
                      </div>
                      <span className="text-xs font-medium text-slate-700">
                        {lead.assigned_user?.full_name || 'Não atribuído'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Converter em Cliente"
                        onClick={(e) => handleConvert(lead.id, e)}
                        className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Excluir"
                        onClick={(e) => handleDelete(lead.id, e)}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        initialData={editingLead}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSuccess={() => {
          fetchLeads();
        }}
      />
    </div>
  );
};
