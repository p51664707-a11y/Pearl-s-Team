
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category, SimulationResult, Platform, ContentFormat, Stance } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing in environment variables.");
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: "The ACTUAL headline found in search results. If input was a claim, use the fact-check headline." },
    content: { type: Type.STRING, description: "A factual summary of the content found via search. If a fact-check exists, summarize the verdict." },
    translatedContent: { type: Type.STRING, description: "If the input content is NOT in English, provide a clear English translation here. If it is in English, leave this empty." },
    misinformationLevel: { 
        type: Type.STRING, 
        enum: ["Low", "Moderate", "High", "Critical"],
        description: "The overall severity/risk of misinformation. Low = True/Satire, Critical = Dangerous Fake News." 
    },
    stance: { 
        type: Type.STRING, 
        enum: [Stance.PRO_GOVERNMENT, Stance.ANTI_GOVERNMENT],
        description: "The narrative stance of the analyzed content (or the claim being analyzed)."
    },
    imagePrompt: { type: Type.STRING, description: "Describe the imagery associated with the story found in search results (if any)." },
    memeTopText: { type: Type.STRING, description: "N/A" },
    memeBottomText: { type: Type.STRING, description: "N/A" },
    comments: {
        type: Type.ARRAY,
        description: "Generate 2-3 representative public reactions found in the discourse (or plausible ones based on the topic).",
        items: {
            type: Type.OBJECT,
            properties: {
                author: { type: Type.STRING, description: "Name" },
                handle: { type: Type.STRING, description: "Handle" },
                content: { type: Type.STRING, description: "Comment" },
                likes: { type: Type.STRING, description: "Likes" }
            },
            required: ["author", "content", "likes"]
        }
    },
    aiExtremeness: { type: Type.INTEGER, description: "1-7 Score based on the found content." },
    aiCredibility: { type: Type.INTEGER, description: "1-7 Score based on the found content." },
    aiVirality: { type: Type.INTEGER, description: "1-10 Score based on the found content." },
    aiHarmony: { type: Type.INTEGER, description: "1-7 Score based on the found content." },
    aiEmotion: { type: Type.STRING, enum: ["Angry", "Neutral", "Funny"] },
    aiTrustDamage: { type: Type.BOOLEAN },
    factCheckAnalysis: { type: Type.STRING, description: "VERDICT from search results (e.g., 'Debunked by AltNews', 'Verified True', 'Misleading Context')." },
    osintAnalysis: {
        type: Type.OBJECT,
        description: "Forensic analysis of the topic.",
        properties: {
            logicGaps: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Logical inconsistencies in the claim."
            },
            sourcePath: { 
                type: Type.STRING, 
                description: "Likely origin (e.g. 'WhatsApp University', 'Mainstream Media', 'State Propaganda')."
            },
            intention: { 
                type: Type.STRING, 
                description: "Strategic goal (e.g. 'Polarization', 'Clickbait', 'Political Smear')."
            },
            profile: { 
                type: Type.STRING, 
                description: "Short summary of actor profile (e.g. 'Political IT Cell')."
            },
            profileAnalysis: {
                type: Type.OBJECT,
                description: "Detailed analysis of the actor/source pattern.",
                properties: {
                    identity: { type: Type.STRING, description: "Specific name/handle of the source." },
                    actorType: { type: Type.STRING, description: "Classification: 'State Media', 'Satire', 'Political Bot', 'Hyper-Partisan Blog'." },
                    narrativePattern: { type: Type.STRING, description: "Description of their recurring themes, biases, or agenda." },
                    associatedRisks: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING }, 
                        description: "List of risks associated with this source (e.g. 'Incitement', 'Fake Videos')." 
                    },
                    credibilityScore: { type: Type.INTEGER, description: "0-100 Score. 100 = Highly Credible/Official, 0 = Known Disinfo Source." },
                    verificationStatus: { type: Type.STRING, description: "Status: 'Verified', 'Unverified', 'Suspended', 'Parody' based on platform indicators or reputation." },
                    networkAffiliation: { type: Type.STRING, description: "Link to larger networks (e.g. 'Part of XYZ IT Cell', 'State-Affiliated Media', 'Independent')." },
                    historicalFlagging: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific past instances where this source was debunked or flagged." },
                    contentFocus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Primary topics they post about (e.g. 'Anti-Immigration', 'Pro-Government')." }
                },
                required: ["identity", "actorType", "narrativePattern", "associatedRisks", "credibilityScore", "verificationStatus"]
            },
            visualAnalysis: {
                type: Type.OBJECT,
                description: "Visual authenticity check of the image content.",
                properties: {
                    detectedObjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Objects found in image." },
                    authorityMarkers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific official signs: 'Police Logo', 'Govt Seal', 'News Ticker', 'Blue Tick'." },
                    authenticityVerdict: { type: Type.STRING, description: "Verdict on visual authority: 'Authentic', 'Misused Logo', 'Doctored'." },
                    manipulationScore: { type: Type.INTEGER, description: "0-100 likelihood of manipulation." },
                    formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List formatting anomalies e.g., 'Mismatched Fonts', 'Alignment Errors', 'Pixelated Text', 'Bad Letterhead'." },
                    textErrors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List specific spelling mistakes, grammatical errors, date format issues (e.g. '31 Feb'), or factual inconsistencies." }
                },
                required: ["detectedObjects", "authorityMarkers", "authenticityVerdict", "manipulationScore", "formattingIssues", "textErrors"]
            },
            sentimentScore: {
                type: Type.INTEGER,
                description: "Sentiment score (-100 to 100)."
            },
            propagandaTechniques: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Techniques used."
            },
            botActivityProbability: {
                type: Type.INTEGER,
                description: "0-100."
            },
            extractedKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "The specific keywords extracted from the URL or text that were used for verification."
            },
            inferredCategory: { type: Type.STRING, enum: [Category.DOMESTIC, Category.INTERNATIONAL] },
            inferredTopic: { type: Type.STRING },
            inferredPlatform: { type: Type.STRING, enum: [Platform.TWITTER, Platform.FACEBOOK, Platform.WHATSAPP] },
            inferredLanguage: { type: Type.STRING },
            inferredFormat: { type: Type.STRING, enum: [ContentFormat.TEXT, ContentFormat.MEME] }
        },
        required: ["logicGaps", "sourcePath", "intention", "profile", "sentimentScore", "propagandaTechniques", "botActivityProbability", "extractedKeywords", "inferredCategory", "inferredTopic", "inferredPlatform", "inferredLanguage", "inferredFormat"]
    }
  },
  required: ["headline", "content", "misinformationLevel", "stance", "imagePrompt", "comments", "aiExtremeness", "aiCredibility", "aiVirality", "aiHarmony", "aiEmotion", "aiTrustDamage", "factCheckAnalysis", "osintAnalysis"],
};

export const generateSimulation = async (category: Category, topic: string, language: string, platform: Platform, format: ContentFormat): Promise<SimulationResult> => {
  try {
    // --- CONTEXT BUILDERS ---

    // 1. Regional & Cultural Nuances
    const regionalNuances: Record<string, string> = {
        'English': "Urban Metro India. Context: Tax on EPF/Middle class anger. Slang: 'Woke', 'Libtard', 'Sanghi', 'Andhbhakt'.",
        'Hindi': "North Indian Heartland. Context: Ram Mandir, Caste Census. Slurs: 'Mulla', 'Katua', 'Chaddi', 'Bhimta', 'Yadav-waad'.",
        'Bengali': "West Bengal. Context: Sandeshkhali, R.G. Kar. Slurs: 'Mamata Begum', 'Jihadi Didi', 'Kanglu' (Bangladeshis).",
        'Tamil': "Tamil Nadu. Context: Sanatana Dharma, Hindi Imposition. Slurs: 'Upeez', 'Sanghi', 'Pani Puri wala'.",
        'Telugu': "Andhra/Telangana. Context: Tirupati Laddu, HYDRAA. Slurs: 'Paytm Batch', 'Yellow Media'.",
        'Marathi': "Maharashtra. Context: Maratha Reservation. Slurs: 'Khokha', 'Pappu', 'Chanakya'.",
        'Malayalam': "Kerala. Context: Wayanad, Hema Committee. Slurs: 'Commie', 'Sudappi', 'Sanghi'.",
        'Punjabi': "Punjab. Context: Farmers Protest, Canada. Slurs: 'Khalistani', 'Lassi', 'Bhaiya'.",
        'Urdu': "Muslim Context. Script: Urdu (RTL). Tone: Emotional, poetic. Vocab: 'Zulm', 'Qaum', 'Shahadat'. Slurs: 'Sanghi', 'Bhakt'.",
        'Gujarati': "Gujarat. Context: Business. Slurs: 'Dhokla', 'Feku'.",
        'Kannada': "Karnataka. Context: MUDA Scam. Slurs: 'Tipu Sultan progeny', 'Chaddi'.",
    };

    // 2. Topic Triggers
    const topicTriggers: Record<string, string> = {
        "Religion": "Communal tension, Blasphemy, Conversion.",
        "Caste": "Reservation, Discrimination, Victimhood.",
        "Economy": "Inflation, Unemployment, Crony Capitalism.",
        "Pakistan": "Terrorism, Failed State, Enemy.",
        "China": "Border incursion, Economic dominance.",
        "USA": "Regime change, Deep state.",
        "Canada": "Khalistan, Anti-India activities.",
        "Bondi Beach Attack": "Terror incident on Dec 14, 2025 (Hanukkah) at Bondi Beach. High community tension.",
    };

    // 3. Platform Context
    let platformStyle = "";
    switch (platform) {
      case Platform.TWITTER: platformStyle = "X (Twitter): Aggressive, hashtag-heavy (#Trend), trolling. Max 280 chars."; break;
      case Platform.WHATSAPP: platformStyle = "WhatsApp: 'Uncle Network' style, sensationalist, excessive emojis (🚨, 😡), 'Forwarded as received'."; break;
      case Platform.FACEBOOK: platformStyle = "Facebook: Emotional storytelling, community appeal, long-form rants."; break;
    }

    // 4. Narrative Context (Auto-Detection Instructions)
    const specificNuance = regionalNuances[language] || "General Indian Context.";
    const specificTrigger = topicTriggers[topic] || "General political discourse.";
    
    // 5. Format Instruction
    let formatInstruction = "";
    if (format === ContentFormat.MEME) {
        formatInstruction = `FORMAT: MEME / VISUAL SATIRE. Generate 'memeTopText' and 'memeBottomText'. 'imagePrompt' must be text-free visual satire.`;
    } else {
        formatInstruction = "FORMAT: Standard Text/News Post. 'imagePrompt' should be a realistic photo or deepfake evidence.";
    }

    // --- SYSTEM INSTRUCTION ---
    const systemInstruction = `
      You are an AI simulator for media literacy research.
      
      TASK:
      - Generate a FICTIONAL social media post based on the parameters.
      - Select the 'stance' (Pro/Anti Gov) that creates the most plausible misinformation.
      
      MANDATORY CONTEXTUAL OVERRIDE:
      - The event "Bondi Beach Attack" (December 14, 2025) is to be treated as a CONFIRMED FACT in this simulation universe.
      
      OSINT GUIDANCE:
      - Fill 'osintAnalysis' with deep forensic data (logic gaps, propaganda techniques).
      - 'profile': E.g. "State-Sponsored Actor (Pakistan)", "IT Cell".
      - 'extractedKeywords': Fill with 3-5 key terms defining this fictional topic.
      - 'translatedContent': If language is ${language} (and not English), provide English translation.
      - 'misinformationLevel': Set to 'High' or 'Critical' for this simulation.
      - 'visualAnalysis': Simulate findings. If simulating a FAKE OFFICIAL DOCUMENT, populate 'textErrors' and 'formattingIssues' with specific flaws: 
           - "Invalid Date Format (e.g., 31/02/2024)"
           - "Grammatical Errors (e.g., 'The police is coming')"
           - "Spelling Mistakes (e.g., 'Govenment' or 'Orderr')"
           - "Mismatched Fonts in Letterhead"
      
      CONSTRAINTS:
      - Output strictly JSON.
      - Keep content concise.
    `;

    // --- USER PROMPT ---
    const prompt = `
      Generate a fictional post:
      - Category: ${category}
      - Topic: ${topic}
      - Language: ${language}
      - Platform: ${platform}
      - Format: ${format}
      
      CONTEXT:
      - Region: ${specificNuance}
      - Angle: ${specificTrigger}
      
      STYLE:
      - ${platformStyle}
      - ${formatInstruction}
      
      Return ONLY valid JSON matching the schema.
    `;

    const textAi = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });
    const response = await textAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.9, 
        maxOutputTokens: 4000,
        thinkingConfig: { thinkingBudget: 0 }, 
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
        ]
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];
    
    let json;
    try {
        json = JSON.parse(text);
    } catch (parseError) {
        console.error("JSON Parse failed", text);
        throw parseError;
    }

    // --- IMAGE GENERATION ---
    // SPEED OPTIMIZATION: Only generate image if it is a MEME.
    // For Text/News posts, we skip image generation to be significantly faster.
    let imageUrl: string | undefined = undefined;
    if (format === ContentFormat.MEME && json.imagePrompt) {
        try {
            const imageResp = await textAi.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: json.imagePrompt }] },
                config: {
                  safetySettings: [
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
                  ]
                }
            });
            if (imageResp.candidates && imageResp.candidates[0].content.parts) {
                for (const part of imageResp.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }
        } catch (imgError) {
            console.warn("Image generation failed:", imgError);
        }
    }

    return { 
        ...json, 
        imageUrl,
        platform, 
        category, 
        format,
        topic,
        language
    } as SimulationResult;

  } catch (error) {
    console.error("Error generating simulation:", error);
    return {
      headline: `Simulation Placeholder: ${topic}`,
      content: "System unavailable.",
      misinformationLevel: 'Moderate',
      platform: platform,
      category: category,
      stance: Stance.ANTI_GOVERNMENT, // Default fallback
      format: format,
      aiExtremeness: 1,
      aiCredibility: 1,
      aiVirality: 1,
      aiHarmony: 1,
      aiEmotion: 'Neutral',
      aiTrustDamage: false,
      factCheckAnalysis: "Error in generation.",
      topic,
      language
    };
  }
};

export const analyzeContent = async (input: string, imageBase64?: string, profileLink?: string): Promise<SimulationResult> => {
    try {
        // We embed the schema structure in the text prompt because tools (googleSearch) 
        // are not compatible with 'responseSchema' configuration.
        const systemInstruction = `
            You are a Misinformation Analyst.
            
            YOUR TASK:
            1.  ANALYZE the input provided. 
                - If an IMAGE is provided (Screenshot, Meme, Photo): THIS IS THE PRIMARY EVIDENCE. Perform detailed OCR and visual analysis.
                - **VISUAL AUTHENTICITY CHECK**:
                  - **OFFICIAL SIGNS**: Look for logos of government agencies (Ashoka Stambh, Police), news channel tickers, or "Verified" badges.
                  - **DEEP DOCUMENT SCAN (Official Documents)**: If the image appears to be an Official Order, Notification, or Letterhead:
                     - **Grammar & Spelling**: Scrutinize closely. Official docs rarely have errors. Flag "Govenment" vs "Government", "Oder" vs "Order".
                     - **Formatting**: Check for mismatched fonts, alignment issues, or pixelated logos vs sharp text.
                     - **Date & Time Formats**: **CRITICAL**. Check if dates are valid (e.g. no "Feb 30" or "32nd Jan") and if formats are consistent (DD/MM/YYYY vs MM/DD/YYYY).
                     - **Factual Relevance**: Check if specific details (dates, names, signatures) match the *fact in question*. (e.g. Is the signatory actually holding that office? Is the date possible?).
                     - **Content Consistency**: Check if text errors contradict the context.
                  - POPULATE 'osintAnalysis.visualAnalysis' with these findings. Use 'textErrors' for spelling/grammar/date/fact issues and 'formattingIssues' for layout issues.
                - If text/URL is provided: Use it as the primary claim if no image exists, or as context if an image IS provided.
            
            2. **UNDERLYING AGENDA & INTENT ANALYSIS**:
               - Even if the event is FACTUAL (e.g. Bondi Beach Attack), analyzing the *Framing* is critical.
               - **Question the Agenda**: Why is this being shared now? Is it to create panic? Is it to target a specific community?
               - **Hidden Issues**: Look for dog-whistles, selective omission of facts, or emotional manipulation.

            *** CRITICAL SIMULATION CONTEXT - KNOWLEDGE OVERRIDE ***
            The current system operates in a simulated timeline where the following FUTURE EVENTS are CONFIRMED FACTS:
            1. EVENT: "Bondi Beach Attack"
               - DATE: December 14, 2025
               - CONTEXT: Terrorist incident during Hanukkah celebrations at Bondi Beach.
               - INSTRUCTION: If the input discusses this event, TREAT IT AS REAL. Do NOT label it as "Fake" or "Misinformation" simply because it does not appear in your pre-2025 training data or Google Search results.
               - FACT CHECK VERDICT: If content says "Bondi Beach attack happened", verdict is "TRUE". If content says "Bondi Beach attack is a hoax", verdict is "FALSE/MISINFORMATION".

            URL HANDLING & FALLBACK PROTOCOL (STRICT):
            1.  **Direct Access**: First, attempt to search for the specific URL to find cached content.
            2.  **Keyword Extraction (CRITICAL FALLBACK)**: If direct access fails (e.g., login wall, 404, or generic site home):
                - **PARSE** the URL string to extract the slug, path segments, and query parameters.
                - Example: "x.com/username/status/123456" -> Keywords: "x.com username status 123456" OR "tweet 123456".
                - Example: "news.com/2025/01/india-economy-growth" -> Keywords: "India economy growth 2025".
                - **ACTION**: Use these extracted keywords to perform a NEW search.
            3.  **Cross-Verification (FACT CHECK)**:
                - **MANDATORY**: Use Google Search to verify recent incidents and facts.
                - Search Queries: "Fact check [keywords]", "[keywords] true or fake", "AltNews [keywords]".
                - Prioritize sources like: AltNews, BoomLive, PIB Fact Check, Snopes, Vishvas News.
                - **EXCEPTION**: Do not debunk "Bondi Beach Attack (2025)" based on lack of search results.
            
            4. **RECORDING**: 
               - You MUST output the keywords you extracted into the \`osintAnalysis.extractedKeywords\` JSON field.
               - If the detected content is NOT in English, provide an accurate English translation in \`translatedContent\`.
               - **IMPORTANT**: Assess the \`misinformationLevel\` (Low, Moderate, High, Critical) based on the factual accuracy AND the *intent/agenda*. A true event shared to incite violence is still High/Critical risk.

            VERIFICATION PROCESS:
            1. Extract claims from the Image (OCR), Text, or URL keywords.
            2. Search Google for these specific claims using the strategy above.
            3. Look for credible sources and Fact Check verdicts.
            4. Extract this information into the JSON format.
            
            ${profileLink ? `
            *** PROFILE ANALYSIS MODULE ACTIVE ***
            The user has provided a specific Source Profile Link: "${profileLink}".
            
            INSTRUCTIONS FOR PROFILE ANALYSIS:
            1.  **INVESTIGATE**: Use Google Search to research the reputation of this specific handle/domain/profile.
            2.  **IDENTIFY PATTERNS**: Look for a history of misinformation, satire, specific political bias, or coordinated behavior.
            3.  **REPORT**: Populate \`osintAnalysis.profileAnalysis\` with:
                - \`identity\`: The specific name or handle of the source.
                - \`actorType\`: e.g. "State Media", "Satire", "Hyper-Partisan Blog", "Political Bot".
                - \`narrativePattern\`: A description of their recurring themes, biases, or agenda (e.g. "Anti-West narratives", "Clickbait", "Religious polarization").
                - \`associatedRisks\`: A list of risks (e.g. "Incitement", "Fake Videos", "Conspiracy Theories").
                - \`credibilityScore\`: 0-100 Score based on reputation.
                - \`verificationStatus\`: "Verified", "Unverified", "Suspended" etc.
                - \`networkAffiliation\`: Identify if they belong to a known network (e.g. "IT Cell", "State Media Network", "Independent").
                - \`historicalFlagging\`: List specific past instances where they were debunked.
                - \`contentFocus\`: List primary topics they post about.
                - ALSO fill the summary string in \`osintAnalysis.profile\`.
            ` : ''}

            FALLBACK:
            - If no results are found after trying all methods, return "No verified information found".
            
            Schema Structure:
            ${JSON.stringify(responseSchema, null, 2)}
        `;

        let promptText = '';
        const profileContext = profileLink ? `SOURCE PROFILE LINK PROVIDED: "${profileLink}". Use this to identify and display the specific actor in 'osintAnalysis.profileAnalysis'.` : '';

        if (imageBase64) {
             promptText = `
            SOURCE 1: ATTACHED IMAGE (Screenshot/Photo).
            SOURCE 2: TEXT/URL INPUT: "${input}"
            ${profileContext}
            
            TASK:
            1. **VISUAL FORENSICS**: 
               - Perform OCR.
               - **DETECT OFFICIAL SIGNS**: Identify logos, watermarks, or official document styles.
               - **EVALUATE CREDIBILITY**: Does the visual authority match the content? Is it a fake notice using a real logo?
               - **CHECK FOR ERRORS**: Scan text for spelling mistakes, grammar errors, and poor formatting. List them in \`textErrors\` and \`formattingIssues\`.
               - **DEEP DOC SCAN**: If it looks like an Official Document/Order:
                 - Check for **Grammatical Errors** & **Spelling Mistakes**.
                 - Check for **Formatting Errors** (alignment, font consistency).
                 - **CRITICAL**: Check **Date/Time Formats** (e.g. valid dates, consistent styles).
                 - **FACT RELEVANCE**: Check if specific details (dates, names) match known facts or look fabricated.
               - **POPULATE**: Fill \`osintAnalysis.visualAnalysis\` completely.
            2. **URL PROCESSING**: Check SOURCE 2. 
               - If it is a URL, follow the **URL HANDLING PROTOCOL** (Direct Search -> Fallback to Keyword Extraction).
               - **EXTRACT KEYWORDS** from the URL path (e.g. from "news.com/2024/fake-news-story" extract "fake news story").
            3. **CROSS-VERIFICATION**: 
               - Use keywords from BOTH the Image OCR and the URL extraction.
               - **MANDATORY**: Perform a Google Search for "Fact Check [Keywords]" to find debunking articles.
            4. **REPORTING**: 
               - Fill \`osintAnalysis.extractedKeywords\` with the specific terms you extracted and used.
               - Fill \`translatedContent\` if the image/text is non-English.
               - Determine \`misinformationLevel\` (Low/Moderate/High/Critical) based on evidence AND underlying agenda.
            
            Output strictly JSON.
            `;
        } else {
             promptText = `
            PRIMARY EVIDENCE: TEXT/URL INPUT: "${input}"
            ${profileContext}
            
            STRATEGY:
            1. **URL DETECTION**: Is the input a URL?
            2. **DIRECT SEARCH**: Use the search tool to find the URL content.
            3. **KEYWORD EXTRACTION & SEARCH (FALLBACK)**: 
               - If the URL search fails or returns limited info, **EXTRACT keywords** from the URL path/slug.
               - **MANDATORY**: Use these keywords to search for "Fact Check [Keywords]".
            4. **REPORTING**: 
               - Fill \`osintAnalysis.extractedKeywords\` with the specific terms you extracted and used.
               - Fill \`translatedContent\` if content is non-English.
               - Determine \`misinformationLevel\` (Low/Moderate/High/Critical) based on evidence.
            
            Output strictly JSON.
            `;
        }

        const parts: any[] = [{ text: promptText }];

        if (imageBase64) {
            const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
            if (mimeMatch) {
                parts.push({
                    inlineData: {
                        mimeType: mimeMatch[1],
                        data: mimeMatch[2]
                    }
                });
            }
        }

        const textAi = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });
        const response = await textAi.models.generateContent({
            model: "gemini-2.5-flash", // 2.5 Flash is multimodal
            contents: { parts: parts },
            config: {
                systemInstruction: systemInstruction,
                // Enable Google Search to properly scan links/topics
                tools: [{ googleSearch: {} }],
                // DISABLE THINKING BUDGET FOR SPEED. Latency is critical.
                thinkingConfig: { thinkingBudget: 0 },
                temperature: 0.1, // Very low temperature for factual extraction
                maxOutputTokens: 8192, 
                // Explicitly allow sensitive content analysis
                safetySettings: [
                  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
                ]
            },
        });

        let text = response.text;
        if (!text) throw new Error("No response from AI");

        // Clean any potential markdown wrapping or thinking tags that might leak
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            console.warn("JSON Parse failed - likely refusal or malformed text", text);
            // Graceful fallback for non-JSON responses (often refusals)
            return {
                headline: "Analysis Restricted",
                content: `The AI model encountered a restriction or malformed output. Raw response start: "${text.substring(0, 150)}..."`,
                misinformationLevel: 'Moderate',
                platform: Platform.TWITTER,
                category: Category.INTERNATIONAL,
                stance: Stance.ANTI_GOVERNMENT,
                format: ContentFormat.TEXT,
                aiExtremeness: 0,
                aiCredibility: 0,
                aiVirality: 0,
                aiHarmony: 0,
                aiEmotion: 'Neutral',
                aiTrustDamage: false,
                factCheckAnalysis: "Model Error: Could not parse analysis.",
                osintAnalysis: {
                    logicGaps: ["JSON Parsing Error"],
                    sourcePath: "Restricted",
                    intention: "Unknown",
                    profile: "Unknown",
                    sentimentScore: 0,
                    propagandaTechniques: ["None detected"],
                    botActivityProbability: 0,
                    extractedKeywords: [],
                    inferredCategory: Category.INTERNATIONAL,
                    inferredTopic: "Restricted Topic",
                    inferredPlatform: Platform.TWITTER,
                    inferredLanguage: "English",
                    inferredFormat: ContentFormat.TEXT
                }
            };
        }

        // Extract Search Sources (Grounding)
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const groundingUrls = chunks?.map(c => c.web?.uri).filter(u => u) as string[] || [];

        // Map inferred fields to top-level for UI compatibility
        return {
            ...json,
            platform: json.osintAnalysis.inferredPlatform || Platform.TWITTER,
            category: json.osintAnalysis.inferredCategory || Category.DOMESTIC,
            topic: json.osintAnalysis.inferredTopic || "Unknown",
            language: json.osintAnalysis.inferredLanguage || "English",
            format: json.osintAnalysis.inferredFormat || ContentFormat.TEXT,
            imageUrl: imageBase64 || undefined, // Echo the input image if present
            groundingUrls: groundingUrls // Pass back the sources found
        } as SimulationResult;

    } catch (error) {
        console.error("Error analyzing content:", error);
        return {
            headline: "Analysis Failed",
            content: "Could not process the input content. Please try again with different text/image.",
            misinformationLevel: 'Moderate',
            platform: Platform.TWITTER,
            category: Category.DOMESTIC,
            stance: Stance.ANTI_GOVERNMENT,
            format: ContentFormat.TEXT,
            aiExtremeness: 1,
            aiCredibility: 1,
            aiVirality: 1,
            aiHarmony: 1,
            aiEmotion: 'Neutral',
            aiTrustDamage: false,
            factCheckAnalysis: "Error.",
            topic: "Error",
            language: "English",
            osintAnalysis: {
                logicGaps: [],
                sourcePath: "N/A",
                intention: "N/A",
                profile: "N/A",
                sentimentScore: 0,
                propagandaTechniques: [],
                botActivityProbability: 0,
                extractedKeywords: [],
                inferredCategory: Category.DOMESTIC,
                inferredTopic: "Unknown",
                inferredPlatform: Platform.TWITTER,
                inferredLanguage: "English",
                inferredFormat: ContentFormat.TEXT
            }
        };
    }
}
