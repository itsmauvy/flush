/* ============================================================
   FLUSH cart — items, qty control, free-shipping progress,
   order summary, demo checkout
   ============================================================ */

function cartItemHTML(item) {
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

function renderCart() {
  const cart = getCart();
  const empty = cart.length === 0;

  document.getElementById("cart-empty").hidden = !empty;
  document.getElementById("cart-layout").style.display = empty ? "none" : "";
  const toolsEl = document.getElementById("cart-tools");
  if (toolsEl) toolsEl.style.display = empty ? "none" : "";

  if (empty) {
    document.getElementById("cart-set-grid").innerHTML = SETS.map(setCardHTML).join("");
    return;
  }

  document.getElementById("cart-items").innerHTML = cart.map(cartItemHTML).join("");

  // 선택(체크)된 항목 기준으로 계산
  const selected = cart.filter((it) => !cartDeselected.has(cartKey(it)));
  const subtotal = selected.reduce((s, it) => {
    const p = getProduct(it.productId);
    return p ? s + p.price * it.qty : s;
  }, 0);

  const selall = document.getElementById("cart-page-selall");
  const selallLabel = document.getElementById("cart-page-selall-label");
  if (selall) selall.checked = selected.length === cart.length;
  if (selallLabel)
    selallLabel.textContent =
      LANG === "en" ? `All (${selected.length}/${cart.length})` : `전체 (${selected.length}/${cart.length})`;

  // 무료배송 진행바
  const remain = FREE_SHIPPING - subtotal;
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100));
  document.getElementById("ship-bar-fill").style.width = pct + "%";
  document.getElementById("ship-progress-text").innerHTML =
    remain > 0
      ? LANG === "en"
        ? `Add <em>${formatPrice(remain)}</em> for free shipping`
        : `<em>${formatPrice(remain)}</em> 추가 구매 시 무료배송`
      : LANG === "en"
        ? `Free shipping applied`
        : `무료배송이 적용됩니다`;

  // 주문 요약
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
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
  else if (e.target.closest("[data-cart-remove]")) { cartDeselected.delete(row.dataset.key); removeFromCart(pid, shade); }
  else return;

  renderCart();
});

// 개별 체크박스
document.getElementById("cart-items").addEventListener("change", (e) => {
  const chk = e.target.closest(".cart-item-check");
  if (!chk) return;
  const key = chk.closest(".cart-item").dataset.key;
  if (chk.checked) cartDeselected.delete(key);
  else cartDeselected.add(key);
  renderCart();
});

// 전체선택
document.getElementById("cart-page-selall").addEventListener("change", (e) => {
  cartDeselected.clear();
  if (!e.target.checked) getCart().forEach((it) => cartDeselected.add(cartKey(it)));
  renderCart();
});

// 선택삭제 (체크된 항목 제거, 남은 항목은 다시 전체선택)
document.getElementById("cart-page-del-selected").addEventListener("click", () => {
  if (!getCart().some((it) => !cartDeselected.has(cartKey(it)))) return;
  const survivors = getCart().filter((it) => cartDeselected.has(cartKey(it)));
  cartDeselected.clear();
  saveCart(survivors);
  renderCart();
});

// 전체삭제
document.getElementById("cart-page-del-all").addEventListener("click", () => {
  cartDeselected.clear();
  saveCart([]);
  renderCart();
});

// 세트 담기 후에도 목록이 바로 갱신되도록
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-add-set]")) renderCart();
});

// 구매하기 (선택 항목 결제, 미선택은 남김)
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (!getCart().some((it) => !cartDeselected.has(cartKey(it)))) return;
  const survivors = getCart().filter((it) => cartDeselected.has(cartKey(it)));
  cartDeselected.clear();
  showToast(t("toast.checkout"));
  saveCart(survivors);
  renderCart();
});

renderCart();
