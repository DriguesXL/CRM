import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LeadFormModal } from '@/components/leads/LeadFormModal';

export const MainLayout: React.FC = () => {
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenNewLead={() => setIsNewLeadOpen(true)} />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Action Lead Modal */}
      <LeadFormModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSuccess={(newLead) => {
          navigate(`/leads/${newLead.id}`);
        }}
      />
    </div>
  );
};
