
import { RotateCcw, ShieldCheck, Siren, FileSpreadsheet, Microscope, Zap, AlertTriangle, Activity, Link2, Search, Globe, CheckCircle, Mic, Video, FileAudio } from 'lucide-react';
import React from 'react';
import { SocialMockup } from './SocialMockup';
import { OsintToolkit } from './OsintToolkit';
import { SimulationResult } from '../types';

interface ResultCardProps {
  result: SimulationResult;
  onReset: () => void;
  mode: 'simulation' | 'analysis';
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, mode }) => {
  const handleExport = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) {
        alert("Excel export library is still loading. Please try again in a moment.");
        return;
    }
    const overviewData = [
        { Section: "METADATA", Field: "Timestamp", Value: new Date().toLocaleString() },
        { Section: "", Field: "Category", Value: result.category },
        { Section: "", Field: "Topic", Value: result.topic },
        { Section: "", Field: "Language", Value: result.language },
        { Section: "", Field: "Platform", Value: result.platform },
        { Section: "", Field: "Format", Value: result.format },
        { Section: "CONTENT", Field: "Headline", Value: result.headline },
        { Section: "AI GROUND TRUTH", Field: "Stance", Value: result.stance },
        { Section: "", Field: "Misinformation Level", Value: result.misinformationLevel },
        { Section: "ANALYSIS", Field: "Fact Check findings", Value: result.factCheckAnalysis },
    ];
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, ws1, "Analysis Overview");
    XLSX.writeFile(wb, `BMM_Report_${Date.now()}.xlsx`);
  };

  const handleDownloadImage = () => {
    if (result.imageUrl) {
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = `evidence_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const getStatusConfig = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return { text: 'CRITICAL MANIPULATION', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: Siren, barColor: 'bg-red-500', width: '90%' };
      case 'moderate':
      case 'medium':
        return { text: 'MODERATE DISTORTION', color: 'text-india-saffron', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle, barColor: 'bg-india-saffron', width: '55%' };
      default:
        return { text: 'FACTUALLY STABLE', color: 'text-india-green', bg: 'bg-green-50', border: 'border-green-200', icon: ShieldCheck, barColor: 'bg-india-green', width: '15%' };
    }
  };

  const status = getStatusConfig(result.misinformationLevel);

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in-up pb-10">
        
        {/* Simplified Tactical Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-india-blue text-white rounded-xl flex items-center justify-center shadow-lg">
                   <Microscope size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
                     {mode === 'simulation' ? "Simulation Data" : "Forensic Audit"}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-black tracking-widest">
                        ID: {result.topic?.slice(0,3).toUpperCase() || 'GEN'}-{Math.floor(Math.random()*9999)}
                    </span>
                    <span className="text-[10px] text-india-blue font-bold uppercase tracking-widest">BM SYSTEM v3.5</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-india-green text-white rounded-lg hover:bg-green-800 transition-all font-bold text-xs shadow-md">
                    <FileSpreadsheet size={16} /> EXPORT EXCEL
                </button>
                <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all font-bold text-xs shadow-md">
                    <RotateCcw size={16} /> NEW SCAN
                </button>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                {/* Qualitative Verdict Card */}
                <div className={`${status.bg} p-8 rounded-3xl border-2 ${status.border} shadow-lg transition-all relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <status.icon size={120} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">BMM Integrity Verdict</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex flex-col">
                                <h3 className={`text-4xl font-black tracking-tight ${status.color}`}>
                                    {status.text}
                                </h3>
                                <div className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={12} /> Forensic Confidence: High
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 h-3 w-full bg-gray-200/50 rounded-full overflow-hidden border border-gray-100">
                             <div 
                                className={`h-full transition-all duration-1000 ${status.barColor}`} 
                                style={{ width: status.width }}
                             ></div>
                        </div>
                    </div>
                </div>

                {/* Artifact View */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-900 text-white px-5 py-3 flex justify-between items-center">
                        <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400">Evidence Artifact</span>
                        <span className="text-[10px] font-bold uppercase text-india-saffron">{result.platform}</span>
                    </div>
                    <div className="p-6 bg-gray-50/50">
                        {mode === 'simulation' ? (
                            <div className="scale-95 origin-top transform-gpu">
                                <SocialMockup 
                                    platform={result.platform}
                                    headline={result.headline}
                                    content={result.content}
                                    imageUrl={result.imageUrl}
                                    format={result.format}
                                    topic={result.topic}
                                    language={result.language}
                                    memeTopText={result.memeTopText}
                                    memeBottomText={result.memeBottomText}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Media Evidence Display */}
                                {result.mediaBase64 && (
                                    <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                                        {result.mediaMimeType?.startsWith('video/') ? (
                                            <video src={result.mediaBase64} controls className="w-full h-auto max-h-[400px]" />
                                        ) : (
                                            <div className="p-8 flex flex-col items-center gap-4">
                                                <FileAudio size={48} className="text-india-saffron animate-pulse" />
                                                <audio src={result.mediaBase64} controls className="w-full" />
                                                <span className="text-[10px] text-gray-500 font-black uppercase">Vocal Forensic Stream Active</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {result.imageUrl && !result.mediaBase64 && (
                                  <div className="relative">
                                    <img src={result.imageUrl} alt="Evidence" className="w-full h-auto max-h-[300px] object-contain rounded-2xl border border-gray-200 shadow-sm" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-1 rounded flex items-center gap-1">
                                      <Zap size={10} className="text-india-saffron" /> OCR Analysis Active
                                    </div>
                                  </div>
                                )}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3">{result.headline}</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{result.content}</p>
                                    
                                    {result.factCheckAnalysis && (
                                      <div className="mt-4 p-5 bg-india-blue/5 border border-india-blue/10 rounded-2xl relative overflow-hidden">
                                         <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Search size={40} />
                                         </div>
                                         <h4 className="text-[10px] font-black text-india-blue uppercase flex items-center gap-2 mb-3 tracking-[0.2em]">
                                            <ShieldCheck size={14} className="text-india-green" /> Search-Grounded Fact Check
                                         </h4>
                                         <p className="text-xs leading-relaxed text-gray-800 font-bold italic">
                                            {result.factCheckAnalysis}
                                         </p>
                                      </div>
                                    )}

                                    {result.groundingUrls && result.groundingUrls.length > 0 && (
                                      <div className="mt-4 space-y-2">
                                         <div className="flex items-center gap-2 px-1">
                                            <Globe size={10} className="text-india-green" />
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified External Evidence</span>
                                         </div>
                                         <div className="flex flex-wrap gap-2">
                                            {result.groundingUrls.map((url, i) => (
                                              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[9px] font-bold text-india-blue hover:border-india-blue transition-all shadow-sm">
                                                 <Link2 size={10} /> {new URL(url).hostname}
                                              </a>
                                            ))}
                                         </div>
                                      </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-full">
                 <OsintToolkit 
                    headline={result.headline}
                    imageUrl={result.imageUrl}
                    osintAnalysis={result.osintAnalysis}
                    groundingUrls={result.groundingUrls}
                    onDownloadImage={handleDownloadImage}
                    mode={mode}
                 />
            </div>
        </div>
    </div>
  );
};
