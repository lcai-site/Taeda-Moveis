
import { CampaignData } from '../types';

// This is a mock data generator. In a real application, you would replace this
// with an API call to a backend that fetches data from Google Sheets.
const generateMockData = (startDate: Date, endDate: Date): CampaignData[] => {
  const data: CampaignData[] = [];
  const sources = ['Facebook', 'Instagram', 'Google'];
  const campaigns = ['Campanha de Verão', 'Promoção de Inverno', 'Leads Qualificados'];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) { // 1 to 3 entries per day
      const contacts = Math.floor(Math.random() * 50) + 10;
      const qualified = Math.floor(contacts * (Math.random() * 0.4 + 0.4)); // 40-80% qualified
      const disqualified = contacts - qualified;
      const cost = Math.random() * 100 + 50;
      const cpl = cost / contacts;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
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
