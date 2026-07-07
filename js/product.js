/* ============================================================
   FLUSH product detail — 쉐이드 전환, 수량, 장바구니,
   상품정보/구매후기/배송안내 탭, 립<->치크 조합 추천
   ============================================================ */

const params = new URLSearchParams(location.search);
const product = getProduct(params.get("id")) || PRODUCTS[0];
let selectedShade = product.shades[0] || null;
let qty = 1;

// 출시 예정 제품으로 직접 진입한 경우 shop으로 돌려보냄
if (product.comingSoon) location.replace("shop.html");

const VOLUMES = {
  "lip-tint": "4.5g / 0.15oz",
  "lip-balm": "3.4g / 0.12oz",
  "lip-liner": "0.25g × 1ea",
  "cream-blush": "3.2g / 0.11oz",
  "powder-blush": "4.0g / 0.14oz",
};

function renderShadePicker() {
  document.getElementById("pd-shades").innerHTML = product.shades
    .map(
      (s) => `<button class="shade-swatch ${s === selectedShade ? "active" : ""}"
                style="background:${s.hex}" title="${s.name}"
                aria-label="${s.name}" data-shade="${s.name}"></button>`
    )
    .join("");
  document.getElementById("pd-shade-name").textContent = selectedShade
    ? selectedShade.name
    : "-";
}

function renderReviews() {
  const reviews = getReviews(product.id);
  const count = product.reviewCount.toLocaleString(LANG === "en" ? "en-US" : "ko-KR");
  document.getElementById("tab-review-count").textContent = count;
  document.getElementById("rv-score").textContent = product.rating.toFixed(1);
  document.getElementById("rv-stars").textContent = starsHTML(product.rating);
  document.getElementById("rv-count-text").textContent =
    LANG === "en"
      ? `Latest of ${count} verified reviews`
      : `전체 구매후기 ${count}건 중 최신 후기예요`;

  document.getElementById("pd-review-list").innerHTML = reviews.length
    ? reviews
        .map((r) => {
          return `
          <div class="pd-review-item">
            <span class="rv-thumb">${phImg(`${pName(product)} ${r.shade}`, "small")}</span>
            <div>
              <p class="stars">${starsHTML(r.rating)}</p>
              <p class="rv-opt">${LANG === "en" ? "Option" : "옵션"} : ${r.shade}</p>
              <p class="rv-text">${r.text}</p>
              <p class="rv-user">${r.user} · ${r.date}</p>
            </div>
          </div>`;
        })
        .join("")
    : `<p class="empty-note">${LANG === "en" ? "No reviews yet." : "아직 등록된 후기가 없어요."}</p>`;
}

function renderProduct() {
  document.title =
    LANG === "en" ? `${product.name} — FLUSH Official Store` : `${product.nameKo} — 플러쉬 FLUSH 공식몰`;
  document.getElementById("pd-cat").textContent = product.catLabel;
  document.getElementById("pd-name").textContent = pName(product);
  document.getElementById("pd-name-en").textContent = pNameSub(product);
  const rvCount = product.reviewCount.toLocaleString(LANG === "en" ? "en-US" : "ko-KR");
  document.getElementById("pd-review-meta").innerHTML =
    LANG === "en"
      ? `<span class="stars">${starsHTML(product.rating)}</span> <b>${product.rating.toFixed(1)}</b>
         · <b>${rvCount}</b> reviews`
      : `<span class="stars">${starsHTML(product.rating)}</span> <b>${product.rating.toFixed(1)}</b>
         · 구매후기 <b>${rvCount}</b>건`;

  const rate = discountRate(product);
  document.getElementById("pd-price").innerHTML = rate
    ? `<span class="price-list" style="font-size:15px">${formatPrice(product.listPrice)}</span>
       <span class="price-rate" style="font-size:24px">${rate}%</span>
       <span class="price-sale" style="font-size:24px">${formatPrice(product.price)}</span>`
    : `<span class="price-sale" style="font-size:24px">${formatPrice(product.price)}</span>`;

  document.getElementById("pd-desc").textContent = pDesc(product);

  const point = formatPrice(Math.floor(product.price * POINT_RATE));
  document.getElementById("pd-benefit").innerHTML =
    LANG === "en"
      ? `<p><b>Points</b><span>Earn <em>${point}</em> on this purchase (1%)</span></p>
         <p><b>Shipping</b><span>₩3,000 · <em>free over ₩30,000</em></span></p>
         <p><b>Delivery</b><span>Same-day dispatch for weekday orders before 2 PM</span></p>`
      : `<p><b>적립금</b><span>구매 시 <em>${point}</em> 적립 (1%)</span></p>
         <p><b>배송비</b><span>3,000원 · <em>30,000원 이상 무료배송</em></span></p>
         <p><b>배송기간</b><span>평일 오후 2시 이전 주문 시 당일 출고</span></p>`;

  if (VOLUMES[product.id]) {
    document.getElementById("info-volume").textContent = VOLUMES[product.id];
  }

  if (selectedShade) {
    document.getElementById("pd-img").setAttribute(
      "aria-label", `${pName(product)} ${selectedShade.name}`
    );
  }
  renderShadePicker();
  renderReviews();

  document.getElementById("pd-texture-points").innerHTML = product.texturePoints
    .map(
      (tp) => `<div class="texture-point">
                <span class="tp-emoji">${tp.emoji}</span>
                <h3>${LANG === "en" && tp.titleEn ? tp.titleEn : tp.title}</h3>
                <p>${LANG === "en" && tp.textEn ? tp.textEn : tp.text}</p>
              </div>`
    )
    .join("");
  document.getElementById("pd-texture").hidden = product.texturePoints.length === 0;

  document.getElementById("pd-pairs").innerHTML = product.pairsWith
    .map(getProduct)
    .filter(Boolean)
    .map((p) => productCardHTML(p))
    .join("");
}

function selectShade(name) {
  selectedShade = getShade(product, name);
  document.getElementById("pd-img").setAttribute(
    "aria-label", `${pName(product)} ${selectedShade.name}`
  );
  renderShadePicker();
}

/* ---------- events ---------- */
document.getElementById("pd-shades").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-shade]");
  if (btn) selectShade(btn.dataset.shade);
});

document.getElementById("qty-minus").addEventListener("click", () => {
  qty = Math.max(1, qty - 1);
  document.getElementById("qty-value").textContent = qty;
});

document.getElementById("qty-plus").addEventListener("click", () => {
  qty = Math.min(10, qty + 1);
  document.getElementById("qty-value").textContent = qty;
});

document.getElementById("pd-add").addEventListener("click", () => {
  if (!selectedShade) return;
  addToCart(product.id, selectedShade.name, qty);
});

document.getElementById("pd-buy-now").addEventListener("click", () => {
  if (!selectedShade) return;
  addToCart(product.id, selectedShade.name, qty);
  location.href = "cart.html";
});

document.getElementById("pd-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tab]");
  if (!tab) return;
  document.querySelectorAll(".pd-tab").forEach((t) => t.classList.toggle("active", t === tab));
  ["info", "review", "shipping"].forEach((k) => {
    document.getElementById(`panel-${k}`).hidden = k !== tab.dataset.tab;
  });
});

renderProduct();
