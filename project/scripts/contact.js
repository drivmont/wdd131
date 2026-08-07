/* contact.js — validates the contact form, shows feedback, and
   remembers a returning visitor's name/email with localStorage. */

const VISITOR_KEY = "signalscout-contact-visitor";
const INQUIRIES_KEY = "signalscout-contact-inquiries";

function getFieldErrors(fields) {
  const errors = [];

  if (fields.fullName.trim().length < 2) {
    errors.push("Please enter your full name.");
  }
  if (!fields.email.includes("@") || !fields.email.includes(".")) {
    errors.push("Please enter a valid email address.");
  }
  if (fields.reason === "") {
    errors.push("Please choose a reason for contacting us.");
  }
  if (fields.message.trim().length < 10) {
    errors.push("Your message should be at least 10 characters.");
  }
  if (!fields.consent) {
    errors.push("Please confirm you agree to be contacted.");
  }

  return errors;
}

function showAlert(message, type) {
  const alertBox = document.getElementById("formAlert");
  alertBox.className = `alert alert-${type}`;
  alertBox.innerHTML = message;
  alertBox.hidden = false;
}

function readVisitorRecord() {
  const raw = localStorage.getItem(VISITOR_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function prefillReturningVisitor() {
  const visitor = readVisitorRecord();
  if (!visitor) return;

  const nameField = document.getElementById("fullName");
  const emailField = document.getElementById("email");

  nameField.value = visitor.fullName;
  emailField.value = visitor.email;

  showAlert(`Welcome back, ${visitor.fullName}. We filled in your last name and email.`, "info");
}

function saveInquiry(fields) {
  localStorage.setItem(VISITOR_KEY, JSON.stringify({ fullName: fields.fullName, email: fields.email }));

  const raw = localStorage.getItem(INQUIRIES_KEY);
  let history = [];

  if (raw) {
    try {
      history = JSON.parse(raw);
    } catch (error) {
      history = [];
    }
  }

  history.push({
    fullName: fields.fullName,
    reason: fields.reason,
    sentAt: new Date().toISOString(),
  });

  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(history));
}

function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const fields = {
    fullName: form.fullName.value,
    email: form.email.value,
    reason: form.reason.value,
    message: form.message.value,
    consent: form.consent.checked,
  };

  const errors = getFieldErrors(fields);

  if (errors.length > 0) {
    const errorItems = errors.map((error) => `<li>${error}</li>`).join("");
    showAlert(`<strong>Please fix the following:</strong><ul>${errorItems}</ul>`, "error");
    return;
  }

  saveInquiry(fields);

  showAlert(`Thanks, ${fields.fullName}! Your message about "${form.reason.selectedOptions[0].text}" has been received. We'll reply to ${fields.email} soon.`, "success");
  form.reset();
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  prefillReturningVisitor();
  form.addEventListener("submit", handleContactSubmit);
}

document.addEventListener("DOMContentLoaded", initContactForm);
