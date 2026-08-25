import { escapeHtml } from "../utils/formatters.js";

export function badge(label, className) {
  return `<span class="badge ${className}">${escapeHtml(label)}</span>`;
}

export function emptyState(message) {
  return `
    <div class="empty compact-empty-state">
      <strong>${escapeHtml(message)}</strong>
    </div>
  `;
}

export function titleCase(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

export function formValues(form) {
  const values = {};
  const data = new FormData(form);
  for (const [key, value] of data.entries()) {
    if (values[key] === undefined) {
      values[key] = value;
    } else if (Array.isArray(values[key])) {
      values[key].push(value);
    } else {
      values[key] = [values[key], value];
    }
  }
  return values;
}

export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

export function strongPassword(password = "") {
  return String(password).length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
}
