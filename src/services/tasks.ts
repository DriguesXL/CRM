import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/demo-data';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string;
  lead_id?: string;
  customer_id?: string;
  deal_id?: string;
}

export const tasksService = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    if (isDemoMode()) {
      let tasks = LocalStore.getTasks();
      if (filters?.status) tasks = tasks.filter((t) => t.status === filters.status);
      if (filters?.priority) tasks = tasks.filter((t) => t.priority === filters.priority);
      if (filters?.assigned_to) tasks = tasks.filter((t) => t.assigned_to === filters.assigned_to);
      if (filters?.lead_id) tasks = tasks.filter((t) => t.lead_id === filters.lead_id);
      if (filters?.customer_id) tasks = tasks.filter((t) => t.customer_id === filters.customer_id);
      if (filters?.deal_id) tasks = tasks.filter((t) => t.deal_id === filters.deal_id);
      return tasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    }

    let query = supabase
      .from('tasks')
      .select('*, assigned_user:profiles!assigned_to(*)');

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.priority) query = query.eq('priority', filters.priority);
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters?.lead_id) query = query.eq('lead_id', filters.lead_id);
    if (filters?.customer_id) query = query.eq('customer_id', filters.customer_id);
    if (filters?.deal_id) query = query.eq('deal_id', filters.deal_id);

    const { data, error } = await query.order('due_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    if (isDemoMode()) {
      const tasks = LocalStore.getTasks();
      const profiles = LocalStore.getProfiles();

      const newTask: Task = {
        id: `demo-task-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        title: taskData.title || '',
        description: taskData.description || null,
        assigned_to: taskData.assigned_to || DEMO_USER_ID,
        customer_id: taskData.customer_id || null,
        deal_id: taskData.deal_id || null,
        lead_id: taskData.lead_id || null,
        due_date: taskData.due_date || new Date().toISOString().split('T')[0],
        due_time: taskData.due_time || null,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        completed_at: null,
        created_by: DEMO_USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_user: profiles.find((p) => p.id === taskData.assigned_to) || profiles[0],
      };

      LocalStore.setTasks([newTask, ...tasks]);
      return newTask;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (isDemoMode()) {
      const tasks = LocalStore.getTasks();
      const profiles = LocalStore.getProfiles();

      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Task not found');

      const updated = {
        ...tasks[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (updates.assigned_to) {
        updated.assigned_user = profiles.find((p) => p.id === updates.assigned_to);
      }

      if (updates.status === 'completed' && tasks[index].status !== 'completed') {
        updated.completed_at = new Date().toISOString();
      } else if (updates.status && updates.status !== 'completed') {
        updated.completed_at = null;
      }

      tasks[index] = updated;
      LocalStore.setTasks(tasks);
      return updated;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleTaskStatus(id: string): Promise<Task> {
    const tasks = isDemoMode() ? LocalStore.getTasks() : await this.getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');

    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    return this.updateTask(id, { status: newStatus });
  },

  async deleteTask(id: string): Promise<void> {
    if (isDemoMode()) {
      const tasks = LocalStore.getTasks();
      LocalStore.setTasks(tasks.filter((t) => t.id !== id));
      return;
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};
