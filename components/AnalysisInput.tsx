
import React, { useState, useRef, useEffect } from 'react';
import { Search, Link as LinkIcon, FileText, ArrowLeft, Upload, Image as ImageIcon, X, AlertCircle, User, ScanLine } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface AnalysisInputProps {
    onAnalyze: (input: string, image?: string, profileLink?: string) => void;
    onBack: () => void;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, onBack }) => {
    const [input, setInput] = useState('');
    const [profileLink, setProfileLink] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, WebP).');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (e.clipboardData.files?.[0]) {
            e.preventDefault();
            processFile(e.clipboardData.files[0]);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Focus textarea on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const hasContent = input.trim().length > 0 || selectedImage !== null;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in space-y-8 mt-10">
            <div className="text-center space-y-4">
                 <button onClick={onBack} className="text-sm text-gray-500 hover:text-india-blue flex items-center gap-1 mx-auto mb-4 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                 </button>
                 <span className="text-india-blue font-bold text-sm tracking-widest uppercase block">Analyzer Mode</span>
                 <h2 className="text-4xl font-serif font-bold text-gray-900">Content Diagnostic</h2>
                 <p className="text-gray-500 max-w-lg mx-auto">
                    Analyze misinformation vectors. <br/>
                    <span className="font-bold text-gray-700">Supported:</span> Text claims, URLs, or Screenshots (Paste/Upload).
                 </p>
            </div>
            
            <div 
                className={`
                    bg-white rounded-2xl shadow-xl border relative overflow-hidden group transition-all duration-300
                    ${isDragging ? 'border-india-blue ring-4 ring-blue-50 scale-[1.02]' : 'border-gray-100'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-india-saffron via-white to-india-green"></div>
                
                <div className="p-8">
                    {/* Source Profile Input */}
                    <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                         <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                                <ScanLine size={16} />
                                <label>Profile Pattern Analyzer</label>
                            </div>
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">Optional</span>
                         </div>
                         <p className="text-xs text-gray-500 mb-3">
                            Paste the URL of the source profile (X, Facebook, Website) to analyze their <strong>Narrative Pattern</strong> and <strong>History of Misinformation</strong>.
                         </p>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent bg-white text-gray-800 placeholder-gray-400 text-sm transition-all"
                            placeholder="e.g. twitter.com/username or facebook.com/page-name"
                            value={profileLink}
                            onChange={(e) => setProfileLink(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                            <FileText size={16} />
                            <label>Input Evidence</label>
                        </div>
                        {selectedImage && (
                            <span className="text-xs font-semibold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                <ImageIcon size={12} /> Image Attached
                            </span>
                        )}
                    </div>

                    <textarea
                        ref={textareaRef}
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-india-blue focus:border-transparent resize-none bg-gray-50 text-gray-800 placeholder-gray-400 transition-all font-mono text-sm mb-4"
                        placeholder="Paste text/URL here, or paste an image (Ctrl+V)..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPaste={handlePaste}
                    />

                    {/* Image Preview Area */}
                    {selectedImage ? (
                        <div className="relative mb-6 group/image">
                            <div className="h-40 w-full bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center relative">
                                <img src={selectedImage} alt="Preview" className="h-full w-full object-contain" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={clearImage}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} /> Remove Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">OR</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                    )}

                    {/* Upload Controls */}
                    {!selectedImage && (
                        <div className="flex gap-4 mb-6">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:border-india-blue hover:text-india-blue hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Upload size={18} />
                                Upload Screenshot / Image
                            </button>
                        </div>
                    )}
                    
                    <Tooltip content={!hasContent ? "Please enter text or upload an image." : "Start the OSINT analysis process."} className="w-full">
                        <button
                            onClick={() => hasContent && onAnalyze(input, selectedImage || undefined, profileLink || undefined)}
                            disabled={!hasContent}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold tracking-wider flex items-center justify-center gap-2 hover:bg-india-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            <Search size={20} />
                            {selectedImage ? "SCAN IMAGE & TEXT" : "RUN DEEP SCAN"}
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className="flex justify-center gap-8 text-xs text-gray-400 uppercase tracking-widest font-semibold">
                <span className="flex items-center gap-1"><FileText size={12} /> Text Claims</span>
                <span className="flex items-center gap-1"><LinkIcon size={12} /> URL Verification</span>
                <span className="flex items-center gap-1"><ImageIcon size={12} /> Visual Forensics</span>
            </div>
        </div>
    );
};
