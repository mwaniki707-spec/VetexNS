// Services page renderers

function renderServicesDetail() {
  const mount = document.getElementById("services-detail");
  if (!mount) return;

  mount.innerHTML = SERVICES.map((service, index) => {
    const reverse = index % 2 === 1 ? "lg:flex-row-reverse" : "";
    const iconName = service.icon;

    const featuresList = service.features
      .map(
        (feature) => `
          <li class="flex items-start gap-3 text-gray-300">
            <span class="mt-0.5 text-cyan-400 shrink-0">${icon("check-circle", { size: 18 })}</span>
            <span class="text-sm">${feature}</span>
          </li>`
      )
      .join("");

    const visualItems = service.features
      .map((feature, i) => {
        const dot = i < 4 ? "bg-emerald-400" : "bg-cyan-400";
        return `
          <div class="flex items-center gap-4 rounded-lg border border-gray-700/30 bg-gray-900/50 px-4 py-3">
            <div class="h-2 w-2 rounded-full ${dot}"></div>
            <span class="text-sm text-gray-300">${feature}</span>
          </div>
        `;
      })
      .join("");

    return `
      <div class="flex flex-col gap-12 lg:flex-row lg:items-center ${reverse}">
        <div class="flex-1 space-y-6">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <span class="text-cyan-400">${icon(iconName, { size: 40 })}</span>
          </div>
          <h2 class="text-3xl font-bold text-white">${service.title}</h2>
          <p class="text-lg text-gray-400 leading-relaxed">${service.description}</p>
          <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">${featuresList}</ul>
          <a href="contact.html" class="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
            Get a quote
            ${icon("arrow-right", { size: 16 })}
          </a>
        </div>

        <div class="flex-1">
          <div class="relative rounded-2xl border border-gray-700/50 bg-gray-800/30 p-8 lg:p-12">
            <div class="absolute inset-0 rounded-2xl grid-bg opacity-30"></div>
            <div class="relative space-y-4">${visualItems}</div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderProcessSteps() {
  const mount = document.getElementById("process-steps");
  if (!mount) return;
  mount.innerHTML = PROCESS_STEPS.map(
    (step) => `
      <div class="relative">
        <div class="text-5xl font-bold text-cyan-500/10">${step.step}</div>
        <h3 class="mt-2 text-xl font-semibold text-white">${step.title}</h3>
        <p class="mt-2 text-sm text-gray-400 leading-relaxed">${step.description}</p>
      </div>
    `
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderServicesDetail();
  renderProcessSteps();
});
