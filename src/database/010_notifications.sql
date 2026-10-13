-- =============================================
-- LeadFlow CRM - Migration 010: Notifications
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('overdue_followup', 'tasks_today', 'deal_moved', 'deal_assigned', 'lead_assigned', 'task_assigned', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_org ON notifications(organization_id);
CREATE INDEX idx_notifications_created ON notifications(user_id, created_at DESC);
