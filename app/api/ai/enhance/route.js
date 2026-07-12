export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSettings, validateSession } from '../../../../lib/store';

async function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return await validateSession(token);
}

export async function POST(request) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  
  try {
    const settings = await getSettings();
    const apiKey = settings?.ai?.geminiApiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Lütfen Vercel üzerinden GEMINI_API_KEY ortam değişkenini ekleyin veya İşletme Ayarlarından API Anahtarınızı girin. (Eğer ayarlarınız kaydedilmiyorsa, Vercel KV veritabanı projenize bağlı değildir).' }, { status: 400 });
    }

    const { text, ingredients } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Açıklama boş olamaz' }, { status: 400 });
    }

    const prompt = `Sen profesyonel bir metin yazarısın. Bir restoranın menüsündeki bir ürün için aşağıda verilen içeriği satış odaklı, iştah kabartan bir ürün açıklamasına dönüştür.

Kurallar:
1. Çok uzun yazma, en fazla 2-3 cümlelik kısa ve öz bir metin olsun.
2. Yazılan malzemelerin HİÇBİRİNİ çıkarma, hepsini tek tek açıkça belirt.
3. Sadece yazacağın yeni açıklamayı döndür. Başka hiçbir şey (not, başlık vb.) ekleme.

Orijinal İçerik: "${text}${ingredients && ingredients.length > 0 ? ', ' + ingredients.join(', ') : ''}"
`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await res.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message || 'Yapay zeka servisi yanıt vermedi' }, { status: 500 });
    }
    
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
       return NextResponse.json({ error: 'Yapay zeka geçerli bir yanıt üretemedi.' }, { status: 500 });
    }

    return NextResponse.json({ result: resultText.trim() });
    
  } catch (error) {
    return NextResponse.json({ error: 'İşlem başarısız oldu: ' + error.message }, { status: 500 });
  }
}
