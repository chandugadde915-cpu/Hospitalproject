import test from "node:test";
import assert from "node:assert/strict";

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  clear() { this.data.clear(); }
}

globalThis.localStorage = new MemoryStorage();
globalThis.__HOCC_ENV__ = { VITE_API_MODE: "local" };
const { api } = await import("../src/services/api.js");

test("billing creates unique itemized invoices and maintains partial payment history", async () => {
  localStorage.clear();
  const reception = await api.login("reception@hocctest.local", "HoccTest@2026!");
  const patient = await api.registerPatient(reception, { name: "Invoice Patient", mobile: "9000000001", age: 34, gender: "Female" });
  const billing = await api.login("billing@hocctest.local", "HoccTest@2026!");
  const invoice = await api.generateBill(billing, {
    patientId: patient.id,
    billingItems: JSON.stringify([
      { service: "Consultation", qty: 1, rate: 1000, discount: 100, tax: 45 },
      { service: "Laboratory", qty: 2, rate: 250, discount: 0, tax: 25 }
    ])
  });
  assert.match(invoice.invoiceNumber, /^INV-\d{4}-\d{6}$/);
  assert.equal(invoice.subtotal, 1500);
  assert.equal(invoice.totalAmount, 1470);
  assert.equal(invoice.status, "Unpaid");

  await api.collectPayment(billing, invoice.id, { amount: 470, method: "UPI" });
  let updated = api.bills(billing).find((item) => item.id === invoice.id);
  assert.equal(updated.status, "Partially Paid");
  assert.equal(updated.balanceDue, 1000);
  await api.collectPayment(billing, invoice.id, { amount: 1000, method: "Card" });
  updated = api.bills(billing).find((item) => item.id === invoice.id);
  assert.equal(updated.status, "Paid");
  assert.equal(api.payments(billing).filter((item) => item.billId === invoice.id).length, 2);

  const second = await api.generateBill(billing, { patientId: patient.id, consultationFee: 500 });
  assert.notEqual(second.invoiceNumber, invoice.invoiceNumber);
});
