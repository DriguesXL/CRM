// =============================================
// LeadFlow CRM - Demo Data (Dados Fictícios)
// Funciona sem Supabase configurado
// =============================================

import type {
  Organization, Profile, OrganizationMember, Lead, Customer,
  PipelineStage, Deal, Activity, Task, Tag, LeadSource,
  Notification
} from '../types';

// ===== IDs Fixos =====
export const DEMO_ORG_ID = 'demo0000-org0-0000-0000-000000000001';
export const DEMO_USER_ID = 'demo0000-user-0000-0000-000000000001';
export const DEMO_USER_2_ID = 'demo0000-user-0000-0000-000000000002';
export const DEMO_USER_3_ID = 'demo0000-user-0000-0000-000000000003';

// ===== Organização =====
export const demoOrganization: Organization = {
  id: DEMO_ORG_ID,
  name: 'TechStar Soluções',
  slug: 'techstar-solucoes',
  logo_url: null,
  phone: '(11) 3456-7890',
  email: 'contato@techstar.com.br',
  address: 'Av. Paulista, 1000 - São Paulo/SP',
  plan: 'pro',
  subscription_status: 'active',
  trial_ends_at: null,
  is_active: true,
  settings: {},
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-06-01T10:00:00Z',
};

// ===== Perfis =====
export const demoProfiles: Profile[] = [
  {
    id: DEMO_USER_ID,
    full_name: 'Carlos Silva',
    avatar_url: null,
    phone: '(11) 99999-1234',
    email: 'carlos@techstar.com.br',
    is_super_admin: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
  {
    id: DEMO_USER_2_ID,
    full_name: 'Ana Oliveira',
    avatar_url: null,
    phone: '(11) 98888-5678',
    email: 'ana@techstar.com.br',
    is_super_admin: false,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
  {
    id: DEMO_USER_3_ID,
    full_name: 'Pedro Santos',
    avatar_url: null,
    phone: '(11) 97777-9012',
    email: 'pedro@techstar.com.br',
    is_super_admin: false,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
];

// ===== Membros =====
export const demoMembers: OrganizationMember[] = [
  {
    id: 'demo0000-memb-0000-0000-000000000001',
    organization_id: DEMO_ORG_ID,
    user_id: DEMO_USER_ID,
    role: 'admin',
    is_active: true,
    invited_by: null,
    joined_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
    profile: demoProfiles[0],
  },
  {
    id: 'demo0000-memb-0000-0000-000000000002',
    organization_id: DEMO_ORG_ID,
    user_id: DEMO_USER_2_ID,
    role: 'manager',
    is_active: true,
    invited_by: DEMO_USER_ID,
    joined_at: '2024-02-01T10:00:00Z',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
    profile: demoProfiles[1],
  },
  {
    id: 'demo0000-memb-0000-0000-000000000003',
    organization_id: DEMO_ORG_ID,
    user_id: DEMO_USER_3_ID,
    role: 'seller',
    is_active: true,
    invited_by: DEMO_USER_ID,
    joined_at: '2024-03-01T10:00:00Z',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
    profile: demoProfiles[2],
  },
];

// ===== Pipeline Stages =====
export const demoStages: PipelineStage[] = [
  { id: 'demo0000-stg0-0000-0000-000000000001', organization_id: DEMO_ORG_ID, name: 'Novo Lead', position: 0, color: '#6366f1', is_default: true, is_won: false, is_lost: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-stg0-0000-0000-000000000002', organization_id: DEMO_ORG_ID, name: 'Primeiro Contato', position: 1, color: '#8b5cf6', is_default: false, is_won: false, is_lost: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-stg0-0000-0000-000000000003', organization_id: DEMO_ORG_ID, name: 'Qualificação', position: 2, color: '#a855f7', is_default: false, is_won: false, is_lost: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-stg0-0000-0000-000000000004', organization_id: DEMO_ORG_ID, name: 'Proposta', position: 3, color: '#f59e0b', is_default: false, is_won: false, is_lost: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-stg0-0000-0000-000000000005', organization_id: DEMO_ORG_ID, name: 'Negociação', position: 4, color: '#f97316', is_default: false, is_won: false, is_lost: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-stg0-0000-0000-000000000006', organization_id: DEMO_ORG_ID, name: 'Fechado', position: 5, color: '#22c55e', is_default: false, is_won: true, is_lost: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-stg0-0000-0000-000000000007', organization_id: DEMO_ORG_ID, name: 'Perdido', position: 6, color: '#ef4444', is_default: false, is_won: false, is_lost: true, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
];

// ===== Lead Sources =====
export const demoSources: LeadSource[] = [
  { id: 'demo0000-src0-0000-0000-000000000001', organization_id: DEMO_ORG_ID, name: 'WhatsApp', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000002', organization_id: DEMO_ORG_ID, name: 'Instagram', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000003', organization_id: DEMO_ORG_ID, name: 'Facebook', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000004', organization_id: DEMO_ORG_ID, name: 'Site', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000005', organization_id: DEMO_ORG_ID, name: 'Indicação', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000006', organization_id: DEMO_ORG_ID, name: 'Google', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000007', organization_id: DEMO_ORG_ID, name: 'Telefone', is_default: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-src0-0000-0000-000000000008', organization_id: DEMO_ORG_ID, name: 'Outro', is_default: true, created_at: '2024-01-15T10:00:00Z' },
];

// ===== Tags =====
export const demoTags: Tag[] = [
  { id: 'demo0000-tag0-0000-0000-000000000001', organization_id: DEMO_ORG_ID, name: 'Cliente VIP', color: '#f59e0b', created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-tag0-0000-0000-000000000002', organization_id: DEMO_ORG_ID, name: 'Lead Quente', color: '#ef4444', created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-tag0-0000-0000-000000000003', organization_id: DEMO_ORG_ID, name: 'Lead Frio', color: '#3b82f6', created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-tag0-0000-0000-000000000004', organization_id: DEMO_ORG_ID, name: 'Indicação', color: '#22c55e', created_at: '2024-01-15T10:00:00Z' },
  { id: 'demo0000-tag0-0000-0000-000000000005', organization_id: DEMO_ORG_ID, name: 'Urgente', color: '#dc2626', created_at: '2024-01-15T10:00:00Z' },
];

// ===== Leads (25+) =====
const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

export const demoLeads: Lead[] = [
  { id: 'demo0000-lead-0000-0000-000000000001', organization_id: DEMO_ORG_ID, name: 'Maria Fernandes', company: 'Fernandes Advocacia', phone: '(11) 98765-4321', email: 'maria@fernandes.adv.br', source_id: demoSources[0].id, status: 'new', assigned_to: DEMO_USER_ID, potential_value: 15000, notes: 'Interessada em sistema para escritório', last_contact_at: null, next_followup_at: daysAgo(-1), created_by: DEMO_USER_ID, created_at: daysAgo(2), updated_at: daysAgo(2), source: demoSources[0], assigned_user: demoProfiles[0], tags: [demoTags[1]] },
  { id: 'demo0000-lead-0000-0000-000000000002', organization_id: DEMO_ORG_ID, name: 'João Pereira', company: 'JP Construções', phone: '(21) 97654-3210', email: 'joao@jpconstrucoes.com.br', source_id: demoSources[1].id, status: 'contacted', assigned_to: DEMO_USER_2_ID, potential_value: 45000, notes: 'Precisa de CRM para equipe de vendas', last_contact_at: daysAgo(1), next_followup_at: daysAgo(-2), created_by: DEMO_USER_ID, created_at: daysAgo(5), updated_at: daysAgo(1), source: demoSources[1], assigned_user: demoProfiles[1], tags: [demoTags[1], demoTags[4]] },
  { id: 'demo0000-lead-0000-0000-000000000003', organization_id: DEMO_ORG_ID, name: 'Carla Mendes', company: 'CM Digital Marketing', phone: '(31) 96543-2109', email: 'carla@cmdigital.com.br', source_id: demoSources[4].id, status: 'qualified', assigned_to: DEMO_USER_ID, potential_value: 28000, notes: 'Indicada pelo cliente Marcos', last_contact_at: daysAgo(3), next_followup_at: daysAgo(0), created_by: DEMO_USER_2_ID, created_at: daysAgo(10), updated_at: daysAgo(3), source: demoSources[4], assigned_user: demoProfiles[0], tags: [demoTags[3]] },
  { id: 'demo0000-lead-0000-0000-000000000004', organization_id: DEMO_ORG_ID, name: 'Roberto Almeida', company: 'Almeida & Filhos', phone: '(41) 95432-1098', email: 'roberto@almeidafilhos.com.br', source_id: demoSources[5].id, status: 'proposal', assigned_to: DEMO_USER_3_ID, potential_value: 35000, notes: 'Reunião agendada para próxima semana', last_contact_at: daysAgo(2), next_followup_at: daysAgo(-3), created_by: DEMO_USER_3_ID, created_at: daysAgo(15), updated_at: daysAgo(2), source: demoSources[5], assigned_user: demoProfiles[2], tags: [demoTags[0]] },
  { id: 'demo0000-lead-0000-0000-000000000005', organization_id: DEMO_ORG_ID, name: 'Lucia Barbosa', company: 'LB Consultoria', phone: '(51) 94321-0987', email: 'lucia@lbconsult.com.br', source_id: demoSources[3].id, status: 'negotiation', assigned_to: DEMO_USER_ID, potential_value: 52000, notes: 'Negociando valor e prazo', last_contact_at: daysAgo(1), next_followup_at: daysAgo(-1), created_by: DEMO_USER_ID, created_at: daysAgo(20), updated_at: daysAgo(1), source: demoSources[3], assigned_user: demoProfiles[0], tags: [demoTags[0], demoTags[1]] },
  { id: 'demo0000-lead-0000-0000-000000000006', organization_id: DEMO_ORG_ID, name: 'Fernando Costa', company: 'Costa Seguros', phone: '(61) 93210-9876', email: 'fernando@costaseguros.com.br', source_id: demoSources[6].id, status: 'won', assigned_to: DEMO_USER_2_ID, potential_value: 18000, notes: 'Contrato assinado', last_contact_at: daysAgo(5), next_followup_at: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(30), updated_at: daysAgo(5), source: demoSources[6], assigned_user: demoProfiles[1], tags: [demoTags[0]] },
  { id: 'demo0000-lead-0000-0000-000000000007', organization_id: DEMO_ORG_ID, name: 'Patrícia Lima', company: 'Lima Odontologia', phone: '(71) 92109-8765', email: 'patricia@limaodonto.com.br', source_id: demoSources[0].id, status: 'lost', assigned_to: DEMO_USER_3_ID, potential_value: 12000, notes: 'Decidiu usar outro fornecedor', last_contact_at: daysAgo(10), next_followup_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(25), updated_at: daysAgo(10), source: demoSources[0], assigned_user: demoProfiles[2], tags: [demoTags[2]] },
  { id: 'demo0000-lead-0000-0000-000000000008', organization_id: DEMO_ORG_ID, name: 'Ricardo Souza', company: 'Souza TI', phone: '(81) 91098-7654', email: 'ricardo@souzati.com.br', source_id: demoSources[2].id, status: 'new', assigned_to: DEMO_USER_ID, potential_value: 22000, notes: 'Primeiro contato pelo Facebook', last_contact_at: null, next_followup_at: daysAgo(-1), created_by: DEMO_USER_ID, created_at: daysAgo(1), updated_at: daysAgo(1), source: demoSources[2], assigned_user: demoProfiles[0], tags: [] },
  { id: 'demo0000-lead-0000-0000-000000000009', organization_id: DEMO_ORG_ID, name: 'Amanda Rocha', company: 'Rocha Estética', phone: '(91) 90987-6543', email: 'amanda@rochaest.com.br', source_id: demoSources[1].id, status: 'contacted', assigned_to: DEMO_USER_2_ID, potential_value: 8500, notes: 'Clínica com 3 filiais', last_contact_at: daysAgo(2), next_followup_at: daysAgo(0), created_by: DEMO_USER_2_ID, created_at: daysAgo(7), updated_at: daysAgo(2), source: demoSources[1], assigned_user: demoProfiles[1], tags: [demoTags[1]] },
  { id: 'demo0000-lead-0000-0000-000000000010', organization_id: DEMO_ORG_ID, name: 'Marcos Vieira', company: 'Vieira Imóveis', phone: '(11) 99876-5432', email: 'marcos@vieiraimoveis.com.br', source_id: demoSources[4].id, status: 'qualified', assigned_to: DEMO_USER_3_ID, potential_value: 65000, notes: 'Grande imobiliária, potencial alto', last_contact_at: daysAgo(4), next_followup_at: daysAgo(-2), created_by: DEMO_USER_ID, created_at: daysAgo(12), updated_at: daysAgo(4), source: demoSources[4], assigned_user: demoProfiles[2], tags: [demoTags[0], demoTags[3]] },
  { id: 'demo0000-lead-0000-0000-000000000011', organization_id: DEMO_ORG_ID, name: 'Juliana Martins', company: 'JM Eventos', phone: '(21) 98765-1234', email: 'juliana@jmeventos.com.br', source_id: demoSources[0].id, status: 'new', assigned_to: DEMO_USER_ID, potential_value: 9000, notes: null, last_contact_at: null, next_followup_at: daysAgo(-1), created_by: DEMO_USER_ID, created_at: daysAgo(0), updated_at: daysAgo(0), source: demoSources[0], assigned_user: demoProfiles[0], tags: [] },
  { id: 'demo0000-lead-0000-0000-000000000012', organization_id: DEMO_ORG_ID, name: 'Bruno Nascimento', company: 'BN Logística', phone: '(31) 97654-2345', email: 'bruno@bnlogistica.com.br', source_id: demoSources[5].id, status: 'proposal', assigned_to: DEMO_USER_2_ID, potential_value: 42000, notes: 'Proposta enviada ontem', last_contact_at: daysAgo(1), next_followup_at: daysAgo(-3), created_by: DEMO_USER_2_ID, created_at: daysAgo(18), updated_at: daysAgo(1), source: demoSources[5], assigned_user: demoProfiles[1], tags: [demoTags[1]] },
  { id: 'demo0000-lead-0000-0000-000000000013', organization_id: DEMO_ORG_ID, name: 'Tatiane Cardoso', company: 'TC Moda', phone: '(41) 96543-3456', email: 'tatiane@tcmoda.com.br', source_id: demoSources[1].id, status: 'won', assigned_to: DEMO_USER_ID, potential_value: 16500, notes: 'Fechou plano básico', last_contact_at: daysAgo(8), next_followup_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(35), updated_at: daysAgo(8), source: demoSources[1], assigned_user: demoProfiles[0], tags: [demoTags[0]] },
  { id: 'demo0000-lead-0000-0000-000000000014', organization_id: DEMO_ORG_ID, name: 'Diego Ferreira', company: 'DF Automação', phone: '(51) 95432-4567', email: 'diego@dfautomacao.com.br', source_id: demoSources[3].id, status: 'contacted', assigned_to: DEMO_USER_3_ID, potential_value: 31000, notes: 'Ligou pedindo demonstração', last_contact_at: daysAgo(3), next_followup_at: daysAgo(-1), created_by: DEMO_USER_3_ID, created_at: daysAgo(6), updated_at: daysAgo(3), source: demoSources[3], assigned_user: demoProfiles[2], tags: [] },
  { id: 'demo0000-lead-0000-0000-000000000015', organization_id: DEMO_ORG_ID, name: 'Vanessa Gomes', company: 'VG Contabilidade', phone: '(61) 94321-5678', email: 'vanessa@vgcontabil.com.br', source_id: demoSources[6].id, status: 'negotiation', assigned_to: DEMO_USER_2_ID, potential_value: 27500, notes: 'Pediu desconto de 10%', last_contact_at: daysAgo(2), next_followup_at: daysAgo(0), created_by: DEMO_USER_2_ID, created_at: daysAgo(22), updated_at: daysAgo(2), source: demoSources[6], assigned_user: demoProfiles[1], tags: [demoTags[1], demoTags[3]] },
  { id: 'demo0000-lead-0000-0000-000000000016', organization_id: DEMO_ORG_ID, name: 'Thiago Ribeiro', company: 'Ribeiro Tech', phone: '(71) 93210-6789', email: 'thiago@ribeirotech.com.br', source_id: demoSources[2].id, status: 'new', assigned_to: DEMO_USER_ID, potential_value: 19000, notes: 'Veio pelo anúncio do Facebook', last_contact_at: null, next_followup_at: daysAgo(-2), created_by: DEMO_USER_ID, created_at: daysAgo(1), updated_at: daysAgo(1), source: demoSources[2], assigned_user: demoProfiles[0], tags: [] },
  { id: 'demo0000-lead-0000-0000-000000000017', organization_id: DEMO_ORG_ID, name: 'Camila Freitas', company: 'Freitas Design', phone: '(81) 92109-7890', email: 'camila@freitasdesign.com.br', source_id: demoSources[4].id, status: 'won', assigned_to: DEMO_USER_3_ID, potential_value: 21000, notes: 'Contrato anual', last_contact_at: daysAgo(12), next_followup_at: null, created_by: DEMO_USER_3_ID, created_at: daysAgo(40), updated_at: daysAgo(12), source: demoSources[4], assigned_user: demoProfiles[2], tags: [demoTags[0], demoTags[3]] },
  { id: 'demo0000-lead-0000-0000-000000000018', organization_id: DEMO_ORG_ID, name: 'Rafael Moreira', company: 'Moreira Alimentos', phone: '(91) 91098-8901', email: 'rafael@moreiraalimentos.com.br', source_id: demoSources[0].id, status: 'lost', assigned_to: DEMO_USER_ID, potential_value: 38000, notes: 'Orçamento acima do previsto', last_contact_at: daysAgo(15), next_followup_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(28), updated_at: daysAgo(15), source: demoSources[0], assigned_user: demoProfiles[0], tags: [demoTags[2]] },
  { id: 'demo0000-lead-0000-0000-000000000019', organization_id: DEMO_ORG_ID, name: 'Daniela Castro', company: 'Castro Pet Shop', phone: '(11) 98765-9012', email: 'daniela@castropet.com.br', source_id: demoSources[1].id, status: 'qualified', assigned_to: DEMO_USER_2_ID, potential_value: 11500, notes: 'Quer integração com e-commerce', last_contact_at: daysAgo(5), next_followup_at: daysAgo(-1), created_by: DEMO_USER_2_ID, created_at: daysAgo(9), updated_at: daysAgo(5), source: demoSources[1], assigned_user: demoProfiles[1], tags: [demoTags[1]] },
  { id: 'demo0000-lead-0000-0000-000000000020', organization_id: DEMO_ORG_ID, name: 'Eduardo Santos', company: 'ES Engenharia', phone: '(21) 97654-0123', email: 'eduardo@esengenharia.com.br', source_id: demoSources[5].id, status: 'new', assigned_to: DEMO_USER_3_ID, potential_value: 55000, notes: 'Empresa de engenharia com 50 funcionários', last_contact_at: null, next_followup_at: daysAgo(-1), created_by: DEMO_USER_ID, created_at: daysAgo(0), updated_at: daysAgo(0), source: demoSources[5], assigned_user: demoProfiles[2], tags: [demoTags[0]] },
  { id: 'demo0000-lead-0000-0000-000000000021', organization_id: DEMO_ORG_ID, name: 'Renata Dias', company: 'Dias Turismo', phone: '(31) 96543-1234', email: 'renata@diasturismo.com.br', source_id: demoSources[3].id, status: 'proposal', assigned_to: DEMO_USER_ID, potential_value: 14000, notes: 'Agência de viagens', last_contact_at: daysAgo(4), next_followup_at: daysAgo(-2), created_by: DEMO_USER_ID, created_at: daysAgo(16), updated_at: daysAgo(4), source: demoSources[3], assigned_user: demoProfiles[0], tags: [] },
  { id: 'demo0000-lead-0000-0000-000000000022', organization_id: DEMO_ORG_ID, name: 'Gustavo Lima', company: 'Lima Transportes', phone: '(41) 95432-2345', email: 'gustavo@limatransportes.com.br', source_id: demoSources[6].id, status: 'won', assigned_to: DEMO_USER_2_ID, potential_value: 48000, notes: 'Plano Pro contratado', last_contact_at: daysAgo(3), next_followup_at: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(45), updated_at: daysAgo(3), source: demoSources[6], assigned_user: demoProfiles[1], tags: [demoTags[0]] },
  { id: 'demo0000-lead-0000-0000-000000000023', organization_id: DEMO_ORG_ID, name: 'Isabela Araujo', company: 'Araujo Clínicas', phone: '(51) 94321-3456', email: 'isabela@araujoclinicas.com.br', source_id: demoSources[4].id, status: 'contacted', assigned_to: DEMO_USER_ID, potential_value: 33000, notes: 'Rede de clínicas com 5 unidades', last_contact_at: daysAgo(1), next_followup_at: daysAgo(0), created_by: DEMO_USER_ID, created_at: daysAgo(4), updated_at: daysAgo(1), source: demoSources[4], assigned_user: demoProfiles[0], tags: [demoTags[0], demoTags[1]] },
  { id: 'demo0000-lead-0000-0000-000000000024', organization_id: DEMO_ORG_ID, name: 'Felipe Machado', company: 'Machado Varejo', phone: '(61) 93210-4567', email: 'felipe@machadovarejo.com.br', source_id: demoSources[0].id, status: 'lost', assigned_to: DEMO_USER_3_ID, potential_value: 25000, notes: 'Não respondeu mais', last_contact_at: daysAgo(20), next_followup_at: null, created_by: DEMO_USER_3_ID, created_at: daysAgo(32), updated_at: daysAgo(20), source: demoSources[0], assigned_user: demoProfiles[2], tags: [demoTags[2]] },
  { id: 'demo0000-lead-0000-0000-000000000025', organization_id: DEMO_ORG_ID, name: 'Letícia Ramos', company: 'Ramos Educação', phone: '(71) 92109-5678', email: 'leticia@ramosedu.com.br', source_id: demoSources[5].id, status: 'negotiation', assigned_to: DEMO_USER_ID, potential_value: 39000, notes: 'Escola com 1200 alunos', last_contact_at: daysAgo(0), next_followup_at: daysAgo(-2), created_by: DEMO_USER_ID, created_at: daysAgo(14), updated_at: daysAgo(0), source: demoSources[5], assigned_user: demoProfiles[0], tags: [demoTags[0], demoTags[1]] },
];

// ===== Customers (12) =====
export const demoCustomers: Customer[] = [
  { id: 'demo0000-cust-0000-0000-000000000001', organization_id: DEMO_ORG_ID, name: 'Fernando Costa', company: 'Costa Seguros', phone: '(61) 93210-9876', whatsapp: '(61) 93210-9876', email: 'fernando@costaseguros.com.br', document: '12.345.678/0001-90', address: { street: 'Rua das Flores', number: '123', complement: 'Sala 4', neighborhood: 'Centro', city: 'Brasília', state: 'DF', zip: '70000-000' }, assigned_to: DEMO_USER_2_ID, notes: 'Cliente desde jan/2024', created_by: DEMO_USER_2_ID, created_at: daysAgo(25), updated_at: daysAgo(5), assigned_user: demoProfiles[1], tags: [demoTags[0]] },
  { id: 'demo0000-cust-0000-0000-000000000002', organization_id: DEMO_ORG_ID, name: 'Tatiane Cardoso', company: 'TC Moda', phone: '(41) 96543-3456', whatsapp: '(41) 96543-3456', email: 'tatiane@tcmoda.com.br', document: '98.765.432/0001-10', address: null, assigned_to: DEMO_USER_ID, notes: 'Plano básico anual', created_by: DEMO_USER_ID, created_at: daysAgo(27), updated_at: daysAgo(8), assigned_user: demoProfiles[0], tags: [demoTags[0]] },
  { id: 'demo0000-cust-0000-0000-000000000003', organization_id: DEMO_ORG_ID, name: 'Camila Freitas', company: 'Freitas Design', phone: '(81) 92109-7890', whatsapp: '(81) 92109-7890', email: 'camila@freitasdesign.com.br', document: null, address: null, assigned_to: DEMO_USER_3_ID, notes: 'Contrato anual renovado', created_by: DEMO_USER_3_ID, created_at: daysAgo(28), updated_at: daysAgo(12), assigned_user: demoProfiles[2], tags: [demoTags[3]] },
  { id: 'demo0000-cust-0000-0000-000000000004', organization_id: DEMO_ORG_ID, name: 'Gustavo Lima', company: 'Lima Transportes', phone: '(41) 95432-2345', whatsapp: '(41) 95432-2345', email: 'gustavo@limatransportes.com.br', document: '11.222.333/0001-44', address: { street: 'Av. Brasil', number: '4500', complement: '', neighborhood: 'Industrial', city: 'Curitiba', state: 'PR', zip: '80000-000' }, assigned_to: DEMO_USER_2_ID, notes: 'Plano Pro - maior cliente', created_by: DEMO_USER_2_ID, created_at: daysAgo(40), updated_at: daysAgo(3), assigned_user: demoProfiles[1], tags: [demoTags[0]] },
  { id: 'demo0000-cust-0000-0000-000000000005', organization_id: DEMO_ORG_ID, name: 'Marcos Vieira', company: 'Vieira Imóveis', phone: '(11) 99876-5432', whatsapp: '(11) 99876-5432', email: 'marcos@vieiraimoveis.com.br', document: '55.666.777/0001-88', address: { street: 'Rua Augusta', number: '2500', complement: '14º andar', neighborhood: 'Cerqueira César', city: 'São Paulo', state: 'SP', zip: '01413-100' }, assigned_to: DEMO_USER_ID, notes: 'Imobiliária premium', created_by: DEMO_USER_ID, created_at: daysAgo(50), updated_at: daysAgo(4), assigned_user: demoProfiles[0], tags: [demoTags[0], demoTags[3]] },
  { id: 'demo0000-cust-0000-0000-000000000006', organization_id: DEMO_ORG_ID, name: 'Regina Oliveira', company: 'RO Advocacia', phone: '(11) 98111-2222', whatsapp: '(11) 98111-2222', email: 'regina@roadvocacia.com.br', document: '123.456.789-00', address: null, assigned_to: DEMO_USER_2_ID, notes: 'Escritório de advocacia trabalhista', created_by: DEMO_USER_2_ID, created_at: daysAgo(60), updated_at: daysAgo(10), assigned_user: demoProfiles[1], tags: [] },
  { id: 'demo0000-cust-0000-0000-000000000007', organization_id: DEMO_ORG_ID, name: 'André Lopes', company: 'Lopes Odonto', phone: '(21) 97333-4444', whatsapp: '(21) 97333-4444', email: 'andre@lopesodonto.com.br', document: null, address: null, assigned_to: DEMO_USER_3_ID, notes: 'Clínica odontológica com 2 dentistas', created_by: DEMO_USER_3_ID, created_at: daysAgo(55), updated_at: daysAgo(7), assigned_user: demoProfiles[2], tags: [] },
  { id: 'demo0000-cust-0000-0000-000000000008', organization_id: DEMO_ORG_ID, name: 'Sandra Nunes', company: 'Nunes Contabilidade', phone: '(31) 96555-6666', whatsapp: '(31) 96555-6666', email: 'sandra@nunescontabil.com.br', document: '44.555.666/0001-77', address: { street: 'Rua Rio de Janeiro', number: '900', complement: 'Sala 302', neighborhood: 'Centro', city: 'Belo Horizonte', state: 'MG', zip: '30160-040' }, assigned_to: DEMO_USER_ID, notes: 'Contabilidade com 30+ clientes', created_by: DEMO_USER_ID, created_at: daysAgo(70), updated_at: daysAgo(15), assigned_user: demoProfiles[0], tags: [demoTags[0]] },
  { id: 'demo0000-cust-0000-0000-000000000009', organization_id: DEMO_ORG_ID, name: 'Paulo Henrique', company: 'PH Automóveis', phone: '(51) 95777-8888', whatsapp: '(51) 95777-8888', email: 'paulo@phautomóveis.com.br', document: null, address: null, assigned_to: DEMO_USER_2_ID, notes: 'Concessionária com 3 lojas', created_by: DEMO_USER_2_ID, created_at: daysAgo(45), updated_at: daysAgo(6), assigned_user: demoProfiles[1], tags: [demoTags[0]] },
  { id: 'demo0000-cust-0000-0000-000000000010', organization_id: DEMO_ORG_ID, name: 'Fernanda Azevedo', company: 'FA Fotografia', phone: '(41) 94999-0000', whatsapp: '(41) 94999-0000', email: 'fernanda@fafoto.com.br', document: '111.222.333-44', address: null, assigned_to: DEMO_USER_3_ID, notes: 'Fotógrafa de casamentos', created_by: DEMO_USER_3_ID, created_at: daysAgo(38), updated_at: daysAgo(9), assigned_user: demoProfiles[2], tags: [] },
  { id: 'demo0000-cust-0000-0000-000000000011', organization_id: DEMO_ORG_ID, name: 'Lucas Teixeira', company: 'Teixeira Elétrica', phone: '(61) 93111-2222', whatsapp: '(61) 93111-2222', email: 'lucas@teixeiraeletrica.com.br', document: '77.888.999/0001-55', address: null, assigned_to: DEMO_USER_ID, notes: 'Material elétrico e instalações', created_by: DEMO_USER_ID, created_at: daysAgo(33), updated_at: daysAgo(11), assigned_user: demoProfiles[0], tags: [] },
  { id: 'demo0000-cust-0000-0000-000000000012', organization_id: DEMO_ORG_ID, name: 'Simone Barros', company: 'Barros Alimentos', phone: '(71) 92333-4444', whatsapp: '(71) 92333-4444', email: 'simone@barrosalimentos.com.br', document: '22.333.444/0001-66', address: { street: 'Rua da Bahia', number: '1500', complement: '', neighborhood: 'Comércio', city: 'Salvador', state: 'BA', zip: '40015-000' }, assigned_to: DEMO_USER_2_ID, notes: 'Distribuidora de alimentos', created_by: DEMO_USER_2_ID, created_at: daysAgo(42), updated_at: daysAgo(2), assigned_user: demoProfiles[1], tags: [demoTags[0]] },
];

// ===== Deals (15) =====
export const demoDeals: Deal[] = [
  { id: 'demo0000-deal-0000-0000-000000000001', organization_id: DEMO_ORG_ID, title: 'CRM para Costa Seguros', customer_id: demoCustomers[0].id, lead_id: demoLeads[5].id, assigned_to: DEMO_USER_2_ID, stage_id: demoStages[5].id, value: 18000, probability: 100, expected_close_date: daysAgo(5).split('T')[0], notes: 'Contrato assinado', last_activity_at: daysAgo(5), next_followup_at: null, lost_reason: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(25), updated_at: daysAgo(5), customer: demoCustomers[0], stage: demoStages[5], assigned_user: demoProfiles[1] },
  { id: 'demo0000-deal-0000-0000-000000000002', organization_id: DEMO_ORG_ID, title: 'Sistema TC Moda', customer_id: demoCustomers[1].id, lead_id: demoLeads[12].id, assigned_to: DEMO_USER_ID, stage_id: demoStages[5].id, value: 16500, probability: 100, expected_close_date: daysAgo(8).split('T')[0], notes: 'Plano básico', last_activity_at: daysAgo(8), next_followup_at: null, lost_reason: null, created_by: DEMO_USER_ID, created_at: daysAgo(30), updated_at: daysAgo(8), customer: demoCustomers[1], stage: demoStages[5], assigned_user: demoProfiles[0] },
  { id: 'demo0000-deal-0000-0000-000000000003', organization_id: DEMO_ORG_ID, title: 'Projeto Freitas Design', customer_id: demoCustomers[2].id, lead_id: demoLeads[16].id, assigned_to: DEMO_USER_3_ID, stage_id: demoStages[5].id, value: 21000, probability: 100, expected_close_date: daysAgo(12).split('T')[0], notes: 'Anual', last_activity_at: daysAgo(12), next_followup_at: null, lost_reason: null, created_by: DEMO_USER_3_ID, created_at: daysAgo(35), updated_at: daysAgo(12), customer: demoCustomers[2], stage: demoStages[5], assigned_user: demoProfiles[2] },
  { id: 'demo0000-deal-0000-0000-000000000004', organization_id: DEMO_ORG_ID, title: 'CRM Lima Transportes', customer_id: demoCustomers[3].id, lead_id: demoLeads[21].id, assigned_to: DEMO_USER_2_ID, stage_id: demoStages[5].id, value: 48000, probability: 100, expected_close_date: daysAgo(3).split('T')[0], notes: 'Plano Pro', last_activity_at: daysAgo(3), next_followup_at: null, lost_reason: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(40), updated_at: daysAgo(3), customer: demoCustomers[3], stage: demoStages[5], assigned_user: demoProfiles[1] },
  { id: 'demo0000-deal-0000-0000-000000000005', organization_id: DEMO_ORG_ID, title: 'Proposta JP Construções', customer_id: null, lead_id: demoLeads[1].id, assigned_to: DEMO_USER_2_ID, stage_id: demoStages[3].id, value: 45000, probability: 60, expected_close_date: daysAgo(-10).split('T')[0], notes: 'Proposta enviada, aguardando resposta', last_activity_at: daysAgo(1), next_followup_at: daysAgo(-2), lost_reason: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(5), updated_at: daysAgo(1), stage: demoStages[3], assigned_user: demoProfiles[1] },
  { id: 'demo0000-deal-0000-0000-000000000006', organization_id: DEMO_ORG_ID, title: 'Negociação LB Consultoria', customer_id: null, lead_id: demoLeads[4].id, assigned_to: DEMO_USER_ID, stage_id: demoStages[4].id, value: 52000, probability: 75, expected_close_date: daysAgo(-5).split('T')[0], notes: 'Negociando desconto', last_activity_at: daysAgo(1), next_followup_at: daysAgo(-1), lost_reason: null, created_by: DEMO_USER_ID, created_at: daysAgo(15), updated_at: daysAgo(1), stage: demoStages[4], assigned_user: demoProfiles[0] },
  { id: 'demo0000-deal-0000-0000-000000000007', organization_id: DEMO_ORG_ID, title: 'Qualificação Vieira Imóveis', customer_id: demoCustomers[4].id, lead_id: demoLeads[9].id, assigned_to: DEMO_USER_3_ID, stage_id: demoStages[2].id, value: 65000, probability: 40, expected_close_date: daysAgo(-15).split('T')[0], notes: 'Potencial alto, precisa de demo', last_activity_at: daysAgo(4), next_followup_at: daysAgo(-2), lost_reason: null, created_by: DEMO_USER_ID, created_at: daysAgo(10), updated_at: daysAgo(4), customer: demoCustomers[4], stage: demoStages[2], assigned_user: demoProfiles[2] },
  { id: 'demo0000-deal-0000-0000-000000000008', organization_id: DEMO_ORG_ID, title: 'Proposta BN Logística', customer_id: null, lead_id: demoLeads[11].id, assigned_to: DEMO_USER_2_ID, stage_id: demoStages[3].id, value: 42000, probability: 55, expected_close_date: daysAgo(-7).split('T')[0], notes: 'Proposta enviada', last_activity_at: daysAgo(1), next_followup_at: daysAgo(-3), lost_reason: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(12), updated_at: daysAgo(1), stage: demoStages[3], assigned_user: demoProfiles[1] },
  { id: 'demo0000-deal-0000-0000-000000000009', organization_id: DEMO_ORG_ID, title: 'Negociação VG Contabilidade', customer_id: null, lead_id: demoLeads[14].id, assigned_to: DEMO_USER_2_ID, stage_id: demoStages[4].id, value: 27500, probability: 70, expected_close_date: daysAgo(-3).split('T')[0], notes: 'Pediu 10% de desconto', last_activity_at: daysAgo(2), next_followup_at: daysAgo(0), lost_reason: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(18), updated_at: daysAgo(2), stage: demoStages[4], assigned_user: demoProfiles[1] },
  { id: 'demo0000-deal-0000-0000-000000000010', organization_id: DEMO_ORG_ID, title: 'Primeiro contato CM Digital', customer_id: null, lead_id: demoLeads[2].id, assigned_to: DEMO_USER_ID, stage_id: demoStages[1].id, value: 28000, probability: 25, expected_close_date: daysAgo(-20).split('T')[0], notes: 'Agendar reunião', last_activity_at: daysAgo(3), next_followup_at: daysAgo(0), lost_reason: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(8), updated_at: daysAgo(3), stage: demoStages[1], assigned_user: demoProfiles[0] },
  { id: 'demo0000-deal-0000-0000-000000000011', organization_id: DEMO_ORG_ID, title: 'Negociação Ramos Educação', customer_id: null, lead_id: demoLeads[24].id, assigned_to: DEMO_USER_ID, stage_id: demoStages[4].id, value: 39000, probability: 80, expected_close_date: daysAgo(-4).split('T')[0], notes: 'Quase fechando', last_activity_at: daysAgo(0), next_followup_at: daysAgo(-2), lost_reason: null, created_by: DEMO_USER_ID, created_at: daysAgo(10), updated_at: daysAgo(0), stage: demoStages[4], assigned_user: demoProfiles[0] },
  { id: 'demo0000-deal-0000-0000-000000000012', organization_id: DEMO_ORG_ID, title: 'Proposta Almeida & Filhos', customer_id: null, lead_id: demoLeads[3].id, assigned_to: DEMO_USER_3_ID, stage_id: demoStages[3].id, value: 35000, probability: 50, expected_close_date: daysAgo(-8).split('T')[0], notes: 'Aguardando aprovação do sócio', last_activity_at: daysAgo(2), next_followup_at: daysAgo(-3), lost_reason: null, created_by: DEMO_USER_3_ID, created_at: daysAgo(10), updated_at: daysAgo(2), stage: demoStages[3], assigned_user: demoProfiles[2] },
  { id: 'demo0000-deal-0000-0000-000000000013', organization_id: DEMO_ORG_ID, title: 'Proposta Dias Turismo', customer_id: null, lead_id: demoLeads[20].id, assigned_to: DEMO_USER_ID, stage_id: demoStages[3].id, value: 14000, probability: 45, expected_close_date: daysAgo(-6).split('T')[0], notes: 'Agência de viagens', last_activity_at: daysAgo(4), next_followup_at: daysAgo(-2), lost_reason: null, created_by: DEMO_USER_ID, created_at: daysAgo(12), updated_at: daysAgo(4), stage: demoStages[3], assigned_user: demoProfiles[0] },
  { id: 'demo0000-deal-0000-0000-000000000014', organization_id: DEMO_ORG_ID, title: 'Lead Lima Odontologia - Perdido', customer_id: null, lead_id: demoLeads[6].id, assigned_to: DEMO_USER_3_ID, stage_id: demoStages[6].id, value: 12000, probability: 0, expected_close_date: daysAgo(10).split('T')[0], notes: 'Escolheu concorrente', last_activity_at: daysAgo(10), next_followup_at: null, lost_reason: 'Escolheu outro fornecedor', created_by: DEMO_USER_ID, created_at: daysAgo(20), updated_at: daysAgo(10), stage: demoStages[6], assigned_user: demoProfiles[2] },
  { id: 'demo0000-deal-0000-0000-000000000015', organization_id: DEMO_ORG_ID, title: 'Novo lead Araujo Clínicas', customer_id: null, lead_id: demoLeads[22].id, assigned_to: DEMO_USER_ID, stage_id: demoStages[0].id, value: 33000, probability: 15, expected_close_date: daysAgo(-25).split('T')[0], notes: 'Rede de clínicas interessada', last_activity_at: daysAgo(1), next_followup_at: daysAgo(0), lost_reason: null, created_by: DEMO_USER_ID, created_at: daysAgo(3), updated_at: daysAgo(1), stage: demoStages[0], assigned_user: demoProfiles[0] },
];

// ===== Activities (30+) =====
export const demoActivities: Activity[] = [
  { id: 'demo0000-act0-0000-0000-000000000001', organization_id: DEMO_ORG_ID, type: 'call', description: 'Ligação inicial para apresentar o sistema', customer_id: demoCustomers[0].id, lead_id: demoLeads[5].id, deal_id: demoDeals[0].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(25), created_at: daysAgo(25), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000002', organization_id: DEMO_ORG_ID, type: 'meeting', description: 'Reunião de demonstração do CRM', customer_id: demoCustomers[0].id, lead_id: demoLeads[5].id, deal_id: demoDeals[0].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(20), created_at: daysAgo(20), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000003', organization_id: DEMO_ORG_ID, type: 'proposal', description: 'Proposta comercial enviada - Plano Básico R$ 18.000/ano', customer_id: demoCustomers[0].id, lead_id: demoLeads[5].id, deal_id: demoDeals[0].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(15), created_at: daysAgo(15), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000004', organization_id: DEMO_ORG_ID, type: 'whatsapp', description: 'Enviada mensagem de follow-up sobre a proposta', customer_id: demoCustomers[0].id, lead_id: demoLeads[5].id, deal_id: demoDeals[0].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(10), created_at: daysAgo(10), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000005', organization_id: DEMO_ORG_ID, type: 'note', description: 'Cliente confirmou assinatura do contrato', customer_id: demoCustomers[0].id, lead_id: demoLeads[5].id, deal_id: demoDeals[0].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(5), created_at: daysAgo(5), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000006', organization_id: DEMO_ORG_ID, type: 'call', description: 'Primeiro contato com lead JP Construções', customer_id: null, lead_id: demoLeads[1].id, deal_id: demoDeals[4].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(4), created_at: daysAgo(4), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000007', organization_id: DEMO_ORG_ID, type: 'email', description: 'E-mail com apresentação da empresa e portfólio', customer_id: null, lead_id: demoLeads[1].id, deal_id: demoDeals[4].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(3), created_at: daysAgo(3), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000008', organization_id: DEMO_ORG_ID, type: 'proposal', description: 'Proposta comercial enviada R$ 45.000', customer_id: null, lead_id: demoLeads[1].id, deal_id: demoDeals[4].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(1), created_at: daysAgo(1), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000009', organization_id: DEMO_ORG_ID, type: 'whatsapp', description: 'Mensagem no WhatsApp discutindo valores e condições', customer_id: null, lead_id: demoLeads[4].id, deal_id: demoDeals[5].id, performed_by: DEMO_USER_ID, performed_at: daysAgo(1), created_at: daysAgo(1), performer: demoProfiles[0] },
  { id: 'demo0000-act0-0000-0000-000000000010', organization_id: DEMO_ORG_ID, type: 'meeting', description: 'Reunião online para apresentar funcionalidades avançadas', customer_id: demoCustomers[3].id, lead_id: demoLeads[21].id, deal_id: demoDeals[3].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(7), created_at: daysAgo(7), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000011', organization_id: DEMO_ORG_ID, type: 'call', description: 'Ligação de follow-up - Negociação avançada', customer_id: null, lead_id: demoLeads[24].id, deal_id: demoDeals[10].id, performed_by: DEMO_USER_ID, performed_at: daysAgo(0), created_at: daysAgo(0), performer: demoProfiles[0] },
  { id: 'demo0000-act0-0000-0000-000000000012', organization_id: DEMO_ORG_ID, type: 'email', description: 'Enviado material institucional por e-mail', customer_id: null, lead_id: demoLeads[2].id, deal_id: demoDeals[9].id, performed_by: DEMO_USER_ID, performed_at: daysAgo(3), created_at: daysAgo(3), performer: demoProfiles[0] },
  { id: 'demo0000-act0-0000-0000-000000000013', organization_id: DEMO_ORG_ID, type: 'whatsapp', description: 'Follow-up por WhatsApp sobre interesse no sistema', customer_id: null, lead_id: demoLeads[8].id, deal_id: null, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(2), created_at: daysAgo(2), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000014', organization_id: DEMO_ORG_ID, type: 'note', description: 'Cliente demonstrou muito interesse, agendar demo para próxima semana', customer_id: demoCustomers[4].id, lead_id: demoLeads[9].id, deal_id: demoDeals[6].id, performed_by: DEMO_USER_3_ID, performed_at: daysAgo(4), created_at: daysAgo(4), performer: demoProfiles[2] },
  { id: 'demo0000-act0-0000-0000-000000000015', organization_id: DEMO_ORG_ID, type: 'call', description: 'Ligação de boas-vindas para novo cliente', customer_id: demoCustomers[1].id, lead_id: null, deal_id: null, performed_by: DEMO_USER_ID, performed_at: daysAgo(8), created_at: daysAgo(8), performer: demoProfiles[0] },
  { id: 'demo0000-act0-0000-0000-000000000016', organization_id: DEMO_ORG_ID, type: 'meeting', description: 'Onboarding do sistema para equipe do cliente', customer_id: demoCustomers[3].id, lead_id: null, deal_id: null, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(2), created_at: daysAgo(2), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000017', organization_id: DEMO_ORG_ID, type: 'whatsapp', description: 'Envio de tutorial de uso do sistema', customer_id: demoCustomers[2].id, lead_id: null, deal_id: null, performed_by: DEMO_USER_3_ID, performed_at: daysAgo(6), created_at: daysAgo(6), performer: demoProfiles[2] },
  { id: 'demo0000-act0-0000-0000-000000000018', organization_id: DEMO_ORG_ID, type: 'call', description: 'Ligação para Araujo Clínicas - primeiro contato', customer_id: null, lead_id: demoLeads[22].id, deal_id: demoDeals[14].id, performed_by: DEMO_USER_ID, performed_at: daysAgo(1), created_at: daysAgo(1), performer: demoProfiles[0] },
  { id: 'demo0000-act0-0000-0000-000000000019', organization_id: DEMO_ORG_ID, type: 'proposal', description: 'Proposta BN Logística - R$ 42.000 plano Pro', customer_id: null, lead_id: demoLeads[11].id, deal_id: demoDeals[7].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(1), created_at: daysAgo(1), performer: demoProfiles[1] },
  { id: 'demo0000-act0-0000-0000-000000000020', organization_id: DEMO_ORG_ID, type: 'email', description: 'E-mail com case de sucesso para VG Contabilidade', customer_id: null, lead_id: demoLeads[14].id, deal_id: demoDeals[8].id, performed_by: DEMO_USER_2_ID, performed_at: daysAgo(2), created_at: daysAgo(2), performer: demoProfiles[1] },
];

// ===== Tasks (20) =====
export const demoTasks: Task[] = [
  { id: 'demo0000-task-0000-0000-000000000001', organization_id: DEMO_ORG_ID, title: 'Ligar para Maria Fernandes', description: 'Primeiro contato com lead nova', assigned_to: DEMO_USER_ID, customer_id: null, deal_id: null, lead_id: demoLeads[0].id, due_date: daysAgo(0).split('T')[0], due_time: '10:00', priority: 'high', status: 'pending', completed_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(2), updated_at: daysAgo(2), assigned_user: demoProfiles[0] },
  { id: 'demo0000-task-0000-0000-000000000002', organization_id: DEMO_ORG_ID, title: 'Enviar proposta JP Construções', description: 'Preparar e enviar proposta comercial detalhada', assigned_to: DEMO_USER_2_ID, customer_id: null, deal_id: demoDeals[4].id, lead_id: demoLeads[1].id, due_date: daysAgo(-1).split('T')[0], due_time: '14:00', priority: 'high', status: 'completed', completed_at: daysAgo(1), created_by: DEMO_USER_2_ID, created_at: daysAgo(4), updated_at: daysAgo(1), assigned_user: demoProfiles[1] },
  { id: 'demo0000-task-0000-0000-000000000003', organization_id: DEMO_ORG_ID, title: 'Follow-up CM Digital', description: 'Retornar ligação sobre interesse', assigned_to: DEMO_USER_ID, customer_id: null, deal_id: demoDeals[9].id, lead_id: demoLeads[2].id, due_date: daysAgo(0).split('T')[0], due_time: '11:00', priority: 'medium', status: 'pending', completed_at: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(3), updated_at: daysAgo(3), assigned_user: demoProfiles[0] },
  { id: 'demo0000-task-0000-0000-000000000004', organization_id: DEMO_ORG_ID, title: 'Agendar demo Vieira Imóveis', description: 'Demonstração do sistema para toda a equipe', assigned_to: DEMO_USER_3_ID, customer_id: demoCustomers[4].id, deal_id: demoDeals[6].id, lead_id: demoLeads[9].id, due_date: daysAgo(-2).split('T')[0], due_time: '15:00', priority: 'high', status: 'in_progress', completed_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(4), updated_at: daysAgo(1), assigned_user: demoProfiles[2] },
  { id: 'demo0000-task-0000-0000-000000000005', organization_id: DEMO_ORG_ID, title: 'Reunião com Lucia Barbosa', description: 'Reunião para finalizar negociação e termos do contrato', assigned_to: DEMO_USER_ID, customer_id: null, deal_id: demoDeals[5].id, lead_id: demoLeads[4].id, due_date: daysAgo(0).split('T')[0], due_time: '16:00', priority: 'high', status: 'pending', completed_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(2), updated_at: daysAgo(2), assigned_user: demoProfiles[0] },
  { id: 'demo0000-task-0000-0000-000000000006', organization_id: DEMO_ORG_ID, title: 'Ligar Amanda Rocha', description: 'Continuar conversa sobre necessidades do CRM', assigned_to: DEMO_USER_2_ID, customer_id: null, deal_id: null, lead_id: demoLeads[8].id, due_date: daysAgo(0).split('T')[0], due_time: '09:00', priority: 'medium', status: 'pending', completed_at: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(2), updated_at: daysAgo(2), assigned_user: demoProfiles[1] },
  { id: 'demo0000-task-0000-0000-000000000007', organization_id: DEMO_ORG_ID, title: 'Follow-up proposta Almeida & Filhos', description: 'Verificar se o sócio aprovou a proposta', assigned_to: DEMO_USER_3_ID, customer_id: null, deal_id: demoDeals[11].id, lead_id: demoLeads[3].id, due_date: daysAgo(1).split('T')[0], due_time: '10:00', priority: 'high', status: 'pending', completed_at: null, created_by: DEMO_USER_3_ID, created_at: daysAgo(3), updated_at: daysAgo(3), assigned_user: demoProfiles[2] },
  { id: 'demo0000-task-0000-0000-000000000008', organization_id: DEMO_ORG_ID, title: 'Preparar relatório mensal', description: 'Compilar relatório de vendas do mês', assigned_to: DEMO_USER_ID, customer_id: null, deal_id: null, lead_id: null, due_date: daysAgo(-5).split('T')[0], due_time: null, priority: 'medium', status: 'pending', completed_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(5), updated_at: daysAgo(5), assigned_user: demoProfiles[0] },
  { id: 'demo0000-task-0000-0000-000000000009', organization_id: DEMO_ORG_ID, title: 'Onboarding Costa Seguros', description: 'Treinamento inicial do sistema para o cliente', assigned_to: DEMO_USER_2_ID, customer_id: demoCustomers[0].id, deal_id: demoDeals[0].id, lead_id: null, due_date: daysAgo(3).split('T')[0], due_time: '14:00', priority: 'high', status: 'completed', completed_at: daysAgo(3), created_by: DEMO_USER_2_ID, created_at: daysAgo(5), updated_at: daysAgo(3), assigned_user: demoProfiles[1] },
  { id: 'demo0000-task-0000-0000-000000000010', organization_id: DEMO_ORG_ID, title: 'Enviar contrato TC Moda', description: 'Enviar contrato para assinatura digital', assigned_to: DEMO_USER_ID, customer_id: demoCustomers[1].id, deal_id: demoDeals[1].id, lead_id: null, due_date: daysAgo(7).split('T')[0], due_time: '10:00', priority: 'high', status: 'completed', completed_at: daysAgo(7), created_by: DEMO_USER_ID, created_at: daysAgo(9), updated_at: daysAgo(7), assigned_user: demoProfiles[0] },
  { id: 'demo0000-task-0000-0000-000000000011', organization_id: DEMO_ORG_ID, title: 'Follow-up VG Contabilidade', description: 'Responder sobre desconto solicitado', assigned_to: DEMO_USER_2_ID, customer_id: null, deal_id: demoDeals[8].id, lead_id: demoLeads[14].id, due_date: daysAgo(0).split('T')[0], due_time: '11:30', priority: 'high', status: 'in_progress', completed_at: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(2), updated_at: daysAgo(0), assigned_user: demoProfiles[1] },
  { id: 'demo0000-task-0000-0000-000000000012', organization_id: DEMO_ORG_ID, title: 'Contatar Ricardo Souza', description: 'Primeiro contato com lead do Facebook', assigned_to: DEMO_USER_ID, customer_id: null, deal_id: null, lead_id: demoLeads[7].id, due_date: daysAgo(-1).split('T')[0], due_time: '09:30', priority: 'medium', status: 'pending', completed_at: null, created_by: DEMO_USER_ID, created_at: daysAgo(1), updated_at: daysAgo(1), assigned_user: demoProfiles[0] },
  { id: 'demo0000-task-0000-0000-000000000013', organization_id: DEMO_ORG_ID, title: 'Enviar case de sucesso para Diego', description: 'Preparar material com cases similares', assigned_to: DEMO_USER_3_ID, customer_id: null, deal_id: null, lead_id: demoLeads[13].id, due_date: daysAgo(-1).split('T')[0], due_time: '14:00', priority: 'low', status: 'pending', completed_at: null, created_by: DEMO_USER_3_ID, created_at: daysAgo(3), updated_at: daysAgo(3), assigned_user: demoProfiles[2] },
  { id: 'demo0000-task-0000-0000-000000000014', organization_id: DEMO_ORG_ID, title: 'Revisar proposta BN Logística', description: 'Ajustar valores conforme feedback', assigned_to: DEMO_USER_2_ID, customer_id: null, deal_id: demoDeals[7].id, lead_id: demoLeads[11].id, due_date: daysAgo(2).split('T')[0], due_time: null, priority: 'high', status: 'completed', completed_at: daysAgo(1), created_by: DEMO_USER_2_ID, created_at: daysAgo(3), updated_at: daysAgo(1), assigned_user: demoProfiles[1] },
  { id: 'demo0000-task-0000-0000-000000000015', organization_id: DEMO_ORG_ID, title: 'Acompanhar Daniela Castro', description: 'Verificar andamento da integração com e-commerce', assigned_to: DEMO_USER_2_ID, customer_id: null, deal_id: null, lead_id: demoLeads[18].id, due_date: daysAgo(-2).split('T')[0], due_time: '16:00', priority: 'medium', status: 'pending', completed_at: null, created_by: DEMO_USER_2_ID, created_at: daysAgo(5), updated_at: daysAgo(5), assigned_user: demoProfiles[1] },
];

// ===== Notifications =====
export const demoNotifications: Notification[] = [
  { id: 'demo0000-notf-0000-0000-000000000001', organization_id: DEMO_ORG_ID, user_id: DEMO_USER_ID, type: 'overdue_followup', title: 'Follow-up atrasado', message: 'O follow-up com Roberto Almeida está atrasado há 2 dias', data: { lead_id: demoLeads[3].id }, is_read: false, created_at: daysAgo(0) },
  { id: 'demo0000-notf-0000-0000-000000000002', organization_id: DEMO_ORG_ID, user_id: DEMO_USER_ID, type: 'tasks_today', title: 'Tarefas para hoje', message: 'Você possui 3 tarefas para hoje', data: null, is_read: false, created_at: daysAgo(0) },
  { id: 'demo0000-notf-0000-0000-000000000003', organization_id: DEMO_ORG_ID, user_id: DEMO_USER_ID, type: 'deal_moved', title: 'Oportunidade movida', message: 'Ana moveu "CRM Lima Transportes" para Fechado', data: { deal_id: demoDeals[3].id }, is_read: false, created_at: daysAgo(1) },
  { id: 'demo0000-notf-0000-0000-000000000004', organization_id: DEMO_ORG_ID, user_id: DEMO_USER_ID, type: 'deal_assigned', title: 'Nova oportunidade', message: 'Nova oportunidade "Novo lead Araujo Clínicas" atribuída a você', data: { deal_id: demoDeals[14].id }, is_read: true, created_at: daysAgo(2) },
  { id: 'demo0000-notf-0000-0000-000000000005', organization_id: DEMO_ORG_ID, user_id: DEMO_USER_ID, type: 'lead_assigned', title: 'Novo lead', message: 'Lead "Eduardo Santos" atribuído a Pedro', data: { lead_id: demoLeads[19].id }, is_read: true, created_at: daysAgo(0) },
  { id: 'demo0000-notf-0000-0000-000000000006', organization_id: DEMO_ORG_ID, user_id: DEMO_USER_ID, type: 'general', title: 'Bem-vindo ao LeadFlow!', message: 'Configure seu perfil e comece a usar o CRM', data: null, is_read: true, created_at: daysAgo(30) },
];
