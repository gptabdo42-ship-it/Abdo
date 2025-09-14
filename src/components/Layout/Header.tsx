import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <h1 className="text-2xl font-bold">خُردة</h1>
          </Link>

          <nav className="flex items-center gap-4 flex-wrap">
            <Link 
              to="/" 
              className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              🏠 الرئيسية
            </Link>
            
            <Link 
              to="/products" 
              className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              🔍 تصفح المنتجات
            </Link>
            
            <Link 
              to="/packages" 
              className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              📦 الباقات
            </Link>

            {user ? (
              <>
                <Link 
                  to="/cart" 
                  className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
                  السلة
                </Link>
                
                {profile?.role === 'merchant' && (
                  <Link 
                    to="/dashboard" 
                    className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Settings size={20} />
                    لوحة التحكم
                  </Link>
                )}
                
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span className="text-sm">{profile?.full_name}</span>
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={20} />
                  خروج
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;