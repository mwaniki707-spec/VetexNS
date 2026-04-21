// Client-side validation and sanitization.

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[0-9\s\-().]{7,20}$/;
const DANGEROUS_PATTERNS = [
  /<script\b[^>]*>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /eval\s*\(/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
];

function sanitizeInput(input) {
  let sanitized = String(input || "").trim();
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  return sanitized;
}

function containsDangerousContent(input) {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

function validateEmail(email) {
  if (!email) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Invalid email address";
  if (email.length > 254) return "Email is too long";
  return null;
}

function validatePhone(phone) {
  if (!phone) return null;
  if (!PHONE_REGEX.test(phone)) return "Invalid phone number";
  return null;
}

function validateName(name) {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 100) return "Name must be less than 100 characters";
  if (containsDangerousContent(name)) return "Name contains invalid characters";
  return null;
}

function validateMessage(message) {
  if (!message) return "Message is required";
  if (message.length < 10) return "Message must be at least 10 characters";
  if (message.length > 5000) return "Message must be less than 5000 characters";
  if (containsDangerousContent(message)) return "Message contains invalid content";
  return null;
}

function validateSubject(subject) {
  if (!subject) return "Subject is required";
  if (subject.length < 3) return "Subject must be at least 3 characters";
  if (subject.length > 200) return "Subject must be less than 200 characters";
  if (containsDangerousContent(subject)) return "Subject contains invalid content";
  return null;
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return null;
}

function validateContactForm(data) {
  const errors = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  const subjectError = validateSubject(data.subject);
  if (subjectError) errors.subject = subjectError;

  const messageError = validateMessage(data.message);
  if (messageError) errors.message = messageError;

  if (data.company && containsDangerousContent(data.company)) {
    errors.company = "Company name contains invalid content";
  }

  return errors;
}
