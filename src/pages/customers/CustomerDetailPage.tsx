import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  Plus,
  Send,
  Edit2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Timeline } from '@/components/shared/Timeline';
import { LoadingState } from '@/components/shared/LoadingState';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';
import { customersService } from '@/services/customers';
import { activitiesService } from '@/services/activities';
import { dealsService } from '@/services/deals';
import { formatCurrency, formatPhone, formatDate } from '@/lib/formatters';
import type { Customer, Activity, Deal, ActivityType } from '@/types';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // New activity state
  const [activityType, setActivityType] = useState<ActivityType>('call');
  const [activityDesc, setActivityDesc] = useState('');
  const [submittingAct, setSubmittingAct] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, act, allDeals] = await Promise.all([
        customersService.getCustomerById(id),
        activitiesService.getActivities({ customer_id: id }),
        dealsService.getDeals(),
      ]);
      setCustomer(c);
      setActivities(act);
      setDeals(allDeals.filter((d) => d.customer_id === id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Carregando dados do cliente..." />;
  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Cliente não encontrado.</p>
        <Button variant="outline" onClick={() => navigate('/customers')} className="mt-4">
          Voltar aos Clientes
        </Button>
      </div>
    );
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDesc.trim()) return;
    setSubmittingAct(true);
    try {
      await activitiesService.createActivity({
        customer_id: customer.id,
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/customers')} className="gap-2 text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar aos Clientes</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-1.5">
            <Edit2 className="h-3.5 w-3.5" />
            <span>Editar Cliente</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Profile Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
              {customer.company && (
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span>{customer.company}</span>
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3.5 text-sm">
              {customer.document && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">CNPJ / CPF</span>
                  <div className="font-mono text-slate-800 text-xs mt-0.5">{customer.document}</div>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-center gap-2 text-slate-700 text-xs">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{formatPhone(customer.phone)}</span>
                </div>
              )}

              {customer.whatsapp && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <span>WhatsApp: {formatPhone(customer.whatsapp)}</span>
                </div>
              )}

              {customer.email && (
                <div className="flex items-center gap-2 text-slate-700 text-xs">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-500 text-xs pt-2 border-t border-slate-100">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Cliente desde: {formatDate(customer.created_at)}</span>
              </div>

              {customer.notes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Observações</span>
                  <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md whitespace-pre-wrap">
                    {customer.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deals Associated */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span>Oportunidades & Contratos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">Nenhuma oportunidade vinculada</p>
              ) : (
                <div className="space-y-2">
                  {deals.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => navigate('/pipeline')}
                      className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs space-y-1"
                    >
                      <div className="font-semibold text-slate-800">{d.title}</div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>{d.stage?.name || 'Etapa'}</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(d.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interaction Form & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                Registrar Atendimento / Reunião
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddActivity} className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(['call', 'whatsapp', 'meeting', 'email', 'note'] as ActivityType[]).map((type) => (
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
                      {type === 'meeting' && '📅 Reunião'}
                      {type === 'email' && '✉️ E-mail'}
                      {type === 'note' && '📝 Nota'}
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Descreva o atendimento realizado..."
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  rows={3}
                />

                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={submittingAct} className="gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    <span>Salvar Atendimento</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                Linha do Tempo de Relacionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>

      <CustomerFormModal
        isOpen={isEditOpen}
        initialData={customer}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(c) => {
          setCustomer(c);
          loadData();
        }}
      />
    </div>
  );
};
