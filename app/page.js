'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const toastMessages = [
  "Bence bunu kesinlikle denemelisin!",
  "├ûzel malzemelerimizle taptaze haz─▒rl─▒yoruz.",
  "M├╝┼şterilerimizin en ├ğok tercih etti─şi lezzetlerden biri.",
  "Bug├╝n kendini ┼ş─▒martmaya ne dersin?",
  "Tam sana g├Âre harika bir ├Ânerimiz var.",
  "Bu e┼şsiz lezzeti hen├╝z tatmad─▒n m─▒?"
];

import LanguageSelector from './components/LanguageSelector';

export default function Home() {
  const [data, setData] = useState({ banners: [], featured: [], categories: [], settings: null });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // Details Modal State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };
  
  // Double Confirmation & Tracking Logic
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  // Toast Logic
  const [toast, setToast] = useState(null);

  // Correcting the interval approach to access 'data' properly
  useEffect(() => {
    // trackingOrder varsa bildirimleri durdur
    if (!data.categories || data.categories.length === 0 || trackingOrder) return;
    const interval = setInterval(() => {
      const allItems = [...(data.banners || []), ...(data.categories.flatMap(c => c.items))].filter(i => i && i.title);
      if (allItems.length > 0) {
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        const randomMsg = toastMessages[Math.floor(Math.random() * toastMessages.length)];
        setToast({
          title: randomItem.title,
          price: randomItem.price,
          image: randomItem.image,
          msg: randomMsg,
          originalItem: randomItem
        });
        setTimeout(() => setToast(null), 8000);
      }
    }, 35000);
    return () => clearInterval(interval);
  }, [data, trackingOrder]);

  const [searchQuery, setSearchQuery] = useState('');
  // Checkout Multi-Step Logic
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart Items, 2: Address Form
  const [checkoutError, setCheckoutError] = useState('');
  
  // Customization Modal Logic
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCartIndex, setEditingCartIndex] = useState(null);
  const [tempExcluded, setTempExcluded] = useState([]);
  const getCustomizableIngredients = (item) => {
    if (item?.customizableIngredients && item.customizableIngredients.length > 0) {
      return item.customizableIngredients;
    }
    const title = item?.title;
    if (!title) return [];
    const t = title.toLowerCase();
    if (t.includes('waffle') || t.includes('tatl─▒ ┼ş├Âleni')) return ["├çikolata Sosu", "Beyaz ├çikolata", "├çilek", "Muz", "Kivi", "F─▒nd─▒k", "F─▒st─▒k", "Hindistan Cevizi"];
    if (t.includes('kumpir') || t.includes('┼şefin elinden')) return ["Sosis", "Salam", "Amerikan Salatas─▒", "Zeytin", "M─▒s─▒r", "Korni┼şon Tur┼şu", "Jalapeno", "Meksika Fasulyesi", "Ket├ğap", "Mayonez", "Ac─▒ Sos"];
    if (t.includes('kumru') || t.includes('gecelerin vazge├ğilmezi') || t.includes('efsane')) return ["Sucuk", "Salam", "Sosis", "Ka┼şar Peyniri", "Domates", "Tur┼şu", "Ket├ğap", "Mayonez", "Ac─▒ Sos"];
    if (t.includes('burger') || t.includes('cheeseburger')) return ["Karamelize So─şan", "Cheddar Peyniri", "Domates", "Marul", "Tur┼şu", "Ket├ğap", "Mayonez", "Ac─▒ Sos"];
    if (t.includes('tost') || t.includes('sabah─▒n g├╝ne┼şi')) return ["Sucuk", "Ka┼şar Peyniri", "Salam", "Sosis", "Tur┼şu", "Ket├ğap", "Mayonez", "Ac─▒ Sos"];
    if (t.includes('d├╝r├╝m') || t.includes('porsiyon') || t.includes('ekmek aras─▒')) return ["So─şan", "Domates", "Ye┼şillik", "Maydanoz", "Tur┼şu", "Ket├ğap", "Mayonez", "Ac─▒ Sos"];
    return ["Ket├ğap", "Mayonez", "Tur┼şu", "Domates", "Marul", "So─şan"];
  };

  // Admin Login Logic
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Coupon Logic
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  

  
  // Slider Logic
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'nakit'
  });

  const [activeTab, setActiveTab] = useState('kampanyali');
  const navContainerRef = useRef(null);
  
  useEffect(() => {
    fetch('/api/data?t=' + new Date().getTime(), { cache: 'no-store' })
      .then(res => res.json())
      .then(d => {
        if(d.banners) setData(d);
      })
      .catch(e => console.error(e));
  }, []);

  // --- Cart Calculations ---
  const settings = data.settings || {};
  const threshold = settings.freeShippingThreshold ?? 600;
  const courierFee = settings.courierFee ?? 60;
  const isStoreOpen = settings.isStoreOpen ?? true;

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = cartTotal - discountAmount;

  // --- Cart Actions ---
  const addToCart = (item) => {
    const isMesrubat = item.title?.toLowerCase().includes('me┼şrubat');
    setCart([...cart, { ...item, cartId: Date.now() + Math.random(), excludedIngredients: [], selectedDrink: isMesrubat ? 'Kola' : null }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // --- Edit Modal Actions ---
  const openEditModal = (index) => {
    setEditingCartIndex(index);
    setTempExcluded([...cart[index].excludedIngredients]);
    setIsEditOpen(true);
  };

  const toggleIngredient = (ing) => {
    if (tempExcluded.includes(ing)) {
      setTempExcluded(tempExcluded.filter(i => i !== ing));
    } else {
      setTempExcluded([...tempExcluded, ing]);
    }
  };

  const saveEdit = () => {
    if (editingCartIndex !== null) {
      const newCart = [...cart];
      newCart[editingCartIndex].excludedIngredients = tempExcluded;
      setCart(newCart);
    }
    setIsEditOpen(false);
  };

  // --- Coupon Logic ---
  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;
    
    try {
      const res = await fetch(`/api/coupons?code=${couponCode}&total=${cartTotal}`);
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
      } else {
        setCouponError(data.error || 'Ge├ğersiz kupon');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Hata olu┼ştu');
    }
  };

  const requestPushPermission = async (orderId) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const response = await fetch('/api/notifications/vapid');
        const { publicKey } = await response.json();
        
        // Base64 to Uint8Array converter
        const padding = '='.repeat((4 - publicKey.length % 4) % 4);
        const base64 = (publicKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: outputArray
        });
        
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription, orderId })
        });
      }
    } catch (e) {
      console.error('Push notification error:', e);
    }
  };

  // --- Order Submission ---
  const submitOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          items: cart,
          subTotal: cartTotal,
          discount: discountAmount,
          total: finalTotal,
          couponCode: appliedCoupon?.code || null
        })
      });
      const order = await res.json();
      
      // Cleanup cart & show tracking
      setCart([]);
      setIsConfirmOpen(false);
      setIsCartOpen(false);
      setCheckoutStep(1);
      setAppliedCoupon(null);
      setCouponCode('');
      
      setTrackingOrder(order);
      setIsTrackingOpen(true);
      if (typeof window !== 'undefined') localStorage.setItem('trackingOrderId', order.id);
      
      // Ask for push notification permission
      requestPushPermission(order.id);
      
      // Start polling
      pollOrderStatus(order.id);
    } catch (e) {
      alert('Sipari┼ş olu┼şturulurken hata olu┼ştu');
    }
  };

  const pollOrderStatus = (orderId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders?track=${orderId}`);
        const data = await res.json();
        if (data.id) {
          setTrackingOrder(data);
          if (data.status === 'delivered') {
            clearInterval(interval);
            setTimeout(() => {
              setTrackingOrder(null);
              setIsTrackingOpen(false);
              if (typeof window !== 'undefined') localStorage.removeItem('trackingOrderId');
            }, 35 * 60 * 1000); // 35 dakika sonra butonu ve ekran─▒ gizle
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 10000);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedOrderId = localStorage.getItem('trackingOrderId');
    if (savedOrderId && !trackingOrder) {
      fetch(`/api/orders?track=${savedOrderId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setTrackingOrder(data);
            if (data.status !== 'delivered') {
              pollOrderStatus(savedOrderId);
            } else {
              localStorage.removeItem('trackingOrderId');
            }
          } else {
            localStorage.removeItem('trackingOrderId');
          }
        })
        .catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTrackingFabData = () => {
    if (!trackingOrder) return null;
    switch (trackingOrder.status) {
      case 'received': return { text: "Sipari┼şiniz Al─▒nd─▒ ­şòÆ", icon: "fa-clipboard-check", color: "var(--primary-color)" };
      case 'preparing': return { text: "Sipari┼şiniz Haz─▒rlan─▒yor ­şæ¿ÔÇı­şı│", icon: "fa-fire-burner", color: "#FF9800" };
      case 'courier': return { text: "Kuryeye Veriliyor ­şøÁ", icon: "fa-box", color: "#9C27B0" };
      case 'onway': return { text: "Tatl─▒ Tatl─▒ Geliyor ­şÜÇ", icon: "fa-motorcycle", color: "#03A9F4" };
      case 'delivered': return { text: "Afiyet Olsun! Ô£à", icon: "fa-check-circle", color: "#4CAF50" };
      default: return { text: "Sipari┼ş Takip", icon: "fa-location-crosshairs", color: "var(--primary-color)" };
    }
  };
  const fabData = getTrackingFabData();

  const getStepClass = (stepName) => {
    if (!trackingOrder) return '';
    const statusMap = { received: 1, preparing: 2, courier: 3, onway: 4, delivered: 5 };
    const currentStatus = statusMap[trackingOrder.status] || 1;
    const stepLevel = statusMap[stepName];
    
    if (currentStatus > stepLevel) return 'completed';
    if (currentStatus === stepLevel) return 'active';
    return '';
  };

  // --- Admin Login ---
  const handleLogin = async () => {
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin';
      } else {
        setLoginError(data.error);
      }
    } catch (e) {
      setLoginError('Hata olu┼ştu');
    }
  };

  // --- Scroll Spy & Banner Slider Auto-play ---
  useEffect(() => {
    // Auto-play slider
    const slider = document.getElementById('mainBannerSlider');
    let slideInterval;
    if (slider && data.banners.length > 0) {
      slideInterval = setInterval(() => {
        setCurrentSlide(prev => {
          const next = (prev + 1) % data.banners.length;
          slider.scrollTo({ left: slider.clientWidth * next, behavior: 'smooth' });
          return next;
        });
      }, 10000);
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let current = '';
      
      data.categories.forEach(cat => {
        const section = document.getElementById(cat.id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = cat.id;
          }
        }
      });

      if (current && current !== activeTab) {
        setActiveTab(current);
        const item = document.getElementById(`nav-${current}`);
        if (item && navContainerRef.current) {
          const itemLeft = item.offsetLeft;
          const itemWidth = item.offsetWidth;
          const containerWidth = navContainerRef.current.offsetWidth;
          const scrollLeft = navContainerRef.current.scrollLeft;

          if (itemLeft < scrollLeft || itemLeft + itemWidth > scrollLeft + containerWidth) {
            navContainerRef.current.scrollTo({
              left: itemLeft - (containerWidth / 2) + (itemWidth / 2),
              behavior: 'smooth'
            });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (slideInterval) clearInterval(slideInterval);
    };
  }, [data.categories, activeTab, data.banners.length]);

  return (
    <>
      {(() => {
        // Renk parlakl─▒k hesaplamas─▒
        let textColor = '#ffffff';
        if (settings?.themeColor) {
          const hex = settings.themeColor.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16) || 0;
          const g = parseInt(hex.substr(2, 2), 16) || 0;
          const b = parseInt(hex.substr(4, 2), 16) || 0;
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          textColor = brightness > 128 ? '#000000' : '#ffffff';
        }

        // Arka plan temas─▒ hesaplamas─▒
        const getSvgBg = (svgStr) => `url("data:image/svg+xml,${encodeURIComponent(svgStr)}")`;
        
        const backgrounds = {
          'dots': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='20' r='2.5' fill='#9ca3af' fill-opacity='0.4'/></svg>`),
          'diagonal': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='#9ca3af' stroke-width='2' stroke-opacity='0.2'/></svg>`),
          'waves': getSvgBg(`<svg width='40' height='20' xmlns='http://www.w3.org/2000/svg'><path d='M0 10 Q 10 0, 20 10 T 40 10' fill='none' stroke='#9ca3af' stroke-width='2' stroke-opacity='0.25'/></svg>`),
          'checkers': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><rect width='20' height='20' fill='#9ca3af' fill-opacity='0.15'/><rect x='20' y='20' width='20' height='20' fill='#9ca3af' fill-opacity='0.15'/></svg>`),
          'grid': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M20 0v40M0 20h40' fill='none' stroke='#9ca3af' stroke-width='2' stroke-opacity='0.2'/></svg>`),
          'rings': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='20' r='14' fill='none' stroke='#9ca3af' stroke-width='2' stroke-opacity='0.25'/></svg>`),
          'zigzag': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M0 40 L40 0 Z' fill='none' stroke='#9ca3af' stroke-opacity='0.2' stroke-width='3'/></svg>`),
          'diamonds': getSvgBg(`<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='#9ca3af' stroke-opacity='0.2' stroke-width='2'/></svg>`)
        };
        const bgPattern = settings?.bgThemeId && backgrounds[settings.bgThemeId] ? backgrounds[settings.bgThemeId] : 'none';

        if (!settings?.themeColor && bgPattern === 'none' && !settings?.customBgImage) return null;

        return (
          <>
            <style dangerouslySetInnerHTML={{__html: `
              :root, body, body.light-mode {
                ${settings?.themeColor ? `--accent-color: ${settings.themeColor} !important; --accent-text: ${textColor} !important;` : ''}
                ${bgPattern !== 'none' && !settings?.customBgImage ? `--theme-bg-pattern: ${bgPattern} !important;` : ''}
              }
            `}} />
            {settings?.customBgImage && (
              <>
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, backgroundImage: `url(${settings.customBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}></div>
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, backdropFilter: 'blur(24px) saturate(150%)', backgroundColor: 'var(--bg-alpha-50)', WebkitBackdropFilter: 'blur(24px) saturate(150%)' }}></div>
              </>
            )}
          </>
        );
      })()}
      {/* HEADER */}
      <header className="hero">
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 999, display: 'flex', gap: '8px' }}>
          <button onClick={toggleTheme} style={{ background: 'var(--theme-btn-bg)', border: '1px solid var(--glass-border)', color: 'var(--theme-btn-color)', padding: '8px', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
            <i className={theme === 'dark' ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          </button>
          <LanguageSelector />
          <button className="admin-profile-btn" onClick={() => setIsLoginOpen(true)}>
            <i className="fa-solid fa-user-shield"></i>
          </button>
        </div>
        <div className="container hero-content" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-color)', boxShadow: '0 4px 15px var(--glass-input-focus)', position: 'relative' }}>
            <Image src="/cati-logo.png" alt="├çat─▒ Ocakba┼ş─▒ Logo" fill style={{ objectFit: 'cover' }} sizes="80px" priority />
          </div>
          <div>
            <h2 className="hero-subtitle" style={{ marginBottom: '4px' }}>Restoran</h2>
            <h1 className="hero-title" style={{ fontSize: '24px' }}>├çat─▒ Ocakba┼ş─▒ Osmanbey</h1>
          </div>
        </div>
        <div className="container hero-info" style={{ marginTop: '16px' }}>
          <span className="info-badge rating"><i className="fa-solid fa-star"></i> {data.settings?.ratingValue || '5.0'} ({data.settings?.ratingCount || '60'} Yorum)</span>
          <span className="info-badge"><i className="fa-solid fa-bag-shopping"></i> Gel-al</span>
          <span className="info-badge"><i className="fa-solid fa-motorcycle"></i> Adrese Teslim</span>
        </div>
      </header>

      {/* SEARCH */}
      <section className="search-filter-section">
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="├£r├╝n ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* STICKY NAV */}
      <nav className="sticky-nav">
        <div className="nav-container" ref={navContainerRef}>
          {data.categories.map(cat => (
            <a 
              key={cat.id} 
              id={`nav-${cat.id}`}
              href={`#${cat.id}`} 
              className={`nav-item ${activeTab === cat.id ? 'active nav-pulse' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveTab(cat.id);
              }}
            >
              {cat.navLabel || cat.title}
            </a>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container">
        
        {/* SLIDER BANNERS */}
        {!searchQuery && data.banners.length > 0 && (
          <>
            <div 
              className="banner-slider" 
              id="mainBannerSlider"
              onScroll={(e) => {
                const index = Math.round(e.target.scrollLeft / e.target.clientWidth);
                if (index !== currentSlide) setCurrentSlide(index);
              }}
            >
              {data.banners.map((banner, i) => (
                <div key={banner.id} className="banner-card">
                  <div className="item-badges">
                  {banner.badge && <span className="tag-badge tag-pop" style={{ fontSize: '12px', padding: '6px 12px' }}><i className="fa-solid fa-star"></i> {banner.badge}</span>}
                </div>
                <div className="banner-img-wrapper">
                  <Image src={banner.image} alt={banner.title} fill className="banner-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 800px" priority={i === 0} />
                </div>
                <div className="banner-content">
                  <h2 className="banner-title">{banner.emoji} <span className="shimmer-heading">{banner.title}</span></h2>
                  <p className="banner-desc">{banner.description}</p>
                  <div className="ingredient-icons">
                    {banner.ingredients?.map((ing, idx) => (
                      <div key={idx} className={`ing-icon ing-${ing.type}`} title={ing.title}><i className={ing.icon}></i></div>
                    ))}
                  </div>
                  <div className="banner-footer">
                    <span className="banner-price">{banner.price} Ôé║</span>
                    <button className="btn-large" onClick={() => addToCart(banner)}>Sipari┼şe Ekle</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-dots" id="bannerDots" style={{ marginTop: '16px', marginBottom: '32px' }}>
            {data.banners.map((_, idx) => (
              <div 
                key={idx} 
                className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => {
                  const slider = document.getElementById('mainBannerSlider');
                  if (slider) {
                    slider.scrollTo({ left: slider.clientWidth * idx, behavior: 'smooth' });
                    setCurrentSlide(idx);
                  }
                }}
              ></div>
            ))}
          </div>
        </>
      )}

        {/* FEATURED ITEMS (S├£PER LEZZETLER) */}
        {!searchQuery && data.featured.length > 0 && (
          <div className="featured-grid">
            {data.featured.map(item => (
              <div key={item.id} className="featured-card">
                <div className="featured-img-wrapper">
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 300px" />
                  <span className="tag-badge tag-new"><i className="fa-solid fa-star"></i> S├£PER LEZZET</span>
                </div>
                <div className="featured-content">
                  <h3 className="featured-title">{item.emoji} {item.title}</h3>
                  <p>{item.description}</p>
                  <div className="ingredient-icons">
                    {item.ingredients?.map((ing, idx) => (
                      <div key={idx} className={`ing-icon ing-${ing.type}`} title={ing.title}><i className={ing.icon}></i></div>
                    ))}
                  </div>
                  <div className="featured-footer">
                    <span className="price">{item.price} Ôé║</span>
                    <button className="btn-add-large" onClick={() => addToCart(item)}>Sipari┼şe Ekle</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MENU CATEGORIES */}
        {data.categories.map(cat => {
          const filteredItems = cat.items.filter(item => 
            !searchQuery || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          
          if (searchQuery && filteredItems.length === 0) return null;

          return (
          <section key={cat.id} id={cat.id} className="menu-section">
            <h2 className="section-title">
              {cat.icon && <i className={cat.icon}></i>} {cat.emoji} {cat.title}
            </h2>
            
            {filteredItems.map(item => (
              item.isHighlight ? (
                <div key={item.id} className="card-highlight" onClick={() => { setSelectedItem(item); setIsDetailOpen(true); }} style={{ cursor: 'pointer' }}>
                  <div className="item-badges">
                    {item.badge && <span className="tag-badge tag-pop"><i className="fa-solid fa-star"></i> {item.badge}</span>}
                  </div>
                  <div className="card-img-wrapper">
                    <Image src={item.image} alt={item.title} fill className="card-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 300px" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{item.emoji} {item.title}</h3>
                    <p className="item-ingredients">{item.description}</p>
                    <div className="ingredient-icons">
                      {item.ingredients?.map((ing, idx) => (
                        <div key={idx} className={`ing-icon ing-${ing.type}`} title={ing.title}><i className={ing.icon}></i></div>
                      ))}
                    </div>
                    <div className="card-footer" style={{ marginTop: '12px' }}>
                      <span className="price">{item.price} ₺</span>
                      <button className="btn-add" onClick={(e) => { e.stopPropagation(); addToCart(item); }}><i className="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={item.id} className="list-item" onClick={() => { setSelectedItem(item); setIsDetailOpen(true); }} style={{ cursor: 'pointer' }}>
                  <div className="list-item-thumb"><Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 300px" /></div>
                  <div className="list-item-content">
                    <div className="list-item-info">
                      <h3>{item.emoji} {item.title}</h3>
                      <p className="item-ingredients">{item.description}</p>
                      <div className="ingredient-icons">
                        {item.ingredients?.map((ing, idx) => (
                          <div key={idx} className={`ing-icon ing-${ing.type}`} title={ing.title}><i className={ing.icon}></i></div>
                        ))}
                      </div>
                    </div>
                    <div className="list-item-bottom">
                      <div className="list-item-price">{item.price} ₺</div>
                      <button className="btn-add-small" onClick={(e) => { e.stopPropagation(); addToCart(item); }}><i className="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </section>
        );
        })}

        {/* SOSYAL */}
        <div style={{ marginTop: '30px', marginBottom: '24px' }}>
          <h2 className="social-list-title" style={{ fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>Sosyal Ağlarımız</h2>
          <a href={settings?.socialLinks?.googleReview || '#'} target="_blank" rel="noreferrer" className="contact-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: '16px', textAlign: 'center', padding: '24px', background: 'var(--surface-color)', borderRadius: '12px', transition: 'transform 0.2s' }}>
            <h3 className="animate-discount" style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-main)' }}>Google yorumu yap, %10 İndirim Kazan!</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '24px', color: '#fbbc05', marginBottom: '8px' }}>
              <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
            </div>
          </a>
        </div>

        {/* İLETİŞİM */}
        <div className="contact-card" style={{ background: 'var(--surface-color)', color: 'var(--text-main)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div className="contact-header" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 700 }}>
            <i className="fa-solid fa-grip" style={{ color: 'var(--text-muted)' }}></i> İletişim
          </div>
          <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <div className="contact-icon-box" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-alpha-05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><i className="fa-solid fa-phone"></i></div>
            <div className="contact-info-text"><div className="contact-label" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Telefon</div><a href="tel:05325244906" style={{ fontSize: '15px', fontWeight: 600, color: 'inherit' }}>0532 524 49 06</a></div>
          </div>
        </div>

        {/* WORKING HOURS */}
        <div className="working-hours-card" style={{ marginTop: '30px' }}>
          <div className="wh-header">
            <div className="wh-title"><i className="fa-regular fa-clock"></i> Çalışma Saatleri</div>
            <div className="wh-badge">Şimdi açık</div>
          </div>
          <table className="wh-table">
            <tbody>
              <tr className="active"><td>Pazartesi:</td><td>10:00 - 02:00</td></tr>
              <tr><td>Salı:</td><td>10:00 - 02:00</td></tr>
              <tr><td>Çarşamba:</td><td>10:00 - 02:00</td></tr>
              <tr><td>Perşembe:</td><td>10:00 - 02:00</td></tr>
              <tr><td>Cuma:</td><td>10:00 - 02:00</td></tr>
              <tr><td>Cumartesi:</td><td>10:00 - 02:00</td></tr>
              <tr><td>Pazar:</td><td>11:00 - 02:00</td></tr>
            </tbody>
          </table>
        </div>

      </main>

      <div className="bottom-spacer" style={{ height: '100px' }}></div>

      {/* FLOATING CART BTN */}
      {cart.length > 0 && !isCartOpen && (
        <div className="floating-cart-btn visible" onClick={() => setIsCartOpen(true)}>
          <div className="cart-count">{cart.length}</div>
          <div className="cart-text">Sipari┼şi G├Âr</div>
          <div className="cart-price">ÔÇó {finalTotal} Ôé║</div>
        </div>
      )}

      {/* MULTI-STEP CHECKOUT OVERLAY */}
      <div className={`checkout-overlay ${isCartOpen ? 'active' : ''}`} onClick={(e) => {if(e.target.className.includes('checkout-overlay')) setIsCartOpen(false)}}>
        <div className="checkout-sheet single-page-compact">
          <div className="sheet-header compact-header" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {checkoutStep === 2 && (
              <button onClick={() => { setCheckoutStep(1); setCheckoutError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 'bold' }}>
                <i className="fa-solid fa-arrow-left"></i> Geri
              </button>
            )}
            <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-cart-shopping"></i> {checkoutStep === 1 ? 'Sipari┼ş Listem' : 'Teslimat & ├ûdeme'}
            </h3>
            <i className="fa-solid fa-xmark close-sheet" onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}></i>
          </div>
          
          <div className="sheet-body compact-body" style={{ overflowY: 'auto' }}>
            
            {/* STEP 1: CART ITEMS */}
            <div style={{ display: checkoutStep === 1 ? 'block' : 'none' }}>
              <div className="compact-cart-items">
                {cart.map((item, index) => {
                  const t = item.title.toLowerCase();
                  const isMesrubat = t.includes('me┼şrubat');
                  const isDrink = !isMesrubat && (t.includes('i├ğecek') || t.includes('su') || t.includes('ayran') || t.includes('kola'));
                  const editBtnText = (t.includes('kumpir') || t.includes('┼şefin elinden')) ? 'Kumpir ─░├ğeri─şi' 
                    : (t.includes('waffle') || t.includes('tatl─▒ ┼ş├Âleni')) ? 'Waffle ─░├ğeri─şi'
                    : (t.includes('kumru') || t.includes('gecelerin') || t.includes('efsane')) ? 'Kumru ─░├ğeri─şi' 
                    : t.includes('burger') ? 'Burger ─░├ğeri─şi' 
                    : (t.includes('tost') || t.includes('sabah─▒n')) ? 'Tost ─░├ğeri─şi' 
                    : isMesrubat ? 'Me┼şrubat─▒ Se├ğ'
                    : 'Malzemeleri D├╝zenle';
                  
                  return (
                  <div key={item.cartId} className="cart-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--bg-alpha-05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div className="cart-item-info" style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--primary-color)', marginRight: '6px' }}>1x</span> 
                        {item.title}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {!isDrink && (
                          <button className="btn-edit-item" onClick={() => openEditModal(index)} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--primary-color)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-sliders"></i> {editBtnText}
                          </button>
                        )}
                        <div className="cart-item-price" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                          {item.price} Ôé║ 
                          <i className="fa-solid fa-xmark remove-item" onClick={() => removeFromCart(item.cartId)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'var(--text-alpha-50)' }}></i>
                        </div>
                      </div>
                    </div>
                    {item.excludedIngredients.length > 0 && (
                      <div className="cart-item-notes" style={{ width: '100%', fontSize: '11px', color: 'var(--text-alpha-40)', fontStyle: 'italic', marginTop: '4px' }}>
                        ─░stemiyor: {item.excludedIngredients.join(', ')}
                      </div>
                    )}
                    {item.selectedDrink && (
                      <div className="cart-item-notes" style={{ width: '100%', fontSize: '11px', color: 'var(--primary-color)', fontStyle: 'italic', marginTop: '4px' }}>
                        Se├ğim: {item.selectedDrink}
                      </div>
                    )}
                  </div>
                  );
                })}
                
                {cart.length === 0 && (
                  <div className="cart-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0' }}>
                    <i className="fa-solid fa-basket-shopping" style={{ fontSize: '2.5rem', color: 'var(--bg-alpha-20)', marginBottom: '10px' }}></i>
                    <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-alpha-50)' }}>Sepetiniz bo┼ş.</p>
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <>
                  <div className="cart-total-row compact-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '16px 0', borderTop: '1px dashed var(--bg-alpha-10)' }}>
                    <strong>Ara Toplam</strong>
                    <strong>{cartTotal} Ôé║</strong>
                  </div>
                  
                  <div className="delivery-notice compact-notice" style={{ padding: '12px', borderRadius: '8px', background: cartTotal >= threshold ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)', color: cartTotal >= threshold ? '#4caf50' : 'var(--primary-color)', textAlign: 'center', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}><i className="fa-solid fa-motorcycle"></i> {cartTotal >= threshold ? 'Teslimat─▒n─▒z bizden, afiyet bal ┼şeker olsun! ­şøÁ­şÄë' : `${threshold - cartTotal} Ôé║ daha ekleyin, teslimat ├╝cretsiz olsun!`}</span>
                    {cartTotal < threshold && <span style={{ fontSize: '13px', color: '#999', fontStyle: 'italic', fontWeight: '500' }}>Ortalama kurye ├╝cretimiz: {courierFee} Ôé║'dir.</span>}
                  </div>

                  <button className="btn-checkout-premium compact-btn" onClick={() => {
                    const minAmount = data.settings?.minOrderAmount || 0;
                    if (cartTotal < minAmount) {
                      alert(`Sipari┼ş verebilmek i├ğin minimum sepet tutar─▒ ${minAmount} Ôé║ olmal─▒d─▒r. L├╝tfen sepetinize ├╝r├╝n eklemeye devam ediniz.`);
                      return;
                    }
                    setCheckoutStep(2);
                  }} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'var(--primary-color)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                    Devam Et <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </>
              )}
            </div>

            {/* STEP 2: CHECKOUT FORM & COUPON */}
            <div style={{ display: checkoutStep === 2 ? 'block' : 'none' }}>
              <style dangerouslySetInnerHTML={{ __html: `
                .premium-input {
                  width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid var(--bg-alpha-10); background: var(--bg-alpha-03); color: var(--text-main); font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; transition: all 0.3s;
                }
                .premium-input::placeholder { color: var(--text-muted); }
                .premium-input:focus {
                  border-color: var(--primary-color); background: var(--glass-input-focus); box-shadow: 0 0 0 4px rgba(212,175,55,0.1);
                }
                .premium-payment-btn {
                  flex: 1; padding: 16px; border-radius: 12px; border: 1px solid var(--bg-alpha-10); background: var(--bg-alpha-03); color: var(--text-muted); cursor: pointer; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 12px; font-weight: 600; transition: all 0.3s; text-align: left;
                }
                .premium-payment-btn.active {
                  border-color: var(--primary-color); background: rgba(212,175,55,0.05); color: var(--primary-color); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212,175,55,0.1);
                }
                .premium-payment-btn i { font-size: 24px; }
              ` }} />
              
              <div className="checkout-form compact-form">
                <div className="form-row" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <input type="text" placeholder="─░sim Soyisim *" required value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="premium-input" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <input type="tel" placeholder="Telefon *" required value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="premium-input" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <input type="text" placeholder="Teslimat Adresi (Mahalle, Sokak, Bina No, Daire) *" required value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="premium-input" />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <input type="text" placeholder="Sipari┼ş Notu (Opsiyonel)" value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})} className="premium-input" />
                </div>
              </div>

              <div style={{ marginBottom: '12px', color: 'var(--text-alpha-50)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>├ûdeme Y├Ântemi</div>
              <div className="payment-methods compact-payment" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button className={`premium-payment-btn ${customerInfo.paymentMethod === 'nakit' ? 'active' : ''}`} onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'nakit'})}>
                  <i className="fa-solid fa-money-bill-wave" style={{ color: '#2ecc71', fontSize: '22px' }}></i>
                  <span style={{ fontSize: '15px' }}>Nakit</span>
                </button>
                <button className={`premium-payment-btn ${customerInfo.paymentMethod === 'kredi_karti' ? 'active' : ''}`} onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'kredi_karti'})}>
                  <i className="fa-solid fa-credit-card" style={{ color: '#3498db', fontSize: '22px' }}></i>
                  <span style={{ fontSize: '15px' }}>Kredi Kart─▒</span>
                </button>
              </div>

              {/* COUPON SECTION */}
              <div className="coupon-section" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <i className="fa-solid fa-ticket" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }}></i>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="KUPON KODU G─░R─░N" 
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, paddingLeft: '44px', background: 'var(--bg-alpha-05)', border: '1px solid var(--bg-alpha-10)' }}
                  />
                </div>
                <button className="btn-apply-coupon" onClick={handleApplyCoupon} style={{ padding: '0 24px', borderRadius: '12px', border: '1px solid var(--primary-color)', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.2))', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                  Uygula
                </button>
              </div>
              {couponError && <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '12px', paddingLeft: '4px' }}><i className="fa-solid fa-circle-exclamation"></i> {couponError}</div>}
              {appliedCoupon && (
                <div className="discount-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71', marginBottom: '12px', fontWeight: 'bold', background: 'rgba(46, 204, 113, 0.1)', padding: '12px 16px', borderRadius: '8px' }}>
                  <span><i className="fa-solid fa-tag"></i> ─░ndirim Uyguland─▒ ({appliedCoupon.code})</span>
                  <span>-{discountAmount} Ôé║</span>
                </div>
              )}
              
              <div className="cart-total-row compact-total" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', borderTop: '1px dashed var(--bg-alpha-10)', paddingTop: '20px', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', color: 'var(--text-alpha-70)', fontWeight: 600 }}>Genel Toplam</span>
                <strong style={{ color: 'var(--primary-color)', fontSize: '28px', textShadow: '0 2px 10px rgba(212,175,55,0.3)' }}>{finalTotal} Ôé║</strong>
              </div>
              
              {checkoutError && (
                <div style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)', color: '#ff6b6b', padding: '14px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '18px' }}></i>
                  <span>{checkoutError}</span>
                </div>
              )}
              <button 
                className="btn-checkout-premium compact-btn" 
                onClick={() => {
                  setCheckoutError('');
                  if(!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
                    setCheckoutError('L├╝tfen ad, soyad, telefon ve adres bilgilerinizi eksiksiz doldurun.'); return;
                  }
                  const phoneDigits = customerInfo.phone.replace(/\D/g, '');
                  if(phoneDigits.length < 10) {
                    setCheckoutError('L├╝tfen en az 10 haneli ge├ğerli bir telefon numaras─▒ girin. (├ûrn: 0501 161 03 99)'); return;
                  }
                  setIsConfirmOpen(true);
                }}
                style={{ width: '100%', padding: '18px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-color), #f9d423)', color: '#000', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.3)', transition: 'all 0.3s' }}
              >
                S─░PAR─░┼Ş─░ TAMAMLA <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* EDIT INGREDIENTS MODAL */}
      <div className={`edit-item-overlay ${isEditOpen ? 'active' : ''}`} style={{ opacity: isEditOpen ? 1 : 0, pointerEvents: isEditOpen ? 'auto' : 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s ease' }}>
        <div className="edit-item-sheet" style={{ background: 'var(--surface-color)', padding: '20px', borderRadius: '16px', width: '90%', maxWidth: '350px', border: '1px solid var(--glass-border)' }}>
          <div className="edit-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px' }}>
              {cart[editingCartIndex]?.title?.toLowerCase().includes('me┼şrubat') ? 'Me┼şrubat Se├ğimi' : '├£r├╝n Malzemeleri'}
            </h4>
            <i className="fa-solid fa-xmark close-edit" onClick={() => setIsEditOpen(false)} style={{ cursor: 'pointer', fontSize: '20px', color: 'var(--text-alpha-50)' }}></i>
          </div>
          <div className="edit-body" style={{ marginBottom: '20px' }}>
            {cart[editingCartIndex]?.title?.toLowerCase().includes('me┼şrubat') ? (
              ['Kola', 'Fanta', 'Sprite', 'Ice Tea Limon', 'Ice Tea ┼Şeftali'].map(drink => (
                <div key={drink} className="ingredient-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-alpha-05)' }}>
                  <span className="ingredient-name">{drink}</span>
                  <input 
                    type="radio" 
                    name={`drink-select`}
                    checked={cart[editingCartIndex]?.selectedDrink === drink}
                    onChange={() => {
                      const newCart = [...cart];
                      newCart[editingCartIndex] = { ...newCart[editingCartIndex], selectedDrink: drink };
                      setCart(newCart);
                    }}
                    style={{ accentColor: 'var(--primary-color)', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>
              ))
            ) : (
              getCustomizableIngredients(cart[editingCartIndex]).map(ing => (
                <div key={ing} className="ingredient-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-alpha-05)' }}>
                  <span className="ingredient-name">{ing}</span>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                    <input 
                      type="checkbox" 
                      checked={!tempExcluded.includes(ing)} 
                      onChange={() => toggleIngredient(ing)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: tempExcluded.includes(ing) ? '#ccc' : '#4caf50', borderRadius: '20px', transition: '.4s' }}>
                      <span style={{ position: 'absolute', height: '16px', width: '16px', left: tempExcluded.includes(ing) ? '2px' : '22px', bottom: '2px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
                    </span>
                  </label>
                </div>
              ))
            )}
          </div>
          <div className="edit-footer">
            <button className="btn-checkout-premium" onClick={saveEdit} style={{ width: '100%', padding: '12px', background: 'var(--primary-color)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Kaydet</button>
          </div>
        </div>
      </div>

      {/* DOUBLE CONFIRMATION MODAL */}
      <div className={`custom-modal-overlay ${isConfirmOpen ? 'active' : ''}`}>
        <div className="custom-modal-content">
          <h3>Sipari┼şi Onayla</h3>
          <p>Sipari┼şinizi onayl─▒yor musunuz? Onaylad─▒─ş─▒n─▒z an sipari┼şiniz bize ula┼ş─▒r ve an─▒nda haz─▒rlamaya ba┼şlar─▒z. En k─▒sa s├╝rede kap─▒n─▒za geliyor! Afiyet olsun ┼şimdiden, sizi her zaman bekleriz! ­şİç</p>
          <div className="modal-actions">
            <button className="btn-modal-secondary" onClick={() => setIsConfirmOpen(false)}>─░ptal</button>
            <button className="btn-modal-primary" onClick={submitOrder}>Onayla</button>
          </div>
        </div>
      </div>

      {/* ORDER TRACKING MODAL */}
      <div className={`custom-modal-overlay ${isTrackingOpen ? 'active' : ''}`}>
        <div className="custom-modal-content" style={{ maxWidth: 500, padding: 30, maxHeight: '90vh', overflowY: 'auto' }}>
          <h3>Sipari┼ş Takibi</h3>
          <p style={{ marginBottom: 20 }}>Sipari┼ş Numaran─▒z: <strong>{trackingOrder?.id}</strong></p>

          {trackingOrder && trackingOrder.items && (
            <div style={{ background: 'var(--bg-alpha-03)', border: '1px solid var(--bg-alpha-10)', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left', fontSize: 14 }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-color)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-receipt"></i> Sipari┼ş ├ûzeti
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {trackingOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#eee', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: 10 }}>
                      <span style={{ fontWeight: 600 }}>{item.quantity || 1}x</span> {item.title || item.name}
                      {item.selectedDrink && <div style={{ color: '#3498db', fontSize: 12, marginTop: 2 }}><i className="fa-solid fa-bottle-droplet" style={{marginRight: 4}}></i>{item.selectedDrink}</div>}
                      {item.excludedIngredients && item.excludedIngredients.length > 0 && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 2 }}><i className="fa-solid fa-ban" style={{marginRight: 4}}></i>├ç─▒kar─▒lan: {item.excludedIngredients.join(', ')}</div>}
                    </div>
                    <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{(item.price * (item.quantity || 1)).toFixed(2)} TL</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--bg-alpha-10)', paddingTop: 12, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>├ûdeme Y├Ântemi:</span>
                <span style={{ fontWeight: 600 }}>
                  {trackingOrder.customerInfo?.paymentMethod === 'nakit' ? 'Kap─▒da Nakit' : 
                   trackingOrder.customerInfo?.paymentMethod === 'kredi_karti' ? 'Kap─▒da Kredi Kart─▒' : 
                   trackingOrder.customerInfo?.paymentMethod === 'online' ? 'Online ├ûdeme' : trackingOrder.customerInfo?.paymentMethod || 'Belirtilmedi'}
                </span>
              </div>
              {trackingOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Kupon ─░ndirimi{trackingOrder.couponCode ? ` (${trackingOrder.couponCode})` : ''}:</span>
                  <span style={{ color: '#2ecc71', fontWeight: 600 }}>-{trackingOrder.discount} TL</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Toplam Tutar:</span>
                <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: 16 }}>{trackingOrder.totalAmount || trackingOrder.total} TL</span>
              </div>
            </div>
          )}
          
          {trackingOrder?.status === 'cancelled' ? (
            <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>­şİö</div>
              <h4 style={{ color: '#e74c3c', fontSize: 18, marginBottom: 8, fontWeight: 700 }}>Sipari┼şiniz ─░ptal Edildi</h4>
              <p style={{ color: 'var(--text-main)', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>├çok ├Âz├╝r dileriz ama maalesef sipari┼şiniz iptal oldu.</p>
              {trackingOrder.statusHistory?.find(h => h.status === 'cancelled')?.note && (
                <div style={{ background: 'var(--bg-alpha-06)', padding: 12, borderRadius: 8, textAlign: 'left', borderLeft: '3px solid #e74c3c' }}>
                  <div style={{ color: '#e74c3c', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>─░ptal Notu:</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>{trackingOrder.statusHistory.find(h => h.status === 'cancelled').note}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="order-tracking-container">
              <div className={`tracking-step ${getStepClass('received')}`}>
                <div className="step-icon"><i className="fa-solid fa-check"></i></div>
                <div className="step-info">
                  <div className="step-title">Sipari┼şiniz Al─▒nd─▒</div>
                  <div className="step-time" style={{ fontSize: 13, lineHeight: 1.4 }}>Lezzetli sipari┼şiniz ─▒┼ş─▒k h─▒z─▒nda bizlere ula┼şt─▒.</div>
                </div>
              </div>
              <div className={`tracking-step ${getStepClass('preparing')}`}>
                <div className="step-icon">­şæ¿ÔÇı­şı│</div>
                <div className="step-info">
                  <div className="step-title">Haz─▒rlan─▒yor</div>
                  <div className="step-time" style={{ fontSize: 13, lineHeight: 1.4 }}>Sipari┼şiniz en lezzetli ┼şekilde ├Âzel ┼şef ustalar─▒m─▒z taraf─▒ndan sizler i├ğin haz─▒rlan─▒yorlar.</div>
                </div>
              </div>
              <div className={`tracking-step ${getStepClass('courier')}`}>
                <div className="step-icon">­şÅı´©Å</div>
                <div className="step-info">
                  <div className="step-title">Kuryeye Teslim Edildi</div>
                  <div className="step-time" style={{ fontSize: 13, lineHeight: 1.4 }}>Kuryelerimiz bu ├Âzel paketi sizlere ula┼şt─▒rmak i├ğin haz─▒rda bekliyor.</div>
                </div>
              </div>
              <div className={`tracking-step ${getStepClass('onway')}`}>
                <div className="step-icon"><i className="fa-solid fa-road"></i></div>
                <div className="step-info">
                  <div className="step-title">Yola ├ç─▒kt─▒</div>
                  <div className="step-time" style={{ fontSize: 13, lineHeight: 1.4 }}>Sipari┼şiniz size ula┼ş─▒p bu e┼şsiz lezzeti deneyimlemeniz i├ğin yola ├ğ─▒kt─▒ ve ad─▒m ad─▒m sizlere yakla┼ş─▒yor.</div>
                </div>
              </div>
              <div className={`tracking-step ${getStepClass('delivered')}`}>
                <div className="step-icon">­şôĞ</div>
                <div className="step-info">
                  <div className="step-title">Teslim Edildi</div>
                  <div className="step-time" style={{ fontSize: 13, lineHeight: 1.4 }}>Sevgiyle haz─▒rlad─▒k, keyifle yemeniz dile─şiyle. Afiyet, bal, ┼şeker olsun!</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="modal-actions" style={{ marginTop: 30 }}>
            <button className="btn-modal-primary" onClick={() => {
              setIsTrackingOpen(false);
              if (trackingOrder?.status === 'cancelled') {
                setTrackingOrder(null);
                if (typeof window !== 'undefined') localStorage.removeItem('trackingOrderId');
              }
            }}>Kapat</button>
          </div>
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      <div className={`custom-modal-overlay ${isLoginOpen ? 'active' : ''}`}>
        <div className="custom-modal-content">
          <h3>Admin Giri┼şi</h3>
          <input 
            type="password" 
            className="custom-modal-input" 
            placeholder="┼Şifre" 
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
          />
          {loginError && <p style={{ color: '#f44336', margin: '-10px 0 15px 0', fontSize: '13px' }}>{loginError}</p>}
          <div className="modal-actions">
            <button className="btn-modal-secondary" onClick={() => setIsLoginOpen(false)}>─░ptal</button>
            <button className="btn-modal-primary" onClick={handleLogin}>Giri┼ş Yap</button>
          </div>
        </div>
      </div>

      {/* STORE CLOSED OVERLAY */}
      {!isStoreOpen && (
        <div className="store-closed-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', padding: '20px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
          <i className="fa-solid fa-store-slash" style={{ fontSize: 64, color: 'var(--primary-color)', marginBottom: 20 }}></i>
          <h2 style={{ fontSize: 28, marginBottom: 10 }}>┼Şu An Kapal─▒y─▒z</h2>
          <p style={{ color: '#ccc', maxWidth: 450, lineHeight: 1.6, fontSize: '15px' }}>
            De─şerli m├╝┼şterimiz, ┼şu anda sipari┼ş alam─▒yoruz. Anlay─▒┼ş─▒n─▒z i├ğin te┼şekk├╝r ederiz.
            {settings?.workingHours && <><br/><br/>├çal─▒┼şma saatlerimiz: <strong>{settings.workingHours}</strong></>}
          </p>
        </div>
      )}

      {/* TRACKING FAB (Floating Action Button) */}
      {trackingOrder && !isTrackingOpen && (
        <div className="tracking-fab" onClick={() => setIsTrackingOpen(true)} style={{ '--fab-color': fabData.color }}>
          <div className="tracking-fab-icon">
            <i className={`fa-solid ${fabData.icon}`}></i>
          </div>
          <div className="tracking-fab-text">
            <span>{fabData.text}</span>
          </div>
        </div>
      )}

      {/* PREMIUM TOAST */}
      <div className={`premium-toast ${toast ? 'show' : ''}`}>
        {toast && (
          <>
            <i className="fa-solid fa-xmark toast-close" onClick={() => setToast(null)}></i>
            <div className="toast-header">
              <i className="fa-solid fa-bell" style={{ animation: 'ring 2s infinite', color: 'var(--primary-color)' }}></i>
              Bunu denemi┼ş miydiniz?
            </div>
            
            <div className="toast-body">
              {toast.image ? (
                <div className="toast-img">
                  <Image src={toast.image} alt={toast.title} fill style={{ objectFit: 'cover' }} sizes="70px" />
                </div>
              ) : (
                <div className="toast-img-placeholder"><i className="fa-solid fa-utensils"></i></div>
              )}
              
              <div className="toast-content">
                <div className="toast-item-title">{toast.title}</div>
                <div className="toast-msg">"{toast.msg}"</div>
                <div className="toast-footer">
                  <span className="toast-price">{toast.price} Ôé║</span>
                  <button className="btn-toast-add" onClick={(e) => {
                    e.stopPropagation();
                    addToCart(toast.originalItem);
                    setToast(null);
                  }}>
                    + Ekle
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FLOATING BOTTOM NAV */}
      <div className="floating-bottom-nav" style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'var(--surface-color)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '32px', padding: '8px 24px', display: 'flex', gap: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '20px', cursor: 'pointer' }}><i className="fa-solid fa-house"></i></button>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}><i className="fa-solid fa-heart"></i></button>
        <button style={{ background: 'var(--primary-color)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-24px', boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)' }} onClick={() => setIsCartOpen(true)}>
          <i className="fa-solid fa-cart-shopping"></i>
          {cart.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: '10px', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{cart.length}</span>}
        </button>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsLoginOpen(true)}><i className="fa-solid fa-user"></i></button>
      </div>

      {/* PRODUCT DETAILS MODAL (FULL SCREEN SHEET) */}
      <div className={`checkout-overlay ${isDetailOpen ? 'active' : ''}`} onClick={(e) => { if(e.target.className.includes('checkout-overlay')) { setIsDetailOpen(false); setDetailQuantity(1); } }}>
        <div className={`checkout-sheet ${isDetailOpen ? 'open' : ''}`} style={{ background: 'var(--bg-main)', height: '85vh', borderRadius: '32px 32px 0 0', display: 'flex', flexDirection: 'column' }}>
          {selectedItem && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 24px 0 24px' }}>
                <button onClick={() => { setIsDetailOpen(false); setDetailQuantity(1); }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>Detaylar</div>
                <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer' }}>
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>

              {/* Huge Image */}
              <div style={{ position: 'relative', width: '250px', height: '250px', margin: '24px auto', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                <Image src={selectedItem.image} alt={selectedItem.title} fill style={{ objectFit: 'cover' }} sizes="250px" />
              </div>

              {/* Content */}
              <div style={{ flex: 1, background: 'var(--surface-color)', borderRadius: '32px 32px 0 0', padding: '32px 24px', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{selectedItem.emoji} {selectedItem.title}</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}><i className="fa-solid fa-location-dot"></i> Çatı Ocakbaşı, Osmanbey</div>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-main)', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                    <button onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '18px' }}>-</button>
                    <span style={{ fontWeight: '600', width: '20px', textAlign: 'center' }}>{detailQuantity}</span>
                    <button onClick={() => setDetailQuantity(detailQuantity + 1)} style={{ background: 'var(--primary-color)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '14px', fontWeight: '500' }}>
                    <i className="fa-regular fa-face-smile"></i> Lezzetli
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                    <i className="fa-regular fa-clock"></i> 10-15 dk
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-color)', fontSize: '14px', fontWeight: '500' }}>
                    <i className="fa-solid fa-star"></i> 4.8 Puan
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', flex: 1, overflowY: 'auto' }}>
                  {selectedItem.description || "Harika malzemelerle usta ellerden çıkan enfes lezzet. Şimdiden afiyet olsun!"}
                </p>

                {/* Bottom Add to Cart */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Toplam Tutar</div>
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{selectedItem.price * detailQuantity} ₺</div>
                  </div>
                  <button onClick={() => {
                    for(let i=0; i<detailQuantity; i++) {
                      addToCart(selectedItem);
                    }
                    setIsDetailOpen(false);
                    setDetailQuantity(1);
                  }} style={{ background: 'var(--text-main)', color: 'var(--bg-main)', padding: '16px 32px', borderRadius: '32px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </>
  );
}
