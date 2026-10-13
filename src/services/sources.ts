import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { LeadSource } from '@/types';
import { DEMO_ORG_ID } from '@/lib/demo-data';

export const sourcesService = {
  async getSources(): Promise<LeadSource[]> {
    if (isDemoMode()) {
      return LocalStore.getSources();
    }
    const { data, error } = await supabase.from('lead_sources').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  async createSource(name: string): Promise<LeadSource> {
    if (isDemoMode()) {
      const sources = LocalStore.getSources();
      const newSource: LeadSource = {
        id: `demo-src-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        name,
        is_default: false,
        created_at: new Date().toISOString(),
      };
      LocalStore.setSources([...sources, newSource]);
      return newSource;
    }
    const { data, error } = await supabase.from('lead_sources').insert({ name }).select().single();
    if (error) throw error;
    return data;
  },

  async deleteSource(id: string): Promise<void> {
    if (isDemoMode()) {
      const sources = LocalStore.getSources();
      LocalStore.setSources(sources.filter((s) => s.id !== id));
      return;
    }
    const { error } = await supabase.from('lead_sources').delete().eq('id', id);
    if (error) throw error;
  },
};
