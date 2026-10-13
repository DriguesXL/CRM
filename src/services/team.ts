import { LocalStore } from './storage';
import { isDemoMode, supabase } from '@/lib/supabase';
import type { OrganizationMember, Profile, OrganizationRole } from '@/types';

export interface TeamMemberWithProfile extends OrganizationMember {
  profile: Profile;
}

export interface CreateEmployeeParams {
  name: string;
  email: string;
  password?: string;
  role: OrganizationRole;
}

export const teamService = {
  async getMembers(): Promise<TeamMemberWithProfile[]> {
    if (!isDemoMode()) {
      try {
        const { data, error } = await supabase
          .from('organization_members')
          .select('*, profile:profiles(*)');

        if (!error && data && data.length > 0) {
          return data as TeamMemberWithProfile[];
        }
      } catch (err) {
        console.warn('Fallback to local team members:', err);
      }
    }

    const profiles = LocalStore.getProfiles();
    const members = LocalStore.getMembers();
    const org = LocalStore.getOrganization();

    // Se ainda não houver nenhum membro na lista, cria o usuário padrão/admin logado
    if (members.length === 0 && profiles.length > 0) {
      const firstMember: TeamMemberWithProfile = {
        id: 'member-owner',
        organization_id: org.id,
        user_id: profiles[0].id,
        role: 'admin',
        is_active: true,
        invited_by: null,
        joined_at: profiles[0].created_at,
        created_at: profiles[0].created_at,
        updated_at: profiles[0].updated_at,
        profile: profiles[0],
      };
      LocalStore.setMembers([firstMember]);
      return [firstMember];
    }

    return members.map((m) => {
      const prof = profiles.find((p) => p.id === m.user_id) || {
        id: m.user_id,
        full_name: 'Funcionário',
        avatar_url: null,
        phone: null,
        email: 'funcionario@empresa.com',
        created_at: m.created_at,
        updated_at: m.updated_at,
      };
      return {
        ...m,
        profile: prof,
      };
    });
  },

  async createEmployee(params: CreateEmployeeParams): Promise<TeamMemberWithProfile> {
    const org = LocalStore.getOrganization();

    // Se estiver conectado ao Supabase com credenciais reais
    if (!isDemoMode()) {
      try {
        // Cria o usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: params.email,
          password: params.password || 'Mudar@123456',
          options: {
            data: {
              full_name: params.name,
              organization_id: org.id,
              role: params.role,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Insere vínculo na organization_members
          const { data: memberData, error: memberError } = await supabase
            .from('organization_members')
            .insert({
              organization_id: org.id,
              user_id: authData.user.id,
              role: params.role,
              is_active: true,
            })
            .select('*, profile:profiles(*)')
            .single();

          if (!memberError && memberData) {
            return memberData as TeamMemberWithProfile;
          }
        }
      } catch (err) {
        console.warn('Supabase create employee error, saving locally:', err);
      }
    }

    // Criação local com persistência
    const profiles = LocalStore.getProfiles();
    const members = LocalStore.getMembers();
    const credentials = LocalStore.getCredentials();

    const newUserId = `user-${Date.now()}`;
    const newMemberId = `mem-${Date.now()}`;

    const newProfile: Profile = {
      id: newUserId,
      full_name: params.name,
      avatar_url: null,
      phone: null,
      email: params.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newMember: OrganizationMember = {
      id: newMemberId,
      organization_id: org.id,
      user_id: newUserId,
      role: params.role,
      is_active: true,
      invited_by: null,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Salva perfil e membro
    LocalStore.setProfiles([...profiles, newProfile]);
    LocalStore.setMembers([...members, newMember]);

    // Registra a senha do funcionário para que ele possa logar de verdade na tela de Login!
    if (params.password) {
      credentials[params.email.toLowerCase().trim()] = params.password;
      LocalStore.setCredentials(credentials);
    }

    return {
      ...newMember,
      profile: newProfile,
    };
  },

  async updateMemberRole(memberId: string, newRole: OrganizationRole): Promise<void> {
    const members = LocalStore.getMembers();
    const updated = members.map((m) =>
      m.id === memberId ? { ...m, role: newRole, updated_at: new Date().toISOString() } : m
    );
    LocalStore.setMembers(updated);
  },

  async deleteMember(memberId: string): Promise<void> {
    const members = LocalStore.getMembers();
    LocalStore.setMembers(members.filter((m) => m.id !== memberId));
  },
};
