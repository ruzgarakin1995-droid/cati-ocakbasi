import { NextResponse } from 'next/server';
import { getCategories, setCategories, validateSession, getSettings } from '../../../lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!(await validateSession(token))) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const { message } = await request.json();
    if (!message) return NextResponse.json({ error: 'Mesaj boş' }, { status: 400 });

    const settings = await getSettings();
    const apiKey = settings?.aiApiKey || process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Anahtarı bulunamadı. Lütfen Ayarlar sekmesinden Gemini API anahtarınızı girin.' }, { status: 400 });
    }

    const categories = await getCategories();
    
    // Create a simplified prompt for Gemini
    const systemPrompt = `Sen restoran için bir yapay zeka asistanısın. Kullanıcı restoranın menüsünde bir değişiklik yapmak istiyor.
Mevcut Menü:
${JSON.stringify(categories.map(c => ({
  id: c.id, 
  title: c.title, 
  items: c.items.map(i => ({ id: i.id, title: i.title, price: i.price, isHidden: i.isHidden }))
})), null, 2)}

Görev: Kullanıcının mesajına göre menüde hangi ürünün (item.id) nasıl değişeceğini anla ve SADECE saf JSON formatında dön (başka hiçbir metin yazma, backtick kullanma). JSON formatı şu şekilde olmalı:
{
  "action": "update_item",
  "itemId": "buldugun_item_id",
  "categoryId": "buldugun_category_id",
  "updates": {
    "price": yeni_fiyat_sayisal, // eger fiyat değişiyorsa
    "isHidden": true_veya_false // eger ürün gizleniyorsa veya tekrar açılıyorsa (kapat/bitti diyorsa true, aç/geri getir diyorsa false)
  },
  "reply": "Kullanıcıya işlemin yapıldığına dair Türkçe, tatlı ve kısa bir cevap (örn: 'Harika, lahmacun fiyatını güncelledim şefim!')"
}
Eğer kullanıcı ilgisiz bir şey söylüyorsa veya eşleşen ürün bulunamazsa:
{
  "action": "none",
  "reply": "Üzgünüm, hangi ürünü kastettiğinizi anlayamadım veya bu işlemi yapmaya yetkim yok."
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: message }] }]
      })
    });

    const aiData = await res.json();
    if (aiData.error) {
      return NextResponse.json({ error: 'Yapay zeka servisi hatası: ' + aiData.error.message }, { status: 500 });
    }

    let rawResponse = aiData.candidates[0].content.parts[0].text.trim();
    if (rawResponse.startsWith('```json')) {
      rawResponse = rawResponse.substring(7, rawResponse.length - 3).trim();
    } else if (rawResponse.startsWith('```')) {
      rawResponse = rawResponse.substring(3, rawResponse.length - 3).trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (e) {
      return NextResponse.json({ error: 'Yapay zekanın yanıtı işlenemedi.', raw: rawResponse }, { status: 500 });
    }

    if (parsed.action === 'update_item' && parsed.itemId && parsed.categoryId) {
      const catIndex = categories.findIndex(c => c.id === parsed.categoryId);
      if (catIndex > -1) {
        const itemIndex = categories[catIndex].items.findIndex(i => i.id === parsed.itemId);
        if (itemIndex > -1) {
          if (parsed.updates.price !== undefined) {
            categories[catIndex].items[itemIndex].price = Number(parsed.updates.price);
          }
          if (parsed.updates.isHidden !== undefined) {
            categories[catIndex].items[itemIndex].isHidden = Boolean(parsed.updates.isHidden);
          }
          await setCategories(categories);
          return NextResponse.json({ reply: parsed.reply || 'İşlem tamamlandı.', actionExecuted: true });
        }
      }
      return NextResponse.json({ reply: 'Üzgünüm, ürünü bulamadım.' }, { status: 200 });
    }

    return NextResponse.json({ reply: parsed.reply || 'İşlemi gerçekleştiremedim.' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
