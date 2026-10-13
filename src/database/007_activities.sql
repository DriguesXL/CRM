-- =============================================
-- LeadFlow CRM - Migration 007: Activities
-- =============================================

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'email', 'meeting', 'note', 'proposal', 'other')),
  description TEXT NOT NULL DEFAULT '',
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_org ON activities(organization_id);
CREATE INDEX idx_activities_customer ON activities(organization_id, customer_id);
CREATE INDEX idx_activities_lead ON activities(organization_id, lead_id);
CREATE INDEX idx_activities_deal ON activities(organization_id, deal_id);
CREATE INDEX idx_activities_performed ON activities(organization_id, performed_at);
