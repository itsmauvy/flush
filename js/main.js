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
  renderCartDrawerContents();
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
  openCartDrawer();
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

/* ---------- checkout handoff (cart/product → checkout.html) ---------- */
const CHECKOUT_KEY = "flush-checkout";

function startCheckout(items) {
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(items));
  location.href = "checkout.html";
}

function getCheckoutItems() {
  try {
    return JSON.parse(sessionStorage.getItem(CHECKOUT_KEY)) || [];
  } catch {
    return [];
  }
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
          <a href="login.html" class="util-item util-join">
            <span class="util-icon"><span class="material-symbols-outlined">person</span></span><span>${t("top.login")}</span>
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
            ${CATEGORY_FILTERS.map(
              (f) =>
                `<a href="shop.html${f.id === "all" ? "" : `?category=${f.id}`}">${LANG === "en" ? f.labelEn : f.label}</a>`
            ).join("")}
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
        <a href="login.html"><span class="material-symbols-outlined">person</span>LOGIN</a>
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
    <button class="float-btn top" id="float-top" title="TOP" aria-label="TOP"><span class="material-symbols-outlined">arrow_upward</span><span>TOP</span></button>`;
  document.body.appendChild(wrap);
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

function shadeDotsHTML(product, activeImg = null) {
  // 전체 쉐이드 노출 (+N 생략). 카드가 지금 보여주는 쉐이드만 그 색으로 링,
  // 나머지는 기본(회색) 링 → "이 카드는 이 색" 을 바로 알 수 있게
  const dots = product.shades
    .map((s) => {
      const active = activeImg && s.img === activeImg;
      const style = active ? `background:${s.hex};--sh:${s.hex}` : `background:${s.hex}`;
      return `<span class="${active ? "is-active" : ""}" style="${style}" title="${s.name}" data-shade="${s.name}" data-hex="${s.hex}"></span>`;
    })
    .join("");
  return `<div class="shade-dots">${dots}</div>`;
}

/* 쉐이드 이미지 → 대응하는 모델컷 경로 (assets/models/<같은 이름>.jpg) */
function shadeModelSrc(shade) {
  if (!shade.img) return null;
  return shade.img
    .replace("assets/products/", "assets/models/")
    .replace(/\.(png|jpe?g|webp)$/i, ".jpg");
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

function productCardHTML(product, rank = 0, badgeText = null, imgOverride = null, cycle = false) {
  const soon = !!product.comingSoon;
  const effImg = imgOverride || product.img; // 카드가 실제로 보여주는 이미지(=쉐이드)
  const cardShade = product.shades.find((s) => s.img === effImg) || product.shades[0];
  const withImg = product.shades.filter((s) => s.img);
  const thumb = productImg(effImg, pName(product));
  // badgeText === false 면 뱃지 숨김
  const label = soon ? "COMING SOON" : badgeText === false ? null : badgeText || product.badge;
  const badge = label
    ? `<span class="badge ${soon ? "soon" : ""}">${label}</span>`
    : "";
  const rankTag = rank ? `<span class="rank-tag">${rank}</span>` : "";

  let model = "";
  let shadeNameEl = "";
  let dotsActive = effImg;
  if (!soon && cycle) {
    // shop : 제품의 쉐이드별 모델컷을 3초마다 순환 (shop.js 가 구동)
    model = `<span class="thumb-models">${withImg
      .map((s, i) => {
        const src = shadeModelSrc(s);
        return src
          ? `<img class="thumb-model ${i === 0 ? "on" : ""}" data-shade="${s.name}" src="${src}" alt="${pName(product)} ${s.name}" loading="lazy" onerror="this.remove()">`
          : "";
      })
      .join("")}</span>`;
    shadeNameEl = `<p class="card-shade-name">${withImg[0] ? withImg[0].name : ""}</p>`;
    dotsActive = withImg[0] ? withImg[0].img : effImg;
  } else if (!soon) {
    // new/best : 이 카드 쉐이드의 모델컷 하나만 (hover)
    const modelSrc = cardShade ? shadeModelSrc(cardShade) : null;
    model = modelSrc
      ? `<img class="thumb-model" src="${modelSrc}" alt="${pName(product)} 모델컷" loading="lazy" onerror="this.remove()">`
      : "";
  }

  const btn = soon
    ? `<button class="quick-add" disabled>${t("btn.soon")}</button>`
    : `<button class="quick-add" data-quick-add="${product.id}">${t("btn.add")}</button>`;
  const link = soon
    ? "javascript:void(0)"
    : `product.html?id=${product.id}${cardShade ? `&shade=${encodeURIComponent(cardShade.name)}` : ""}`;

  return `
    <article class="product-card${cycle ? " cycling" : ""}" data-pid="${product.id}">
      <a class="product-thumb" href="${link}">
        ${rankTag}${badge}
        ${thumb}
        ${model}
      </a>
      <div class="product-info">
        <a href="${link}">
          <h3 class="product-name">${pName(product)}</h3>
        </a>
        ${shadeNameEl}
        ${soon ? "" : shadeDotsHTML(product, dotsActive)}
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
    .map((it) => productImg(it.shade.img || it.product.img, `${pName(it.product)} ${it.shade.name}`, "small"))
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

/* ---------- 장바구니 사이드 패널 : 담기 즉시 확인 + 선택/삭제 + 구매 ---------- */
const cartDeselected = new Set(); // 체크 해제된 항목 key
const cartKey = (it) => `${it.productId}|${it.shade}`;

function cartDrawerItemHTML(item) {
  const product = getProduct(item.productId);
  if (!product) return "";
  const shade = getShade(product, item.shade);
  const key = cartKey(item);
  return `
    <div class="cart-item" data-pid="${product.id}" data-shade="${shade.name}" data-key="${key}">
      <label class="cart-check"><input type="checkbox" class="cart-item-check" ${cartDeselected.has(key) ? "" : "checked"} aria-label="select item"></label>
      <a class="cart-item-thumb" href="product.html?id=${product.id}">
        ${productImg(shade.img || product.img, `${pName(product)} ${shade.name}`, "small")}
      </a>
      <div>
        <a href="product.html?id=${product.id}"><p class="cart-item-name">${pName(product)}</p></a>
        <p class="cart-item-shade"><i style="background:${shade.hex}"></i>${shade.name}</p>
        <div class="qty-stepper">
          <button data-cart-minus aria-label="decrease">−</button>
          <output>${item.qty}</output>
          <button data-cart-plus aria-label="increase">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">${formatPrice(product.price * item.qty)}</span>
        <button class="cart-remove" data-cart-remove>${LANG === "en" ? "Remove" : "삭제"}</button>
      </div>
    </div>`;
}

function renderCartDrawerContents() {
  const itemsEl = document.getElementById("cart-drawer-items");
  const footEl = document.getElementById("cart-drawer-foot");
  if (!itemsEl || !footEl) return;

  const toolsEl = document.getElementById("cart-drawer-tools");
  const cart = getCart();
  if (!cart.length) {
    if (toolsEl) toolsEl.hidden = true;
    itemsEl.innerHTML = `
      <div class="cart-drawer-empty">
        <p>${t("cart.empty.title")}</p>
        <a class="btn btn-ghost" href="shop.html">${t("cart.empty.cta")}</a>
      </div>`;
    footEl.innerHTML = "";
    return;
  }

  if (toolsEl) toolsEl.hidden = false;
  itemsEl.innerHTML = cart.map(cartDrawerItemHTML).join("");

  // 선택(체크)된 항목 기준으로 금액 계산
  const selected = cart.filter((it) => !cartDeselected.has(cartKey(it)));
  const subtotal = selected.reduce((s, it) => {
    const p = getProduct(it.productId);
    return p ? s + p.price * it.qty : s;
  }, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const remain = FREE_SHIPPING - subtotal;

  const selall = document.getElementById("cart-selall");
  const selallLabel = document.getElementById("cart-selall-label");
  if (selall) selall.checked = selected.length === cart.length;
  if (selallLabel)
    selallLabel.textContent =
      LANG === "en" ? `All (${selected.length}/${cart.length})` : `전체 (${selected.length}/${cart.length})`;

  const shipMsg =
    subtotal === 0
      ? LANG === "en" ? "No items selected" : "선택된 상품이 없습니다"
      : remain > 0
        ? LANG === "en"
          ? `Add <em>${formatPrice(remain)}</em> for free shipping`
          : `<em>${formatPrice(remain)}</em> 추가 구매 시 무료배송`
        : LANG === "en"
          ? `Free shipping applied`
          : `무료배송이 적용됩니다`;

  footEl.innerHTML = `
    <p class="cart-drawer-ship">${shipMsg}</p>
    <div class="summary-row"><span>${t("cart.subtotal")}</span><b>${formatPrice(subtotal)}</b></div>
    <div class="summary-row"><span>${t("cart.shippingFee")}</span><b>${shipping === 0 ? (LANG === "en" ? "Free" : "무료") : formatPrice(shipping)}</b></div>
    <div class="summary-row total"><span>${t("cart.total")}</span><b>${formatPrice(subtotal + shipping)}</b></div>
    <div class="cart-drawer-actions">
      <a href="cart.html" class="btn btn-ghost">${t("toast.viewCart")}</a>
      <button class="btn btn-primary" id="cart-drawer-checkout"${selected.length ? "" : " disabled"}>${t("cart.checkout")}</button>
    </div>`;
}

function setCartDrawer(open) {
  const drawer = document.getElementById("cart-drawer");
  const dim = document.getElementById("cart-dim");
  if (!drawer) return;
  drawer.classList.toggle("open", open);
  dim.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function openCartDrawer() {
  renderCartDrawerContents();
  setCartDrawer(true);
}

/* 장바구니 페이지가 열려 있으면 목록도 함께 갱신 */
function syncCartPage() {
  if (typeof renderCart === "function" && document.getElementById("cart-items")) renderCart();
}

function renderCartDrawer() {
  if (document.getElementById("cart-drawer")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="drawer-dim" id="cart-dim"></div>
    <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-label="${t("hd.cart")}">
      <div class="cart-drawer-head">
        <h3>${t("cart.title")}</h3>
        <button class="drawer-close" id="cart-drawer-close" aria-label="close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="cart-drawer-tools" id="cart-drawer-tools" hidden>
        <label class="cart-selall"><input type="checkbox" id="cart-selall"><span id="cart-selall-label">${LANG === "en" ? "All" : "전체"}</span></label>
        <div class="cart-tool-btns">
          <button type="button" id="cart-del-selected">${LANG === "en" ? "Delete selected" : "선택삭제"}</button>
          <span class="tool-div">|</span>
          <button type="button" id="cart-del-all">${LANG === "en" ? "Clear all" : "전체삭제"}</button>
        </div>
      </div>
      <div class="cart-drawer-items" id="cart-drawer-items"></div>
      <div class="cart-drawer-foot" id="cart-drawer-foot"></div>
    </aside>`;
  while (wrap.firstElementChild) document.body.appendChild(wrap.firstElementChild);

  const itemsEl = document.getElementById("cart-drawer-items");

  document.getElementById("cart-drawer-close").addEventListener("click", () => setCartDrawer(false));
  document.getElementById("cart-dim").addEventListener("click", () => setCartDrawer(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setCartDrawer(false);
  });

  // 수량 조절 / 개별 삭제
  itemsEl.addEventListener("click", (e) => {
    const row = e.target.closest(".cart-item");
    if (!row) return;
    const { pid, shade } = row.dataset;
    const item = getCart().find((it) => it.productId === pid && it.shade === shade);
    if (!item) return;

    if (e.target.closest("[data-cart-minus]")) setCartQty(pid, shade, item.qty - 1);
    else if (e.target.closest("[data-cart-plus]")) setCartQty(pid, shade, Math.min(10, item.qty + 1));
    else if (e.target.closest("[data-cart-remove]")) { cartDeselected.delete(row.dataset.key); removeFromCart(pid, shade); }
    else return;

    syncCartPage();
  });

  // 개별 체크박스
  itemsEl.addEventListener("change", (e) => {
    const chk = e.target.closest(".cart-item-check");
    if (!chk) return;
    const key = chk.closest(".cart-item").dataset.key;
    if (chk.checked) cartDeselected.delete(key);
    else cartDeselected.add(key);
    renderCartDrawerContents();
  });

  // 전체선택
  document.getElementById("cart-selall").addEventListener("change", (e) => {
    cartDeselected.clear();
    if (!e.target.checked) getCart().forEach((it) => cartDeselected.add(cartKey(it)));
    renderCartDrawerContents();
  });

  // 선택삭제 (체크된 항목 제거, 남은 항목은 다시 전체선택)
  document.getElementById("cart-del-selected").addEventListener("click", () => {
    if (!getCart().some((it) => !cartDeselected.has(cartKey(it)))) return;
    const survivors = getCart().filter((it) => cartDeselected.has(cartKey(it)));
    cartDeselected.clear();
    saveCart(survivors);
    syncCartPage();
  });

  // 전체삭제
  document.getElementById("cart-del-all").addEventListener("click", () => {
    cartDeselected.clear();
    saveCart([]);
    syncCartPage();
  });

  // 구매하기 (선택 항목만 결제 페이지로, 미선택은 장바구니에 남김)
  document.getElementById("cart-drawer-foot").addEventListener("click", (e) => {
    if (!e.target.closest("#cart-drawer-checkout")) return;
    const cart = getCart();
    const selected = cart.filter((it) => !cartDeselected.has(cartKey(it)));
    if (!selected.length) return;
    const survivors = cart.filter((it) => cartDeselected.has(cartKey(it)));
    cartDeselected.clear();
    saveCart(survivors);
    startCheckout(selected);
  });

  updateCartBadge();
}

/* ---------- 담기 전 쉐이드 선택 팝오버 ---------- */
function closeShadePicker() {
  document.querySelector(".shade-picker")?.remove();
}

function openShadePicker(btn, productId) {
  const product = getProduct(productId);
  if (!product) return;
  const shades = product.shades.filter((s) => s.img);
  if (shades.length <= 1) {
    addToCart(productId, shades[0]?.name || null, 1);
    return;
  }
  const bottom = btn.closest(".product-bottom");
  const wasOpen = bottom.querySelector(".shade-picker");
  closeShadePicker();
  if (wasOpen) return; // 같은 버튼 재클릭 → 닫기

  const card = btn.closest(".product-card");
  const activeShade = card?.querySelector(".shade-dots .is-active")?.dataset.shade;
  const pop = document.createElement("div");
  pop.className = "shade-picker";
  pop.innerHTML = `
    <p class="shade-picker-title">${t("picker.title")}</p>
    ${shades
      .map(
        (s) => `<button type="button" class="shade-pick${s.name === activeShade ? " current" : ""}" data-pick-shade="${s.name}">
          <i style="background:${s.hex}"></i><span>${s.name}</span>
        </button>`
      )
      .join("")}`;
  bottom.appendChild(pop);
}

/* ---------- global event delegation ---------- */
document.addEventListener("click", (e) => {
  const pick = e.target.closest("[data-pick-shade]");
  if (pick) {
    const pid = pick.closest(".product-card")?.dataset.pid;
    if (pid) addToCart(pid, pick.dataset.pickShade, 1);
    closeShadePicker();
    return;
  }
  const quick = e.target.closest("[data-quick-add]");
  if (quick) {
    openShadePicker(quick, quick.dataset.quickAdd);
    return;
  }
  if (!e.target.closest(".shade-picker")) closeShadePicker();
  const setBtn = e.target.closest("[data-add-set]");
  if (setBtn) addSetToCart(setBtn.dataset.addSet);
});

renderHeader();
renderFooter();
renderFloating();
renderCartDrawer();
applyI18n();
