import { LocalStore } from './storage';
import { isDemoMode, supabase } from '@/lib/supabase';
import type { Deal, Lead, Task, Activity } from '@/types';

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  openDealsCount: number;
  openDealsValue: number;
  wonDealsCount: number;
  wonDealsValue: number;
  conversionRate: number;
  followupsToday: number;
  followupsOverdue: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  amount?: number;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const leads: Lead[] = isDemoMode() ? LocalStore.getLeads() : (await supabase.from('leads').select('*')).data || [];
    const deals: Deal[] = isDemoMode() ? LocalStore.getDeals() : (await supabase.from('deals').select('*, stage:pipeline_stages(*)')).data || [];
    const tasks: Task[] = isDemoMode() ? LocalStore.getTasks() : (await supabase.from('tasks').select('*')).data || [];

    const todayStr = new Date().toISOString().split('T')[0];

    const openDeals = deals.filter((d) => !d.stage?.is_won && !d.stage?.is_lost);
    const wonDeals = deals.filter((d) => d.stage?.is_won);
    const lostDeals = deals.filter((d) => d.stage?.is_lost);

    const openDealsValue = openDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const wonDealsValue = wonDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

    const totalResolved = wonDeals.length + lostDeals.length;
    const conversionRate = totalResolved > 0 ? Math.round((wonDeals.length / totalResolved) * 100) : 0;

    const followupsToday = tasks.filter((t) => t.status !== 'completed' && t.due_date === todayStr).length;
    const followupsOverdue = tasks.filter((t) => t.status !== 'completed' && t.due_date < todayStr).length;

    return {
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === 'new').length,
      openDealsCount: openDeals.length,
      openDealsValue,
      wonDealsCount: wonDeals.length,
      wonDealsValue,
      conversionRate,
      followupsToday,
      followupsOverdue,
    };
  },

  async getPipelineFunnel(): Promise<ChartDataPoint[]> {
    const stages = isDemoMode() ? LocalStore.getStages() : (await supabase.from('pipeline_stages').select('*').order('position')).data || [];
    const deals = isDemoMode() ? LocalStore.getDeals() : (await supabase.from('deals').select('*')).data || [];

    return stages.map((st) => {
      const stageDeals = deals.filter((d) => d.stage_id === st.id);
      const totalValue = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
      return {
        name: st.name,
        value: stageDeals.length,
        amount: totalValue,
      };
    });
  },

  async getLeadsBySource(): Promise<ChartDataPoint[]> {
    const sources = isDemoMode() ? LocalStore.getSources() : (await supabase.from('lead_sources').select('*')).data || [];
    const leads = isDemoMode() ? LocalStore.getLeads() : (await supabase.from('leads').select('*')).data || [];

    const sourceCounts: Record<string, number> = {};
    sources.forEach((s) => {
      sourceCounts[s.name] = 0;
    });

    leads.forEach((l) => {
      const src = sources.find((s) => s.id === l.source_id);
      const name = src ? src.name : 'Outro';
      sourceCounts[name] = (sourceCounts[name] || 0) + 1;
    });

    return Object.entries(sourceCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  },

  async getSalesBySeller(): Promise<ChartDataPoint[]> {
    const profiles = isDemoMode() ? LocalStore.getProfiles() : (await supabase.from('profiles').select('*')).data || [];
    const deals = isDemoMode() ? LocalStore.getDeals() : (await supabase.from('deals').select('*, stage:pipeline_stages(*)')).data || [];

    const wonDeals = deals.filter((d) => d.stage?.is_won);

    return profiles.map((p) => {
      const userDeals = wonDeals.filter((d) => d.assigned_to === p.id);
      const totalAmount = userDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
      return {
        name: p.full_name.split(' ')[0],
        value: userDeals.length,
        amount: totalAmount,
      };
    });
  },

  async getRecentActivities(limit = 6): Promise<Activity[]> {
    const acts = isDemoMode() ? LocalStore.getActivities() : (await supabase.from('activities').select('*, performer:profiles!performed_by(*)').order('performed_at', { ascending: false }).limit(limit)).data || [];
    return acts.slice(0, limit);
  },
};
