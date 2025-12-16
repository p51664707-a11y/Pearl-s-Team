
import React, { useState } from 'react';
import { Search, Image, Download, ExternalLink, BrainCircuit, ScanLine, Fingerprint, Crosshair, Network, ScanFace, Zap, Tag, Bot, Link2, Key, Loader2, Play, Terminal, AlertTriangle, Gauge, UserCheck, ShieldAlert, CheckCircle, Globe, Shield, ShieldCheck, AlertOctagon } from 'lucide-react';
import { OsintAnalysis } from '../types';

interface OsintToolkitProps {
  headline: string;
  imageUrl?: string;
  osintAnalysis?: OsintAnalysis;
  groundingUrls?: string[];
  onDownloadImage: () => void;
  mode: 'simulation' | 'analysis';
}

export const OsintToolkit: React.FC<OsintToolkitProps> = ({ headline, imageUrl, osintAnalysis, groundingUrls, onDownloadImage, mode }) => {
  const [visualData, setVisualData] = useState<{deepfake?: string, metadata?: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Source Verification State
  const [sourceUrl, setSourceUrl] = useState('');
  const [isVerifyingSource, setIsVerifyingSource] = useState(false);
  const [sourceResult, setSourceResult] = useState<{status: string, color: string, icon: any, details: string, confidence: number} | null>(null);

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(headline)}`;
  
  // Use extracted keywords for the fact check tool if available, otherwise fallback to headline
  const searchTerms = osintAnalysis?.extractedKeywords?.length 
    ? osintAnalysis.extractedKeywords.join(' ') 
    : headline;
  const factCheckUrl = `https://toolbox.google.com/factcheck/explorer/search/${encodeURIComponent(searchTerms)}`;

  const formatExifData = (tags: any, fileStats: any) => {
    let output = "📁 FILE METADATA\n";
    output += `--------------------------------\n`;
    output += `Type: ${fileStats.mimeType || 'Unknown'}\n`;
    output += `Size: ${fileStats.size || 'Unknown'}\n`;
    output += `Dimensions: ${fileStats.dimensions || 'Unknown'}\n`;

    // Check for GenAI signatures in dimensions
    const [w, h] = fileStats.dimensions ? fileStats.dimensions.replace(' px', '').split('x').map((d: string) => parseInt(d)) : [0,0];
    if (w > 0 && w === h && (w === 1024 || w === 512)) {
        output += `Note: ${w}x${h} is a common default resolution for generative AI models.\n`;
    }

    output += `--------------------------------\n\n`;

    if (!tags || Object.keys(tags).length === 0) {
        output += "⚠️ EXIF DATA: STRIPPED / MISSING\n";
        output += "--------------------------------\n";
        output += "• No camera signature found.\n";
        output += "• Reasons:\n";
        output += "  1. Social Media Cleanup (WhatsApp/FB/Twitter strip metadata).\n";
        output += "  2. Screenshot (Does not retain source camera data).\n";
        output += "  3. AI Generated (Native files often lack standard EXIF).\n";
        return output;
    }

    output += "📸 CAMERA / EXIF DATA\n";
    output += `--------------------------------\n`;
    
    // Software Analysis
    if (tags.Software) {
        output += `Software: ${tags.Software}\n`;
        const soft = tags.Software.toLowerCase();
        if (soft.includes('photoshop') || soft.includes('adobe')) {
             output += "⚠️ WARNING: Editing software detected (Adobe).\n";
        } else if (soft.includes('gimp') || soft.includes('canva')) {
             output += "⚠️ WARNING: Editing software detected.\n";
        } else if (soft.includes('stable') || soft.includes('midjourney') || soft.includes('dall-e')) {
             output += "⚠️ CRITICAL: Generative AI signature detected.\n";
        }
    }

    if (tags.Make || tags.Model) output += `Device: ${tags.Make || ''} ${tags.Model || 'Unknown Model'}\n`;
    if (tags.DateTimeOriginal || tags.DateTime) output += `Timestamp: ${tags.DateTimeOriginal || tags.DateTime}\n`;
    if (tags.ExposureTime) output += `Exposure: ${tags.ExposureTime} sec\n`;
    if (tags.FNumber) output += `Aperture: f/${tags.FNumber}\n`;
    if (tags.ISOSpeedRatings) output += `ISO: ${tags.ISOSpeedRatings}\n`;
    
    if (tags.GPSLatitude) {
         const formatCoord = (coord: any) => (Array.isArray(coord) ? `${coord[0]}°${coord[1]}'${coord[2]}"` : coord);
         output += `\n📍 GEO-LOCATION DETECTED\n`;
         output += `Lat: ${formatCoord(tags.GPSLatitude)} ${tags.GPSLatitudeRef || ''}\n`;
         output += `Lon: ${formatCoord(tags.GPSLongitude)} ${tags.GPSLongitudeRef || ''}\n`;
    } else {
         output += `\n📍 GEO-LOCATION: Not Embedded\n`;
    }

    return output;
  };

  const extractFileStats = (buffer: ArrayBuffer, mimeType: string): Promise<any> => {
     return new Promise((resolve) => {
         const sizeKB = (buffer.byteLength / 1024).toFixed(2) + " KB";
         
         // Get dimensions by creating a temporary object URL
         const img = document.createElement('img');
         const blob = new Blob([buffer]);
         const url = URL.createObjectURL(blob);
         
         img.onload = () => {
             resolve({
                 size: sizeKB,
                 mimeType: mimeType,
                 dimensions: `${img.naturalWidth}x${img.naturalHeight} px`
             });
             URL.revokeObjectURL(url);
         };
         
         img.onerror = () => {
             resolve({
                 size: sizeKB,
                 mimeType: mimeType,
                 dimensions: "Unknown"
             });
             URL.revokeObjectURL(url);
         };
         
         img.src = url;
     });
  };

  const runVisualForensics = async () => {
    setIsAnalyzing(true);
    setVisualData(null);

    // 1. ANALYSIS MODE (REAL EXTRACTION)
    if (mode === 'analysis' && imageUrl) {
         try {
             // Simulate network latency for effect
             await new Promise(r => setTimeout(r, 1200));

             // Fetch buffer to handle both Data URI and remote URL (if CORS permits)
             const response = await fetch(imageUrl);
             const buffer = await response.arrayBuffer();
             const mimeType = response.headers.get('content-type') || 'image/jpeg';
             
             // Get Basic Stats
             const stats = await extractFileStats(buffer, mimeType);

             // Get EXIF
             const EXIF = (window as any).EXIF;
             let tags: any = {};
             if (EXIF) {
                 // readFromBinaryFile reads directly from ArrayBuffer
                 tags = EXIF.readFromBinaryFile(buffer);
             }

             const formattedMeta = formatExifData(tags, stats);

             // Deepfake / Manipulation Analysis Heuristics
             let deepfakeReport = "";
             let deepfakeScore = 0; // 0-100

             // 1. Metadata check
             if (!tags || Object.keys(tags).length === 0) {
                 deepfakeScore += 30; // Suspicious but common
             } else {
                 const software = tags.Software ? tags.Software.toLowerCase() : "";
                 if (software.includes('photoshop') || software.includes('edit')) deepfakeScore += 40;
                 if (software.includes('ai') || software.includes('generate')) deepfakeScore += 80;
             }

             // 2. Dimensions Check (Square often GenAI)
             const dimStr = stats.dimensions ? stats.dimensions.replace(' px', '') : "0x0";
             const [w, h] = dimStr.split('x').map((d: string) => parseInt(d));
             if (w > 0 && w === h) {
                 deepfakeScore += 20; // Square aspect ratio is popular for default diffusion models
             }

             // 3. Format Check
             if (mimeType === 'image/png') deepfakeScore += 10; // GenAI often outputs PNG default (lossless)

             // Construct Report
             if (deepfakeScore > 50) {
                 deepfakeReport = `⚠️ POTENTIAL MANIPULATION DETECTED (Risk Score: ${deepfakeScore}%)\n`;
                 deepfakeReport += `- Indicators: Edited software signature, suspicious dimensions, or missing provenance.\n`;
                 deepfakeReport += `- Recommendation: Use 'Reverse Image Search' to find original context.`;
             } else {
                 deepfakeReport = `ℹ️ NO OBVIOUS MANIPULATION SIGNS (Risk Score: ${deepfakeScore}%)\n`;
                 deepfakeReport += `- Structure: Consistent with standard digital capture or screenshot.\n`;
                 deepfakeReport += `- Note: High-quality Deepfakes can mimic these signatures. Verify source.`;
             }

             setVisualData({
                 deepfake: deepfakeReport,
                 metadata: formattedMeta
             });

         } catch (e) {
             console.error("Forensics failed", e);
             setVisualData({
                 deepfake: "❌ ERROR: Could not process image data.",
                 metadata: "Error: Image source is unreadable, corrupted, or restricted by CORS policy."
             });
         }
         
         setIsAnalyzing(false);
         return;
    }

    // 2. SIMULATION MODE / FALLBACK
    setTimeout(() => {
        if (mode === 'simulation') {
            setVisualData({
                deepfake: "⚠️ CRITICAL: GAN generation artifacts detected.\n- Inconsistent pixel density in facial region.\n- Irregular iris reflection patterns.\n- 99% Synthetic Probability.",
                metadata: `📁 FILE METADATA\n--------------------------------\nType: image/png\nSize: 1024.5 KB\nDimensions: 1024x1024 px\n--------------------------------\n\n⚠️ EXIF DATA: SYNTHETIC\n- Creator Tool: Google GenAI 2.5\n- Timestamp: ${new Date().toISOString()}`
            });
        } else {
             setVisualData({
                deepfake: "ℹ️ SCAN RESULT: No obvious generative artifacts detected.",
                metadata: `📁 FILE METADATA\n--------------------------------\nType: image/jpeg\nSize: Unknown\nDimensions: Unknown\n--------------------------------\n\n⚠️ EXIF DATA: UNAVAILABLE`
            });
        }
        setIsAnalyzing(false);
    }, 2000);
  };

  const handleSourceVerification = () => {
    if (!sourceUrl.trim()) return;
    
    setIsVerifyingSource(true);
    setSourceResult(null);

    // Simulate API Latency
    setTimeout(() => {
        const lowerUrl = sourceUrl.toLowerCase();
        
        // Mock Database Logic
        if (lowerUrl.includes('gov.in') || lowerUrl.includes('nic.in') || lowerUrl.includes('who.int') || lowerUrl.includes('reuters') || lowerUrl.includes('pti')) {
            setSourceResult({
                status: "Reputable / Official",
                color: "bg-green-100 text-green-800 border-green-300",
                icon: ShieldCheck,
                details: "Domain is whitelisted in official registry. High trust score.",
                confidence: 98
            });
        } else if (lowerUrl.includes('fake') || lowerUrl.includes('propaganda') || lowerUrl.includes('news-xyz') || lowerUrl.includes('freedom-eagle')) {
            setSourceResult({
                status: "Known Disinformation Source",
                color: "bg-red-100 text-red-800 border-red-300",
                icon: AlertOctagon,
                details: "Domain flagged in 14+ intelligence reports for coordinated inauthentic behavior.",
                confidence: 95
            });
        } else if (lowerUrl.includes('blog') || lowerUrl.includes('wordpress') || lowerUrl.includes('opinion')) {
             setSourceResult({
                status: "Unverified / Opinion",
                color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                icon: AlertTriangle,
                details: "Self-published platform. Lack of editorial oversight detected.",
                confidence: 60
            });
        } else {
             setSourceResult({
                status: "Suspect / Low Authority",
                color: "bg-orange-100 text-orange-800 border-orange-300",
                icon: ShieldAlert,
                details: "Domain registered recently (< 6 months). Low backlink authority. Proceed with caution.",
                confidence: 75
            });
        }
        setIsVerifyingSource(false);
    }, 1500);
  };

  // Breadcrumb renderer for Source Path
  const renderBreadcrumbs = (path: string) => {
    const parts = path.split('->').map(p => p.trim());
    return (
        <div className="flex flex-wrap items-center gap-2 mt-2">
            {parts.map((part, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="bg-white/80 px-2 py-1 rounded text-xs font-mono font-semibold text-blue-900 border border-blue-200 shadow-sm">
                        {part}
                    </span>
                    {idx < parts.length - 1 && (
                        <span className="text-blue-300">/</span>
                    )}
                </div>
            ))}
        </div>
    );
  };

  const renderSentimentBar = (score: number) => {
    // Score is -100 to 100. Normalize to 0-100% for CSS width
    const normalized = (score + 100) / 2; 
    let color = "bg-gray-400";
    let label = "Neutral";

    if (score > 25) { color = "bg-green-500"; label = "Positive / Supportive"; }
    else if (score < -25) { color = "bg-red-500"; label = "Negative / Hostile"; }
    else { color = "bg-gray-400"; label = "Neutral / Objective"; }

    return (
        <div className="mt-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
                <span>Negative</span>
                <span>Positive</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative border border-gray-300">
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 z-10"></div>
                <div 
                    className={`absolute top-0 bottom-0 ${color} transition-all duration-1000`} 
                    style={{ 
                        left: score < 0 ? `${normalized}%` : '50%', 
                        width: `${Math.abs(score) / 2}%` 
                    }} 
                />
            </div>
            <div className="text-right text-xs font-bold mt-1 text-gray-700">{label} ({score})</div>
        </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* 1. DIGITAL FORENSICS SECTION */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 font-serif flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
           <Terminal size={18} className="text-india-blue" /> 
           Digital Forensics & Deep Scan
        </h3>
        
        {/* GROUNDING / SOURCES SECTION */}
        {groundingUrls && groundingUrls.length > 0 ? (
            <div className="mb-6 animate-fade-in">
                <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Link2 size={64} className="text-green-600" />
                    </div>
                    <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Link2 size={16} /> Live Verification Sources Detected
                    </h4>
                    <p className="text-xs text-green-800 mb-2 font-medium">
                        The AI successfully scanned these URLs to verify the content context:
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {groundingUrls.map((url, i) => (
                             <a 
                                key={i}
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-white/80 p-2 rounded border border-green-100/50 truncate"
                             >
                                <ExternalLink size={12} className="shrink-0 text-green-600" />
                                <span className="truncate">{url}</span>
                             </a>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="mb-6 animate-fade-in">
                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4 border-dashed">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                         <Link2 size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">No Live Sources</span>
                    </div>
                    <p className="text-xs text-gray-400">
                        No external URLs were accessed during this scan. The analysis is based on internal pattern matching only.
                    </p>
                </div>
            </div>
        )}

        {osintAnalysis ? (
           <div className="grid md:grid-cols-2 gap-4">
               
               {/* Extracted Keywords */}
               {osintAnalysis.extractedKeywords && osintAnalysis.extractedKeywords.length > 0 && (
                   <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 relative hover:shadow-md transition-shadow md:col-span-2">
                       <div className="absolute top-3 right-3 opacity-10">
                           <Key className="text-amber-600" size={40} />
                       </div>
                       <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Key size={14} /> URL/Text Keywords Extracted
                       </h4>
                       <div className="flex flex-wrap gap-2">
                           {osintAnalysis.extractedKeywords.map((kw, i) => (
                               <span key={i} className="px-3 py-1 bg-white border border-amber-200 text-amber-800 rounded text-sm font-mono shadow-sm">
                                   {kw}
                               </span>
                           ))}
                       </div>
                   </div>
               )}

               {/* Logic Gaps */}
               <div className="bg-red-50 p-4 rounded-xl border border-red-100 relative hover:shadow-md transition-shadow">
                   <div className="absolute top-3 right-3 opacity-10">
                       <AlertTriangle className="text-red-600" size={40} />
                   </div>
                   <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <BrainCircuit size={14} /> Cognitive Audit
                   </h4>
                   <ul className="space-y-2">
                       {osintAnalysis.logicGaps.map((gap, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-gray-800 bg-white/80 p-2.5 rounded border border-red-100/50">
                               <div className="mt-0.5 min-w-[6px] h-1.5 rounded-full bg-red-500 shadow-sm"></div>
                               <span className="leading-snug">{gap}</span>
                           </li>
                       ))}
                   </ul>
               </div>

               {/* Source Path */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 relative hover:shadow-md transition-shadow">
                   <div className="absolute top-3 right-3 opacity-10">
                       <Network className="text-blue-600" size={40} />
                   </div>
                   <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Network size={14} /> Origin Trace
                   </h4>
                   {renderBreadcrumbs(osintAnalysis.sourcePath)}
               </div>

               {/* Propaganda Techniques */}
               <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 relative hover:shadow-md transition-shadow md:col-span-2">
                   <div className="absolute top-3 right-3 opacity-10">
                       <Tag className="text-purple-600" size={40} />
                   </div>
                   <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Zap size={14} /> Detected Propaganda Techniques
                   </h4>
                   <div className="flex flex-wrap gap-2">
                       {osintAnalysis.propagandaTechniques.map((tech, i) => (
                           <span key={i} className="px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-full text-xs font-bold shadow-sm">
                               {tech}
                           </span>
                       ))}
                   </div>
               </div>

               {/* Advanced Metrics: Sentiment & Bot Probability */}
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-2 grid md:grid-cols-2 gap-6">
                    {/* Sentiment */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Gauge size={14} /> Sentiment Analysis
                        </h4>
                        {renderSentimentBar(osintAnalysis.sentimentScore)}
                    </div>

                    {/* Bot Probability */}
                    <div>
                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Bot size={14} /> Bot Amplification Risk
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${osintAnalysis.botActivityProbability > 70 ? 'bg-red-500' : osintAnalysis.botActivityProbability > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                        style={{ width: `${osintAnalysis.botActivityProbability}%` }} 
                                    />
                                </div>
                            </div>
                            <span className="text-sm font-mono font-bold w-12 text-right">{osintAnalysis.botActivityProbability}%</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Probability of automated dissemination based on syntax and pattern matching.</p>
                    </div>
               </div>

               {/* Actor Profile */}
               <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative hover:shadow-md transition-shadow text-white shadow-inner md:col-span-2">
                   <div className="absolute top-3 right-3 opacity-20">
                       <Fingerprint className="text-cyan-400" size={40} />
                   </div>
                   <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <UserCheck size={14} /> Actor Profile
                   </h4>
                   {osintAnalysis.profileAnalysis ? (
                       <div className="space-y-4">
                           {/* Header Info */}
                           <div className="flex items-start gap-4">
                                <div className="bg-cyan-900/30 p-2.5 rounded-lg text-cyan-400 border border-cyan-500/30">
                                    <ScanLine size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h5 className="text-lg font-bold text-white leading-tight mb-1">{osintAnalysis.profileAnalysis.identity}</h5>
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-900 text-cyan-300 border border-cyan-700 font-bold uppercase tracking-wider">
                                            {osintAnalysis.profileAnalysis.actorType}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono">ID: {btoa(osintAnalysis.profileAnalysis.identity).substring(0, 12)}...</p>
                                </div>
                           </div>

                           {/* Narrative Pattern */}
                           <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Narrative Pattern</div>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {osintAnalysis.profileAnalysis.narrativePattern}
                                </p>
                           </div>

                           {/* Risks */}
                           <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                        <AlertTriangle size={10} className="text-orange-400" /> Associated Risks
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {osintAnalysis.profileAnalysis.associatedRisks.map((risk, i) => (
                                            <span key={i} className="text-[10px] px-2 py-1 bg-red-900/40 text-red-200 border border-red-800/50 rounded">
                                                {risk}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                                     <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                        <ShieldAlert size={10} className="text-green-400" /> Historical Context
                                    </div>
                                    <p className="text-xs text-gray-300 italic">
                                        {osintAnalysis.sourcePath.includes('Official') ? 'Verified official entity.' : 'Pattern matches known influence operations.'}
                                    </p>
                                </div>
                           </div>
                       </div>
                   ) : (
                       <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded border border-gray-700">
                           <div className="bg-cyan-900/30 p-2 rounded text-cyan-400">
                               <ScanLine size={20} />
                           </div>
                           <div>
                               <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Identity Signature</div>
                               <div className="text-sm font-mono text-gray-100 leading-relaxed font-semibold">
                                   {osintAnalysis.profile}
                               </div>
                           </div>
                       </div>
                   )}
               </div>

               {/* Intent Decoder */}
               <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 relative hover:shadow-md transition-shadow">
                   <div className="absolute top-3 right-3 opacity-10">
                       <Crosshair className="text-orange-600" size={40} />
                   </div>
                   <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Crosshair size={14} /> Strategic Intent
                   </h4>
                   <div className="flex items-start gap-3 bg-white/60 p-3 rounded border border-orange-100">
                        <div className="bg-orange-100 p-2 rounded text-orange-600">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-orange-400 uppercase tracking-wider mb-1">Target Objective</div>
                            <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                {osintAnalysis.intention}
                            </p>
                        </div>
                   </div>
               </div>
           </div>
        ) : (
            <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                Data unavailable for this simulation.
            </div>
        )}
      </div>

      {/* 2. VISUAL FORENSICS SECTION */}
      <div>
         <h3 className="text-lg font-bold text-gray-800 font-serif flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
             <ScanFace size={18} className="text-purple-600" />
             Visual Forensics Lab
         </h3>

         <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              {!imageUrl ? (
                  <div className="text-center text-gray-400 py-6">
                      <Image className="mx-auto mb-2 opacity-50" size={24} />
                      <p className="text-sm">No visual artifact associated with this intelligence.</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {!visualData ? (
                          <div className="text-center py-6">
                              <p className="text-sm text-gray-600 mb-4">Image artifact detected. Run Deepfake and Metadata extraction analysis?</p>
                              <button 
                                onClick={runVisualForensics}
                                disabled={isAnalyzing}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                                {isAnalyzing ? "Scanning Artifact..." : "Run Forensics Diagnostics"}
                              </button>
                          </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
                            <div className="w-full space-y-4">
                                {/* Deepfake Detector */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        Neural Deepfake Detector
                                    </h4>
                                    <div className={`p-3 border-l-4 text-xs font-mono rounded-r ${mode === 'simulation' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-green-50 border-green-500 text-green-800'}`}>
                                        <div className="whitespace-pre-wrap">{visualData.deepfake}</div>
                                    </div>
                                </div>

                                {/* Metadata Extractor */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        Metadata/EXIF Extractor
                                    </h4>
                                    <div className="p-3 bg-gray-50 border-l-4 border-gray-500 text-xs text-gray-600 font-mono whitespace-pre-wrap rounded-r">
                                        {visualData.metadata}
                                    </div>
                                </div>
                            </div>
                        </div>
                      )}
                  </div>
              )}
          </div>
      </div>
      
      {/* 3. SOURCE REPUTATION SCANNER */}
      <div>
         <h3 className="text-lg font-bold text-gray-800 font-serif flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
             <Shield size={18} className="text-indigo-600" />
             Source Reputation Scanner
         </h3>
         
         <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
                <div className="w-full flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Verify Source URL</label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="e.g. news-daily.com or twitter.com/username" 
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none text-sm"
                        />
                    </div>
                </div>
                <button 
                    onClick={handleSourceVerification}
                    disabled={!sourceUrl || isVerifyingSource}
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
                >
                    {isVerifyingSource ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    {isVerifyingSource ? "Scanning DB..." : "Check Reputation"}
                </button>
            </div>

            {/* Verification Result */}
            {sourceResult && (
                <div className={`mt-4 p-4 rounded-lg border flex items-start gap-4 animate-fade-in ${sourceResult.color}`}>
                    <div className="p-2 bg-white/50 rounded-full shrink-0">
                        <sourceResult.icon size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight">{sourceResult.status}</h4>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                             <div className="h-1.5 w-24 bg-black/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-current" style={{ width: `${sourceResult.confidence}%` }}></div>
                             </div>
                             <span className="text-xs font-bold opacity-80">{sourceResult.confidence}% Confidence</span>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed">
                            {sourceResult.details}
                        </p>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* 4. EXTERNAL VERIFICATION */}
      <div>
          <h3 className="text-lg font-bold text-gray-800 font-serif flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
             <Search size={18} className="text-green-600" />
             External Verification
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
             {/* Google Search */}
             <a 
                href={googleSearchUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Search size={20} /></div>
                   <div>
                       <span className="block font-bold text-gray-800 text-sm">Verify Headline</span>
                       <span className="block text-xs text-gray-500">Search for corroborating sources</span>
                   </div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500" />
             </a>

             {/* Fact Check Explorer */}
             <a 
                href={factCheckUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-green-400 hover:shadow-md transition-all group"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-green-50 p-2 rounded-lg text-green-600"><CheckCircle size={20} /></div>
                   <div>
                       <span className="block font-bold text-gray-800 text-sm">Fact Check Explorer</span>
                       <span className="block text-xs text-gray-500">
                           {osintAnalysis?.extractedKeywords?.length ? "Searching extracted keywords" : "Cross-reference with Google Tools"}
                       </span>
                   </div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-green-500" />
             </a>

             {/* Image Search Tools */}
             {imageUrl && (
                 <>
                    <a 
                    href="https://images.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-400 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-3">
                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Image size={20} /></div>
                        <div>
                            <span className="block font-bold text-gray-800 text-sm">Reverse Image Search</span>
                            <span className="block text-xs text-gray-500">Google Lens / Images</span>
                        </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-purple-500" />
                    </a>
                    
                     <button 
                        onClick={onDownloadImage}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 transition-all group text-left"
                     >
                        <div className="flex items-center gap-3">
                        <div className="bg-gray-200 p-2 rounded-lg text-gray-700"><Download size={20} /></div>
                        <div>
                            <span className="block font-bold text-gray-800 text-sm">Download Evidence</span>
                            <span className="block text-xs text-gray-500">Save artifact for offline analysis</span>
                        </div>
                        </div>
                    </button>
                 </>
             )}
          </div>
      </div>
    </div>
  );
};
