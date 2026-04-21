// Login form logic

async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const errors = {};
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  const passwordErr = validatePassword(password);
  if (passwordErr) errors.password = passwordErr;

  clearFieldErrors(["email", "password"]);
  const serverError = document.getElementById("login-server-error");
  if (serverError) serverError.hidden = true;

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([f, msg]) => renderFieldError(f, msg));
    return;
  }

  const submitBtn = document.getElementById("login-submit");
  setButtonLoading(submitBtn, true);

  const result = await authLogin(email, password);

  if (result.success) {
    window.location.href = "dashboard.html";
  } else {
    setButtonLoading(submitBtn, false);
    if (serverError) {
      serverError.hidden = false;
      serverError.textContent = "Invalid email or password. Please try again.";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (isAuthenticated()) {
    window.location.href = "dashboard.html";
    return;
  }
  const form = document.getElementById("login-form");
  if (form) form.addEventListener("submit", handleLoginSubmit);

  ["email", "password"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => renderFieldError(id, ""));
  });
});
