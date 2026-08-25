import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const application = readFileSync(new URL("../src/core/application.js", import.meta.url), "utf8");
const administration = readFileSync(new URL("../src/pages/administration.js", import.meta.url), "utf8");

test("Hospital Admin Staff Management is employee-login focused", () => {
  const page = administration.match(/export function staffRosterPage\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
  for (const header of ["Employee Name", "Login / Email", "Role", "Branch", "Department", "Status", "Actions"]) assert.match(page, new RegExp(header.replace("/", ".")));
  assert.match(page, /\+ Add Staff/);
  assert.match(page, /create-staff/);
  for (const excluded of ["duty roster", "payroll", "attendance", "clinical records"]) assert.doesNotMatch(page, new RegExp(excluded, "i"));
});

test("Add Staff uses shared branches, departments and staff-only roles", () => {
  const form = application.match(/"create-staff": currentUser\.role[\s\S]*?\n    \} : null,/)?.[0] || "";
  for (const field of ["name", "employeeId", "contactEmail", "mobile", "email", "jobRole", "branchId", "department", "status"]) assert.match(form, new RegExp(`name="${field}"`));
  assert.match(form, /name: "password"/);
  assert.match(form, /name: "confirmPassword"/);
  for (const role of ["Doctor", "Nurse", "Receptionist", "Billing", "Lab", "Pharmacy", "Radiology", "Mortuary"]) assert.match(application, new RegExp(role));
  assert.doesNotMatch(form, /Branch Admin/);
  assert.match(application, /api\.masterDataItems\(currentUser\)/);
  assert.match(application, /api\.branches\(currentUser\)/);
});

test("Staff actions support edit, activation and password reset", () => {
  for (const action of ["edit-staff", "toggle-staff-status", "reset-staff-password"]) assert.match(administration + application, new RegExp(action));
  assert.match(application, /Staff login created successfully\./);
  assert.match(application, /Staff password reset successfully\./);
});
