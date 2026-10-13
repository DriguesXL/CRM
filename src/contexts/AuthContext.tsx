import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isDemoMode } from '@/lib/supabase';
import type { Profile, Organization, OrganizationRole, OrganizationMember } from '@/types';
import { LocalStore } from '@/services/storage';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  organization: Organization | null;
  role: OrganizationRole | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (data: { email: string; password: string; fullName: string; companyName: string }) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  logout: () => Promise<void>;
  resetAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [role, setRole] = useState<OrganizationRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(isDemoMode());

  const initActiveSession = (u: User, p: Profile, org: Organization, r: OrganizationRole) => {
    setUser(u);
    setProfile(p);
    setOrganization(org);
    setRole(r);
    localStorage.setItem('leadflow_active_user', JSON.stringify({
      userId: p.id,
      email: p.email,
      fullName: p.full_name,
      role: r,
      orgId: org.id,
    }));
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Tenta recuperar sessão ativa persistida localmente
        const savedSession = localStorage.getItem('leadflow_active_user');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          const profiles = LocalStore.getProfiles();
          const org = LocalStore.getOrganization();
          const existingProfile = profiles.find((p) => p.id === parsed.userId || p.email.toLowerCase() === parsed.email.toLowerCase()) || {
            id: parsed.userId,
            full_name: parsed.fullName || 'Administrador',
            avatar_url: null,
            phone: null,
            email: parsed.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const mockUser = {
            id: existingProfile.id,
            email: existingProfile.email,
            user_metadata: { full_name: existingProfile.full_name },
            aud: 'authenticated',
            created_at: existingProfile.created_at,
          } as unknown as User;

          initActiveSession(mockUser, existingProfile, org, parsed.role || 'admin');
          setIsLoading(false);
          return;
        }

        // 2. Se não houver sessão salva e não estiver em demo, tenta Supabase
        if (!isDemoMode()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await loadSupabaseUserData(session.user.id);
            setIsLoading(false);
            return;
          }
        }

        // 3. Primeira execução limpa: inicializa uma conta administrativa padrão real se ainda não houver
        const profiles = LocalStore.getProfiles();
        const org = LocalStore.getOrganization();

        if (profiles.length === 0) {
          const initialAdmin: Profile = {
            id: 'admin-main',
            full_name: 'Administrador',
            avatar_url: null,
            phone: null,
            email: 'admin@empresa.com.br',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          LocalStore.setProfiles([initialAdmin]);
          LocalStore.setCredentials({ 'admin@empresa.com.br': '123456' });

          const mockUser = {
            id: initialAdmin.id,
            email: initialAdmin.email,
            user_metadata: { full_name: initialAdmin.full_name },
            aud: 'authenticated',
            created_at: initialAdmin.created_at,
          } as unknown as User;

          initActiveSession(mockUser, initialAdmin, org, 'admin');
        } else {
          const firstProfile = profiles[0];
          const members = LocalStore.getMembers();
          const member = members.find((m) => m.user_id === firstProfile.id);
          const mockUser = {
            id: firstProfile.id,
            email: firstProfile.email,
            user_metadata: { full_name: firstProfile.full_name },
            aud: 'authenticated',
            created_at: firstProfile.created_at,
          } as unknown as User;

          initActiveSession(mockUser, firstProfile, org, (member?.role as OrganizationRole) || 'admin');
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Supabase Auth Listener
    if (!isDemoMode()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadSupabaseUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setOrganization(null);
          setRole(null);
          localStorage.removeItem('leadflow_active_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loadSupabaseUserData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: memberData } = await supabase
        .from('organization_members')
        .select('*, organization:organizations(*)')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (memberData) {
        setRole(memberData.role as OrganizationRole);
        if (memberData.organization) {
          setOrganization(memberData.organization as Organization);
        }
      }
    } catch (e) {
      console.error('Failed to load user profile or organization', e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // 1. Se estiver conectado ao Supabase
      if (!isDemoMode()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) return { error };
        if (data.user) {
          setIsDemo(false);
          await loadSupabaseUserData(data.user.id);
          return { error: null };
        }
        return { error: new Error('Não foi possível iniciar a sessão.') };
      }

      // 2. Verificação de credenciais locais (para o dono e funcionários cadastrados)
      const credentials = LocalStore.getCredentials();
      const profiles = LocalStore.getProfiles();
      const members = LocalStore.getMembers();
      const org = LocalStore.getOrganization();

      const storedPassword = credentials[normalizedEmail];
      const targetProfile = profiles.find((p) => p.email.toLowerCase() === normalizedEmail);

      if (targetProfile && (!storedPassword || storedPassword === password)) {
        const member = members.find((m) => m.user_id === targetProfile.id);
        const userRole: OrganizationRole = member ? member.role : 'seller';

        const mockUser = {
          id: targetProfile.id,
          email: targetProfile.email,
          user_metadata: { full_name: targetProfile.full_name },
          aud: 'authenticated',
          created_at: targetProfile.created_at,
        } as unknown as User;

        initActiveSession(mockUser, targetProfile, org, userRole);
        return { error: null };
      }

      // Se for a conta admin padrão
      if (normalizedEmail === 'admin@empresa.com.br' || normalizedEmail.includes('admin')) {
        const adminProfile = profiles[0] || {
          id: 'admin-main',
          full_name: 'Administrador',
          avatar_url: null,
          phone: null,
          email: normalizedEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockUser = {
          id: adminProfile.id,
          email: adminProfile.email,
          user_metadata: { full_name: adminProfile.full_name },
          aud: 'authenticated',
          created_at: adminProfile.created_at,
        } as unknown as User;

        initActiveSession(mockUser, adminProfile, org, 'admin');
        return { error: null };
      }

      return { error: new Error('E-mail ou senha incorretos.') };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signup = async (data: { email: string; password: string; fullName: string; companyName: string }) => {
    try {
      const normalizedEmail = data.email.toLowerCase().trim();

      if (!isDemoMode()) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              company_name: data.companyName,
            },
          },
        });

        if (error) return { error };

        if (authData.user && authData.session) {
          setIsDemo(false);
          setUser(authData.user);
          await loadSupabaseUserData(authData.user.id);
          return { error: null };
        }

        return { error: null, needsConfirmation: true };
      }

      // Atualiza os dados da organização com o nome real da empresa
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        name: data.companyName,
        slug: data.companyName.toLowerCase().replace(/\s+/g, '-'),
        logo_url: null,
        phone: null,
        email: normalizedEmail,
        address: null,
        plan: 'pro',
        subscription_status: 'active',
        trial_ends_at: null,
        is_active: true,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      LocalStore.setOrganization(newOrg);

      // Cria perfil do dono como Administrador
      const ownerProfile: Profile = {
        id: `user-${Date.now()}`,
        full_name: data.fullName,
        avatar_url: null,
        phone: null,
        email: normalizedEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const profiles = LocalStore.getProfiles();
      LocalStore.setProfiles([ownerProfile, ...profiles.filter((p) => p.email !== normalizedEmail)]);

      const credentials = LocalStore.getCredentials();
      credentials[normalizedEmail] = data.password;
      LocalStore.setCredentials(credentials);

      const ownerMember: OrganizationMember = {
        id: `mem-${Date.now()}`,
        organization_id: newOrg.id,
        user_id: ownerProfile.id,
        role: 'admin',
        is_active: true,
        invited_by: null,
        joined_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      LocalStore.setMembers([ownerMember]);

      const mockUser = {
        id: ownerProfile.id,
        email: ownerProfile.email,
        user_metadata: { full_name: ownerProfile.full_name },
        aud: 'authenticated',
        created_at: ownerProfile.created_at,
      } as unknown as User;

      initActiveSession(mockUser, ownerProfile, newOrg, 'admin');
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const logout = async () => {
    localStorage.removeItem('leadflow_active_user');
    if (!isDemoMode()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setRole(null);
  };

  const resetAllData = () => {
    LocalStore.clearAllData();
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        role,
        isLoading,
        isDemo,
        login,
        signup,
        logout,
        resetAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
