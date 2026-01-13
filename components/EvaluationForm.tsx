
import React, { useState } from 'react';
import { UserEvaluation, EmotionType, Category, Stance } from '../types';
import { Angry, Meh, Laugh, ShieldAlert, ShieldCheck, Megaphone, AlertOctagon } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface EvaluationFormProps {
  category: Category;
  onSubmit: (evalData: UserEvaluation) => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ category, onSubmit }) => {
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [trustDamage, setTrustDamage] = useState<boolean | null>(null);
  const [identifiedStance, setIdentifiedStance] = useState<Stance | null>(null);

  const handleSubmit = () => {
    if (emotion && trustDamage !== null && identifiedStance) {
      onSubmit({ emotion, trustDamage, identifiedStance });
    }
  };

  const isFormComplete = emotion !== null && trustDamage !== null && identifiedStance !== null;

  return (
    <div className="bg-white rounded-xl shadow-lg border-t-4 border-india-blue p-6 space-y-6 animate-fade-in-up">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-800 font-serif">Analyst Evaluation Log</h3>
        <p className="text-sm text-gray-500">Record qualitative impressions of the artifact.</p>
      </div>

      <div className="space-y-6">
        {/* Identified Stance */}
        <div className="space-y-4">
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

        <div className="grid md:grid-cols-2 gap-6">
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
               <Tooltip content="Does this content aim to erode faith in national institutions?" position="top">
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
