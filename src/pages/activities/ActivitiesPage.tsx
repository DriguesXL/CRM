import React, { useState, useEffect } from 'react';
import { History, Filter, Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline } from '@/components/shared/Timeline';
import { LoadingState } from '@/components/shared/LoadingState';
import { activitiesService } from '@/services/activities';
import { teamService } from '@/services/team';
import type { Activity, ActivityType, Profile } from '@/types';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState<string>('');
  const [performerFilter, setPerformerFilter] = useState<string>('');

  // Quick activity
  const [newType, setNewType] = useState<ActivityType>('call');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const [acts, members] = await Promise.all([
        activitiesService.getActivities({
          type: typeFilter || undefined,
        }),
        teamService.getMembers(),
      ]);
      setActivities(
        performerFilter
          ? acts.filter((a) => a.performed_by === performerFilter)
          : acts
      );
      setTeam(members.map((m) => m.profile));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [typeFilter, performerFilter]);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;
    setSubmitting(true);
    try {
      await activitiesService.createActivity({
        type: newType,
        description: newDesc,
      });
      setNewDesc('');
      fetchActivities();
    } catch (e) {
      console.error(e);
      alert('Erro ao registrar atividade');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Atividades & Histórico</h1>
        <p className="text-sm text-slate-500">
          Feed cronológico de todos os contatos e atendimentos realizados pela equipe.
        </p>
      </div>

      {/* Quick Add Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-slate-900">
            Registrar Interação Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateActivity} className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(['call', 'whatsapp', 'meeting', 'email', 'note', 'proposal'] as ActivityType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                    newType === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type === 'call' && '📞 Ligação'}
                  {type === 'whatsapp' && '💬 WhatsApp'}
                  {type === 'meeting' && '📅 Reunião'}
                  {type === 'email' && '✉️ E-mail'}
                  {type === 'note' && '📝 Nota'}
                  {type === 'proposal' && '🚀 Proposta'}
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Descreva a atividade ou anotação importante..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
            />

            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>Publicar no Feed</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-44"
        >
          <option value="">Tipo: Todos</option>
          <option value="call">Ligações</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="meeting">Reuniões</option>
          <option value="email">E-mails</option>
          <option value="proposal">Propostas</option>
          <option value="note">Notas</option>
        </Select>

        <Select
          value={performerFilter}
          onChange={(e) => setPerformerFilter(e.target.value)}
          className="w-48"
        >
          <option value="">Membro: Todos</option>
          {team.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name}
            </option>
          ))}
        </Select>
      </div>

      {/* Timeline List */}
      {loading ? (
        <LoadingState message="Carregando histórico de atividades..." />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Timeline activities={activities} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
