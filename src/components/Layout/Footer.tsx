import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              خُردة
            </h3>
            <p className="text-gray-300">
              أول سوق إلكتروني متخصص في بيع وشراء قطع السيارات المستعملة داخل ليبيا
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط مهمة</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-white transition-colors">من نحن</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">اتصل بنا</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 091-234-5678</p>
              <p>📧 info@khurda.ly</p>
              <p>📍 طرابلس، ليبيا</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>© 2025 خُردة — السوق الليبي لقطع السيارات المستعملة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;