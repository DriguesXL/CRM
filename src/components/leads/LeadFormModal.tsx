import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { leadsService } from '@/services/leads';
import { sourcesService } from '@/services/sources';
import { teamService } from '@/services/team';
import type { Lead, LeadSource, Profile } from '@/types';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
  initialData?: Lead | null;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [potentialValue, setPotentialValue] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sourcesService.getSources().then(setSources);
      teamService.getMembers().then((members) => setTeam(members.map((m) => m.profile)));

      if (initialData) {
        setName(initialData.name);
        setCompany(initialData.company || '');
        setPhone(initialData.phone || '');
        setEmail(initialData.email || '');
        setPotentialValue(initialData.potential_value ? String(initialData.potential_value) : '');
        setSourceId(initialData.source_id || '');
        setAssignedTo(initialData.assigned_to || '');
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setCompany('');
        setPhone('');
        setEmail('');
        setPotentialValue('');
        setSourceId('');
        setAssignedTo('');
        setNotes('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (initialData) {
        const updated = await leadsService.updateLead(initialData.id, {
          name,
          company: company || null,
          phone: phone || null,
          email: email || null,
          potential_value: potentialValue ? Number(potentialValue) : null,
          source_id: sourceId || null,
          assigned_to: assignedTo || null,
          notes: notes || null,
        });
        onSuccess(updated);
      } else {
        const created = await leadsService.createLead({
          name,
          company: company || null,
          phone: phone || null,
          email: email || null,
          potential_value: potentialValue ? Number(potentialValue) : null,
          source_id: sourceId || null,
          assigned_to: assignedTo || null,
          notes: notes || null,
        });
        onSuccess(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Nome do Lead *</label>
            <Input
              required
              placeholder="Ex: Roberto Almeida"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Empresa</label>
            <Input
              placeholder="Ex: Comercial Silva Ltda"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Telefone / WhatsApp</label>
              <Input
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">E-mail</label>
              <Input
                type="email"
                placeholder="contato@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Valor Estimado (R$)</label>
              <Input
                type="number"
                placeholder="15000"
                value={potentialValue}
                onChange={(e) => setPotentialValue(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Origem do Lead</label>
              <Select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="mt-1"
              >
                <option value="">Selecione...</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Responsável</label>
            <Select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1"
            >
              <option value="">Selecione um vendedor...</option>
              {team.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Observações</label>
            <Textarea
              placeholder="Detalhes sobre a conversa, necessidades..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Criar Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
