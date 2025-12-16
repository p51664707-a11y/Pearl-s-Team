
import React from 'react';
import { SimulationResult, Category } from '../types';
import { RotateCcw, ShieldAlert, ShieldCheck, Siren, FileSpreadsheet, Microscope, ScanEye, Zap, Home, Globe2, Megaphone, Download, BarChart3, AlertTriangle, Link2Off, Key, Languages, Info, Search, ExternalLink } from 'lucide-react';
import { SocialMockup } from './SocialMockup';
import { Tooltip } from './Tooltip';
import { OsintToolkit } from './OsintToolkit';

interface ResultCardProps {
  result: SimulationResult;
  onReset: () => void;
  mode: 'simulation' | 'analysis';
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, mode }) => {
  const handleExport = () => {
    // Check if XLSX is available (loaded from CDN in index.html)
    const XLSX = (window as any).XLSX;
    
    if (!XLSX) {
        alert("Excel export library is still loading. Please try again in a moment.");
        return;
    }

    // --- SHEET 1: ANALYSIS OVERVIEW (Key-Value Format) ---
    const overviewData = [
        { Section: "METADATA", Field: "Timestamp", Value: new Date().toLocaleString() },
        { Section: "", Field: "Category", Value: result.category },
        { Section: "", Field: "Topic", Value: result.topic },
        { Section: "", Field: "Language", Value: result.language },
        { Section: "", Field: "Platform", Value: result.platform },
        { Section: "", Field: "Format", Value: result.format },
        
        { Section: "CONTENT", Field: "Headline", Value: result.headline },
        { Section: "", Field: "Main Content", Value: result.content },
        { Section: "", Field: "Translated Content", Value: result.translatedContent || "N/A" },
        { Section: "", Field: "Misinformation Risk Level", Value: result.misinformationLevel || "Moderate" },
        { Section: "", Field: "Meme Top Text", Value: result.memeTopText || "N/A" },
        { Section: "", Field: "Meme Bottom Text", Value: result.memeBottomText || "N/A" },
        { Section: "", Field: "Image Prompt", Value: result.imagePrompt || "N/A" },

        { Section: "AI GROUND TRUTH", Field: "Stance", Value: result.stance },
        { Section: "", Field: "Extremeness (1-7)", Value: result.aiExtremeness },
        { Section: "", Field: "Credibility (1-7)", Value: result.aiCredibility },
        { Section: "", Field: "Virality (1-10)", Value: result.aiVirality },
        { Section: "", Field: "Harmony Impact (1-7)", Value: result.aiHarmony },
        { Section: "", Field: "Emotion", Value: result.aiEmotion },
        { Section: "", Field: "Trust Damage", Value: result.aiTrustDamage ? "Yes" : "No" },
        { Section: "", Field: "Fact Check Summary", Value: result.factCheckAnalysis },
    ];

    // --- SHEET 2: OSINT DEEP DIVE ---
    const osintData = [
        { Metric: "Logic Gaps", Details: result.osintAnalysis?.logicGaps.join("\n") },
        { Metric: "Source Path", Details: result.osintAnalysis?.sourcePath },
        { Metric: "Strategic Intention", Details: result.osintAnalysis?.intention },
        { Metric: "Actor Profile", Details: result.osintAnalysis?.profileAnalysis?.identity || result.osintAnalysis?.profile },
        { Metric: "Extracted Keywords", Details: result.osintAnalysis?.extractedKeywords?.join(", ") },
        { Metric: "Sentiment Score (-100 to 100)", Details: result.osintAnalysis?.sentimentScore },
        { Metric: "Propaganda Techniques", Details: result.osintAnalysis?.propagandaTechniques.join(", ") },
        { Metric: "Bot Activity Probability", Details: `${result.osintAnalysis?.botActivityProbability}%` },
        { Metric: "Identified Sources", Details: result.groundingUrls?.join("\n") || "None" },
    ];

    // Create Workbook
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(overviewData);
    const ws2 = XLSX.utils.json_to_sheet(osintData);

    // Styling cols
    const wscols = [{ wch: 20 }, { wch: 20 }, { wch: 50 }];
    ws1['!cols'] = wscols;
    ws2['!cols'] = [{ wch: 25 }, { wch: 80 }];

    XLSX.utils.book_append_sheet(wb, ws1, "Simulation Overview");
    XLSX.utils.book_append_sheet(wb, ws2, "OSINT Forensics");

    // Download
    XLSX.writeFile(wb, `Misinfo_Analysis_${Date.now()}.xlsx`);
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

  // Check if analysis mode but no grounding URLs (potential hallucination warning)
  const isHallucinationRisk = (!result.groundingUrls || result.groundingUrls.length === 0);

  // Misinformation Level Helpers
  const getRiskColor = (level?: string) => {
    switch(level) {
        case 'Low': return 'bg-green-100 text-green-800 border-green-200';
        case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level?: string) => {
     switch(level) {
        case 'Low': return <ShieldCheck size={20} />;
        case 'Moderate': return <Info size={20} />;
        case 'High': return <AlertTriangle size={20} />;
        case 'Critical': return <Siren size={20} />;
        default: return <Info size={20} />;
    }
  };

  const topicQuery = result.topic || result.osintAnalysis?.inferredTopic || "India";
  const factCheckLinks = [
      { name: "Alt News", url: `https://www.altnews.in/?s=${encodeURIComponent(topicQuery)}`, color: "text-red-600 bg-red-50 border-red-100 hover:bg-red-100" },
      { name: "Boom Live", url: `https://www.boomlive.in/search?q=${encodeURIComponent(topicQuery)}`, color: "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100" },
      { name: "PIB Fact Check", url: `https://www.google.com/search?q=site:pib.gov.in+${encodeURIComponent(topicQuery)}`, color: "text-green-600 bg-green-50 border-green-100 hover:bg-green-100" },
      { name: "Vishvas News", url: `https://www.vishvasnews.com/search/?q=${encodeURIComponent(topicQuery)}`, color: "text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100" }
  ];

  // Determine Source Name
  const sourceName = result.osintAnalysis?.profileAnalysis?.identity || result.osintAnalysis?.profile;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
        
        {/* Header / Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
               <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                  <Microscope className="text-india-blue" />
                  {mode === 'simulation' ? "Simulation Artifact Generated" : "Content Analysis Report"}
               </h2>
               <p className="text-gray-500 text-sm">
                   {mode === 'simulation' ? "Review the synthetic content and perform analysis." : "Review the AI forensic findings on your input."}
               </p>
            </div>
            <div className="flex gap-3">
                <Tooltip content="Export full analysis dossier to Excel.">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm text-sm"
                    >
                        <FileSpreadsheet size={18} /> Export Report
                    </button>
                </Tooltip>
                <Tooltip content="Reset parameters and start a new simulation.">
                    <button 
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold shadow-sm text-sm"
                    >
                        <RotateCcw size={18} /> New Scan
                    </button>
                </Tooltip>
            </div>
        </div>

        {/* Hallucination Warning Banner (Only visible if no sources found) */}
        {isHallucinationRisk && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r shadow-sm flex items-start gap-3">
                <Link2Off className="text-orange-500 shrink-0" size={20} />
                <div>
                    <h3 className="font-bold text-orange-800 text-sm">Live Verification Failed</h3>
                    <p className="text-xs text-orange-700 mt-1">
                        The analyzer could not find active web sources to verify this input. 
                        The report below is a <strong>hypothetical forensic analysis</strong> based on the text structure only.
                    </p>
                </div>
            </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT: Artifact Display */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <span className="font-bold text-xs uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <ScanEye size={16} /> 
                            {mode === 'simulation' ? "Content Mockup" : "Evidence & Verification"}
                        </span>
                        <span className="bg-india-blue/10 text-india-blue text-xs px-2 py-1 rounded font-bold border border-india-blue/20">
                            {result.platform}
                        </span>
                    </div>
                    
                    <div className="p-6 bg-gray-100">
                        {mode === 'simulation' ? (
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
                                comments={result.comments}
                            />
                        ) : (
                            <div className="space-y-4">
                                {result.imageUrl && (
                                    <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Input Evidence</div>
                                        <img 
                                            src={result.imageUrl} 
                                            alt="Analyzed Evidence" 
                                            className="w-full h-auto max-h-[350px] object-contain rounded border border-gray-100" 
                                        />
                                    </div>
                                )}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
                                            <ShieldCheck size={14} /> Fact Check Verdict
                                        </div>
                                        {/* Misinformation Risk Badge */}
                                        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getRiskColor(result.misinformationLevel)}`}>
                                            {getRiskIcon(result.misinformationLevel)}
                                            {result.misinformationLevel || 'Unknown'} Risk
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{result.headline}</h3>

                                    {/* Source of Misinformation Section */}
                                    {sourceName && (
                                        <div className="mb-4 flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Source of Misinformation:</span>
                                            <a 
                                                href={`https://www.google.com/search?q=${encodeURIComponent(sourceName)}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                            >
                                                {sourceName}
                                                <Search size={12} />
                                            </a>
                                        </div>
                                    )}

                                    {/* Contextual Links Section */}
                                    <div className="mb-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Search size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contextual Fact-Checks ({topicQuery})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {factCheckLinks.map((link) => (
                                                <a 
                                                    key={link.name}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-1 transition-colors hover:shadow-sm ${link.color}`}
                                                >
                                                    {link.name} <ExternalLink size={10} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{result.content}</p>
                                    
                                    {/* Translation Block */}
                                    {result.translatedContent && (
                                        <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Languages size={12} className="text-blue-600" />
                                                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">English Translation</span>
                                            </div>
                                            <p className="text-sm text-gray-800 italic">{result.translatedContent}</p>
                                        </div>
                                    )}

                                    {/* Display Extracted Keywords */}
                                    {result.osintAnalysis?.extractedKeywords && result.osintAnalysis.extractedKeywords.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Key size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Analysis Keywords</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {result.osintAnalysis.extractedKeywords.map((kw, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 font-mono">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Ground Truth Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 font-bold uppercase mb-1">Extremeness</div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900">{result.aiExtremeness}/7</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                                <div className={`h-full ${result.aiExtremeness > 4 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${(result.aiExtremeness/7)*100}%`}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 font-bold uppercase mb-1">Credibility Score</div>
                         <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900">{result.aiCredibility}/7</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                                <div className={`h-full ${result.aiCredibility > 4 ? 'bg-orange-500' : 'bg-gray-400'}`} style={{width: `${(result.aiCredibility/7)*100}%`}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                         <div className="text-xs text-gray-500 font-bold uppercase mb-1">Virality Potential</div>
                         <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900">{result.aiVirality}/10</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                                <div className={`h-full ${result.aiVirality > 7 ? 'bg-purple-500' : 'bg-blue-400'}`} style={{width: `${(result.aiVirality/10)*100}%`}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 font-bold uppercase mb-1">Trust Damage</div>
                         <div className="flex items-center gap-2 h-8">
                            {result.aiTrustDamage ? (
                                <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded">
                                    <ShieldAlert size={16} /> HIGH RISK
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">
                                    <ShieldCheck size={16} /> LOW RISK
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: OSINT Toolkit */}
            <div className="space-y-6">
                 <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
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
    </div>
  );
};
