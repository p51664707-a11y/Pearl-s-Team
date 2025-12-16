
import React from 'react';
import { Platform } from '../types';
import { Tooltip } from './Tooltip';

interface PlatformSelectorProps {
  onSelect: (platform: Platform) => void;
}

// --- SOCIAL MEDIA ICONS ---
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect }) => {
  const platforms = [
    { id: Platform.TWITTER, icon: XIcon, color: 'bg-black text-white', label: 'X (Twitter)', desc: 'Viral hashtags & political threads' },
    { id: Platform.WHATSAPP, icon: WhatsAppIcon, color: 'bg-[#25D366] text-white', label: 'WhatsApp', desc: 'Encrypted forwards & groups' },
    { id: Platform.FACEBOOK, icon: FacebookIcon, color: 'bg-[#1877F2] text-white', label: 'Facebook', desc: 'Community pages & storytelling' },
  ];

  return (
    <div className="animate-fade-in pb-8">
      <div className="text-center mb-10">
         <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 5</span>
         <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Select Propagation Vector</h2>
         <p className="text-gray-500 mt-1">Choose the social platform to plant the role-play narrative</p>
      </div>

      <div className="max-w-4xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((p) => (
              <Tooltip key={p.id} content={`Simulate a post on ${p.label}.`} className="h-full">
                  <button
                    onClick={() => onSelect(p.id)}
                    className={`
                      w-full h-full group relative overflow-hidden rounded-2xl shadow-sm border border-gray-200 p-6
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white
                      flex flex-col items-center text-center gap-4 hover:border-india-blue/30
                    `}
                  >
                    {/* Background Hover Effect */}
                    <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className={`
                      w-16 h-16 rounded-2xl shadow-md flex items-center justify-center shrink-0
                      ${p.color} transition-transform group-hover:scale-110 z-10
                    `}>
                      <p.icon className="w-8 h-8" />
                    </div>
                    
                    <div className="z-10">
                        <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-india-blue transition-colors">
                          {p.label}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
                    </div>

                    {/* Arrow */}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 absolute right-4 top-1/2 -translate-y-1/2">
                        <svg className="w-6 h-6 text-india-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                  </button>
              </Tooltip>
            ))}
         </div>
      </div>
    </div>
  );
};
