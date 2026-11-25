const MENU_ITEMS = [
  {
    id: "velvet-latte",
    name: "Velvet Honey Latte",
    category: "espresso",
    price: 5.25,
    description: "Double ristretto, steamed milk, and local wildflower honey with a hint of cinnamon.",
    image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oat-cortado",
    name: "Double Oat Cortado",
    category: "espresso",
    price: 4.5,
    description: "Equal parts bold house espresso and silky barista oat milk for a balanced finish.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "classic-americano",
    name: "House Americano",
    category: "espresso",
    price: 3.75,
    description: "Rich espresso pulled over hot filtered water with dark cocoa and roasted almond notes.",
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "slow-cold-brew",
    name: "18-Hour Cold Brew",
    category: "cold-brew",
    price: 4.75,
    description: "Smooth, low-acid cold steep served over crystal ice with subtle chocolate depth.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "vanilla-sweet-cream",
    name: "Vanilla Bean Cold Brew",
    category: "cold-brew",
    price: 5.5,
    description: "Cold brew topped with house-whipped Madagascar vanilla sweet cream.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cardamom-croissant",
    name: "Cardamom Butter Croissant",
    category: "pastries",
    price: 4.25,
    description: "Flaky laminated pastry infused with freshly ground green cardamom and pearl sugar.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
  }
];

const TAX_RATE = 0.08;
let activeCategory = "all";
let cart = [];

const menuGrid = document.getElementById("menuGrid");
const categoryFilters = document.getElementById("categoryFilters");
const cartCountBadge = document.getElementById("cartCountBadge");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSummarySection = document.getElementById("cartSummarySection");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTaxEl = document.getElementById("cartTax");
const cartTotalEl = document.getElementById("cartTotal");
const pickupNameInput = document.getElementById("pickupNameInput");
const pickupNameFeedback = document.getElementById("pickupNameFeedback");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const quickAddComboBtn = document.getElementById("quickAddComboBtn");
const contactForm = document.getElementById("contactForm");
const contactAlertBox = document.getElementById("contactAlertBox");

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderMenu() {
  const filtered =
    activeCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  menuGrid.innerHTML = filtered
    .map(
      (item) => `
      <div class="col-md-6 col-lg-4">
        <div class="card menu-card h-100 shadow-sm">
          <div class="menu-img-wrap">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
              <h3 class="h5 fw-bold mb-0">${item.name}</h3>
              <span class="fw-bold text-espresso fs-6">${formatPrice(item.price)}</span>
            </div>
            <p class="card-text text-muted small flex-grow-1 mb-3">${item.description}</p>
            <button
              type="button"
              class="btn btn-dark w-100 add-to-cart-btn"
              data-id="${item.id}"
            >
              <i class="bi bi-plus-circle me-1"></i> Add to Order
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function addToCart(itemId) {
  const menuItem = MENU_ITEMS.find((entry) => entry.id === itemId);
  if (!menuItem) return;

  const existing = cart.find((entry) => entry.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...menuItem, qty: 1 });
  }
  renderCart();
}

function updateQty(itemId, delta) {
  const target = cart.find((entry) => entry.id === itemId);
  if (!target) return;

  target.qty += delta;
  if (target.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== itemId);
  }
  renderCart();
}

function renderCart() {
  const totalCount = cart.reduce((sum, entry) => sum + entry.qty, 0);
  cartCountBadge.textContent = totalCount;

  if (cart.length === 0) {
    cartSummarySection.classList.add("d-none");
    cartItemsContainer.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="bi bi-cup-hot display-4 d-block mb-2 opacity-50"></i>
        <p class="mb-0">Your pickup bag is currently empty.</p>
      </div>
    `;
    return;
  }

  cartSummarySection.classList.remove("d-none");
  cartItemsContainer.innerHTML = cart
    .map(
      (entry) => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-3 gap-2">
        <div>
          <div class="fw-semibold">${entry.name}</div>
          <div class="small text-muted">${formatPrice(entry.price)} each</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary qty-btn"
            data-id="${entry.id}"
            data-delta="-1"
            aria-label="Decrease quantity"
          >-</button>
          <span class="fw-semibold px-1">${entry.qty}</span>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary qty-btn"
            data-id="${entry.id}"
            data-delta="1"
            aria-label="Increase quantity"
          >+</button>
        </div>
      </div>
    `
    )
    .join("");

  const subtotal = cart.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  cartSubtotalEl.textContent = formatPrice(subtotal);
  cartTaxEl.textContent = formatPrice(tax);
  cartTotalEl.textContent = formatPrice(total);
}

categoryFilters.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn-filter");
  if (!btn) return;

  activeCategory = btn.dataset.category;
  categoryFilters.querySelectorAll(".btn-filter").forEach((el) => {
    el.classList.toggle("active", el === btn);
  });
  renderMenu();
});

menuGrid.addEventListener("click", (event) => {
  const btn = event.target.closest(".add-to-cart-btn");
  if (!btn) return;
  addToCart(btn.dataset.id);
});

quickAddComboBtn.addEventListener("click", () => {
  addToCart("oat-cortado");
});

cartItemsContainer.addEventListener("click", (event) => {
  const btn = event.target.closest(".qty-btn");
  if (!btn) return;
  updateQty(btn.dataset.id, Number(btn.dataset.delta));
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});

placeOrderBtn.addEventListener("click", () => {
  const customerName = pickupNameInput.value.trim();
  if (!customerName) {
    pickupNameInput.classList.add("is-invalid");
    pickupNameFeedback.style.display = "block";
    return;
  }

  pickupNameInput.classList.remove("is-invalid");
  pickupNameFeedback.style.display = "none";

  const orderNumber = Math.floor(100 + Math.random() * 900);
  const itemSummary = cart.map((i) => `${i.qty}x ${i.name}`).join(", ");

  document.getElementById("orderConfirmationText").textContent =
    `Thanks, ${customerName}! Order #${orderNumber} (${itemSummary}) will be ready for pickup in about 10 minutes.`;

  const offcanvasInstance = bootstrap.Offcanvas.getInstance(document.getElementById("cartOffcanvas"));
  if (offcanvasInstance) offcanvasInstance.hide();

  const modalInstance = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
  modalInstance.show();

  cart = [];
  pickupNameInput.value = "";
  renderCart();
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.classList.add("was-validated");
    return;
  }

  const nameVal = document.getElementById("contactName").value.trim();
  contactAlertBox.className = "alert alert-success rounded-3 mb-4";
  contactAlertBox.textContent = `Thank you, ${nameVal}! Your message has been received by Aroma & Bean.`;
  contactAlertBox.classList.remove("d-none");

  contactForm.reset();
  contactForm.classList.remove("was-validated");
});

document.getElementById("yearSpan").textContent = new Date().getFullYear();
renderMenu();
renderCart();
