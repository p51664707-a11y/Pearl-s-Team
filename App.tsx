
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
import { Globe2, Home, ArrowRight, ShieldCheck, Zap, Fingerprint, MousePointer2, Loader2, History, Trash2, Clock, FileText, Image as ImageIcon, Terminal, Microscope, Search, Info } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

enum Step {
  LANDING,
  CATEGORY_SELECT,
  TOPIC_SELECT,
  LANGUAGE_SELECT,
  FORMAT_SELECT,
  PLATFORM_SELECT,
  ANALYZER_INPUT, // New Step
  GENERATING,
  RESULT
}

interface HistoryItem extends SimulationResult {
  id: string;
  timestamp: number;
  mode: 'simulation' | 'analysis';
}

export default function App() {
  const [step, setStep] = useState<Step>(Step.LANDING);
  const [category, setCategory] = useState<Category | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [format, setFormat] = useState<ContentFormat>(ContentFormat.TEXT);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<'simulation' | 'analysis'>('simulation');
  
  // Loading State
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [longWait, setLongWait] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bmm_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
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
    // Keep last 10 items
    const updated = [newItem, ...history].slice(10);
    setHistory(updated);
    localStorage.setItem('bmm_history', JSON.stringify(updated));
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm("Delete all analysis logs? This cannot be undone.")) {
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

  // Detailed Loading Logs
  useEffect(() => {
    if (step === Step.GENERATING) {
      setLoadingLogs([]);
      setLongWait(false);

      const simLogs = [
        "Initializing secure connection to Neural Core...",
        `Loading cultural context vectors for: ${language}...`,
        `Analyzing semantic topology for topic: ${topic}...`,
        `Detecting most volatile narrative stance for context...`,
        "Drafting viral content headers...",
        "Synthesizing organic user engagement patterns...",
        "Constructing visual artifact prompts...",
        "GENERATING SYNTHETIC CONTENT (Optimized Speed)...",
        "Running OSINT forensic diagnostics...",
        "Calculating Strategic Impact & Harmony Risk scores...",
        "Finalizing intelligence dossier..."
      ];

      const analyzeLogs = [
        "Connecting to Analysis Node...",
        "Parsing input content vectors...",
        "Identifying platform signatures...",
        "Running OCR & Visual Pattern Recognition...",
        "Extracting semantic entities and topics...",
        "Inferring cultural context and language...",
        "Scanning for logical fallacies...",
        "Detecting propaganda techniques...",
        "Evaluating bot amplification probability...",
        "Cross-referencing credibility markers...",
        "Compiling OSINT forensic report..."
      ];

      const logs = mode === 'simulation' ? simLogs : analyzeLogs;
      let currentLogIndex = 0;
      
      // Show first log immediately
      setLoadingLogs([logs[0]]);
      currentLogIndex = 1;

      // Faster interval for better perceived speed
      const interval = setInterval(() => {
        if (currentLogIndex < logs.length) {
          setLoadingLogs(prev => [...prev, logs[currentLogIndex]]);
          currentLogIndex++;
        }
      }, 50); // 50ms updates for speed

      // Trigger "Long Wait" message after 8 seconds
      const timeout = setTimeout(() => {
        setLongWait(true);
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, language, topic, mode]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingLogs]);

  const handleStartSimulation = () => {
    setMode('simulation');
    setStep(Step.CATEGORY_SELECT);
  };

  const handleStartAnalysis = () => {
    setMode('analysis');
    setStep(Step.ANALYZER_INPUT);
  };

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setStep(Step.TOPIC_SELECT);
  };

  const handleTopicSelect = (t: string) => {
    setTopic(t);
    setStep(Step.LANGUAGE_SELECT);
  };

  const handleLanguageSelect = (l: string) => {
    setLanguage(l);
    setStep(Step.FORMAT_SELECT);
  };

  const handleFormatSelect = (f: ContentFormat) => {
    setFormat(f);
    setStep(Step.PLATFORM_SELECT);
  }

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

  const handleAnalysisSubmit = async (input: string, image?: string, profileLink?: string) => {
      setStep(Step.GENERATING);
      const res = await analyzeContent(input, image, profileLink);
      setResult(res);
      saveToHistory(res, 'analysis');
      setStep(Step.RESULT);
  };

  const handleReset = () => {
    setStep(Step.LANDING);
    setCategory(null);
    setTopic(null);
    setLanguage('English');
    setPlatform(null);
    setResult(null);
    setFormat(ContentFormat.TEXT);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        
        {/* LANDING PAGE */}
        {step === Step.LANDING && (
          <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in-up mt-8">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-india-saffron/20 blur-3xl rounded-full"></div>
                <AshokaChakra size={120} className="relative z-10 text-india-blue animate-spin-slow drop-shadow-2xl" />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                Identify & Analyze <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-saffron via-india-blue to-india-green">
                  Misinformation Vectors
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                An advanced AI platform for information warfare analysis. <br/>
                <span className="font-bold text-gray-800">Simulate fake narratives</span> or <span className="font-bold text-gray-800">Scan external content</span> to reveal manipulation patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12">
                {/* SIMULATOR CARD */}
                <Tooltip content="Generate synthetic misinformation scenarios for training." className="h-full">
                    <button 
                        onClick={handleStartSimulation}
                        className="w-full h-full group bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-india-blue transition-all hover:-translate-y-2 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={100} className="text-india-blue" />
                        </div>
                        <div className="relative z-10 text-left space-y-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-india-blue">
                                <Zap size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Training Simulator</h3>
                                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                                    Create hypothetical fake news scenarios based on specific topics, regions, and platforms.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 font-bold text-india-blue text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                Initialize <ArrowRight size={16} />
                            </span>
                        </div>
                    </button>
                </Tooltip>

                {/* ANALYZER CARD */}
                <Tooltip content="Analyze real-world links or text for misinformation." className="h-full">
                    <button 
                        onClick={handleStartAnalysis}
                        className="w-full h-full group bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-india-saffron transition-all hover:-translate-y-2 relative overflow-hidden text-white"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Microscope size={100} className="text-india-saffron" />
                        </div>
                        <div className="relative z-10 text-left space-y-4">
                            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center text-india-saffron">
                                <Microscope size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Content Analyzer</h3>
                                <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                                    Input tweet links, text, or screenshots. The AI will reverse-engineer the content and provide an OSINT report.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 font-bold text-india-saffron text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                Start Scan <ArrowRight size={16} />
                            </span>
                        </div>
                    </button>
                </Tooltip>
            </div>

            {/* HISTORY SECTION */}
            {history.length > 0 && (
              <div className="max-w-3xl mx-auto mt-20 pt-10 border-t border-gray-200 animate-fade-in text-left">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="flex items-center gap-2 font-bold text-gray-400 uppercase tracking-widest text-sm">
                      <History size={16} /> Recent Analysis Logs
                   </h3>
                   <Tooltip content="Permanently delete all saved simulation logs." position="left">
                     <button 
                        onClick={clearHistory}
                        className="text-xs text-red-500 hover:text-white hover:bg-red-500 flex items-center gap-1 font-semibold px-3 py-1 rounded transition-colors border border-transparent hover:border-red-500"
                     >
                        <Trash2 size={12} /> CLEAR LOGS
                     </button>
                   </Tooltip>
                </div>
                
                <div className="space-y-3">
                   {history.map((item) => (
                      <Tooltip key={item.id} content={`Review ${item.mode === 'simulation' ? 'Simulation' : 'Analysis'}: ${item.headline}`} position="top" className="w-full">
                        <div 
                          onClick={() => handleHistorySelect(item)}
                          className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-india-blue/50 cursor-pointer transition-all group flex items-center justify-between"
                        >
                           <div className="flex items-center gap-4 overflow-hidden text-left">
                              <div className={`
                                 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold shadow-sm
                                 ${item.mode === 'simulation' ? 'bg-blue-600' : 'bg-gray-800'}
                              `}>
                                 {item.mode === 'simulation' ? <Zap size={14} /> : <Search size={14} />}
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-gray-800 truncate group-hover:text-india-blue transition-colors text-sm md:text-base leading-tight">
                                   {item.headline || "Untitled Analysis"}
                                 </h4>
                                 <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                                    <span className={`font-bold px-1.5 rounded ${item.mode === 'simulation' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700'}`}>
                                        {item.mode === 'simulation' ? 'SIMULATION' : 'ANALYSIS'}
                                    </span>
                                    <span className="text-gray-300">|</span>
                                    <span className="font-medium">{item.topic || "Unknown"}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                           <ArrowRight size={16} className="text-gray-300 group-hover:text-india-blue group-hover:translate-x-1 transition-all" />
                        </div>
                      </Tooltip>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- SIMULATION FLOW --- */}

        {/* CATEGORY SELECT */}
        {step === Step.CATEGORY_SELECT && (
          <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="text-center mb-10">
                <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 1</span>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Select Analysis Domain</h2>
                <p className="text-gray-500 mt-1">Define the origin context for the simulation</p>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
                <Tooltip content="Analyze internal policy, local politics, economy, and social issues within India." className="h-full">
                  <button
                    onClick={() => handleCategorySelect(Category.DOMESTIC)}
                    className="w-full h-full group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-india-saffron/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Home size={120} className="text-india-saffron" />
                    </div>
                    <div className="relative z-10 text-left">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                          <Home className="text-india-saffron w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Domestic Affairs</h3>
                      <p className="text-gray-600 mb-6">Internal policy, local politics, economy, and social issues within India.</p>
                      <span className="text-india-blue font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                          Select Topic <ArrowRight size={16} />
                      </span>
                    </div>
                  </button>
                </Tooltip>

                <Tooltip content="Analyze geopolitics, borders, foreign policy, and foreign influence operations." className="h-full">
                  <button
                    onClick={() => handleCategorySelect(Category.INTERNATIONAL)}
                    className="w-full h-full group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-india-green/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Globe2 size={120} className="text-india-green" />
                    </div>
                    <div className="relative z-10 text-left">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                          <Globe2 className="text-india-green w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">International Relations</h3>
                      <p className="text-gray-600 mb-6">Geopolitics, borders, foreign policy, and foreign influence campaigns.</p>
                      <span className="text-india-blue font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                          Select Topic <ArrowRight size={16} />
                      </span>
                    </div>
                  </button>
                </Tooltip>
             </div>
          </div>
        )}

        {/* TOPIC SELECT */}
        {step === Step.TOPIC_SELECT && category && (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
                <Tooltip content="Go back to domain selection." position="right">
                  <button onClick={() => setStep(Step.CATEGORY_SELECT)} className="text-xs text-gray-400 hover:text-india-blue uppercase tracking-wider mb-2">
                      ← Back to Domain
                  </button>
                </Tooltip>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 2</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Identify Topic</h2>
                <p className="text-gray-500 mt-1">Select the specific subject matter for analysis</p>
             </div>
            <TopicGrid
              topics={category === Category.DOMESTIC ? DOMESTIC_TOPICS : INTERNATIONAL_TOPICS}
              selectedTopic={topic}
              onSelect={handleTopicSelect}
            />
          </div>
        )}

        {/* LANGUAGE SELECT */}
        {step === Step.LANGUAGE_SELECT && (
           <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-10">
                    <Tooltip content="Go back to topic selection." position="right">
                      <button onClick={() => setStep(Step.TOPIC_SELECT)} className="text-xs text-gray-400 hover:text-india-blue uppercase tracking-wider mb-2">
                          ← Back to Topics
                      </button>
                    </Tooltip>
                    <span className="text-india-blue font-bold text-sm tracking-widest uppercase block">Phase 3</span>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Target Language</h2>
                    <p className="text-gray-500 mt-1">Choose the linguistic demographic for the simulation</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                    <LanguageSelector selectedLanguage={language} onSelect={handleLanguageSelect} />
                </div>
           </div>
        )}

        {/* FORMAT SELECT */}
        {step === Step.FORMAT_SELECT && (
           <div className="animate-fade-in">
              <div className="text-center mb-10">
                 <Tooltip content="Go back to language selection." position="right">
                   <button onClick={() => setStep(Step.LANGUAGE_SELECT)} className="text-xs text-gray-400 hover:text-india-blue uppercase tracking-wider mb-2">
                        ← Back to Language
                   </button>
                 </Tooltip>
                 <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 4</span>
                 <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Select Content Format</h2>
                 <p className="text-gray-500 mt-1">Choose the medium of misinformation</p>
              </div>
              <FormatSelector onSelect={handleFormatSelect} />
           </div>
        )}

        {/* PLATFORM SELECT */}
        {step === Step.PLATFORM_SELECT && (
           <div className="animate-fade-in">
              <div className="text-center mb-10">
                 <Tooltip content="Go back to format selection." position="right">
                   <button onClick={() => setStep(Step.FORMAT_SELECT)} className="text-xs text-gray-400 hover:text-india-blue uppercase tracking-wider mb-2">
                        ← Back to Format
                   </button>
                 </Tooltip>
                 <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 5</span>
                 <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Select Propagation Vector</h2>
                 <p className="text-gray-500 mt-1">Choose the social platform to analyze</p>
              </div>
              <PlatformSelector onSelect={handlePlatformSelect} />
           </div>
        )}

        {/* --- ANALYZER FLOW --- */}
        {step === Step.ANALYZER_INPUT && (
            <AnalysisInput 
                onAnalyze={handleAnalysisSubmit}
                onBack={handleReset}
            />
        )}

        {/* GENERATING STATE (Shared) */}
        {step === Step.GENERATING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in max-w-2xl mx-auto">
            
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-india-blue blur-2xl opacity-20 animate-pulse"></div>
              <AshokaChakra size={100} className="animate-spin text-india-blue" />
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
               {mode === 'simulation' 
                 ? <Zap size={24} className="text-india-saffron animate-pulse" /> 
                 : <Search size={24} className="text-india-green animate-pulse" />
               }
               {mode === 'simulation' ? 'Generating Simulation...' : 'Analyzing Vector...'}
            </h2>

            {/* Terminal Style Log */}
            <div className="w-full bg-gray-900 rounded-xl p-4 shadow-xl border border-gray-700 font-mono text-sm overflow-hidden flex flex-col h-64">
               <div className="flex items-center gap-2 mb-3 border-b border-gray-800 pb-2">
                  <Terminal size={14} className="text-green-500" />
                  <span className="text-gray-400 text-xs">system_log.sh</span>
                  <div className="ml-auto flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                   {loadingLogs.map((log, i) => (
                       <div key={i} className="flex gap-2 animate-fade-in">
                           <span className="text-gray-600 select-none">{`>`}</span>
                           <span className={i === loadingLogs.length - 1 ? 'text-green-400 animate-pulse' : 'text-gray-300'}>
                               {log}
                           </span>
                       </div>
                   ))}
                   <div ref={logsEndRef} />
               </div>
            </div>

            <div className="flex flex-col items-center gap-3 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <Loader2 size={14} className="animate-spin text-india-blue" />
                    <span>Processing Neural Request...</span>
                </div>
                
                {/* Long Wait Message */}
                {longWait && (
                    <div className="animate-fade-in-up flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 mt-2 max-w-md text-center">
                        <Info size={16} className="shrink-0" />
                        <p>
                            Complex analysis in progress. {mode === 'simulation' && format === 'Meme / Visual Satire' ? "Image generation can take up to 20 seconds." : "Deep forensic scan in progress."} Please wait.
                        </p>
                    </div>
                )}
            </div>

          </div>
        )}

        {/* RESULTS */}
        {step === Step.RESULT && result && (
          <ResultCard result={result} onReset={handleReset} mode={mode} />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
              <AshokaChakra size={20} className="text-gray-400" />
              <span className="font-serif font-bold text-gray-400">BHARAT MISINFORMATION MONITOR</span>
           </div>
           <p className="text-xs text-gray-400 max-w-2xl mx-auto">
             This application is an educational simulator powered by AI. The content generated is fictional and intended solely for media literacy training. 
             It does not reflect real-world news or the opinions of the developers.
           </p>
        </div>
      </footer>
    </div>
  );
}
