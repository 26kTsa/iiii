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
    name: '舒肥雞胸健康餐',
    description: '低溫烹調舒肥雞胸，鮮嫩多汁，搭配五色時蔬。',
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
    name: '鹽烤鯖魚便當',
    description: '富含 Omega-3 的挪威鯖魚，簡單鹽烤呈現原味。',
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
    name: '舒肥牛小排餐盒',
    description: '精選牛小排，舒肥後微煎，口感軟嫩。',
    price: 180,
    image: 'https://images.unsplash.com/photo-1621265081194-6535b99274cd?auto=format&fit=crop&q=80&w=800',
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
    name: '蔬食花椰菜米餐',
    description: '全植物性食材，以花椰菜米取代白飯，極低熱量。',
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
    name: '清蒸鱸魚菲力餐',
    description: '肉質細緻的鱸魚菲力，富含優質蛋白質與膠原蛋白，適合長輩。',
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
    name: '起司歐姆蛋元氣餐',
    description: '香濃起司歐姆蛋，搭配地瓜與新鮮水果，均衡營養助成長。',
    price: 110,
    image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d4ec?auto=format&fit=crop&q=80&w=800',
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
    name: '紅藜麥鮭魚營養餐',
    description: '頂級鮭魚搭配超級食物紅藜麥，提供孕期所需的 DHA 與葉酸。',
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
    name: '舒肥牛排能量餐',
    description: '低溫舒肥板腱牛排，鎖住肉汁，搭配大量綠色蔬菜，健身首選。',
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
    name: '和風秋葵山藥餐',
    description: '秋葵與山藥的黏液保護胃壁，搭配清爽和風醬汁，調整腸胃負擔。',
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
  { id: 'r1', name: '白米飯', price: 0, category: 'rice', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=200' },
  { id: 'r2', name: '紫米飯', price: 5, category: 'rice', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=200' },
  { id: 'r3', name: '地瓜', price: 10, category: 'rice', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&q=80&w=200' },
  { id: 'r4', name: '花椰菜米', price: 25, category: 'rice', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=200' },
  { id: 'e1', name: '多一份雞胸肉', price: 40, category: 'extra', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200' },
  { id: 'e2', name: '加一顆溫泉蛋', price: 15, category: 'extra', image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&q=80&w=200' },
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
