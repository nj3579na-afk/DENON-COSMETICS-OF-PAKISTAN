import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
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
    const { age, gender, skinType, skinConcerns, additionalNotes, imageBase64, image } = req.body;
    const aiClient = getAiClient();

    if (!aiClient) {
      return res.status(503).json({ error: 'Gemini API key is not configured in Settings > Secrets.' });
    }

    const contents: any[] = [];
    const rawImage = imageBase64 || image;

    // Attach image if provided
    if (rawImage && typeof rawImage === 'string') {
      const mimeMatch = rawImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const cleanBase64 = rawImage.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const promptText = `
You are Denon Cosmetics AI Dermatology Consultation Expert in Pakistan.
Analyze the user's skin profile:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Self-Reported Skin Type: ${skinType}
- Skin Concerns: ${Array.isArray(skinConcerns) ? skinConcerns.join(', ') : skinConcerns}
- Additional Notes: ${additionalNotes || 'None'}

Target Denon Products available in catalog:
${JSON.stringify(INITIAL_PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, benefits: p.benefits })))}

Instructions:
1. Provide a warm, professional, encouraging skin evaluation.
2. Recommend a Morning and Evening skincare routine.
3. Select 2 to 4 exact Denon product IDs from the provided list that directly address these concerns.
4. Format the response as a JSON object matching this key structure:
{
  "summary": "Short title summary",
  "analysis": "Detailed breakdown of skin condition and how ingredients help",
  "routineAdvice": {
    "morning": ["step 1", "step 2", "step 3"],
    "evening": ["step 1", "step 2", "step 3"]
  },
  "recommendedProductIds": ["id1", "id2"],
  "disclaimer": "Note: This AI consultation is for informational guidance only and does not substitute professional medical advice."
}
Do not include any Markdown backticks around the JSON.
`;

    contents.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      parsedData = {
        summary: `Custom Skin Evaluation for ${skinType} Skin`,
        analysis: responseText,
        routineAdvice: {
          morning: ['Cleanse thoroughly', 'Apply Denon Serum', 'Protect skin with lotion'],
          evening: ['Cleanse', 'Apply Denon Rice Cream overnight']
        },
        recommendedProductIds: ['denon-rice-facewash', 'denon-beauty-serum', 'denon-rice-beauty-cream'],
        disclaimer: 'Informational skincare consultation only. Consult a doctor for medical skin disorders.'
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Skin consultation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to process skin consultation' });
  }
});

// API Route: AI Chatbot (Powered by Gemini)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, products, aiKnowledge, brandSettings } = req.body;
    const aiClient = getAiClient();

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please check Settings > Secrets.',
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
    const status = error?.status || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({
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
