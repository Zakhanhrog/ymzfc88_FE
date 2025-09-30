// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  MATCHES: {
    LIST: '/matches',
    HOT: '/matches/hot',
    LIVE: '/matches/live',
    DETAIL: '/matches/:id'
  },
  BETTING: {
    PLACE: '/bets',
    HISTORY: '/bets/history',
    CANCEL: '/bets/:id/cancel'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Betting status
export const BET_STATUS = {
  PENDING: 'pending',
  WON: 'won',
  LOST: 'lost',
  CANCELLED: 'cancelled'
};

// Match status
export const MATCH_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  BETTING: '/betting',
  HISTORY: '/history'
};

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  PHONE_REGEX: /(0[3|5|7|8|9])+([0-9]{8})\b/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};
