// 旅行相关类型定义

export interface TravelPreference {
  location: string;
  travelers: number;
  budget: number;
  days: number;
  transport: string[];
  preferences: string[];
  mood: string;
  specialNeeds: string;
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  tagline: string;
  budget: number;
  days: number;
  weather: {
    temp: number;
    condition: string;
  };
  crowdLevel: 'cold' | 'moderate' | 'hot';
  matchScore: number;
  highlights: string[];
}

export interface ItineraryDay {
  day: number;
  activities: {
    time: string;
    title: string;
    description: string;
    type: 'sightseeing' | 'food' | 'transport' | 'rest';
  }[];
}

export interface TravelRoute {
  destination: string;
  totalBudget: number;
  days: ItineraryDay[];
  transport: string;
  accommodation: string;
  tips: string[];
}

export interface ColorWalkChallenge {
  color: string;
  colorName: string;
  description: string;
}

export interface BlindBoxTrip {
  id: string;
  theme: string;
  budget: number;
  days: number;
  clues: string[];
  revealed: boolean;
  destination?: string;
}

export interface DiceOption {
  category: string;
  options: string[];
}

export interface PhotoChallenge {
  location: string;
  task: string;
  difficulty: 'easy' | 'medium' | 'hard';
  example: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface ReverseDestination {
  popular: string;
  alternative: string;
  reason: string;
  reverseIndex: number;
}
