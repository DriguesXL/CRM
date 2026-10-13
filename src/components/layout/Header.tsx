import React, { useState, useEffect } from 'react';
import { Bell, Search, Plus, LogOut, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { notificationsService } from '@/services/notifications';
import type { Notification } from '@/types';

interface HeaderProps {
  onOpenNewLead?: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewLead, onSearch }) => {
  const { profile, organization, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchNotes = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    await notificationsService.markAllAsRead();
    fetchNotes();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-xs">
      {/* Search Input */}
      <div className="relative flex w-96 items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar leads, clientes, oportunidades..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {onOpenNewLead && (
          <Button onClick={onOpenNewLead} size="sm" className="gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Lead</span>
          </Button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Notificações"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-sm font-semibold text-slate-800">Notificações</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Marcar todas lidas
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">Nenhuma notificação</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        n.is_read ? 'bg-slate-50 text-slate-500' : 'bg-blue-50/70 text-slate-800 border-l-2 border-blue-600'
                      }`}
                    >
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-slate-600 mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-white text-xs">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-medium text-slate-800 leading-tight">
                {profile?.full_name || 'Usuário'}
              </div>
              <div className="text-slate-400 text-[11px] leading-tight">
                {organization?.name || 'LeadFlow'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-semibold text-slate-800">{profile?.full_name}</div>
                <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
              </div>

              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair do sistema
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
