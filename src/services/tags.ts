import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { Tag } from '@/types';
import { DEMO_ORG_ID } from '@/lib/demo-data';

export const tagsService = {
  async getTags(): Promise<Tag[]> {
    if (isDemoMode()) {
      return LocalStore.getTags();
    }
    const { data, error } = await supabase.from('tags').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  async createTag(name: string, color: string): Promise<Tag> {
    if (isDemoMode()) {
      const tags = LocalStore.getTags();
      const newTag: Tag = {
        id: `demo-tag-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        name,
        color,
        created_at: new Date().toISOString(),
      };
      LocalStore.setTags([...tags, newTag]);
      return newTag;
    }
    const { data, error } = await supabase.from('tags').insert({ name, color }).select().single();
    if (error) throw error;
    return data;
  },

  async deleteTag(id: string): Promise<void> {
    if (isDemoMode()) {
      const tags = LocalStore.getTags();
      LocalStore.setTags(tags.filter((t) => t.id !== id));
      return;
    }
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) throw error;
  },
};
