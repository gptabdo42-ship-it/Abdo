import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Eye, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles(full_name, city, phone),
          images:product_images(*)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      }

      if (selectedCity) {
        query = query.eq('city', selectedCity);
      }

      if (selectedCondition) {
        query = query.eq('condition', selectedCondition);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCity, selectedCondition]);

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);

    // Increment view count
    try {
      await supabase
        .from('products')
        .update({ views_count: product.views_count + 1 })
        .eq('id', product.id);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const addToCart = async (productId: string) => {
    // This would be implemented with proper cart functionality
    console.log('Add to cart:', productId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">تصفح قطع السيارات</h1>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن قطعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="input-field"
          >
            <option value="">جميع المدن</option>
            <option value="طرابلس">طرابلس</option>
            <option value="بنغازي">بنغازي</option>
            <option value="مصراتة">مصراتة</option>
            <option value="الزاوية">الزاوية</option>
            <option value="زليتن">زليتن</option>
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="input-field"
          >
            <option value="">جميع الحالات</option>
            <option value="new">جديد</option>
            <option value="used">مستعمل</option>
          </select>

          <button
            onClick={fetchProducts}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Filter size={20} />
            بحث
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="card cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="relative">
              <img
                src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Eye size={12} />
                {product.views_count}
              </div>
            </div>

            <h3 className="font-bold text-lg mb-2">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-500 font-bold text-lg">
                {product.price} د.ل
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                product.condition === 'new' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {product.condition === 'new' ? 'جديد' : 'مستعمل'}
              </span>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <MapPin size={16} className="ml-1" />
              {product.city}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد منتجات متطابقة مع البحث</p>
        </div>
      )}

      {/* Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedProduct?.title}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <img
              src={selectedProduct.images?.[0]?.image_url || 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'}
              alt={selectedProduct.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">السعر</h4>
                <p className="text-orange-500 font-bold text-xl">{selectedProduct.price} د.ل</p>
              </div>
              <div>
                <h4 className="font-semibold">الحالة</h4>
                <p>{selectedProduct.condition === 'new' ? 'جديد' : 'مستعمل'}</p>
              </div>
              <div>
                <h4 className="font-semibold">المدينة</h4>
                <p>{selectedProduct.city}</p>
              </div>
              <div>
                <h4 className="font-semibold">البائع</h4>
                <p>{selectedProduct.seller?.full_name}</p>
              </div>
            </div>

            {selectedProduct.description && (
              <div>
                <h4 className="font-semibold mb-2">الوصف</h4>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(selectedProduct.id)}
                className="btn-primary flex-1"
              >
                🛒 إضافة للسلة
              </button>
              <button className="btn-secondary">
                📞 تواصل مع البائع
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;