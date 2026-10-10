export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  preferredCurrency: 'SAR' | 'AED' | 'USD' | 'EGP' | 'KWD' | 'QAR' | 'DZD' | 'EUR';
  joinedDate: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  favorites: string[]; // phone IDs
  alertIds: string[];
}

export type AuthMode = 'login' | 'register' | 'forgot' | 'profile';
