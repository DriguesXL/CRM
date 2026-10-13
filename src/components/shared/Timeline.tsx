import React from 'react';
import type { Activity } from '@/types';
import { Phone, Mail, MessageSquare, Calendar, FileText, Send, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '@/lib/formatters';

const iconMap: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4 text-blue-600" />,
  email: <Mail className="h-4 w-4 text-purple-600" />,
  whatsapp: <MessageSquare className="h-4 w-4 text-emerald-600" />,
  meeting: <Calendar className="h-4 w-4 text-amber-600" />,
  note: <FileText className="h-4 w-4 text-slate-600" />,
  proposal: <Send className="h-4 w-4 text-indigo-600" />,
};

const badgeBgMap: Record<string, string> = {
  call: 'bg-blue-50 border-blue-100',
  email: 'bg-purple-50 border-purple-100',
  whatsapp: 'bg-emerald-50 border-emerald-100',
  meeting: 'bg-amber-50 border-amber-100',
  note: 'bg-slate-50 border-slate-100',
  proposal: 'bg-indigo-50 border-indigo-100',
};

const typeLabelMap: Record<string, string> = {
  call: 'Ligação',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  meeting: 'Reunião',
  note: 'Nota',
  proposal: 'Proposta',
};

export const Timeline: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-400">
        Nenhuma atividade registrada ainda.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {activities.map((act) => (
        <div key={act.id} className="relative flex items-start gap-4">
          <div
            className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-xs ${
              badgeBgMap[act.type] || 'border-slate-200'
            }`}
          >
            {iconMap[act.type] || <CheckCircle2 className="h-3 w-3 text-slate-500" />}
          </div>
          <div className="flex-1 bg-white p-3.5 rounded-lg border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {typeLabelMap[act.type] || act.type}
              </span>
              <span className="text-xs text-slate-400">{formatDateTime(act.performed_at)}</span>
            </div>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{act.description}</p>
            {act.performer && (
              <p className="mt-2 text-xs text-slate-400">
                Por: <span className="font-medium text-slate-600">{act.performer.full_name}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
