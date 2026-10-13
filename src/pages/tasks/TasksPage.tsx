import React, { useState, useEffect } from 'react';
import { Plus, CheckSquare, Clock, AlertTriangle, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingState } from '@/components/shared/LoadingState';
import { tasksService } from '@/services/tasks';
import { teamService } from '@/services/team';
import { formatDate } from '@/lib/formatters';
import type { Task, TaskPriority, Profile } from '@/types';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // New task modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [allTasks, members] = await Promise.all([
        tasksService.getTasks(),
        teamService.getMembers(),
      ]);
      setTasks(allTasks);
      setTeam(members.map((m) => m.profile));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await tasksService.toggleTaskStatus(id);
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta tarefa?')) return;
    try {
      await tasksService.deleteTask(id);
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    setSubmitting(true);
    try {
      await tasksService.createTask({
        title,
        due_date: dueDate,
        due_time: dueTime || null,
        priority,
        assigned_to: assignedTo || undefined,
      });
      setIsModalOpen(false);
      setTitle('');
      setDueDate('');
      setDueTime('');
      fetchTasks();
    } catch (e) {
      console.error(e);
      alert('Erro ao agendar tarefa');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && t.due_date < todayStr);
  const todayTasks = tasks.filter((t) => t.status !== 'completed' && t.due_date === todayStr);
  const upcomingTasks = tasks.filter((t) => t.status !== 'completed' && t.due_date > todayStr);
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const priorityBadge = (p: TaskPriority) => {
    if (p === 'high') return <Badge variant="destructive">Alta</Badge>;
    if (p === 'medium') return <Badge variant="warning">Média</Badge>;
    return <Badge variant="secondary">Baixa</Badge>;
  };

  const renderTaskList = (list: Task[], emptyMsg: string) => {
    if (list.length === 0) {
      return <div className="py-4 text-xs text-slate-400 italic">{emptyMsg}</div>;
    }

    return (
      <div className="space-y-2">
        {list.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => handleToggle(task.id)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className={`text-sm font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {formatDate(task.due_date)} {task.due_time ? `às ${task.due_time}` : ''}
                  </span>
                  {task.assigned_user && (
                    <span>• {task.assigned_user.full_name}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {priorityBadge(task.priority)}
              <button
                onClick={() => handleDelete(task.id)}
                className="text-slate-300 hover:text-red-600 p-1 transition-colors"
                title="Excluir tarefa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <LoadingState message="Carregando tarefas..." />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tarefas & Follow-ups</h1>
          <p className="text-sm text-slate-500">
            Nunca esqueça de ligar para um lead ou cobrar um fechamento de proposta.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Agendar Follow-up</span>
        </Button>
      </div>

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>Atrasadas ({overdueTasks.length})</span>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
            {renderTaskList(overdueTasks, '')}
          </div>
        </div>
      )}

      {/* Today Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
          <Clock className="h-4 w-4" />
          <span>Para Hoje ({todayTasks.length})</span>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4">
          {renderTaskList(todayTasks, 'Nenhuma tarefa agendada para hoje.')}
        </div>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Calendar className="h-4 w-4 text-slate-600" />
          <span>Próximos Dias ({upcomingTasks.length})</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          {renderTaskList(upcomingTasks, 'Nenhuma tarefa agendada para os próximos dias.')}
        </div>
      </div>

      {/* Completed Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span>Concluídas ({completedTasks.length})</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          {renderTaskList(completedTasks, 'Nenhuma tarefa concluída ainda.')}
        </div>
      </div>

      {/* New Task Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Nova Tarefa / Follow-up</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">O que precisa ser feito? *</label>
              <Input
                required
                placeholder="Ex: Ligar para confirmar recebimento da proposta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Data de Vencimento *</label>
                <Input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Horário (opcional)</label>
                <Input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Prioridade</label>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="mt-1"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta (Urgente)</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Responsável</label>
                <Select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="mt-1"
                >
                  <option value="">Eu mesmo</option>
                  {team.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Agendando...' : 'Criar Follow-up'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
