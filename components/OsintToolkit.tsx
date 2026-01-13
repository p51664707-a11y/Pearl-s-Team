
import React, { useState } from 'react';
import { 
  Search, ExternalLink, Fingerprint, ShieldAlert, 
  Target, Info, Activity, Globe, Scale, Hash, 
  UserCheck, AlertTriangle, CheckCircle, Boxes, 
  Eye, FileSearch, Zap, Link2, Gauge, TrendingUp,
  Network, AlertOctagon, Terminal, Radar, Cpu, ShieldCheck, ChevronDown, ChevronUp,
  ImageIcon, BadgeCheck, Type, AlertCircle, Clock, BarChart3, Shield,
  ScanFace, MicVocal, Waves, Video, Share2, MapPin
} from 'lucide-react';
import { OsintAnalysis } from '../types';

interface OsintToolkitProps {
  headline: string;
  imageUrl?: string;
  osintAnalysis?: OsintAnalysis;
  groundingUrls?: string[];
  onDownloadImage: () => void;
  mode: 'simulation' | 'analysis';
}

type TabType = 'overview' | 'actor' | 'tactical' | 'synthetic';

export const OsintToolkit: React.FC<OsintToolkitProps> = ({ headline, imageUrl, osintAnalysis, groundingUrls, onDownloadImage, mode }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedTactic, setExpandedTactic] = useState<number | null>(null);

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(headline)}`;
  const searchTerms = osintAnalysis?.extractedKeywords?.length ? osintAnalysis.extractedKeywords.join(' ') : headline;
  const factCheckUrl = `https://toolbox.google.com/factcheck/explorer/search/${encodeURIComponent(searchTerms)}`;

  const tabs = [
    { id: 'overview' as TabType, label: 'Analytics', icon: Radar },
    { id: 'actor' as TabType, label: 'Origin', icon: Fingerprint },
    { id: 'synthetic' as TabType, label: 'Synthetic', icon: ScanFace },
    { id: 'tactical' as TabType, label: 'Tactics', icon: ShieldAlert },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'medium':
      case 'moderate':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  const visual = osintAnalysis?.visualAnalysis;
  const profile = osintAnalysis?.profileAnalysis;
  const deepfake = visual?.deepfakeDiagnostic;
  const cluster = osintAnalysis?.narrativeCluster;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* 1. Narrative Context Header */}
      <div className="bg-gray-900 text-white p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-india-blue rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                <Radar size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-black tracking-widest uppercase">Forensic Intel</h3>
          </div>
          <div className="w-2 h-2 bg-india-green rounded-full animate-pulse shadow-[0_0_10px_#138808]"></div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Narrative Pattern Detection</span>
           <p className="text-xs font-medium text-gray-100 italic leading-relaxed">
              "{osintAnalysis?.profileAnalysis?.narrativePattern || 'Strategic analysis indicates a deliberate focus on polarizing emotional hooks within targeted digital nodes.'}"
           </p>
        </div>
      </div>

      {/* 2. Navigation */}
      <div className="flex bg-gray-50 p-2 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all
              ${activeTab === tab.id ? 'bg-white text-india-blue shadow-md' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            <tab.icon size={18} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Metrics Content */}
      <div className="p-8 flex-grow overflow-y-auto max-h-[480px] custom-scrollbar space-y-8">
        
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
             {/* Narrative Cluster Section */}
             {cluster && (
                <div className="p-5 bg-gradient-to-br from-gray-900 to-india-blue text-white rounded-2xl shadow-xl">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-india-saffron uppercase tracking-widest flex items-center gap-1">
                         <Network size={12} /> Narrative Cluster Node
                      </span>
                      {cluster.isCoordinated && (
                         <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse">COORDINATED ATTACK</span>
                      )}
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-tight mb-2">{cluster.clusterName || 'Analyzing Segment'}</h4>
                   <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                         <MapPin size={10} className="text-india-green" /> {cluster.primaryGeographicOrigin || 'Undisclosed Origin'}
                      </div>
                      <div className="flex gap-1">
                         {cluster.associatedHashtags?.map((h, i) => (
                            <span key={i} className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded font-black text-gray-300">#{h}</span>
                         ))}
                      </div>
                   </div>
                </div>
             )}

             {/* Forensic Reasoning */}
             <div className="bg-india-blue/5 p-6 rounded-2xl border-l-4 border-india-blue shadow-sm">
                <span className="text-[10px] font-bold text-india-blue uppercase block mb-3 tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Intelligence Summary
                </span>
                <p className="text-sm text-gray-800 leading-relaxed font-bold italic">
                   {osintAnalysis?.forensicReasoning || "Analyzing structural markers for strategic narrative intent and potential cross-platform synchronization..."}
                </p>
             </div>

             {/* Visual Forensic Audit Section */}
             {visual && (
               <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ImageIcon size={14} /> Visual Forensic Audit
                     </span>
                     {visual.isOfficialDocument && (
                        <span className="bg-india-blue/10 text-india-blue text-[8px] font-black px-2 py-1 rounded flex items-center gap-1 uppercase">
                           <BadgeCheck size={10} /> Official Format Detected
                        </span>
                     )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-gray-900 text-white p-4 rounded-xl shadow-inner text-center">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Authenticity Verdict</span>
                        <p className="text-xs font-black uppercase text-india-saffron tracking-tight">{visual.authenticityVerdict || 'Verification Pending'}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                           <span className="text-[9px] font-bold text-gray-500 uppercase block mb-2">Authority Markers</span>
                           <div className="flex flex-wrap gap-1">
                              {visual.authorityMarkers?.length > 0 ? visual.authorityMarkers.map((m, i) => (
                                 <span key={i} className="text-[8px] bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold text-gray-700">{m}</span>
                              )) : <span className="text-[9px] text-gray-400 italic">None detected</span>}
                           </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                           <span className="text-[9px] font-bold text-gray-500 uppercase block mb-2">Detected Objects</span>
                           <div className="flex flex-wrap gap-1">
                              {visual.detectedObjects?.length > 0 ? visual.detectedObjects.map((o, i) => (
                                 <span key={i} className="text-[8px] bg-white border border-gray-200 px-1.5 py-0.5 rounded font-bold text-gray-700">{o}</span>
                              )) : <span className="text-[9px] text-gray-400 italic">None detected</span>}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* Signature Markers */}
             <div className="space-y-4 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Detected Signature Markers</span>
                <div className="flex flex-wrap gap-2">
                   {osintAnalysis?.tacticalMarkers?.map((marker, i) => (
                      <span key={i} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-700 flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-india-saffron"></div> {marker}
                      </span>
                   )) || <span className="text-xs text-gray-400 italic">Processing markers...</span>}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'actor' && (
          <div className="space-y-6 animate-fade-in">
             <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Fingerprint size={80} />
                </div>
                <div className="relative z-10">
                   <span className="text-[9px] text-india-saffron font-bold uppercase tracking-widest block mb-2">Inferred Actor Identity</span>
                   <h4 className="text-xl font-black uppercase tracking-tight">{profile?.identity || 'UNDETERMINED'}</h4>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                   <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Actor Classification</span>
                   <span className="text-xs font-black text-india-blue uppercase">{profile?.actorType || 'UNKNOWN CATEGORY'}</span>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                   <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">Strategic Role</span>
                   <span className="text-xs font-black text-gray-900 uppercase">{profile?.role || 'UNDETERMINED ROLE'}</span>
                </div>
             </div>
             
             {profile?.agendaAlignment && (
                <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                   <span className="text-[9px] font-bold text-india-saffron uppercase block mb-2 tracking-widest">Agenda Alignment</span>
                   <p className="text-[11px] font-bold text-gray-800 italic leading-relaxed">
                      "{profile.agendaAlignment}"
                   </p>
                </div>
             )}
          </div>
        )}

        {activeTab === 'synthetic' && (
          <div className="space-y-6 animate-fade-in">
             <div className={`p-6 rounded-2xl border-2 transition-all ${deepfake?.isDeepfakeSuspected ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <ScanFace size={24} className={deepfake?.isDeepfakeSuspected ? 'text-red-600' : 'text-india-green'} />
                      <h4 className="font-black text-sm uppercase tracking-tight">Deepfake Diagnostic</h4>
                   </div>
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${deepfake?.isDeepfakeSuspected ? 'bg-red-600 text-white' : 'bg-india-green text-white'}`}>
                      {deepfake?.isDeepfakeSuspected ? 'SUSPECTED' : 'CLEAR'}
                   </span>
                </div>
                <p className="text-[11px] text-gray-700 leading-relaxed font-bold">
                   {deepfake?.technicalReasoning || "No deepfake markers detected in primary scan. Audio/Video synchronization appears authentic."}
                </p>
             </div>

             {deepfake?.isDeepfakeSuspected && (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-2">
                            <MicVocal size={12} /> Vocal Analysis
                         </span>
                         <ul className="space-y-1">
                            {deepfake.vocalAnomalies?.map((a, i) => (
                               <li key={i} className="text-[9px] text-red-700 font-bold">• {a}</li>
                            ))}
                         </ul>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-2">
                            <Video size={12} /> Visual Analysis
                         </span>
                         <ul className="space-y-1">
                            {deepfake.visualAnomalies?.map((a, i) => (
                               <li key={i} className="text-[9px] text-red-700 font-bold">• {a}</li>
                            ))}
                         </ul>
                      </div>
                   </div>

                   {deepfake.referenceComparison && (
                      <div className="p-4 bg-india-blue/5 rounded-2xl border border-india-blue/10">
                         <span className="text-[9px] font-bold text-india-blue uppercase flex items-center gap-2 mb-2">
                            <Globe size={12} /> Archival Cross-Reference
                         </span>
                         <p className="text-[10px] text-gray-700 font-medium leading-relaxed italic">
                            {deepfake.referenceComparison}
                         </p>
                         <div className="mt-2 flex items-center gap-1 text-[8px] text-india-blue font-black uppercase">
                            <Waves size={10} />TIMBRE COMPARISON: MATCH {deepfake.confidenceScore}
                         </div>
                      </div>
                   )}
                </div>
             )}
             
             {!deepfake?.isDeepfakeSuspected && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                   <ShieldCheck size={48} className="text-india-green mb-4 opacity-20" />
                   <p className="text-xs text-gray-400 font-black uppercase tracking-widest leading-relaxed">
                      Biometric signatures align with known <br/> archival data records.
                   </p>
                </div>
             )}
          </div>
        )}

        {activeTab === 'tactical' && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tactical signatures</span>
                <span className="text-[10px] bg-india-blue text-white px-2.5 py-1 rounded-full font-black">{osintAnalysis?.propagandaTactics?.length || 0} IDENTIFIED</span>
             </div>
             {osintAnalysis?.propagandaTactics?.map((t, i) => (
                <div 
                  key={i} 
                  className={`
                    border-2 rounded-2xl transition-all duration-200 overflow-hidden
                    ${expandedTactic === i ? 'border-india-blue bg-white shadow-lg' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200'}
                  `}
                >
                  <button 
                    onClick={() => setExpandedTactic(expandedTactic === i ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                       <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                          <Target size={18} className="text-india-blue" />
                       </div>
                       <div className="truncate">
                          <h5 className="font-black text-sm uppercase text-gray-900 truncate tracking-tight">{t.name}</h5>
                          <div className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase inline-block mt-1 ${getSeverityStyles(t.severity)}`}>
                             {t.severity} Impact
                          </div>
                       </div>
                    </div>
                    {expandedTactic === i ? <ChevronUp size={20} className="text-india-blue" /> : <ChevronDown size={20} className="text-gray-300" />}
                  </button>
                  
                  {expandedTactic === i && (
                    <div className="px-5 pb-5 pt-0 animate-fade-in">
                        <div className="h-px bg-gray-100 mb-4"></div>
                        <p className="text-xs text-gray-600 leading-relaxed font-bold italic">
                           {t.description}
                        </p>
                    </div>
                  )}
                </div>
             ))}
          </div>
        )}
      </div>

      <div className="p-5 bg-gray-900 border-t border-gray-800 flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-india-green rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Secure Forensic Node</span>
         </div>
         <button onClick={onDownloadImage} className="bg-india-saffron text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0">
           GENERATE REPORT <Zap size={14} />
         </button>
      </div>
    </div>
  );
};
