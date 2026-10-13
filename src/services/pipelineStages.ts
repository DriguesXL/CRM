import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { PipelineStage } from '@/types';
import { DEMO_ORG_ID } from '@/lib/demo-data';

export const pipelineStagesService = {
  async getStages(): Promise<PipelineStage[]> {
    if (isDemoMode()) {
      return LocalStore.getStages().sort((a, b) => a.position - b.position);
    }

    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createStage(stageData: Partial<PipelineStage>): Promise<PipelineStage> {
    if (isDemoMode()) {
      const stages = LocalStore.getStages();
      const newStage: PipelineStage = {
        id: `demo-stage-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        name: stageData.name || 'Nova Etapa',
        position: stages.length,
        color: stageData.color || '#3b82f6',
        is_default: false,
        is_won: stageData.is_won || false,
        is_lost: stageData.is_lost || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      LocalStore.setStages([...stages, newStage]);
      return newStage;
    }

    const { data, error } = await supabase
      .from('pipeline_stages')
      .insert(stageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStage(id: string, updates: Partial<PipelineStage>): Promise<PipelineStage> {
    if (isDemoMode()) {
      const stages = LocalStore.getStages();
      const index = stages.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Stage not found');

      stages[index] = { ...stages[index], ...updates, updated_at: new Date().toISOString() };
      LocalStore.setStages(stages);
      return stages[index];
    }

    const { data, error } = await supabase
      .from('pipeline_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStage(id: string): Promise<void> {
    if (isDemoMode()) {
      const stages = LocalStore.getStages();
      LocalStore.setStages(stages.filter((s) => s.id !== id));
      return;
    }

    const { error } = await supabase.from('pipeline_stages').delete().eq('id', id);
    if (error) throw error;
  },
};
