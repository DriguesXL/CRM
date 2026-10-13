import { LocalStore } from './storage';
import { isDemoMode, supabase } from '@/lib/supabase';
import type { Deal, Profile } from '@/types';

export const reportsService = {
  async getReportsData() {
    let deals: Deal[];
    let profiles: Profile[];

    if (isDemoMode()) {
      deals = LocalStore.getDeals();
      profiles = LocalStore.getProfiles();
    } else {
      const [{ data: dealsData, error: dealsError }, { data: profilesData, error: profilesError }] = await Promise.all([
        supabase.from('deals').select('*, stage:pipeline_stages(*)'),
        supabase.from('profiles').select('*'),
      ]);

      if (dealsError) throw dealsError;
      if (profilesError) throw profilesError;

      deals = (dealsData || []) as Deal[];
      profiles = (profilesData || []) as Profile[];
    }

    // 1. Won vs Lost
    const won = deals.filter((d) => d.stage?.is_won);
    const lost = deals.filter((d) => d.stage?.is_lost);
    const open = deals.filter((d) => !d.stage?.is_won && !d.stage?.is_lost);

    // 2. Average Deal Value
    const totalWonValue = won.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
    const averageTicket = won.length > 0 ? Math.round(totalWonValue / won.length) : 0;

    // 3. Sales cycle estimation (average days from creation to won)
    let totalCycleDays = 0;
    won.forEach((d) => {
      const created = new Date(d.created_at).getTime();
      const updated = new Date(d.updated_at).getTime();
      totalCycleDays += Math.max(1, Math.round((updated - created) / (1000 * 3600 * 24)));
    });
    const avgCycleDays = won.length > 0 ? Math.round(totalCycleDays / won.length) : 0;

    return {
      wonCount: won.length,
      lostCount: lost.length,
      openCount: open.length,
      totalWonValue,
      averageTicket,
      avgCycleDays,
      sellerPerformance: profiles.map((p) => {
        const pWon = won.filter((d) => d.assigned_to === p.id);
        const pLost = lost.filter((d) => d.assigned_to === p.id);
        const pValue = pWon.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
        return {
          seller: p.full_name,
          wonCount: pWon.length,
          lostCount: pLost.length,
          totalValue: pValue,
          conversion: pWon.length + pLost.length > 0 ? Math.round((pWon.length / (pWon.length + pLost.length)) * 100) : 0,
        };
      }),
    };
  },
};
