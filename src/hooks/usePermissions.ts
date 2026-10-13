import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { role, profile } = useAuth();

  const isAdmin = role === 'admin' || profile?.is_super_admin === true;
  const isManager = role === 'manager' || isAdmin;
  const isSeller = role === 'seller' || isManager;

  return {
    isAdmin,
    isManager,
    isSeller,
    canManageTeam: () => isAdmin,
    canEditSettings: () => isAdmin,
    canDeleteLead: () => isManager,
    canDeleteCustomer: () => isManager,
    canDeleteDeal: () => isManager,
    canExportReports: () => isManager,
    canAssignUsers: () => isManager,
    isSuperAdmin: () => profile?.is_super_admin === true,
  };
}
