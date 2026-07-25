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
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not set. AI features will fallback to smart template response.');
}

// System Knowledge Base for Denon Cosmetics
const DENON_KNOWLEDGE_BASE = `
Brand Name: DENON COSMETICS
Country: Pakistan
Currency: Pakistani Rupees (PKR)
WhatsApp: +92 312 9206522 (Link: https://wa.me/923129206522)
Phone: 0300 5633597
Email: connectdenon@gmail.com
Office Address: Office No. FF13, Ganj Mandi Road, Bajur Tower, Rawalpindi, Pakistan

Product Lineup:
1. DENON Brightening Rice Facial Face Wash (100ml) - PKR 499 (Retail PKR 650) - Rice Water & Niacinamide for dark spots & pigmentation.
2. DENON Vitamin C Glow Reviving Face Wash (100ml) - PKR 499 (Retail PKR 650) - Mandarin & Vitamin B5, E for dullness exfoliation.
3. DENON Activated Charcoal Deep Detox Face Wash (100ml) - PKR 499 (Retail PKR 650) - Detoxifies pores & oily skin.
4. DENON Brightening + Moisturizes Lotion With Rice (250ml) - PKR 899 (Retail PKR 1200) - Face & Body lotion with rice extract.
5. DENON Brightening Moisturizer Lotion With Aloe Vera (250ml) - PKR 899 (Retail PKR 1200) - Rapid soothing for skin redness & barrier repair.
6. DENON Anti Acne Cream (30g) - PKR 550 (Retail PKR 750) - Tea Tree & Salicylic Acid for active pimples & acne scars.
7. DENON Hair Removing Spray Moult Removal 4D (150ml) - PKR 850 (Retail PKR 1100) - 5-minute painless body hair removal.
8. DENON Export Quality Beauty Soap (100g) - PKR 250 (Retail PKR 350) - Popping Pearl extract 5 Days action.
9. DENON Export Quality Beauty Serum (45g) - PKR 950 (Retail PKR 1250) - 5 Days test result pearl glass skin serum.
10. DENON Rice Beauty Cream (50g) - PKR 650 (Retail PKR 850) - Rice water & niacinamide anti-freckle night cream.
11. DENON Hair Removing Spray Pink Rose (150ml) - PKR 850 (Retail PKR 1100) - Painless rose scented hair removal.
12. DENON Hair Removing Spray Lemon Citrus (150ml) - PKR 850 (Retail PKR 1100) - Fresh lemon hair removal spray.
13. Sansal Red Anaar Whitening Bleach Cream + Serum - PKR 180 (Retail PKR 250) - Instant Anaar glow bleach.
14. Sansal Glitter Glow Up Cream Bleach - PKR 180 (Retail PKR 250) - Emerald diamond glitter event bleach.
15. DENON Pearl Beauty Cream (50g) - PKR 650 (Retail PKR 850) - Classic 5-day action pearl cream.

Shipping & Delivery:
- Cash on Delivery (COD) available nationwide in Pakistan (Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta, Multan, Faisalabad, etc.).
- FREE Shipping on orders above PKR 2,000. Flat PKR 199 shipping fee for orders below PKR 2,000.
- Delivery time: 2 to 4 working days.
- 7-day hassle-free return or exchange policy.
`;

// API Route: AI Skin Consultation
app.post('/api/skin-consultation', async (req, res) => {
  try {
    const { age, gender, skinType, skinConcerns, additionalNotes, imageBase64 } = req.body;

    if (!aiClient) {
      // Fallback structured advice
      const recommended = INITIAL_PRODUCTS.filter((p) => {
        if (skinConcerns.includes('Acne') && p.id.includes('acne')) return true;
        if (skinConcerns.includes('Dark Spots') && (p.id.includes('rice') || p.id.includes('pearl'))) return true;
        if (skinConcerns.includes('Dullness') && p.id.includes('vitaminc')) return true;
        return false;
      });

      return res.json({
        summary: `Personalized Skincare Profile for ${age} Year Old (${skinType} Skin)`,
        analysis: `Based on your selection of concerns (${skinConcerns.join(', ')}), your skin requires targeted active botanicals like Niacinamide, Rice Water, and Salicylic Acid to balance sebum and restore natural radiance.`,
        routineAdvice: {
          morning: [
            'Cleanse with Denon Face Wash suited for your concern',
            'Apply Denon Beauty Serum onto damp skin',
            'Moisturize with Denon Face & Body Lotion'
          ],
          evening: [
            'Cleanse face thoroughly to remove daytime pollutants',
            'Apply Denon Rice Beauty Cream or Pearl Cream',
            'Leave overnight for deep cellular skin renewal'
          ]
        },
        recommendedProductIds: recommended.length > 0 ? recommended.map(r => r.id) : ['denon-rice-facewash', 'denon-beauty-serum', 'denon-rice-beauty-cream'],
        disclaimer: 'Note: This AI skin assessment is for informational and skincare selection purposes only. It does not replace medical advice from a certified dermatologist.'
      });
    }

    const contents: any[] = [];

    // Attach image if provided
    if (imageBase64) {
      // Clean base64 prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
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
      model: 'gemini-3.6-flash',
      contents,
    });

    const responseText = response.text || '';
    // Clean potential json formatting wrapper
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
    res.status(500).json({ error: 'Failed to process skin consultation' });
  }
});

// API Route: AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!aiClient) {
      return res.json({
        reply: `Welcome to DENON COSMETICS! I can help you with product recommendations, ingredient details, and Cash on Delivery orders across Pakistan. You can also contact us directly on WhatsApp at +92 312 9206522 or visit us at Bajur Tower, Rawalpindi!`
      });
    }

    const systemInstruction = `
You are the Official AI Skincare & Customer Service Assistant for DENON COSMETICS (Pakistan).
Use only this knowledge base to answer questions concisely, politely, and luxuriously:
${DENON_KNOWLEDGE_BASE}

Key Guidelines:
1. Always present prices in Pakistani Rupees (PKR).
2. Highlight Cash on Delivery (COD) across Pakistan and FREE Shipping over PKR 2,000.
3. Recommend specific Denon products for skin issues (e.g. Rice face wash for dark spots, Anti-Acne cream for pimples, Hair Removal spray for smooth skin).
4. Keep answers helpful, accurate, friendly, and brief (2-4 sentences max unless detailed list is requested).
5. Always offer direct WhatsApp support link (https://wa.me/923129206522 or +92 312 9206522) for instant order placement.
6. Never make unsupported medical claims or diagnose diseases.
`;

    const chatHistory = Array.isArray(history) ? history.map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    })) : [];

    const chat = aiClient.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({
      message: message || 'Hello, tell me about Denon Cosmetics',
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ reply: 'Thank you for reaching out to Denon Cosmetics! Please message our team on WhatsApp at +92 312 9206522 for instant assistance.' });
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
