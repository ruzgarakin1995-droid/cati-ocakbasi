// Initial menu data - extracted from existing HTML
// This serves as the default data seed when no KV data exists

export const initialBanners = [
  {
    id: "banner_1",
    title: "Karışık Kebap Şöleni",
    emoji: "🔥",
    description: "Izgara ateşinin eşsiz aromasıyla harmanlanmış, etin en lezzetli hallerini bir araya getiren devasa karışık kebap ziyafeti!",
    price: 800,
    image: "/images/karisik.png",
    badge: "Popüler",
    ingredients: [
      { type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }
    ]
  },
  {
    id: "banner_2",
    title: "Lokum Gibi",
    emoji: "🥩",
    description: "Özel marinasyonla dinlendirilmiş, mangalda tam kıvamında pişen ve ağızda dağılan enfes lokum et deneyimi.",
    price: 900,
    image: "/images/lokum.png",
    badge: "Popüler",
    ingredients: [
      { type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }
    ]
  }
];

export const initialFeatured = [
  {
    id: "featured_1",
    title: "Tavuk Şiş Menü",
    emoji: "⭐",
    description: "Usta ellerden çıkma özel sosuyla marine edilmiş, dışı çıtır içi sulu efsane tavuk şiş lezzeti.",
    price: 600,
    image: "/images/tavuksis.png",
    ingredients: [
      { type: "dana", title: "Tavuk", icon: "fa-solid fa-drumstick-bite" }
    ]
  },
  {
    id: "featured_2",
    title: "Adana Porsiyon",
    emoji: "🌶️",
    description: "Gerçek Adana usulü acı ve baharat dengesiyle mangalda nar gibi kızarmış, damak çatlatan klasik lezzet.",
    price: 650,
    image: "/images/adana.png",
    ingredients: [
      { type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }
    ]
  }
];

export const initialCategories = [
  {
    id: "kebaplar",
    title: "Kebaplar & Izgaralar",
    icon: "fa-solid fa-fire",
    emoji: "🥩",
    navLabel: "Kebaplar",
    items: [
      {
        id: "kebap_1", title: "Karışık Kebap", emoji: "", description: "Izgara ateşinin eşsiz aromasıyla harmanlanmış, etin en lezzetli hallerini bir araya getiren muhteşem karışık kebap ziyafeti.", price: 800, image: "/images/karisik.png", badge: "Popüler", isHighlight: true,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      },
      {
        id: "kebap_2", title: "Lokum Porsiyon", emoji: "", description: "Özel marinasyonla dinlendirilmiş, mangal ateşinde tam kıvamında pişmiş, ağızda dağılan lokum gibi et.", price: 900, image: "/images/lokum.png", badge: "Şefin Tavsiyesi", isHighlight: true,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      },
      {
        id: "kebap_3", title: "Patlıcanlı Kebap", emoji: "", description: "Közde ağır ağır pişen taze patlıcanların, özenle seçilmiş nefis kebap etiyle buluştuğu eşsiz uyum.", price: 750, image: "/images/patlicanli.png", badge: "", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      },
      {
        id: "kebap_4", title: "Ali Nazik Kebap", emoji: "", description: "Süzme yoğurtlu köz patlıcan yatağında, halis tereyağıyla lezzetlendirilmiş lokum kıvamında kebap şöleni.", price: 750, image: "/images/alinazik.png", badge: "", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }, { type: "sut", title: "Süt Ürünü", icon: "fa-solid fa-bottle-droplet" }]
      },
      {
        id: "kebap_5", title: "Tavuk Şiş Porsiyon", emoji: "", description: "Özel sosuyla terbiye edilip mangalda nar gibi kızarmış, dışı çıtır çıtır içi sulu tavuk şiş.", price: 600, image: "/images/tavuksis.png", badge: "", isHighlight: false,
        ingredients: []
      },
      {
        id: "kebap_6", title: "Köfte Porsiyon", emoji: "", description: "Usta kasaplarımızın gizli baharat reçetesiyle yoğrulan, ızgarada cızır cızır pişen geleneksel anne köftesi lezzeti.", price: 650, image: "/images/kofte.png", badge: "", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      },
      {
        id: "kebap_7", title: "Çöp Şiş Porsiyon", emoji: "", description: "En ince ayrıntısına kadar özenle marine edilmiş, bir yiyenin bir daha vazgeçemediği lokmalık çöp şiş ziyafeti.", price: 700, image: "/images/copsis.png", badge: "", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      },
      {
        id: "kebap_8", title: "Adana Porsiyon", emoji: "", description: "Gerçek Adana usulü acı ve baharat dengesiyle mangalda nar gibi kızarmış, damak çatlatan efsane lezzet.", price: 650, image: "/images/adana.png", badge: "Acılı", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      },
      {
        id: "kebap_9", title: "Urfa Porsiyon", emoji: "", description: "Acı tercih etmeyenler için etin en doğal ve en leziz halini yansıtan, mangalda özenle pişirilmiş nefis Urfa Kebap.", price: 650, image: "/images/urfa.png", badge: "", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }]
      }
    ]
  },
  {
    id: "baslangic_ve_ara_sicaklar",
    title: "Başlangıç & Ara Sıcak",
    icon: "fa-solid fa-bowl-food",
    emoji: "🥟",
    navLabel: "Ara Sıcaklar",
    items: [
      {
        id: "ara_1", title: "İçli Köfte", emoji: "", description: "Özenle hazırlanan incecik bulgur kabuğu ve bol cevizli, baharatlı nefis iç harcıyla sofraların vazgeçilmezi çıtır içli köfte.", price: 150, image: "/images/iclikofte.png", badge: "", isHighlight: false,
        ingredients: [{ type: "dana", title: "Et Ürünleri", icon: "fa-solid fa-cow" }, { type: "tahil", title: "Tahıl / Gluten", icon: "fa-solid fa-wheat-awn" }]
      },
      {
        id: "ara_2", title: "Patates", emoji: "", description: "Sipariş anında taptaze hazırlanan, dışı çıtır çıtır, içi yumuşacık altın sarısı patates kızartması.", price: 100, image: "/images/patates.png", badge: "", isHighlight: false,
        ingredients: []
      },
      {
        id: "ara_3", title: "Humus", emoji: "", description: "Günlük taze nohut, hakiki tahin, sızma zeytinyağı ve limonun usta ellerde buluştuğu kadifemsi meze lezzeti.", price: 120, image: "/images/humus.png", badge: "", isHighlight: false,
        ingredients: []
      },
      {
        id: "ara_4", title: "Mercimek Çorbası", emoji: "", description: "Kemik suyunda ağır ağır kaynatılmış, üzerine gezdirilen mis gibi tereyağlı sosuyla içinizi ısıtacak şifa kaynağı.", price: 90, image: "/images/mercimek.png", badge: "", isHighlight: false,
        ingredients: []
      }
    ]
  },
  {
    id: "icecekler",
    title: "İçecekler",
    icon: "fa-solid fa-mug-hot",
    emoji: "",
    navLabel: "İçecekler",
    items: [
      { id: "icecek_10", title: "Meşrubatlar (Kola, Fanta, Sprite)", emoji: "", description: "Kebap keyfinizi ikiye katlayacak, buz gibi serinletici asitli içecek çeşitleri (330 ml).", price: 90, image: "/images/mesrubat.png", badge: "", isHighlight: false, ingredients: [] },
      { id: "icecek_11", title: "Ayran", emoji: "", description: "Doğal yoğurttan hazırlanan, bol köpüklü ve ferahlatıcı buz gibi geleneksel ayran.", price: 70, image: "/images/ayran.png", badge: "", isHighlight: false, ingredients: [{ type: "sut", title: "Süt Ürünü", icon: "fa-solid fa-bottle-droplet" }] },
      { id: "icecek_12", title: "Sade Soda", emoji: "", description: "Yemek sonrası hazmı kolaylaştıran, ferahlatıcı doğal mineralli soğuk maden suyu.", price: 50, image: "/images/soda.png", badge: "", isHighlight: false, ingredients: [] },
      { id: "icecek_6", title: "Çay", emoji: "", description: "Yemeğin üzerine çok iyi gidecek, ince belli bardakta taze demlenmiş tavşan kanı Türk çayı.", price: 30, image: "/images/cay.png", badge: "", isHighlight: false, ingredients: [] }
    ]
  }
];

export const initialCoupons = [];
export const initialOrders = [];

export const initialSettings = {
  isStoreOpen: true,
  freeShippingThreshold: 180,
  courierFee: 60,
  minOrderAmount: 100,
  workingHours: "10:00 - 02:00",
  ratingValue: "5.0",
  ratingCount: "60",
  socialLinks: {
    whatsapp: "905325244906",
    instagram: "https://instagram.com/catiocakbasi",
    googleReview: "#"
  },
  deliveryLinks: {
    yemeksepeti: "#",
    getir: "#",
    migros: "#",
    trendyolGo: "#"
  }
};

export const initialExpenses = [];

export const initialReminders = [];

export const initialWaiterRequests = [];
