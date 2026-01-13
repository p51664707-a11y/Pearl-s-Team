
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { TopicGrid } from './components/TopicGrid';
import { ResultCard } from './components/ResultCard';
import { LanguageSelector } from './components/LanguageSelector';
import { PlatformSelector } from './components/PlatformSelector';
import { FormatSelector } from './components/FormatSelector';
import { AnalysisInput } from './components/AnalysisInput';
import { Category, DOMESTIC_TOPICS, INTERNATIONAL_TOPICS, SimulationResult, Platform, ContentFormat, Stance } from './types';
import { generateSimulation, analyzeContent } from './services/geminiService';
import { AshokaChakra } from './components/AshokaChakra';
import { 
  Globe2, Home, ArrowRight, ShieldCheck, Zap, 
  Fingerprint, MousePointer2, Loader2, History, 
  Trash2, Clock, FileText, Image as ImageIcon, 
  Terminal, Microscope, Search, Info, ShieldAlert,
  BarChart3, Activity, UserCheck, Lock, ChevronRight
} from 'lucide-react';
import { Tooltip } from './components/Tooltip';

enum Step {
  START,
  CATEGORY_SELECT,
  TOPIC_SELECT,
  LANGUAGE_SELECT,
  FORMAT_SELECT,
  PLATFORM_SELECT,
  ANALYZER_INPUT,
  GENERATING,
  RESULT
}

interface HistoryItem extends SimulationResult {
  id: string;
  timestamp: number;
  mode: 'simulation' | 'analysis';
}

export default function App() {
  const [step, setStep] = useState<Step>(Step.START);
  const [category, setCategory] = useState<Category | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [format, setFormat] = useState<ContentFormat>(ContentFormat.TEXT);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<'simulation' | 'analysis'>('simulation');
  
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bmm_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (res: SimulationResult, mode: 'simulation' | 'analysis') => {
    const newItem: HistoryItem = {
      ...res,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now(),
      mode
    };
    const updated = [newItem, ...history].slice(10);
    setHistory(updated);
    localStorage.setItem('bmm_history', JSON.stringify(updated));
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm("Delete all analysis logs?")) {
      setHistory([]);
      localStorage.removeItem('bmm_history');
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item);
    setMode(item.mode);
    setStep(Step.RESULT);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (step === Step.GENERATING) {
      setLoadingLogs([]);
      const simLogs = [
        "Connecting to Neural Core...",
        `Loading vectors: ${language}...`,
        "Analyzing semantic topology...",
        "Drafting headers...",
        "Running diagnostics...",
        "Finalizing dossier..."
      ];
      const analyzeLogs = [
        "Initializing High-Fidelity Forensic Node...",
        "Parsing multimodal input vectors...",
        "Activating Google Search Grounding engine...",
        "Scanning metadata for deepfake markers...",
        "Analyzing sentiment clusters...",
        "Comparing biometric data against archival records...",
        "Verifying territorial symbols (Chinar Leaf, etc)...",
        "Synthesizing forensic intelligence dossier...",
        "Almost ready. Performing final audit..."
      ];
      const logs = mode === 'simulation' ? simLogs : analyzeLogs;
      let currentLogIndex = 0;
      setLoadingLogs([logs[0]]);
      const interval = setInterval(() => {
        if (currentLogIndex < logs.length) {
          setLoadingLogs(prev => [...prev, logs[currentLogIndex]]);
          currentLogIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50); 
      return () => clearInterval(interval);
    }
  }, [step, language, mode]);

  const handleStartSimulation = () => { setMode('simulation'); setStep(Step.CATEGORY_SELECT); };
  const handleStartAnalysis = () => { setMode('analysis'); setStep(Step.ANALYZER_INPUT); };
  const handleCategorySelect = (cat: Category) => { setCategory(cat); setStep(Step.TOPIC_SELECT); };
  const handleTopicSelect = (t: string) => { setTopic(t); setStep(Step.LANGUAGE_SELECT); };
  const handleLanguageSelect = (l: string) => { setLanguage(l); setStep(Step.FORMAT_SELECT); };
  const handleFormatSelect = (f: ContentFormat) => { setFormat(f); setStep(Step.PLATFORM_SELECT); }
  const handlePlatformSelect = async (p: Platform) => {
    setPlatform(p);
    setStep(Step.GENERATING);
    if (category && topic) {
      const res = await generateSimulation(category, topic, language, p, format);
      setResult(res);
      saveToHistory(res, 'simulation');
      setStep(Step.RESULT);
    }
  };
  const handleAnalysisSubmit = async (input: string, image?: string, profileLink?: string, media?: string, mediaMimeType?: string) => {
      setStep(Step.GENERATING);
      const res = await analyzeContent(input, image, profileLink, media, mediaMimeType);
      setResult(res);
      saveToHistory(res, 'analysis');
      setStep(Step.RESULT);
  };
  const handleReset = () => {
    setStep(Step.START);
    setCategory(null);
    setTopic(null);
    setLanguage('English');
    setPlatform(null);
    setResult(null);
    setFormat(ContentFormat.TEXT);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-900 selection:bg-india-blue selection:text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-4 md:py-6">
        {step === Step.START && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
               <h2 className="text-3xl font-serif font-bold text-gray-900">Select Operation Mode</h2>
               <p className="text-sm text-gray-500 max-w-lg mx-auto">Choose a tool to begin auditing or simulating the Indian information ecosystem.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button 
                onClick={handleStartAnalysis}
                className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-india-blue hover:shadow-lg transition-all text-left"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-india-blue mb-4 group-hover:scale-110 transition-transform">
                  <Microscope size={24} />
                </div>
                <h3 className="text-xl font-bold mb-1">Content Analyzer</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">Deep OSINT forensics on text, URLs, images, or media clips.</p>
                <div className="flex items-center gap-2 text-india-blue font-bold text-xs uppercase">Open Analyzer <ArrowRight size={14}/></div>
              </button>

              <button 
                onClick={handleStartSimulation}
                className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-india-saffron hover:shadow-lg transition-all text-left"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-india-saffron mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-1">Scenario Simulator</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">Generate realistic misinformation scenarios for resilience testing.</p>
                <div className="flex items-center gap-2 text-india-blue font-bold text-xs uppercase">Open Simulator <ArrowRight size={14}/></div>
              </button>
            </div>

            {history.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-gray-400" />
                    <h4 className="font-bold text-gray-700 uppercase tracking-widest text-[10px]">Recent Audits</h4>
                  </div>
                  <button onClick={clearHistory} className="text-[9px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest">Clear Logs</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {history.slice(0, 4).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleHistorySelect(item)}
                      className="p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-india-blue/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.mode === 'simulation' ? 'bg-orange-50 text-india-saffron' : 'bg-blue-50 text-india-blue'}`}>
                            {item.mode === 'simulation' ? <Zap size={14} /> : <Search size={14} />}
                         </div>
                         <div className="min-w-0">
                            <h5 className="font-bold text-xs text-gray-900 truncate">{item.headline || "Analysis Artifact"}</h5>
                            <p className="text-[9px] text-gray-400 truncate">{item.topic} • {new Date(item.timestamp).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <ChevronRight size={12} className="text-gray-300 group-hover:text-india-blue group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SIMULATION FLOW */}
        {step === Step.CATEGORY_SELECT && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-8">
              <button onClick={handleReset} className="text-[9px] font-bold text-gray-400 hover:text-india-blue uppercase tracking-widest mb-2">← Main Menu</button>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Information Domain</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => handleCategorySelect(Category.DOMESTIC)} className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-india-saffron hover:shadow-lg transition-all text-left">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-india-saffron mb-4 group-hover:scale-110 transition-transform">
                  <Home size={24} />
                </div>
                <h3 className="text-xl font-bold mb-1">Domestic Stability</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">Internal policies and social cohesion narratives.</p>
                <div className="flex items-center gap-2 text-india-blue font-bold text-xs uppercase tracking-widest">Select <ArrowRight size={12}/></div>
              </button>
              <button onClick={() => handleCategorySelect(Category.INTERNATIONAL)} className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-india-green hover:shadow-lg transition-all text-left">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-india-green mb-4 group-hover:scale-110 transition-transform">
                  <Globe2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-1">Global Geopolitics</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">Foreign policy and border integrity operations.</p>
                <div className="flex items-center gap-2 text-india-blue font-bold text-xs uppercase tracking-widest">Select <ArrowRight size={12}/></div>
              </button>
            </div>
          </div>
        )}

        {step === Step.TOPIC_SELECT && category && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6">
              <button onClick={() => setStep(Step.CATEGORY_SELECT)} className="text-[9px] font-bold text-gray-400 hover:text-india-blue uppercase tracking-widest mb-2">← Change Domain</button>
              <h2 className="text-2xl font-serif font-bold">Select Strategic Topic</h2>
            </div>
            <TopicGrid topics={category === Category.DOMESTIC ? DOMESTIC_TOPICS : INTERNATIONAL_TOPICS} selectedTopic={topic} onSelect={handleTopicSelect} />
          </div>
        )}

        {step === Step.LANGUAGE_SELECT && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
             <div className="text-center mb-6">
               <button onClick={() => setStep(Step.TOPIC_SELECT)} className="text-[9px] font-bold text-gray-400 hover:text-india-blue uppercase tracking-widest mb-2">← Change Topic</button>
               <h2 className="text-2xl font-serif font-bold">Linguistic Targeting</h2>
             </div>
             <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
               <LanguageSelector selectedLanguage={language} onSelect={handleLanguageSelect} />
             </div>
          </div>
        )}

        {step === Step.FORMAT_SELECT && (
           <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                 <button onClick={() => setStep(Step.LANGUAGE_SELECT)} className="text-[9px] font-bold text-gray-400 hover:text-india-blue uppercase tracking-widest mb-2">← Change Language</button>
              </div>
              <FormatSelector onSelect={handleFormatSelect} />
           </div>
        )}

        {step === Step.PLATFORM_SELECT && (
           <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                 <button onClick={() => setStep(Step.FORMAT_SELECT)} className="text-[9px] font-bold text-gray-400 hover:text-india-blue uppercase tracking-widest mb-2">← Change Format</button>
              </div>
              <PlatformSelector onSelect={handlePlatformSelect} />
           </div>
        )}

        {step === Step.ANALYZER_INPUT && <AnalysisInput onAnalyze={handleAnalysisSubmit} onBack={handleReset} />}
        
        {step === Step.GENERATING && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in max-w-2xl mx-auto text-center">
            <AshokaChakra size={64} className="animate-spin-slow text-india-blue mb-6 opacity-20" />
            <div className="w-full bg-gray-900 rounded-xl p-4 shadow-xl border border-gray-800 font-mono text-left">
              <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
                <Terminal size={12} className="text-india-blue" />
                <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">Forensic Pipeline Activity</span>
              </div>
              <div className="h-40 overflow-y-auto custom-scrollbar space-y-1">
                {loadingLogs.map((log, i) => (
                  <div key={i} className="text-[10px] text-gray-400 animate-fade-in flex gap-2">
                    <span className="text-india-blue font-bold">❯</span> {log}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-400 italic">Forensic reasoning typically requires 10-20 seconds of computational audit.</p>
          </div>
        )}

        {step === Step.RESULT && result && <ResultCard result={result} onReset={handleReset} mode={mode} />}
      </main>

      {/* COMPACT FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AshokaChakra size={18} className="opacity-50" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bharat Misinformation Monitor</span>
          </div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} BMM LAB</p>
        </div>
      </footer>
    </div>
  );
}
