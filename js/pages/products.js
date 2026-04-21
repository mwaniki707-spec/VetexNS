// Products page renderer

const BADGE_CLASSES = {
  default: "bg-gray-700 text-gray-300",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
};

function badge(text, variant = "default", extraClass = "") {
  const cls = BADGE_CLASSES[variant] || BADGE_CLASSES.default;
  return `<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls} ${extraClass}">${text}</span>`;
}

function categoryVariant(category) {
  if (category === "Hardware") return "info";
  if (category === "Software") return "success";
  return "warning";
}

function renderProducts() {
  const mount = document.getElementById("products-list");
  if (!mount) return;

  mount.innerHTML = PRODUCTS.map((product, index) => {
    const reverse = index % 2 === 1 ? "lg:flex-row-reverse" : "";
    const priceSuffix = product.category === "Software" ? "/year" : "one-time";

    const featuresList = product.features
      .map(
        (f) => `
          <li class="flex items-start gap-2 text-sm text-gray-300">
            <span class="mt-0.5 text-cyan-400 shrink-0">${icon("check-circle", { size: 16 })}</span>
            ${f}
          </li>`
      )
      .join("");

    return `
      <div class="flex flex-col gap-12 lg:flex-row lg:items-center ${reverse}">
        <div class="flex-1">
          <div class="relative rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-12 flex items-center justify-center min-h-[320px]">
            <div class="absolute inset-0 rounded-2xl grid-bg opacity-20"></div>
            <div class="relative animate-float">
              <div class="flex h-32 w-32 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-500/20 animate-pulse-glow">
                <span class="text-cyan-400">${icon(product.icon, { size: 48 })}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 space-y-6">
          <div class="flex items-center gap-3">
            ${badge(product.category, categoryVariant(product.category))}
          </div>
          <h2 class="text-3xl font-bold text-white">${product.name}</h2>
          <p class="text-lg text-gray-400 leading-relaxed">${product.description}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-bold text-cyan-400">$${product.price.toLocaleString()}</span>
            <span class="text-gray-500">${priceSuffix}</span>
          </div>
          <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">${featuresList}</ul>
          <div class="flex gap-4">
            <a href="contact.html" class="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400">
              Request Quote
              ${icon("arrow-right", { size: 16 })}
            </a>
            <a href="contact.html" class="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-gray-500 hover:text-white">
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
