
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

const Avatar = ({ seed, type = 'default', size = "md", partyColor }: { seed: string, type?: Persona['avatarType'], size?: "sm" | "md" | "lg", partyColor?: string }) => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };

  if (type === 'modi') return (
    <div className={`${sizeClasses[size]} bg-orange-500 rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white text-white`}>
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4"><path d="M12 2C9 7 4 9 4 14c0 3 3 5 8 5s8-2 8-5c0-5-5-7-8-12z" opacity="0.9" /><path d="M12 22c-2 0-3-1-3-2h6c0 1-1 2-3 2z" /></svg>
    </div>
  );

  const colors = ["bg-emerald-100 text-emerald-800", "bg-blue-100 text-blue-800", "bg-rose-100 text-rose-800", "bg-amber-100 text-amber-800"];
  const color = partyColor || colors[hash % colors.length];

  return (
    <div className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center shrink-0 overflow-hidden relative ring-1 ring-white`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform scale-110 translate-y-1">
             <path d="M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z" opacity="0.6" />
             <circle cx="12" cy="8.5" r="4.5" />
        </svg>
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const MemeRenderer = ({ imageUrl, topText, bottomText }: { imageUrl: string, topText?: string, bottomText?: string }) => {
    // Advanced layered shadow for authentic "Impact" font look
    const textShadow = `
        -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000,
        -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000,
        0 0 10px rgba(0,0,0,0.8)
    `;

    // Detect if this should be a "Header style" meme (Common in India for quotes)
    const isHeaderStyle = !topText && bottomText && bottomText.length > 60;

    if (isHeaderStyle) {
        return (
            <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm mt-2 flex flex-col">
                <div className="p-4 bg-white border-b border-gray-100">
                    <p className="text-gray-900 font-bold text-sm leading-tight italic">"{bottomText}"</p>
                </div>
                <img src={imageUrl} alt="Context" className="w-full h-auto max-h-[400px] object-cover" />
                <div className="bg-gray-50 p-1.5 flex justify-end">
                   <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">BMM INTEL SIMULATION</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-black shadow-lg mt-2 group select-none">
            {/* Artifact Filter (Slight grain to look like a forward) */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]"></div>
            
            <div className="relative w-full">
                <img 
                    src={imageUrl} 
                    alt="Meme" 
                    className="w-full h-auto block max-h-[500px] object-contain mx-auto brightness-95 contrast-105" 
                />
                
                {/* Overlay Text Container */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none z-20">
                    {topText && (
                        <h2 className="text-white text-center font-black uppercase break-words leading-[1.1] drop-shadow-2xl"
                            style={{ 
                                fontFamily: 'Impact, sans-serif', 
                                textShadow, 
                                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                WebkitTextStroke: '1px black'
                            }}>
                            {topText}
                        </h2>
                    )}
                    {bottomText && (
                        <h2 className="text-white text-center font-black uppercase break-words leading-[1.1] drop-shadow-2xl mb-2"
                            style={{ 
                                fontFamily: 'Impact, sans-serif', 
                                textShadow, 
                                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                WebkitTextStroke: '1px black'
                            }}>
                            {bottomText}
                        </h2>
                    )}
                </div>
            </div>

            {/* Simulated Watermark */}
            <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/40 backdrop-blur-[1px] rounded text-[7px] text-white/50 font-bold z-30 flex items-center gap-1 uppercase tracking-tighter border border-white/5">
                Synthetic Media #BMM-{Math.floor(Math.random()*999)}
            </div>
        </div>
    );
};

export const SocialMockup: React.FC<SocialMockupProps> = ({ platform, headline, content, imageUrl, format, topic, language, memeTopText, memeBottomText, comments }) => {
  const isRTL = language === 'Urdu';

  const getTimestamp = (platform: Platform) => {
    const postTime = new Date(Date.now() - 3.5 * 60 * 60 * 1000);
    if (platform === Platform.TWITTER) return `${postTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · ${postTime.toLocaleDateString([], {month: 'short', day: 'numeric', year: 'numeric'})}`;
    if (platform === Platform.WHATSAPP) return postTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (platform === Platform.FACEBOOK) return "4h";
    return "";
  };

  const persona = { name: "Indian Citizen 🇮🇳", handle: "@IndCitizen", verified: true, avatarType: 'default' as const };

  const isMeme = format === ContentFormat.MEME && imageUrl;

  // WhatsApp Layout
  if (platform === Platform.WHATSAPP) {
    return (
      <div className="bg-[#E5DDD5] rounded-xl max-w-[340px] mx-auto shadow-md border border-gray-200 overflow-hidden font-sans">
          <div className="bg-[#075E54] px-3 py-2 flex items-center gap-3 text-white">
             <Avatar seed="whatsapp" size="sm" />
             <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs truncate">Family Forward Group 🇮🇳</h3>
                <p className="text-[9px] text-white/70 truncate">You, Sharma Ji, +91 98XXX...</p>
             </div>
             <div className="flex gap-3"><Camera size={16} /><MoreHorizontal size={16} /></div>
          </div>

          <div className="p-3 min-h-[300px] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:200px]">
              <div className={`bg-white rounded-lg p-1.5 shadow-sm max-w-[90%] border border-gray-200 relative mb-2 ${isRTL ? 'ml-auto rounded-tr-none' : 'rounded-tl-none'}`}>
                 <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold mb-1 border-b border-gray-100 pb-0.5">
                    <Share2 size={10} className="transform scale-x-[-1] text-gray-400" /> 
                    <span className="italic">Forwarded many times</span>
                 </div>
                 {isMeme ? (
                    <MemeRenderer imageUrl={imageUrl} topText={memeTopText} bottomText={memeBottomText} />
                 ) : (
                    imageUrl && <img src={imageUrl} alt="Artifact" className="w-full h-auto rounded-md mb-2" />
                 )}
                 <div className={`text-[13px] text-gray-800 leading-tight mb-1 p-1 ${isRTL ? 'text-right' : ''}`}>
                    {headline && <span className="font-bold block mb-1 underline">{headline}</span>}
                    {content}
                 </div>
                 <div className="flex justify-end gap-1 items-center pb-0.5 pr-1">
                    <span className="text-[9px] text-gray-400 font-medium">{getTimestamp(platform)}</span>
                    <span className="text-india-blue"><svg viewBox="0 0 16 11" fill="currentColor" width="14"><path d="M11.3 1.1L5.6 7 2.3 3.6.5 5.4l5.1 5.2 7.5-7.7-1.8-1.8zm3.6 0l-1.8 1.8 1.9 2-1.9 1.9 1.8 1.8L16.7 5l-1.8-1.9z"/></svg></span>
                 </div>
              </div>
          </div>
      </div>
    );
  }

  // Twitter/Facebook/Standard Layout
  return (
    <div className="bg-white border border-gray-100 rounded-xl max-w-lg mx-auto shadow-sm overflow-hidden flex flex-col">
       <div className={`p-3 flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
             <Avatar seed={headline} size="md" />
             <div>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                   <h3 className="font-bold text-gray-900 text-sm">{persona.name}</h3>
                   {persona.verified && <CheckCircle2 size={12} className="text-india-blue fill-current" />}
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{platform} Vector</p>
             </div>
          </div>
          <MoreHorizontal className="text-gray-300" size={18} />
       </div>

       <div className="px-4 pb-2">
          {isMeme ? (
            <div className="space-y-3">
               <p className={`text-gray-800 text-sm leading-snug ${isRTL ? 'text-right' : ''}`}>{content}</p>
               <MemeRenderer imageUrl={imageUrl} topText={memeTopText} bottomText={memeBottomText} />
            </div>
          ) : (
            <div className="space-y-3">
               <h4 className={`font-bold text-gray-900 text-base leading-tight ${isRTL ? 'text-right' : ''}`}>{headline}</h4>
               <p className={`text-gray-700 text-sm leading-relaxed ${isRTL ? 'text-right' : ''}`}>{content}</p>
               {imageUrl && <img src={imageUrl} alt="Artifact" className="w-full h-auto rounded-lg border border-gray-100" />}
            </div>
          )}
       </div>

       <div className="px-4 py-3 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-4 text-gray-400">
             <div className="flex items-center gap-1.5 hover:text-india-blue transition-colors cursor-pointer"><MessageCircle size={16}/><span className="text-[10px] font-bold">4.2K</span></div>
             <div className="flex items-center gap-1.5 hover:text-india-green transition-colors cursor-pointer"><Repeat2 size={16}/><span className="text-[10px] font-bold">12K</span></div>
             <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer"><Heart size={16}/><span className="text-[10px] font-bold">89K</span></div>
          </div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">{getTimestamp(platform)}</span>
       </div>
    </div>
  );
};
