import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const application = readFileSync(new URL("../src/core/application.js", import.meta.url), "utf8");
const administration = readFileSync(new URL("../src/pages/administration.js", import.meta.url), "utf8");
const rbac = readFileSync(new URL("../src/lib/rbac.js", import.meta.url), "utf8");

test("Hospital Profile supports one create-or-edit parent profile", () => {
  const page = administration.match(/export function hospitalsPage\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
  assert.match(page, /Hospital Profile/);
  assert.match(page, /Create Hospital Profile/);
  assert.match(page, /Edit Profile/);
  assert.match(page, /hospitals\[0\] \|\| null/);
  assert.doesNotMatch(page, /No records found/);
});

test("Hospital Profile form contains all requested fields and defaults", () => {
  const form = application.match(/"create-hospital": \{([\s\S]*?)\n    \},\n    "create-branch"/)?.[1] || "";
  for (const field of ["name", "hospitalCode", "hospitalType", "registrationNumber", "address", "city", "state", "pinCode", "contactNumber", "email", "website", "logoDataUrl", "status"]) assert.match(form, new RegExp(`name="${field}"`));
  assert.match(form, /value="Janatha Hospitals"/);
  assert.match(form, /value="JANATHA"/);
  assert.match(form, /Save Hospital Profile/);
  assert.match(application, /Hospital profile created successfully\./);
  assert.match(application, /Hospital profile updated successfully\./);
});

test("Hospital Admin has profile create and edit permission", () => {
  const active = rbac.slice(rbac.lastIndexOf("export const ROLE_PERMISSIONS = {"));
  const permissions = active.match(/\[ROLES\.HOSPITAL_ADMIN\]: \{([\s\S]*?)\n  \},\n  \[ROLES\.BRANCH_ADMIN\]/)?.[1] || "";
  assert.match(permissions, /hospitals: \{ view: true, create: true, edit: true \}/);
});
