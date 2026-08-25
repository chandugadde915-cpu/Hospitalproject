import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const application = readFileSync(new URL("../src/core/application.js", import.meta.url), "utf8");
const primitives = readFileSync(new URL("../src/ui/primitives.js", import.meta.url), "utf8");
const administration = readFileSync(new URL("../src/pages/administration.js", import.meta.url), "utf8");
const pharmacy = readFileSync(new URL("../src/modules/pharmacy/workflow.js", import.meta.url), "utf8");

test("generic empty states never render a decorative plus", () => {
  const emptyState = primitives.match(/export function emptyState\(message\) \{([\s\S]*?)\n\}/)?.[1] || "";
  assert.doesNotMatch(emptyState, />\s*\+\s*</);
  assert.doesNotMatch(emptyState, /Use the primary action/);
  assert.match(emptyState, /compact-empty-state/);
});

test("shared empty-state actions are permission-aware and reuse create forms", () => {
  assert.match(application, /function enhanceEmptyStateActions\(page\)/);
  assert.match(application, /hasPermission\(currentUser, module, permission\)/);
  assert.match(application, /!createForm\(formAction\)/);
  assert.match(application, /button\.dataset\.action = "open-create"/);
  assert.match(application, /button\.dataset\.formAction = formAction/);
  for (const action of ["create-hospital", "create-branch", "create-user", "create-master-data", "create-staff", "create-appointment", "create-ward", "create-bed", "add-stock", "generate-bill"]) assert.match(application, new RegExp(action));
});

test("all remaining literal plus icons are wired to real actions", () => {
  assert.doesNotMatch(primitives, /empty-icon[^>]*>\s*\+\s*</);
  assert.match(pharmacy, /data-action="open-create" data-form-action="add-stock">\+<\/button>/);
  for (const label of ["Add Branch", "Add Staff"]) assert.match(administration, new RegExp(`data-action="open-create"[\\s\\S]*?\\+ ${label}`));
});
