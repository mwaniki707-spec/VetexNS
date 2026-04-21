// Client-side mock authentication using localStorage.
// Mirrors the API surface of the original Next.js AuthContext + /api/auth routes.

const AUTH_STORAGE_KEY = "vertex_auth_session";
const AUTH_USERS_KEY = "vertex_registered_users";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const DEFAULT_USERS = [
  {
    email: "admin@vertex.com",
    password: "Admin123!",
    user: {
      id: "usr_001",
      email: "admin@vertex.com",
      name: "Alex Thompson",
      company: "Vertex Network Solutions",
      role: "admin",
    },
  },
  {
    email: "demo@vertex.com",
    password: "Demo1234",
    user: {
      id: "usr_002",
      email: "demo@vertex.com",
      name: "Demo User",
      company: "Acme Corp",
      role: "user",
    },
  },
];

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_USERS];
    return parsed;
  } catch {
    return [...DEFAULT_USERS];
  }
}

function persistUsers(users) {
  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage full or disabled */
  }
}

function saveSession(user) {
  const payload = { user, exp: Date.now() + SESSION_TTL_MS };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

function clearSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

function getSessionUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.user || !parsed.exp) return null;
    if (parsed.exp < Date.now()) {
      clearSession();
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
}

function isAuthenticated() {
  return !!getSessionUser();
}

async function authLogin(email, password) {
  await new Promise((r) => setTimeout(r, 250));
  const users = getRegisteredUsers();
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === String(email || "").toLowerCase() &&
      u.password === password
  );
  if (!found) return { success: false, error: "Invalid email or password" };
  saveSession(found.user);
  return { success: true, user: found.user };
}

async function authRegister(email, password, name, company) {
  await new Promise((r) => setTimeout(r, 250));
  const users = getRegisteredUsers();
  const normalizedEmail = String(email || "").toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists" };
  }
  const newUser = {
    id: "usr_" + Date.now(),
    email,
    name,
    company: company || "",
    role: "user",
  };
  users.push({ email, password, user: newUser });
  persistUsers(users);
  saveSession(newUser);
  return { success: true, user: newUser };
}

function authLogout() {
  clearSession();
}

// ---------- Admin operations ----------
// These require the current session user to have role === "admin".

function isAdmin() {
  const u = getSessionUser();
  return !!u && u.role === "admin";
}

function requireAdmin() {
  if (!isAdmin()) {
    throw new Error("Unauthorized: admin privileges required");
  }
}

function adminListUsers() {
  requireAdmin();
  const users = getRegisteredUsers();
  return users.map((entry) => ({
    ...entry.user,
    // passwords are never returned
  }));
}

function adminGetContactSubmissions() {
  requireAdmin();
  try {
    const raw = localStorage.getItem("vertex_contact_submissions");
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function adminClearContactSubmissions() {
  requireAdmin();
  try {
    localStorage.removeItem("vertex_contact_submissions");
  } catch {
    /* noop */
  }
}

function adminDeleteContactSubmission(index) {
  requireAdmin();
  try {
    const raw = localStorage.getItem("vertex_contact_submissions");
    if (!raw) return;
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return;
    list.splice(index, 1);
    localStorage.setItem("vertex_contact_submissions", JSON.stringify(list));
  } catch {
    /* noop */
  }
}

function adminCreateUser({ email, password, name, company, role }) {
  requireAdmin();
  const users = getRegisteredUsers();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) return { success: false, error: "Email is required" };
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists" };
  }

  const newUser = {
    id: "usr_" + Date.now(),
    email: normalizedEmail,
    name: name || "",
    company: company || "",
    role: role === "admin" ? "admin" : "user",
  };
  users.push({ email: normalizedEmail, password: password || "", user: newUser });
  persistUsers(users);
  return { success: true, user: newUser };
}

function adminDeleteUser(userId) {
  requireAdmin();
  const currentUser = getSessionUser();
  if (currentUser && currentUser.id === userId) {
    return { success: false, error: "You cannot delete your own account" };
  }
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.user.id === userId);
  if (idx === -1) return { success: false, error: "User not found" };
  users.splice(idx, 1);
  persistUsers(users);
  return { success: true };
}

function adminResetPassword(userId, newPassword) {
  requireAdmin();
  if (!newPassword) return { success: false, error: "New password is required" };
  const users = getRegisteredUsers();
  const entry = users.find((u) => u.user.id === userId);
  if (!entry) return { success: false, error: "User not found" };
  entry.password = newPassword;
  persistUsers(users);
  return { success: true };
}

function adminSetUserRole(userId, role) {
  requireAdmin();
  if (role !== "admin" && role !== "user") {
    return { success: false, error: "Invalid role" };
  }
  const currentUser = getSessionUser();
  const users = getRegisteredUsers();
  const entry = users.find((u) => u.user.id === userId);
  if (!entry) return { success: false, error: "User not found" };

  // Prevent the last admin from demoting themselves and leaving no admins.
  if (
    currentUser &&
    currentUser.id === userId &&
    role === "user" &&
    users.filter((u) => u.user.role === "admin").length <= 1
  ) {
    return { success: false, error: "Cannot demote the only admin account" };
  }

  entry.user.role = role;
  persistUsers(users);

  // If it was the logged-in user, refresh the session payload too.
  if (currentUser && currentUser.id === userId) {
    saveSession(entry.user);
  }
  return { success: true, user: entry.user };
}

function adminUpdateUser(userId, updates) {
  requireAdmin();
  const users = getRegisteredUsers();
  const entry = users.find((u) => u.user.id === userId);
  if (!entry) return { success: false, error: "User not found" };

  if (typeof updates.name === "string") entry.user.name = updates.name;
  if (typeof updates.company === "string") entry.user.company = updates.company;
  if (typeof updates.email === "string" && updates.email.trim()) {
    const newEmail = updates.email.trim().toLowerCase();
    const clash = users.find(
      (u) => u.user.id !== userId && u.email.toLowerCase() === newEmail
    );
    if (clash) return { success: false, error: "Email already in use" };
    entry.user.email = newEmail;
    entry.email = newEmail;
  }
  persistUsers(users);

  const currentUser = getSessionUser();
  if (currentUser && currentUser.id === userId) {
    saveSession(entry.user);
  }
  return { success: true, user: entry.user };
}
