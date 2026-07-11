/* ============================================================
   FLUSH shop — 카테고리 필터, 정렬, 검색어(q), URL 쿼리 동기화
   ============================================================ */

const CATEGORY_FILTERS = [
  { id: "all", label: "전체", labelEn: "All" },
  { id: "lip", label: "립 전체", labelEn: "All Lip" },
  { id: "lip-tint", label: "립 틴트", labelEn: "Lip Tint" },
  { id: "lip-balm", label: "립 밤", labelEn: "Lip Balm" },
  { id: "lip-liner", label: "립 라이너", labelEn: "Lip Liner" },
  { id: "cheek", label: "치크", labelEn: "Cheek" },
  { id: "cream-blush", label: "크림 블러셔", labelEn: "Cream Blush" },
  { id: "powder-blush", label: "파우더 블러셔", labelEn: "Powder Blush" },
];

function catLabel(f) {
  return LANG === "en" ? f.labelEn : f.label;
}

const SORTS = {
  popular: (a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.reviewCount - a.reviewCount,
  review: (a, b) => b.reviewCount - a.reviewCount,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

const state = {
  category: "all",
  sort: "popular",
  q: "",
};

function readQuery() {
  const params = new URLSearchParams(location.search);
  const cat = params.get("category");
  const q = params.get("q");
  if (cat && CATEGORY_FILTERS.some((f) => f.id === cat)) state.category = cat;
  if (q) state.q = q.trim();
}

function writeQuery() {
  const params = new URLSearchParams();
  if (state.category !== "all") params.set("category", state.category);
  if (state.q) params.set("q", state.q);
  const qs = params.toString();
  history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

function matchCategory(product) {
  if (state.category === "all") return true;
  if (state.category === "lip" || state.category === "cheek") {
    return product.category === state.category;
  }
  return product.id === state.category;
}

/* 한글 검색어 → 영문 쉐이드/무드 별칭 */
const KO_ALIASES = {
  "코랄": "coral", "로즈": "rose", "베리": "berry", "핑크": "pink", "누드": "nude",
  "체리": "cherry", "구아바": "guava", "탠저린": "tangerine", "바이올렛": "violet",
  "피치": "peach", "와인": "wine", "모브": "mauve",
  "틴트": "tint", "립밤": "balm", "라이너": "liner", "블러셔": "blush", "블러쉬": "blush",
};

function matchQuery(product) {
  if (!state.q) return true;
  let q = state.q.toLowerCase();
  for (const [ko, en] of Object.entries(KO_ALIASES)) q = q.replaceAll(ko, en);

  const haystack = [
    product.name,
    product.nameKo,
    ...product.shades.map((s) => s.name),
    ...product.shades.map((s) => s.mood),
  ].join(" ").toLowerCase();

  return q.split(/\s+/).filter(Boolean).every((token) => haystack.includes(token));
}

function renderFilters() {
  document.getElementById("filter-category").innerHTML = CATEGORY_FILTERS.map(
    (f) => `<button class="filter-btn ${state.category === f.id ? "active" : ""}"
              data-filter-cat="${f.id}">${catLabel(f)}</button>`
  ).join("");
}

function renderGrid() {
  const list = PRODUCTS.filter((p) => matchCategory(p) && matchQuery(p))
    .sort(SORTS[state.sort] || SORTS.popular);
  document.getElementById("result-bar-text").innerHTML =
    LANG === "en"
      ? `<strong>${list.length}</strong> item${list.length === 1 ? "" : "s"}`
      : `총 <strong>${list.length}</strong>개의 상품`;
  document.getElementById("shop-grid").innerHTML = list.map((p) => productCardHTML(p, 0, null, null, true)).join("");
  document.getElementById("empty-note").hidden = list.length > 0;
  startShopCycles();

  const title = document.getElementById("shop-title");
  if (state.q) {
    title.textContent = LANG === "en" ? `Results for '${state.q}'` : `'${state.q}' 검색결과`;
  } else {
    const cat = CATEGORY_FILTERS.find((f) => f.id === state.category);
    title.textContent = state.category === "all" ? t("shop.title") : catLabel(cat);
  }
}

/* shop 카드 : 제품의 쉐이드별 모델컷을 3초마다 순환 + 쉐이드 도트/색상명 동기화 */
let shopCycTimers = [];
function stopShopCycles() {
  shopCycTimers.forEach(clearInterval);
  shopCycTimers = [];
}
function startShopCycles() {
  stopShopCycles();
  document.querySelectorAll(".product-card.cycling").forEach((card) => {
    const models = [...card.querySelectorAll(".thumb-model")];
    if (models.length <= 1) return;
    const dots = [...card.querySelectorAll(".shade-dots span")];
    const nameEl = card.querySelector(".card-shade-name");
    let i = 0;
    const timer = setInterval(() => {
      if (!card.isConnected) return clearInterval(timer);
      i = (i + 1) % models.length;
      const shade = models[i].dataset.shade;
      models.forEach((m, k) => m.classList.toggle("on", k === i));
      dots.forEach((d) => {
        const on = d.dataset.shade === shade;
        d.classList.toggle("is-active", on);
        if (on) d.style.setProperty("--sh", d.dataset.hex);
        else d.style.removeProperty("--sh");
      });
      if (nameEl) nameEl.textContent = shade;
    }, 3000);
    shopCycTimers.push(timer);
  });
}

function rerender() {
  writeQuery();
  renderFilters();
  renderGrid();
}

document.addEventListener("click", (e) => {
  const cat = e.target.closest("[data-filter-cat]");
  if (cat) {
    state.category = cat.dataset.filterCat;
    rerender();
    return;
  }
  if (e.target.closest("#filter-clear")) {
    state.category = "all";
    state.q = "";
    document.getElementById("sort-select").value = state.sort = "popular";
    rerender();
  }
});

document.getElementById("sort-select").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderGrid();
});

readQuery();
renderFilters();
renderGrid();
