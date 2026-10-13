-- =============================================
-- LeadFlow CRM - Migration 012: Functions & Triggers
-- =============================================

-- Trigger genérico para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger updated_at em todas as tabelas relevantes
CREATE TRIGGER set_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON pipeline_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function para criar pipeline padrão ao criar organização
CREATE OR REPLACE FUNCTION create_default_pipeline()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pipeline_stages (organization_id, name, position, color, is_default, is_won, is_lost) VALUES
    (NEW.id, 'Novo Lead', 0, '#6366f1', TRUE, FALSE, FALSE),
    (NEW.id, 'Primeiro Contato', 1, '#8b5cf6', FALSE, FALSE, FALSE),
    (NEW.id, 'Qualificação', 2, '#a855f7', FALSE, FALSE, FALSE),
    (NEW.id, 'Proposta', 3, '#f59e0b', FALSE, FALSE, FALSE),
    (NEW.id, 'Negociação', 4, '#f97316', FALSE, FALSE, FALSE),
    (NEW.id, 'Fechado', 5, '#22c55e', FALSE, TRUE, FALSE),
    (NEW.id, 'Perdido', 6, '#ef4444', FALSE, FALSE, TRUE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_org_created_pipeline
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_default_pipeline();

-- Function para criar origens padrão ao criar organização
CREATE OR REPLACE FUNCTION create_default_sources()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO lead_sources (organization_id, name, is_default) VALUES
    (NEW.id, 'WhatsApp', TRUE),
    (NEW.id, 'Instagram', TRUE),
    (NEW.id, 'Facebook', TRUE),
    (NEW.id, 'Site', TRUE),
    (NEW.id, 'Indicação', TRUE),
    (NEW.id, 'Google', TRUE),
    (NEW.id, 'Telefone', TRUE),
    (NEW.id, 'Outro', TRUE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_org_created_sources
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_default_sources();

-- Function para criar tags padrão ao criar organização
CREATE OR REPLACE FUNCTION create_default_tags()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tags (organization_id, name, color) VALUES
    (NEW.id, 'Cliente VIP', '#f59e0b'),
    (NEW.id, 'Lead Quente', '#ef4444'),
    (NEW.id, 'Lead Frio', '#3b82f6'),
    (NEW.id, 'Indicação', '#22c55e'),
    (NEW.id, 'Urgente', '#dc2626');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_org_created_tags
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_default_tags();

-- Function para auto-preencher organization_id (para completar o completar na task)
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_task_completed_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_completed_at();
