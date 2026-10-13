// ===========================
// LeadFlow CRM - Tipos Base
// ===========================

export type UUID = string;

export type UserRole = 'admin' | 'manager' | 'seller';
export type OrganizationRole = UserRole;

export type PlanType = 'free' | 'basic' | 'pro';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type ActivityType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'note' | 'proposal' | 'other';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type NotificationType = 
  | 'overdue_followup'
  | 'tasks_today'
  | 'deal_moved'
  | 'deal_assigned'
  | 'lead_assigned'
  | 'task_assigned'
  | 'general';

// ===========================
// Entidades
// ===========================

export interface Organization {
  id: UUID;
  name: string;
  slug: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  plan: PlanType;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: UUID;
  organization_id: UUID;
  user_id: UUID;
  role: UserRole;
  is_active: boolean;
  invited_by: UUID | null;
  joined_at: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
}

export interface Profile {
  id: UUID;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  email: string;
  is_super_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: UUID;
  organization_id: UUID;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  source_id: UUID | null;
  status: LeadStatus;
  assigned_to: UUID | null;
  potential_value: number | null;
  notes: string | null;
  last_contact_at: string | null;
  next_followup_at: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  source?: LeadSource;
  assigned_user?: Profile;
  tags?: Tag[];
}

export interface Customer {
  id: UUID;
  organization_id: UUID;
  name: string;
  company: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  document: string | null;
  address: Address | null;
  assigned_to: UUID | null;
  notes: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_user?: Profile;
  tags?: Tag[];
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface PipelineStage {
  id: UUID;
  organization_id: UUID;
  name: string;
  position: number;
  color: string;
  is_default: boolean;
  is_won: boolean;
  is_lost: boolean;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: UUID;
  organization_id: UUID;
  title: string;
  customer_id: UUID | null;
  lead_id: UUID | null;
  assigned_to: UUID | null;
  stage_id: UUID;
  value: number;
  probability: number;
  expected_close_date: string | null;
  notes: string | null;
  last_activity_at: string | null;
  next_followup_at: string | null;
  lost_reason: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Customer;
  lead?: Lead;
  stage?: PipelineStage;
  assigned_user?: Profile;
}

export interface Activity {
  id: UUID;
  organization_id: UUID;
  type: ActivityType;
  description: string;
  customer_id: UUID | null;
  lead_id: UUID | null;
  deal_id: UUID | null;
  performed_by: UUID | null;
  performed_at: string;
  created_at: string;
  // Joined fields
  customer?: Customer;
  lead?: Lead;
  deal?: Deal;
  performer?: Profile;
}

export interface Task {
  id: UUID;
  organization_id: UUID;
  title: string;
  description: string | null;
  assigned_to: UUID | null;
  customer_id: UUID | null;
  deal_id: UUID | null;
  lead_id: UUID | null;
  due_date: string;
  due_time: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  completed_at: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Customer;
  deal?: Deal;
  lead?: Lead;
  assigned_user?: Profile;
}

export interface Tag {
  id: UUID;
  organization_id: UUID;
  name: string;
  color: string;
  created_at: string;
}

export interface LeadSource {
  id: UUID;
  organization_id: UUID;
  name: string;
  is_default: boolean;
  created_at: string;
}

export interface Notification {
  id: UUID;
  organization_id: UUID;
  user_id: UUID;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface SuperAdmin {
  id: UUID;
  user_id: UUID;
  created_at: string;
}

// ===========================
// Forms / DTOs
// ===========================

export interface CreateLeadDTO {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  source_id?: UUID;
  status?: LeadStatus;
  assigned_to?: UUID;
  potential_value?: number;
  notes?: string;
  next_followup_at?: string;
  tag_ids?: UUID[];
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {}

export interface CreateCustomerDTO {
  name: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  document?: string;
  address?: Address;
  assigned_to?: UUID;
  notes?: string;
  tag_ids?: UUID[];
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}

export interface CreateDealDTO {
  title: string;
  customer_id?: UUID;
  lead_id?: UUID;
  assigned_to?: UUID;
  stage_id: UUID;
  value: number;
  probability?: number;
  expected_close_date?: string;
  notes?: string;
  next_followup_at?: string;
}

export interface UpdateDealDTO extends Partial<CreateDealDTO> {
  lost_reason?: string;
}

export interface CreateActivityDTO {
  type: ActivityType;
  description: string;
  customer_id?: UUID;
  lead_id?: UUID;
  deal_id?: UUID;
  performed_at?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  assigned_to?: UUID;
  customer_id?: UUID;
  deal_id?: UUID;
  lead_id?: UUID;
  due_date: string;
  due_time?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus;
}

export interface CreateOrganizationDTO {
  name: string;
  slug?: string;
}

export interface InviteMemberDTO {
  email: string;
  role: UserRole;
}

// ===========================
// Dashboard
// ===========================

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  openDeals: number;
  pipelineValue: number;
  closedDeals: number;
  soldValue: number;
  conversionRate: number;
  followupsToday: number;
  overdueFollowups: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface SalesChartData {
  date: string;
  value: number;
  count: number;
}

// ===========================
// Filtros
// ===========================

export type DateFilter = 'today' | 'last7days' | 'last30days' | 'this_month' | 'last_month' | 'custom';

export interface DateRange {
  from: string;
  to: string;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus[];
  assigned_to?: UUID;
  source_id?: UUID;
  tag_ids?: UUID[];
  date_filter?: DateFilter;
  date_range?: DateRange;
}

export interface DealFilters {
  search?: string;
  assigned_to?: UUID;
  stage_id?: UUID;
  date_filter?: DateFilter;
  date_range?: DateRange;
}

// ===========================
// Planos - Limites
// ===========================

export interface PlanLimits {
  maxUsers: number;
  maxLeads: number;
  maxCustomers: number;
  advancedReports: boolean;
  customPipeline: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxUsers: 1,
    maxLeads: 100,
    maxCustomers: 50,
    advancedReports: false,
    customPipeline: false,
  },
  basic: {
    maxUsers: 5,
    maxLeads: 2000,
    maxCustomers: 1000,
    advancedReports: false,
    customPipeline: true,
  },
  pro: {
    maxUsers: 999999,
    maxLeads: 999999,
    maxCustomers: 999999,
    advancedReports: true,
    customPipeline: true,
  },
};
