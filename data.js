/* ============================================================
   شركة الصفوة للصناعات الغذائية — كتالوج الماكينات
   ------------------------------------------------------------
   مصدر البيانات: Google Sheet «كتالوج الصفوة»
   ID: 1CAYHoUkvxMkfYWdkR5efCUQ5ZBABZjEuGVslh2B-pNM
   التبويب: «الماكينات»
   أعمدة البيانات مطابقة تمامًا لأعمدة الشيت:
   code / name / category / price / status / description /
   specs / image_url / video_url / capacity
   (capacity = «الطاقة الإنتاجية» — عمود أضيف 2026-11-24 بطلب محمد:
   معلومة سريعة تظهر جنب اسم الماكينة في الكارت)
   في النسخة الأولى (v1) البيانات مدمجة هنا كما هي في الشيت،
   ولاحقًا تُستبدل بجلب حي من Google Apps Script
   (انظر CONFIG.APPS_SCRIPT_URL وملف README.md).
   ============================================================ */

"use strict";

const CONFIG = {
  // رابط الموقع بعد النشر (يُستخدم في أكواد QR). اتركه فارغًا ليُستخدم
  // عنوان الصفحة الحالي تلقائيًا.
  SITE_BASE_URL: "",

  // خطوة 3 (لاحقًا): رابط Google Apps Script Web App الذي سيجلب
  // البيانات من الشيت مباشرة ويسجل الطلبات في تبويب Orders.
  // فارغ الآن — الموقع يعمل بالبيانات المدمجة في MACHINES.
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbysudBimzZArCrp3raRiWPxV2KlsEGRHw5dTgP7APNdUfBbYgNPKa_j-pUOgKO0em2h5Q/exec",

  // رقم واتساب استقبال طلبات الشركة
  WHATSAPP_INTL: "201010780457",
  WHATSAPP_DISPLAY: "01010780457",

  STORAGE_KEY: "safwa_cart_v1",
  LANG_KEY: "safwa_lang_v1"
};

/* بيانات الماكينات — منقولة حرفيًا من تبويب «الماكينات» في الشيت.
   ملحوظة: image_url في الشيت نص توضيحي وليس رابطًا، لذلك تُرك فارغًا
   هنا ويعرض الموقع لوحات بديلة مرسومة بـ CSS.
   و video_url في الشيت يحتوي رابطين مفصولين بعلامة + . */
const MACHINES = [
  {
    code: "M001",
    name: "ماكينة قفل الأغطية الأوتوماتيك على سير ناقل",
    category: "قفل أغطية",
    capacity: "50-120 أزازة/دقيقة",
    price: "",
    status: "قيد تجميع البيانات",
    description: "قفل أغطية الأزايز (برغي) أوتوماتيك مع تغذية أغطية وشاشة لمس وتحكم PLC وجسم ستانلس 304",
    specs: "السرعة 50-120 أزازة/دقيقة حسب عدد الرؤوس؛ أزايز قطر 22-120 مم وارتفاع 60-280 مم؛ أغطية 15-120 مم؛ نسبة قفل سليم 99%+؛ المواصفات نموذجية للفئة وتُثبت من لوحة بيانات ماكينة الصفوة",
    image_url: "",
    video_url: "https://www.youtube.com/watch?v=9fRBrpyPxFI + https://www.youtube.com/watch?v=TFDjBm77nyY"
  },
  {
    code: "M002",
    name: "ماكينة الشرنك سليف (ليبل شرنك على الأزايز)",
    category: "شرنك سليف",
    capacity: "لحد 150 أزازة/دقيقة",
    price: "",
    status: "قيد تجميع البيانات",
    description: "تركيب ليبل سليف PVC أو PET على الأزازة وانكماشه بالحرارة أو البخار",
    specs: "السرعة لحد 150 أزازة/دقيقة للفئة؛ سمك الليبل 0.04-0.05 مم؛ قطر الأزازة 50-110 مم وارتفاعها 150-310 مم؛ المواصفات نموذجية للفئة وتُثبت من لوحة البيانات",
    image_url: "",
    video_url: "https://www.youtube.com/watch?v=PjRzBtZSxFE + https://www.youtube.com/watch?v=Ki9O1aiBJ8I"
  },
  {
    code: "M003",
    name: "خط الشرنك الحراري (لحام L + نفق شرنك)",
    category: "شرنك حراري",
    capacity: "20-25 عبوة/دقيقة",
    price: "",
    status: "قيد تجميع البيانات",
    description: "لحام وقطع فيلم على شكل L ثم نفق حراري لانكماش الفيلم على المنتج",
    specs: "السرعة 20-25 عبوة/دقيقة؛ الفيلم POF أو PE أو PVC؛ أقصى مقاس عبوة تقريبا 400x300x120 مم؛ حرارة النفق 150-260 درجة؛ المواصفات نموذجية للفئة وتُثبت من لوحة البيانات",
    image_url: "",
    video_url: "https://www.youtube.com/watch?v=1Dzw5pxLdYc + https://www.youtube.com/watch?v=esoMLNdUjQY"
  }
];

// تصدير للاختبار الآلي (Node) — لا يؤثر على المتصفح
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, MACHINES };
}
