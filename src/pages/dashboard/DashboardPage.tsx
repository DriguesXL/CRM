import React, { useEffect, useState } from 'react';
import {
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { dashboardService, type DashboardMetrics, type ChartDataPoint } from '@/services/dashboard';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [funnel, setFunnel] = useState<ChartDataPoint[]>([]);
  const [sources, setSources] = useState<ChartDataPoint[]>([]);
  const [sellerSales, setSellerSales] = useState<ChartDataPoint[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [m, f, s, sl, act] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getPipelineFunnel(),
        dashboardService.getLeadsBySource(),
        dashboardService.getSalesBySeller(),
        dashboardService.getRecentActivities(5),
      ]);
      setMetrics(m);
      setFunnel(f);
      setSources(s);
      setSellerSales(sl);
      setActivities(act);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <LoadingState message="Carregando métricas em tempo real..." />;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de Vendas</h1>
          <p className="text-sm text-slate-500">
            Acompanhe o desempenho de vendas, leads e follow-ups em tempo real.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/pipeline')} className="gap-1.5 shadow-2xs">
            <Target className="h-4 w-4" />
            <span>Ver Pipeline</span>
          </Button>
          <Button onClick={() => navigate('/leads')} className="gap-1.5 shadow-xs">
            <Users className="h-4 w-4" />
            <span>Gerenciar Leads</span>
          </Button>
        </div>
      </div>

      {/* Follow-up Alerts */}
      {(metrics.followupsOverdue > 0 || metrics.followupsToday > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.followupsOverdue > 0 && (
            <div
              onClick={() => navigate('/tasks')}
              className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50/70 text-red-900 cursor-pointer hover:bg-red-50 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {metrics.followupsOverdue} {metrics.followupsOverdue === 1 ? 'follow-up atrasado' : 'follow-ups atrasados'}!
                  </div>
                  <div className="text-xs text-red-700">Contate esses clientes para não perder vendas.</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-red-600" />
            </div>
          )}

          {metrics.followupsToday > 0 && (
            <div
              onClick={() => navigate('/tasks')}
              className="flex items-center justify-between p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 cursor-pointer hover:bg-blue-50 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {metrics.followupsToday} {metrics.followupsToday === 1 ? 'tarefa agendada para hoje' : 'tarefas agendadas para hoje'}
                  </div>
                  <div className="text-xs text-blue-700">Veja sua lista de prioridades do dia.</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </div>
          )}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total de Leads
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.totalLeads}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="info">{metrics.newLeads} novos</Badge>
              <span className="text-xs text-slate-400">aguardando contato</span>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pipeline Aberto
            </CardTitle>
            <Target className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.openDealsValue)}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{metrics.openDealsCount}</span> oportunidades em negociação
            </div>
          </CardContent>
        </Card>

        {/* Won Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vendas Fechadas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.wonDealsValue)}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <Badge variant="success">{metrics.wonDealsCount} vendas</Badge>
              <span className="text-slate-400">no período</span>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metrics.conversionRate}%</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-slate-500">dos leads qualificados viram clientes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Funil do Pipeline de Vendas
            </CardTitle>
            <p className="text-xs text-slate-500">Oportunidades distribuídas por etapa</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel}>
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${value} deals (${formatCurrency(item.payload.amount || 0)})`,
                      'Quantidade',
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {funnel.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leads by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Leads por Origem
            </CardTitle>
            <p className="text-xs text-slate-500">Canais que mais geram contatos</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              {sources.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">
                  Nenhum lead cadastrado ainda
                </div>
              ) : (
                sources.map((s, idx) => {
                  const total = sources.reduce((acc, curr) => acc + curr.value, 0);
                  const percent = total > 0 ? Math.round((s.value / total) * 100) : 0;
                  return (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{s.name}</span>
                        <span className="text-slate-500">{s.value} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: COLORS[idx % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seller Performance & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Seller */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Desempenho por Vendedor
            </CardTitle>
            <p className="text-xs text-slate-500">Volume fechado por membro da equipe</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-1">
              {sellerSales.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">
                  Nenhuma venda fechada ainda pela equipe
                </div>
              ) : (
                sellerSales.map((seller) => (
                  <div key={seller.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs">
                        {seller.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{seller.name}</div>
                        <div className="text-xs text-slate-500">{seller.value} vendas concluídas</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">
                        {formatCurrency(seller.amount || 0)}
                      </div>
                      <div className="text-[11px] text-slate-400">faturado</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Atividades Recentes
              </CardTitle>
              <p className="text-xs text-slate-500">Últimas interações registradas</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/activities')} className="text-xs">
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">
                  Nenhuma atividade registrada ainda
                </div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 capitalize">{act.type}</span>
                        <span className="text-slate-400">{formatDateTime(act.performed_at)}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{act.description}</p>
                      {act.performer && (
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Por: {act.performer.full_name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
