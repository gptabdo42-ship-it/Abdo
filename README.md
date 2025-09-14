# خُردة - السوق الليبي لقطع السيارات

موقع إلكتروني متخصص في بيع وشراء قطع السيارات المستعملة داخل ليبيا.

## المميزات

- 🔍 **بحث ذكي**: ابحث عن قطع السيارات بسهولة
- 📍 **فلترة حسب المدينة**: اعثر على القطع في مدينتك
- 🤝 **تواصل مباشر**: راسل البائعين مباشرة
- ⭐ **تقييمات موثوقة**: شاهد تقييمات البائعين
- 🚚 **خدمة توصيل**: توصيل مع دفع عند الاستلام
- 💳 **باقات اشتراك**: باقات مختلفة للتجار

## التقنيات المستخدمة

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

## هيكل المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── Layout/         # مكونات التخطيط (Header, Footer)
│   └── UI/             # مكونات واجهة المستخدم
├── hooks/              # React Hooks المخصصة
├── lib/                # المكتبات والإعدادات
├── pages/              # صفحات التطبيق
├── types/              # تعريفات TypeScript
└── App.tsx             # المكون الرئيسي

supabase/
└── migrations/         # ملفات قاعدة البيانات
```

## التشغيل المحلي

1. **تثبيت المتطلبات**:
   ```bash
   npm install
   ```

2. **إعداد Supabase**:
   - أنشئ مشروع جديد في [Supabase](https://supabase.com)
   - انسخ URL و Anon Key
   - أنشئ ملف `.env` وأضف:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **تشغيل التطبيق**:
   ```bash
   npm run dev
   ```

## قاعدة البيانات

### الجداول الرئيسية:

- **profiles**: ملفات المستخدمين
- **products**: المنتجات
- **product_images**: صور المنتجات
- **categories**: فئات المنتجات
- **cart_items**: عناصر السلة
- **messages**: الرسائل بين المستخدمين
- **subscription_packages**: باقات الاشتراك
- **user_subscriptions**: اشتراكات المستخدمين

### الأمان:
- Row Level Security (RLS) مفعل على جميع الجداول
- سياسات أمان شاملة لحماية البيانات
- مصادقة آمنة عبر Supabase Auth

## المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch جديد للميزة
3. Commit التغييرات
4. Push إلى Branch
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## التواصل

- 📧 البريد الإلكتروني: info@khurda.ly
- 📞 الهاتف: 091-234-5678
- 📍 العنوان: طرابلس، ليبيا

---

© 2025 خُردة — السوق الليبي لقطع السيارات المستعملة