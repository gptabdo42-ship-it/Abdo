import React from 'react';
import { Check } from 'lucide-react';

const Packages: React.FC = () => {
  const packages = [
    {
      id: 'free',
      name: 'الباقة المجانية',
      price: 0,
      duration: 7,
      maxProducts: 30,
      features: [
        'نشر حتى 30 منتج',
        'صور غير محدودة',
        'دعم أساسي'
      ],
      color: 'border-green-500',
      icon: '📦'
    },
    {
      id: 'bronze',
      name: 'الباقة البرونزية',
      price: 29,
      duration: 30,
      maxProducts: 65,
      features: [
        'نشر حتى 65 منتج',
        'صور غير محدودة',
        'ميزة إضافية واحدة',
        'دعم متقدم'
      ],
      color: 'border-amber-600',
      icon: '🥉'
    },
    {
      id: 'silver',
      name: 'الباقة الفضية',
      price: 49,
      duration: 30,
      maxProducts: 100,
      features: [
        'نشر حتى 100 منتج',
        'صور غير محدودة',
        'ظهور مميز في البحث',
        'دعم متقدم'
      ],
      color: 'border-gray-400',
      icon: '🥈'
    },
    {
      id: 'gold',
      name: 'الباقة الذهبية',
      price: 99,
      duration: 30,
      maxProducts: 300,
      features: [
        'نشر حتى 300 منتج',
        'صور غير محدودة',
        '2 إلى 3 مزايا إضافية',
        'ظهور مميز في البحث',
        'دعم VIP'
      ],
      color: 'border-yellow-500',
      icon: '🥇',
      popular: true
    }
  ];

  const handleSubscribe = (packageName: string, price: number) => {
    alert(`سيتم توجيهك لصفحة الدفع للاشتراك في ${packageName} بسعر ${price} د.ل`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">📦 اختر الباقة المناسبة</h1>
        <p className="text-gray-600 text-lg">
          اختر الباقة التي تناسب احتياجاتك وابدأ في بيع منتجاتك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative card hover:scale-105 transition-transform ${pkg.color} border-2 ${
              pkg.popular ? 'ring-4 ring-yellow-200' : ''
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  الأكثر شعبية
                </span>
              </div>
            )}

            <div className="text-center">
              <div className="text-4xl mb-4">{pkg.icon}</div>
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-orange-500">
                  {pkg.price}
                </span>
                <span className="text-gray-600"> د.ل / {pkg.duration} يوم</span>
              </div>

              <ul className="space-y-2 mb-6 text-right">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(pkg.name, pkg.price)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  pkg.popular
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                اشترك الآن
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="card max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-4">📌 ملاحظات هامة</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>كل باقة تبدأ من تاريخ تفعيلها مباشرة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>يمكنك تغيير أو ترقية الباقة في أي وقت</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>الدفع يتم إلكترونيًا أو عن طريق الدعم الفني</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>ننصح بتجربة الباقة المجانية أولاً</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>لأي استفسار أو مساعدة، تواصل معنا عبر واتساب: 091-234-5678</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Packages;