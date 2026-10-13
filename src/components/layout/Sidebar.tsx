import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Kanban,
  CheckSquare,
  History,
  TrendingUp,
  Settings,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { isSuperAdmin } = usePermissions();
  const { organization } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: UserPlus },
    { name: 'Clientes', href: '/customers', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: Kanban },
    { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
    { name: 'Atividades', href: '/activities', icon: History },
    { name: 'Relatórios', href: '/reports', icon: TrendingUp },
    { name: 'Equipe', href: '/team', icon: Users },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-xs">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-xs">
          LF
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900">LeadFlow</span>
          <span className="text-[11px] font-medium text-slate-400">CRM de Vendas</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {isSuperAdmin() && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Plataforma
            </span>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Super Admin</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Org Badge at Bottom */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700">
            <Building2 className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-slate-800 truncate">
              {organization?.name || 'Sua Empresa'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Plano Pro</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
