import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { Deal } from '@/types';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/demo-data';

export interface DealFilters {
  stage_id?: string;
  assigned_to?: string;
  search?: string;
}

export const dealsService = {
  async getDeals(filters?: DealFilters): Promise<Deal[]> {
    if (isDemoMode()) {
      let deals = LocalStore.getDeals();
      if (filters?.stage_id) {
        deals = deals.filter((d) => d.stage_id === filters.stage_id);
      }
      if (filters?.assigned_to) {
        deals = deals.filter((d) => d.assigned_to === filters.assigned_to);
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        deals = deals.filter(
          (d) =>
            d.title.toLowerCase().includes(query) ||
            (d.customer?.name && d.customer.name.toLowerCase().includes(query))
        );
      }
      return deals;
    }

    let query = supabase
      .from('deals')
      .select('*, customer:customers(*), stage:pipeline_stages(*), assigned_user:profiles!assigned_to(*)');

    if (filters?.stage_id) query = query.eq('stage_id', filters.stage_id);
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getDealById(id: string): Promise<Deal | null> {
    if (isDemoMode()) {
      const deals = LocalStore.getDeals();
      return deals.find((d) => d.id === id) || null;
    }

    const { data, error } = await supabase
      .from('deals')
      .select('*, customer:customers(*), stage:pipeline_stages(*), assigned_user:profiles!assigned_to(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createDeal(dealData: Partial<Deal>): Promise<Deal> {
    if (isDemoMode()) {
      const deals = LocalStore.getDeals();
      const stages = LocalStore.getStages();
      const customers = LocalStore.getCustomers();
      const profiles = LocalStore.getProfiles();

      const newDeal: Deal = {
        id: `demo-deal-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        title: dealData.title || '',
        customer_id: dealData.customer_id || null,
        lead_id: dealData.lead_id || null,
        assigned_to: dealData.assigned_to || DEMO_USER_ID,
        stage_id: dealData.stage_id || stages[0]?.id || '',
        value: Number(dealData.value) || 0,
        probability: dealData.probability || 20,
        expected_close_date: dealData.expected_close_date || null,
        notes: dealData.notes || null,
        last_activity_at: new Date().toISOString(),
        next_followup_at: dealData.next_followup_at || null,
        lost_reason: null,
        created_by: DEMO_USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer: customers.find((c) => c.id === dealData.customer_id),
        stage: stages.find((s) => s.id === dealData.stage_id),
        assigned_user: profiles.find((p) => p.id === dealData.assigned_to),
      };

      LocalStore.setDeals([newDeal, ...deals]);
      return newDeal;
    }

    const { data, error } = await supabase
      .from('deals')
      .insert(dealData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    if (isDemoMode()) {
      const deals = LocalStore.getDeals();
      const stages = LocalStore.getStages();
      const customers = LocalStore.getCustomers();
      const profiles = LocalStore.getProfiles();

      const index = deals.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Deal not found');

      const updated = {
        ...deals[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (updates.stage_id) updated.stage = stages.find((s) => s.id === updates.stage_id);
      if (updates.customer_id) updated.customer = customers.find((c) => c.id === updates.customer_id);
      if (updates.assigned_to) updated.assigned_user = profiles.find((p) => p.id === updates.assigned_to);

      deals[index] = updated;
      LocalStore.setDeals(deals);
      return updated;
    }

    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async moveDeal(dealId: string, targetStageId: string): Promise<Deal> {
    return this.updateDeal(dealId, {
      stage_id: targetStageId,
      last_activity_at: new Date().toISOString(),
    });
  },

  async deleteDeal(id: string): Promise<void> {
    if (isDemoMode()) {
      const deals = LocalStore.getDeals();
      LocalStore.setDeals(deals.filter((d) => d.id !== id));
      return;
    }

    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (error) throw error;
  },
};
