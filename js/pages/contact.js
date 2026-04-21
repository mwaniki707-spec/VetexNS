// Contact form handler

const CONTACT_FIELDS = ["name", "email", "company", "phone", "subject", "message"];
const CONTACT_STORAGE_KEY = "vertex_contact_submissions";

function getFormValues() {
  const values = {};
  CONTACT_FIELDS.forEach((f) => {
    const el = document.getElementById(f);
    values[f] = el ? el.value : "";
  });
  return values;
}

function resetForm() {
  CONTACT_FIELDS.forEach((f) => {
    const el = document.getElementById(f);
    if (el) el.value = "";
  });
  clearFieldErrors(CONTACT_FIELDS);
}

function showContactSuccess(message) {
  const success = document.getElementById("contact-success");
  const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("contact-success-message");
  const serverError = document.getElementById("contact-server-error");

  if (form) form.hidden = true;
  if (serverError) serverError.hidden = true;
  if (success) success.hidden = false;
  if (successMsg) successMsg.textContent = message || "We'll be in touch shortly.";
}

function showContactForm() {
  const success = document.getElementById("contact-success");
  const form = document.getElementById("contact-form");
  if (success) success.hidden = true;
  if (form) form.hidden = false;
  resetForm();
}

function storeSubmissionLocally(submission) {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...submission, submittedAt: new Date().toISOString() });
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota or parse errors */
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();

  const raw = getFormValues();
  const sanitized = {
    name: sanitizeInput(raw.name),
    email: sanitizeInput(raw.email),
    company: sanitizeInput(raw.company),
    phone: sanitizeInput(raw.phone),
    subject: sanitizeInput(raw.subject),
    message: sanitizeInput(raw.message),
  };

  const errors = validateContactForm(sanitized);
  clearFieldErrors(CONTACT_FIELDS);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, msg]) => renderFieldError(field, msg));
    return;
  }

  const submitBtn = document.getElementById("contact-submit");
  const serverError = document.getElementById("contact-server-error");
  if (serverError) serverError.hidden = true;

  setButtonLoading(submitBtn, true);

  await new Promise((r) => setTimeout(r, 600));

  try {
    storeSubmissionLocally(sanitized);
    showContactSuccess("Thank you for reaching out. Our team will respond within 2 business hours.");
  } catch {
    if (serverError) {
      serverError.hidden = false;
      serverError.textContent = "Something went wrong. Please try again.";
    }
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function bindInputClearing() {
  CONTACT_FIELDS.forEach((f) => {
    const el = document.getElementById(f);
    if (el) {
      el.addEventListener("input", () => renderFieldError(f, ""));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const resetBtn = document.getElementById("contact-reset");
  if (form) form.addEventListener("submit", handleContactSubmit);
  if (resetBtn) resetBtn.addEventListener("click", showContactForm);
  bindInputClearing();
});
