-- =============================================
-- LeadFlow CRM - Migration 015: workspace on signup
-- =============================================

-- Creates the first organization and admin membership for every new Auth user.
-- The function runs with database-owner privileges so it also works when
-- Supabase requires e-mail confirmation and no client session exists yet.
CREATE OR REPLACE FUNCTION handle_new_user_workspace()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_organization_id UUID;
  company_name TEXT;
BEGIN
  company_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'company_name', ''), 'Minha Empresa');

  INSERT INTO organizations (name, slug, email)
  VALUES (
    company_name,
    'org-' || REPLACE(NEW.id::TEXT, '-', ''),
    NEW.email
  )
  RETURNING id INTO new_organization_id;

  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (new_organization_id, NEW.id, 'admin');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created_workspace ON auth.users;
CREATE TRIGGER on_auth_user_created_workspace
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_workspace();