import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { CartItem } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            *,
            images:product_images(*)
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    // Implement checkout logic
    alert('تم إتمام الطلب بنجاح! سيتم التواصل معك قريباً.');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول لعرض السلة</h1>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سلة المشتريات</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">سلتك فارغة حاليًا</p>
          <a href="/products" className="btn-primary">
            تصفح المنتجات
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.images?.[0]?.image_url || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'}
                    alt={item.product?.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.product?.title}</h3>
                    <p className="text-gray-600">{item.product?.city}</p>
                    <p className="text-orange-500 font-bold">
                      {item.product?.price} د.ل
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card h-fit">
            <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
            
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product?.title} × {item.quantity}</span>
                  <span>{(item.product?.price || 0) * item.quantity} د.ل</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>الإجمالي</span>
                <span className="text-orange-500">{getTotalPrice()} د.ل</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary"
              >
                إتمام الطلب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;