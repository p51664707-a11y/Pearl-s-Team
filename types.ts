
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
  { name: 'Marathi', native: 'মরাঠি' },
  { name: 'Tamil', native: 'தமிழ்' },
  { name: 'Urdu', native: 'اردו' },
  { name: 'Gujarati', native: 'ગુજરાતી' },
  { name: 'Kannada', native: 'ಕನ್ನಡ' },
  { name: 'Malayalam', native: 'മലയാളം' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬী' }
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

export type PropagandaTacticName = 
  | 'Whataboutism' 
  | 'Gaslighting' 
  | 'Straw Man' 
  | 'Appeal to Authority' 
  | 'Bandwagon' 
  | 'Ad Populum'
  | 'Fear Mongering'
  | 'Loaded Language'
  | 'False Causality' | 'Character Assassination' | 'Red Herring' | 'Cherry Picking' | 'Glittering Generalities' | 'Narrative Hijacking' | 'Coordinated Spamming';

export interface PropagandaTechnique {
  name: PropagandaTacticName | string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface ProfileAnalysis {
  identity: string;
  actorType: string; 
  narrativePattern: string; 
  associatedRisks: string[]; 
  verificationStatus: string; 
  networkAffiliation?: string; 
  historicalFlagging?: string[]; 
  contentFocus?: string[]; 
  role?: 'Original Creator' | 'Opportunistic Amplifier' | 'Strategic Distributor' | 'Passive Sharer'; 
  agendaAlignment?: string;
  digitalFootprint?: {
    accountAge?: string;
    postingFrequency?: 'Low' | 'Medium' | 'High' | 'Extreme';
    engagementAnomalies?: string[];
  };
  inferredAllegiance?: string;
}

export interface DeepfakeAnalysis {
  isDeepfakeSuspected: boolean;
  confidenceScore: string;
  vocalAnomalies: string[];
  visualAnomalies: string[];
  referenceComparison?: string;
  technicalReasoning: string;
}

export interface VisualAnalysis {
  detectedObjects: string[]; 
  authorityMarkers: string[]; 
  authenticityVerdict: string; 
  formattingIssues: string[]; 
  textErrors: string[];
  isOfficialDocument: boolean;
  dominantColors: string[];
  textOverlayAnalysis?: {
    fontStyle: string;
    size: string;
    color: string;
  };
  deepfakeDiagnostic?: DeepfakeAnalysis;
}

export interface OsintAnalysis {
  logicGaps: string[];
  sourcePath: string;
  intention: string;
  forensicReasoning: string; 
  tacticalMarkers: string[]; 
  profile: string; 
  profileAnalysis?: ProfileAnalysis;
  visualAnalysis?: VisualAnalysis; 
  propagandaTechniques: string[];
  propagandaTactics?: PropagandaTechnique[];
  extractedKeywords?: string[]; 
  inferredCategory?: Category;
  inferredTopic?: string;
  inferredPlatform?: Platform;
  inferredLanguage?: string;
  inferredFormat?: ContentFormat;
  narrativeCluster?: {
    clusterName: string;
    isCoordinated: boolean;
    associatedHashtags: string[];
    primaryGeographicOrigin: string;
  };
  temporalContext?: {
    isSensitiveWindow: boolean;
    windowReason?: string;
  };
}

export interface SimulationResult {
  headline: string;
  content: string;
  translatedContent?: string; 
  misinformationLevel: 'Low' | 'Moderate' | 'High' | 'Critical'; 
  imageUrl?: string; 
  mediaBase64?: string;
  mediaMimeType?: string;
  memeTopText?: string;
  memeBottomText?: string;
  imagePrompt?: string; 
  platform: Platform;
  category: Category;
  stance: Stance;
  format: ContentFormat;
  topic?: string;
  language?: string;
  comments?: Comment[];
  aiEmotion: EmotionType;
  aiTrustDamage: boolean;
  factCheckAnalysis: string;
  osintAnalysis?: OsintAnalysis;
  groundingUrls?: string[]; 
}

export interface UserEvaluation {
  emotion: EmotionType;
  trustDamage: boolean | null;
  identifiedStance: Stance | null;
}
