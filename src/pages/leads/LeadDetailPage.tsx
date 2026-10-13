import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Send,
  MessageSquare,
  Clock,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Timeline } from '@/components/shared/Timeline';
import { LoadingState } from '@/components/shared/LoadingState';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { leadsService } from '@/services/leads';
import { activitiesService } from '@/services/activities';
import { tasksService } from '@/services/tasks';
import { formatCurrency, formatPhone, formatDate } from '@/lib/formatters';
import type { Lead, Activity, Task, LeadStatus, ActivityType } from '@/types';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // New activity form
  const [activityType, setActivityType] = useState<ActivityType>('call');
  const [activityDesc, setActivityDesc] = useState('');
  const [submittingAct, setSubmittingAct] = useState(false);

  // New task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [l, act, t] = await Promise.all([
        leadsService.getLeadById(id),
        activitiesService.getActivities({ lead_id: id }),
        tasksService.getTasks({ lead_id: id }),
      ]);
      setLead(l);
      setActivities(act);
      setTasks(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Carregando detalhes do lead..." />;
  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Lead não encontrado.</p>
        <Button variant="outline" onClick={() => navigate('/leads')} className="mt-4">
          Voltar para Leads
        </Button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    try {
      const updated = await leadsService.updateLead(lead.id, { status: newStatus });
      setLead(updated);
      await activitiesService.createActivity({
        lead_id: lead.id,
        type: 'note',
        description: `Status alterado para ${newStatus}`,
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDesc.trim()) return;
    setSubmittingAct(true);
    try {
      await activitiesService.createActivity({
        lead_id: lead.id,
        type: activityType,
        description: activityDesc,
      });
      setActivityDesc('');
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingAct(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDate) return;
    setSubmittingTask(true);
    try {
      await tasksService.createTask({
        lead_id: lead.id,
        title: taskTitle,
        due_date: taskDate,
        priority: 'high',
      });
      setTaskTitle('');
      setTaskDate('');
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await tasksService.toggleTaskStatus(taskId);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvert = async () => {
    if (!confirm('Deseja converter este lead em um cliente?')) return;
    try {
      const cust = await leadsService.convertLeadToCustomer(lead.id);
      navigate(`/customers/${cust.id}`);
    } catch (e) {
      console.error(e);
      alert('Erro ao converter');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Excluir este lead permanentemente?')) return;
    try {
      await leadsService.deleteLead(lead.id);
      navigate('/leads');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/leads')} className="gap-2 text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar aos Leads</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="gap-1.5">
            <Edit2 className="h-3.5 w-3.5" />
            <span>Editar</span>
          </Button>
          <Button size="sm" onClick={handleConvert} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>Converter em Cliente</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
                  {lead.company && (
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{lead.company}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status Atual
                </label>
                <Select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                  className="mt-1"
                >
                  <option value="new">Novo</option>
                  <option value="contacted">Contatado</option>
                  <option value="qualified">Qualificado</option>
                  <option value="proposal">Proposta</option>
                  <option value="negotiation">Negociação</option>
                  <option value="won">Ganho</option>
                  <option value="lost">Perdido</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Valor Estimado
                </label>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {lead.potential_value ? formatCurrency(lead.potential_value) : 'Não informado'}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                {lead.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{formatPhone(lead.phone)}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Cadastrado em: {formatDate(lead.created_at)}</span>
                </div>
              </div>

              {lead.notes && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Observações
                  </label>
                  <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md whitespace-pre-wrap">
                    {lead.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Follow-up Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Follow-ups e Tarefas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddTask} className="space-y-2">
                <Input
                  placeholder="Novo follow-up..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="text-xs"
                />
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="text-xs flex-1"
                  />
                  <Button type="submit" size="sm" disabled={submittingTask} className="text-xs">
                    Agendar
                  </Button>
                </div>
              </form>

              <div className="space-y-2 pt-2">
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">Nenhuma tarefa pendente</p>
                ) : (
                  tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTask(t.id)}
                      className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.status === 'completed'}
                          onChange={() => {}}
                          className="rounded text-blue-600"
                        />
                        <span className={t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(t.due_date)}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activities & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Register Activity Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                Registrar Atividade / Interação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddActivity} className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(['call', 'whatsapp', 'email', 'meeting', 'note'] as ActivityType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActivityType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                        activityType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type === 'call' && '📞 Ligação'}
                      {type === 'whatsapp' && '💬 WhatsApp'}
                      {type === 'email' && '✉️ E-mail'}
                      {type === 'meeting' && '📅 Reunião'}
                      {type === 'note' && '📝 Nota'}
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Resuma como foi o contato ou anote informações relevantes..."
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  rows={3}
                />

                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={submittingAct} className="gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    <span>Salvar Interação</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                Histórico de Contatos & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <LeadFormModal
        isOpen={isEditModalOpen}
        initialData={lead}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          setLead(updated);
          loadData();
        }}
      />
    </div>
  );
};
