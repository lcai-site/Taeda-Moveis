import { useMemo } from 'react';
import { CampaignData } from '../types';

export const useSummaryMetrics = (data: CampaignData[]) => {
  return useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    let totalContacts = 0;
    let totalQualified = 0;
    let totalDisqualified = 0;
    let contactsToday = 0;
    let totalCost = 0;

    for (const item of data) {
      totalContacts += item.contacts;
      totalQualified += item.qualified;
      totalDisqualified += item.disqualified;
      totalCost += item.cost;
      if (item.date === todayStr) {
        contactsToday += item.contacts;
      }
    }

    const avgCpl = totalContacts > 0 ? totalCost / totalContacts : 0;
    const qualificationRate = totalContacts > 0 ? (totalQualified / totalContacts) * 100 : 0;

    return { 
      totalContacts, 
      totalQualified, 
      totalDisqualified, 
      contactsToday,
      totalCost,
      avgCpl,
      qualificationRate
    };
  }, [data]);
};
