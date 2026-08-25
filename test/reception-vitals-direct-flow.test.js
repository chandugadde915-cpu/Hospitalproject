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

test("Reception can save a new patient and send the same record directly to Nurse OPD vitals", async () => {
  localStorage.clear();
  const reception = await api.login("reception@hocctest.local", "HoccTest@2026!");
  const patient = await api.registerPatient(reception, { name: "Direct Vitals Patient", mobile: "9888800011", gender: "Female", age: 31, address: "Test" });
  const token = await api.sendToVitals(reception, { patientId: patient.id, department: "General Medicine", doctor: "Dr. Murli", visitType: "Walk-in" });
  assert.equal(token.patientId, patient.id);
  assert.equal(token.mrn, patient.mrn);
  assert.equal(token.status, "WAITING_FOR_VITALS");
  assert.ok(token.appointmentId);

  const nurse = await api.login("nurse@hocctest.local", "HoccTest@2026!");
  assert.equal(api.queueTokens(nurse).some((item) => item.id === token.id && item.status === "WAITING_FOR_VITALS"), true);
  const vital = await api.recordVitals(nurse, { patientId: patient.id, appointmentId: token.appointmentId, queueTokenId: token.id, temperature: "98.6", bloodPressure: "120/80", pulse: "76", spo2: "99", respiratoryRate: "18", weight: "62", height: "165" });
  assert.equal(vital.queueTokenId, token.id);
  assert.equal(api.queueTokens(nurse).find((item) => item.id === token.id).status, "READY_FOR_DOCTOR");
  assert.equal(api.queueTokens(nurse).filter((item) => item.appointmentId === token.appointmentId).length, 1);
});

test("an existing booked appointment is activated once without duplicating patient or visit", async () => {
  localStorage.clear();
  const reception = await api.login("reception@hocctest.local", "HoccTest@2026!");
  const patient = await api.registerPatient(reception, { name: "Booked Vitals Patient", mobile: "9888800022", gender: "Male", address: "Test" });
  const appointment = await api.createAppointment(reception, { patientId: patient.id, department: "Cardiology", doctor: "Dr. Rao", date: new Date().toISOString().slice(0, 10), time: "10:30" });
  const first = await api.sendToVitals(reception, { patientId: patient.id, appointmentId: appointment.id });
  const repeated = await api.sendToVitals(reception, { patientId: patient.id, appointmentId: appointment.id });
  assert.equal(first.id, repeated.id);
  assert.equal(api.patients(reception).filter((item) => item.id === patient.id).length, 1);
  assert.equal(api.appointments(reception).filter((item) => item.id === appointment.id).length, 1);
  assert.equal(api.appointments(reception).find((item) => item.id === appointment.id).status, "WAITING_FOR_VITALS");
});
