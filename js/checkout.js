/* ============================================================
   FLUSH checkout — 주문 요약, 배송지/결제수단(데모), 결제 완료 처리
   ============================================================ */

const checkoutItems = getCheckoutItems()
  .map((it) => ({ ...it, product: getProduct(it.productId) }))
  .filter((it) => it.product && getShade(it.product, it.shade));

// 체크아웃 항목 없이 직접 진입한 경우 (새로고침 등) 쇼핑몰로 돌려보냄
if (!checkoutItems.length) location.replace("shop.html");

function checkoutItemHTML(it) {
  const shade = getShade(it.product, it.shade);
  return `
    <div class="cart-item">
      <span class="cart-item-thumb">
        ${productImg(shade.img || it.product.img, `${pName(it.product)} ${shade.name}`, "small")}
      </span>
      <div>
        <p class="cart-item-name">${pName(it.product)}</p>
        <p class="cart-item-shade"><i style="background:${shade.hex}"></i>${shade.name}</p>
        <p class="checkout-item-qty">${LANG === "en" ? `Qty ${it.qty}` : `${it.qty}개`}</p>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">${formatPrice(it.product.price * it.qty)}</span>
      </div>
    </div>`;
}

function renderCheckout() {
  document.getElementById("checkout-item-count").textContent = `(${checkoutItems.length})`;
  document.getElementById("checkout-items").innerHTML = checkoutItems.map(checkoutItemHTML).join("");

  const subtotal = checkoutItems.reduce((s, it) => s + it.product.price * it.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;

  document.getElementById("co-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("co-shipping").innerHTML =
    shipping === 0 ? `<span class="free">${LANG === "en" ? "Free" : "무료"}</span>` : formatPrice(shipping);
  document.getElementById("co-point").textContent =
    "+" + Math.floor(subtotal * POINT_RATE).toLocaleString(LANG === "en" ? "en-US" : "ko-KR") + "P";
  document.getElementById("co-total").textContent = formatPrice(subtotal + shipping);
}

document.getElementById("checkout-submit").addEventListener("click", () => {
  const form = document.getElementById("ship-form");
  if (!form.reportValidity()) return;

  sessionStorage.removeItem(CHECKOUT_KEY);
  const orderNo = "FL" + Date.now().toString().slice(-8);
  document.getElementById("order-no").textContent = orderNo;
  document.getElementById("checkout-layout").hidden = true;
  document.getElementById("checkout-done").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderCheckout();
