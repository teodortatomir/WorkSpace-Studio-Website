const menuOpen = document.querySelector(".menu-open");
const menuClose = document.querySelector(".menu-close");
const menuOverlay = document.querySelector(".menu-overlay");
const menuItems = document.querySelectorAll(".menu-nav-item");
const menuLinks = document.querySelectorAll(".menu-nav-item a");
const allVisuals = document.querySelectorAll(".menu-visual-item");

if (menuOpen && menuClose && menuOverlay) {
  const openMenu = () => {
    menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuOpen.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);

  menuOverlay.addEventListener("click", (event) => {
    if (event.target === menuOverlay) closeMenu();
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      allVisuals.forEach((visual) => visual.classList.remove("active"));
      const target = item.getAttribute("data-target");
      document.querySelectorAll(`.menu-visual-item[data-visual-target="${target}"]`).forEach((visual) => {
        visual.classList.add("active");
      });
    });
  });

  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
}

const productData = {
  flooring: {
    index: "Flooring",
    title: "The floor sets the rhythm of the workplace.",
    text: "We select flooring by durability, acoustic behaviour, maintenance, movement, visual zoning, and long-term replacement logic.",
    focus: "48% 50%",
    alt: "Flooring and architectural finish coordination"
  },
  partitions: {
    index: "Partitions",
    title: "Partitions define privacy without making the office feel closed.",
    text: "Glass, solid, modular, and demountable systems are coordinated with light, acoustic performance, fire requirements, and future reconfiguration.",
    focus: "58% 50%",
    alt: "Partition systems in a contemporary office"
  },
  pods: {
    index: "Office Pods",
    title: "Pods create rooms inside the room.",
    text: "Phone booths, focus rooms, and meeting pods add privacy and acoustic control while keeping the plan flexible and easy to adapt.",
    focus: "66% 50%",
    alt: "Office pods and focus room solutions"
  },
  acoustic: {
    index: "Acoustic Products",
    title: "Acoustic comfort should be designed, not patched later.",
    text: "Panels, baffles, screens, surfaces, and furniture-integrated acoustic elements are selected to support focus, meetings, and everyday concentration.",
    focus: "74% 50%",
    alt: "Acoustic products for workplace comfort"
  },
  details: {
    index: "Blinds, curtains, signage & other",
    title: "The final details make the workplace legible.",
    text: "Window blinds, curtains, signage, wayfinding, and specialist details complete the architectural layer and help the office feel coherent.",
    focus: "84% 50%",
    alt: "Workplace signage curtains and specialist architectural details"
  }
};

const productButtons = document.querySelectorAll(".arch-product-button");
const productIndex = document.getElementById("archProductIndex");
const productTitle = document.getElementById("archProductTitle");
const productText = document.getElementById("archProductText");
const productImage = document.getElementById("archProductImage");

const activateProduct = (button) => {
  const product = productData[button.dataset.product];
  if (!product) return;

  productButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
  });

  if (productIndex) productIndex.textContent = product.index;
  if (productTitle) productTitle.textContent = product.title;
  if (productText) productText.textContent = product.text;
  if (productImage) {
    productImage.style.objectPosition = product.focus;
    productImage.alt = product.alt;
  }
};

productButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => activateProduct(button));
  button.addEventListener("focus", () => activateProduct(button));
  button.addEventListener("click", () => activateProduct(button));
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

revealElements.forEach((element) => revealObserver.observe(element));
