import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, MessageCircle, Star, Truck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-orange-500 to-primary-500 text-white rounded-2xl p-8 md:p-12 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">مرحبًا بك في خُردة</h2>
        <p className="text-xl mb-8 opacity-90">
          أول سوق إلكتروني متخصص في بيع وشراء قطع السيارات المستعملة داخل ليبيا
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-white text-orange-500 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          استعرض القطع الآن
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="text-4xl mb-4">
            <Search className="mx-auto text-orange-500" size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-orange-500">بحث ذكي</h3>
          <p className="text-gray-600">
            اكتب نوع القطعة أو السيارة وشاهد العروض المتوفرة
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">
            <MapPin className="mx-auto text-orange-500" size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-orange-500">فلترة ذكية</h3>
          <p className="text-gray-600">
            صفّ النتائج حسب المدينة، النوع، والسعر
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">
            <MessageCircle className="mx-auto text-orange-500" size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-orange-500">تواصل مباشر</h3>
          <p className="text-gray-600">
            راسل البائع واتفق معه بسهولة عبر الموقع
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">
            <Star className="mx-auto text-orange-500" size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-orange-500">تقييمات موثوقة</h3>
          <p className="text-gray-600">
            شوف تقييمات البائعين من زبائن سابقين
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">
            <Truck className="mx-auto text-orange-500" size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-orange-500">توصيل مرن</h3>
          <p className="text-gray-600">
            خدمة توصيل متوفرة مع خيارات دفع عند الاستلام
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">هل أنت تاجر؟ افتح متجرك مجانًا!</h2>
        <p className="text-gray-600 mb-6">
          انضم إلى آلاف التجار الذين يبيعون قطع السيارات عبر منصتنا
        </p>
        <Link 
          to="/auth" 
          className="btn-primary inline-block"
        >
          ابدأ البيع الآن
        </Link>
      </section>
    </div>
  );
};

export default Home;