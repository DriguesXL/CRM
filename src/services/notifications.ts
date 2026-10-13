import { LocalStore } from './storage';
import { isDemoMode, supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

export const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    if (isDemoMode()) {
      return LocalStore.getNotifications();
    }
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    if (isDemoMode()) {
      const notes = LocalStore.getNotifications();
      const updated = notes.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      LocalStore.setNotifications(updated);
      return;
    }
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  },

  async markAllAsRead(): Promise<void> {
    if (isDemoMode()) {
      const notes = LocalStore.getNotifications();
      const updated = notes.map((n) => ({ ...n, is_read: true }));
      LocalStore.setNotifications(updated);
      return;
    }
    await supabase.from('notifications').update({ is_read: true }).neq('is_read', true);
  },
};
