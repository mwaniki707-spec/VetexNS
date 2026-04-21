// Register form logic

const REGISTER_FIELDS = ["name", "email", "company", "password", "confirmPassword"];

async function handleRegisterSubmit(e) {
  e.preventDefault();

  const values = {};
  REGISTER_FIELDS.forEach((f) => {
    const el = document.getElementById(f);
    values[f] = el ? el.value : "";
  });

  const errors = {};
  const nameErr = validateName(values.name);
  if (nameErr) errors.name = nameErr;
  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;
  const passwordErr = validatePassword(values.password);
  if (passwordErr) errors.password = passwordErr;
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  clearFieldErrors(REGISTER_FIELDS);
  const serverError = document.getElementById("register-server-error");
  if (serverError) serverError.hidden = true;

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([f, msg]) => renderFieldError(f, msg));
    return;
  }

  const submitBtn = document.getElementById("register-submit");
  setButtonLoading(submitBtn, true);

  const result = await authRegister(
    sanitizeInput(values.email),
    values.password,
    sanitizeInput(values.name),
    sanitizeInput(values.company)
  );

  if (result.success) {
    window.location.href = "dashboard.html";
  } else {
    setButtonLoading(submitBtn, false);
    if (serverError) {
      serverError.hidden = false;
      serverError.textContent =
        result.error || "An account with this email already exists, or registration failed.";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (isAuthenticated()) {
    window.location.href = "dashboard.html";
    return;
  }
  const form = document.getElementById("register-form");
  if (form) form.addEventListener("submit", handleRegisterSubmit);

  REGISTER_FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => renderFieldError(id, ""));
  });
});
