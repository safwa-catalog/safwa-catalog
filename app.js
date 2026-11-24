/* ============================================================
   شركة الصفوة للصناعات الغذائية — كتالوج الماكينات (v1)
   منطق الواجهة: عرض الماكينات + بحث + تصفية + تفاصيل + QR +
   سلة طلب عبر واتساب. البيانات من data.js (MACHINES / CONFIG).
   ============================================================ */

"use strict";

/* ---------- قاموس الترجمة (واجهة المستخدم فقط — بيانات الماكينات كما هي) ---------- */
const I18N = {
  ar: {
    companyName: "شركة الصفوة للصناعات الغذائية",
    tagline: "ماكينات تعبئة وتغليف — جودة تصنع الثقة",
    cart: "سلة الطلب",
    searchPlaceholder: "ابحث عن ماكينة…",
    noResults: "لا توجد نتائج مطابقة لبحثك.",
    all: "الكل",
    details: "التفاصيل",
    addToCart: "أضف للسلة",
    capacity: "الطاقة الإنتاجية",
    priceOnRequest: "السعر عند الطلب",
    specs: "المواصفات الفنية",
    videos: "فيديوهات الماكينة",
    qrTitle: "امسح الرمز لفتح صفحة هذه الماكينة مباشرة",
    shareLink: "رابط الماكينة",
    cartTitle: "سلة الطلب",
    emptyCart: "السلة فارغة — أضف ماكينات من الكتالوج.",
    remove: "حذف",
    fullName: "الاسم بالكامل",
    phone: "رقم الهاتف",
    notes: "ملاحظات (اختياري)",
    confirmOrder: "تأكيد الطلب",
    confirmNote: "عند تأكيد الطلب سيتم فتح واتساب لإرسال طلبك مباشرة إلى الشركة.",
    orderDone: "تم تجهيز طلبك وفتحه في واتساب — شكرًا لتواصلك معنا.",
    inquire: "استفسر عنها واتساب",
    share: "شارك الماكينة",
    related: "ماكينات تانية ممكن تهمك",
    browse: "تصفح الماكينات",
    aboutTitle: "عن شركة الصفوة",
    aboutText: "شركة الصفوة للصناعات الغذائية متخصصة في ماكينات التعبئة والتغليف وخطوط الإنتاج. الكتالوج ده بيتحدث تلقائيًا — أي ماكينة جديدة بتنزل فيه فورًا — والأسعار عند الطلب، والتفاصيل الكاملة والطلب من خلال واتساب.",
    statMachines: "ماكينة في الكتالوج",
    statCats: "قسم رئيسي",
    statWa: "طلب واستفسار واتساب",
    statLive: "تحديث تلقائي مباشر",
    catInfoCapping: "ماكينات قفل وبرشمة أغطية الأزايز أوتوماتيك على سير ناقل — سرعات تناسب خطوط الإنتاج الصغيرة والكبيرة.",
    catInfoSleeve: "ماكينات تركيب ليبل الشرنك سليف على الأزايز والعبوات وانكماشه بالحرارة أو البخار لمظهر احترافي وحماية من العبث.",
    catInfoShrink: "خطوط التغليف بالشرنك الحراري: لحام وقطع الفيلم ونفق انكماش لتغليف العبوات والمنتجات بشكل محكم.",
    howTitle: "إزاي تطلب؟",
    how1: "اختار الماكينة من الكتالوج",
    how2: "ضيفها لسلة الطلب",
    how3: "أكد الطلب وهنرد عليك على واتساب",
    footerOrder: "للطلب والاستفسار عبر واتساب:",
    waHeader: "طلب جديد من كتالوج شركة الصفوة للصناعات الغذائية",
    waName: "الاسم",
    waPhone: "الهاتف",
    waNotes: "ملاحظات",
    waItems: "الماكينات المطلوبة:",
    langButton: "English"
  },
  en: {
    companyName: "El Safwa Food Industries Co.",
    tagline: "Filling & packaging machines — quality that builds trust",
    cart: "Order Cart",
    searchPlaceholder: "Search for a machine…",
    noResults: "No machines match your search.",
    all: "All",
    details: "Details",
    addToCart: "Add to Cart",
    capacity: "Capacity",
    priceOnRequest: "Price on request",
    specs: "Technical Specifications",
    videos: "Machine Videos",
    qrTitle: "Scan to open this machine's page directly",
    shareLink: "Machine link",
    cartTitle: "Order Cart",
    emptyCart: "Your cart is empty — add machines from the catalog.",
    remove: "Remove",
    fullName: "Full name",
    phone: "Phone number",
    notes: "Notes (optional)",
    confirmOrder: "Confirm Order",
    confirmNote: "Confirming opens WhatsApp to send your order directly to the company.",
    orderDone: "Your order was prepared and opened in WhatsApp — thank you.",
    inquire: "Ask about it on WhatsApp",
    share: "Share this machine",
    related: "Other machines you may like",
    browse: "Browse machines",
    aboutTitle: "About El Safwa",
    aboutText: "El Safwa Food Industries specializes in filling & packaging machines and production lines. This catalog updates automatically — every new machine appears instantly — prices are on request, and full details and ordering are via WhatsApp.",
    statMachines: "machines in catalog",
    statCats: "main categories",
    statWa: "WhatsApp orders & inquiries",
    statLive: "live auto-updates",
    catInfoCapping: "Automatic bottle capping machines on conveyors — speeds for small and large production lines.",
    catInfoSleeve: "Shrink sleeve label applicators for bottles and containers, heat or steam shrunk for a professional, tamper-evident finish.",
    catInfoShrink: "Heat shrink wrapping lines: L-bar sealing and shrink tunnels for tight, clean packaging.",
    howTitle: "How to order",
    how1: "Pick a machine from the catalog",
    how2: "Add it to the order cart",
    how3: "Confirm and we reply on WhatsApp",
    footerOrder: "Order & inquiries via WhatsApp:",
    waHeader: "New order from El Safwa Food Industries catalog",
    waName: "Name",
    waPhone: "Phone",
    waNotes: "Notes",
    waItems: "Requested machines:",
    langButton: "العربية"
  }
};

/* أيقونات وألوان البطاقات حسب التصنيف */
const CATEGORY_STYLE = [
  { match: "قفل", icon: "⚙️", cls: "media-capping" },
  { match: "سليف", icon: "🏷️", cls: "media-sleeve" },
  { match: "حراري", icon: "📦", cls: "media-shrink" }
];
function categoryStyle(category) {
  for (const s of CATEGORY_STYLE) if ((category || "").includes(s.match)) return s;
  return { icon: "🏭", cls: "media-default" };
}

/* وصف قصير لكل قسم (يظهر عند اختيار القسم) */
const CATEGORY_INFO = [
  { match: "قفل", key: "catInfoCapping" },
  { match: "سليف", key: "catInfoSleeve" },
  { match: "حراري", key: "catInfoShrink" }
];
function categoryInfoText(category) {
  for (const s of CATEGORY_INFO) if ((category || "").includes(s.match)) return t(s.key);
  return "";
}

/* أرقام حقيقية من البيانات الحالية (تتحدث مع الجلب الحي) */
function updateStats() {
  const sm = document.getElementById("statMachinesNum");
  if (sm) sm.textContent = machinesData.length;
  const sc = document.getElementById("statCatsNum");
  if (sc) {
    const cats = [];
    for (const m of machinesData) if (!cats.includes(m.category)) cats.push(m.category);
    sc.textContent = cats.length;
  }
  const ci = document.getElementById("catInfo");
  if (ci) {
    const txt = state.category === "ALL" ? "" : categoryInfoText(state.category);
    ci.textContent = txt;
    ci.hidden = !txt;
  }
}

/* ---------- الحالة العامة ---------- */
const state = {
  lang: "ar",
  category: "ALL",
  query: "",
  cart: {} // code -> qty
};

function t(key) { return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key; }

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* مصدر البيانات الفعلي: يبدأ بالبيانات المدمجة، ويُستبدل بالبيانات
   الحية من الشيت لو نجح الجلب (انظر loadLiveMachines بالأسفل). */
let machinesData = (typeof MACHINES !== "undefined" ? MACHINES.slice() : []);

function machineByCode(code) { return machinesData.find(m => m.code === code) || null; }

/* استخراج روابط الفيديو من حقل video_url (رابط أو أكثر مفصولة بـ +) */
function videoIds(machine) {
  const ids = [];
  const raw = String(machine.video_url || "");
  for (const part of raw.split("+")) {
    const m = part.trim().match(/[?&]v=([\w-]{6,})/);
    if (m) ids.push(m[1]);
  }
  return ids;
}

function specsList(machine) {
  return String(machine.specs || "").split("؛").map(s => s.trim()).filter(Boolean);
}

function machinePageUrl(code) {
  const base = CONFIG.SITE_BASE_URL ||
    (typeof location !== "undefined" ? location.href.split(/[?#]/)[0] : "");
  return base + "?m=" + encodeURIComponent(code);
}

/* ---------- السلة (localStorage) ---------- */
function loadCart() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    state.cart = raw ? JSON.parse(raw) : {};
  } catch (e) { state.cart = {}; }
}
function saveCart() {
  try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.cart)); } catch (e) {}
}
function cartCount() { return Object.values(state.cart).reduce((a, b) => a + b, 0); }
function addToCart(code, qty) {
  state.cart[code] = (state.cart[code] || 0) + (qty || 1);
  saveCart(); renderCartBadge();
}
function setQty(code, qty) {
  if (qty <= 0) delete state.cart[code]; else state.cart[code] = qty;
  saveCart(); renderCartBadge(); renderCartItems();
}

/* ---------- العرض ---------- */
function renderStaticTexts() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
  document.getElementById("langToggle").textContent = t("langButton");
  const fw = document.getElementById("footerWhatsapp");
  fw.href = "https://wa.me/" + CONFIG.WHATSAPP_INTL;
}

function renderFilters() {
  const cats = [];
  for (const m of machinesData) if (!cats.includes(m.category)) cats.push(m.category);
  const box = document.getElementById("categoryFilters");
  box.innerHTML = "";
  const mk = (value, label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (state.category === value ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => { state.category = value; renderFilters(); renderGrid(); });
    box.appendChild(b);
  };
  mk("ALL", t("all"));
  cats.forEach(c => mk(c, c));
}

function filteredMachines() {
  const q = state.query.trim().toLowerCase();
  return machinesData.filter(m => {
    if (state.category !== "ALL" && m.category !== state.category) return false;
    if (!q) return true;
    return (m.name + " " + m.description + " " + m.category + " " + m.code)
      .toLowerCase().includes(q);
  });
}

/* وسائط الكارت: صورة حقيقية لو image_url رابطًا، وإلا اللوحة المرسومة */
function mediaHtml(m, st, extraCls) {
  const url = String(m.image_url || "").trim();
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("images/") || url.startsWith("/")) {
    return '<div class="card-media ' + (extraCls || "") + '">' +
      '<img class="media-img" src="' + esc(url) + '" alt="' + esc(m.name) + '" loading="lazy">' +
      '<span class="media-cat">' + esc(m.category) + "</span></div>";
  }
  return '<div class="card-media ' + st.cls + " " + (extraCls || "") + '">' +
    '<span class="media-icon">' + st.icon + "</span>" +
    '<span class="media-cat">' + esc(m.category) + "</span></div>";
}

function priceHtml(m) {
  if (m.price && String(m.price).trim() !== "") {
    return '<span class="price">' + esc(m.price) + "</span>";
  }
  return '<span class="price price-on-request">' + esc(t("priceOnRequest")) + "</span>";
}

function renderGrid() {
  updateStats();
  const grid = document.getElementById("machinesGrid");
  const list = filteredMachines();
  document.getElementById("noResults").hidden = list.length > 0;
  grid.innerHTML = "";
  for (const m of list) {
    const st = categoryStyle(m.category);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      mediaHtml(m, st, "") +
      '<div class="card-body">' +
        "<h3>" + esc(m.name) + "</h3>" +
        (m.capacity ? '<p class="card-capacity">' + esc(t("capacity")) + ": " + esc(m.capacity) + "</p>" : "") +
        '<p class="card-desc">' + esc(m.description) + "</p>" +
        '<div class="card-meta">' + priceHtml(m) +
          '<span class="tag tag-status">' + esc(m.status) + "</span></div>" +
        '<div class="card-actions">' +
          '<button class="btn btn-outline" data-act="details">' + esc(t("details")) + "</button>" +
          '<button class="btn btn-primary" data-act="add">' + esc(t("addToCart")) + "</button>" +
        "</div>" +
      "</div>";
    card.addEventListener("click", () => openDetail(m.code));
    card.querySelector('[data-act="details"]').addEventListener("click", ev => {
      ev.stopPropagation(); openDetail(m.code);
    });
    card.querySelector('[data-act="add"]').addEventListener("click", ev => {
      ev.stopPropagation(); addToCart(m.code, 1);
    });
    grid.appendChild(card);
  }
}

/* ---------- تفاصيل الماكينة ---------- */
function openDetail(code) {
  const m = machineByCode(code);
  if (!m) return;
  const st = categoryStyle(m.category);
  const url = machinePageUrl(m.code);
  let videos = "";
  const ids = videoIds(m);
  if (ids.length) {
    videos = '<div class="detail-section-title">' + esc(t("videos")) + "</div>" +
      ids.map(id =>
        '<div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/' +
        esc(id) + '" title="YouTube video" loading="lazy" ' +
        'allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>'
      ).join("");
  }
  const specs = specsList(m).map(s => "<li>" + esc(s) + "</li>").join("");
  const qrSvg = qrCodeSvg(url, 5);
  const waText = encodeURIComponent(
    (state.lang === "ar" ? "عاوز استفسر عن ماكينة: " : "I want to ask about: ") +
    m.name + " (" + m.code + ")\n" + url);
  const related = machinesData
    .filter(x => x.code !== m.code)
    .sort((a, b) => (b.category === m.category) - (a.category === m.category))
    .slice(0, 3);
  const relatedHtml = related.length ?
    '<div class="detail-section-title">' + esc(t("related")) + "</div>" +
    '<div class="related-row">' + related.map(x =>
      '<button class="related-chip" data-rel="' + esc(x.code) + '" type="button">' + esc(x.name) + "</button>"
    ).join("") + "</div>" : "";
  document.getElementById("detailContent").innerHTML =
    mediaHtml(m, st, "detail-media") +
    '<h2 id="detailName">' + esc(m.name) + "</h2>" +
    '<div class="card-meta">' + priceHtml(m) +
      '<span class="tag">' + esc(m.code) + "</span>" +
      '<span class="tag tag-status">' + esc(m.status) + "</span></div>" +
    (m.capacity ? '<p class="card-capacity">' + esc(t("capacity")) + ": " + esc(m.capacity) + "</p>" : "") +
    '<p class="detail-desc">' + esc(m.description) + "</p>" +
    '<div class="detail-section-title">' + esc(t("specs")) + "</div>" +
    '<ul class="specs-list">' + specs + "</ul>" +
    videos +
    '<div class="detail-actions">' +
      '<button class="btn btn-primary" id="detailAdd">' + esc(t("addToCart")) + "</button>" +
      '<a class="btn btn-outline" target="_blank" rel="noopener" href="https://wa.me/' +
        CONFIG.WHATSAPP_INTL + "?text=" + waText + '">' + esc(t("inquire")) + "</a>" +
    "</div>" +
    relatedHtml +
    '<div class="qr-box">' +
      '<p class="qr-title">' + esc(t("qrTitle")) + "</p>" +
      (qrSvg || "") +
      '<p class="qr-link">' + esc(t("shareLink")) + ': <a href="' + esc(url) + '">' + esc(url) + "</a></p>" +
      '<p class="qr-link"><a target="_blank" rel="noopener" href="https://wa.me/?text=' + waText + '">' + esc(t("share")) + "</a></p>" +
    "</div>";
  document.getElementById("detailAdd").addEventListener("click", () => addToCart(m.code, 1));
  document.querySelectorAll("[data-rel]").forEach(b =>
    b.addEventListener("click", () => openDetail(b.getAttribute("data-rel"))));
  document.getElementById("detailOverlay").hidden = false;
}
function closeDetail() { document.getElementById("detailOverlay").hidden = true; }

/* ---------- واجهة السلة ---------- */
function renderCartBadge() {
  const badge = document.getElementById("cartCount");
  const n = cartCount();
  badge.textContent = n;
  badge.hidden = n === 0;
}

function renderCartItems() {
  const box = document.getElementById("cartItems");
  const codes = Object.keys(state.cart);
  if (!codes.length) {
    box.innerHTML = '<p class="cart-empty">' + esc(t("emptyCart")) + "</p>";
    return;
  }
  box.innerHTML = "";
  for (const code of codes) {
    const m = machineByCode(code);
    if (!m) continue;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML =
      '<span class="ci-name">' + esc(m.name) + "</span>" +
      '<span class="qty-ctrl">' +
        '<button class="qty-btn" data-q="-1" type="button">−</button>' +
        '<span class="qty-val">' + state.cart[code] + "</span>" +
        '<button class="qty-btn" data-q="1" type="button">+</button>' +
      "</span>" +
      '<button class="ci-remove" type="button">' + esc(t("remove")) + "</button>";
    row.querySelector('[data-q="-1"]').addEventListener("click", () => setQty(code, state.cart[code] - 1));
    row.querySelector('[data-q="1"]').addEventListener("click", () => setQty(code, state.cart[code] + 1));
    row.querySelector(".ci-remove").addEventListener("click", () => setQty(code, 0));
    box.appendChild(row);
  }
}

function openCart() { renderCartItems(); document.getElementById("cartOverlay").hidden = false; }
function closeCart() { document.getElementById("cartOverlay").hidden = true; }

function submitOrder(ev) {
  ev.preventDefault();
  const codes = Object.keys(state.cart);
  if (!codes.length) return;
  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const notes = document.getElementById("coNotes").value.trim();
  const lines = [t("waHeader"), t("waName") + ": " + name, t("waPhone") + ": " + phone];
  if (notes) lines.push(t("waNotes") + ": " + notes);
  lines.push("——————", t("waItems"));
  codes.forEach((code, i) => {
    const m = machineByCode(code);
    lines.push((i + 1) + ") " + code + " — " + (m ? m.name : code) + " × " + state.cart[code]);
  });
  const url = "https://wa.me/" + CONFIG.WHATSAPP_INTL + "?text=" + encodeURIComponent(lines.join("\n"));
  document.getElementById("orderDone").hidden = false;
  window.open(url, "_blank");

  // تسجيل الطلب أيضًا في تبويب «الطلبات» بالشيت (لو الرابط الحي متاح) —
  // خطوة جانبية لا تعطّل فتح واتساب أبدًا
  if (CONFIG.APPS_SCRIPT_URL) {
    try {
      const itemsText = codes.map((code, i) => {
        const mm = machineByCode(code);
        return (i + 1) + ") " + code + " — " + (mm ? mm.name : code) + " × " + state.cart[code];
      }).join("\n");
      const body = new URLSearchParams({
        order: JSON.stringify({ name: name, phone: phone, notes: notes, items: itemsText, count: cartCount() })
      });
      fetch(CONFIG.APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", body: body });
    } catch (e) {}
  }
}

/* ---------- اللغة ---------- */
function applyLang(lang) {
  state.lang = lang === "en" ? "en" : "ar";
  try { localStorage.setItem(CONFIG.LANG_KEY, state.lang); } catch (e) {}
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  renderStaticTexts(); renderFilters(); renderGrid(); renderCartBadge(); renderCartItems();
}

/* ---------- التهيئة ---------- */
function init() {
  let savedLang = "ar";
  try { savedLang = localStorage.getItem(CONFIG.LANG_KEY) || "ar"; } catch (e) {}
  loadCart();
  applyLang(savedLang);

  document.getElementById("langToggle").addEventListener("click", () => {
    applyLang(state.lang === "ar" ? "en" : "ar");
  });
  document.getElementById("searchInput").addEventListener("input", ev => {
    state.query = ev.target.value; renderGrid();
  });
  document.getElementById("cartButton").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("detailClose").addEventListener("click", closeDetail);
  document.getElementById("cartOverlay").addEventListener("click", ev => {
    if (ev.target.id === "cartOverlay") closeCart();
  });
  document.getElementById("detailOverlay").addEventListener("click", ev => {
    if (ev.target.id === "detailOverlay") closeDetail();
  });
  document.getElementById("checkoutForm").addEventListener("submit", submitOrder);
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") { closeDetail(); closeCart(); }
  });

  // رابط مباشر: ?m=CODE يفتح تفاصيل الماكينة (هو ما تشير إليه أكواد QR المطبوعة)
  const code = new URLSearchParams(location.search).get("m");
  if (code && machineByCode(code)) openDetail(code);

  // الجلب الحي من الشيت: أي سطر جديد في الشيت يظهر هنا تلقائيًا
  loadLiveMachines();
}

/* ---------- الجلب الحي من الشيت (JSONP عبر Apps Script) ---------- */
function normalizeMachine(row) {
  const m = {};
  const keys = ["code", "name", "category", "price", "status", "description",
                "specs", "image_url", "video_url", "capacity"];
  for (const k of keys) m[k] = row && row[k] != null ? String(row[k]).trim() : "";
  return m;
}

function loadLiveMachines() {
  if (!CONFIG.APPS_SCRIPT_URL || typeof document === "undefined") return;
  const cbName = "__safwaFeed_" + Date.now();
  const script = document.createElement("script");
  let settled = false;
  const cleanup = () => {
    try { delete window[cbName]; } catch (e) { window[cbName] = undefined; }
    if (script.parentNode) script.parentNode.removeChild(script);
  };
  window[cbName] = function (payload) {
    if (settled) return;
    settled = true; cleanup();
    if (payload && payload.ok && Array.isArray(payload.machines) && payload.machines.length) {
      machinesData = payload.machines.map(normalizeMachine).filter(m => m.code);
      renderFilters(); renderGrid(); renderCartItems();
    }
  };
  script.onerror = function () { if (!settled) { settled = true; cleanup(); } };
  script.src = CONFIG.APPS_SCRIPT_URL +
    (CONFIG.APPS_SCRIPT_URL.includes("?") ? "&" : "?") + "callback=" + cbName;
  document.head.appendChild(script);
  setTimeout(function () { if (!settled) { settled = true; cleanup(); } }, 8000);
}

/* ---------- بدء التشغيل (في نهاية الملف حتى تُعرَّف كل الدوال والثوابت قبل init) ---------- */
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
