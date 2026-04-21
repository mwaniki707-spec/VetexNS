// Admin panel page logic
// Guards access to admin role, renders user management table + contact submissions,
// and wires up create/edit/delete/reset-password/role-toggle flows via modals.

const ADMIN_BADGE_CLASSES = {
  default: "bg-gray-700 text-gray-300",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  purple: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
};

function adminBadge(text, variant = "default", extraClass = "") {
  const cls = ADMIN_BADGE_CLASSES[variant] || ADMIN_BADGE_CLASSES.default;
  return `<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls} ${extraClass}">${text}</span>`;
}

function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ---------- Modal helpers ----------
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

function bindCloseModals() {
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close-modal");
      closeModal(id);
    });
  });

  document.querySelectorAll(".fixed.inset-0[id$='-modal']").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ["user-modal", "reset-modal", "confirm-modal"].forEach((id) => {
        const el = document.getElementById(id);
        if (el && !el.hidden) el.hidden = true;
      });
    }
  });
}

// ---------- Toast ----------
let toastTimer = null;
function toast(message, variant = "success") {
  const el = document.getElementById("toast");
  if (!el) return;
  const variants = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error: "border-red-500/30 bg-red-500/10 text-red-300",
    info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  };
  el.className = `fixed bottom-6 right-6 z-[70] rounded-lg border px-4 py-3 text-sm shadow-lg transition-all ${variants[variant] || variants.info}`;
  el.textContent = message;
  el.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

// ---------- Confirm modal ----------
function confirmDialog({ title, message, confirmLabel = "Confirm", danger = true }) {
  return new Promise((resolve) => {
    const titleEl = document.getElementById("confirm-title");
    const msgEl = document.getElementById("confirm-message");
    const okBtn = document.getElementById("confirm-ok");

    if (titleEl) titleEl.textContent = title || "Are you sure?";
    if (msgEl) msgEl.textContent = message || "";
    if (okBtn) {
      okBtn.textContent = confirmLabel;
      okBtn.className = danger
        ? "flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 shadow-lg shadow-red-500/25 transition-all"
        : "flex-1 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-gray-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25 transition-all";
    }

    openModal("confirm-modal");

    const cleanup = () => {
      okBtn.removeEventListener("click", onConfirm);
      document.querySelectorAll("[data-close-modal='confirm-modal']").forEach((b) =>
        b.removeEventListener("click", onCancel)
      );
    };

    const onConfirm = () => {
      closeModal("confirm-modal");
      cleanup();
      resolve(true);
    };
    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    okBtn.addEventListener("click", onConfirm);
    document.querySelectorAll("[data-close-modal='confirm-modal']").forEach((b) =>
      b.addEventListener("click", onCancel, { once: true })
    );
  });
}

// ---------- State ----------
let currentUserSearch = "";
let currentTab = "users";

// ---------- Rendering: stats ----------
function renderAdminStats(users, submissions) {
  const mount = document.getElementById("admin-stats");
  if (!mount) return;

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.length - adminCount;

  const cards = [
    { label: "Total Users", value: users.length, icon: "user", color: "text-cyan-400" },
    { label: "Administrators", value: adminCount, icon: "shield", color: "text-purple-400" },
    { label: "Standard Users", value: userCount, icon: "user", color: "text-blue-400" },
    { label: "Contact Messages", value: submissions.length, icon: "mail", color: "text-emerald-400" },
  ];

  mount.innerHTML = cards
    .map(
      (c) => `
        <div class="rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4">
          <div class="flex items-center gap-3">
            <span class="${c.color}">${icon(c.icon, { size: 20 })}</span>
            <div>
              <p class="text-lg font-bold text-white">${c.value}</p>
              <p class="text-xs text-gray-400">${c.label}</p>
            </div>
          </div>
        </div>`
    )
    .join("");
}

// ---------- Rendering: users table ----------
function renderUsersTable() {
  const tbody = document.getElementById("users-tbody");
  const emptyEl = document.getElementById("users-empty");
  if (!tbody) return;

  const search = currentUserSearch.trim().toLowerCase();
  const allUsers = adminListUsers();
  const filtered = search
    ? allUsers.filter((u) =>
        [u.name, u.email, u.company, u.role]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(search))
      )
    : allUsers;

  const currentUser = getSessionUser();

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  tbody.innerHTML = filtered
    .map((u) => {
      const isSelf = currentUser && u.id === currentUser.id;
      const roleVariant = u.role === "admin" ? "purple" : "info";
      const toggleLabel = u.role === "admin" ? "Demote" : "Promote";

      return `
        <tr class="hover:bg-gray-800/20 transition-colors">
          <td class="whitespace-nowrap px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 shrink-0">
                <span class="text-cyan-400">${icon("user", { size: 16 })}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-white">${escapeHtml(u.name)} ${isSelf ? '<span class="text-xs text-gray-500">(you)</span>' : ""}</p>
                <p class="text-xs text-gray-500 font-mono">${escapeHtml(u.id)}</p>
              </div>
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-300">${escapeHtml(u.email)}</td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">${escapeHtml(u.company || "—")}</td>
          <td class="whitespace-nowrap px-6 py-4">${adminBadge(u.role, roleVariant, "capitalize")}</td>
          <td class="whitespace-nowrap px-6 py-4 text-right">
            <div class="inline-flex items-center gap-1">
              <button data-action="edit" data-id="${u.id}" title="Edit"
                class="rounded-lg p-2 text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors">
                ${icon("user", { size: 16 })}
              </button>
              <button data-action="reset" data-id="${u.id}" title="Reset password"
                class="rounded-lg p-2 text-gray-400 hover:bg-amber-500/10 hover:text-amber-300 transition-colors">
                ${icon("lock", { size: 16 })}
              </button>
              <button data-action="toggle-role" data-id="${u.id}" title="${toggleLabel}"
                class="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300 border border-gray-700 hover:border-purple-500/40 hover:text-purple-300 transition-colors">
                ${toggleLabel}
              </button>
              <button data-action="delete" data-id="${u.id}" title="Delete account"
                class="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                ${isSelf ? "disabled" : ""}>
                ${icon("x", { size: 16 })}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  tbody.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      handleUserAction(action, id);
    });
  });
}

// ---------- Rendering: contact submissions ----------
function renderSubmissions() {
  const mount = document.getElementById("submissions-list");
  const emptyEl = document.getElementById("submissions-empty");
  if (!mount) return;

  const submissions = adminGetContactSubmissions();

  if (submissions.length === 0) {
    mount.innerHTML = "";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  mount.innerHTML = submissions
    .slice()
    .reverse()
    .map((entry, reversedIndex) => {
      const realIndex = submissions.length - 1 - reversedIndex;
      const when = entry.submittedAt
        ? new Date(entry.submittedAt).toLocaleString()
        : "Unknown";

      return `
        <div class="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-semibold text-white">${escapeHtml(entry.name || "Anonymous")}</span>
                ${entry.company ? adminBadge(escapeHtml(entry.company), "info") : ""}
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span>${escapeHtml(entry.email || "—")}</span>
                ${entry.phone ? `<span>• ${escapeHtml(entry.phone)}</span>` : ""}
                <span>• ${when}</span>
              </div>
              <p class="mt-3 text-sm font-medium text-gray-200">${escapeHtml(entry.subject || "(no subject)")}</p>
              <p class="mt-2 text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">${escapeHtml(entry.message || "")}</p>
            </div>
            <button data-submission-delete="${realIndex}"
              class="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Delete submission">
              ${icon("x", { size: 18 })}
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  mount.querySelectorAll("[data-submission-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const index = parseInt(btn.getAttribute("data-submission-delete"), 10);
      const ok = await confirmDialog({
        title: "Delete submission?",
        message: "This contact message will be permanently removed.",
        confirmLabel: "Delete",
      });
      if (!ok) return;
      adminDeleteContactSubmission(index);
      refresh();
      toast("Submission deleted", "success");
    });
  });
}

// ---------- Actions ----------
function handleUserAction(action, userId) {
  const users = adminListUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  if (action === "edit") return openUserModal({ mode: "edit", user });
  if (action === "reset") return openResetModal(user);
  if (action === "toggle-role") return toggleUserRole(user);
  if (action === "delete") return deleteUser(user);
}

async function deleteUser(user) {
  const ok = await confirmDialog({
    title: `Delete ${user.name}?`,
    message: `This will permanently remove the account "${user.email}". This cannot be undone.`,
    confirmLabel: "Delete account",
  });
  if (!ok) return;

  const res = adminDeleteUser(user.id);
  if (res.success) {
    toast("Account deleted", "success");
    refresh();
  } else {
    toast(res.error || "Failed to delete account", "error");
  }
}

async function toggleUserRole(user) {
  const newRole = user.role === "admin" ? "user" : "admin";
  const ok = await confirmDialog({
    title: newRole === "admin" ? "Promote to administrator?" : "Demote to user?",
    message:
      newRole === "admin"
        ? `${user.name} will gain full administrator privileges, including managing other accounts.`
        : `${user.name} will lose administrator privileges and access to the admin panel.`,
    confirmLabel: newRole === "admin" ? "Promote" : "Demote",
    danger: newRole !== "admin",
  });
  if (!ok) return;

  const res = adminSetUserRole(user.id, newRole);
  if (res.success) {
    toast(`Role updated to ${newRole}`, "success");
    refresh();
    // If this was the logged-in user being demoted, navbar needs re-render
    renderNavbar();
    hydrateInlineIcons();
  } else {
    toast(res.error || "Failed to update role", "error");
  }
}

// ---------- User modal (create / edit) ----------
function openUserModal({ mode, user }) {
  const titleEl = document.getElementById("user-modal-title");
  const idEl = document.getElementById("user-id");
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  const companyEl = document.getElementById("user-company");
  const passwordEl = document.getElementById("user-password");
  const passwordGroup = document.getElementById("user-password-group");
  const roleEl = document.getElementById("user-role");
  const formError = document.getElementById("user-form-error");

  if (formError) formError.hidden = true;
  clearFieldErrors(["user-name", "user-email", "user-password"]);

  if (mode === "edit" && user) {
    titleEl.textContent = "Edit User";
    idEl.value = user.id;
    nameEl.value = user.name || "";
    emailEl.value = user.email || "";
    companyEl.value = user.company || "";
    roleEl.value = user.role || "user";
    // Hide password field on edit — handled via the reset modal instead.
    passwordEl.value = "";
    if (passwordGroup) passwordGroup.hidden = true;
  } else {
    titleEl.textContent = "Add User";
    idEl.value = "";
    nameEl.value = "";
    emailEl.value = "";
    companyEl.value = "";
    passwordEl.value = "";
    roleEl.value = "user";
    if (passwordGroup) passwordGroup.hidden = false;
  }

  openModal("user-modal");
  setTimeout(() => nameEl && nameEl.focus(), 40);
}

async function handleUserFormSubmit(e) {
  e.preventDefault();
  const formError = document.getElementById("user-form-error");
  if (formError) formError.hidden = true;
  clearFieldErrors(["user-name", "user-email", "user-password"]);

  const id = document.getElementById("user-id").value.trim();
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const company = document.getElementById("user-company").value.trim();
  const password = document.getElementById("user-password").value;
  const role = document.getElementById("user-role").value;

  const errors = {};
  const nameErr = validateName(name);
  if (nameErr) errors["user-name"] = nameErr;
  const emailErr = validateEmail(email);
  if (emailErr) errors["user-email"] = emailErr;

  const isEdit = !!id;
  if (!isEdit) {
    const pwErr = validatePassword(password);
    if (pwErr) errors["user-password"] = pwErr;
  }

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, msg]) => renderFieldError(field, msg));
    return;
  }

  const submitBtn = document.getElementById("user-form-submit");
  setButtonLoading(submitBtn, true);
  await new Promise((r) => setTimeout(r, 200));

  let result;
  if (isEdit) {
    result = adminUpdateUser(id, {
      name: sanitizeInput(name),
      email,
      company: sanitizeInput(company),
    });
    if (result.success) {
      const roleRes = adminSetUserRole(id, role);
      if (!roleRes.success) {
        setButtonLoading(submitBtn, false);
        if (formError) {
          formError.textContent = roleRes.error || "Failed to update role";
          formError.hidden = false;
        }
        return;
      }
    }
  } else {
    result = adminCreateUser({
      email,
      password,
      name: sanitizeInput(name),
      company: sanitizeInput(company),
      role,
    });
  }

  setButtonLoading(submitBtn, false);

  if (result.success) {
    closeModal("user-modal");
    toast(isEdit ? "User updated" : "User created", "success");
    refresh();
    renderNavbar();
    hydrateInlineIcons();
  } else {
    if (formError) {
      formError.textContent = result.error || "Operation failed";
      formError.hidden = false;
    }
  }
}

// ---------- Reset password modal ----------
function openResetModal(user) {
  document.getElementById("reset-user-id").value = user.id;
  document.getElementById("reset-user-label").textContent = `${user.name} (${user.email})`;
  document.getElementById("reset-password").value = "";
  document.getElementById("reset-password-confirm").value = "";
  clearFieldErrors(["reset-password", "reset-password-confirm"]);
  const err = document.getElementById("reset-form-error");
  if (err) err.hidden = true;
  openModal("reset-modal");
  setTimeout(() => document.getElementById("reset-password").focus(), 40);
}

async function handleResetFormSubmit(e) {
  e.preventDefault();
  clearFieldErrors(["reset-password", "reset-password-confirm"]);
  const formError = document.getElementById("reset-form-error");
  if (formError) formError.hidden = true;

  const id = document.getElementById("reset-user-id").value;
  const pw = document.getElementById("reset-password").value;
  const confirmPw = document.getElementById("reset-password-confirm").value;

  const errors = {};
  const pwErr = validatePassword(pw);
  if (pwErr) errors["reset-password"] = pwErr;
  if (pw !== confirmPw) errors["reset-password-confirm"] = "Passwords do not match";

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([f, msg]) => renderFieldError(f, msg));
    return;
  }

  const submitBtn = document.getElementById("reset-form-submit");
  setButtonLoading(submitBtn, true);
  await new Promise((r) => setTimeout(r, 200));

  const res = adminResetPassword(id, pw);
  setButtonLoading(submitBtn, false);

  if (res.success) {
    closeModal("reset-modal");
    toast("Password reset successfully", "success");
  } else {
    if (formError) {
      formError.textContent = res.error || "Failed to reset password";
      formError.hidden = false;
    }
  }
}

// ---------- Tabs ----------
function setActiveTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".admin-tab").forEach((btn) => {
    const isActive = btn.getAttribute("data-tab") === tab;
    btn.className = isActive
      ? "admin-tab border-b-2 border-purple-400 px-1 py-3 text-sm font-medium text-purple-300"
      : "admin-tab border-b-2 border-transparent px-1 py-3 text-sm font-medium text-gray-400 hover:text-gray-200";
  });
  const usersTab = document.getElementById("tab-users");
  const subsTab = document.getElementById("tab-submissions");
  if (usersTab) usersTab.hidden = tab !== "users";
  if (subsTab) subsTab.hidden = tab !== "submissions";
}

// ---------- Refresh ----------
function refresh() {
  const users = adminListUsers();
  const submissions = adminGetContactSubmissions();
  renderAdminStats(users, submissions);
  renderUsersTable();
  renderSubmissions();
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  const user = getSessionUser();
  const loading = document.getElementById("admin-loading");
  const denied = document.getElementById("admin-denied");
  const content = document.getElementById("admin-content");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.role !== "admin") {
    if (loading) loading.hidden = true;
    if (denied) {
      denied.hidden = false;
      denied.classList.remove("hidden");
      denied.classList.add("flex");
    }
    return;
  }

  // Welcome message
  const welcome = document.getElementById("admin-welcome");
  if (welcome) welcome.textContent = `Signed in as ${user.name} · ${user.email}`;

  // Initial render
  refresh();
  if (loading) loading.hidden = true;
  if (content) content.hidden = false;
  hydrateInlineIcons(content);

  // Tabs
  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.getAttribute("data-tab")));
  });

  // Search
  const search = document.getElementById("user-search");
  if (search) {
    search.addEventListener("input", (e) => {
      currentUserSearch = e.target.value;
      renderUsersTable();
    });
  }

  // Buttons
  const createBtn = document.getElementById("btn-create-user");
  if (createBtn) createBtn.addEventListener("click", () => openUserModal({ mode: "create" }));

  const clearBtn = document.getElementById("btn-clear-submissions");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      const submissions = adminGetContactSubmissions();
      if (submissions.length === 0) {
        toast("No submissions to clear", "info");
        return;
      }
      const ok = await confirmDialog({
        title: "Clear all submissions?",
        message: `All ${submissions.length} contact messages will be permanently deleted.`,
        confirmLabel: "Clear all",
      });
      if (!ok) return;
      adminClearContactSubmissions();
      refresh();
      toast("All submissions cleared", "success");
    });
  }

  // Forms
  const userForm = document.getElementById("user-form");
  if (userForm) userForm.addEventListener("submit", handleUserFormSubmit);

  const resetForm = document.getElementById("reset-form");
  if (resetForm) resetForm.addEventListener("submit", handleResetFormSubmit);

  // Clear field errors on input
  ["user-name", "user-email", "user-password"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => renderFieldError(id, ""));
  });
  ["reset-password", "reset-password-confirm"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => renderFieldError(id, ""));
  });

  bindCloseModals();
});
