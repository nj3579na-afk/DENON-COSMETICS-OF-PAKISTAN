import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS } from './src/data/products.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '20mb' }));

const PORT = 3000;

// Initialize Google GenAI client
function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Check Settings > Secrets.');
}

// Default Brand Knowledge Base for Denon Cosmetics
const DEFAULT_BRAND_INFO = `
Brand Name: DENON COSMETICS
Country: Pakistan
Currency: Pakistani Rupees (PKR)
WhatsApp: +92 312 9206522 (https://wa.me/923129206522)
Phone: 0300 5633597 / 0312 9206522
Email: connectdenon@gmail.com
Office Address: Office No. FF13, Ganj Mandi Road, Bajur Tower, Rawalpindi, Pakistan
Shipping & Delivery:
- Cash on Delivery (COD) available nationwide across Pakistan (Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta, Multan, Faisalabad, etc.).
- FREE Shipping on orders above PKR 2,000. Flat PKR 199 shipping fee for orders below PKR 2,000.
- Delivery time: 2 to 4 working days via Trax, Leopards, and TCS.
- 7-day hassle-free return or exchange policy.
`;

// API Route: AI Skin Consultation
app.post('/api/skin-consultation', async (req, res) => {
  try {
    const {
      age,
      gender,
      skinType,
      skinConcerns,
      additionalNotes,
      imageBase64,
      image,
      products,
      aiKnowledge,
    } = req.body;

    const aiClient = getAiClient();
    if (!aiClient) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.',
      });
    }

    const activeProducts: any[] =
      Array.isArray(products) && products.length > 0 ? products : INITIAL_PRODUCTS;

    const inStockProducts = activeProducts.filter((p) => p?.stockStatus !== 'Out of Stock');
    const catalogForConsultation = inStockProducts.length > 0 ? inStockProducts : activeProducts;

    const validProductIds = new Set(catalogForConsultation.map((p) => String(p.id)));

    const formattedCatalog = catalogForConsultation
      .map((p: any, idx: number) => {
        const ingredients = Array.isArray(p.ingredients) ? p.ingredients.join(', ') : '';
        const benefits = Array.isArray(p.benefits) ? p.benefits.join('; ') : '';
        return [
          `[${idx + 1}] ID: "${p.id}"`,
          `Name: ${p.name}`,
          `Category: ${p.category || 'Skincare'}`,
          `Price: PKR ${p.salePrice ?? 0}${p.volumeOrWeight ? ` (${p.volumeOrWeight})` : ''}`,
          `Suitable Skin Type: ${p.suitableSkinType || 'All Skin Types'}`,
          p.description ? `Description: ${p.description}` : '',
          ingredients ? `Key Ingredients: ${ingredients}` : '',
          benefits ? `Key Benefits: ${benefits}` : '',
          p.howToUse ? `How To Use: ${p.howToUse}` : '',
        ]
          .filter(Boolean)
          .join(' | ');
      })
      .join('\n');

    const customKnowledgeText =
      Array.isArray(aiKnowledge) && aiKnowledge.length > 0
        ? aiKnowledge
            .map((item: any) => `- ${item.topic} (${item.category}): ${item.responseText}`)
            .join('\n')
        : '';

    const contents: any[] = [];
    const rawImage = imageBase64 || image;

    // Attach facial photo if provided for multimodal visual skin assessment
    if (rawImage && typeof rawImage === 'string') {
      const mimeMatch = rawImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const cleanBase64 = rawImage.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
      if (cleanBase64) {
        contents.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        });
      }
    }

    const systemInstruction = `
You are a senior Cosmetic Dermatologist and Skin Formulation Specialist for DENON COSMETICS (Pakistan).

YOUR CORE RESPONSIBILITY:
Analyze EVERY individual customer's unique profile (their uploaded facial photo if provided, age, gender, skin type, selected skin concerns, and personal notes) and create a truly personalized, doctor-like skin assessment and AM/PM routine using ONLY the real products currently listed in the LIVE WEBSITE PRODUCT CATALOG below.

STRICT RULES:
1. NEVER give a generic or repeated template reply. Each customer must receive a tailored consultation directly addressing their specific age, gender, skin type, concerns, photo observations (tone, shine/sebum, dryness, dark spots, blemishes, texture, fine lines if an image is attached), and notes.
2. Deeply synthesize each catalog product's Description, Key Ingredients, Key Benefits, Suitable Skin Type, and How To Use. In your analysis, summarize how the active ingredients in the recommended DENON products biologically help this specific customer's skin condition.
3. ONLY recommend products from the provided LIVE WEBSITE PRODUCT CATALOG. NEVER invent products or suggest any external/third-party brand.
4. Select 2 to 5 exact product IDs in "recommendedProductIds" that genuinely match this customer's full profile (cleansing, treatment/cream/serum, moisturizing/protection, or hair/body care if requested). Do NOT default to the same fixed items for every user.
5. In "routineAdvice.morning" and "routineAdvice.evening", write clear step-by-step instructions naming the exact DENON products selected and summarizing how to apply them from their "How To Use" & "Description".
6. Every ID in "recommendedProductIds" MUST match one of the exact "ID" strings in the LIVE WEBSITE PRODUCT CATALOG.
`;

    const promptText = `
CUSTOMER SKIN CONSULTATION PROFILE:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Skin Type: ${skinType || 'Not specified'}
- Primary Skin Concerns: ${Array.isArray(skinConcerns) && skinConcerns.length > 0 ? skinConcerns.join(', ') : 'General skincare & glow'}
- Customer Additional Notes: ${additionalNotes?.trim() || 'None provided'}
- Facial Photo Attached: ${rawImage ? 'Yes — analyze visible skin characteristics in the attached photo along with the profile above.' : 'No photo uploaded — evaluate thoroughly based on age, gender, skin type, concerns, and notes.'}

LIVE WEBSITE PRODUCT CATALOG (USE ONLY THESE PRODUCTS):
${formattedCatalog}
${customKnowledgeText ? `\nSTORE SKINCARE KNOWLEDGE BASE:\n${customKnowledgeText}` : ''}

Generate a tailored dermatologist-grade JSON consultation report for this customer using the exact matching product IDs from the catalog above.
`;

    contents.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Short personalized consultation title tailored to this customer age, skin type, and main concern.',
            },
            analysis: {
              type: Type.STRING,
              description: 'Detailed dermatologist-style evaluation of the customer profile (and photo if provided), explaining how the summarized descriptions, active ingredients, and benefits of the selected catalog products address their specific concerns.',
            },
            routineAdvice: {
              type: Type.OBJECT,
              properties: {
                morning: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Step-by-step AM skincare routine using the matched store products with exact application guidance.',
                },
                evening: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Step-by-step PM skincare routine using the matched store products with exact application guidance.',
                },
              },
              required: ['morning', 'evening'],
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of 2 to 5 exact product ID strings from the LIVE WEBSITE PRODUCT CATALOG tailored to this customer.',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Brief medical/cosmetic consultation disclaimer.',
            },
          },
          required: ['summary', 'analysis', 'routineAdvice', 'recommendedProductIds', 'disclaimer'],
        },
      },
    });

    const responseText = (response.text ?? '').trim();
    if (!responseText) {
      throw new Error('Empty consultation response received from Gemini.');
    }

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    const filteredIds = Array.isArray(parsedData?.recommendedProductIds)
      ? Array.from(
          new Set(
            parsedData.recommendedProductIds
              .map((id: any) => String(id).trim())
              .filter((id: string) => validProductIds.has(id))
          )
        )
      : [];

    return res.json({
      summary: parsedData.summary || `Personalized Skincare Consultation (${skinType})`,
      analysis: parsedData.analysis,
      routineAdvice: {
        morning: Array.isArray(parsedData?.routineAdvice?.morning) ? parsedData.routineAdvice.morning : [],
        evening: Array.isArray(parsedData?.routineAdvice?.evening) ? parsedData.routineAdvice.evening : [],
      },
      recommendedProductIds: filteredIds,
      disclaimer:
        parsedData.disclaimer ||
        'Note: This AI dermatology consultation is for skincare guidance only and does not replace a licensed medical diagnosis.',
    });
  } catch (error: any) {
    console.error('Skin consultation error:', error);
    const rawStatus = Number(error?.status);
    const safeStatus =
      rawStatus >= 400 && rawStatus < 600 && ![403, 502, 503, 504].includes(rawStatus) ? rawStatus : 500;
    res.status(safeStatus).json({
      error: error?.message || 'Failed to generate AI skin consultation. Please try again.',
    });
  }
});

// API Route: AI Chatbot (Powered by Gemini)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, products, aiKnowledge, brandSettings } = req.body;
    const aiClient = getAiClient();

    if (!aiClient) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.',
      });
    }

    const activeProducts = Array.isArray(products) && products.length > 0 ? products : INITIAL_PRODUCTS;
    const productCatalogText = activeProducts
      .map((p: any, idx: number) => {
        const ingredients = Array.isArray(p.ingredients) ? p.ingredients.join(', ') : '';
        const benefits = Array.isArray(p.benefits) ? p.benefits.join(', ') : '';
        return `${idx + 1}. ${p.name} (${p.category || 'Skincare'}${p.volumeOrWeight ? `, ${p.volumeOrWeight}` : ''}) - Sale Price: PKR ${p.salePrice} (Retail: PKR ${p.retailPrice}) | Stock: ${p.stockStatus || 'In Stock'} | Skin Type: ${p.suitableSkinType || 'All Skin Types'}${benefits ? ` | Benefits: ${benefits}` : ''}${ingredients ? ` | Key Ingredients: ${ingredients}` : ''}${p.howToUse ? ` | How to use: ${p.howToUse}` : ''}${p.description ? ` | Info: ${p.description}` : ''}`;
      })
      .join('\n');

    const customKnowledgeText = Array.isArray(aiKnowledge) && aiKnowledge.length > 0
      ? aiKnowledge
          .map((item: any) => `- ${item.topic} (${item.category}): ${item.responseText}`)
          .join('\n')
      : '';

    const storeDetailsText = brandSettings
      ? `
Brand Name: ${brandSettings.brandName || 'DENON COSMETICS'}
Country: Pakistan | Currency: ${brandSettings.currency || 'PKR'}
WhatsApp: ${brandSettings.whatsappNumber || '+92 312 9206522'} (${brandSettings.whatsappLink || 'https://wa.me/923129206522'})
Phone: ${brandSettings.phoneNumber || '0300 5633597'}
Email: ${brandSettings.email || 'connectdenon@gmail.com'}
Office Address: ${brandSettings.officeAddress || 'Office No. FF13, Ganj Mandi Road, Bajur Tower, Rawalpindi, Pakistan'}
Shipping & Delivery:
- Cash on Delivery (COD) available nationwide across Pakistan.
- FREE Shipping on orders above PKR ${brandSettings.freeShippingThreshold ?? 2000}. Standard shipping fee: PKR ${brandSettings.standardShippingFee ?? 199}.
- Delivery time: 2 to 4 working days.
- Payment Methods: ${brandSettings.codEnabled !== false ? 'Cash on Delivery (COD)' : 'Online Prepayment'}${brandSettings.easypaisaEnabled ? ', EasyPaisa' : ''}${brandSettings.jazzcashEnabled ? ', JazzCash' : ''}${brandSettings.bankEnabled ? ', Bank Transfer' : ''}.
- 7-day hassle-free return or exchange policy.
`
      : DEFAULT_BRAND_INFO;

    const systemInstruction = `
You are the smart, friendly, and knowledgeable AI Assistant for DENON COSMETICS (Pakistan), powered by Gemini.

YOUR GOAL:
Answer EVERY question a customer asks accurately, clearly, and helpfully! Never refuse a valid question or say you can only answer store questions. You have full general knowledge as well as complete store expertise:
1. Store & Product Questions: Use the live catalog and store details below to give exact PKR prices, ingredients, skin-type suitability, usage instructions, routines, COD/shipping info, payment options, and WhatsApp order help.
2. Skincare, Beauty & Health Questions: Give thoughtful, science-based skincare advice (e.g., acne, pigmentation, dark spots, dry/oily/sensitive skin, sun protection, routines, hair care) and naturally suggest matching DENON products where helpful.
3. Any General Customer Questions: If a customer asks about anything else (general knowledge, greetings, lifestyle, translation, writing help, advice, or casual conversation), answer it warmly, intelligently, and completely like a top-tier AI assistant.

LANGUAGE RULE:
- Always reply in the SAME language and script the customer uses!
  - If they write in English -> reply in English.
  - If they write in Urdu script (اردو) -> reply in natural Urdu script.
  - If they write in Roman Urdu (e.g., "salam bhai acne k liye kya best hai") -> reply in clear, friendly Roman Urdu.

RESPONSE STYLE:
- Be warm, polite, concise yet thorough enough to fully answer the question.
- Use clean formatting (short paragraphs or bullet points when listing multiple items).
- Present all product prices in Pakistani Rupees (PKR).
- For medical emergencies or severe skin diseases, share helpful general guidance and advise consulting a qualified dermatologist.

LIVE STORE DETAILS:
${storeDetailsText}

LIVE PRODUCT CATALOG:
${productCatalogText}
${customKnowledgeText ? `\nADDITIONAL STORE KNOWLEDGE BASE:\n${customKnowledgeText}` : ''}
`;

    // Normalize history so it starts with 'user' and alternates cleanly
    const rawHistory = Array.isArray(history) ? history : [];
    const normalizedHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    for (const item of rawHistory) {
      const text = typeof item?.text === 'string' ? item.text.trim() : '';
      if (!text) continue;
      const role: 'user' | 'model' = item.sender === 'user' ? 'user' : 'model';

      // Gemini chat history must start with a 'user' message
      if (normalizedHistory.length === 0 && role !== 'user') continue;

      // Avoid consecutive duplicate roles
      const prev = normalizedHistory[normalizedHistory.length - 1];
      if (prev && prev.role === role) {
        prev.parts[0].text += `\n${text}`;
      } else {
        normalizedHistory.push({ role, parts: [{ text }] });
      }
    }

    // Ensure history ends on 'model' before calling chat.sendMessage
    if (normalizedHistory.length > 0 && normalizedHistory[normalizedHistory.length - 1].role === 'user') {
      normalizedHistory.pop();
    }

    const chat = aiClient.chats.create({
      model: 'gemini-4-hydrogen',
      history: normalizedHistory,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: (typeof message === 'string' && message.trim()) ? message.trim() : 'Assalamu Alaikum! Tell me about Denon Cosmetics.',
    });

    const replyText = response.text?.trim();
    if (!replyText) {
      throw new Error('Empty response received from Gemini.');
    }

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Chat error:', error);
    const rawStatus = Number(error?.status);
    const safeStatus = rawStatus >= 400 && rawStatus < 600 && ![403, 502, 503, 504].includes(rawStatus) ? rawStatus : 500;
    res.status(safeStatus).json({
      error: error?.message || 'Unable to generate AI response right now. Please try again.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'DENON COSMETICS' });
});

// Vite & Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DENON COSMETICS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
