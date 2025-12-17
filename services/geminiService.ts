
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category, SimulationResult, Platform, ContentFormat, Stance } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema definitions for structured JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING },
    content: { type: Type.STRING },
    translatedContent: { type: Type.STRING },
    misinformationLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Critical'] },
    category: { type: Type.STRING, enum: [Category.DOMESTIC, Category.INTERNATIONAL] },
    stance: { type: Type.STRING },
    format: { type: Type.STRING },
    platform: { type: Type.STRING },
    topic: { type: Type.STRING },
    language: { type: Type.STRING },
    memeTopText: { type: Type.STRING },
    memeBottomText: { type: Type.STRING },
    imagePrompt: { type: Type.STRING, description: "A detailed prompt to generate an image accompanying this news." },
    aiExtremeness: { type: Type.NUMBER, description: "1 to 7" },
    aiCredibility: { type: Type.NUMBER, description: "1 to 7" },
    aiVirality: { type: Type.NUMBER, description: "1 to 10" },
    aiHarmony: { type: Type.NUMBER, description: "1 to 7" },
    aiEmotion: { type: Type.STRING, enum: ['Angry', 'Neutral', 'Funny'] },
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
        profile: { type: Type.STRING },
        sentimentScore: { type: Type.NUMBER },
        propagandaTechniques: { type: Type.ARRAY, items: { type: Type.STRING } },
        botActivityProbability: { type: Type.NUMBER },
        extractedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        visualAnalysis: {
           type: Type.OBJECT,
           properties: {
              isOfficialDocument: { type: Type.BOOLEAN },
              authenticityVerdict: { type: Type.STRING },
              manipulationScore: { type: Type.NUMBER },
              authorityMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
              formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              textErrors: { type: Type.ARRAY, items: { type: Type.STRING } },
           }
        },
        profileAnalysis: {
            type: Type.OBJECT,
            properties: {
                identity: { type: Type.STRING },
                actorType: { type: Type.STRING },
                narrativePattern: { type: Type.STRING },
                associatedRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                credibilityScore: { type: Type.NUMBER },
                verificationStatus: { type: Type.STRING },
                networkAffiliation: { type: Type.STRING },
                historicalFlagging: { type: Type.ARRAY, items: { type: Type.STRING } },
                contentFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
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
  
  const systemPrompt = `
    You are a Red Teaming Simulator for the Indian Information Ecosystem. 
    Generate a realistic piece of content that might spread misinformation based on the parameters.
    Context: ${category}, Topic: ${topic}, Language: ${language}, Platform: ${platform}, Format: ${format}.
    
    If Format is MEME, generate short, punchy text (memeTopText/memeBottomText) and a visual description (imagePrompt).
    If Format is TEXT, generate a news headline and body content.
    
    Also provide an "AI Ground Truth" analysis of the content you just generated.
    The content should be realistic to the Indian context (names, locations, cultural nuances).
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate the simulation JSON.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.8,
      }
    });

    const data = JSON.parse(result.text || '{}') as SimulationResult;

    let imageUrl = '';
    if (format === ContentFormat.MEME || (platform !== Platform.WHATSAPP && format === ContentFormat.TEXT)) {
      try {
        const imagePrompt = data.imagePrompt || `A realistic photo related to ${topic} in India, news style`;
        const imgResult = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: imagePrompt }]
            }
        });
        
        for (const part of imgResult.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
      }
    }

    return {
      ...data,
      imageUrl: imageUrl || undefined,
      platform,
      format
    };
  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
};

export const analyzeContent = async (
    input: string, 
    imageBase64?: string, 
    profileLink?: string
): Promise<SimulationResult> => {
    
    const parts: any[] = [];
    if (imageBase64) {
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        parts.push({
            inlineData: {
                mimeType: 'image/png',
                data: base64Data
            }
        });
    }

    parts.push({
        text: `Analyze this content for misinformation in the Indian context. 
        Input text/url: "${input}". 
        Profile Link context: "${profileLink || 'None'}".
        
        Perform a deep OSINT analysis. Use Google Search to find real-time context and verify claims.
        If an image is provided, analyze it for manipulation, official markers, and consistency.
        Extract logic gaps, propaganda techniques, and bot probability.
        Generate a structured analysis report.`
    });

    try {
        const result = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts },
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                temperature: 0.1
            }
        });

        const data = JSON.parse(result.text || '{}') as SimulationResult;
        const groundingUrls = result.candidates?.[0]?.groundingMetadata?.searchEntryPoint?.renderedContent
            ? [result.candidates[0].groundingMetadata.searchEntryPoint.renderedContent]
            : result.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web?.uri).filter(Boolean) as string[];

        return {
            ...data,
            imageUrl: imageBase64,
            groundingUrls: groundingUrls || [],
            platform: data.platform || Platform.TWITTER
        };
    } catch (error) {
        console.error("Analysis failed:", error);
        throw error;
    }
};
