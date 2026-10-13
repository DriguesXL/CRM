-- =============================================
-- LeadFlow CRM - Migration 011: RLS Policies
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===== Helper function: pegar org_id do usuário atual =====
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = TRUE 
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ===== Helper function: verificar se é super admin =====
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM super_admins WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ===== Helper function: pegar role do usuário =====
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM organization_members 
  WHERE user_id = auth.uid() AND is_active = TRUE 
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- PROFILES
-- =============================================
CREATE POLICY profiles_select ON profiles FOR SELECT USING (TRUE);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- =============================================
-- SUPER ADMINS
-- =============================================
CREATE POLICY super_admins_select ON super_admins FOR SELECT USING (is_super_admin());
CREATE POLICY super_admins_all ON super_admins FOR ALL USING (is_super_admin());

-- =============================================
-- ORGANIZATIONS
-- =============================================
CREATE POLICY org_select ON organizations FOR SELECT USING (
  id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY org_update ON organizations FOR UPDATE USING (
  (id = get_user_org_id() AND get_user_role() = 'admin') OR is_super_admin()
);
CREATE POLICY org_insert ON organizations FOR INSERT WITH CHECK (TRUE);

-- =============================================
-- ORGANIZATION MEMBERS
-- =============================================
CREATE POLICY org_members_select ON organization_members FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY org_members_insert ON organization_members FOR INSERT WITH CHECK (
  organization_id = get_user_org_id() OR NOT EXISTS(SELECT 1 FROM organization_members WHERE user_id = auth.uid())
);
CREATE POLICY org_members_update ON organization_members FOR UPDATE USING (
  organization_id = get_user_org_id() AND (get_user_role() = 'admin' OR user_id = auth.uid())
);
CREATE POLICY org_members_delete ON organization_members FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() = 'admin'
);

-- =============================================
-- LEADS
-- =============================================
CREATE POLICY leads_select ON leads FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY leads_insert ON leads FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY leads_update ON leads FOR UPDATE USING (
  organization_id = get_user_org_id()
);
CREATE POLICY leads_delete ON leads FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);

-- =============================================
-- CUSTOMERS
-- =============================================
CREATE POLICY customers_select ON customers FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY customers_insert ON customers FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY customers_update ON customers FOR UPDATE USING (
  organization_id = get_user_org_id()
);
CREATE POLICY customers_delete ON customers FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);

-- =============================================
-- PIPELINE STAGES
-- =============================================
CREATE POLICY stages_select ON pipeline_stages FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY stages_insert ON pipeline_stages FOR INSERT WITH CHECK (
  organization_id = get_user_org_id() AND get_user_role() = 'admin'
);
CREATE POLICY stages_update ON pipeline_stages FOR UPDATE USING (
  organization_id = get_user_org_id() AND get_user_role() = 'admin'
);
CREATE POLICY stages_delete ON pipeline_stages FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() = 'admin'
);

-- =============================================
-- DEALS
-- =============================================
CREATE POLICY deals_select ON deals FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY deals_insert ON deals FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY deals_update ON deals FOR UPDATE USING (
  organization_id = get_user_org_id()
);
CREATE POLICY deals_delete ON deals FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);

-- =============================================
-- ACTIVITIES
-- =============================================
CREATE POLICY activities_select ON activities FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY activities_insert ON activities FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY activities_delete ON activities FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);

-- =============================================
-- TASKS
-- =============================================
CREATE POLICY tasks_select ON tasks FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY tasks_insert ON tasks FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY tasks_update ON tasks FOR UPDATE USING (
  organization_id = get_user_org_id()
);
CREATE POLICY tasks_delete ON tasks FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);

-- =============================================
-- TAGS
-- =============================================
CREATE POLICY tags_select ON tags FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY tags_insert ON tags FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY tags_update ON tags FOR UPDATE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);
CREATE POLICY tags_delete ON tags FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() = 'admin'
);

-- =============================================
-- LEAD_TAGS
-- =============================================
CREATE POLICY lead_tags_select ON lead_tags FOR SELECT USING (
  EXISTS(SELECT 1 FROM leads WHERE leads.id = lead_tags.lead_id AND leads.organization_id = get_user_org_id())
);
CREATE POLICY lead_tags_insert ON lead_tags FOR INSERT WITH CHECK (
  EXISTS(SELECT 1 FROM leads WHERE leads.id = lead_tags.lead_id AND leads.organization_id = get_user_org_id())
);
CREATE POLICY lead_tags_delete ON lead_tags FOR DELETE USING (
  EXISTS(SELECT 1 FROM leads WHERE leads.id = lead_tags.lead_id AND leads.organization_id = get_user_org_id())
);

-- =============================================
-- CUSTOMER_TAGS
-- =============================================
CREATE POLICY customer_tags_select ON customer_tags FOR SELECT USING (
  EXISTS(SELECT 1 FROM customers WHERE customers.id = customer_tags.customer_id AND customers.organization_id = get_user_org_id())
);
CREATE POLICY customer_tags_insert ON customer_tags FOR INSERT WITH CHECK (
  EXISTS(SELECT 1 FROM customers WHERE customers.id = customer_tags.customer_id AND customers.organization_id = get_user_org_id())
);
CREATE POLICY customer_tags_delete ON customer_tags FOR DELETE USING (
  EXISTS(SELECT 1 FROM customers WHERE customers.id = customer_tags.customer_id AND customers.organization_id = get_user_org_id())
);

-- =============================================
-- LEAD SOURCES
-- =============================================
CREATE POLICY sources_select ON lead_sources FOR SELECT USING (
  organization_id = get_user_org_id() OR is_super_admin()
);
CREATE POLICY sources_insert ON lead_sources FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY sources_update ON lead_sources FOR UPDATE USING (
  organization_id = get_user_org_id() AND get_user_role() IN ('admin', 'manager')
);
CREATE POLICY sources_delete ON lead_sources FOR DELETE USING (
  organization_id = get_user_org_id() AND get_user_role() = 'admin'
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE POLICY notifications_select ON notifications FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (
  organization_id = get_user_org_id()
);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (
  user_id = auth.uid()
);
CREATE POLICY notifications_delete ON notifications FOR DELETE USING (
  user_id = auth.uid()
);
