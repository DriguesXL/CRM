import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { Activity } from '@/types';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/demo-data';

export interface ActivityFilters {
  lead_id?: string;
  customer_id?: string;
  deal_id?: string;
  type?: string;
}

export const activitiesService = {
  async getActivities(filters?: ActivityFilters): Promise<Activity[]> {
    if (isDemoMode()) {
      let acts = LocalStore.getActivities();
      if (filters?.lead_id) acts = acts.filter((a) => a.lead_id === filters.lead_id);
      if (filters?.customer_id) acts = acts.filter((a) => a.customer_id === filters.customer_id);
      if (filters?.deal_id) acts = acts.filter((a) => a.deal_id === filters.deal_id);
      if (filters?.type) acts = acts.filter((a) => a.type === filters.type);
      return acts.sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime());
    }

    let query = supabase
      .from('activities')
      .select('*, performer:profiles!performed_by(*)');

    if (filters?.lead_id) query = query.eq('lead_id', filters.lead_id);
    if (filters?.customer_id) query = query.eq('customer_id', filters.customer_id);
    if (filters?.deal_id) query = query.eq('deal_id', filters.deal_id);
    if (filters?.type) query = query.eq('type', filters.type);

    const { data, error } = await query.order('performed_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createActivity(actData: Partial<Activity>): Promise<Activity> {
    if (isDemoMode()) {
      const acts = LocalStore.getActivities();
      const profiles = LocalStore.getProfiles();

      const newAct: Activity = {
        id: `demo-act-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        type: actData.type || 'note',
        description: actData.description || '',
        customer_id: actData.customer_id || null,
        lead_id: actData.lead_id || null,
        deal_id: actData.deal_id || null,
        performed_by: actData.performed_by || DEMO_USER_ID,
        performed_at: actData.performed_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        performer: profiles.find((p) => p.id === actData.performed_by) || profiles[0],
      };

      LocalStore.setActivities([newAct, ...acts]);
      return newAct;
    }

    const { data, error } = await supabase
      .from('activities')
      .insert(actData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
