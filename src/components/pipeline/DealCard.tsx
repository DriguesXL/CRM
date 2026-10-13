import React from 'react';
import { DollarSign, User, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { Deal, PipelineStage } from '@/types';

interface DealCardProps {
  deal: Deal;
  stages: PipelineStage[];
  onMove: (dealId: string, stageId: string) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  stages,
  onMove,
  onEdit,
  onDelete,
}) => {
  const currentStageIndex = stages.findIndex((s) => s.id === deal.stage_id);
  const prevStage = currentStageIndex > 0 ? stages[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;

  return (
    <div
      onClick={() => onEdit(deal)}
      className="group relative rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-blue-300 hover:shadow-xs cursor-pointer space-y-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {deal.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deal.id);
          }}
          className="text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          title="Excluir negócio"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {deal.customer && (
        <div className="text-xs text-slate-500 font-medium truncate">
          {deal.customer.name} {deal.customer.company ? `• ${deal.customer.company}` : ''}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="text-sm font-bold text-slate-900">
          {formatCurrency(deal.value)}
        </div>

        {deal.assigned_user && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700"
            title={deal.assigned_user.full_name}
          >
            {deal.assigned_user.full_name[0]}
          </div>
        )}
      </div>

      {/* Stage Shift Buttons */}
      <div
        className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {prevStage ? (
          <button
            onClick={() => onMove(deal.id, prevStage.id)}
            className="flex items-center text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
            title={`Mover para ${prevStage.name}`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        ) : (
          <div />
        )}

        {nextStage && (
          <button
            onClick={() => onMove(deal.id, nextStage.id)}
            className="flex items-center text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors ml-auto"
            title={`Avançar para ${nextStage.name}`}
          >
            <span>Avançar</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
