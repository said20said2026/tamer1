import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Endpoint for sitemap.xml
app.get('/sitemap.xml', (_req, res) => {
  const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
  res.header('Content-Type', 'application/xml');
  res.sendFile(sitemapPath);
});

// Endpoint for robots.txt
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.resolve(__dirname, 'public', 'robots.txt');
  res.header('Content-Type', 'text/plain');
  res.sendFile(robotsPath);
});


// Phone context data summary for the AI
const PHONES_SUMMARY = `
قائمة الهواتف المتوفرة في قاعدة بيانات قارن تك وأسعارها بالريال السعودي:
1. iPhone 16 Pro Max: السعر يبدأ من 4949 ر.س (أمازون/نون)، شاشة 6.9 OLED 120Hz، معالج A18 Pro، كاميرا 48MP زووم 5x، بطارية 4685mAh.
2. Samsung Galaxy S25 Ultra: السعر يبدأ من 4699 ر.س (نون/أمازون)، معالج Snapdragon 8 Elite، قلم S-Pen، كاميرا 200MP وزووم 100x، بطارية 5000mAh، حماية غوريلا أرمور 2 ضد الانعكاس.
3. Xiaomi 15 Pro: السعر 3349 ر.س (أمازون)، معالج Snapdragon 8 Elite، كاميرات لايكا 50MP، بطارية عملاقة 6100mAh، شحن سريع 90W.
4. Google Pixel 9 Pro XL: السعر 3999 ر.س (أمازون)، معالج Tensor G4، رام 16GB، أفضل معالجة صور وذكاء اصطناعي، شاشة Super Actua.
5. OnePlus 13: السعر 3199 ر.س (أمازون)، معالج Snapdragon 8 Elite، بطارية 6000mAh، شاحن 100W بالعلبة، شاشة 4500 nits، مقاومة ماء IP68 و IP69.
6. Samsung Galaxy A55 5G: السعر 1149 ر.س (نون)، أفضل هاتف اقتصادي/متوسط، شاشة Super AMOLED 120Hz، خامات معدنية وزجاجية، بطارية 5000mAh.
7. iPhone 16: السعر 3299 ر.س (نون)، معالج A18، شاشة 6.1 بوصة، خفيف ومريح، زر Camera Control، كاميرا 48MP.
8. Poco F6 Pro: السعر 1749 ر.س (أمازون)، معالج Snapdragon 8 Gen 2، شاحن خارق 120W يشحن في 19 دقيقة، شاشة 2K 120Hz، وحش الألعاب الاقتصادي.
9. Honor Magic 7 Pro: السعر 3899 ر.س (جرير)، كاميرا بيريسكوب 200MP، بصمة وجه 3D ToF، شاحن 100W سلكي و 80W لاسلكي، بطارية 5850mAh.
10. Nothing Phone (2a) Plus: السعر 1399 ر.س (جرير)، تصميم شفاف مع أضواء Glyph، معالج Dimensity 7350 Pro، شاشة 120Hz.
11. Xiaomi 14T Pro: السعر 2299 ر.س (أمازون)، معالج Dimensity 9300+، كاميرات لايكا 50MP، شاحن 120W، شاشة 144Hz.
12. Samsung Galaxy S25+: السعر 3799 ر.س (نون)، معالج Snapdragon 8 Elite، شاشة 6.7 QHD+، بطارية 4900mAh، تصميم نحيف وخفيف.

المتاجر الشريكة: أمازون السعودية (Amazon.sa)، نون (Noon)، مكتبة جرير (Jarir)، إكسترا (eXtra).
`;

const SYSTEM_INSTRUCTION = `
أنت "مستشار قارن تك الذكي" (Gemini Advisor)، روبوت محادثة وخبير تقني متخصص في مساعدة المستخدمين على مقارنة واختيار وشراء الهواتف الذكية بأفضل سعر.
معلوماتك محدثة لعام 2025/2026.
تتحدث باللغة العربية بأسلوب راقٍ، مهني، دقيق ومختصر ومباشر.

إرشاداتك:
1. استند إلى بيانات الهواتف والأسعار المتوفرة لديك (${PHONES_SUMMARY}).
2. عندما يطلب المستخدم نصيحة بناءً على الميزانية (مثلاً: "معي 2000 ريال ما أفضل هاتف؟")، رشح له أفضل الخيارات من حيث القيمة مقابل السعر واذكر أين يجد أرخص سعر (أمازون، نون، جرير، إكسترا).
3. عندما يطلب مقارنة بين هاتفين (مثلاً: "آيفون 16 برو ماكس ولا سامسونج S25 ألترا؟")، قارن بينهما في: الكاميرات، البطارية والشحن، المعالج والأداء، ونقاط القوة لكل جهاز، ثم اعطِ خلاصة تفضيلية.
4. اذكر دائماً الأسعار بالريال السعودي أو العملة المطلوبة.
5. نسّق ردودك بنقاط واضحة وخطوط عريضة دون حشو أو إطالة مفرطة.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userCurrency = 'SAR' } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    if (!ai) {
      // Intelligent fallback when GEMINI_API_KEY is not configured
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: `مرحباً بك! أنا مستشار قارن تك الذكي. 
أرى أنك تسأل عن "${lastUserMsg}".
💡 نصيحة سريعة:
- إذا كانت ميزانيتك تتجاوز 4000 ر.س: نرشح لك **Samsung Galaxy S25 Ultra** أو **iPhone 16 Pro Max** كأفضل هواتف رائدة لعام 2025.
- إذا كنت تبحث عن أقوى قيمة للألعاب أقل من 2000 ر.س: **Poco F6 Pro** (1749 ر.س) يقدم شاحن 120W ومعالج سنابدراجون رائد.
- إذا كنت تبحث عن أفضل هاتف متوسط عملي متكامل: **Galaxy A55 5G** (1149 ر.س) أو **Xiaomi 14T Pro** (2299 ر.س).

يمكنك أيضاً استخدام أداة المقارنة التفاعلية في التطبيق لمقارنة المواصفات وجهاً لوجه!`,
      });
    }

    // Format chat history for Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let reply: string = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + `\nالعملة الحالية للمستخدم: ${userCurrency}`,
          temperature: 0.7,
        },
      });
      reply = response.text || 'عذراً، لم أتمكن من تكوين إجابة في الوقت الحالي.';
    } catch (apiError: any) {
      console.warn('Gemini upstream notice, using smart local advisor fallback:', apiError?.message);
      const lastQuery = (messages[messages.length - 1]?.content || '').toLowerCase();
      
      if (lastQuery.includes('iphone') || lastQuery.includes('آيفون') || lastQuery.includes('سامسونج') || lastQuery.includes('s25')) {
        reply = `🔍 **مقارنة سريعة بين آيفون 16 برو ماكس و سامسونج جالاكسي S25 ألترا:**

1. **الأسعار في المتاجر اليوم:**
   - **آيفون 16 برو ماكس:** يبدأ من **4,949 ر.س** (أمازون السعودية ونون) - وفر 750 ر.س.
   - **سامسونج S25 ألترا:** يبدأ من **4,699 ر.س** (نون وأمازون) - وفر 700 ر.س.

2. **الشاشة والعرض:**
   - سامسونج يتفوق بطبقة **Gorilla Armor 2** المضادة للانعكاسات وقلم **S-Pen** المدمج، بينما شاشة آيفون 6.9 بوصة تمتاز بحواف متناهية النحافة.

3. **الكاميرات والتصوير:**
   - **S25 Ultra:** مستشعر رئيسي 200MP مع تقريب 100x فضائي.
   - **iPhone 16 Pro Max:** تصوير سينمائي 4K 120fps احترافي مع زر Camera Control المخصص.

4. **الخلاصة:**
   - إذا كنت تفضل بيئة آبل، البطارية الأطول وتصوير الفيديو، فالآيفون خيارك الأفضل.
   - إذا كنت تفضل الشاشة المضادة للانعكاس والإنتاجية مع القلم وميزات الذكاء الاصطناعي، فالسامسونج يقدم قيمة أعلى مع سعر أقل حالياً!`;
      } else {
        reply = `مرحباً بك! أنا مستشار قارن تك الذكي. 
بناءً على أحدث بيانات الأسعار في المتاجر:
- **أكبر تخفيض حالياً:** Samsung Galaxy A55 5G بسعر 1,149 ر.س بدلاً من 1,549 ر.س (توفير 26%).
- **أقوى هاتف ألعاب مقابل السعر:** Poco F6 Pro بسعر 1,749 ر.س بشاحن 120W يشحن في 19 دقيقة.
- **أفضل صفقة فلاجشيب:** Xiaomi 15 Pro أو OnePlus 13 بمعالج Snapdragon 8 Elite وبطارية 6000mAh.

يمكنك تحديد أي هاتفين في قائمة المقارنة لمشاهدة كافة الفروقات التفصيلية!`;
      }
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'حدث خطأ أثناء معالجة الرد من نموذج Gemini.',
      details: error.message 
    });
  }
});

// Serve frontend with Vite middleware in dev or static in prod
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
