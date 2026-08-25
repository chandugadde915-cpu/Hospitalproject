import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const application = readFileSync(new URL("../src/core/application.js", import.meta.url), "utf8");
const administration = readFileSync(new URL("../src/pages/administration.js", import.meta.url), "utf8");

test("Branch Management exposes one shared, functional create flow", () => {
  assert.match(administration, /Create and manage hospital branches\./);
  assert.match(administration, /\+ Add Branch/);
  assert.match(administration, /\+ Add First Branch/);
  assert.match(administration, /data-form-action="create-branch"/);
  for (const field of ["name", "branchCode", "status", "address", "city", "state", "pinCode", "contactNumber", "email", "openingTime", "closingTime"]) assert.match(application, new RegExp(`name="${field}"`));
  assert.match(application, /Branch code already exists\./);
  assert.match(application, /Branch created successfully\./);
});

test("Branch list supports filtering and non-destructive status actions", () => {
  assert.match(administration, /Search branch by name, code or city/);
  assert.match(administration, /data-branch-status/);
  assert.match(administration, /Not Assigned/);
  assert.match(administration, /toggle-branch-status/);
  assert.doesNotMatch(administration.match(/export function branchesPage\(\) \{([\s\S]*?)\n\}/)?.[1] || "", /delete-record/);
});

test("Branch Overview contains operational data and branch-filtered shortcuts", () => {
  for (const label of ["Patients Today", "Today's Appointments", "Current Admissions", "Total Beds", "Available Beds", "Staff Count", "Today's Revenue"]) assert.match(application, new RegExp(label));
  for (const label of ["Branch Admin", "Departments", "Staff", "Wards & Beds", "Billing", "Reports"]) assert.match(application, new RegExp(label.replace("&", ".")));
  assert.match(application, /data-branch-id/);
});
