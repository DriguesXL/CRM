-- =============================================
-- LeadFlow CRM - Migration 005: Customers
-- =============================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  document TEXT, -- CPF ou CNPJ
  address JSONB, -- {street, number, complement, neighborhood, city, state, zip}
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_org ON customers(organization_id);
CREATE INDEX idx_customers_assigned ON customers(organization_id, assigned_to);
CREATE INDEX idx_customers_created ON customers(organization_id, created_at);
