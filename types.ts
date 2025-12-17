
export enum Category {
  DOMESTIC = 'Domestic',
  INTERNATIONAL = 'International'
}

export enum Stance {
  PRO_GOVERNMENT = 'Pro-Government (Support Establishment)',
  ANTI_GOVERNMENT = 'Anti-Government (Critical / Dissent)'
}

export enum Platform {
  TWITTER = 'X (Twitter)',
  WHATSAPP = 'WhatsApp',
  FACEBOOK = 'Facebook',
}

export enum ContentFormat {
  TEXT = 'Text / News Post',
  MEME = 'Meme / Visual Satire'
}

export const LANGUAGES = [
  { name: 'English', native: 'English' },
  { name: 'Hindi', native: 'हिन्दी' },
  { name: 'Bengali', native: 'বাংলা' },
  { name: 'Telugu', native: 'తెలుగు' },
  { name: 'Marathi', native: 'मराठी' },
  { name: 'Tamil', native: 'தமிழ்' },
  { name: 'Urdu', native: 'اردو' },
  { name: 'Gujarati', native: 'ગુજરાતી' },
  { name: 'Kannada', native: 'ಕನ್ನಡ' },
  { name: 'Malayalam', native: 'മലയാളം' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
];

export const DOMESTIC_TOPICS = [
  "Religion",
  "Caste",
  "Economy",
  "Local Politicians",
  "Local Party",
  "Prime Minister",
  "Foreign Minister",
  "Military",
  "Domestic Policy",
  "Pakistan"
];

export const INTERNATIONAL_TOPICS = [
  "Economy",
  "Military Power",
  "Pakistan",
  "Afghanistan",
  "Religion",
  "International Political Figure",
  "Prime Minister",
  "Foreign Minister",
  "RAW",
  "ISI",
  "Bangladesh",
  "China",
  "Defense Policy",
  "Terrorism",
  "Border Issues",
  "Bondi Beach Attack"
];

export type EmotionType = 'Angry' | 'Neutral' | 'Funny';

export interface Comment {
  author: string;
  handle?: string;
  content: string;
  likes: string;
}

export interface ProfileAnalysis {
  identity: string;
  actorType: string; // e.g., "State Media", "Political Bot", "Influencer"
  narrativePattern: string; // Description of recurring themes/biases
  associatedRisks: string[]; // e.g., "Promotes Polarization", "Fake Videos"
  credibilityScore: number; // 0-100 Score
  verificationStatus: string; // "Verified", "Unverified", "Suspended", "Parody"
  networkAffiliation?: string; // Known links to IT cells or organizations
  historicalFlagging?: string[]; // Past incidents of spreading misinformation
  contentFocus?: string[]; // Main topics of operation
}

export interface VisualAnalysis {
  detectedObjects: string[]; // e.g. ["Police Car", "Logo", "Crowd"]
  authorityMarkers: string[]; // e.g. ["Delhi Police Logo", "Verified Badge", "Breaking News Ticker"]
  authenticityVerdict: string; // e.g. "Misused Official Logo", "Authentic Screenshot"
  manipulationScore: number; // 0-100
  formattingIssues: string[]; // e.g. ["Mismatched Fonts", "Bad Alignment", "Pixelated Logo"]
  textErrors: string[]; // e.g. ["Spelling: 'Govenment'", "Grammar: 'Police is coming'"]
}

export interface OsintAnalysis {
  logicGaps: string[];
  sourcePath: string;
  intention: string;
  profile: string; // Kept for summary/backwards compatibility
  profileAnalysis?: ProfileAnalysis;
  visualAnalysis?: VisualAnalysis; // New field for detailed image forensics
  sentimentScore: number; // -100 to 100
  propagandaTechniques: string[];
  botActivityProbability: number; // 0 to 100
  extractedKeywords?: string[]; // New field for URL/Text keywords
  inferredCategory?: Category;
  inferredTopic?: string;
  inferredPlatform?: Platform;
  inferredLanguage?: string;
  inferredFormat?: ContentFormat;
}

export interface SimulationResult {
  headline: string;
  content: string;
  translatedContent?: string; // New field for English translation
  misinformationLevel?: 'Low' | 'Moderate' | 'High' | 'Critical'; // New field for Risk Level
  imageUrl?: string; // Base64 data URI
  memeTopText?: string;
  memeBottomText?: string;
  platform: Platform;
  category: Category;
  stance: Stance;
  format: ContentFormat;
  topic?: string;
  language?: string;
  comments?: Comment[];
  // AI Ground Truth Analysis
  aiExtremeness: number; // 1-7
  aiCredibility: number; // 1-7
  aiVirality: number; // 1-10
  aiHarmony: number; // 1-7 (Context dependent: Social Disruption or Diplomatic Harm)
  aiEmotion: EmotionType;
  aiTrustDamage: boolean;
  factCheckAnalysis: string;
  osintAnalysis?: OsintAnalysis;
  groundingUrls?: string[]; // Links found during analysis
}

export interface UserEvaluation {
  extremeness: number;
  credibility: number;
  virality: number;
  harmony: number;
  emotion: EmotionType;
  trustDamage: boolean | null;
  identifiedStance: Stance | null;
}
