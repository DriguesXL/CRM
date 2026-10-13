import type {
  Lead,
  Customer,
  Deal,
  Activity,
  Task,
  Tag,
  LeadSource,
  Notification,
  PipelineStage,
  Profile,
  Organization,
  OrganizationMember,
} from '@/types';

const STORAGE_KEYS = {
  LEADS: 'leadflow_v2_leads',
  CUSTOMERS: 'leadflow_v2_customers',
  DEALS: 'leadflow_v2_deals',
  ACTIVITIES: 'leadflow_v2_activities',
  TASKS: 'leadflow_v2_tasks',
  TAGS: 'leadflow_v2_tags',
  SOURCES: 'leadflow_v2_sources',
  STAGES: 'leadflow_v2_stages',
  NOTIFICATIONS: 'leadflow_v2_notifications',
  PROFILES: 'leadflow_v2_profiles',
  MEMBERS: 'leadflow_v2_members',
  ORGANIZATION: 'leadflow_v2_organization',
  CREDENTIALS: 'leadflow_v2_credentials',
};

export const defaultStages: PipelineStage[] = [
  { id: 'stage-1', organization_id: 'org-main', name: 'Novo Lead', position: 0, color: '#6366f1', is_default: true, is_won: false, is_lost: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'stage-2', organization_id: 'org-main', name: 'Primeiro Contato', position: 1, color: '#8b5cf6', is_default: false, is_won: false, is_lost: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'stage-3', organization_id: 'org-main', name: 'Qualificação', position: 2, color: '#a855f7', is_default: false, is_won: false, is_lost: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'stage-4', organization_id: 'org-main', name: 'Proposta Enviada', position: 3, color: '#f59e0b', is_default: false, is_won: false, is_lost: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'stage-5', organization_id: 'org-main', name: 'Negociação', position: 4, color: '#f97316', is_default: false, is_won: false, is_lost: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'stage-6', organization_id: 'org-main', name: 'Fechado (Ganho)', position: 5, color: '#22c55e', is_default: false, is_won: true, is_lost: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'stage-7', organization_id: 'org-main', name: 'Perdido', position: 6, color: '#ef4444', is_default: false, is_won: false, is_lost: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const defaultSources: LeadSource[] = [
  { id: 'src-1', organization_id: 'org-main', name: 'WhatsApp', is_default: true, created_at: new Date().toISOString() },
  { id: 'src-2', organization_id: 'org-main', name: 'Instagram', is_default: true, created_at: new Date().toISOString() },
  { id: 'src-3', organization_id: 'org-main', name: 'Indicação', is_default: true, created_at: new Date().toISOString() },
  { id: 'src-4', organization_id: 'org-main', name: 'Site / Orgânico', is_default: true, created_at: new Date().toISOString() },
  { id: 'src-5', organization_id: 'org-main', name: 'Google Ads', is_default: true, created_at: new Date().toISOString() },
  { id: 'src-6', organization_id: 'org-main', name: 'Telefone', is_default: true, created_at: new Date().toISOString() },
  { id: 'src-7', organization_id: 'org-main', name: 'Outro', is_default: true, created_at: new Date().toISOString() },
];

export const defaultTags: Tag[] = [
  { id: 'tag-1', organization_id: 'org-main', name: 'Lead Quente', color: '#ef4444', created_at: new Date().toISOString() },
  { id: 'tag-2', organization_id: 'org-main', name: 'Cliente VIP', color: '#f59e0b', created_at: new Date().toISOString() },
  { id: 'tag-3', organization_id: 'org-main', name: 'Indicação', color: '#22c55e', created_at: new Date().toISOString() },
  { id: 'tag-4', organization_id: 'org-main', name: 'Urgente', color: '#dc2626', created_at: new Date().toISOString() },
];

export const defaultOrganization: Organization = {
  id: 'org-main',
  name: 'Minha Empresa',
  slug: 'minha-empresa',
  logo_url: null,
  phone: null,
  email: null,
  address: null,
  plan: 'pro',
  subscription_status: 'active',
  trial_ends_at: null,
  is_active: true,
  settings: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export const LocalStore = {
  // Dados Comerciais (iniciam 100% vazios para receber apenas dados reais)
  getLeads: (): Lead[] => getStored<Lead[]>(STORAGE_KEYS.LEADS, []),
  setLeads: (leads: Lead[]) => setStored(STORAGE_KEYS.LEADS, leads),

  getCustomers: (): Customer[] => getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, []),
  setCustomers: (customers: Customer[]) => setStored(STORAGE_KEYS.CUSTOMERS, customers),

  getDeals: (): Deal[] => getStored<Deal[]>(STORAGE_KEYS.DEALS, []),
  setDeals: (deals: Deal[]) => setStored(STORAGE_KEYS.DEALS, deals),

  getActivities: (): Activity[] => getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, []),
  setActivities: (acts: Activity[]) => setStored(STORAGE_KEYS.ACTIVITIES, acts),

  getTasks: (): Task[] => getStored<Task[]>(STORAGE_KEYS.TASKS, []),
  setTasks: (tasks: Task[]) => setStored(STORAGE_KEYS.TASKS, tasks),

  getNotifications: (): Notification[] => getStored<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []),
  setNotifications: (notes: Notification[]) => setStored(STORAGE_KEYS.NOTIFICATIONS, notes),

  // Configurações Estruturais Padrão
  getTags: (): Tag[] => getStored<Tag[]>(STORAGE_KEYS.TAGS, defaultTags),
  setTags: (tags: Tag[]) => setStored(STORAGE_KEYS.TAGS, tags),

  getSources: (): LeadSource[] => getStored<LeadSource[]>(STORAGE_KEYS.SOURCES, defaultSources),
  setSources: (sources: LeadSource[]) => setStored(STORAGE_KEYS.SOURCES, sources),

  getStages: (): PipelineStage[] => getStored<PipelineStage[]>(STORAGE_KEYS.STAGES, defaultStages),
  setStages: (stages: PipelineStage[]) => setStored(STORAGE_KEYS.STAGES, stages),

  getOrganization: (): Organization => getStored<Organization>(STORAGE_KEYS.ORGANIZATION, defaultOrganization),
  setOrganization: (org: Organization) => setStored(STORAGE_KEYS.ORGANIZATION, org),

  // Usuários e Funcionários
  getProfiles: (): Profile[] => getStored<Profile[]>(STORAGE_KEYS.PROFILES, []),
  setProfiles: (profiles: Profile[]) => setStored(STORAGE_KEYS.PROFILES, profiles),

  getMembers: (): OrganizationMember[] => getStored<OrganizationMember[]>(STORAGE_KEYS.MEMBERS, []),
  setMembers: (members: OrganizationMember[]) => setStored(STORAGE_KEYS.MEMBERS, members),

  getCredentials: (): Record<string, string> => getStored<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, {}),
  setCredentials: (creds: Record<string, string>) => setStored(STORAGE_KEYS.CREDENTIALS, creds),

  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    // Remove também chaves antigas de demo
    ['leadflow_leads', 'leadflow_customers', 'leadflow_deals', 'leadflow_activities', 'leadflow_tasks', 'leadflow_demo_session'].forEach((k) => localStorage.removeItem(k));
  },
};
