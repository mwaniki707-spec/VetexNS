// Shared app scaffolding: navbar, footer, and cross-page helpers.

function getCurrentPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path;
}

function isActiveLink(link) {
  const current = getCurrentPage();
  return link.match.some((m) => m === current);
}

function renderNavbar() {
  const navMount = document.getElementById("navbar");
  if (!navMount) return;

  const user = getSessionUser();
  const authed = !!user;
  const firstName = authed ? (user.name || "").split(" ")[0] : "";

  const desktopLinks = NAV_LINKS.map((link) => {
    const active = isActiveLink(link);
    const cls = active
      ? "bg-cyan-500/10 text-cyan-400"
      : "text-gray-300 hover:bg-white/5 hover:text-white";
    return `<a href="${link.href}" class="rounded-lg px-4 py-2 text-sm font-medium transition-colors ${cls}">${link.label}</a>`;
  }).join("");

  const adminDesktopLink = authed && user.role === "admin"
    ? `<a href="admin.html" class="flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/20" title="Admin panel">
        ${icon("shield", { size: 16 })}
        Admin
      </a>`
    : "";

  const desktopAuth = authed
    ? `
      ${adminDesktopLink}
      <a href="dashboard.html" class="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20">
        ${icon("user", { size: 16 })}
        ${firstName}
      </a>
      <button data-logout class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white" aria-label="Sign out">
        ${icon("log-out", { size: 16 })}
      </button>
    `
    : `
      <a href="login.html" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white">Sign In</a>
      <a href="register.html" class="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-cyan-400">Get Started</a>
    `;

  const mobileLinks = NAV_LINKS.map((link) => {
    const active = isActiveLink(link);
    const cls = active
      ? "bg-cyan-500/10 text-cyan-400"
      : "text-gray-300 hover:bg-white/5 hover:text-white";
    return `<a href="${link.href}" class="block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${cls}">${link.label}</a>`;
  }).join("");

  const adminMobileLink = authed && user.role === "admin"
    ? `<a href="admin.html" class="block rounded-lg bg-purple-500/10 px-4 py-3 text-sm font-medium text-purple-300">Admin Panel</a>`
    : "";

  const mobileAuth = authed
    ? `
      ${adminMobileLink}
      <a href="dashboard.html" class="block rounded-lg bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-400">Dashboard</a>
      <button data-logout class="block w-full rounded-lg px-4 py-3 text-left text-sm text-gray-400 hover:text-white">Sign Out</button>
    `
    : `
      <a href="login.html" class="block rounded-lg px-4 py-3 text-sm font-medium text-gray-300">Sign In</a>
      <a href="register.html" class="block rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-gray-950">Get Started</a>
    `;

  navMount.innerHTML = `
    <nav class="fixed top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <a href="index.html" class="flex items-center gap-2 group">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
              <span class="text-cyan-400">${icon("shield", { size: 20 })}</span>
            </div>
            <span class="text-lg font-bold text-white">Vertex<span class="text-cyan-400">NS</span></span>
          </a>

          <div class="hidden md:flex md:items-center md:gap-1">${desktopLinks}</div>

          <div class="hidden md:flex md:items-center md:gap-3">${desktopAuth}</div>

          <button id="mobile-menu-toggle" class="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 md:hidden hover:bg-white/5 hover:text-white" aria-label="Toggle menu">
            <span id="mobile-menu-icon-open">${icon("menu", { size: 24 })}</span>
            <span id="mobile-menu-icon-close" hidden>${icon("x", { size: 24 })}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-xl md:hidden" hidden>
        <div class="space-y-1 px-4 py-4">
          ${mobileLinks}
          <div class="border-t border-gray-800 pt-4 mt-4 space-y-2">
            ${mobileAuth}
          </div>
        </div>
      </div>
    </nav>
  `;

  // Hook mobile menu toggle
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const openIcon = document.getElementById("mobile-menu-icon-open");
  const closeIcon = document.getElementById("mobile-menu-icon-close");
  toggleBtn.addEventListener("click", () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    openIcon.hidden = !isOpen;
    closeIcon.hidden = isOpen;
  });

  // Hook logout buttons
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      authLogout();
      window.location.href = "index.html";
    });
  });
}

function renderFooter() {
  const mount = document.getElementById("footer");
  if (!mount) return;

  const servicesList = [
    "Network Architecture",
    "Security & Monitoring",
    "Cloud Deployment",
    "Managed IT Services",
  ]
    .map(
      (item) =>
        `<li><a href="services.html" class="text-sm text-gray-400 transition-colors hover:text-cyan-400">${item}</a></li>`
    )
    .join("");

  const companyList = [
    { label: "About Us", href: "about.html" },
    { label: "Products", href: "products.html" },
    { label: "Contact", href: "contact.html" },
    { label: "Dashboard", href: "dashboard.html" },
  ]
    .map(
      (item) =>
        `<li><a href="${item.href}" class="text-sm text-gray-400 transition-colors hover:text-cyan-400">${item.label}</a></li>`
    )
    .join("");

  mount.innerHTML = `
    <footer class="border-t border-gray-800/50 bg-gray-950">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-4">
            <a href="index.html" class="flex items-center gap-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <span class="text-cyan-400">${icon("shield", { size: 20 })}</span>
              </div>
              <span class="text-lg font-bold text-white">Vertex<span class="text-cyan-400">NS</span></span>
            </a>
            <p class="text-sm text-gray-400 leading-relaxed">
              Enterprise networking, cybersecurity, and cloud infrastructure solutions for businesses that demand reliability and security.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300">Services</h3>
            <ul class="mt-4 space-y-3">${servicesList}</ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300">Company</h3>
            <ul class="mt-4 space-y-3">${companyList}</ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300">Contact</h3>
            <ul class="mt-4 space-y-3">
              <li class="flex items-start gap-3">
                <span class="mt-0.5 text-cyan-400 shrink-0">${icon("mail", { size: 16 })}</span>
                <span class="text-sm text-gray-400">contact@vertexns.com</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-0.5 text-cyan-400 shrink-0">${icon("phone", { size: 16 })}</span>
                <span class="text-sm text-gray-400">+1 (555) 234-5678</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-0.5 text-cyan-400 shrink-0">${icon("map-pin", { size: 16 })}</span>
                <span class="text-sm text-gray-400">456 Cyber Lane, Suite 200<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 border-t border-gray-800/50 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-500">&copy; ${new Date().getFullYear()} Vertex Network Solutions. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="contact.html" class="text-sm text-gray-500 transition-colors hover:text-gray-300">Privacy Policy</a>
            <a href="contact.html" class="text-sm text-gray-500 transition-colors hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Shared UI helpers
function renderFieldError(fieldId, message) {
  const errEl = document.querySelector(`[data-error-for="${fieldId}"]`);
  const input = document.getElementById(fieldId);
  if (errEl) {
    errEl.textContent = message || "";
    errEl.hidden = !message;
  }
  if (input) {
    if (message) {
      input.classList.remove("border-gray-600", "focus:border-cyan-500", "focus:ring-cyan-500");
      input.classList.add("border-red-500", "focus:ring-red-500");
    } else {
      input.classList.remove("border-red-500", "focus:ring-red-500");
      input.classList.add("border-gray-600", "focus:border-cyan-500", "focus:ring-cyan-500");
    }
  }
}

function clearFieldErrors(fieldIds) {
  fieldIds.forEach((id) => renderFieldError(id, ""));
}

function setButtonLoading(button, loading, originalHtml) {
  if (!button) return;
  if (loading) {
    button.disabled = true;
    button.dataset.originalHtml = originalHtml || button.innerHTML;
    button.innerHTML = `
      <svg class="animate-spin-custom -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      ${button.dataset.loadingText || "Loading..."}
    `;
  } else {
    button.disabled = false;
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
    }
  }
}

// Replace [data-icon="name" data-size="N"] placeholders with real SVG.
function hydrateInlineIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    const size = parseInt(el.getAttribute("data-size") || "24", 10);
    const cls = el.getAttribute("data-icon-class") || "";
    el.innerHTML = icon(name, { size, className: cls });
  });
}

// Bootstrap shared layout on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
  hydrateInlineIcons();
});
