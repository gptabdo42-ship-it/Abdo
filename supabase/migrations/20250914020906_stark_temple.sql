/*
  # إنشاء قاعدة البيانات الأساسية لموقع خُردة

  1. الجداول الجديدة
    - `profiles` - ملفات المستخدمين
    - `categories` - فئات المنتجات
    - `products` - المنتجات
    - `product_images` - صور المنتجات
    - `cart_items` - عناصر السلة
    - `messages` - الرسائل بين المستخدمين
    - `subscription_packages` - باقات الاشتراك
    - `user_subscriptions` - اشتراكات المستخدمين

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة

  3. الفهارس
    - إضافة فهارس لتحسين الأداء
*/

-- إنشاء الأنواع المخصصة
CREATE TYPE user_role AS ENUM ('buyer', 'merchant');
CREATE TYPE product_condition AS ENUM ('new', 'used');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE message_status AS ENUM ('unread', 'read');

-- دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  city text,
  role user_role DEFAULT 'buyer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- جدول الفئات
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text,
  condition product_condition DEFAULT 'used',
  price numeric(10,2) NOT NULL,
  city text NOT NULL,
  brand text,
  model text,
  year integer,
  part_number text,
  is_available boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- جدول صور المنتجات
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- جدول عناصر السلة
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- جدول الرسائل
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  content text NOT NULL,
  status message_status DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

-- جدول باقات الاشتراك
CREATE TABLE IF NOT EXISTS subscription_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  description text,
  description_ar text,
  price numeric(10,2) DEFAULT 0,
  max_products integer DEFAULT 0,
  duration_days integer DEFAULT 0,
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- جدول اشتراكات المستخدمين
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  package_id uuid REFERENCES subscription_packages(id),
  status subscription_status DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  products_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_city ON products(city);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- تفعيل RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للملفات الشخصية
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- سياسات الأمان للفئات
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- سياسات الأمان للمنتجات
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Merchants can insert products"
  ON products FOR INSERT
  TO public
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Merchants can update own products"
  ON products FOR UPDATE
  TO public
  USING (auth.uid() = seller_id);

CREATE POLICY "Merchants can delete own products"
  ON products FOR DELETE
  TO public
  USING (auth.uid() = seller_id);

-- سياسات الأمان لصور المنتجات
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Product owners can manage images"
  ON product_images FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.seller_id = auth.uid()
    )
  );

-- سياسات الأمان لعناصر السلة
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO public
  USING (auth.uid() = user_id);

-- سياسات الأمان للرسائل
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO public
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update message status"
  ON messages FOR UPDATE
  TO public
  USING (auth.uid() = recipient_id);

-- سياسات الأمان لباقات الاشتراك
CREATE POLICY "Anyone can view active subscription packages"
  ON subscription_packages FOR SELECT
  TO public
  USING (is_active = true);

-- سياسات الأمان لاشتراكات المستخدمين
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON user_subscriptions FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

-- إنشاء المشغلات
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- دالة لإنشاء ملف شخصي عند التسجيل
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- مشغل لإنشاء الملف الشخصي
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();