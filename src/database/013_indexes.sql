-- =============================================
-- LeadFlow CRM - Migration 013: Performance Indexes
-- =============================================

-- Indexes para Organization Members
CREATE INDEX IF NOT EXISTS idx_org_members_user_org ON organization_members(user_id, organization_id);

-- Indexes para Leads
CREATE INDEX IF NOT EXISTS idx_leads_org_status ON leads(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_org_assigned ON leads(organization_id, assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_org_created ON leads(organization_id, created_at DESC);

-- Indexes para Customers
CREATE INDEX IF NOT EXISTS idx_customers_org ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_org_name ON customers(organization_id, name);

-- Indexes para Pipeline Stages
CREATE INDEX IF NOT EXISTS idx_stages_org_pos ON pipeline_stages(organization_id, position);

-- Indexes para Deals
CREATE INDEX IF NOT EXISTS idx_deals_org_stage ON deals(organization_id, stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_org_assigned ON deals(organization_id, assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_org_customer ON deals(organization_id, customer_id);

-- Indexes para Activities
CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_customer ON activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_performed ON activities(performed_at DESC);

-- Indexes para Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_org_status_due ON tasks(organization_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_org_assigned ON tasks(organization_id, assigned_to);

-- Indexes para Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
