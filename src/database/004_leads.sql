-- =============================================
-- LeadFlow CRM - Migration 004: Leads
-- =============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  source_id UUID REFERENCES lead_sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  potential_value NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  last_contact_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_org ON leads(organization_id);
CREATE INDEX idx_leads_status ON leads(organization_id, status);
CREATE INDEX idx_leads_assigned ON leads(organization_id, assigned_to);
CREATE INDEX idx_leads_created ON leads(organization_id, created_at);
CREATE INDEX idx_leads_source ON leads(organization_id, source_id);
