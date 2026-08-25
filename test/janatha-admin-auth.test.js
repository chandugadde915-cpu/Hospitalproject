import test from "node:test";
import assert from "node:assert/strict";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key), clear: () => values.clear() };
}

const hospital = { id: "hospital-janatha-existing", name: "Janatha Hospitals", hospitalCode: "JANATHA", hospitalType: "Multi-Speciality Hospital", logoDataUrl: "data:image/png;base64,existing-logo", status: "Active" };
const janathaBranch = { id: "branch-janatha", name: "Hanamkonda Branch", hospitalId: hospital.id, status: "Active" };
const unrelatedBranch = { id: "branch-other", name: "Other Hospital Branch", hospitalId: "hospital-other", status: "Active" };

globalThis.__HOCC_ENV__ = { VITE_API_MODE: "local" };
globalThis.localStorage = memoryStorage({ hospital_operations_data: JSON.stringify({ version: 1, hospitals: [hospital], branches: [janathaBranch, unrelatedBranch], users: [] }) });
const { api } = await import("../src/services/api.js");

test("Janatha Hospitals email login resolves the existing hospital and persists all-branch context", async () => {
  const loggedIn = await api.login("janathaadmin@janathahospitals.local", "HoccTest@2026!");
  assert.equal(loggedIn.name, "Janatha Hospitals Admin");
  assert.equal(loggedIn.role, "HOSPITAL_ADMIN");
  assert.equal(loggedIn.hospitalId, hospital.id);
  assert.equal(loggedIn.hospitalCode, "JANATHA");
  assert.equal(loggedIn.accessScope, "ALL_BRANCHES");
  assert.equal(api.currentUser().hospitalId, hospital.id);
  assert.deepEqual(api.hospitals(api.currentUser()).map((item) => item.id), [hospital.id]);
  assert.deepEqual(api.branches(api.currentUser()).map((item) => item.id), [janathaBranch.id]);
});

test("logout clears the Janatha Hospitals authenticated context", async () => {
  await api.logout(api.currentUser());
  assert.equal(api.currentUser(), null);
});

test("inactive Janatha Hospitals Admin cannot login", async () => {
  localStorage.setItem("hospital_operations_data", JSON.stringify({ version: 1, hospitals: [hospital], branches: [janathaBranch], users: [{ id: "HA-JANATHA-001", username: "janathaadmin@janathahospitals.local", status: "Inactive" }] }));
  await assert.rejects(() => api.login("janathaadmin@janathahospitals.local", "HoccTest@2026!"), /Your account is inactive\. Contact system administrator\./);
});

test("wrong Janatha password is rejected and existing hadmin still authenticates", async () => {
  localStorage.setItem("hospital_operations_data", JSON.stringify({ version: 1, hospitals: [hospital], branches: [janathaBranch], users: [] }));
  await assert.rejects(() => api.login("janathaadmin@janathahospitals.local", "wrong-password"), /Invalid username or password/);
  const existingAdmin = await api.login("hadmin@hocctest.local", "HoccTest@2026!");
  assert.equal(existingAdmin.id, "local-hadmin");
  assert.equal(existingAdmin.role, "HOSPITAL_ADMIN");
});
