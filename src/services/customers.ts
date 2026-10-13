import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { Customer } from '@/types';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/demo-data';

export interface CustomerFilters {
  search?: string;
  assigned_to?: string;
}

export const customersService = {
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    if (isDemoMode()) {
      let customers = LocalStore.getCustomers();
      if (filters?.assigned_to) {
        customers = customers.filter((c) => c.assigned_to === filters.assigned_to);
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        customers = customers.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            (c.company && c.company.toLowerCase().includes(query)) ||
            (c.email && c.email.toLowerCase().includes(query)) ||
            (c.phone && c.phone.includes(query))
        );
      }
      return customers;
    }

    let query = supabase
      .from('customers')
      .select('*, assigned_user:profiles!assigned_to(*)');

    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    if (isDemoMode()) {
      const customers = LocalStore.getCustomers();
      return customers.find((c) => c.id === id) || null;
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*, assigned_user:profiles!assigned_to(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCustomer(custData: Partial<Customer>): Promise<Customer> {
    if (isDemoMode()) {
      const customers = LocalStore.getCustomers();
      const profiles = LocalStore.getProfiles();

      const newCust: Customer = {
        id: `demo-cust-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        name: custData.name || '',
        company: custData.company || null,
        phone: custData.phone || null,
        whatsapp: custData.whatsapp || null,
        email: custData.email || null,
        document: custData.document || null,
        address: custData.address || null,
        assigned_to: custData.assigned_to || DEMO_USER_ID,
        notes: custData.notes || null,
        created_by: DEMO_USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_user: profiles.find((p) => p.id === custData.assigned_to),
      };

      LocalStore.setCustomers([newCust, ...customers]);
      return newCust;
    }

    const { data, error } = await supabase
      .from('customers')
      .insert(custData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    if (isDemoMode()) {
      const customers = LocalStore.getCustomers();
      const profiles = LocalStore.getProfiles();

      const index = customers.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Customer not found');

      const updated = {
        ...customers[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (updates.assigned_to !== undefined) {
        updated.assigned_user = profiles.find((p) => p.id === updates.assigned_to);
      }

      customers[index] = updated;
      LocalStore.setCustomers(customers);
      return updated;
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomer(id: string): Promise<void> {
    if (isDemoMode()) {
      const customers = LocalStore.getCustomers();
      LocalStore.setCustomers(customers.filter((c) => c.id !== id));
      return;
    }

    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
  },
};
