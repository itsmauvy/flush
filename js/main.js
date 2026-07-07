/* ============================================================
   FLUSH common — site chrome(헤더/푸터/플로팅) 주입, cart storage,
   quick add, toast, shared card renderers
   * i18n.js, data.js 이후에 로드되어야 함
   ============================================================ */

const CART_KEY = "flush-cart";

/* ---------- cart storage ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, shadeName, qty = 1) {
  const product = getProduct(productId);
  if (!product || product.comingSoon) return;
  const shade = getShade(product, shadeName);
  if (!shade) return;

  const cart = getCart();
  const found = cart.find((it) => it.productId === productId && it.shade === shade.name);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ productId, shade: shade.name, qty });
  }
  saveCart(cart);
  showToast(
    LANG === "en"
      ? `${pName(product)} [${shade.name}] added to your cart`
      : `${pName(product)} [${shade.name}] 상품을 장바구니에 담았습니다`,
    true
  );
}

function setCartQty(productId, shadeName, qty) {
  let cart = getCart();
  const found = cart.find((it) => it.productId === productId && it.shade === shadeName);
  if (!found) return;
  found.qty = qty;
  if (found.qty <= 0) {
    cart = cart.filter((it) => it !== found);
  }
  saveCart(cart);
}

function removeFromCart(productId, shadeName) {
  saveCart(getCart().filter((it) => !(it.productId === productId && it.shade === shadeName)));
}

function cartTotalQty() {
  return getCart().reduce((sum, it) => sum + it.qty, 0);
}

function cartTotalPrice() {
  return getCart().reduce((sum, it) => {
    const p = getProduct(it.productId);
    return p ? sum + p.price * it.qty : sum;
  }, 0);
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count, .cart-count-text").forEach(
    (b) => (b.textContent = cartTotalQty())
  );
}

/* ---------- toast ---------- */
let toastTimer = null;
function showToast(message, withCartLink = false) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = withCartLink
    ? `${message}<a href="cart.html">${t("toast.viewCart")}</a>`
    : message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- site chrome : 헤더 ---------- */
function currentNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  const params = new URLSearchParams(location.search);
  if (path === "about.html") return "brand";
  if (path === "shop.html") {
    const cat = params.get("category") || "";
    if (cat === "lip" || cat.startsWith("lip-")) return "lip";
    if (cat === "cheek" || cat.endsWith("-blush") || cat === "cheek-tint") return "cheek";
    return "best";
  }
  return "";
}

function renderHeader() {
  const slot = document.getElementById("chrome-header");
  if (!slot) return;
  const active = currentNav();
  const on = (k) => (active === k ? "active" : "");
  slot.innerHTML = `
    <div class="topbar">
      <div class="container topbar-inner">
        <div class="topbar-rotator">
          <span class="topbar-notice active">${t("top.notice")}</span>
          <span class="topbar-notice">${t("top.notice2")}</span>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="header-main">
        <div class="header-left">
          <a href="index.html" class="logo"><img src="assets/flush_logo.svg" alt="flush"></a>
          <button class="hamburger" id="gnb-toggle" aria-label="menu" aria-expanded="false">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
        <div class="header-utils">
          <a href="javascript:void(0)" class="util-item util-join">
            <span class="util-icon"><span class="material-symbols-outlined">person</span></span><span>${t("top.login")}</span>
            <span class="signup-tip">${t("hd.signupTip")}</span>
          </a>
          <a href="cart.html" class="util-item cart-util">
            <span class="util-icon"><span class="material-symbols-outlined">shopping_cart</span></span><span>${t("hd.cart")}</span><i class="cart-count">0</i>
          </a>
        </div>
      </div>
    </header>
    <div class="drawer-dim" id="drawer-dim"></div>
    <nav class="gnb-drawer" id="gnb-drawer">
      <button class="drawer-close" id="drawer-close" aria-label="close">
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="drawer-nav">
        <div class="drawer-group">
          <button class="drawer-item" data-acc aria-expanded="false">
            SHOP<span class="material-symbols-outlined">expand_more</span>
          </button>
          <div class="drawer-sub" hidden>
            <a href="shop.html">${t("gnb.best")}</a>
            <a href="shop.html?category=lip-tint">NEW</a>
            <a href="shop.html?category=lip">${t("gnb.lip")}</a>
            <a href="shop.html?category=cheek">${t("gnb.cheek")}</a>
            <a href="index.html#sets">${t("gnb.set")}</a>
          </div>
        </div>
        <a class="drawer-item" href="index.html#event">EVENT</a>
        <a class="drawer-item" href="about.html">ABOUT</a>
      </div>

      <form class="header-search drawer-search" id="header-search" action="shop.html" method="get" autocomplete="off">
        <input type="search" name="q" placeholder="Search" aria-label="search">
        <button type="submit" aria-label="search"><span class="material-symbols-outlined">search</span></button>
        <div class="search-suggest" id="search-suggest" hidden>
          <p class="suggest-title">${t("hd.suggest")}</p>
          <div class="suggest-chips">
            ${(LANG === "en"
              ? ["Lip Tint", "Cream Blush", "Coral", "Rose", "Lip Balm"]
              : ["립 틴트", "크림 블러셔", "코랄", "로즈", "립밤"]
            )
              .map((kw) => `<a href="shop.html?q=${encodeURIComponent(kw)}" class="suggest-chip">${kw}</a>`)
              .join("")}
          </div>
        </div>
      </form>

      <div class="drawer-foot">
        <a href="javascript:void(0)"><span class="material-symbols-outlined">person</span>LOGIN</a>
        <a href="cart.html"><span class="material-symbols-outlined">shopping_cart</span>CART (<b class="cart-count-text">0</b>)</a>
        <span class="lang-switch">
          <span class="material-symbols-outlined">language</span>
          <button class="${LANG === "kr" ? "on" : ""}" data-lang="kr">KR</button><i>/</i><button class="${LANG === "en" ? "on" : ""}" data-lang="en">EN</button>
        </span>
      </div>
    </nav>`;

  // 햄버거 → 왼쪽 사이드 패널
  const gnbToggle = slot.querySelector("#gnb-toggle");
  const gnbDrawer = slot.querySelector("#gnb-drawer");
  const drawerDim = slot.querySelector("#drawer-dim");
  function setDrawer(open) {
    gnbDrawer.classList.toggle("open", open);
    drawerDim.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    gnbToggle.setAttribute("aria-expanded", String(open));
  }
  gnbToggle.addEventListener("click", () => setDrawer(true));
  gnbToggle.addEventListener("mouseenter", () => setDrawer(true));
  gnbDrawer.addEventListener("mouseleave", () => setDrawer(false));
  slot.querySelector("#drawer-close").addEventListener("click", () => setDrawer(false));
  drawerDim.addEventListener("click", () => setDrawer(false));
  gnbDrawer.querySelectorAll(".drawer-nav a, .drawer-foot a[href]").forEach((a) =>
    a.addEventListener("click", () => setDrawer(false))
  );

  // SHOP 아코디언
  gnbDrawer.querySelectorAll("[data-acc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sub = btn.parentElement.querySelector(".drawer-sub");
      const open = sub.hidden;
      sub.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // 사이드 패널 내 KR/EN
  gnbDrawer.querySelectorAll("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => setLang(btn.dataset.lang))
  );

  // 히어로 풀스크린 계산용: 띠배너+헤더 높이를 CSS 변수로 노출
  document.documentElement.style.setProperty("--chrome-h", slot.offsetHeight + "px");
  window.addEventListener("resize", () =>
    document.documentElement.style.setProperty("--chrome-h", slot.offsetHeight + "px")
  );

  // 홈: 헤더(로고·햄버거·아이콘)가 스크롤을 따라오도록 고정.
  // 띠배너(36px)가 스크롤로 사라지면 헤더가 맨 위에 붙음
  if (document.body.classList.contains("home")) {
    const hdr = slot.querySelector(".site-header");
    const onScroll = () => {
      hdr.style.top = Math.max(0, 36 - window.scrollY) + "px";
      hdr.classList.toggle("scrolled", window.scrollY > window.innerHeight - 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 헤더가 화면 최상단에 붙으면 쿠폰 말풍선을 아이콘 아래로 뒤집음 (위로 잘림 방지)
  // * 홈의 헤더 위치 갱신(onScroll) 이후에 등록되어야 같은 스크롤 이벤트에서 올바른 위치를 읽음
  const hdrEl = slot.querySelector(".site-header");
  const flipTip = () =>
    hdrEl.classList.toggle("tip-flip", hdrEl.getBoundingClientRect().top <= 1);
  window.addEventListener("scroll", flipTip, { passive: true });
  flipTip();

  // 검색창 포커스 시 추천 검색어 노출
  const searchInput = slot.querySelector(".header-search input");
  const suggest = slot.querySelector("#search-suggest");
  if (searchInput && suggest) {
    searchInput.addEventListener("focus", () => (suggest.hidden = false));
    searchInput.addEventListener("blur", () =>
      setTimeout(() => (suggest.hidden = true), 150)
    );
  }

  // 띠배너 문구 자동 롤링
  const notices = slot.querySelectorAll(".topbar-notice");
  if (notices.length > 1) {
    let ni = 0;
    setInterval(() => {
      notices[ni].classList.remove("active");
      ni = (ni + 1) % notices.length;
      notices[ni].classList.add("active");
    }, 3500);
  }

  updateCartBadge();
}

/* ---------- site chrome : 푸터 ---------- */
function renderFooter() {
  const slot = document.getElementById("chrome-footer");
  if (!slot) return;
  slot.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-cs">
            <h4>${t("ft.cs")}</h4>
            <p class="cs-tel">1670-0707</p>
            <p class="cs-time">${t("ft.hours")}</p>
            <div class="cs-btns">
              <a href="javascript:void(0)" class="cs-btn">${t("ft.inquiry")}</a>
              <a href="javascript:void(0)" class="cs-btn kakao">${t("ft.kakao")}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>ABOUT</h4>
            <ul>
              <li><a href="about.html">${t("ft.link.brand")}</a></li>
              <li><a href="shop.html">${t("ft.link.all")}</a></li>
              <li><a href="index.html#event">${t("ft.link.event")}</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>MY ORDER</h4>
            <ul>
              <li><a href="javascript:void(0)">${t("ft.link.order")}</a></li>
              <li><a href="cart.html">${t("ft.link.cart")}</a></li>
              <li><a href="javascript:void(0)">${t("ft.link.return")}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-info">
          <img src="assets/flush_logo.svg" alt="flush" class="footer-logo">
          <ul class="footer-links">
            <li><a href="javascript:void(0)">${t("ft.links.company")}</a></li>
            <li><a href="javascript:void(0)">${t("ft.links.terms")}</a></li>
            <li><a href="javascript:void(0)">${t("ft.links.privacy")}</a></li>
            <li><a href="javascript:void(0)">${t("ft.links.guide")}</a></li>
          </ul>
          <p>${t("ft.legal")}</p>
          <p class="footer-copy">${t("ft.copy")}</p>
        </div>
      </div>
    </footer>`;
}

/* ---------- site chrome : 플로팅 버튼 ---------- */
function renderFloating() {
  const wrap = document.createElement("div");
  wrap.className = "floating";
  wrap.innerHTML = `
    <button class="float-btn kakao" title="${t("ft.kakao")}" aria-label="${t("ft.kakao")}"><span class="material-symbols-outlined">chat_bubble</span><span>${t("float.chat")}</span></button>
    <button class="float-btn top" id="float-top" title="TOP" aria-label="TOP"><span class="material-symbols-outlined">arrow_upward</span><span>TOP</span></button>`;
  document.body.appendChild(wrap);
  wrap.querySelector(".kakao").addEventListener("click", () => showToast(t("toast.kakao")));
  wrap.querySelector("#float-top").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ---------- shared renderers ---------- */

/* 실제 이미지 파일 교체 전까지 사용하는 플레이스홀더 */
function phImg(alt = "", cls = "") {
  return `<span class="img-ph ${cls}" role="img" aria-label="${alt}"></span>`;
}

/* 이미지 경로가 있으면 실제 이미지, 없으면 플레이스홀더 */
function productImg(src, alt = "", cls = "") {
  return src ? `<img src="${src}" alt="${alt}" loading="lazy">` : phImg(alt, cls);
}

function shadeDotsHTML(product, max = 5) {
  const dots = product.shades
    .slice(0, max)
    .map((s) => `<span style="background:${s.hex}" title="${s.name}"></span>`)
    .join("");
  const more =
    product.shades.length > max
      ? `<i class="shade-more">+${product.shades.length - max}</i>`
      : "";
  return `<div class="shade-dots">${dots}${more}</div>`;
}

function priceHTML(product) {
  const rate = discountRate(product);
  if (!rate) return `<div class="price-row"><span class="price-sale">${formatPrice(product.price)}</span></div>`;
  return `
    <div class="price-row">
      <span class="price-list">${formatPrice(product.listPrice)}</span>
      <span class="price-rate">${rate}%</span>
      <span class="price-sale">${formatPrice(product.price)}</span>
    </div>`;
}

function reviewMetaHTML(product) {
  if (!product.reviewCount) return "";
  const count = product.reviewCount.toLocaleString(LANG === "en" ? "en-US" : "ko-KR");
  return `<p class="review-meta"><span class="stars">${starsHTML(product.rating)}</span>
          <b>${product.rating.toFixed(1)}</b> ${t("card.reviews")} <b>${count}</b></p>`;
}

function productCardHTML(product, rank = 0, badgeText = null) {
  const soon = !!product.comingSoon;
  const thumb = phImg(pName(product));
  const label = soon ? "COMING SOON" : badgeText || product.badge;
  const badge = label
    ? `<span class="badge ${soon ? "soon" : ""}">${label}</span>`
    : "";
  const rankTag = rank ? `<span class="rank-tag">${rank}</span>` : "";
  const btn = soon
    ? `<button class="quick-add" disabled>${t("btn.soon")}</button>`
    : `<button class="quick-add" data-quick-add="${product.id}">${t("btn.add")}</button>`;
  const link = soon ? "javascript:void(0)" : `product.html?id=${product.id}`;

  return `
    <article class="product-card">
      <a class="product-thumb" href="${link}">
        ${rankTag}${badge}
        ${thumb}
      </a>
      <div class="product-info">
        <a href="${link}">
          <h3 class="product-name">${pName(product)}</h3>
        </a>
        ${soon ? "" : shadeDotsHTML(product)}
        ${priceHTML(product)}
        ${soon ? "" : reviewMetaHTML(product)}
        <div class="product-bottom">${btn}</div>
      </div>
    </article>`;
}

function setCardHTML(set) {
  const items = set.items.map((it) => {
    const p = getProduct(it.productId);
    return { product: p, shade: getShade(p, it.shade) };
  });
  const original = items.reduce((s, it) => s + it.product.price, 0);
  const price = Math.round((original * (1 - set.discount)) / 100) * 100;
  const imgs = items
    .map((it) => phImg(`${pName(it.product)} ${it.shade.name}`, "small"))
    .join("");
  const composition = items
    .map((it) => `${pName(it.product)} [${it.shade.name}]`)
    .join(" + ");
  const desc = LANG === "en" && set.descEn ? set.descEn : set.desc;

  return `
    <article class="pair-card">
      <div class="pair-imgs"><span class="badge">${t("gnb.set")}</span>${imgs}</div>
      <h3 class="pair-name">${set.name}</h3>
      <p class="pair-desc">${desc}<br><small>${composition}</small></p>
      <div class="price-row center">
        <span class="price-list">${formatPrice(original)}</span>
        <span class="price-rate">${Math.round(set.discount * 100)}%</span>
        <span class="price-sale">${formatPrice(price)}</span>
      </div>
      <button class="btn btn-primary" style="padding:11px 26px;font-size:14px;margin-top:12px" data-add-set="${set.id}">${t("btn.addSet")}</button>
    </article>`;
}

function reviewCardHTML(review) {
  const product = getProduct(review.productId);
  return `
    <article class="review-card">
      <a class="review-thumb" href="product.html?id=${product.id}">
        ${phImg(`${pName(product)} ${review.shade}`)}
      </a>
      <div class="review-body">
        <p class="stars">${starsHTML(review.rating)}</p>
        <p class="review-text">${review.text}</p>
        <p class="review-product">${pName(product)} [${review.shade}]</p>
        <p class="review-user">${review.user} · ${review.date}</p>
      </div>
    </article>`;
}

function addSetToCart(setId) {
  const set = SETS.find((s) => s.id === setId);
  if (!set) return;
  const cart = getCart();
  set.items.forEach((it) => {
    const found = cart.find((c) => c.productId === it.productId && c.shade === it.shade);
    if (found) found.qty += 1;
    else cart.push({ productId: it.productId, shade: it.shade, qty: 1 });
  });
  saveCart(cart);
  showToast(
    LANG === "en"
      ? `[${set.name}] items added to your cart`
      : `[${set.name}] 구성품을 장바구니에 담았습니다`,
    true
  );
}

/* ---------- global event delegation ---------- */
document.addEventListener("click", (e) => {
  const quick = e.target.closest("[data-quick-add]");
  if (quick) {
    addToCart(quick.dataset.quickAdd, null, 1);
    return;
  }
  const setBtn = e.target.closest("[data-add-set]");
  if (setBtn) addSetToCart(setBtn.dataset.addSet);
});

renderHeader();
renderFooter();
renderFloating();
applyI18n();
