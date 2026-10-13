import { supabase, isDemoMode } from '@/lib/supabase';
import { LocalStore } from './storage';
import type { Lead, LeadStatus, Customer } from '@/types';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/demo-data';

export interface LeadFilters {
  status?: LeadStatus;
  search?: string;
  source_id?: string;
  assigned_to?: string;
}

export const leadsService = {
  async getLeads(filters?: LeadFilters): Promise<Lead[]> {
    if (isDemoMode()) {
      let leads = LocalStore.getLeads();
      if (filters?.status) {
        leads = leads.filter((l) => l.status === filters.status);
      }
      if (filters?.source_id) {
        leads = leads.filter((l) => l.source_id === filters.source_id);
      }
      if (filters?.assigned_to) {
        leads = leads.filter((l) => l.assigned_to === filters.assigned_to);
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        leads = leads.filter(
          (l) =>
            l.name.toLowerCase().includes(query) ||
            (l.company && l.company.toLowerCase().includes(query)) ||
            (l.email && l.email.toLowerCase().includes(query)) ||
            (l.phone && l.phone.includes(query))
        );
      }
      return leads;
    }

    let query = supabase
      .from('leads')
      .select('*, source:lead_sources(*), assigned_user:profiles!assigned_to(*)');

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.source_id) query = query.eq('source_id', filters.source_id);
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getLeadById(id: string): Promise<Lead | null> {
    if (isDemoMode()) {
      const leads = LocalStore.getLeads();
      return leads.find((l) => l.id === id) || null;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*, source:lead_sources(*), assigned_user:profiles!assigned_to(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    if (isDemoMode()) {
      const leads = LocalStore.getLeads();
      const sources = LocalStore.getSources();
      const profiles = LocalStore.getProfiles();

      const newLead: Lead = {
        id: `demo-lead-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        name: leadData.name || '',
        company: leadData.company || null,
        phone: leadData.phone || null,
        email: leadData.email || null,
        source_id: leadData.source_id || null,
        status: leadData.status || 'new',
        assigned_to: leadData.assigned_to || DEMO_USER_ID,
        potential_value: leadData.potential_value || null,
        notes: leadData.notes || null,
        last_contact_at: null,
        next_followup_at: leadData.next_followup_at || null,
        created_by: DEMO_USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: sources.find((s) => s.id === leadData.source_id),
        assigned_user: profiles.find((p) => p.id === leadData.assigned_to),
      };

      LocalStore.setLeads([newLead, ...leads]);
      return newLead;
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    if (isDemoMode()) {
      const leads = LocalStore.getLeads();
      const sources = LocalStore.getSources();
      const profiles = LocalStore.getProfiles();

      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) throw new Error('Lead not found');

      const updatedLead = {
        ...leads[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (updates.source_id !== undefined) {
        updatedLead.source = sources.find((s) => s.id === updates.source_id);
      }
      if (updates.assigned_to !== undefined) {
        updatedLead.assigned_user = profiles.find((p) => p.id === updates.assigned_to);
      }

      leads[index] = updatedLead;
      LocalStore.setLeads(leads);
      return updatedLead;
    }

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLead(id: string): Promise<void> {
    if (isDemoMode()) {
      const leads = LocalStore.getLeads();
      LocalStore.setLeads(leads.filter((l) => l.id !== id));
      return;
    }

    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
  },

  async convertLeadToCustomer(leadId: string): Promise<Customer> {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');

    if (isDemoMode()) {
      const customers = LocalStore.getCustomers();
      const newCustomer: Customer = {
        id: `demo-cust-${Date.now()}`,
        organization_id: lead.organization_id,
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        whatsapp: lead.phone,
        email: lead.email,
        document: null,
        address: null,
        assigned_to: lead.assigned_to,
        notes: `Convertido do Lead: ${lead.notes || ''}`,
        created_by: DEMO_USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      LocalStore.setCustomers([newCustomer, ...customers]);
      await this.updateLead(leadId, { status: 'won' });
      return newCustomer;
    }

    const { data: newCustomer, error: custError } = await supabase
      .from('customers')
      .insert({
        organization_id: lead.organization_id,
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        whatsapp: lead.phone,
        email: lead.email,
        assigned_to: lead.assigned_to,
        notes: `Convertido do Lead: ${lead.notes || ''}`,
      })
      .select()
      .single();

    if (custError) throw custError;
    await this.updateLead(leadId, { status: 'won' });
    return newCustomer;
  },
};
