/* ============================================================
   FLUSH cart — items, qty control, free-shipping progress,
   order summary, demo checkout
   ============================================================ */

const SHIPPING_FEE = 3000;

function cartItemHTML(item) {
  const product = getProduct(item.productId);
  if (!product) return "";
  const shade = getShade(product, item.shade);
  return `
    <div class="cart-item" data-pid="${product.id}" data-shade="${shade.name}">
      <a class="cart-item-thumb" href="product.html?id=${product.id}">
        ${phImg(`${pName(product)} ${shade.name}`, "small")}
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

function renderCart() {
  const cart = getCart();
  const empty = cart.length === 0;

  document.getElementById("cart-empty").hidden = !empty;
  document.getElementById("cart-layout").style.display = empty ? "none" : "";

  if (empty) {
    document.getElementById("cart-set-grid").innerHTML = SETS.map(setCardHTML).join("");
    return;
  }

  document.getElementById("cart-items").innerHTML = cart.map(cartItemHTML).join("");

  // 무료배송 진행바
  const subtotal = cartTotalPrice();
  const remain = FREE_SHIPPING - subtotal;
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100));
  document.getElementById("ship-bar-fill").style.width = pct + "%";
  document.getElementById("ship-progress-text").innerHTML =
    remain > 0
      ? LANG === "en"
        ? `Add <em>${formatPrice(remain)}</em> more for free shipping!`
        : `<em>${formatPrice(remain)}</em>만 더 담으면 무료배송이에요!`
      : LANG === "en"
        ? `🎉 You've unlocked <em>free shipping</em>!`
        : `🎉 <em>무료배송</em> 조건을 채웠어요!`;

  // 주문 요약
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  document.getElementById("sum-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("sum-shipping").innerHTML =
    shipping === 0
      ? `<span class="free">${LANG === "en" ? "Free" : "무료"}</span>`
      : formatPrice(shipping);
  document.getElementById("sum-point").textContent =
    "+" + Math.floor(subtotal * POINT_RATE).toLocaleString(LANG === "en" ? "en-US" : "ko-KR") + "P";
  document.getElementById("sum-total").textContent = formatPrice(subtotal + shipping);

  document.getElementById("cart-set-grid").innerHTML = SETS.map(setCardHTML).join("");
}

document.getElementById("cart-items").addEventListener("click", (e) => {
  const row = e.target.closest(".cart-item");
  if (!row) return;
  const { pid, shade } = row.dataset;
  const item = getCart().find((it) => it.productId === pid && it.shade === shade);
  if (!item) return;

  if (e.target.closest("[data-cart-minus]")) setCartQty(pid, shade, item.qty - 1);
  else if (e.target.closest("[data-cart-plus]")) setCartQty(pid, shade, Math.min(10, item.qty + 1));
  else if (e.target.closest("[data-cart-remove]")) removeFromCart(pid, shade);
  else return;

  renderCart();
});

// 세트 담기 후에도 목록이 바로 갱신되도록
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-add-set]")) renderCart();
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  showToast(t("toast.checkout"));
  saveCart([]);
  renderCart();
});

renderCart();
