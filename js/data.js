/* ============================================================
   FLUSH product data — single source of truth
   ============================================================ */

const MOODS = [
  { id: "pink",  label: "Pink",  hex: "#F2A5B8" },
  { id: "coral", label: "Coral", hex: "#F4785E" },
  { id: "rose",  label: "Rose",  hex: "#CE8490" },
  { id: "berry", label: "Berry", hex: "#B03A62" },
  { id: "nude",  label: "Nude",  hex: "#D4A896" },
];

const FREE_SHIPPING = 30000;

const PRODUCTS = [
  {
    id: "lip-tint",
    category: "lip",
    catLabel: "LIP",
    name: "Glossy Lip Tint",
    nameKo: "글로시 립 틴트",
    price: 12000,
    listPrice: 15000,
    rating: 4.8,
    reviewCount: 1284,
    badge: "BEST",
    isNew: true,
    desc: "물처럼 가볍게 발리고, 젤리처럼 맑게 물드는 립 틴트. 촉촉한 광택이 오래 유지되어 방금 바른 듯한 입술을 만들어 줍니다.",
    descEn: "A lip tint that glides on light as water and stains clear like jelly. Its dewy gloss lasts, keeping lips looking freshly applied.",
    texturePoints: [
      { emoji: "💧", title: "촉촉한 워터 제형", text: "가볍게 스치듯 발라도 입술 위에 맑은 수분막을 남깁니다.", titleEn: "Dewy water texture", textEn: "Even the lightest swipe leaves a clear veil of moisture on your lips." },
      { emoji: "✨", title: "유리알 광택", text: "시간이 지나도 탁해지지 않는 글로시한 윤기가 유지됩니다.", titleEn: "Glassy shine", textEn: "A glossy sheen that stays bright without turning dull over time." },
      { emoji: "🌸", title: "자연스러운 물듦", text: "안쪽부터 은은하게 번지는 그라데이션 발색이 쉽게 완성됩니다.", titleEn: "Natural stain", textEn: "An effortless gradient that blooms softly from the inner lip." },
    ],
    pairsWith: ["cream-blush", "lip-liner"],
    shades: [
      { name: "Coral",      mood: "coral", hex: "#F77A65", img: "assets/products/lip-tint-coral.png" },
      { name: "Cherry",     mood: "berry", hex: "#E6285A", img: "assets/products/lip-tint-cherry.png" },
      { name: "Guava",      mood: "pink",  hex: "#F0A5A5", img: "assets/products/lip-tint-guava.png" },
      { name: "Rose",       mood: "rose",  hex: "#D9A4A4", img: "assets/products/lip-tint-rose.png" },
      { name: "Peach Fizz", mood: "coral", hex: "#F0896B", img: "assets/products/lip-tint-01.png" },
      { name: "Blushing",   mood: "coral", hex: "#EB7066", img: "assets/products/lip-tint-02.png" },
      { name: "Soft Rose",  mood: "rose",  hex: "#E89090", img: "assets/products/lip-tint-03.png" },
      { name: "Berry Bliss",mood: "berry", hex: "#D64E7F", img: "assets/products/lip-tint-04.png" },
    ],
  },
  {
    id: "lip-balm",
    category: "lip",
    catLabel: "LIP",
    name: "Melting Lip Balm",
    nameKo: "멜팅 립 밤",
    price: 9000,
    listPrice: 12000,
    rating: 4.7,
    reviewCount: 862,
    badge: null,
    desc: "체온에 부드럽게 녹아들며 은은한 혈색을 입혀주는 컬러 립 밤. 하루 종일 덧발라도 부담 없는 촉촉함을 선사합니다.",
    descEn: "A tinted lip balm that melts with your body heat, leaving a subtle flush of color. Moisture you can layer all day without a hint of heaviness.",
    texturePoints: [
      { emoji: "🧈", title: "스르륵 멜팅 제형", text: "입술에 닿는 순간 녹아들어 각질 부담 없이 발립니다.", titleEn: "Melting texture", textEn: "Melts the moment it touches your lips, gliding over dry patches." },
      { emoji: "💗", title: "은은한 혈색", text: "생기 있는 컬러가 자연스럽게 스며들어 민낯에도 어울립니다.", titleEn: "Subtle flush", textEn: "A lively tint that sinks in naturally — perfect even on bare skin." },
      { emoji: "🌿", title: "촉촉한 보습막", text: "수분을 감싸는 보습막이 건조한 입술을 하루 종일 케어합니다.", titleEn: "Moisture veil", textEn: "A moisture-locking veil that cares for dry lips all day long." },
    ],
    pairsWith: ["powder-blush", "lip-liner"],
    shades: [
      { name: "Tender Pink",  mood: "pink",  hex: "#E8A9C2", img: "assets/products/lip-balm-01.png" },
      { name: "Peachy Glow",  mood: "coral", hex: "#F4B5A1", img: "assets/products/lip-balm-02.png" },
      { name: "Mauve Mist",   mood: "rose",  hex: "#D9A9B5", img: "assets/products/lip-balm-03.png" },
      { name: "Dusty Rose",   mood: "rose",  hex: "#B5776B", img: "assets/products/lip-balm-04.png" },
      { name: "Crimson Kiss", mood: "berry", hex: "#D84563", img: "assets/products/lip-balm-05.png" },
    ],
  },
  {
    id: "lip-liner",
    category: "lip",
    catLabel: "LIP",
    name: "Soft Lip Liner",
    nameKo: "소프트 립 라이너",
    price: 8000,
    listPrice: 10000,
    rating: 4.6,
    reviewCount: 517,
    badge: null,
    isNew: true,
    desc: "크리미하게 그려지고 파우더리하게 밀착되는 립 라이너. 립 컬러와 자연스럽게 이어지는 입술 라인을 완성합니다.",
    descEn: "A lip liner that draws on creamy and sets powdery-smooth. Completes a lip line that blends seamlessly into your lip color.",
    texturePoints: [
      { emoji: "✏️", title: "크리미한 터치", text: "힘주지 않아도 부드럽게 그려져 라인 연출이 쉽습니다.", titleEn: "Creamy touch", textEn: "Glides on softly without pressure, making lines easy to draw." },
      { emoji: "🎯", title: "번짐 없는 밀착", text: "그린 그대로 고정되어 입술 라인이 하루 종일 유지됩니다.", titleEn: "No-smudge hold", textEn: "Sets exactly as drawn, keeping your lip line crisp all day." },
      { emoji: "🎨", title: "틴트와의 연결", text: "FLUSH 틴트 컬러와 톤을 맞춰 자연스러운 그라데이션이 가능합니다.", titleEn: "Tint-matched tones", textEn: "Tone-matched to FLUSH tints for a naturally blended gradient." },
    ],
    pairsWith: ["lip-tint", "lip-balm"],
    shades: [
      { name: "Rose Pink",    mood: "pink",  hex: "#E8B4C0", img: "assets/products/lip-liner-01.png" },
      { name: "Warm Nude",    mood: "nude",  hex: "#D4A896", img: "assets/products/lip-liner-02.png" },
      { name: "Coral Breeze", mood: "coral", hex: "#F29075", img: "assets/products/lip-liner-03.png" },
      { name: "Mauve Rose",   mood: "rose",  hex: "#D9A4A8", img: "assets/products/lip-liner-04.png" },
      { name: "Wine Berry",   mood: "berry", hex: "#8B5969", img: "assets/products/lip-liner-05.png" },
    ],
  },
  {
    id: "cream-blush",
    category: "cheek",
    catLabel: "CHEEK",
    name: "Cream Blush",
    nameKo: "크림 블러셔",
    price: 14000,
    listPrice: 18000,
    rating: 4.9,
    reviewCount: 2041,
    badge: "BEST",
    desc: "볼 위에서 크림처럼 녹아 피부 안쪽에서 올라온 듯한 생기를 만드는 블러셔. 손끝으로 톡톡 두드리면 자연스럽게 번집니다.",
    descEn: "A blush that melts like cream on your cheeks, creating a glow that seems to rise from within. Tap with your fingertips and it diffuses naturally.",
    texturePoints: [
      { emoji: "🍑", title: "녹아드는 크림 제형", text: "피부 온도에 부드럽게 녹아 뭉침 없이 퍼집니다.", titleEn: "Melting cream", textEn: "Melts gently at skin temperature and spreads without caking." },
      { emoji: "🌷", title: "속에서 올라온 생기", text: "바른 듯 안 바른 듯, 안쪽에서 차오르는 혈색을 연출합니다.", titleEn: "Lit-from-within glow", textEn: "Barely-there color that blooms like a natural flush from within." },
      { emoji: "👆", title: "손끝으로 완성", text: "도구 없이 손가락만으로 톡톡, 어디서든 수정 메이크업이 가능합니다.", titleEn: "Fingertip-friendly", textEn: "No tools needed — tap it on for touch-ups anywhere." },
    ],
    pairsWith: ["lip-tint", "lip-balm"],
    shades: [
      { name: "Rosy Glow",    mood: "pink",  hex: "#E8998C", img: "assets/products/cream-blush-01.png" },
      { name: "Coral",        mood: "coral", hex: "#F49276", img: "assets/products/cream-blush-coral.png" },
      { name: "Tangerine",    mood: "coral", hex: "#F5A67D", img: "assets/products/cream-blush-tangerine.png" },
      { name: "Violet Bloom", mood: "berry", hex: "#B88FA0", img: "assets/products/cream-blush-violet.png" },
      { name: "Warm Nude",    mood: "nude",  hex: "#D9A891", img: "assets/products/cream-blush-warm-nude.png" },
      { name: "Vintage Rose", mood: "rose",  hex: "#C9939F", img: "assets/products/cream-blush-vintage-rose.png" },
    ],
  },
  {
    id: "powder-blush",
    category: "cheek",
    catLabel: "CHEEK",
    name: "Powder Blush",
    nameKo: "파우더 블러셔",
    price: 13000,
    listPrice: 16000,
    rating: 4.7,
    reviewCount: 733,
    badge: null,
    isNew: true,
    desc: "공기처럼 가볍게 퍼지는 파우더 블러셔. 보송한 마무리감으로 맑고 깨끗한 볼을 하루 종일 유지합니다.",
    descEn: "A powder blush that diffuses light as air. Its soft-matte finish keeps cheeks looking clear and clean all day.",
    texturePoints: [
      { emoji: "☁️", title: "에어리 파우더", text: "미세한 입자가 피부에 얇게 밀착되어 겉돌지 않습니다.", titleEn: "Airy powder", textEn: "Fine particles hug the skin thinly without sitting on top." },
      { emoji: "🫧", title: "보송한 마무리", text: "유분기를 잡아주어 맑고 뽀얀 볼이 오래 유지됩니다.", titleEn: "Soft-matte finish", textEn: "Controls oil so cheeks stay clear and fresh for hours." },
      { emoji: "🖌️", title: "실패 없는 블렌딩", text: "여러 번 덧발라도 뭉치지 않고 자연스럽게 쌓입니다.", titleEn: "Foolproof blending", textEn: "Builds up naturally without clumping, layer after layer." },
    ],
    pairsWith: ["lip-balm", "lip-tint"],
    shades: [
      { name: "Blossom Pink", mood: "pink",  hex: "#E89EA7", img: "assets/products/powder-blush-01.png" },
      { name: "Cloud Rose",   mood: "rose",  hex: "#E8A8B0", img: "assets/products/powder-blush-02.png" },
      { name: "Blush Bloom",  mood: "pink",  hex: "#F0A8B5", img: "assets/products/powder-blush-03.png" },
      { name: "Bare Peach", mood: "coral", hex: "#F8A885", img: "assets/products/powder-blush-04.png" },
    ],
  },
  {
    id: "cheek-tint",
    category: "cheek",
    catLabel: "CHEEK",
    name: "Cheek Tint",
    nameKo: "치크 틴트",
    price: 12000,
    listPrice: 15000,
    rating: 0,
    reviewCount: 0,
    badge: "SOON",
    isNew: true,
    comingSoon: true,
    desc: "물들 듯 스며들어 지워지지 않는 생기를 만드는 치크 틴트. 곧 만나보실 수 있어요.",
    descEn: "A cheek tint that sinks in like a stain for a glow that won't budge. Coming soon.",
    texturePoints: [],
    pairsWith: ["lip-tint"],
    shades: [],
  },
];

/* lip + cheek recommended sets (home & cart) */
const SETS = [
  {
    id: "set-coral",
    name: "Coral Day Set",
    desc: "화창한 날의 코랄 무드 — 립도 볼도 같은 온도로",
    descEn: "Sunny-day coral mood — lips and cheeks in the same warmth",
    items: [
      { productId: "lip-tint", shade: "Coral" },
      { productId: "cream-blush", shade: "Coral" },
    ],
    discount: 0.1,
  },
  {
    id: "set-rose",
    name: "Rosy Mood Set",
    desc: "차분하게 은은한 로즈 톤 데일리 조합",
    descEn: "A calm, subtle rose-tone pairing for every day",
    items: [
      { productId: "lip-tint", shade: "Rose" },
      { productId: "cream-blush", shade: "Vintage Rose" },
    ],
    discount: 0.1,
  },
  {
    id: "set-berry",
    name: "Berry Pop Set",
    desc: "포인트가 필요한 날, 살짝 진한 베리 조합",
    descEn: "A slightly deeper berry duo for days that need a point",
    items: [
      { productId: "lip-tint", shade: "Berry Bliss" },
      { productId: "cream-blush", shade: "Violet Bloom" },
    ],
    discount: 0.1,
  },
];

/* 구매후기 샘플 (데모) */
const REVIEWS = [
  { productId: "lip-tint", shade: "Coral", user: "min***", rating: 5, date: "2026.07.02",
    text: "발색 진짜 미쳤어요.. 한 번만 발라도 속부터 물든 것처럼 자연스럽고 광택이 하루종일 가요. 코랄은 웜톤 무조건 사세요!!" },
  { productId: "lip-tint", shade: "Cherry", user: "you***", rating: 5, date: "2026.06.28",
    text: "체리 완전 제 인생템 됐어요ㅠㅠ 착색도 예쁘게 남고 틴트인데 안 건조해요. 재구매 각입니다." },
  { productId: "lip-tint", shade: "Rose", user: "dal***", rating: 4, date: "2026.06.21",
    text: "MLBB 찾으시면 로즈 추천해요. 데일리로 무난하게 쓰기 좋아요. 용기가 너무 귀여워서 들고 다니는 맛이 있음ㅋㅋ" },
  { productId: "lip-balm", shade: "Peachy Glow", user: "hay***", rating: 5, date: "2026.07.01",
    text: "각질 부각 하나도 없고 은은하게 혈색 돌아서 민낯에 이거 하나만 발라도 살아나요. 향도 부담스럽지 않아요." },
  { productId: "lip-balm", shade: "Dusty Rose", user: "sso***", rating: 4, date: "2026.06.19",
    text: "촉촉함 오래가고 색도 생각보다 잘 올라와요. 립밤인데 틴트 바른 것 같은 느낌!" },
  { productId: "lip-liner", shade: "Warm Nude", user: "bin***", rating: 5, date: "2026.06.25",
    text: "부드럽게 그려져서 라인 그리기 진짜 편해요. 틴트랑 톤 맞춰서 쓰니까 입술이 도톰해 보여요." },
  { productId: "cream-blush", shade: "Coral", user: "yer***", rating: 5, date: "2026.07.04",
    text: "손으로 톡톡 두드리면 그라데이션이 알아서 돼요. 겉돌지 않고 피부에 스며드는 느낌이라 매일 씁니다. 케이스도 너무 예뻐요ㅠㅠ" },
  { productId: "cream-blush", shade: "Vintage Rose", user: "jiw***", rating: 5, date: "2026.06.30",
    text: "빈티지로즈 쿨톤 분들 무조건 담으세요. 과하지 않게 은은한 생기가 올라와요. 지속력도 좋은 편!" },
  { productId: "cream-blush", shade: "Tangerine", user: "sun***", rating: 4, date: "2026.06.15",
    text: "탠저린 여름에 쓰기 딱이에요. 크림인데 마무리는 보송해서 무너짐 없어요." },
  { productId: "powder-blush", shade: "Blossom Pink", user: "eun***", rating: 5, date: "2026.06.27",
    text: "입자가 고와서 뭉침 없이 발려요. 붓으로 슥슥 발라도 실패가 없는 색이에요. 데일리 추천!" },
  { productId: "powder-blush", shade: "Bare Peach", user: "gae***", rating: 4, date: "2026.06.12",
    text: "피치 컬러 은은하게 예뻐요. 파우더라 유분기도 잡아주고 겉돌지 않아요." },
];

const POINT_RATE = 0.01; // 구매 적립 1%

/* ---------- lookups ---------- */
function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function getShade(product, shadeName) {
  return product.shades.find((s) => s.name === shadeName) || product.shades[0] || null;
}

function getMood(id) {
  return MOODS.find((m) => m.id === id) || null;
}

function formatPrice(n) {
  return LANG === "en"
    ? "₩" + n.toLocaleString("en-US")
    : n.toLocaleString("ko-KR") + "원";
}

/* 현재 언어 기준 제품 표기 */
function pName(product) {
  return LANG === "en" ? product.name : product.nameKo;
}
function pNameSub(product) {
  return LANG === "en" ? product.nameKo : product.name;
}
function pDesc(product) {
  return LANG === "en" && product.descEn ? product.descEn : product.desc;
}

function discountRate(product) {
  if (!product.listPrice || product.listPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.listPrice) * 100);
}

function getReviews(productId) {
  return REVIEWS.filter((r) => r.productId === productId);
}

function starsHTML(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
