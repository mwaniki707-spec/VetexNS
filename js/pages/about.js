// About page renderers

function renderValues() {
  const mount = document.getElementById("values-grid");
  if (!mount) return;
  mount.innerHTML = VALUES.map(
    (v) => `
      <div class="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-8 transition-all hover:-translate-y-1 hover:border-cyan-500/20">
        <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <span class="text-cyan-400">${icon(v.icon, { size: 28 })}</span>
        </div>
        <h3 class="mt-6 text-lg font-semibold text-white">${v.title}</h3>
        <p class="mt-3 text-sm text-gray-400 leading-relaxed">${v.description}</p>
      </div>
    `
  ).join("");
}

function renderTimeline() {
  const mount = document.getElementById("timeline");
  if (!mount) return;
  mount.innerHTML = MILESTONES.map((milestone, index) => {
    const isLast = index === MILESTONES.length - 1;
    const connector = !isLast ? `<div class="w-px flex-1 bg-gray-800 mt-2"></div>` : "";
    return `
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-sm font-bold text-cyan-400 shrink-0">
            ${milestone.year.slice(-2)}
          </div>
          ${connector}
        </div>
        <div class="pb-8">
          <div class="text-sm font-medium text-cyan-400">${milestone.year}</div>
          <h3 class="mt-1 text-lg font-semibold text-white">${milestone.title}</h3>
          <p class="mt-1 text-sm text-gray-400">${milestone.description}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderTeam() {
  const mount = document.getElementById("team-grid");
  if (!mount) return;
  mount.innerHTML = TEAM_MEMBERS.map(
    (m) => `
      <div class="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-8 text-center transition-all hover:border-cyan-500/20">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
          <span class="text-cyan-400">${icon("user", { size: 32 })}</span>
        </div>
        <h3 class="mt-6 text-lg font-semibold text-white">${m.name}</h3>
        <p class="text-sm text-cyan-400">${m.role}</p>
        <p class="mt-3 text-sm text-gray-400">${m.bio}</p>
      </div>
    `
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderValues();
  renderTimeline();
  renderTeam();
});
