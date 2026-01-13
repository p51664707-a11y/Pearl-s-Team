
import { Search, Link as LinkIcon, FileText, ArrowLeft, Upload, Image as ImageIcon, X, AlertCircle, User, ScanLine, UserSearch, Target, Mic, Video, FileAudio } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface AnalysisInputProps {
    onAnalyze: (input: string, image?: string, profileLink?: string, media?: string, mediaMimeType?: string) => void;
    onBack: () => void;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, onBack }) => {
    const [input, setInput] = useState('');
    const [profileLink, setProfileLink] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<{data: string, type: 'audio' | 'video', mime: string} | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const imageInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const processImage = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setSelectedImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const processMedia = (file: File) => {
        const type = file.type.startsWith('audio/') ? 'audio' : file.type.startsWith('video/') ? 'video' : null;
        if (!type) {
            alert('Please upload an audio or video file.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedMedia({
                data: reader.result as string,
                type,
                mime: file.type
            });
        };
        reader.readAsDataURL(file);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const file = e.clipboardData.files?.[0];
        if (file) {
            e.preventDefault();
            if (file.type.startsWith('image/')) processImage(file);
            else processMedia(file);
        }
    };

    const clearMedia = () => {
        setSelectedMedia(null);
        if (mediaInputRef.current) mediaInputRef.current.value = '';
    };

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const hasContent = input.trim().length > 0 || selectedImage !== null || profileLink.trim().length > 0 || selectedMedia !== null;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in space-y-8 mt-10">
            <div className="text-center space-y-4">
                 <button onClick={onBack} className="text-sm text-gray-500 hover:text-india-blue flex items-center gap-1 mx-auto mb-4 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                 </button>
                 <span className="text-india-blue font-bold text-sm tracking-widest uppercase block">Forensic Mode</span>
                 <h2 className="text-4xl font-serif font-bold text-gray-900">Information Audit</h2>
                 <p className="text-gray-500 max-w-lg mx-auto">
                    Audit text, profiles, images, or audio/video for deceptive markers.
                 </p>
            </div>
            
            <div 
                className={`
                    bg-white rounded-3xl shadow-2xl border relative overflow-hidden group transition-all duration-300
                    ${isDragging ? 'border-india-blue ring-4 ring-blue-50 scale-[1.02]' : 'border-gray-100'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                        if (file.type.startsWith('image/')) processImage(file);
                        else processMedia(file);
                    }
                }}
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-india-saffron via-india-blue to-india-green"></div>
                
                <div className="p-8">
                    {/* Actor Profile */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <div className="flex items-center gap-2 text-gray-800 font-black text-[10px] uppercase tracking-widest">
                                <UserSearch size={14} className="text-india-blue" />
                                <span>Social Actor Profile</span>
                            </div>
                        </div>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-india-blue/5 focus:border-india-blue focus:bg-white text-gray-800 placeholder-gray-400 text-xs font-medium transition-all shadow-inner"
                            placeholder="Paste Profile URL (X, Facebook, etc)..."
                            value={profileLink}
                            onChange={(e) => setProfileLink(e.target.value)}
                        />
                    </div>

                    {/* Text Analysis */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2 text-gray-800 font-black text-[10px] uppercase tracking-widest">
                                <FileText size={14} className="text-india-saffron" />
                                <span>Text Content</span>
                            </div>
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="w-full h-32 p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-india-blue/5 focus:border-india-blue resize-none bg-gray-50 text-gray-800 placeholder-gray-400 transition-all font-sans text-sm shadow-inner"
                            placeholder="Enter text or paste claim here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPaste={handlePaste}
                        />
                    </div>

                    {/* Artifact Previews */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Image Preview */}
                        <div className="relative group/img h-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-india-blue/5 transition-colors"
                             onClick={() => !selectedImage && imageInputRef.current?.click()}>
                            {selectedImage ? (
                                <>
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"><X size={12}/></button>
                                </>
                            ) : (
                                <div className="text-center flex flex-col items-center gap-1">
                                    <ImageIcon size={20} className="text-gray-300" />
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Screenshot</span>
                                </div>
                            )}
                            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
                        </div>

                        {/* Media Preview (Audio/Video) */}
                        <div className="relative group/media h-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-india-blue/5 transition-colors"
                             onClick={() => !selectedMedia && mediaInputRef.current?.click()}>
                            {selectedMedia ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-2 text-white relative">
                                    {selectedMedia.type === 'audio' ? <Mic size={24} className="text-india-saffron" /> : <Video size={24} className="text-india-saffron" />}
                                    <span className="text-[8px] font-black uppercase mt-1 truncate max-w-full">{selectedMedia.type} Evidence</span>
                                    <button onClick={(e) => { e.stopPropagation(); clearMedia(); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"><X size={12}/></button>
                                </div>
                            ) : (
                                <div className="text-center flex flex-col items-center gap-1">
                                    <FileAudio size={20} className="text-gray-300" />
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Audio/Video</span>
                                </div>
                            )}
                            <input type="file" ref={mediaInputRef} className="hidden" accept="audio/*,video/*" onChange={(e) => e.target.files?.[0] && processMedia(e.target.files[0])} />
                        </div>
                    </div>
                    
                    <button
                        onClick={() => hasContent && onAnalyze(input, selectedImage || undefined, profileLink || undefined, selectedMedia?.data, selectedMedia?.mime)}
                        disabled={!hasContent}
                        className={`
                            w-full py-5 rounded-2xl font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0
                            ${hasContent 
                                ? 'bg-india-blue text-white hover:bg-blue-900 shadow-india-blue/20' 
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                        `}
                    >
                        <Search size={22} />
                        RUN FORENSIC SCAN
                    </button>
                </div>
            </div>
        </div>
    );
};
