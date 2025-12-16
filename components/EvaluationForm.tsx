
import React, { useState } from 'react';
import { UserEvaluation, EmotionType, Category, Stance } from '../types';
import { Angry, Meh, Laugh, ShieldAlert, ShieldCheck, Megaphone, AlertOctagon } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface EvaluationFormProps {
  category: Category;
  onSubmit: (evalData: UserEvaluation) => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ category, onSubmit }) => {
  const [extremeness, setExtremeness] = useState<number>(4);
  const [credibility, setCredibility] = useState<number>(4);
  const [virality, setVirality] = useState<number>(5);
  const [harmony, setHarmony] = useState<number>(4);
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [trustDamage, setTrustDamage] = useState<boolean | null>(null);
  const [identifiedStance, setIdentifiedStance] = useState<Stance | null>(null);

  const handleSubmit = () => {
    if (emotion && trustDamage !== null && identifiedStance) {
      onSubmit({ extremeness, credibility, virality, harmony, emotion, trustDamage, identifiedStance });
    }
  };

  const isFormComplete = emotion !== null && trustDamage !== null && identifiedStance !== null;

  const harmonyLabel = category === Category.DOMESTIC 
    ? "Social Harmony Disruption"
    : "Diplomatic Harm Potential";
  
  const harmonyLowLabel = category === Category.DOMESTIC
    ? "Unlikely to disrupt society"
    : "Unlikely to harm relations";

  const harmonyHighLabel = category === Category.DOMESTIC
    ? "Likely to disrupt society"
    : "Likely to harm relations";

  return (
    <div className="bg-white rounded-xl shadow-lg border-t-4 border-india-blue p-6 space-y-6 animate-fade-in-up">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-800 font-serif">Analyst Evaluation Log</h3>
        <p className="text-sm text-gray-500">Assess the simulated artifact based on the following metrics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          {/* Extremeness Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <Tooltip content="Rate how radical or polarized the language is. 1 = Neutral/Objective, 7 = Hate Speech/Radical.">
                  <label className="font-bold text-gray-700 text-sm cursor-help border-b border-dotted border-gray-400">Extremeness (Distortion)</label>
               </Tooltip>
               <span className="text-xl font-bold text-india-blue">{extremeness}/7</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="7" 
              step="1"
              value={extremeness}
              onChange={(e) => setExtremeness(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-india-blue"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Credibility Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <Tooltip content="Rate how believable the content appears to an average user. 1 = Obviously Fake, 7 = Indistinguishable from Truth.">
                  <label className="font-bold text-gray-700 text-sm cursor-help border-b border-dotted border-gray-400">Credibility (Believability)</label>
               </Tooltip>
               <span className="text-xl font-bold text-india-blue">{credibility}/7</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="7" 
              step="1"
              value={credibility}
              onChange={(e) => setCredibility(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-india-blue"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              <span>Fake</span>
              <span>Real</span>
            </div>
          </div>

          {/* Virality Slider (1-10) */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <Tooltip content="Estimate the potential for this content to spread rapidly. 1 = Niche, 10 = Viral Trend.">
                  <label className="font-bold text-gray-700 text-sm cursor-help border-b border-dotted border-gray-400">Virality Potential</label>
               </Tooltip>
               <span className="text-xl font-bold text-india-blue">{virality}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={virality}
              onChange={(e) => setVirality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-india-blue"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              <span>Less Viral</span>
              <span>Very Viral</span>
            </div>
          </div>

          {/* Harmony Slider (Context Dependent) */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <Tooltip content="Rate the risk of this content causing real-world violence, riots, or diplomatic conflict.">
                  <label className="font-bold text-gray-700 text-sm truncate cursor-help border-b border-dotted border-gray-400" title={harmonyLabel}>{harmonyLabel}</label>
               </Tooltip>
               <span className="text-xl font-bold text-india-blue">{harmony}/7</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="7" 
              step="1"
              value={harmony}
              onChange={(e) => setHarmony(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-india-blue"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide">
              <span className="truncate w-1/2 text-left">{harmonyLowLabel}</span>
              <span className="truncate w-1/2 text-right">{harmonyHighLabel}</span>
            </div>
          </div>
      </div>

      <div className="border-t border-gray-100 pt-4 grid md:grid-cols-2 gap-6">
        
        {/* Identified Stance */}
        <div className="space-y-4 md:col-span-2">
           <Tooltip content="Identify the political objective: Is it supporting the establishment or attacking it?" position="top">
              <label className="font-bold text-gray-700 block text-sm w-max border-b border-dotted border-gray-400 cursor-help">Identify Narrative Stance</label>
           </Tooltip>
           <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIdentifiedStance(Stance.PRO_GOVERNMENT)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${identifiedStance === Stance.PRO_GOVERNMENT ? 'bg-orange-50 border-orange-400 text-orange-700 ring-1 ring-orange-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                  <Megaphone size={20} />
                  <div className="text-center">
                      <span className="block font-bold text-sm">Pro-Government</span>
                      <span className="block text-[10px] opacity-75">Nationalist / Pro-Establishment</span>
                  </div>
              </button>
              <button
                onClick={() => setIdentifiedStance(Stance.ANTI_GOVERNMENT)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${identifiedStance === Stance.ANTI_GOVERNMENT ? 'bg-red-50 border-red-400 text-red-700 ring-1 ring-red-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                  <AlertOctagon size={20} />
                  <div className="text-center">
                      <span className="block font-bold text-sm">Anti-Government</span>
                      <span className="block text-[10px] opacity-75">Critical / Dissent</span>
                  </div>
              </button>
           </div>
        </div>

        {/* Emotion Selection */}
        <div className="space-y-4">
           <Tooltip content="What is the primary emotional reaction this content attempts to trigger?" position="top">
              <label className="font-bold text-gray-700 block text-sm w-max border-b border-dotted border-gray-400 cursor-help">Emotional Impression</label>
           </Tooltip>
           <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setEmotion('Angry')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${emotion === 'Angry' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <Angry size={24} />
                <span className="text-xs font-semibold">Angry</span>
              </button>
              <button 
                onClick={() => setEmotion('Neutral')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${emotion === 'Neutral' ? 'bg-gray-200 border-gray-400 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <Meh size={24} />
                <span className="text-xs font-semibold">Neutral</span>
              </button>
              <button 
                onClick={() => setEmotion('Funny')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${emotion === 'Funny' ? 'bg-yellow-50 border-yellow-500 text-yellow-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <Laugh size={24} />
                <span className="text-xs font-semibold">Funny</span>
              </button>
           </div>
        </div>

        {/* Trust Impact */}
        <div className="space-y-4">
           <Tooltip content="Does this content aim to erode faith in national institutions (Courts, Army, Election Commission)?" position="top">
             <label className="font-bold text-gray-700 block text-sm w-max border-b border-dotted border-gray-400 cursor-help">Weaken govt trust?</label>
           </Tooltip>
           <div className="grid grid-cols-2 gap-2">
              <button 
                 onClick={() => setTrustDamage(true)}
                 className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${trustDamage === true ? 'bg-orange-50 border-india-saffron text-india-saffron' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                 <ShieldAlert size={20} />
                 <span className="font-bold text-sm">YES</span>
              </button>
              <button 
                 onClick={() => setTrustDamage(false)}
                 className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${trustDamage === false ? 'bg-green-50 border-india-green text-india-green' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                 <ShieldCheck size={20} />
                 <span className="font-bold text-sm">NO</span>
              </button>
           </div>
        </div>
      </div>

      <Tooltip content={isFormComplete ? "Submit your analysis to compare with AI Ground Truth." : "Complete all fields to submit."} className="w-full">
        <button
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wider transition-all duration-300 shadow-md
            ${isFormComplete 
              ? 'bg-india-blue text-white hover:bg-blue-900 hover:-translate-y-1' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          SUBMIT ANALYSIS
        </button>
      </Tooltip>

    </div>
  );
};
