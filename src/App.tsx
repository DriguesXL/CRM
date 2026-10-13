import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { LeadsPage } from '@/pages/leads/LeadsPage';
import { LeadDetailPage } from '@/pages/leads/LeadDetailPage';
import { CustomersPage } from '@/pages/customers/CustomersPage';
import { CustomerDetailPage } from '@/pages/customers/CustomerDetailPage';
import { PipelinePage } from '@/pages/pipeline/PipelinePage';
import { TasksPage } from '@/pages/tasks/TasksPage';
import { ActivitiesPage } from '@/pages/activities/ActivitiesPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { TeamPage } from '@/pages/team/TeamPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { SuperAdminPage } from '@/pages/admin/SuperAdminPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<SuperAdminPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
