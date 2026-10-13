import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dealsService } from '@/services/deals';
import { pipelineStagesService } from '@/services/pipelineStages';
import { customersService } from '@/services/customers';
import { teamService } from '@/services/team';
import type { Deal, PipelineStage, Customer, Profile } from '@/types';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deal: Deal) => void;
  initialData?: Deal | null;
  defaultStageId?: string;
}

export const DealFormModal: React.FC<DealFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  defaultStageId,
}) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [stageId, setStageId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [notes, setNotes] = useState('');

  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      pipelineStagesService.getStages().then(setStages);
      customersService.getCustomers().then(setCustomers);
      teamService.getMembers().then((m) => setTeam(m.map((i) => i.profile)));

      if (initialData) {
        setTitle(initialData.title);
        setValue(String(initialData.value || ''));
        setCustomerId(initialData.customer_id || '');
        setStageId(initialData.stage_id);
        setAssignedTo(initialData.assigned_to || '');
        setExpectedCloseDate(initialData.expected_close_date || '');
        setNotes(initialData.notes || '');
      } else {
        setTitle('');
        setValue('');
        setCustomerId('');
        setStageId(defaultStageId || '');
        setAssignedTo('');
        setExpectedCloseDate('');
        setNotes('');
      }
    }
  }, [isOpen, initialData, defaultStageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      if (initialData) {
        const updated = await dealsService.updateDeal(initialData.id, {
          title,
          value: Number(value) || 0,
          customer_id: customerId || null,
          stage_id: stageId || stages[0]?.id,
          assigned_to: assignedTo || null,
          expected_close_date: expectedCloseDate || null,
          notes: notes || null,
        });
        onSuccess(updated);
      } else {
        const created = await dealsService.createDeal({
          title,
          value: Number(value) || 0,
          customer_id: customerId || null,
          stage_id: stageId || stages[0]?.id,
          assigned_to: assignedTo || null,
          expected_close_date: expectedCloseDate || null,
          notes: notes || null,
        });
        onSuccess(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar oportunidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Título do Negócio *</label>
            <Input
              required
              placeholder="Ex: Contrato Anual - Loja Central"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Valor (R$)</label>
              <Input
                type="number"
                placeholder="25000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Etapa do Pipeline</label>
              <Select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="mt-1"
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Cliente Vinculado</label>
            <Select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1"
            >
              <option value="">Sem cliente ou prospect novo</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Responsável</label>
              <Select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="mt-1"
              >
                <option value="">Selecione...</option>
                {team.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Previsão Fechamento</label>
              <Input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Notas / Condições</label>
            <Textarea
              placeholder="Descreva detalhes da proposta..."
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
              {loading ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Criar Oportunidade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
