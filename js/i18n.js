/* ============================================================
   FLUSH i18n — KR/EN 사전과 적용 헬퍼
   - 언어는 localStorage('flush-lang')에 저장, 기본 kr
   - 정적 HTML: data-i18n="key" → innerHTML 교체
   - JS 렌더러: t(key) 또는 LANG 분기 사용
   ============================================================ */

const LANG = localStorage.getItem("flush-lang") === "en" ? "en" : "kr";
document.documentElement.lang = LANG === "en" ? "en" : "ko";

const I18N = {
  /* ---- 공통 : 탑바/헤더/푸터/플로팅 ---- */
  "top.notice": { kr: "신규회원 <b>첫 구매 시</b> 1만원 할인 쿠폰팩 증정", en: "New members — ₩10,000 coupon pack <b>with your first order</b>" },
  "top.notice2": { kr: "20,000원 이상 구매 시 <b>무료 배송</b>", en: "<b>Free shipping</b> on orders over ₩20,000" },
  "hd.signupTip": { kr: "신규 가입시 <em>1만원 쿠폰</em>", en: "Sign up — <em>₩10,000 coupon</em>" },
  "top.login": { kr: "로그인", en: "Login" },
  "top.join": { kr: "회원가입", en: "Sign Up" },
  "top.order": { kr: "주문조회", en: "Orders" },
  "top.cs": { kr: "고객센터", en: "Help" },
  "hd.search": { kr: "쉐이드, 제품명 검색 (예: 코랄)", en: "Search shades or products (e.g. coral)" },
  "hd.my": { kr: "마이페이지", en: "My Page" },
  "hd.cart": { kr: "장바구니", en: "Cart" },
  "gnb.best": { kr: "베스트", en: "Best" },
  "gnb.new": { kr: "NEW", en: "NEW" },
  "hd.suggest": { kr: "추천 검색어", en: "Trending" },
  "gnb.lip": { kr: "립", en: "Lip" },
  "gnb.cheek": { kr: "치크", en: "Cheek" },
  "gnb.set": { kr: "기획세트", en: "Sets" },
  "gnb.event": { kr: "이벤트", en: "Events" },
  "gnb.brand": { kr: "브랜드스토리", en: "Brand Story" },
  "ft.cs": { kr: "고객센터", en: "Customer Service" },
  "ft.hours": { kr: "평일 10:00 - 17:00 (점심 12:00 - 13:00)<br>주말 · 공휴일 휴무", en: "Weekdays 10:00 - 17:00 (Lunch 12:00 - 13:00)<br>Closed on weekends & holidays" },
  "ft.inquiry": { kr: "1:1 문의", en: "Contact Us" },
  "ft.kakao": { kr: "카카오톡 상담", en: "KakaoTalk Chat" },
  "ft.link.brand": { kr: "브랜드스토리", en: "Brand Story" },
  "ft.link.all": { kr: "전체상품", en: "All Products" },
  "ft.link.event": { kr: "이벤트", en: "Events" },
  "ft.link.order": { kr: "주문조회", en: "Order Tracking" },
  "ft.link.cart": { kr: "장바구니", en: "Cart" },
  "ft.link.return": { kr: "교환/반품 신청", en: "Exchanges & Returns" },
  "ft.bank.holder": { kr: "예금주 : (주)플러쉬", en: "Account holder: FLUSH Inc." },
  "ft.links.company": { kr: "회사소개", en: "About Us" },
  "ft.links.terms": { kr: "이용약관", en: "Terms of Use" },
  "ft.links.privacy": { kr: "<strong>개인정보처리방침</strong>", en: "<strong>Privacy Policy</strong>" },
  "ft.links.guide": { kr: "이용안내", en: "Shopping Guide" },
  "ft.legal": {
    kr: "상호 : (주)플러쉬 &nbsp;|&nbsp; 대표 : 김플러쉬 &nbsp;|&nbsp; 사업자등록번호 : 123-45-67890 &nbsp;|&nbsp; 통신판매업신고 : 제2026-서울마포-0707호<br>주소 : 서울특별시 마포구 양화로 123, 5층 (서교동) &nbsp;|&nbsp; 개인정보보호책임자 : 김플러쉬 &nbsp;|&nbsp; 이메일 : hello@flush.co.kr",
    en: "Company: FLUSH Inc. &nbsp;|&nbsp; CEO: Flush Kim &nbsp;|&nbsp; Business Reg. No.: 123-45-67890 &nbsp;|&nbsp; E-commerce Permit: 2026-Seoul Mapo-0707<br>Address: 5F, 123 Yanghwa-ro, Mapo-gu, Seoul, Korea &nbsp;|&nbsp; Privacy Officer: Flush Kim &nbsp;|&nbsp; Email: hello@flush.co.kr",
  },
  "ft.copy": {
    kr: "Copyright © 2026 <strong>FLUSH</strong>. All rights reserved. 본 사이트는 포트폴리오용 데모이며 실제 판매가 이루어지지 않습니다.",
    en: "Copyright © 2026 <strong>FLUSH</strong>. All rights reserved. This is a portfolio demo — no real orders are processed.",
  },
  "float.chat": { kr: "상담", en: "Chat" },

  /* ---- 공통 : 카드/버튼/토스트 ---- */
  "btn.add": { kr: "담기", en: "Add" },
  "picker.title": { kr: "쉐이드를 선택하세요", en: "Choose a shade" },
  "btn.soon": { kr: "출시 예정", en: "Coming Soon" },
  "btn.addSet": { kr: "세트 담기", en: "Add Set" },
  "card.reviews": { kr: "리뷰", en: "reviews" },
  "toast.viewCart": { kr: "장바구니 보기", en: "View Cart" },
  "toast.kakao": { kr: "카카오톡 채널 상담은 준비 중이에요 (데모) 💛", en: "KakaoTalk chat is coming soon (demo) 💛" },
  "toast.coupon": { kr: "데모 사이트라 쿠폰 지급은 흉내만 내요 🎁", en: "This is a demo — the coupon is just pretend 🎁" },
  "toast.checkout": { kr: "주문이 완료되었습니다! (포트폴리오 데모라 실제 결제는 되지 않아요) 💕", en: "Order complete! (This is a portfolio demo — no real payment) 💕" },

  /* ---- 홈 : 배너/혜택/섹션 ---- */
  "bn1.title": { kr: "볼 위에 가볍게 번지는<br><em>오늘의 생기</em>", en: "A light wash of color,<br><em>today's fresh glow</em>" },
  "bn1.cta": { kr: "베스트셀러 보러가기", en: "Shop Best Seller" },
  "hero2.title": { kr: "또렷한 한 줄로 완성하는<br><em>나만의 입술 라인</em>", en: "Defined in a single line,<br><em>lips that feel like you</em>" },
  "hero2.cta": { kr: "립 라이너 보러가기", en: "Shop Lip Liner" },
  "hero3.title": { kr: "올리브영 단독 한정 기획,<br><em>젤리 틴트 스페셜 세트</em>", en: "Olive Young exclusive,<br><em>Jelly Tint special set</em>" },
  "hero3.cta": { kr: "기획세트 구경하기", en: "Shop the Set" },
  "bn2.eyebrow": { kr: "🎁 WELCOME BENEFIT", en: "🎁 WELCOME BENEFIT" },
  "bn2.title": { kr: "처음 만나는 플러쉬,<br><em>웰컴 쿠폰</em>으로 시작하세요", en: "New to FLUSH?<br>Start with a <em>welcome coupon</em>" },
  "bn2.desc": { kr: "신규가입 즉시 지급 · 전 상품 사용 가능 · 다운로드 후 30일 이내", en: "Issued instantly on sign-up · valid on all items · use within 30 days" },
  "bn2.cta": { kr: "쿠폰 받기", en: "Get Coupon" },
  "bn2.couponDesc": { kr: "신규가입 웰컴 쿠폰<small>FLUSH 첫 구매 시 사용 가능</small>", en: "Welcome sign-up coupon<small>Valid on your first FLUSH order</small>" },
  "bn3.eyebrow": { kr: "💕 SET PROMOTION", en: "💕 SET PROMOTION" },
  "bn3.title": { kr: "립과 치크, 같은 온도로<br><em>기획세트 10%</em>", en: "Lip &amp; cheek in tune —<br><em>10% off sets</em>" },
  "bn3.desc": { kr: "함께 쓰면 더 예쁜 조합을 플러쉬가 미리 맞춰뒀어요", en: "Pairings that look better together, matched by FLUSH" },
  "bn3.cta": { kr: "기획세트 보러가기", en: "Shop Sets" },
  "benefit1.title": { kr: "<em>30,000원</em> 이상 무료배송", en: "Free shipping over <em>₩30,000</em>" },
  "benefit1.desc": { kr: "평일 오후 2시 이전 주문 시 당일 출고", en: "Same-day dispatch for weekday orders before 2 PM" },
  "benefit2.title": { kr: "전 회원 <em>1% 적립</em>", en: "<em>1% points</em> for all members" },
  "benefit2.desc": { kr: "적립금은 다음 구매에 바로 사용 가능", en: "Use your points right away on the next order" },
  "benefit3.title": { kr: "신규가입 <em>3,000원 쿠폰</em>", en: "<em>₩3,000 coupon</em> on sign-up" },
  "benefit3.desc": { kr: "가입 즉시 지급 · 전 상품 사용 가능", en: "Issued instantly · valid on all items" },
  "qc.tint": { kr: "립 틴트", en: "Lip Tint" },
  "qc.balm": { kr: "립밤", en: "Lip Balm" },
  "qc.liner": { kr: "립라이너", en: "Lip Liner" },
  "qc.cream": { kr: "크림 블러쉬", en: "Cream Blush" },
  "qc.powder": { kr: "파우더 블러쉬", en: "Powder Blush" },
  "qc.set": { kr: "기획세트", en: "Sets" },
  "sec.best.title": { kr: "이번 주 베스트 랭킹", en: "This Week's Best Sellers" },
  "sec.best.sub": { kr: "플러쉬에서 지금 가장 많이 판매되는 컬러", en: "The colors everyone is buying right now" },
  "sec.mood.title": { kr: "오늘의 무드로 골라보세요", en: "Pick by today's mood" },
  "sec.mood.sub": { kr: "내 피부톤에 맞는 컬러, 무드에서 시작하면 쉬워요", en: "Finding your color is easy when you start from a mood" },
  "sec.set.title": { kr: "립 + 치크 기획세트 10%", en: "Lip + Cheek Sets — 10% Off" },
  "sec.set.sub": { kr: "함께 쓰면 더 예쁜 조합을 할인된 세트로 만나보세요", en: "Pairings that look better together, at a set price" },
  "sec.review.title": { kr: "생생한 구매후기", en: "Real Customer Reviews" },
  "sec.review.sub": { kr: "먼저 써본 분들의 솔직한 발색 후기", en: "Honest swatch reviews from customers" },
  "teaser.title": { kr: "가방 속에 넣고 다니고 싶은<br>작은 컬러 오브제", en: "A little color objet<br>you'll want to carry everywhere" },
  "teaser.desc": {
    kr: "패키징에서 시작된 호기심이 발색에 대한 기대감으로 이어지고, 나에게 맞는 컬러를 찾는 경험으로 확장되는 브랜드. FLUSH는 립과 치크에 집중해 누구나 부담 없이 자신의 색을 발견하도록 설계했습니다.",
    en: "Curiosity that starts with the packaging grows into excitement about the color payoff, and expands into finding the shade that is truly yours. FLUSH focuses on lip and cheek so anyone can discover their color with ease.",
  },
  "teaser.cta": { kr: "브랜드 이야기 보기", en: "Read Our Story" },

  /* ---- Shop ---- */
  "shop.title": { kr: "전체상품", en: "All Products" },
  "shop.sub": { kr: "립과 치크, 카테고리별로 쉽게 골라보세요", en: "Lip & cheek — browse easily by category" },
  "shop.sort.popular": { kr: "인기순", en: "Most Popular" },
  "shop.sort.review": { kr: "리뷰 많은순", en: "Most Reviewed" },
  "shop.sort.priceAsc": { kr: "낮은 가격순", en: "Price: Low to High" },
  "shop.sort.priceDesc": { kr: "높은 가격순", en: "Price: High to Low" },
  "shop.clear": { kr: "초기화 ↺", en: "Reset ↺" },
  "shop.empty": { kr: "조건에 맞는 상품이 없어요. 다른 무드를 골라보세요 🌸", en: "No products match. Try another mood 🌸" },

  /* ---- 상세 ---- */
  "pd.shadeLabel": { kr: "쉐이드 선택", en: "Select Shade" },
  "pd.addCart": { kr: "장바구니 담기", en: "Add to Cart" },
  "pd.buyNow": { kr: "바로 구매하기", en: "Buy Now" },
  "pd.tab.info": { kr: "상품정보", en: "Details" },
  "pd.tab.review": { kr: "구매후기", en: "Reviews" },
  "pd.tab.shipping": { kr: "배송/교환/반품", en: "Shipping & Returns" },
  "pd.info.volume": { kr: "용량", en: "Volume" },
  "pd.info.expiry": { kr: "사용기한", en: "Shelf Life" },
  "pd.info.expiryVal": { kr: "제조일로부터 24개월, 개봉 후 12개월", en: "24 months from manufacture, 12 months after opening" },
  "pd.info.origin": { kr: "제조국", en: "Country of Origin" },
  "pd.info.originVal": { kr: "대한민국", en: "Republic of Korea" },
  "pd.info.seller": { kr: "화장품책임판매업자", en: "Responsible Seller" },
  "pd.info.sellerVal": { kr: "(주)플러쉬", en: "FLUSH Inc." },
  "pd.info.caution": { kr: "사용 시 주의사항", en: "Precautions" },
  "pd.info.cautionVal": { kr: "화장품 사용 시 이상이 있는 경우 전문의와 상담하세요. 상처가 있는 부위에는 사용을 자제해 주세요.", en: "If irritation occurs, consult a dermatologist. Avoid applying on wounded skin." },
  "pd.ship.fee": { kr: "배송비", en: "Shipping Fee" },
  "pd.ship.feeVal": { kr: "3,000원 (30,000원 이상 구매 시 무료배송)", en: "₩3,000 (free on orders over ₩30,000)" },
  "pd.ship.time": { kr: "배송기간", en: "Delivery Time" },
  "pd.ship.timeVal": { kr: "평일 오후 2시 이전 결제 완료 시 당일 출고 · 출고 후 1~2일 소요 (주말/공휴일 제외)", en: "Same-day dispatch for weekday payments before 2 PM · 1–2 days after dispatch (excl. weekends/holidays)" },
  "pd.ship.period": { kr: "교환/반품 기간", en: "Exchange/Return Window" },
  "pd.ship.periodVal": { kr: "상품 수령 후 7일 이내 신청 가능", en: "Within 7 days of receiving your order" },
  "pd.ship.noreturn": { kr: "교환/반품 불가", en: "Non-returnable Cases" },
  "pd.ship.noreturnVal": { kr: "개봉 및 사용한 화장품은 재판매가 불가하여 교환/반품이 어려워요 (단순 변심 시 왕복 배송비 6,000원 부담)", en: "Opened or used cosmetics cannot be resold and are not eligible for return (₩6,000 round-trip shipping applies for change of mind)" },
  "pd.ship.cs": { kr: "고객센터", en: "Customer Service" },
  "pd.ship.csVal": { kr: "1670-0707 (평일 10:00 - 17:00, 점심 12:00 - 13:00)", en: "1670-0707 (Weekdays 10:00 - 17:00, Lunch 12:00 - 13:00)" },
  "pd.pairs.title": { kr: "이 컬러와 어울리는 조합", en: "Pairs Well With This Color" },
  "pd.pairs.sub": { kr: "립과 치크를 같은 무드로 맞추면 얼굴 전체의 톤이 정리돼요", en: "Matching lip and cheek moods pulls your whole look together" },

  /* ---- 장바구니 ---- */
  "cart.title": { kr: "장바구니", en: "Cart" },
  "cart.sub": { kr: "담아둔 컬러를 확인해 보세요", en: "Review the colors you've picked" },
  "cart.empty.title": { kr: "장바구니가 비어있어요", en: "Your cart is empty" },
  "cart.empty.desc": { kr: "마음에 드는 컬러를 찾으러 가볼까요?", en: "Shall we go find your color?" },
  "cart.empty.cta": { kr: "쇼핑 계속하기", en: "Continue Shopping" },
  "cart.summary": { kr: "주문 예상 금액", en: "Order Summary" },
  "cart.subtotal": { kr: "총 상품 금액", en: "Subtotal" },
  "cart.shippingFee": { kr: "배송비", en: "Shipping" },
  "cart.point": { kr: "적립 예상 (1%)", en: "Points Earned (1%)" },
  "cart.total": { kr: "총 결제 금액", en: "Total" },
  "cart.checkout": { kr: "구매하기", en: "Checkout" },
  "cart.together.title": { kr: "같이 쓰면 더 예쁜 조합", en: "Better Together" },
  "cart.selectAll": { kr: "전체", en: "All" },
  "cart.delSelected": { kr: "선택삭제", en: "Delete selected" },
  "cart.delAll": { kr: "전체삭제", en: "Clear all" },

  /* ---- 브랜드 스토리 ---- */
  "ab.hero.title": { kr: "입술과 볼 위에 가볍게 번지는 생기,<br>그 생기를 담은 <em>투명한 컬러 오브제</em>", en: "A fresh glow that spreads lightly on lips and cheeks,<br>held in a <em>transparent color objet</em>" },
  "ab.hero.desc": {
    kr: "FLUSH는 강한 메이크업보다, 작은 컬러 하나로 얼굴의 분위기가 달라지는 순간에 집중합니다. 투명하고 말랑한 패키징, 촉촉해 보이는 제형, 쉽게 고를 수 있는 컬러 무드를 통해 누구나 부담 없이 자신의 색을 발견할 수 있도록 설계했습니다.",
    en: "Rather than heavy makeup, FLUSH focuses on the moment a single touch of color changes the mood of your face. With transparent, squishy packaging, dewy-looking textures, and easy-to-pick color moods, FLUSH is designed so anyone can discover their color with ease.",
  },
  "ab.s1.title": { kr: "패키징에서 시작된 호기심", en: "Curiosity that starts with packaging" },
  "ab.s1.p1": {
    kr: "색조 제품을 고를 때 우리는 처음부터 성분이나 기능을 먼저 보지 않습니다. 예쁜 패키징에 시선이 가고, 실제로 발랐을 때의 색감과 질감을 확인한 뒤, 나에게 맞는 색을 탐색하죠.",
    en: "When choosing color cosmetics, we don't start with ingredients or functions. Our eyes go to pretty packaging first, then we check the color and texture on skin, and finally explore which shade suits us.",
  },
  "ab.s1.p2": {
    kr: "FLUSH는 이 자연스러운 흐름에서 시작했습니다. 투명한 케이스 안에 담긴 컬러는 제품을 단순한 화장품이 아니라, 가방 안에 넣고 다니고 싶은 작은 오브제로 보이게 합니다.",
    en: "FLUSH began from this natural flow. Color held in a transparent case turns the product from mere makeup into a little objet you want to carry in your bag.",
  },
  "ab.s2.title": { kr: "보고 싶고, 써보고 싶고,<br>다른 색도 궁금해지는", en: "Colors you want to see,<br>try, and keep exploring" },
  "ab.s2.p1": {
    kr: "입술 위에는 촉촉하게, 볼 위에는 자연스럽게 번지는 색감으로 오늘의 분위기를 가볍게 바꿉니다.",
    en: "Dewy on the lips, naturally diffused on the cheeks — a light change to today's mood.",
  },
  "ab.s2.p2": {
    kr: "FLUSH는 어렵고 복잡한 메이크업 대신, 패키징에서 시작된 호기심이 발색에 대한 기대감으로 이어지고, 나에게 맞는 컬러를 찾는 경험으로 확장되는 컬러 경험을 만듭니다.",
    en: "Instead of difficult, complicated makeup, FLUSH builds a color experience where curiosity about the packaging grows into excitement about the payoff — and expands into finding the color that is truly yours.",
  },
  "ab.pos.title": { kr: "LIP과 CHEEK에 집중합니다", en: "Focused on LIP and CHEEK" },
  "ab.pos.sub": { kr: "입술과 볼은 얼굴의 분위기를 가장 빠르게 바꾸는 영역이니까요", en: "Lips and cheeks change the mood of a face faster than anything else" },
  "ab.pos.lip.desc": { kr: "촉촉함과 광택을 중심으로, 물들 듯 자연스러운 입술 컬러", en: "Lip color that stains naturally, centered on moisture and gloss" },
  "ab.pos.lip.tint": { kr: "유리알 광택의 워터 틴트", en: "Glassy water tint" },
  "ab.pos.lip.balm": { kr: "혈색을 더하는 보습 밤", en: "Moisturizing balm with a flush of color" },
  "ab.pos.lip.liner": { kr: "부드럽게 그려지는 라이너", en: "Creamy, smooth-drawing liner" },
  "ab.pos.cheek.desc": { kr: "속에서 올라온 듯, 맑게 번지는 생기감의 볼 컬러", en: "Cheek color that blooms clear, as if from within" },
  "ab.pos.cheek.cream": { kr: "피부에 녹아드는 크림 제형", en: "Cream that melts into skin" },
  "ab.pos.cheek.powder": { kr: "보송하게 퍼지는 파우더", en: "Softly diffusing powder" },
  "ab.pos.cheek.tint": { kr: "지워지지 않는 생기 · Coming Soon", en: "Long-lasting glow · Coming Soon" },
  "ab.cta.title": { kr: "오늘, 나의 색을 발견해 보세요", en: "Discover your color today" },
  "ab.cta.desc": {
    kr: "쉐이드와 무드, 발색 이미지, 립 + 치크 조합 추천까지 — FLUSH가 컬러 탐색을 쉽게 만들어 드릴게요.",
    en: "Shades, moods, swatches, and lip + cheek pairings — FLUSH makes exploring color easy.",
  },
  "ab.cta.btn": { kr: "Shop All", en: "Shop All" },
};

function t(key) {
  const entry = I18N[key];
  return entry ? entry[LANG] : key;
}

/* data-i18n / data-i18n-ph 붙은 정적 요소에 사전 적용 */
function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
}

function setLang(lang) {
  localStorage.setItem("flush-lang", lang === "en" ? "en" : "kr");
  location.reload();
}
