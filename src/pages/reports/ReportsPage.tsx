import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, Award, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { reportsService } from '@/services/reports';
import { formatCurrency } from '@/lib/formatters';

export const ReportsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsService.getReportsData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <LoadingState message="Calculando relatórios de desempenho..." />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios de Vendas</h1>
        <p className="text-sm text-slate-500">
          Análise aprofundada de resultados, faturamento e produtividade comercial.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Faturamento Concluído
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.totalWonValue)}</div>
            <div className="text-xs text-slate-500 mt-1">{data.wonCount} contratos fechados</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ticket Médio
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.averageTicket)}</div>
            <div className="text-xs text-slate-500 mt-1">por cliente convertido</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ciclo de Vendas
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.avgCycleDays} dias</div>
            <div className="text-xs text-slate-500 mt-1">da criação ao fechamento</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Oportunidades em Aberto
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.openCount}</div>
            <div className="text-xs text-slate-500 mt-1">negociações ativas</div>
          </CardContent>
        </Card>
      </div>

      {/* Seller Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-600" />
            <span>Ranking Comercial da Equipe</span>
          </CardTitle>
          <p className="text-xs text-slate-500">
            Acompanhe o faturamento e aproveitamento de cada consultor
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Consultor / Vendedor</th>
                  <th className="px-6 py-3.5">Vendas Ganhas</th>
                  <th className="px-6 py-3.5">Perdidas</th>
                  <th className="px-6 py-3.5">Total Faturado</th>
                  <th className="px-6 py-3.5 text-right">Taxa de Conversão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.sellerPerformance.map((seller: any) => (
                  <tr key={seller.seller} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs">
                        {seller.seller[0]}
                      </div>
                      <span>{seller.seller}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{seller.wonCount} ganhas</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="destructive">{seller.lostCount} perdidas</Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatCurrency(seller.totalValue)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-blue-600">
                      {seller.conversion}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
