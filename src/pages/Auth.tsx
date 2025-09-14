import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    city: '',
    role: 'buyer' as 'buyer' | 'merchant'
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          phone: formData.phone,
          city: formData.city,
          role: formData.role
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">المدينة</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="طرابلس، بنغازي، مصراتة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نوع الحساب</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="buyer">مشتري</option>
                  <option value="merchant">تاجر</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {isLogin ? 'دخول' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? 'ما عندكش حساب؟' : 'عندك حساب؟'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-500 font-semibold mr-2 hover:underline"
            >
              {isLogin ? 'سجّل الآن' : 'سجّل الدخول'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;