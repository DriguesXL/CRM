-- =============================================
-- LeadFlow CRM - Migration 014: Seed Demo Data
-- Execute no Supabase SQL Editor para popular com dados de teste
-- =============================================

DO $$
DECLARE
  v_org_id UUID := 'demo0000-org0-0000-0000-000000000001';
  v_stage_novo UUID;
  v_stage_contato UUID;
  v_stage_quali UUID;
  v_stage_prop UUID;
  v_stage_nego UUID;
  v_stage_fechado UUID;
  v_cust_1 UUID := gen_random_uuid();
  v_cust_2 UUID := gen_random_uuid();
  v_lead_1 UUID := gen_random_uuid();
  v_lead_2 UUID := gen_random_uuid();
BEGIN
  -- Cria organização demo se não existir
  INSERT INTO organizations (id, name, slug, plan, subscription_status)
  VALUES (v_org_id, 'TechStar Soluções', 'techstar-solucoes', 'pro', 'active')
  ON CONFLICT (id) DO NOTHING;

  -- Busca estágios
  SELECT id INTO v_stage_novo FROM pipeline_stages WHERE organization_id = v_org_id AND position = 0 LIMIT 1;
  SELECT id INTO v_stage_prop FROM pipeline_stages WHERE organization_id = v_org_id AND position = 3 LIMIT 1;
  SELECT id INTO v_stage_nego FROM pipeline_stages WHERE organization_id = v_org_id AND position = 4 LIMIT 1;
  SELECT id INTO v_stage_fechado FROM pipeline_stages WHERE organization_id = v_org_id AND position = 5 LIMIT 1;

  -- Insere Clientes
  INSERT INTO customers (id, organization_id, name, company, phone, email) VALUES
    (v_cust_1, v_org_id, 'Marcos Costa', 'Costa Seguros Ltda', '(11) 98765-4321', 'marcos@costaseguros.com.br'),
    (v_cust_2, v_org_id, 'Tatiana Castro', 'TC Moda & Estilo', '(21) 99887-1122', 'tatiana@tcmoda.com.br')
  ON CONFLICT DO NOTHING;

  -- Insere Leads
  INSERT INTO leads (id, organization_id, name, company, phone, email, status, potential_value) VALUES
    (v_lead_1, v_org_id, 'Juliana Prado', 'JP Construções', '(11) 97711-2233', 'juliana@jpconstrucoes.com.br', 'proposal', 45000),
    (v_lead_2, v_org_id, 'Lucia Barbosa', 'LB Consultoria', '(31) 98844-5566', 'lucia@lbconsultoria.com.br', 'negotiation', 52000)
  ON CONFLICT DO NOTHING;

  -- Insere Oportunidades (Deals)
  IF v_stage_fechado IS NOT NULL THEN
    INSERT INTO deals (organization_id, title, customer_id, stage_id, value) VALUES
      (v_org_id, 'Plano Anual Costa Seguros', v_cust_1, v_stage_fechado, 18000),
      (v_org_id, 'Implantação TC Moda', v_cust_2, v_stage_fechado, 16500)
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_stage_prop IS NOT NULL THEN
    INSERT INTO deals (organization_id, title, lead_id, stage_id, value) VALUES
      (v_org_id, 'Proposta Comercial JP Construções', v_lead_1, v_stage_prop, 45000)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insere Tarefas
  INSERT INTO tasks (organization_id, title, due_date, priority, status) VALUES
    (v_org_id, 'Follow-up proposta JP Construções', CURRENT_DATE, 'high', 'pending'),
    (v_org_id, 'Reunião de alinhamento TC Moda', CURRENT_DATE + INTERVAL '2 days', 'medium', 'pending')
  ON CONFLICT DO NOTHING;
END $$;
