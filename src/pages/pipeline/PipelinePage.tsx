import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/shared/LoadingState';
import { DealCard } from '@/components/pipeline/DealCard';
import { DealFormModal } from '@/components/pipeline/DealFormModal';
import { dealsService } from '@/services/deals';
import { pipelineStagesService } from '@/services/pipelineStages';
import { teamService } from '@/services/team';
import { formatCurrency } from '@/lib/formatters';
import type { Deal, PipelineStage, Profile } from '@/types';

export const PipelinePage: React.FC = () => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [targetStageId, setTargetStageId] = useState<string | undefined>(undefined);

  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const [st, d, members] = await Promise.all([
        pipelineStagesService.getStages(),
        dealsService.getDeals(),
        teamService.getMembers(),
      ]);
      setStages(st);
      setDeals(d);
      setTeam(members.map((m) => m.profile));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  const handleMoveDeal = async (dealId: string, stageId: string) => {
    // Optimistic UI update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage_id: stageId } : d))
    );
    try {
      await dealsService.moveDeal(dealId, stageId);
    } catch (e) {
      console.error(e);
      loadPipeline();
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Deseja excluir esta oportunidade?')) return;
    try {
      await dealsService.deleteDeal(dealId);
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir negócio');
    }
  };

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.customer?.name && d.customer.name.toLowerCase().includes(search.toLowerCase()));
    const matchesSeller = !sellerFilter || d.assigned_to === sellerFilter;
    return matchesSearch && matchesSeller;
  });

  const totalPipelineValue = filteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  if (loading) return <LoadingState message="Carregando pipeline de vendas..." />;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pipeline de Vendas</h1>
          <p className="text-sm text-slate-500">
            Acompanhe suas oportunidades em cada estágio até o fechamento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span>Total: {formatCurrency(totalPipelineValue)}</span>
          </div>

          <Button
            onClick={() => {
              setSelectedDeal(null);
              setTargetStageId(stages[0]?.id);
              setIsModalOpen(true);
            }}
            className="gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Oportunidade</span>
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por negócio ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={sellerFilter}
          onChange={(e) => setSellerFilter(e.target.value)}
          className="w-48"
        >
          <option value="">Vendedor: Todos</option>
          {team.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name}
            </option>
          ))}
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-[calc(100vh-250px)]">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage_id === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

            return (
              <div
                key={stage.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedDealId) {
                    handleMoveDeal(draggedDealId, stage.id);
                    setDraggedDealId(null);
                  }
                }}
                className="flex flex-col w-72 rounded-xl bg-slate-100/70 border border-slate-200 p-3 h-full"
              >
                {/* Stage Header */}
                <div className="flex flex-col pb-3 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: stage.color || '#3b82f6' }}
                      />
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {stage.name}
                      </span>
                    </div>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-1">
                    {formatCurrency(stageTotal)}
                  </div>
                </div>

                {/* Deals List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDraggedDealId(deal.id)}
                    >
                      <DealCard
                        deal={deal}
                        stages={stages}
                        onMove={handleMoveDeal}
                        onEdit={(d) => {
                          setSelectedDeal(d);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteDeal}
                      />
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      Nenhum negócio nesta etapa
                    </div>
                  )}
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => {
                    setSelectedDeal(null);
                    setTargetStageId(stage.id);
                    setIsModalOpen(true);
                  }}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-white transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Negócio</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <DealFormModal
        isOpen={isModalOpen}
        initialData={selectedDeal}
        defaultStageId={targetStageId}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDeal(null);
        }}
        onSuccess={() => {
          loadPipeline();
        }}
      />
    </div>
  );
};
