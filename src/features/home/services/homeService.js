import axios from 'axios';

const API_BASE_URL = 'https://api.bettinghub.com';

// Mock data cho demo
const mockMatches = [
  {
    id: 1,
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    league: 'Premier League',
    date: '2025-10-01T19:30:00Z',
    odds: {
      home: 2.1,
      draw: 3.2,
      away: 2.8
    },
    status: 'upcoming'
  },
  {
    id: 2,
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    league: 'La Liga',
    date: '2025-10-02T20:00:00Z',
    odds: {
      home: 2.5,
      draw: 3.1,
      away: 2.4
    },
    status: 'upcoming'
  },
  {
    id: 3,
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    league: 'Bundesliga',
    date: '2025-10-03T18:30:00Z',
    odds: {
      home: 1.8,
      draw: 3.5,
      away: 3.2
    },
    status: 'upcoming'
  }
];

const mockStats = {
  totalMatches: 156,
  todayMatches: 8,
  liveMatches: 3,
  totalBets: 2543
};

export const homeService = {
  // Lấy danh sách trận đấu hot
  getHotMatches: async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockMatches;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê tổng quan
  getStats: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStats;
    } catch (error) {
      throw error;
    }
  },

  // Lấy trận đấu đang live
  getLiveMatches: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockMatches.slice(0, 2).map(match => ({ ...match, status: 'live' }));
    } catch (error) {
      throw error;
    }
  }
};

export default homeService;
