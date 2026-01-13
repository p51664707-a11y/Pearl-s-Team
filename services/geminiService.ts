
import { GoogleGenAI, Type } from "@google/genai";
import { Category, SimulationResult, Platform, ContentFormat } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    content: { type: Type.STRING },
    translatedContent: { type: Type.STRING },
    misinformationLevel: { type: Type.STRING, description: "One of: Low, Moderate, High, Critical" },
    category: { type: Type.STRING },
    stance: { type: Type.STRING },
    format: { type: Type.STRING },
    platform: { type: Type.STRING },
    topic: { type: Type.STRING },
    language: { type: Type.STRING },
    memeTopText: { type: Type.STRING },
    memeBottomText: { type: Type.STRING },
    imagePrompt: { type: Type.STRING },
    aiEmotion: { type: Type.STRING },
    aiTrustDamage: { type: Type.BOOLEAN },
    factCheckAnalysis: { type: Type.STRING },
    comments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          author: { type: Type.STRING },
          content: { type: Type.STRING },
          likes: { type: Type.STRING }
        }
      }
    },
    osintAnalysis: {
      type: Type.OBJECT,
      properties: {
        logicGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        sourcePath: { type: Type.STRING },
        intention: { type: Type.STRING },
        forensicReasoning: { type: Type.STRING },
        tacticalMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
        profile: { type: Type.STRING },
        propagandaTechniques: { type: Type.ARRAY, items: { type: Type.STRING } },
        propagandaTactics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              severity: { type: Type.STRING }
            }
          }
        },
        extractedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        narrativeCluster: {
          type: Type.OBJECT,
          properties: {
            clusterName: { type: Type.STRING },
            isCoordinated: { type: Type.BOOLEAN },
            associatedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            primaryGeographicOrigin: { type: Type.STRING }
          }
        },
        temporalContext: {
          type: Type.OBJECT,
          properties: {
            isSensitiveWindow: { type: Type.BOOLEAN },
            windowReason: { type: Type.STRING }
          }
        },
        visualAnalysis: {
           type: Type.OBJECT,
           properties: {
              isOfficialDocument: { type: Type.BOOLEAN },
              authenticityVerdict: { type: Type.STRING },
              authorityMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
              formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              textErrors: { type: Type.ARRAY, items: { type: Type.STRING } },
              dominantColors: { type: Type.ARRAY, items: { type: Type.STRING } },
              textOverlayAnalysis: {
                type: Type.OBJECT,
                properties: {
                  fontStyle: { type: Type.STRING },
                  size: { type: Type.STRING },
                  color: { type: Type.STRING }
                }
              },
              deepfakeDiagnostic: {
                type: Type.OBJECT,
                properties: {
                  isDeepfakeSuspected: { type: Type.BOOLEAN },
                  confidenceScore: { type: Type.STRING },
                  vocalAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  visualAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  referenceComparison: { type: Type.STRING },
                  technicalReasoning: { type: Type.STRING }
                }
              }
           }
        },
        profileAnalysis: {
            type: Type.OBJECT,
            properties: {
                identity: { type: Type.STRING },
                actorType: { type: Type.STRING },
                narrativePattern: { type: Type.STRING },
                associatedRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                verificationStatus: { type: Type.STRING },
                inferredAllegiance: { type: Type.STRING },
                digitalFootprint: {
                  type: Type.OBJECT,
                  properties: {
                    accountAge: { type: Type.STRING },
                    postingFrequency: { type: Type.STRING },
                    engagementAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                role: { type: Type.STRING },
                agendaAlignment: { type: Type.STRING }
            }
        }
      }
    }
  }
};

export const generateSimulation = async (
  category: Category, 
  topic: string, 
  language: string, 
  platform: Platform, 
  format: ContentFormat
): Promise<SimulationResult> => {
  const systemPrompt = `You are a World-Class Red Teaming Specialist for the Indian Information Ecosystem. 
  Generate a realistic misinformation scenario fast. Context: ${category}, Topic: ${topic}, Language: ${language}, Platform: ${platform}, Format: ${format}.
  
  CRITICAL: Be concise. Focus on strategic cultural hooks. No numeric scores.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate tactical JSON.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: analysisSchema as any,
        temperature: 0.5,
      }
    });

    const data = JSON.parse(response.text || '{}') as SimulationResult;
    let imageUrl = '';
    if (format === ContentFormat.MEME || (platform !== Platform.WHATSAPP && format === ContentFormat.TEXT)) {
      try {
        const imgResult = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: data.imagePrompt || topic }] }
        });
        for (const part of imgResult.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; break; }
        }
      } catch (e) {}
    }
    return { ...data, imageUrl: imageUrl || undefined, platform, format };
  } catch (error) { throw error; }
};

export const analyzeContent = async (
    input: string, 
    imageBase64?: string, 
    profileLink?: string,
    mediaBase64?: string,
    mediaMimeType?: string
): Promise<SimulationResult> => {
    const parts: any[] = [];
    if (imageBase64) {
        parts.push({ 
          inlineData: { 
            mimeType: 'image/png', 
            data: imageBase64.split(',')[1] || imageBase64 
          } 
        });
    }

    if (mediaBase64 && mediaMimeType) {
        parts.push({
            inlineData: {
                mimeType: mediaMimeType,
                data: mediaBase64.split(',')[1] || mediaBase64
            }
        });
    }
    
    const contextStr = `
        DEEP FORENSIC TASK: 
        1. Mandatory OCR/Analysis: Extract all text or visual markers (symbols, logos, flora like Chinar leaves).
        2. REGIONAL SYMBOLIC FORENSICS: 
           - Look for symbols like the Chinar leaf (Platanus orientalis) used to represent 'Azad Kashmir' (PoK) in hostile narratives.
        3. DEEPFAKE DIAGNOSTIC PROTOCOL: 
           - Cross-reference audio/video inputs with archival recordings of public figures to detect biometric anomalies.
        4. Google Search Verification: Search for exact phrases, names, and event dates to ground the analysis in reality.
    `;
    
    parts.push({ text: contextStr + `\n\nInput Text: ${input || 'No text provided'}` });

    const systemInstruction = `
        You are the BHARAT STRATEGIC INTELLIGENCE ANALYST.
        DIRECTIVE: ABSOLUTE GROUNDING & MULTIMODAL FORENSICS.
        
        STRICT VERIFICATION PROTOCOL:
        - Use googleSearch for every profile, link, and regional symbol provided.
        - Identify anti-India sentiment or territorial distortions.
        - Prioritize identifying synthetic media and coordinated inauthentic behavior.
        
        Thinking: You have a 25,000 token budget. Use 12000 for high-fidelity forensics.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: { parts },
            config: {
                systemInstruction,
                thinkingConfig: { thinkingBudget: 12000 }, 
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: analysisSchema as any,
                temperature: 0.1
            }
        });

        if (!response.text) throw new Error("Null response");

        const data = JSON.parse(response.text) as SimulationResult;
        const groundingUrls: string[] = [];
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            for (const chunk of response.candidates[0].groundingMetadata.groundingChunks) {
                if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
            }
        }

        return {
            ...data,
            imageUrl: imageBase64,
            mediaBase64,
            mediaMimeType,
            groundingUrls,
            platform: data.platform || Platform.TWITTER
        };
    } catch (error: any) {
        return {
            headline: "Analysis Fault",
            content: "Internal node timeout during deep forensic scan.",
            misinformationLevel: 'Moderate',
            category: Category.DOMESTIC,
            stance: "Anti-Government (Critical / Dissent)" as any,
            format: ContentFormat.TEXT,
            platform: Platform.TWITTER,
            aiEmotion: 'Neutral',
            aiTrustDamage: false,
            factCheckAnalysis: "Verification error during forensic detection scan. System was unable to securely ground the provided artifact.",
            osintAnalysis: { forensicReasoning: "Scan failed.", logicGaps: ["Timeout"], sourcePath: "ERR", intention: "ERR", tacticalMarkers: [], profile: "N/A", propagandaTechniques: [] }
        } as SimulationResult;
    }
};
