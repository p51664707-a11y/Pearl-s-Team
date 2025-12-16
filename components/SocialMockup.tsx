
import React from 'react';
import { Platform, ContentFormat, Comment } from '../types';
import { MoreHorizontal, Bookmark, ThumbsUp, Globe, Send, Share2, MessageCircle, Heart, Repeat2, Image as ImageIcon, Smile, Camera, Mic, Paperclip, CheckCircle2 } from 'lucide-react';

interface SocialMockupProps {
  platform: Platform;
  headline: string;
  content: string;
  imageUrl?: string;
  format?: ContentFormat;
  topic?: string;
  language?: string;
  memeTopText?: string;
  memeBottomText?: string;
  comments?: Comment[];
}

interface Persona {
  name: string;
  handle?: string;
  verified?: boolean;
  members?: string;
  sub?: string;
  avatarType?: 'modi' | 'rahul' | 'mamata' | 'yogi' | 'amit' | 'kejriwal' | 'salman' | 'news' | 'default';
  partyColor?: string;
}

// --- AVATAR COMPONENT ---
const Avatar = ({ seed, type = 'default', size = "md", partyColor }: { seed: string, type?: Persona['avatarType'], size?: "sm" | "md" | "lg", partyColor?: string }) => {
  // Simple hash for consistency
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-14 h-14"
  };

  // Specific Avatar Renders for VIPs
  if (type === 'modi') {
    return (
      <div className={`${sizeClasses[size]} bg-orange-500 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-white`}>
         {/* Stylized Lotus-ish shape */}
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
            <path d="M12 2C9 7 4 9 4 14c0 3 3 5 8 5s8-2 8-5c0-5-5-7-8-12z" opacity="0.9" />
            <path d="M12 22c-2 0-3-1-3-2h6c0 1-1 2-3 2z" />
         </svg>
      </div>
    );
  }

  if (type === 'rahul') {
    return (
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-white`}>
         {/* Stylized Hand-ish shape */}
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
             <path d="M12 2a2 2 0 00-2 2v6H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2z" />
         </svg>
      </div>
    );
  }

  if (type === 'mamata') {
    return (
      <div className={`${sizeClasses[size]} bg-white border border-green-500 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-green-600`}>
         {/* Stylized Flower/Grass */}
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
            <path d="M12 3c-2 4-5 6-5 10 0 2 2 3 5 3s5-1 5-3c0-4-3-6-5-10z" />
            <path d="M7 21h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
         </svg>
      </div>
    );
  }

  if (type === 'yogi') {
    return (
      <div className={`${sizeClasses[size]} bg-orange-600 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-white`}>
          <span className="font-bold text-xs tracking-tighter">YOGI</span>
      </div>
    );
  }
  
  if (type === 'kejriwal') {
    return (
      <div className={`${sizeClasses[size]} bg-blue-500 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-white`}>
         {/* Broom handle hint */}
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3/4 h-3/4">
            <line x1="4" y1="20" x2="20" y2="4" />
            <path d="M4 20l4-4" />
            <path d="M4 20l4 0" />
            <path d="M4 20l0-4" />
         </svg>
      </div>
    );
  }

  if (type === 'salman') {
    return (
      <div className={`${sizeClasses[size]} bg-black rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-cyan-400`}>
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
            <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" />
         </svg>
      </div>
    );
  }

  if (type === 'news') {
     return (
        <div className={`${sizeClasses[size]} bg-red-700 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white text-white font-serif font-bold`}>
            NEWS
        </div>
     );
  }

  // Default Random Avatar
  const colors = [
    "bg-emerald-100 text-emerald-800",
    "bg-blue-100 text-blue-800",
    "bg-indigo-100 text-indigo-800",
    "bg-rose-100 text-rose-800",
    "bg-amber-100 text-amber-800",
    "bg-violet-100 text-violet-800",
    "bg-cyan-100 text-cyan-800",
  ];
  const color = partyColor || colors[hash % colors.length];
  
  const styleIndex = hash % 4;

  return (
    <div className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center shrink-0 overflow-hidden relative ring-2 ring-white`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform scale-110 translate-y-1">
             <path d="M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z" opacity="0.6" />
            {styleIndex === 0 && ( <g><circle cx="12" cy="8" r="4.5" /><path d="M12 3.5c-3 0-5 2-5 5h10c0-3-2-5-5-5z" fill="#1f2937" opacity="0.8" /></g> )}
            {styleIndex === 1 && ( <g><path d="M12 3.5c-3 0-5.5 2.5-5.5 6v4c0 1 .5 2 1.5 2h8c1 0 1.5-1 1.5-2v-4c0-3.5-2.5-6-5.5-6z" fill="#374151" opacity="0.8" /><circle cx="12" cy="9" r="3.5" fill="currentColor" /></g> )}
             {styleIndex === 2 && ( <g><circle cx="12" cy="8.5" r="4.5" /><path d="M12 4c-2.5 0-4.5 1.5-4.5 3.5h9c0-2-2-3.5-4.5-3.5z" fill="#1f2937" opacity="0.8" /><g stroke="#1f2937" strokeWidth="1" fill="none" opacity="0.9"><circle cx="10" cy="9" r="1.2" /><circle cx="14" cy="9" r="1.2" /><line x1="11.2" y1="9" x2="12.8" y2="9" /></g></g> )}
             {styleIndex === 3 && ( <g><path d="M12 3c-3.5 0-6 3-6 6.5V15h12V9.5C18 6 15.5 3 12 3z" fill="#4b5563" opacity="0.8" /><circle cx="12" cy="9.5" r="3.2" fill="currentColor" /></g> )}
        </svg>
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
  
const FacebookIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const ContentRenderer = ({ content, headline, isRTL }: { content: string, headline: string, isRTL: boolean }) => {
  return (
     <p 
        className={`text-gray-900 text-[17px] leading-snug whitespace-pre-wrap ${isRTL ? 'text-right font-[Noto_Sans_Arabic]' : 'text-left'}`} 
        dir={isRTL ? 'rtl' : 'ltr'}
    >
       {headline && <span className="font-bold block mb-2">{headline}</span>}
       {content}
     </p>
  );
};

const MemeRenderer = ({ imageUrl, topText, bottomText }: { imageUrl: string, topText?: string, bottomText?: string }) => {
    // Advanced text shadow to simulate a thick black stroke (classic meme style)
    const textStyle: React.CSSProperties = {
        fontFamily: 'Impact, "Arial Black", "Helvetica Inserat", "Bitstream Vera Sans Bold", sans-serif',
        textTransform: 'uppercase',
        color: 'white',
        letterSpacing: '1px',
        lineHeight: '1.1',
        // Creating a robust stroke effect using text-shadow
        textShadow: `
          -2px -2px 0 #000,  
           2px -2px 0 #000,
          -2px  2px 0 #000,
           2px  2px 0 #000,
          -2px  0   0 #000,
           2px  0   0 #000,
           0   -2px 0 #000,
           0    2px 0 #000,
           0    3px 5px rgba(0,0,0,0.5)
        `,
        pointerEvents: 'none',
        width: '100%',
        textAlign: 'center',
        padding: '16px 12px',
        zIndex: 20,
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
    };

    const getFontSizeClass = (text?: string) => {
        if (!text) return 'text-3xl';
        const len = text.length;
        if (len < 10) return 'text-4xl md:text-5xl lg:text-6xl';
        if (len < 25) return 'text-3xl md:text-4xl lg:text-5xl';
        if (len < 50) return 'text-2xl md:text-3xl lg:text-4xl';
        return 'text-xl md:text-2xl';
    };

    return (
        <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-sm mt-3 group select-none flex flex-col">
            {/* The Image Container */}
            <div className="relative w-full">
                <img 
                    src={imageUrl} 
                    alt="Meme Background" 
                    className="w-full h-auto block max-h-[600px] object-contain mx-auto" 
                />
                
                {/* Overlay Container */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="w-full pt-1">
                        {topText && <p style={textStyle} className={`${getFontSizeClass(topText)}`}>{topText}</p>}
                    </div>
                    <div className="w-full pb-2">
                        {bottomText && <p style={textStyle} className={`${getFontSizeClass(bottomText)}`}>{bottomText}</p>}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-[2px] rounded text-[9px] text-white/70 font-medium z-30 flex items-center gap-1 uppercase tracking-wider">
                AI Generated
            </div>
        </div>
    );
};

export const SocialMockup: React.FC<SocialMockupProps> = ({ platform, headline, content, imageUrl, format, topic, language, memeTopText, memeBottomText, comments }) => {
  
  const isRTL = language === 'Urdu';

  const getTimestamp = (platform: Platform) => {
    const now = new Date();
    const viralOffsetHours = 4; 
    const postTime = new Date(now.getTime() - viralOffsetHours * 60 * 60 * 1000);

    if (platform === Platform.TWITTER) {
      const time = postTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const date = postTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${time} · ${date}`;
    }

    if (platform === Platform.WHATSAPP) {
      return postTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    if (platform === Platform.FACEBOOK) {
      return `${viralOffsetHours}h`;
    }

    return "";
  };

  const timestamp = getTimestamp(platform);

  // VIP Database for Mockups
  const knownPersonalities: Record<string, Persona> = {
      'modi': { name: "Narendra Modi", handle: "@narendramodi", verified: true, avatarType: 'modi' },
      'rahul': { name: "Rahul Gandhi", handle: "@RahulGandhi", verified: true, avatarType: 'rahul' },
      'mamata': { name: "Mamata Banerjee", handle: "@MamataOfficial", verified: true, avatarType: 'mamata' },
      'yogi': { name: "Yogi Adityanath", handle: "@myogiadityanath", verified: true, avatarType: 'yogi' },
      'kejriwal': { name: "Arvind Kejriwal", handle: "@ArvindKejriwal", verified: true, avatarType: 'kejriwal' },
      'amit': { name: "Amit Shah", handle: "@AmitShah", verified: true, avatarType: 'modi' }, // Share style
      'salman': { name: "Salman Khan", handle: "@BeingSalmanKhan", verified: true, avatarType: 'salman' },
      'news': { name: "Breaking News India", handle: "@IndiaBreaking", verified: true, avatarType: 'news' },
  };

  const personaDatabase: Record<string, { names: string[], handles: string[], groups: string[], pages: string[] }> = {
    'English': {
      names: ["Vikram Malhotra 🇮🇳", "Aditi Rao", "The Daily Brief ⚖️", "Rohan Verma", "Citizen Watch 👁️", "Sana Khan"],
      handles: ["@Vikram_Speaks", "@AditiR_Ind", "@DailyBrief_IN", "@RohanV_Tweets", "@CitizenWatch", "@SanaK_Views"],
      groups: ["RWA Notice Board 📢", "Office Gang 💼", "Family Group ❤️", "College Alumni 🎓", "Investments & Stocks 📈"],
      pages: ["Urban Chronicles", "The Logical Voice 🇮🇳", "Youth of India 🇮🇳", "Tech & Policy", "Metro Matters"]
    },
    'Hindi': {
      names: ["Rajesh Kumar 🚩", "Desh Ki Awaaz 🇮🇳", "Sunita Devi 🙏", "Amit Singh", "Bhartiya Nagrik 🇮🇳", "Pooja Sharma"],
      handles: ["@RajeshK_IND", "@DeshAwaaz_News", "@SunitaD_Live", "@AmitSingh_BJP", "@Bhartiya_N", "@PoojaS_Updates"],
      groups: ["Hum Sab Bhartiya 🇮🇳", "Parivar (Family) ❤️", "Mohalla Updates 🏘️", "Dharma Charcha 🕉️", "Morning Yoga Group 🧘"],
      pages: ["Bharat Mata Ki Jai 🚩", "Gaon Ki Khabar 📰", "Dharma Raksha Manch 🛡️", "Hindi News Fast ⚡", "Janta Janardan"]
    },
    'Tamil': {
      names: ["Senthil Kumar 🐅", "Dravida Kural ⬛🟥", "Lakshmi Priya", "Vijay Fan Club 🕶️", "Madurai Veeran"],
      handles: ["@Senthil_TN", "@DravidaKural", "@Lakshmi_P", "@Thalapathy_FC", "@MaduraiV"],
      groups: ["Tamil Nanbargal 🤝", "Kudumbam (Family) 🏠", "Chennai Rains 🌧️", "Cinema Paithiyam 🎥", "Politics TN 🗳️"],
      pages: ["Tamil Nadu News", "Dravidian Pride 🌅", "Jallikattu Warriors 🐂", "Cinema Express", "Makkal Kural"]
    },
     'Bengali': {
      names: ["Subhasis Roy ⚽", "Banglar Gorybo 🐯", "Priya Das", "Kolkata Chronicle 🌉", "Amitava Sen"],
      handles: ["@Subhasis_R", "@BanglarG", "@PriyaD_Kol", "@KolChronicle", "@AmitavaS"],
      groups: ["Adda Zone ☕", "Family (Poribar) 🏠", "Durga Puja Committee 🪔", "Mohun Bagan Fans 🟢🔴", "Kolkata Foodies 🍤"],
      pages: ["Ei Bangla", "Kolkata Culture", "Bangaliyana 🐟", "Political Adda 🗣️", "Voice of Bengal"]
    },
    'Telugu': {
      names: ["Ravi Teja", "Telugu Desam Voice 🚲", "Sravani Reddy", "Hyderabad Buzz 🕌", "Karthik Rao"],
      handles: ["@RaviTeja_IND", "@TDVoice", "@SravaniR", "@HydBuzz", "@KarthikRao"],
      groups: ["Mana Kutumbam 👨‍👩‍👧‍👦", "Tollywood Updates 🎬", "US Visa Help ✈️", "Friends Group 🍻", "Amaravati News"],
      pages: ["Mana Telugu", "Hyderabad Youth", "Cinema Lokam", "Andhra Politics", "Telangana Pride"]
    },
     'Malayalam': {
      names: ["Arjun Nair 🥥", "Kerala Kaumudi Fan", "Deepa Thomas", "Mallu Traveller 🌏", "Comrade Jose ☭"],
      handles: ["@ArjunN_KL", "@KeralaFan", "@DeepaT", "@MalluTraveller", "@ComradeJose"],
      groups: ["Kudumbam (Family) 🏠", "Dubai Pravasi ✈️", "Football Fans Kerala ⚽", "Political Charcha 🗣️", "College Gang"],
      pages: ["God's Own Country 🌴", "Malayali Corner", "Cinema Kerala", "Left Right Left ☭", "Kerala Foodies 🍌"]
    },
     'Marathi': {
      names: ["Sandeep Patil 🚩", "Marathi Manoos", "Neha Gokhale", "Mumbai Meri Jaan 🇮🇳", "Shiv Sainik 🏹"],
      handles: ["@SandeepP_MH", "@MarathiManoos", "@NehaG_Pune", "@MumbaiMJ", "@ShivSainik_1"],
      groups: ["Aapla Parivar 🏡", "Ganpati Mandal 🐘", "Pune Foodies 🍔", "Mumbai Locals 🚆", "Mitra Mandal 🤝"],
      pages: ["Jay Maharashtra 🚩", "Marathi Asmita", "Mumbai Mirror Fan", "Pune Meri Jaan", "Shivaji Maharaj History 🏰"]
    },
    'Punjabi': {
      names: ["Gurpreet Singh 🚜", "Punjab Da Putt", "Simran Kaur", "Desi Crew 🥃", "Jatt Life 🚜"],
      handles: ["@GurpreetS_PB", "@PunjabDaPutt", "@SimranK", "@DesiCrew_Off", "@JattLife_1"],
      groups: ["Pind De Munde 🚜", "Family (Tabbar) 👨‍👩‍👧‍👦", "Canada Visa Updates ✈️", "Tractor Lovers 🚜", "Bhangra Crew 🕺"],
      pages: ["Chardikala Punjab 🦅", "Desi Vibes", "Farmers Voice 🌾", "Punjabi Music 🎵", "Apna Punjab"]
    },
    'Urdu': {
      names: ["Ahmed Khan", "Sadaf Naz", "Voice of Truth 🌙", "Bilal Ahmed", "Hamari Awaaz 📣", "Zoya Malik"],
      handles: ["@Ahmed_Speaks", "@Sadaf_Writes", "@Truth_PK_IN", "@Bilal_Views", "@HamariAwaaz", "@ZoyaM_Official"],
      groups: ["Deen Aur Duniya 🕌", "Family (Khandaan) ❤️", "Sher-o-Shayari ✍️", "Halal Foodies 🍖", "Cricket Fans 🏏"],
      pages: ["Urdu News Live 🔴", "Tehzeeb-e-Lucknow", "Paigham-e-Haq", "Pak-Ind Dosti (Peace) 🕊️", "Cricket Fever"]
    }
  };

  const getPersona = (platform: Platform, text: string, langKey: string = 'English'): Persona => {
    // 1. Detect VIPs in content for fake tweet simulation
    const lowerText = text.toLowerCase();
    
    // Check for exact phrases indicating a quote or statement by them
    if (lowerText.includes('narendra modi') || lowerText.includes('modi says') || lowerText.includes('pm modi')) return knownPersonalities['modi'];
    if (lowerText.includes('rahul gandhi') || lowerText.includes('raga')) return knownPersonalities['rahul'];
    if (lowerText.includes('mamata') || lowerText.includes('didi')) return knownPersonalities['mamata'];
    if (lowerText.includes('yogi adityanath') || lowerText.includes('baba')) return knownPersonalities['yogi'];
    if (lowerText.includes('kejriwal') || lowerText.includes('aap')) return knownPersonalities['kejriwal'];
    if (lowerText.includes('amit shah')) return knownPersonalities['amit'];
    if (lowerText.includes('salman khan') || lowerText.includes('bhaijaan')) return knownPersonalities['salman'];
    
    if (lowerText.includes('sources') || lowerText.includes('breaking') || lowerText.includes('update')) return knownPersonalities['news'];

    // 2. Fallback to random persona
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const data = personaDatabase[langKey] || personaDatabase['English'];
    const index = hash % 5;

    if (platform === Platform.TWITTER) {
        return { 
            name: data.names[index % data.names.length], 
            handle: data.handles[index % data.handles.length], 
            verified: index % 2 === 0 
        };
    }
    
    if (platform === Platform.WHATSAPP) {
        return { 
            name: data.groups[index % data.groups.length], 
            members: "You, +91 98xxx, +91 87xxx..." 
        };
    }
    
    if (platform === Platform.FACEBOOK) {
        return { 
            name: data.pages[index % data.pages.length], 
            sub: index % 2 === 0 ? "Media/News Company" : "Community Organization" 
        };
    }
    
    return { name: "User", handle: "@user", members: "", sub: "" };
  };

  const persona = getPersona(platform, headline || content, language);

  const isMeme = format === ContentFormat.MEME && imageUrl;

  const renderMedia = () => {
    if (!imageUrl) return null;
    
    if (isMeme) {
        return <MemeRenderer imageUrl={imageUrl} topText={memeTopText} bottomText={memeBottomText} />;
    }

    // Standard Image with cleaner look
    return (
        <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
            <img 
                src={imageUrl} 
                alt="Generated Content" 
                className="w-full h-auto block max-h-[500px] object-cover" 
            />
        </div>
    );
  };

  const renderTextContent = () => (
    <ContentRenderer 
        content={content}
        headline={isMeme ? "" : headline}
        isRTL={isRTL}
    />
  );

  const renderComments = () => {
    if (!comments || comments.length === 0) return null;

    if (platform === Platform.FACEBOOK) {
        return (
            <div className="px-4 py-2 bg-gray-50 rounded-b-xl space-y-3 border-t border-gray-100">
                {comments.map((comment, i) => (
                    <div key={i} className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        <Avatar seed={comment.author} size="sm" />
                        <div>
                            <div className={`bg-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-800 ${isRTL ? 'text-right font-[Noto_Sans_Arabic]' : ''}`}>
                                <span className="font-bold block text-xs mb-0.5">{comment.author}</span>
                                {comment.content}
                            </div>
                            <div className={`flex gap-3 text-[10px] text-gray-500 font-semibold px-2 mt-0.5 ${isRTL ? 'justify-end' : ''}`}>
                                <span>Like</span>
                                <span>Reply</span>
                                <span>{i * 12 + 2}m</span>
                                {comment.likes && <span>{comment.likes}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (platform === Platform.TWITTER) {
        return (
            <div className="border-t border-gray-100 mt-2">
                 {comments.map((comment, i) => (
                    <div key={i} className={`p-4 border-b border-gray-100 flex gap-3 hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        <Avatar seed={comment.author} size="sm" />
                        <div className="flex-1">
                            <div className={`flex items-center gap-1.5 mb-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
                                {comment.handle && <span className="text-gray-500 text-sm">{comment.handle}</span>}
                                <span className="text-gray-500 text-sm">· {i + 1}h</span>
                            </div>
                            <p className={`text-gray-800 text-sm leading-snug mb-2 ${isRTL ? 'font-[Noto_Sans_Arabic]' : ''}`}>{comment.content}</p>
                            <div className={`flex justify-between max-w-[80%] text-gray-500 ${isRTL ? 'ml-auto mr-0' : ''}`}>
                                <MessageCircle size={14} className="hover:text-blue-400 cursor-pointer" />
                                <Repeat2 size={14} className="hover:text-green-500 cursor-pointer" />
                                <div className="flex items-center gap-1 text-xs hover:text-pink-500 cursor-pointer group">
                                    <Heart size={14} /> 
                                    <span>{comment.likes}</span>
                                </div>
                                <Share2 size={14} className="hover:text-blue-400 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                 ))}
            </div>
        );
    }
    return null;
  };

  // X (Twitter) Mockup
  if (platform === Platform.TWITTER) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl max-w-lg mx-auto shadow-sm font-sans relative overflow-hidden">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-20">
            <XIcon className="w-6 h-6" />
        </div>
        
        <div className="p-6">
            <div className={`flex justify-between items-start mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Avatar seed={headline || content} type={persona.avatarType} />
                <div>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-gray-900">{persona.name}</span>
                    {persona.verified && (
                        <CheckCircle2 className="w-4 h-4 text-[#1D9BF0] fill-current" />
                    )}
                  </div>
                  {/* Changed to link for Profile Search */}
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(persona.handle || persona.name + " twitter profile")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:underline hover:text-[#1D9BF0] transition-colors"
                    title="Analyze profile on Google"
                  >
                    {persona.handle}
                  </a>
                </div>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            
            <div className="mb-4 mt-2">
               {renderTextContent()}
               {renderMedia()}
            </div>
            
            <div className="text-gray-500 text-sm mb-4 pb-4 border-b border-gray-100 flex items-center gap-1" dir={isRTL ? 'rtl' : 'ltr'}>
               <span>{timestamp}</span>
               <span className="mx-1">·</span>
               <span className="font-bold text-gray-900">1.2M</span> <span className="text-gray-500">Views</span>
            </div>
            
            <div className="flex justify-between text-gray-500 px-2">
               <div className="flex items-center gap-2 hover:text-[#1D9BF0] cursor-pointer"><MessageCircle size={18} /> <span className="text-xs">1.2K</span></div>
               <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer"><Repeat2 size={18} /> <span className="text-xs">4.5K</span></div>
               <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer"><Heart size={18} /> <span className="text-xs">12K</span></div>
               <div className="flex items-center gap-2 hover:text-[#1D9BF0] cursor-pointer"><Bookmark size={18} /> <span className="text-xs">890</span></div>
               <div className="flex items-center gap-2 hover:text-[#1D9BF0] cursor-pointer"><Share2 size={18} /></div>
            </div>
        </div>
        
        {/* Render Twitter Replies */}
        {renderComments()}
      </div>
    );
  }

  // WhatsApp Mockup
  if (platform === Platform.WHATSAPP) {
    return (
      <div className="bg-[#E5DDD5] rounded-xl max-w-sm mx-auto shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="bg-[#075E54] p-3 flex items-center gap-3 text-white">
             <div className="cursor-pointer"><svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>
             <Avatar seed={headline || content} type={persona.avatarType} size="sm" />
             <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{persona.name}</h3>
                <p className="text-[10px] text-white/80 truncate">{persona.members}</p>
             </div>
             <div className="flex gap-4">
                <Camera size={20} />
                <MoreHorizontal size={20} />
             </div>
          </div>

          <div className="p-4 min-h-[400px] flex flex-col relative" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              <div className={`bg-[#dcf8c6] rounded-lg p-2 shadow-sm self-start max-w-[90%] mb-2 relative border border-green-200 ${isRTL ? 'rounded-tr-none ml-auto text-right' : 'rounded-tl-none mr-auto'}`}>
                 <p className={`text-[11px] font-bold text-orange-600 mb-1 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}><Share2 size={10} className="transform scale-x-[-1]" /> Forwarded</p>
                 {renderMedia()}
                 <div className="mt-1">
                    {renderTextContent()}
                 </div>
                 <span className={`text-[10px] text-gray-500 mt-1 flex items-center gap-1 ${isRTL ? 'float-left flex-row-reverse' : 'float-right'}`}>
                    {timestamp} 
                 </span>
              </div>
          </div>

          <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
             <div className="bg-white rounded-full flex-1 px-4 py-2 flex items-center gap-2 shadow-sm text-gray-400">
                <Smile size={20} />
                <span className={`text-sm flex-1 ${isRTL ? 'text-right' : ''}`}>Type a message</span>
                <Paperclip size={20} />
                <Camera size={20} />
             </div>
             <div className="bg-[#008f69] text-white p-2.5 rounded-full shadow-md">
                <Mic size={20} />
             </div>
          </div>
      </div>
    );
  }

  // Facebook Mockup
  if (platform === Platform.FACEBOOK) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl max-w-lg mx-auto shadow-sm font-sans">
         <div className={`p-4 flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
               <Avatar seed={headline || content} type={persona.avatarType} />
               <div>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <h3 className="font-bold text-gray-900 text-sm">{persona.name}</h3>
                     {persona.verified && <CheckCircle2 size={12} className="text-blue-500 fill-current" />}
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <span>{timestamp}</span>
                     <span>·</span>
                     <Globe size={12} />
                  </div>
               </div>
            </div>
            <MoreHorizontal className="text-gray-500" />
         </div>

         <div className="px-4 pb-2">
            {renderTextContent()}
         </div>

         <div className="mb-2">
            {renderMedia()}
         </div>

         <div className={`px-4 py-2 flex justify-between items-center text-gray-500 text-xs border-b border-gray-100 mx-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <div className="flex items-center gap-1">
                <div className="bg-blue-500 rounded-full p-1 text-white"><ThumbsUp size={8} fill="currentColor" /></div>
                <div className="bg-red-500 rounded-full p-1 text-white"><Heart size={8} fill="currentColor" /></div>
                <span>2.4K</span>
             </div>
             <div className="flex gap-3">
                <span>458 Comments</span>
                <span>129 Shares</span>
             </div>
         </div>

         <div className="px-2 py-1 flex justify-between">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded text-gray-600 font-semibold text-sm">
               <ThumbsUp size={18} /> Like
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded text-gray-600 font-semibold text-sm">
               <MessageCircle size={18} /> Comment
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded text-gray-600 font-semibold text-sm">
               <Share2 size={18} /> Share
            </button>
         </div>

         {/* Render Facebook Comments */}
         {renderComments()}
      </div>
    );
  }

  return null;
};
