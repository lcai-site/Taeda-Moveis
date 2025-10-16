import { CampaignData } from '../types';

// A simple seedable pseudo-random number generator (PRNG).
// This ensures the mock data is consistent across page loads.
const createSeededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// This is a mock data generator. In a real application, you would replace this
// with an API call to a backend that fetches data from Google Sheets.
const generateMockData = (startDate: Date, endDate: Date): CampaignData[] => {
  const data: CampaignData[] = [];
  const sources = ['Facebook', 'Instagram'];
  const campaigns = ['Campanha de Verão', 'Promoção de Inverno', 'Leads Qualificados'];
  const fbPlacements: CampaignData['placement'][] = ['Feed', 'Stories', 'Reels', 'Messenger'];
  const igPlacements: CampaignData['placement'][] = ['Feed', 'Stories', 'Reels', 'Direct'];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Create a deterministic seed based on the date.
    // This ensures that the data for any given day is always the same.
    const daySeed = currentDate.getFullYear() * 10000 + (currentDate.getMonth() + 1) * 100 + currentDate.getDate();
    const random = createSeededRandom(daySeed);

    const entriesPerDay = Math.floor(random() * 3) + 1; // 1 to 3 entries per day

    for (let i = 0; i < entriesPerDay; i++) { 
      const contacts = Math.floor(random() * 50) + 10;
      const qualified = Math.floor(contacts * (random() * 0.4 + 0.4)); // 40-80% qualified
      const disqualified = contacts - qualified;
      const cost = random() * 100 + 50;
      const cpl = cost / contacts;
      const source = sources[Math.floor(random() * sources.length)];
      let placement: CampaignData['placement'];

      if (source === 'Facebook') {
        placement = fbPlacements[Math.floor(random() * fbPlacements.length)];
      } else { // Instagram
        placement = igPlacements[Math.floor(random() * igPlacements.length)];
      }
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        campaign: campaigns[Math.floor(random() * campaigns.length)],
        source,
        placement,
        contacts,
        qualified,
        disqualified,
        cost,
        cpl,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

export const fetchCampaignData = (startDate: Date, endDate: Date): Promise<CampaignData[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const allData = generateMockData(startDate, endDate);
      resolve(allData);
    }, 500);
  });
};