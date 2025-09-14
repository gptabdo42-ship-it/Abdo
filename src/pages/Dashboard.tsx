import React, { useState, useEffect } from 'react';
import { Package, Plus, MessageCircle, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Product, Message, UserSubscription } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, sender:profiles(full_name), product:products(title)')
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*, package:subscription_packages(*)')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      setProducts(productsData || []);
      setMessages(messagesData || []);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user || profile?.role !== 'merchant') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">غير مصرح لك بالوصول لهذه الصفحة</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  const tabs = [
    { id: 'products', label: 'منتجاتي', icon: Package },
    { id: 'add', label: 'إضافة منتج', icon: Plus },
    { id: 'messages', label: 'الرسائل', icon: MessageCircle },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold mb-6 text-center">لوحة التحكم</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut size={20} />
                تسجيل خروج
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">مرحباً {profile?.full_name}</h1>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">إجمالي المنتجات</h3>
                  <p className="text-3xl font-bold text-orange-500">{products.length}</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">رسائل جديدة</h3>
                  <p className="text-3xl font-bold text-blue-500">{messages.filter(m => m.status === 'unread').length}</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">المشاهدات</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {products.reduce((sum, p) => sum + p.views_count, 0)}
                  </p>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="card">
                    <img
                      src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'}
                      alt={product.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-bold mb-2">{product.title}</h3>
                    <p className="text-orange-500 font-bold mb-2">{product.price} د.ل</p>
                    <p className="text-gray-600 text-sm mb-4">{product.city}</p>
                    <div className="flex gap-2">
                      <button className="btn-secondary flex-1 text-sm">تعديل</button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">لم تقم بإضافة أي منتجات بعد</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="btn-primary"
                  >
                    أضف منتجك الأول
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">إضافة منتج جديد</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان المنتج</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="مثال: دينمو تويوتا ياريس 2018"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الوصف</label>
                  <textarea
                    className="input-field h-24"
                    placeholder="وصف تفصيلي للمنتج..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر (د.ل)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="350"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المدينة</label>
                    <select className="input-field">
                      <option value="">اختر المدينة</option>
                      <option value="طرابلس">طرابلس</option>
                      <option value="بنغازي">بنغازي</option>
                      <option value="مصراتة">مصراتة</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الحالة</label>
                    <select className="input-field">
                      <option value="used">مستعمل</option>
                      <option value="new">جديد</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الماركة</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="تويوتا، كيا، هيونداي..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">صور المنتج</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  إضافة المنتج
                </button>
              </form>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">رسائل العملاء</h2>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold">{message.sender?.full_name}</h3>
                        <p className="text-sm text-gray-600">
                          حول: {message.product?.title}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        message.status === 'unread' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.status === 'unread' ? 'جديد' : 'مقروء'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{message.content}</p>
                    <div className="flex gap-2">
                      <button className="btn-primary">رد</button>
                      <button className="btn-secondary">حذف</button>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">لا توجد رسائل جديدة</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">تحليلات النشاط</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">إجمالي المشاهدات</h3>
                  <p className="text-3xl font-bold text-orange-500">
                    {products.reduce((sum, p) => sum + p.views_count, 0)}
                  </p>
                </div>
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">المنتجات النشطة</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {products.filter(p => p.is_available).length}
                  </p>
                </div>
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">الرسائل الواردة</h3>
                  <p className="text-3xl font-bold text-blue-500">{messages.length}</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-2">متوسط السعر</h3>
                  <p className="text-3xl font-bold text-purple-500">
                    {products.length > 0 
                      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
                      : 0
                    } د.ل
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">إعدادات الحساب</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={profile?.full_name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="input-field"
                    defaultValue={profile?.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="input-field"
                    defaultValue={profile?.phone}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المدينة</label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={profile?.city}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  حفظ التغييرات
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;