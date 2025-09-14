export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  city?: string;
  role: 'buyer' | 'merchant';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id?: string;
  title: string;
  description?: string;
  condition: 'new' | 'used';
  price: number;
  city: string;
  brand?: string;
  model?: string;
  year?: number;
  part_number?: string;
  is_available: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  seller?: User;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  product_id?: string;
  content: string;
  status: 'unread' | 'read';
  created_at: string;
  sender?: User;
  recipient?: User;
  product?: Product;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  price: number;
  max_products: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  status: 'active' | 'expired' | 'cancelled';
  started_at: string;
  expires_at?: string;
  products_used: number;
  created_at: string;
  updated_at: string;
  package?: SubscriptionPackage;
}