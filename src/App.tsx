import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  ClipboardCheck, 
  User, 
  ChevronRight, 
  Plus, 
  Minus, 
  X, 
  Utensils, 
  Truck, 
  Store, 
  Clock, 
  CheckCircle2,
  Settings,
  LayoutDashboard,
  Package,
  History,
  Info,
  Sparkles,
  Loader2,
  ArrowLeft,
  LogOut,
  CreditCard,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BENTOS, CATEGORIES, CUSTOMIZATIONS, Bento, Order, OrderItem, CustomizationOption } from './constants';
import { analyzeMeal } from './services/gemini';

// --- Components ---

const Header = ({ activeTab, setActiveTab, cartCount }: { activeTab: string, setActiveTab: (tab: string) => void, cartCount: number }) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2" onClick={() => setActiveTab('menu')}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Utensils size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">阿爸的家園</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Healthy Nutrition Center</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('cart')}
          className="relative p-2 text-slate-600 hover:text-primary transition-colors"
        >
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('merchant')}
          className="p-2 text-slate-600 hover:text-primary transition-colors"
        >
          <Settings size={22} />
        </button>
      </div>
    </div>
  </header>
);

const HealthQuiz = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const questions = [
    { q: "您每天會喝一杯咖啡嗎？", options: ["是", "否", "不一定"] },
    { q: "您平常注重身體保養嗎？", options: ["有", "有考慮", "沒有"] },
    { q: "您有運動習慣嗎？", options: ["有", "有考慮但缺伴", "沒時間"] },
    { q: "想藉由飲食調整而改變體態嗎？", options: ["有", "有考慮但沒方法", "沒有"] },
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-warm rounded-3xl border-2 border-primary/20 m-4"
    >
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">30秒健康微健檢</span>
        <span className="text-xs font-mono text-slate-400">{step + 1} / {questions.length}</span>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-8">{questions[step].q}</h2>
      <div className="space-y-3">
        {questions[step].options.map((opt, i) => (
          <button
            key={i}
            onClick={handleNext}
            className="w-full p-4 text-left bg-white rounded-2xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700 group-hover:text-primary">{opt}</span>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-primary" />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-8 flex gap-1">
        {questions.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-200'}`} />
        ))}
      </div>
    </motion.div>
  );
};

const BentoCard: React.FC<{ bento: Bento, onSelect: (b: Bento) => void }> = ({ bento, onSelect }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    onClick={() => onSelect(bento)}
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={bento.image} 
        alt={bento.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/food/800/600';
        }}
      />
      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
        {bento.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold text-primary rounded-lg shadow-sm">
            {tag}
          </span>
        ))}
      </div>
      {!bento.inStock && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
          <span className="px-4 py-2 bg-white text-slate-900 font-bold rounded-full text-sm">已售罄</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-slate-800">{bento.name}</h3>
        <span className="font-bold text-primary">${bento.price}</span>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{bento.description}</p>
      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 border-t border-slate-50 pt-3">
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold">{bento.calories}</span>
          <span>KCAL</span>
        </div>
        <div className="w-px h-6 bg-slate-100" />
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold">{bento.protein}g</span>
          <span>PRO</span>
        </div>
        <div className="w-px h-6 bg-slate-100" />
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold">{bento.fat}g</span>
          <span>FAT</span>
        </div>
        <div className="w-px h-6 bg-slate-100" />
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold">{bento.carbs}g</span>
          <span>CARB</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const BentoDetail = ({ bento, onClose, onAddToCart }: { bento: Bento, onClose: () => void, onAddToCart: (item: OrderItem) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedRice, setSelectedRice] = useState(CUSTOMIZATIONS.find(c => c.category === 'rice' && c.price === 0)!);
  const [selectedExtras, setSelectedExtras] = useState<CustomizationOption[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalPrice = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return (bento.price + selectedRice.price + extrasTotal) * quantity;
  }, [bento, selectedRice, selectedExtras, quantity]);

  const toggleExtra = (extra: CustomizationOption) => {
    if (selectedExtras.find(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeMeal(bento.name, bento.description, {
      calories: bento.calories,
      protein: bento.protein,
      fat: bento.fat,
      carbs: bento.carbs
    });
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[60] bg-white flex flex-col"
    >
      <div className="relative h-64">
        <img 
          src={bento.image} 
          alt={bento.name} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/food/800/600';
          }}
        />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-slate-800">{bento.name}</h2>
            <span className="text-2xl font-bold text-primary">${bento.price}</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{bento.description}</p>
          
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {aiAnalysis ? '重新進行 AI 分析' : 'AI 營養分析'}
          </button>

          <AnimatePresence>
            {aiAnalysis && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10"
              >
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs">
                  <Sparkles size={14} />
                  AI 營養師建議
                </div>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {aiAnalysis}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <section>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-primary rounded-full" />
            主食調整
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {CUSTOMIZATIONS.filter(c => c.category === 'rice').map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedRice(opt)}
                className={`p-2 rounded-2xl border-2 transition-all text-sm font-medium flex flex-col items-center gap-2 ${
                  selectedRice.id === opt.id 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                {opt.image && (
                  <img 
                    src={opt.image} 
                    alt={opt.name} 
                    className="w-full h-20 object-cover rounded-xl" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/rice/200/200';
                    }}
                  />
                )}
                <div className="flex justify-between items-center w-full px-1">
                  <span>{opt.name}</span>
                  {opt.price > 0 && <span className="text-[10px] opacity-70">+{opt.price}</span>}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-primary rounded-full" />
            加購升級
          </h3>
          <div className="space-y-3">
            {CUSTOMIZATIONS.filter(c => c.category === 'extra').map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleExtra(opt)}
                className={`w-full p-3 rounded-2xl border-2 transition-all text-sm font-medium flex items-center gap-4 ${
                  selectedExtras.find(e => e.id === opt.id)
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                {opt.image && (
                  <img 
                    src={opt.image} 
                    alt={opt.name} 
                    className="w-16 h-16 object-cover rounded-xl" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/extra/200/200';
                    }}
                  />
                )}
                <div className="flex-1 flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    selectedExtras.find(e => e.id === opt.id) ? 'bg-primary border-primary' : 'border-slate-300'
                  }`}>
                    {selectedExtras.find(e => e.id === opt.id) && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span>{opt.name}</span>
                </div>
                <span className="text-primary font-bold">+${opt.price}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600"
            >
              <Minus size={20} />
            </button>
            <span className="font-bold text-lg w-8 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">總計金額</p>
            <p className="text-2xl font-bold text-slate-800">${totalPrice}</p>
          </div>
        </div>
        <button 
          onClick={() => onAddToCart({
            bentoId: bento.id,
            name: bento.name,
            price: bento.price,
            quantity,
            customizations: [selectedRice, ...selectedExtras]
          })}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          加入購物車
        </button>
      </div>
    </motion.div>
  );
};

const CartView = ({ items, onRemove, onCheckout }: { items: OrderItem[], onRemove: (idx: number) => void, onCheckout: (type: Order['type']) => void }) => {
  const total = items.reduce((sum, item) => {
    const itemBase = item.price + item.customizations.reduce((s, c) => s + c.price, 0);
    return sum + (itemBase * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <ShoppingBag size={40} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">購物車是空的</h3>
        <p className="text-sm text-slate-500 mb-8">快去挑選一些健康的便當吧！</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShoppingBag size={18} className="text-primary" />
          訂單內容
        </h3>
        <div className="space-y-6">
          {items.map((item, idx) => {
            const bento = BENTOS.find(b => b.id === item.bentoId);
            return (
              <div key={idx} className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={bento?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/food/200/200';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{item.name} x {item.quantity}</h4>
                    <button onClick={() => onRemove(idx)} className="text-slate-300 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.customizations.map(c => (
                      <span key={c.id} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                        {c.name} {c.price > 0 ? `+$${c.price}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
          <span className="text-slate-500 font-medium">總計</span>
          <span className="text-xl font-bold text-primary">${total}</span>
        </div>
      </div>

      <div className="bg-warm rounded-3xl p-6 border-2 border-primary/10">
        <h3 className="font-bold text-slate-800 mb-4">選擇取餐方式</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onCheckout('delivery')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary transition-all group"
          >
            <Truck size={24} className="text-slate-400 group-hover:text-primary" />
            <span className="text-xs font-bold text-slate-600">外送</span>
          </button>
          <button 
            onClick={() => onCheckout('pickup')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary transition-all group"
          >
            <Store size={24} className="text-slate-400 group-hover:text-primary" />
            <span className="text-xs font-bold text-slate-600">自取</span>
          </button>
          <button 
            onClick={() => onCheckout('pre-order')}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary transition-all group"
          >
            <Clock size={24} className="text-slate-400 group-hover:text-primary" />
            <span className="text-xs font-bold text-slate-600">預約</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Info size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">實體店面諮詢</h4>
            <p className="text-[10px] text-slate-500">台北市大同區承德路一段23號1樓</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
          結帳後將獲得「49元燕麥奶昔體驗券」，歡迎親臨門市進行專業營養諮詢。
        </p>
      </div>
    </div>
  );
};

const MerchantDashboard = ({ orders, bentos, onToggleStock }: { orders: Order[], bentos: Bento[], onToggleStock: (id: string) => void }) => {
  const [view, setView] = useState<'orders' | 'inventory'>('orders');

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button 
          onClick={() => setView('orders')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            view === 'orders' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard size={18} />
          訂單看板
        </button>
        <button 
          onClick={() => setView('inventory')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            view === 'inventory' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'
          }`}
        >
          <Package size={18} />
          庫存管理
        </button>
      </div>

      {view === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 text-slate-400">目前沒有新訂單</div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.type === 'delivery' ? 'bg-blue-100 text-blue-600' : 
                      order.type === 'pickup' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {order.type === 'delivery' ? '外送' : order.type === 'pickup' ? '自取' : '預約'}
                    </span>
                    <h4 className="font-bold text-slate-800 mt-2">#{order.id.slice(-4)} {order.customerName}</h4>
                  </div>
                  <span className="text-xs text-slate-400">{order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="space-y-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{item.name} x {item.quantity}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.customizations.map(c => c.name).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                {order.note && (
                  <div className="bg-red-50 p-3 rounded-xl mb-4 border border-red-100">
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                      <ClipboardCheck size={14} />
                      客製化備註：{order.note}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">拒絕</button>
                  <button className="flex-2 py-3 bg-primary text-white font-bold rounded-xl text-xs">接單出餐</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100">
          {bentos.map(bento => (
            <div key={bento.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
              <img 
                src={bento.image} 
                alt={bento.name} 
                className="w-16 h-16 rounded-2xl object-cover" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/food/200/200';
                }}
              />
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{bento.name}</h4>
                <p className="text-[10px] text-slate-400">${bento.price}</p>
              </div>
              <button 
                onClick={() => onToggleStock(bento.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  bento.inStock 
                    ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                    : 'bg-red-100 text-red-600 border border-red-200'
                }`}
              >
                {bento.inStock ? '供應中' : '已售罄'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderHistoryView = ({ orders }: { orders: Order[] }) => (
  <div className="p-4 space-y-4">
    <h3 className="text-xl font-bold text-slate-800 px-2">訂單紀錄</h3>
    {orders.length === 0 ? (
      <div className="text-center py-20 text-slate-400">目前沒有訂單紀錄</div>
    ) : (
      orders.map(order => (
        <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.type === 'delivery' ? 'bg-blue-100 text-blue-600' : 
                order.type === 'pickup' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {order.type === 'delivery' ? '外送' : order.type === 'pickup' ? '自取' : '預約'}
              </span>
              <h4 className="font-bold text-slate-800 mt-2">#{order.id.slice(-4)}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">{order.createdAt.toLocaleDateString()}</span>
              <span className="text-xs text-slate-400 block">{order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-slate-600">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price + item.customizations.reduce((s, c) => s + c.price, 0)) * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">總計金額</span>
            <span className="font-bold text-primary">${order.total}</span>
          </div>
        </div>
      ))
    )}
  </div>
);

const ProfileView = () => (
  <div className="p-4 space-y-6">
    <div className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
        <User size={32} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800">王小明</h3>
        <p className="text-xs text-slate-400">健康點數：1,250 pts</p>
      </div>
    </div>

    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100">
      <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">通知設定</span>
        </div>
        <ChevronRight size={18} className="text-slate-300" />
      </button>
      <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50">
        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">支付方式</span>
        </div>
        <ChevronRight size={18} className="text-slate-300" />
      </button>
      <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <LogOut size={20} className="text-red-400" />
          <span className="text-sm font-medium text-red-500">登出</span>
        </div>
      </button>
    </div>

    <div className="bg-gradient-to-br from-primary to-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
      <h4 className="font-bold mb-2">專屬營養師諮詢</h4>
      <p className="text-xs opacity-80 mb-4">您還有 2 次免費的線上營養師諮詢額度，快來預約吧！</p>
      <button className="px-4 py-2 bg-white text-primary rounded-xl text-xs font-bold">立即預約</button>
    </div>
  </div>
);

const SuccessModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
        <CheckCircle2 size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">訂單已送出！</h3>
      <p className="text-sm text-slate-500 mb-8">
        獲得「49元燕麥奶昔體驗券」一張。<br/>
        請至門市出示此畫面兌換。
      </p>
      <button 
        onClick={onClose}
        className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-transform"
      >
        太棒了！
      </button>
    </motion.div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [showQuiz, setShowQuiz] = useState(true);
  const [selectedBento, setSelectedBento] = useState<Bento | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bentos, setBentos] = useState<Bento[]>(BENTOS);
  const [filter, setFilter] = useState('全部');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredBentos = useMemo(() => {
    if (filter === '全部') return bentos;
    return bentos.filter(b => b.category === filter);
  }, [bentos, filter]);

  const handleAddToCart = (item: OrderItem) => {
    setCart([...cart, item]);
    setSelectedBento(null);
    setActiveTab('menu');
  };

  const handleCheckout = (type: Order['type']) => {
    const total = cart.reduce((sum, item) => {
      const itemBase = item.price + item.customizations.reduce((s, c) => s + c.price, 0);
      return sum + (itemBase * item.quantity);
    }, 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 11),
      items: cart,
      total,
      status: 'pending',
      type,
      customerName: '王小明',
      createdAt: new Date(),
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('menu');
    setShowSuccess(true);
  };

  const toggleStock = (id: string) => {
    setBentos(bentos.map(b => b.id === id ? { ...b, inStock: !b.inStock } : b));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
      />

      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showQuiz && <HealthQuiz onComplete={() => setShowQuiz(false)} />}
              
              <div className="px-4 py-6">
                <div className="flex overflow-x-auto gap-2 no-scrollbar pb-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        filter === cat 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'bg-white text-slate-500 border border-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 mt-4">
                  {filteredBentos.map(bento => (
                    <BentoCard 
                      key={bento.id} 
                      bento={bento} 
                      onSelect={(b) => b.inStock && setSelectedBento(b)} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cart' && (
            <motion.div 
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CartView 
                items={cart} 
                onRemove={(idx) => setCart(cart.filter((_, i) => i !== idx))}
                onCheckout={handleCheckout}
              />
            </motion.div>
          )}

          {activeTab === 'merchant' && (
            <motion.div 
              key="merchant"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <MerchantDashboard 
                orders={orders} 
                bentos={bentos} 
                onToggleStock={toggleStock} 
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OrderHistoryView orders={orders} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'menu' ? 'text-primary' : 'text-slate-400'}`}
          >
            <Utensils size={20} />
            <span className="text-[10px] font-bold">點餐</span>
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'cart' ? 'text-primary' : 'text-slate-400'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px] font-bold">購物車</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-primary' : 'text-slate-400'}`}
          >
            <History size={20} />
            <span className="text-[10px] font-bold">訂單</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400'}`}
          >
            <User size={20} />
            <span className="text-[10px] font-bold">我的</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {selectedBento && (
          <BentoDetail 
            bento={selectedBento} 
            onClose={() => setSelectedBento(null)} 
            onAddToCart={handleAddToCart}
          />
        )}
        {showSuccess && (
          <SuccessModal onClose={() => setShowSuccess(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
