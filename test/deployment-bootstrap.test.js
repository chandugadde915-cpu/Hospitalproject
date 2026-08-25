import test from "node:test";
import assert from "node:assert/strict";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key), clear: () => values.clear() };
}

globalThis.localStorage = memoryStorage();
const storeModule = await import(`../src/services/local-store.js?bootstrap=${Date.now()}`);

test("fresh browser bootstraps Janatha hospital and admin into the shared store", () => {
  const store = storeModule.getStore();
  const hospital = store.hospitals.find((item) => item.hospitalCode === "JANATHA");
  const admin = store.users.find((item) => item.username === "janathaadmin@janathahospitals.local");
  assert.equal(hospital.id, "HOSP-JANATHA");
  assert.equal(hospital.logoUrl, "/janatha-hospitals-logo.svg");
  assert.equal(admin.hospitalId, hospital.id);
  assert.equal(admin.accessScope, "ALL_BRANCHES");
});

test("bootstrap is idempotent and never overwrites edited profile or account status", () => {
  const first = storeModule.getStore();
  first.hospitals[0].address = "Edited deployment address";
  first.users[0].status = "Inactive";
  storeModule.saveStore(first);
  const second = storeModule.getStore();
  assert.equal(second.hospitals.filter((item) => item.hospitalCode === "JANATHA").length, 1);
  assert.equal(second.users.filter((item) => item.username === "janathaadmin@janathahospitals.local").length, 1);
  assert.equal(second.hospitals[0].address, "Edited deployment address");
  assert.equal(second.users[0].status, "Inactive");
});
