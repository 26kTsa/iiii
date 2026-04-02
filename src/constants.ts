export interface Bento {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  tags: string[];
  category: string;
  inStock: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  category: 'rice' | 'side' | 'extra';
  image?: string;
  description?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  type: 'delivery' | 'pickup' | 'pre-order';
  customerName: string;
  note?: string;
  createdAt: Date;
}

export interface OrderItem {
  bentoId: string;
  name: string;
  price: number;
  quantity: number;
  customizations: CustomizationOption[];
}

export const BENTOS: Bento[] = [
  {
    id: '1',
    name: '嫩煎舒肥雞胸餐盒',
    description: '低溫烹調舒肥雞胸，鮮嫩多汁不乾柴，搭配五色時蔬與特製配菜。',
    price: 130,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    calories: 450,
    protein: 35,
    fat: 12,
    carbs: 50,
    tags: ['增肌減脂', '高蛋白'],
    category: '增肌減脂',
    inStock: true,
  },
  {
    id: '2',
    name: '挪威鹽烤鯖魚餐盒',
    description: '富含 Omega-3 的挪威鯖魚，簡單鹽烤呈現鮮甜原味，皮脆肉嫩。',
    price: 140,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800',
    calories: 520,
    protein: 28,
    fat: 22,
    carbs: 45,
    tags: ['調整腸胃', '低 GI'],
    category: '調整腸胃',
    inStock: true,
  },
  {
    id: '3',
    name: '厚切舒肥牛小排餐盒',
    description: '精選厚切牛小排，舒肥後高溫微煎鎖住肉汁，口感軟嫩富有彈性。',
    price: 180,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    calories: 580,
    protein: 32,
    fat: 28,
    carbs: 48,
    tags: ['增肌減脂', '高蛋白'],
    category: '增肌減脂',
    inStock: true,
  },
  {
    id: '4',
    name: '輕食花椰菜米蔬食餐',
    description: '全植物性食材，以新鮮花椰菜米取代白飯，極低熱量且富有飽足感。',
    price: 120,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800',
    calories: 280,
    protein: 12,
    fat: 8,
    carbs: 35,
    tags: ['低 GI', '調整腸胃'],
    category: '調整腸胃',
    inStock: true,
  },
  {
    id: '5',
    name: '鮮嫩清蒸鱸魚菲力餐',
    description: '肉質細緻的鱸魚菲力，清蒸保留最純粹的鮮味，富含優質蛋白質。',
    price: 160,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    calories: 420,
    protein: 30,
    fat: 10,
    carbs: 45,
    tags: ['銀髮族保養', '高蛋白'],
    category: '銀髮族保養',
    inStock: true,
  },
  {
    id: '6',
    name: '起司歐姆蛋活力餐盒',
    description: '香濃起司歐姆蛋，搭配綿密地瓜與新鮮時蔬，均衡營養開啟活力一天。',
    price: 110,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    calories: 480,
    protein: 22,
    fat: 18,
    carbs: 55,
    tags: ['兒童健康長高', '均衡營養'],
    category: '兒童健康長高',
    inStock: true,
  },
  {
    id: '7',
    name: '紅藜麥香煎鮭魚餐盒',
    description: '頂級鮭魚搭配超級食物紅藜麥，提供豐富的 DHA 與優質油脂。',
    price: 190,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    calories: 550,
    protein: 34,
    fat: 24,
    carbs: 42,
    tags: ['孕期營養', 'Omega-3'],
    category: '孕期營養',
    inStock: true,
  },
  {
    id: '8',
    name: '板腱牛排健身能量餐',
    description: '低溫舒肥板腱牛排，搭配大量綠色蔬菜與複合碳水，健身愛好者首選。',
    price: 210,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    calories: 620,
    protein: 45,
    fat: 28,
    carbs: 38,
    tags: ['運動健身', '高蛋白'],
    category: '運動營養補充',
    inStock: true,
  },
  {
    id: '9',
    name: '和風山藥秋葵養生餐',
    description: '秋葵與山藥的天然黏液保護胃壁，搭配清爽和風醬汁，輕盈無負擔。',
    price: 125,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    calories: 320,
    protein: 15,
    fat: 6,
    carbs: 52,
    tags: ['調整腸胃', '高纖'],
    category: '調整腸胃',
    inStock: true,
  },
];

export const CUSTOMIZATIONS: CustomizationOption[] = [
  { 
    id: 'r1', 
    name: '白米飯', 
    price: 0, 
    category: 'rice', 
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=200',
    description: '嚴選在地良質米，口感Q彈香甜，是傳統餐盒的最佳拍檔。'
  },
  { 
    id: 'r2', 
    name: '紫米飯', 
    price: 5, 
    category: 'rice', 
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=200',
    description: '富含花青素與維生素E，低GI且具飽足感，健康養生的首選。'
  },
  { 
    id: 'r3', 
    name: '地瓜', 
    price: 10, 
    category: 'rice', 
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400',
    description: '高營養根莖類主食，富含膳食纖維、β-胡蘿蔔素與鉀，能促進腸道蠕動、保護心血管。建議連皮享用以保留最多營養。'
  },
  { 
    id: 'r4', 
    name: '花椰菜米', 
    price: 25, 
    category: 'rice', 
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=200',
    description: '極低熱量替代方案，適合嚴格控醣與生酮飲食者，清爽無負擔。'
  },
  { 
    id: 'e1', 
    name: '多一份雞胸肉', 
    price: 40, 
    category: 'extra', 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200',
    description: '增肌必備！額外提供 100g 舒肥雞胸肉，補充優質蛋白質。'
  },
  { 
    id: 'e2', 
    name: '加一顆溫泉蛋', 
    price: 15, 
    category: 'extra', 
    image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&q=80&w=200',
    description: '滑嫩溫泉蛋，蛋黃濃郁，為餐盒增添豐富層次感。'
  },
];

export const CATEGORIES = [
  '全部',
  '增肌減脂',
  '調整腸胃',
  '運動營養補充',
  '孕期營養',
  '銀髮族保養',
  '兒童健康長高',
];
