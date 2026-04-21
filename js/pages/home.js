// Home page renderers

const HOME_STATS = [
  { value: "500+", label: "Enterprise Clients" },
  { value: "99.99%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Security Monitoring" },
  { value: "50M+", label: "Threats Blocked" },
];

const HOME_FEATURES = [
  {
    icon: "zap",
    title: "Lightning Fast",
    description: "10Gbps+ throughput with optimized routing and load balancing.",
  },
  {
    icon: "lock",
    title: "Zero Trust Security",
    description: "Every access request verified. No implicit trust, ever.",
  },
  {
    icon: "globe",
    title: "Global Coverage",
    description: "Deploy across 40+ regions with edge computing capabilities.",
  },
  {
    icon: "check-circle",
    title: "Compliance Ready",
    description: "SOC 2, ISO 27001, HIPAA, and PCI DSS compliance out of the box.",
  },
];

function renderHomeStats() {
  const mount = document.getElementById("stats-grid");
  if (!mount) return;
  mount.innerHTML = HOME_STATS.map(
    (s) => `
      <div class="text-center">
        <p class="text-3xl font-bold text-cyan-400 sm:text-4xl">${s.value}</p>
        <p class="mt-1 text-sm text-gray-400">${s.label}</p>
      </div>
    `
  ).join("");
}

function renderHomeServices() {
  const mount = document.getElementById("services-grid");
  if (!mount) return;
  mount.innerHTML = SERVICES.map((service) => {
    const iconName = service.icon; // network | shield | cloud
    const featuresList = service.features
      .slice(0, 3)
      .map(
        (f) => `
          <li class="flex items-center gap-2 text-sm text-gray-300">
            <span class="text-cyan-400 shrink-0">${icon("check-circle", { size: 16 })}</span>
            ${f}
          </li>`
      )
      .join("");

    return `
      <div class="group relative rounded-2xl border border-gray-700/50 bg-gray-800/30 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
        <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
          <span class="text-cyan-400">${icon(iconName, { size: 32 })}</span>
        </div>
        <h3 class="mt-6 text-xl font-semibold text-white">${service.title}</h3>
        <p class="mt-3 text-gray-400 leading-relaxed">${service.description}</p>
        <ul class="mt-6 space-y-2">${featuresList}</ul>
        <a href="services.html" class="mt-6 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300">
          Learn more
          ${icon("arrow-right", { size: 14 })}
        </a>
      </div>
    `;
  }).join("");
}

function renderHomeFeatures() {
  const mount = document.getElementById("features-grid");
  if (!mount) return;
  mount.innerHTML = HOME_FEATURES.map(
    (f) => `
      <div class="rounded-xl border border-gray-800/50 bg-gray-900/50 p-6 text-center transition-all hover:border-gray-700">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
          <span class="text-cyan-400">${icon(f.icon, { size: 24 })}</span>
        </div>
        <h3 class="mt-4 text-lg font-semibold text-white">${f.title}</h3>
        <p class="mt-2 text-sm text-gray-400">${f.description}</p>
      </div>
    `
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomeStats();
  renderHomeServices();
  renderHomeFeatures();
});
