// Dashboard page — protected content, mock data rendering

const DEVICE_ICON_COLORS = {
  router: "text-cyan-400",
  switch: "text-blue-400",
  firewall: "text-amber-400",
  server: "text-purple-400",
  endpoint: "text-gray-400",
};

const DEVICE_ICON_NAMES = {
  router: "network",
  switch: "network",
  firewall: "shield",
  server: "server",
  endpoint: "network",
};

const STATUS_BADGE_VARIANT = {
  online: "success",
  warning: "warning",
  offline: "danger",
};

const ALERT_ICON_MAP = {
  critical: { name: "alert-triangle", color: "text-red-400" },
  warning: { name: "alert-triangle", color: "text-amber-400" },
  info: { name: "check-circle", color: "text-cyan-400" },
};

const DASH_BADGE_CLASSES = {
  default: "bg-gray-700 text-gray-300",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
};

function dashBadge(text, variant = "default", extraClass = "") {
  const cls = DASH_BADGE_CLASSES[variant] || DASH_BADGE_CLASSES.default;
  return `<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls} ${extraClass}">${text}</span>`;
}

function renderStatsGrid() {
  const mount = document.getElementById("stats-grid");
  if (!mount) return;

  const stats = [
    { label: "Total Devices", value: MOCK_STATS.totalDevices, icon: "network", color: "text-cyan-400" },
    { label: "Online", value: MOCK_STATS.onlineDevices, icon: "check-circle", color: "text-emerald-400" },
    { label: "Active Alerts", value: MOCK_STATS.activeAlerts, icon: "alert-triangle", color: "text-amber-400" },
    { label: "Uptime", value: MOCK_STATS.networkUptime, icon: "chart", color: "text-blue-400" },
    { label: "Bandwidth", value: MOCK_STATS.bandwidthUsage + "%", icon: "zap", color: "text-purple-400" },
    {
      label: "Threats Blocked",
      value: MOCK_STATS.threatsBlocked.toLocaleString(),
      icon: "shield",
      color: "text-red-400",
    },
  ];

  mount.innerHTML = stats
    .map(
      (stat) => `
        <div class="relative rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4">
          <div class="flex items-center gap-3">
            <span class="${stat.color}">${icon(stat.icon, { size: 20 })}</span>
            <div>
              <p class="text-lg font-bold text-white">${stat.value}</p>
              <p class="text-xs text-gray-400">${stat.label}</p>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderDevices() {
  const tbody = document.getElementById("devices-tbody");
  const countBadge = document.getElementById("devices-count-badge");
  if (!tbody) return;

  if (countBadge) countBadge.innerHTML = dashBadge(`${MOCK_DEVICES.length} devices`, "info");

  tbody.innerHTML = MOCK_DEVICES.map((device) => {
    const iconName = DEVICE_ICON_NAMES[device.type] || "network";
    const iconColor = DEVICE_ICON_COLORS[device.type] || "text-gray-400";
    const statusVariant = STATUS_BADGE_VARIANT[device.status] || "default";

    return `
      <tr class="hover:bg-gray-800/20 transition-colors">
        <td class="whitespace-nowrap px-6 py-4">
          <div class="flex items-center gap-3">
            <span class="${iconColor}">${icon(iconName, { size: 18 })}</span>
            <div>
              <p class="text-sm font-medium text-white">${device.name}</p>
              <p class="text-xs text-gray-500 capitalize">${device.type}</p>
            </div>
          </div>
        </td>
        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-300 font-mono">${device.ip}</td>
        <td class="whitespace-nowrap px-6 py-4">${dashBadge(device.status, statusVariant)}</td>
        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">${device.uptime}</td>
        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">${device.traffic}</td>
      </tr>
    `;
  }).join("");
}

function renderAlerts() {
  const mount = document.getElementById("alerts-list");
  const countBadge = document.getElementById("alerts-count-badge");
  if (!mount) return;

  const unresolved = MOCK_ALERTS.filter((a) => !a.resolved);
  if (countBadge) countBadge.innerHTML = dashBadge(`${unresolved.length} active`, "warning");

  mount.innerHTML = MOCK_ALERTS.map((alert) => {
    const iconDef = ALERT_ICON_MAP[alert.type];
    let containerCls = "border-cyan-500/20 bg-cyan-500/5";
    if (alert.resolved) {
      containerCls = "border-gray-800/50 bg-gray-900/30 opacity-60";
    } else if (alert.type === "critical") {
      containerCls = "border-red-500/20 bg-red-500/5";
    } else if (alert.type === "warning") {
      containerCls = "border-amber-500/20 bg-amber-500/5";
    }

    const timestamp = new Date(alert.timestamp).toLocaleString();
    const resolvedBadge = alert.resolved ? dashBadge("Resolved", "success") : "";

    return `
      <div class="flex gap-3 rounded-lg border p-3 ${containerCls}">
        <div class="shrink-0 mt-0.5">
          <span class="${iconDef.color}">${icon(iconDef.name, { size: 18 })}</span>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-gray-200 leading-relaxed">${alert.message}</p>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-xs text-gray-500">${timestamp}</span>
            ${resolvedBadge}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderAccount(user) {
  const welcome = document.getElementById("dashboard-welcome");
  const nameEl = document.getElementById("account-name");
  const emailEl = document.getElementById("account-email");
  const companyEl = document.getElementById("account-company");
  const roleEl = document.getElementById("account-role");

  if (welcome) welcome.textContent = `Welcome back, ${user.name} — ${user.company || ""}`;
  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (companyEl) companyEl.textContent = user.company || "—";
  if (roleEl) roleEl.innerHTML = dashBadge(user.role, "info", "capitalize");
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getSessionUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const loading = document.getElementById("dashboard-loading");
  const content = document.getElementById("dashboard-content");

  renderAccount(user);
  renderStatsGrid();
  renderDevices();
  renderAlerts();

  if (loading) loading.hidden = true;
  if (content) content.hidden = false;

  hydrateInlineIcons(content);
});
