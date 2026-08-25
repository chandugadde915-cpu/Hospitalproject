import { addRecord, createLocalId, findRecord, getCollection, getStore, JANATHA_ADMIN_LOGIN, JANATHA_HOSPITAL_CODE, JANATHA_HOSPITAL_ID, nextSequence, saveStore, updateRecord as updateLocalRecord } from "./local-store.js";

const SESSION_KEY = "hocc_mvp_session_v1";
const TOKEN_KEY = "hocc_access_token_v1";
const REFRESH_TOKEN_KEY = "hocc_refresh_token_v1";

const LOCAL_PASSWORD = "HoccTest@2026!";
const JANATHA_ADMIN_PASSWORD = globalThis.__HOCC_ENV__?.VITE_JANATHA_ADMIN_PASSWORD || LOCAL_PASSWORD;
const LOCAL_USERS = [
  { id: "HA-JANATHA-001", username: JANATHA_ADMIN_LOGIN, email: JANATHA_ADMIN_LOGIN, name: "Janatha Hospitals Admin", role: "HOSPITAL_ADMIN", jobRole: "Hospital Admin", hospitalId: JANATHA_HOSPITAL_ID, hospitalCode: JANATHA_HOSPITAL_CODE, hospitalName: "Janatha Hospitals", accessScope: "ALL_BRANCHES", status: "Active" },
  { id: "local-hadmin", email: "hadmin@hocctest.local", name: "Hospital Admin", role: "HOSPITAL_ADMIN", jobRole: "Hospital Admin" },
  { id: "local-badmin", email: "badmin@hocctest.local", name: "Branch Admin", role: "BRANCH_ADMIN", jobRole: "Branch Admin" },
  { id: "local-doctor", email: "doctor@hocctest.local", name: "Dr. Murli", department: "General Medicine", role: "BRANCH_USER", jobRole: "Doctor", allowedPages: ["dashboard", "patients", "queue", "consultation", "ipd", "ipdPatient360", "lab", "radiology", "pharmacy", "admissions", "dailySheets", "dutyDoctor", "discharge", "doctorSchedule", "followups", "documents", "tasks", "notifications"] },
  { id: "local-nurse", email: "nurse@hocctest.local", name: "Nurse", role: "BRANCH_USER", jobRole: "Nurse", allowedPages: ["dashboard", "patients", "queue", "vitals", "admissions", "wards", "ipdPatient360", "dailySheets", "nursing", "mar", "ipdVitals", "dutyDoctor", "intakeOutput", "handover", "tasks", "alerts"] },
  { id: "local-lab", email: "lab@hocctest.local", name: "Lab User", role: "BRANCH_USER", jobRole: "Lab User", allowedPages: ["dashboard", "lab", "lab-samples", "lab-processing", "lab-results", "lab-search", "documents", "reports", "alerts", "tasks"] },
  { id: "local-radiology", email: "radiology@hocctest.local", name: "Radiology User", role: "BRANCH_USER", jobRole: "Radiology User", allowedPages: ["dashboard", "radiology", "radiology-scheduling", "radiology-queue", "radiology-imaging", "radiology-results", "radiology-search", "documents", "reports", "alerts", "tasks"] },
  { id: "local-pharmacy", email: "pharmacy@hocctest.local", name: "Pharmacy User", role: "BRANCH_USER", jobRole: "Pharmacy User", allowedPages: ["pharmacy", "pharmacy-payments", "pharmacy-dispensing", "stock", "returns"] },
  { id: "local-billing", email: "billing@hocctest.local", name: "Billing User", role: "BRANCH_USER", jobRole: "Billing User", allowedPages: ["dashboard", "billing", "payments", "claims", "ipd-billing", "checkout", "refunds", "billing-search", "reports", "alerts", "tasks"] },
  { id: "local-reception", email: "reception@hocctest.local", name: "Receptionist", role: "BRANCH_USER", jobRole: "Reception User", allowedPages: ["dashboard", "patients", "admissions", "billing"] },
  { id: "local-mortuary", email: "mortuary@hocctest.local", name: "Mortuary Officer", role: "BRANCH_USER", jobRole: "Mortuary Officer", allowedPages: ["dashboard", "mortuary", "mortuary-intake", "mortuary-storage", "mortuary-release", "mortuary-search", "documents", "reports", "alerts", "tasks"] }
].map((user) => ({ hospitalId: "local-hospital", hospitalName: "HOCC Test Hospital", branchId: "local-branch", branchName: "Main Branch", status: "Active", mustChangePassword: false, ...user, allowedModules: user.allowedModules || user.allowedPages || [] }));

function resolveLocalUserContext(user) {
  if (!user) return null;
  const storedUser = getCollection("users").find((item) => String(item.id) === String(user.id) || String(item.username || item.email || "").toLowerCase() === String(user.username || user.email || "").toLowerCase());
  const merged = storedUser ? { ...user, ...storedUser, id: user.id, role: user.role } : { ...user };
  if (merged.hospitalCode) {
    const hospital = getCollection("hospitals").find((item) => String(item.hospitalCode || item.code || "").toUpperCase() === String(merged.hospitalCode).toUpperCase());
    if (hospital) return { ...merged, hospitalId: hospital.id, hospitalName: hospital.name, hospitalCode: hospital.hospitalCode || hospital.code || merged.hospitalCode, accessScope: "ALL_BRANCHES", branchId: "", branchName: "" };
  }
  return merged;
}

const UNREACHABLE_MESSAGE = "Unable to connect to production server. Please contact system administrator.";

const ENDPOINTS = {
  hospitals: "/hospitals",
  branches: "/branches",
  users: "/users",
  roles: "/roles",
  patients: "/patients",
  appointments: "/appointments",
  queueTokens: "/queue-tokens",
  patientFlows: "/patient-flows",
  vitals: "/vitals",
  consultations: "/consultations",
  prescriptions: "/prescriptions",
  prescriptionItems: "/prescription-items",
  labOrders: "/lab-orders",
  pharmacyIssues: "/pharmacy-issues",
  bills: "/bills",
  payments: "/payments",
  claims: "/claims",
  admissions: "/admissions",
  followUps: "/follow-ups",
  checkouts: "/checkouts",
  wards: "/wards",
  rooms: "/rooms",
  beds: "/beds",
  dailyPatientSheets: "/daily-patient-sheets",
  doctorProgressNotes: "/doctor-progress-notes",
  dutyDoctorNotes: "/duty-doctor-notes",
  consultantNotes: "/consultant-notes",
  nursingNotes: "/nursing-notes",
  ipdVitals: "/ipd-vitals",
  medicationAdministrationRecords: "/medication-records",
  intakeOutputCharts: "/intake-output",
  doctorHandovers: "/doctor-handovers",
  dischargePlans: "/discharge-plans",
  dischargeChecklists: "/discharge-checklists",
  dischargeSummaries: "/discharge-summaries",
  deathSummaries: "/death-summaries",
  wardRounds: "/ward-rounds",
  ipdAlerts: "/ipd-alerts",
  alerts: "/alerts",
  tasks: "/tasks",
  records: "/records",
  mappings: "/mappings",
  auditLogs: "/audit-logs",
  subscriptions: "/subscriptions",
  offers: "/offers",
  otBookings: "/ot-bookings",
  radiologyOrders: "/radiology-orders",
  admissionRecommendations: "/admission-recommendations",
  mortuaryRecords: "/mortuary-records",
  inventory: "/inventory",
  staff: "/staff",
  masterDataItems: "/master-data",
  setupProgress: "/setup-progress",
  doctorSchedules: "/doctor-schedules",
  appointmentSlots: "/appointment-slots",
  staffRosters: "/staff-rosters",
  staffLeaves: "/staff-leaves",
  emergencyCases: "/emergency",
  triageRecords: "/triage-records",
  patientDocuments: "/documents",
  documentStorageStatus: "/documents/storage-status",
  consentForms: "/consent-forms",
  notifications: "/notifications",
  financeReports: "/finance-reports",
  medicineStocks: "/pharmacy/stock",
  stockBatches: "/stock-batches",
  stockAdjustments: "/stock-adjustments",
  vendors: "/vendors",
  purchaseRequests: "/purchase-requests",
  purchaseOrders: "/purchase-orders",
  goodsReceipts: "/goods-receipts",
  patientFeedback: "/patient-feedback",
  complaints: "/complaints",
  backupLogs: "/backup-logs",
  privacyAccessLogs: "/privacy-access-logs",
  refunds: "/refunds",
  printDocuments: "/print-documents",
  userInvites: "/user-invites",
  incidents: "/incidents",
  providerStatus: "/providers/status",
  automationSettings: "/automation/settings",
  goLiveChecklist: "/go-live-checklist"
};

function runtimeEnv() {
  return globalThis.__HOCC_ENV__ || import.meta.env || {};
}

export function getApiMode() {
  const mode = runtimeEnv().VITE_API_MODE || "production";
  if (!["production", "local"].includes(mode)) throw new Error("API mode must be production or local.");
  return mode;
}

export function getApiBaseUrl() {
  if (getApiMode() === "local") return "local";
  const value = runtimeEnv().VITE_API_BASE_URL;
  if (!value) throw new Error("Production API base URL is required.");
  return value.replace(/\/$/, "");
}

function localStore() {
  return getStore();
}

function localCollection(path) {
  const resource = path.split("?")[0].split("/").filter(Boolean)[0] || "data";
  const names = { "queue-tokens": "queueTokens", "follow-ups": "followUps", "master-data": "masterDataItems", "prescription-items": "prescriptionItems", "lab-orders": "labOrders", "radiology-orders": "radiologyOrders", "admission-recommendations": "admissionRecommendations", "daily-patient-sheets": "dailyPatientSheets", "doctor-progress-notes": "doctorProgressNotes", "duty-doctor-notes": "dutyDoctorNotes", "nursing-notes": "nursingNotes", "ipd-vitals": "ipdVitals", "medication-records": "medicationRecords", "intake-output": "intakeOutput", "doctor-handovers": "doctorHandovers" };
  return names[resource] || resource.replaceAll("-", "");
}

function valueArray(value) {
  if (Array.isArray(value)) return value;
  return value === undefined || value === null || value === "" ? [] : [value];
}

function medicineMatchKey(value) {
  return String(value || "").toLowerCase().replace(/\b(mg|mcg|g|ml|tablet|tablets|capsule|capsules)\b/g, "").replace(/[^a-z0-9]+/g, "").trim();
}

function stockMatchesPrescriptionItem(item, stock) {
  const itemIds = [item?.medicineId, item?.productId, item?.inventoryItemId, item?.drugId].filter(Boolean).map(String);
  const stockIds = [stock?.medicineId, stock?.productId, stock?.inventoryItemId, stock?.drugId].filter(Boolean).map(String);
  if (itemIds.length && stockIds.length) return itemIds.some((id) => stockIds.includes(id));
  const itemKeys = [item?.medicine, `${item?.medicine || ""} ${item?.strength || ""}`].map(medicineMatchKey).filter(Boolean);
  const stockKeys = [stock?.medicine, stock?.medicineName, stock?.productName, `${stock?.medicine || stock?.medicineName || ""} ${stock?.strength || ""}`].map(medicineMatchKey).filter(Boolean);
  return itemKeys.some((key) => stockKeys.includes(key));
}

function validPricedStock(item, stocks = []) {
  const startOfToday = new Date(new Date().toDateString());
  return stocks.filter((stock) => stockMatchesPrescriptionItem(item, stock))
    .filter((stock) => Number(stock.quantityAvailable || 0) > 0 && Number(stock.sellingPrice || 0) > 0 && new Date(stock.expiryDate || stock.expiry || 0) >= startOfToday)
    .sort((a, b) => new Date(a.expiryDate || a.expiry) - new Date(b.expiryDate || b.expiry))[0] || null;
}

function pricePrescriptionItems(items = [], stocks = []) {
  return items.map((item) => {
    const quantity = Math.max(1, Number(item.prescribedQuantity || item.quantity || 1));
    const stock = validPricedStock(item, stocks);
    const unitPrice = Number(stock?.sellingPrice || 0);
    return { ...item, quantity, stockId: stock?.id || stock?._id || "", batchNumber: stock?.batchNumber || "", unitPrice, amount: quantity * unitPrice };
  });
}

function consultationPayload(body = {}) {
  const diagnoses = valueArray(body.diagnosis).map((diagnosis, index) => ({
    type: index === 0 ? "Primary" : "Secondary",
    diagnosis: String(diagnosis || "").trim(),
    notes: String(valueArray(body.diagnosisNotes)[index] || "").trim()
  })).filter((item) => item.diagnosis);
  const medicines = valueArray(body.medicine).map((medicine, index) => ({
    medicine: String(medicine || "").trim(), strength: String(valueArray(body.strength)[index] || "").trim(),
    dose: String(valueArray(body.dose)[index] || "").trim(), route: String(valueArray(body.route)[index] || "").trim(),
    frequency: String(valueArray(body.frequency)[index] || "").trim(), duration: String(valueArray(body.duration)[index] || "").trim(),
    instructions: String(valueArray(body.instructions)[index] || "").trim()
  })).filter((item) => item.medicine);
  const buildOrders = (kind) => valueArray(body[`${kind}Test`]).map((test, index) => ({
    test: String(test || "").trim(), clinicalIndication: String(valueArray(body[`${kind}Indication`])[index] || "").trim(),
    priority: String(valueArray(body[`${kind}Priority`])[index] || "Routine").trim(), notes: String(valueArray(body[`${kind}Notes`])[index] || "").trim()
  })).filter((item) => item.test);
  const payload = {
    chiefComplaint: String(body.chiefComplaint || "").trim(), historyOfPresentIllness: String(body.historyOfPresentIllness || "").trim(),
    examination: String(body.examination || "").trim(), pastMedicalHistory: String(body.pastMedicalHistory || "").trim(),
    currentMedications: String(body.currentMedications || "").trim(), allergiesReview: String(body.allergiesReview || "").trim(),
    notes: String(body.notes || "").trim(), diagnoses, diagnosisNotes: String(body.primaryDiagnosisNotes || "").trim(),
    noInvestigationRequired: body.noInvestigationRequired === "Yes", labOrders: buildOrders("lab"), radiologyOrders: buildOrders("radiology"),
    medicines, advice: String(body.advice || "").trim(), followUpRequired: body.followUpRequired === "Yes",
    followUpDate: String(body.followUpDate || "").trim(), followUpReason: String(body.followUpReason || "").trim(),
    followUpNotes: String(body.followUpNotes || "").trim(), admissionRecommended: body.admissionRecommended === "Yes",
    admissionReason: String(body.admissionReason || "").trim()
  };
  if (payload.noInvestigationRequired) {
    payload.labOrders = [];
    payload.radiologyOrders = [];
  }
  return payload;
}

function upsertConsultationOutputs(store, consultation, payload, finalStatus = "Draft") {
  const now = new Date().toISOString();
  const link = { patientId: consultation.patientId, appointmentId: consultation.appointmentId, consultationId: consultation.id, doctorId: consultation.doctorId, doctor: consultation.doctor };
  store.prescriptions = (store.prescriptions || []).filter((item) => String(item.consultationId) !== String(consultation.id));
  store.prescriptionItems = (store.prescriptionItems || []).filter((item) => String(item.consultationId) !== String(consultation.id));
  if (payload.medicines.length) {
    const prescription = { id: `RX-${consultation.id}`, ...link, status: finalStatus === "Completed" ? "Pending" : "Draft", items: payload.medicines, updatedAt: now, createdAt: now };
    store.prescriptions.push(prescription);
    payload.medicines.forEach((item, index) => store.prescriptionItems.push({ id: `${prescription.id}-${index + 1}`, prescriptionId: prescription.id, ...link, ...item, status: prescription.status, createdAt: now }));
  }
  const replaceOrders = (collection, orders, prefix, orderType) => {
    store[collection] = (store[collection] || []).filter((item) => String(item.consultationId) !== String(consultation.id));
    orders.forEach((order, index) => store[collection].push({ id: `${prefix}-${consultation.id}-${index + 1}`, ...link, ...order, orderType, tests: order.test, status: finalStatus === "Completed" ? "Ordered" : "Draft", result: "", report: "", createdAt: now }));
  };
  replaceOrders("labOrders", payload.labOrders, "LAB", "Lab");
  replaceOrders("radiologyOrders", payload.radiologyOrders, "RAD", "Radiology");
  store.followUps = (store.followUps || []).filter((item) => String(item.consultationId) !== String(consultation.id));
  if (payload.followUpRequired) store.followUps.push({ id: `FOLLOWUP-${consultation.id}`, ...link, date: payload.followUpDate, reason: payload.followUpReason, notes: payload.followUpNotes, status: finalStatus === "Completed" ? "Scheduled" : "Draft", reminderStatus: "Pending", createdAt: now });
  store.admissionRecommendations = (store.admissionRecommendations || []).filter((item) => String(item.consultationId) !== String(consultation.id));
  if (payload.admissionRecommended) store.admissionRecommendations.push({ id: `ADMREC-${consultation.id}`, ...link, reason: payload.admissionReason, status: "Admission Recommended", wardId: "", bedId: "", createdAt: now });
}

function localRead(path) {
  const cleanPath = path.split("?")[0];
  if (cleanPath === "/pharmacy/stock") return getCollection("medicineStocks");
  if (cleanPath === "/pharmacy/stock-transactions") return getCollection("stockTransactions");
  if (cleanPath === "/pharmacy/returns") return getCollection("pharmacyReturns");
  if (cleanPath.endsWith("/dashboard")) return {};
  if (cleanPath === "/appointment-options" || cleanPath.includes("booking-options")) {
    const branchId = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}").branchId || "local-branch";
    const departments = getCollection("masterDataItems")
      .filter((item) => ["department", "departments", "dept", "department master"].includes(String(item.type || "").trim().toLowerCase()))
      .filter((item) => !item.branchId || String(item.branchId) === String(branchId))
      .filter((item) => ["active", "enabled"].includes(String(item.status || "Active").trim().toLowerCase()))
      .map((item) => ({ id: item.id, name: item.name || item.departmentName || item.label }))
      .filter((item) => item.name);
    return { departments, doctors: [LOCAL_USERS[2]] };
  }
  if (cleanPath === "/providers/status" || cleanPath === "/automation/settings") return {};
  if (["/go-live-checklist", "/patient-portal/me", "/patient-portal/records"].includes(cleanPath)) return null;
  if (cleanPath === "/documents/storage-status" || cleanPath === "/backup/status") return {};
  return getCollection(localCollection(path));
}

function localRequest(path, options = {}) {
  const method = options.method || "GET";
  const body = typeof options.body === "string" ? JSON.parse(options.body || "{}") : (options.body || {});
  if (path === "/auth/login" && method === "POST") {
    const login = String(body.email || "").trim().toLowerCase();
    const builtInUser = LOCAL_USERS.find((entry) => [entry.email, entry.username].filter(Boolean).some((value) => String(value).toLowerCase() === login));
    const storedUser = getCollection("users").find((entry) => [entry.email, entry.username].filter(Boolean).some((value) => String(value).toLowerCase() === login));
    const baseUser = builtInUser ? { ...builtInUser, ...(storedUser || {}) } : storedUser;
    const expectedPassword = login === JANATHA_ADMIN_LOGIN ? JANATHA_ADMIN_PASSWORD : LOCAL_PASSWORD;
    if (!baseUser || body.password !== expectedPassword) throw new Error("Invalid username or password");
    const user = resolveLocalUserContext(baseUser);
    if (String(user.status || "Active").toLowerCase() !== "active") throw new Error("Your account is inactive. Contact system administrator.");
    return { user: { ...user, lastLoginAt: new Date().toISOString() }, accessToken: `local-${user.id}`, refreshToken: `local-refresh-${user.id}` };
  }
  if (method === "GET") return localRead(path);
  if (["/auth/logout", "/audit-logs"].includes(path)) return { success: true };
  const store = localStore();
  const cleanPath = path.split("?")[0];
  const pathParts = cleanPath.split("/").filter(Boolean);
  const pharmacyPrescriptionId = pathParts[0] === "pharmacy" && pathParts[1] === "prescriptions" ? decodeURIComponent(pathParts[2] || "") : "";
  const pharmacyUser = body.processedBy || body.pharmacist || body.user || "Pharmacy User";
  if (method === "POST" && pharmacyPrescriptionId && pathParts[3] === "verify") {
    const prescription = store.prescriptions.find((item) => String(item.id) === pharmacyPrescriptionId);
    if (!prescription) throw new Error("Prescription could not be found.");
    if (!["Pending", "PRESCRIBED", "Prescribed"].includes(prescription.status)) throw new Error("Only prescribed items can be verified.");
    const patient = store.patients.find((item) => String(item.id) === String(prescription.patientId)) || {};
    const items = (store.prescriptionItems || []).filter((item) => String(item.prescriptionId) === pharmacyPrescriptionId);
    const pricedItems = pricePrescriptionItems(items, store.medicineStocks || []);
    const subtotal = pricedItems.reduce((sum, item) => sum + item.amount, 0);
    const discount = Number(body.discount || 0), tax = Number(body.tax || 0), totalAmount = Math.max(0, subtotal - discount + tax);
    const now = new Date().toISOString();
    const existingBill = (store.bills || []).find((item) => String(item.prescriptionId) === pharmacyPrescriptionId);
    const bill = existingBill || { id: createLocalId("BILL"), billNumber: `BILL-${String((store.bills || []).length + 1).padStart(6, "0")}`, prescriptionId: pharmacyPrescriptionId, patientId: prescription.patientId, patientName: patient.name || prescription.patientName || "Patient", mrn: patient.mrn || prescription.mrn || "", items: pricedItems, subtotal, discount, tax, totalAmount, paidAmount: 0, paymentStatus: "Pending", status: "Draft", branchId: prescription.branchId || body.branchId || "", createdAt: now };
    if (!existingBill) store.bills.push(bill);
    store.prescriptions = store.prescriptions.map((item) => String(item.id) === pharmacyPrescriptionId ? { ...item, status: "PENDING_PAYMENT", verifiedAt: now, verifiedBy: pharmacyUser, billId: bill.id, updatedAt: now } : item);
    saveStore(store);
    return store.prescriptions.find((item) => String(item.id) === pharmacyPrescriptionId);
  }
  if (method === "POST" && pharmacyPrescriptionId && pathParts[3] === "payment") {
    const prescription = store.prescriptions.find((item) => String(item.id) === pharmacyPrescriptionId);
    if (!prescription || !["VERIFIED", "PENDING_PAYMENT"].includes(prescription.status)) throw new Error("A verified prescription awaiting payment is required.");
    const bill = (store.bills || []).find((item) => String(item.id) === String(prescription.billId) || String(item.prescriptionId) === pharmacyPrescriptionId);
    if (!bill) throw new Error("The linked pharmacy bill could not be found.");
    const prescriptionItems = (store.prescriptionItems || []).filter((item) => String(item.prescriptionId) === pharmacyPrescriptionId);
    const pricedItems = pricePrescriptionItems(prescriptionItems, store.medicineStocks || []);
    if (!pricedItems.length || pricedItems.some((item) => Number(item.unitPrice || 0) <= 0)) throw new Error("Medicine price is not configured. Update Inventory / Stock pricing first.");
    const subtotal = pricedItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const discount = Number(bill.discount || 0), tax = Number(bill.tax || 0), totalAmount = Math.max(0, subtotal - discount + tax);
    Object.assign(bill, { items: pricedItems, subtotal, discount, tax, totalAmount, updatedAt: new Date().toISOString() });
    const now = new Date().toISOString(), receiptNumber = `RCT-${String((store.payments || []).length + 1).padStart(6, "0")}`;
    const payment = { id: createLocalId("PAY"), prescriptionId: pharmacyPrescriptionId, billId: bill.id, receiptNumber, amount: Number(bill.totalAmount || 0), method: body.method || "Cash", status: "Paid", branchId: prescription.branchId || "", receivedBy: pharmacyUser, paidAt: now, createdAt: now };
    store.payments.push(payment);
    store.bills = store.bills.map((item) => String(item.id) === String(bill.id) ? { ...item, status: "Paid", paymentStatus: "Paid", paidAmount: Number(item.totalAmount || 0), paymentMethod: payment.method, receiptNumber, paidAt: now, updatedAt: now } : item);
    store.prescriptions = store.prescriptions.map((item) => String(item.id) === pharmacyPrescriptionId ? { ...item, status: "PAID", paymentId: payment.id, receiptNumber, paidAt: now, updatedAt: now } : item);
    saveStore(store);
    return payment;
  }
  if (method === "POST" && pharmacyPrescriptionId && pathParts[3] === "dispense") {
    const prescription = store.prescriptions.find((item) => String(item.id) === pharmacyPrescriptionId);
    if (!prescription || prescription.status !== "PAID") throw new Error("Only paid prescriptions can be dispensed.");
    const selections = Array.isArray(body.items) ? body.items : [];
    const prescribedItems = (store.prescriptionItems || []).filter((item) => String(item.prescriptionId) === pharmacyPrescriptionId);
    if (!prescribedItems.length || selections.length !== prescribedItems.length) throw new Error("Every prescribed medicine requires a batch and dispense quantity.");
    const now = new Date().toISOString();
    selections.forEach((selection) => {
      const item = prescribedItems.find((entry) => String(entry.id) === String(selection.itemId));
      const batch = (store.medicineStocks || []).find((entry) => String(entry.id) === String(selection.batchId));
      const quantity = Number(selection.quantity), prescribed = Number(item?.prescribedQuantity || item?.quantity || 1);
      if (!item || !batch || String(batch.medicine || "").toLowerCase() !== String(item.medicine || "").toLowerCase()) throw new Error("Select a valid batch for each medicine.");
      if (!Number.isInteger(quantity) || quantity <= 0 || quantity > prescribed) throw new Error("Dispense quantity cannot exceed the prescribed quantity.");
      if (new Date(batch.expiryDate) < new Date(new Date().toDateString())) throw new Error(`Batch ${batch.batchNumber || batch.id} is expired.`);
      if (Number(batch.quantityAvailable || 0) < quantity) throw new Error(`Insufficient stock for ${item.medicine}.`);
    });
    selections.forEach((selection) => {
      const item = prescribedItems.find((entry) => String(entry.id) === String(selection.itemId));
      const batch = store.medicineStocks.find((entry) => String(entry.id) === String(selection.batchId));
      const quantity = Number(selection.quantity), remaining = Number(batch.quantityAvailable || 0) - quantity;
      Object.assign(batch, { quantityAvailable: remaining, updatedAt: now });
      Object.assign(item, { dispensedQuantity: quantity, batchId: batch.id, batchNumber: batch.batchNumber, expiryDate: batch.expiryDate, dispensedAt: now, dispensedBy: pharmacyUser, status: "DISPENSED", updatedAt: now });
      store.stockTransactions.push({ id: createLocalId("STX"), prescriptionId: pharmacyPrescriptionId, prescriptionItemId: item.id, stockId: batch.id, medicine: item.medicine, batchNumber: batch.batchNumber, type: "DISPENSE", quantity: -quantity, balanceAfter: remaining, processedBy: pharmacyUser, branchId: prescription.branchId || batch.branchId || "", createdAt: now });
    });
    store.prescriptions = store.prescriptions.map((item) => String(item.id) === pharmacyPrescriptionId ? { ...item, status: "DISPENSED", dispensedAt: now, dispensedBy: pharmacyUser, updatedAt: now } : item);
    saveStore(store);
    return store.prescriptions.find((item) => String(item.id) === pharmacyPrescriptionId);
  }
  if (method === "POST" && pharmacyPrescriptionId && pathParts[3] === "return") {
    const prescription = store.prescriptions.find((item) => String(item.id) === pharmacyPrescriptionId);
    if (!prescription || !["DISPENSED", "COMPLETED", "PARTIAL_RETURN"].includes(prescription.status)) throw new Error("Only dispensed prescriptions can be returned.");
    const item = (store.prescriptionItems || []).find((entry) => String(entry.id) === String(body.itemId) && String(entry.prescriptionId) === pharmacyPrescriptionId);
    const prior = (store.pharmacyReturns || []).filter((entry) => String(entry.prescriptionItemId) === String(body.itemId)).reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
    const maximum = Number(item?.dispensedQuantity || 0) - prior, quantity = Number(body.quantity);
    if (!item || !Number.isInteger(quantity) || quantity <= 0 || quantity > maximum) throw new Error("Return quantity exceeds the maximum returnable quantity.");
    if (!String(body.reason || "").trim()) throw new Error("Return reason is required.");
    const now = new Date().toISOString(), saleable = body.condition === "Saleable unopened valid" && new Date(item.expiryDate) >= new Date(new Date().toDateString());
    const batch = store.medicineStocks.find((entry) => String(entry.id) === String(item.batchId));
    if (saleable && batch) batch.quantityAvailable = Number(batch.quantityAvailable || 0) + quantity;
    if (!saleable && batch) batch.quarantineQuantity = Number(batch.quarantineQuantity || 0) + quantity;
    const returnedTotal = prior + quantity, status = returnedTotal >= Number(item.dispensedQuantity || 0) ? "RETURNED" : "PARTIAL_RETURN";
    store.pharmacyReturns.push({ id: createLocalId("RET"), prescriptionId: pharmacyPrescriptionId, prescriptionItemId: item.id, receiptNumber: prescription.receiptNumber || "", medicine: item.medicine, quantity, reason: body.reason, condition: body.condition, disposition: saleable ? "SALEABLE_STOCK" : "QUARANTINE", processedBy: pharmacyUser, returnedAt: now, branchId: prescription.branchId || "", createdAt: now });
    item.returnedQuantity = returnedTotal; item.returnStatus = status; item.updatedAt = now;
    if (batch) store.stockTransactions.push({ id: createLocalId("STX"), prescriptionId: pharmacyPrescriptionId, prescriptionItemId: item.id, stockId: batch.id, medicine: item.medicine, batchNumber: batch.batchNumber, type: saleable ? "RETURN_TO_STOCK" : "RETURN_TO_QUARANTINE", quantity, balanceAfter: Number(batch.quantityAvailable || 0), processedBy: pharmacyUser, branchId: prescription.branchId || "", createdAt: now });
    const allItems = store.prescriptionItems.filter((entry) => String(entry.prescriptionId) === pharmacyPrescriptionId);
    const prescriptionStatus = allItems.every((entry) => Number(entry.returnedQuantity || 0) >= Number(entry.dispensedQuantity || 0)) ? "RETURNED" : "PARTIAL_RETURN";
    store.prescriptions = store.prescriptions.map((entry) => String(entry.id) === pharmacyPrescriptionId ? { ...entry, status: prescriptionStatus, updatedAt: now } : entry);
    saveStore(store);
    return store.pharmacyReturns.at(-1);
  }
  if (method === "POST" && cleanPath === "/pharmacy/stock") {
    const quantity = Number(body.quantityAvailable || body.quantity || 0);
    if (!body.medicine || !body.batchNumber || !body.expiryDate || !Number.isFinite(quantity) || quantity < 0) throw new Error("Medicine, batch, expiry date, and a valid quantity are required.");
    const record = { id: createLocalId("STOCK"), ...body, quantityAvailable: quantity, quarantineQuantity: 0, createdAt: new Date().toISOString() };
    store.medicineStocks.push(record); saveStore(store); return record;
  }
  if (method === "POST" && cleanPath === "/patients") {
    const duplicate = store.patients.find((item) => (body.mobile && item.mobile === body.mobile) || (body.idProofNumber && item.idProofNumber === body.idProofNumber) || (body.name && body.dob && String(item.name).toLowerCase() === String(body.name).toLowerCase() && item.dob === body.dob));
    if (duplicate && body.duplicateAction !== "create-new-anyway") throw new Error("Possible existing patient found. Use the existing patient or review the patient record.");
    const sequence = nextSequence("patients");
    return addRecord("patients", { id: createLocalId("PAT"), mrn: `MRN-${String(sequence).padStart(6, "0")}`, ...body, status: "Registered", createdAt: new Date().toISOString() });
  }
  if (method === "POST" && cleanPath === "/appointments") {
    if (!body.patientId) throw new Error("Please select a patient.");
    const patient = findRecord("patients", body.patientId);
    if (!patient) throw new Error("Selected patient could not be found.");
    const sequence = nextSequence("appointments");
    return addRecord("appointments", { id: createLocalId("APT"), appointmentNumber: `APT-${String(sequence).padStart(6, "0")}`, ...body, patientName: patient.name, mrn: patient.mrn, mobile: patient.mobile, status: "Booked", createdAt: new Date().toISOString() });
  }
  if (method === "POST" && cleanPath === "/visits/check-in") {
    const appointment = findRecord("appointments", body.appointmentId);
    if (!appointment) throw new Error("Appointment could not be found.");
    if (appointment.status === "Booked") return updateLocalRecord("appointments", appointment.id, { status: "Arrived", arrivedAt: new Date().toISOString() });
    const existing = getCollection("queueTokens").find((token) => String(token.appointmentId) === String(appointment.id) && !["Completed", "Cancelled"].includes(token.status));
    if (existing) return existing;
    updateLocalRecord("appointments", appointment.id, { status: "Checked In", checkedInAt: new Date().toISOString() });
    const sequence = nextSequence("queueTokens");
    return addRecord("queueTokens", { id: createLocalId("QUEUE"), tokenNumber: `A${String(sequence).padStart(3, "0")}`, patientId: appointment.patientId, appointmentId: appointment.id, patientName: appointment.patientName, mrn: appointment.mrn, department: appointment.department, doctor: appointment.doctor, visitType: appointment.visitType, priority: appointment.priority, status: "Vitals Pending", branchId: appointment.branchId, checkedInAt: new Date().toISOString(), createdAt: new Date().toISOString() });
  }
  if (method === "POST" && cleanPath === "/visits/send-to-vitals") {
    if (!body.patientId) throw new Error("Please select an existing patient.");
    const patient = findRecord("patients", body.patientId);
    if (!patient) throw new Error("Selected patient could not be found.");
    const now = new Date().toISOString();
    let appointment = body.appointmentId ? findRecord("appointments", body.appointmentId) : null;
    if (body.appointmentId && !appointment) throw new Error("Appointment could not be found.");
    if (!appointment) {
      const appointmentSequence = nextSequence("appointments");
      appointment = addRecord("appointments", {
        id: createLocalId("APT"), appointmentNumber: `APT-${String(appointmentSequence).padStart(6, "0")}`,
        patientId: patient.id, patientName: patient.name || patient.fullName || "Patient", mrn: patient.mrn || patient.uhid || "", mobile: patient.mobile || patient.mobileNumber || "",
        department: body.department || "OPD", doctor: body.doctor || "Duty Doctor", doctorId: body.doctorId || "", visitType: body.visitType || "Walk-in",
        date: body.date || now.slice(0, 10), time: body.time || now.slice(11, 16), branchId: body.branchId || patient.branchId || "",
        status: "WAITING_FOR_VITALS", createdBy: body.createdBy || "", createdAt: now, updatedAt: now
      });
    } else {
      appointment = updateLocalRecord("appointments", appointment.id, { status: "WAITING_FOR_VITALS", arrivedAt: appointment.arrivedAt || now, checkedInAt: now, updatedAt: now });
    }
    const existing = getCollection("queueTokens").find((token) => String(token.appointmentId) === String(appointment.id) && !["Completed", "Cancelled"].includes(token.status));
    if (existing) return existing;
    const sequence = nextSequence("queueTokens");
    return addRecord("queueTokens", {
      id: createLocalId("QUEUE"), tokenNumber: `A${String(sequence).padStart(3, "0")}`,
      patientId: patient.id, appointmentId: appointment.id, patientName: patient.name || patient.fullName || "Patient", mrn: patient.mrn || patient.uhid || "",
      age: patient.age || "", gender: patient.gender || "", mobile: patient.mobile || patient.mobileNumber || "",
      department: appointment.department || body.department || "OPD", doctor: appointment.doctor || body.doctor || "Duty Doctor",
      visitType: appointment.visitType || body.visitType || "OPD", priority: appointment.priority || body.priority || "Normal",
      status: "WAITING_FOR_VITALS", branchId: appointment.branchId || body.branchId || patient.branchId || "", visitTime: now, checkedInAt: now, createdAt: now, updatedAt: now
    });
  }
  if (method === "POST" && cleanPath === "/vitals") {
    if (!body.patientId) throw new Error("Please select a patient.");
    const activeToken = store.queueTokens.find((token) =>
      (!body.queueTokenId || String(token.id) === String(body.queueTokenId)) &&
      String(token.patientId) === String(body.patientId) &&
      ["Waiting", "Vitals Pending", "WAITING_FOR_VITALS"].includes(token.status)
    );
    if (!activeToken) throw new Error("This patient is no longer waiting for OPD vitals.");
    const recordedAt = new Date().toISOString();
    const record = addRecord("vitals", { id: createLocalId("VITAL"), ...body, appointmentId: activeToken.appointmentId || body.appointmentId || "", queueTokenId: activeToken.id, recordedAt, status: "Recorded", createdAt: recordedAt });
    if (activeToken) {
      const readyStatus = activeToken.status === "WAITING_FOR_VITALS" ? "READY_FOR_DOCTOR" : "Ready for Doctor";
      updateLocalRecord("queueTokens", activeToken.id, { status: readyStatus, vitalsRecordedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      if (activeToken.appointmentId) updateLocalRecord("appointments", activeToken.appointmentId, { status: readyStatus, vitalsRecordedAt: recordedAt, updatedAt: recordedAt });
    }
    return record;
  }
  if (method === "POST" && cleanPath === "/consultations/start") {
    const token = store.queueTokens.find((item) => String(item.id || item._id) === String(body.queueTokenId || "")) || store.queueTokens.find((item) => String(item.patientId) === String(body.patientId || "") && String(item.appointmentId) === String(body.appointmentId || "") && ["Ready for Doctor", "READY_FOR_DOCTOR", "With Doctor"].includes(item.status));
    if (!token || !["Ready for Doctor", "READY_FOR_DOCTOR", "With Doctor"].includes(token.status) || !token.patientId || !token.appointmentId) throw new Error("A Ready-for-Doctor OPD encounter is required.");
    const tokenId = token.id || token._id;
    const patientQueueEncounters = store.queueTokens.filter((item) => String(item.patientId) === String(token.patientId) && !["Completed", "Cancelled"].includes(item.status));
    const vital = store.vitals.find((item) => {
      if (String(item.patientId) !== String(token.patientId)) return false;
      if (item.queueTokenId) return String(item.queueTokenId) === String(tokenId);
      if (item.appointmentId) return String(item.appointmentId) === String(token.appointmentId);
      return patientQueueEncounters.length === 1;
    });
    if (!vital) throw new Error("Completed OPD vitals are required before consultation.");
    let consultation = store.consultations.find((item) => ["In Progress", "Draft"].includes(item.status) && (String(item.queueTokenId || "") === String(tokenId) || String(item.appointmentId || "") === String(token.appointmentId)));
    if (!consultation) {
      const sequence = nextSequence("consultations");
      consultation = addRecord("consultations", { id: `CON-${String(sequence).padStart(6, "0")}`, patientId: token.patientId, appointmentId: token.appointmentId, queueTokenId: tokenId, doctorId: body.doctorId || "", doctor: body.doctor || "", status: "In Progress", startedAt: new Date().toISOString(), chiefComplaint: "", historyOfPresentIllness: "", examination: "", diagnoses: [], labOrders: [], radiologyOrders: [], medicines: [], notes: "", createdAt: new Date().toISOString() });
    }
    updateLocalRecord("queueTokens", tokenId, { status: "With Doctor", consultationId: consultation.id, consultationStartedAt: consultation.startedAt });
    return consultation;
  }
  if (method === "PATCH" && pathParts[0] === "consultations" && pathParts[2] === "draft") {
    const consultationId = decodeURIComponent(pathParts[1] || "");
    const existing = store.consultations.find((item) => String(item.id) === consultationId);
    if (!existing) throw new Error("Consultation could not be found.");
    if (existing.status === "Completed") throw new Error("Completed consultations are read-only.");
    const payload = consultationPayload(body);
    store.consultations = store.consultations.map((item) => String(item.id) === consultationId ? { ...item, ...payload, status: "In Progress", updatedAt: new Date().toISOString() } : item);
    const saved = store.consultations.find((item) => String(item.id) === consultationId);
    upsertConsultationOutputs(store, saved, payload, "Draft");
    saveStore(store);
    return saved;
  }
  if (method === "POST" && pathParts[0] === "consultations" && pathParts[2] === "complete") {
    const consultationId = decodeURIComponent(pathParts[1] || "");
    const existing = store.consultations.find((item) => String(item.id) === consultationId);
    if (!existing) throw new Error("Consultation could not be found.");
    if (existing.status === "Completed") throw new Error("Consultation already completed.");
    if (body.doctorId && String(existing.doctorId) !== String(body.doctorId)) throw new Error("This consultation belongs to another doctor.");
    if (!store.patients.some((item) => String(item.id) === String(existing.patientId))) throw new Error("Patient could not be found.");
    const payload = consultationPayload(body);
    if (!payload.diagnoses.some((item) => item.type === "Primary" && item.diagnosis)) throw new Error("Primary Diagnosis is required before completion.");
    if (!payload.chiefComplaint || !payload.examination) throw new Error("Chief Complaint and Examination are required before completion.");
    const completedAt = new Date().toISOString();
    const downstreamStatus = payload.labOrders.length || payload.radiologyOrders.length ? "Investigations Pending" : payload.medicines.length ? "Pharmacy Pending" : payload.admissionRecommended ? "Admission Recommended" : "Billing Pending";
    store.consultations = store.consultations.map((item) => String(item.id) === consultationId ? { ...item, ...payload, status: "Completed", downstreamStatus, completedAt, updatedAt: completedAt } : item);
    const completed = store.consultations.find((item) => String(item.id) === consultationId);
    upsertConsultationOutputs(store, completed, payload, "Completed");
    store.queueTokens = store.queueTokens.map((item) => String(item.id || item._id) === String(existing.queueTokenId) ? { ...item, status: downstreamStatus, consultationStatus: "Completed", consultationCompletedAt: completedAt, updatedAt: completedAt } : item);
    saveStore(store);
    return completed;
  }
  if (method === "POST" && cleanPath === "/ipd-vitals") {
    if (!body.admissionId) throw new Error("Please select an active admission.");
    const admission = store.admissions.find((item) => String(item.id) === String(body.admissionId));
    if (!admission || !["Admitted", "Under Treatment"].includes(admission.admissionStatus || admission.status) || !(admission.ward || admission.wardId) || !(admission.bedId || admission.bedNumber)) {
      throw new Error("IPD vitals require an active admitted patient with a ward and bed.");
    }
    const recordedAt = body.recordedAt || new Date().toISOString();
    const record = addRecord("ipdVitals", { id: createLocalId("IPD-VITAL"), ...body, patientId: admission.patientId, admissionId: admission.id, recordedAt, dateTime: recordedAt, status: body.status || "Recorded", createdAt: recordedAt });
    addRecord("dailyPatientSheets", {
      id: createLocalId("DAILY"),
      admissionId: admission.id,
      patientId: admission.patientId,
      patientName: admission.patientName,
      ward: admission.ward || admission.wardId,
      bedNumber: admission.bedNumber || admission.bedId,
      currentCondition: "Vitals recorded",
      vitalsSummary: `BP ${body.bloodPressure || "-"}, Pulse ${body.pulse || "-"}, SpO2 ${body.spo2 || "-"}, Temp ${body.temperature || "-"}`,
      recordedBy: body.recordedBy,
      createdAt: recordedAt
    });
    return record;
  }
  if (method === "POST" && cleanPath === "/doctor-progress-notes") {
    const admission = store.admissions.find((item) => String(item.id || item._id) === String(body.admissionId));
    if (!admission || !["Admitted", "Under Treatment"].includes(admission.admissionStatus || admission.status) || !admission.patientId || !(admission.ward || admission.wardId) || !(admission.bedId || admission.bedNumber || admission.bed)) throw new Error("Doctor progress notes require an active admitted patient with a ward and bed.");
    const now = new Date().toISOString();
    if (body.id) {
      const existing = store.doctorProgressNotes.find((item) => String(item.id) === String(body.id));
      if (!existing || existing.status === "Signed") throw new Error("This progress note cannot be edited.");
      return updateLocalRecord("doctorProgressNotes", body.id, { ...body, patientId: admission.patientId, admissionId: admission.id, updatedAt: now });
    }
    const sequence = nextSequence("doctorProgressNotes");
    return addRecord("doctorProgressNotes", { id: `DPR-${String(sequence).padStart(6, "0")}`, ...body, patientId: admission.patientId, admissionId: admission.id, status: body.status || "Draft", recordedAt: body.recordedAt || now, createdAt: now, updatedAt: now });
  }
  if (method === "POST" && cleanPath === "/bills/generate") {
    if (!body.patientId) throw new Error("Please select a patient.");
    const patient = findRecord("patients", body.patientId);
    if (!patient) throw new Error("Please select an existing patient record.");
    const serviceFields = [
      ["Registration", body.registrationFee], ["Consultation", body.consultationFee],
      ["Laboratory", body.labCharges], ["Radiology", body.radiologyCharges],
      ["Pharmacy", body.pharmacyCharges], ["Procedures", body.procedureCharges],
      ["Room / Bed Charges", body.bedCharges], ["Nursing Charges", body.nursingCharges],
      ["Other Hospital Services", body.emergencyCharges]
    ];
    const parsedItems = (() => { try { return JSON.parse(body.billingItems || "[]"); } catch { return []; } })();
    const items = (Array.isArray(parsedItems) && parsedItems.length ? parsedItems : serviceFields.map(([service, rate]) => ({ service, qty: 1, rate })))
      .map((item) => {
        const qty = Math.max(0, Number(item.qty || 1));
        const rate = Math.max(0, Number(item.rate ?? item.amount ?? 0));
        const discount = Math.max(0, Number(item.discount || 0));
        const taxable = Math.max(0, qty * rate - discount);
        const tax = Math.max(0, Number(item.tax || 0));
        return { service: item.service || item.name || "Hospital service", qty, rate, discount, tax, amount: taxable + tax };
      }).filter((item) => item.amount > 0);
    if (!items.length) throw new Error("Add at least one billable service.");
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const itemDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const discount = itemDiscount + Math.max(0, Number(body.discount || 0));
    const tax = items.reduce((sum, item) => sum + item.tax, 0) + Math.max(0, Number(body.tax || 0));
    const advanceAmount = Math.max(0, Number(body.advanceAmount || 0));
    const totalAmount = Math.max(0, subtotal - discount + tax - advanceAmount);
    const sequence = nextSequence("bills");
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(sequence).padStart(6, "0")}`;
    if (getCollection("bills").some((bill) => bill.invoiceNumber === invoiceNumber)) throw new Error("Invoice number already exists. Please try again.");
    const paidAmount = body.markPaid === "Yes" ? totalAmount : Math.min(totalAmount, Math.max(0, Number(body.amountPaid || 0)));
    const status = paidAmount >= totalAmount ? "Paid" : paidAmount > 0 ? "Partially Paid" : "Unpaid";
    const now = new Date().toISOString();
    return addRecord("bills", { id: createLocalId("BILL"), billNumber: invoiceNumber, invoiceNumber, ...body, patientName: patient.name || patient.fullName || "Patient", mrn: patient.mrn || patient.uhid || "", uhid: patient.uhid || patient.mrn || "", items, subtotal, discount, tax, advanceAmount, totalAmount, grandTotal: totalAmount, paidAmount, balanceDue: Math.max(0, totalAmount - paidAmount), paymentStatus: status, status, createdBy: body.createdBy || "", createdAt: now, updatedAt: now });
  }
  if (method === "POST" && pathParts[0] === "bills" && pathParts[2] === "payment") {
    const billId = decodeURIComponent(pathParts[1] || "");
    const bill = findRecord("bills", billId);
    if (!bill) throw new Error("Invoice could not be found.");
    if (bill.status === "Refunded") throw new Error("Refunded invoices cannot receive payments.");
    const balance = Math.max(0, Number(bill.totalAmount || 0) - Number(bill.paidAmount || 0));
    const amount = body.amount == null ? balance : Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > balance) throw new Error("Enter a payment amount within the outstanding balance.");
    const now = new Date().toISOString();
    const payment = addRecord("payments", { id: createLocalId("PAY"), billId, invoiceNumber: bill.invoiceNumber || bill.billNumber, patientId: bill.patientId, amount, method: body.method || body.paymentMethod || bill.paymentType || "Cash", reference: body.reference || "", receivedBy: body.receivedBy || body.createdBy || "", createdAt: now });
    const paidAmount = Number(bill.paidAmount || 0) + amount;
    const status = paidAmount >= Number(bill.totalAmount || 0) ? "Paid" : "Partially Paid";
    updateLocalRecord("bills", billId, { paidAmount, balanceDue: Math.max(0, Number(bill.totalAmount || 0) - paidAmount), paymentStatus: status, status, paymentMethod: payment.method, paidAt: status === "Paid" ? now : bill.paidAt, updatedAt: now });
    return payment;
  }
  if (method === "POST" && cleanPath === "/follow-ups") {
    if (!body.patientId) throw new Error("Please select a patient.");
    const patient = findRecord("patients", body.patientId);
    return addRecord("followUps", { id: createLocalId("FOLLOWUP"), ...body, patientName: patient?.name || "Patient", mrn: patient?.mrn || "", status: body.status || "Scheduled", reminderStatus: body.reminderStatus || "Pending", createdAt: new Date().toISOString() });
  }
  if (method === "POST" && cleanPath === "/admissions") {
    const patients = Array.isArray(store.patients) ? store.patients : [];
    const patient = patients.find((item) => String(item.id || item._id) === String(body.patientId)) || {};
    if (!patient.id && !patient._id) throw new Error("Please select an existing patient.");
    const activeStatuses = new Set(["Admission Requested", "Awaiting Bed", "Bed Assigned", "Admitted", "Under Treatment", "Discharge Pending"]);
    const existing = (store.admissions || []).find((item) => String(item.patientId) === String(body.patientId) && activeStatuses.has(item.admissionStatus || item.status));
    if (existing) throw new Error(`Active admission ${existing.id} already exists for this patient.`);
    const sequence = nextSequence("admissions");
    const record = {
      id: body.id || `ADM-${String(sequence).padStart(6, "0")}`,
      ...body,
      patientName: body.patientName || patient.name || patient.fullName || "Patient",
      mrn: body.mrn || patient.mrn || "",
      admissionStatus: "Admission Requested",
      status: "Admission Requested",
      branchId: body.branchId || JSON.parse(localStorage.getItem(SESSION_KEY) || "{}").branchId || "",
      createdAt: body.createdAt || new Date().toISOString()
    };
    store.admissions = [...(Array.isArray(store.admissions) ? store.admissions : []), record];
    saveStore(store);
    return record;
  }
  if (method === "POST" && pathParts[0] === "admissions" && pathParts[2] === "assign-bed") {
    const admissionId = decodeURIComponent(pathParts[1] || "");
    const beds = Array.isArray(store.beds) ? store.beds : [];
    const bed = beds.find((item) => String(item.id || item._id) === String(body.bedId)) || {};
    if (!bed.id && !bed._id) throw new Error("Please select a valid available bed.");
    if (String(bed.status || "Available") !== "Available" && String(bed.admissionId || "") !== admissionId) throw new Error("Bed already occupied.");
    store.admissions = (Array.isArray(store.admissions) ? store.admissions : []).map((item) => String(item.id || item._id) === admissionId ? {
      ...item,
      bedId: body.bedId || item.bedId,
      bedNumber: body.bedNumber || bed.bed || bed.bedNumber || item.bedNumber,
      ward: body.ward || bed.ward || bed.wardName || item.ward,
      wardId: body.wardId || bed.wardId || item.wardId,
      room: body.room || bed.room || bed.roomNumber || item.room,
      admissionStatus: "Bed Assigned",
      status: "Bed Assigned",
      updatedAt: new Date().toISOString()
    } : item);
    const assignedAdmission = store.admissions.find((item) => String(item.id || item._id) === admissionId);
    store.beds = beds.map((item) => String(item.id || item._id) === String(body.bedId) ? { ...item, status: "Occupied", admissionId, patientId: assignedAdmission?.patientId || "", updatedAt: new Date().toISOString() } : item);
    saveStore(store);
    return store.admissions.find((item) => String(item.id || item._id) === admissionId) || { success: false };
  }
  if (method === "POST" && pathParts[0] === "admissions" && pathParts[2] === "admit") {
    const admissionId = decodeURIComponent(pathParts[1] || "");
    const admission = (store.admissions || []).find((item) => String(item.id || item._id) === admissionId);
    if (!admission || !admission.patientId || !admission.ward || !(admission.bedId || admission.bedNumber)) throw new Error("Ward and bed are required before admitting the patient.");
    const admittedAt = new Date().toISOString();
    store.admissions = store.admissions.map((item) => String(item.id || item._id) === admissionId ? { ...item, admissionStatus: "Admitted", status: "Admitted", admittedAt, updatedAt: admittedAt } : item);
    saveStore(store);
    return store.admissions.find((item) => String(item.id || item._id) === admissionId);
  }
  const key = localCollection(path);
  const rows = Array.isArray(store[key]) ? store[key] : [];
  const id = decodeURIComponent(path.split("?")[0].split("/").filter(Boolean)[1] || "");
  if (method === "DELETE") store[key] = rows.filter((row) => String(row.id || row._id) !== id);
  else if (["PATCH", "PUT"].includes(method) && id) store[key] = rows.map((row) => String(row.id || row._id) === id ? { ...row, ...body, updatedAt: new Date().toISOString() } : row);
  else {
    const record = { id: body.id || `local-${Date.now()}`, ...body, createdAt: body.createdAt || new Date().toISOString() };
    store[key] = [...rows, record];
    saveStore(store);
    return record;
  }
  saveStore(store);
  return store[key].find((row) => String(row.id || row._id) === id) || { success: true };
}

function authHeaders(extra = {}) {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeError(error) {
  if (error?.message === "Production API mode is required.") return error;
  if (error?.message === "Production API base URL is required.") return error;
  return new Error(error?.message || UNREACHABLE_MESSAGE);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// The access token is short-lived (15 min) by design. Rather than forcing a
// re-login every time it lapses mid-session, silently exchange the longer-lived
// refresh token for a new one — only a fully expired/invalid refresh token (or
// none stored) should ever surface "session expired" to the user.
async function tryRefreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    const payload = await response.json().catch(() => ({ success: false }));
    if (!response.ok || payload.success === false) return false;
    localStorage.setItem(TOKEN_KEY, payload.data.accessToken);
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload.data.user));
    return true;
  } catch {
    return false;
  }
}

function tryRefreshTokenSync() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken || typeof XMLHttpRequest === "undefined") return false;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${getApiBaseUrl()}/auth/refresh`, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ refreshToken }));
    const payload = JSON.parse(xhr.responseText || "{}");
    if (xhr.status < 200 || xhr.status >= 300 || payload.success === false) return false;
    localStorage.setItem(TOKEN_KEY, payload.data.accessToken);
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload.data.user));
    return true;
  } catch {
    return false;
  }
}

async function requestBackend(path, options = {}, _retriedAfterRefresh = false) {
  if (getApiMode() === "local") {
    const result = localRequest(path, options);
    if (options.method && options.method !== "GET") {
      invalidateCache();
      notifyDataRefresh("*", null);
    }
    return result;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers: authHeaders(options.headers || {}),
      body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
    });
    const payload = await response.json().catch(() => ({ success: false, error: "Invalid server response." }));
    if (!response.ok || payload.success === false) {
      if (response.status === 401) {
        if (!_retriedAfterRefresh && path !== "/auth/refresh" && (await tryRefreshToken())) {
          return requestBackend(path, options, true);
        }
        clearSession();
      }
      throw new Error(payload.error || "Request failed.");
    }
    if (options.method && options.method !== "GET") {
      // A write happened — drop cached reads so the next render refetches fresh data.
      invalidateCache();
      notifyDataRefresh("*", null);
    }
    return payload.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

function requestBackendSync(path, _retriedAfterRefresh = false) {
  if (getApiMode() === "local") return localRead(path);
  if (typeof XMLHttpRequest === "undefined") throw new Error(UNREACHABLE_MESSAGE);
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${getApiBaseUrl()}${path}`, false);
    const headers = authHeaders();
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    xhr.send();
    const payload = JSON.parse(xhr.responseText || "{}");
    if (xhr.status === 401) {
      if (!_retriedAfterRefresh && tryRefreshTokenSync()) {
        return requestBackendSync(path, true);
      }
      clearSession();
    }
    if (xhr.status < 200 || xhr.status >= 300 || payload.success === false) {
      throw new Error(payload.error || "Request failed.");
    }
    return payload.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

// --- Non-blocking data cache -------------------------------------------------
// Pages read data synchronously, but we never block the UI thread on the network.
// cachedRead() returns the last known value immediately (or a fallback) and
// refreshes in the background, notifying the app to re-render when data arrives.
const SYNC_CACHE = new Map(); // path -> { value, ts, loading, error }
const CACHE_TTL_MS = 12000;
let onDataRefreshCb = null;

function notifyDataRefresh(path, error) {
  if (typeof onDataRefreshCb === "function") {
    try { onDataRefreshCb(path, error || null); } catch (_e) { /* ignore listener errors */ }
  }
}

function backgroundFetch(path) {
  const entry = SYNC_CACHE.get(path) || { value: undefined, ts: 0, loading: false, error: null };
  if (entry.loading) return;
  entry.loading = true;
  SYNC_CACHE.set(path, entry);
  requestBackend(path)
    .then((data) => {
      const prev = SYNC_CACHE.get(path);
      const changed = !prev || JSON.stringify(prev.value) !== JSON.stringify(data);
      SYNC_CACHE.set(path, { value: data, ts: Date.now(), loading: false, error: null });
      if (changed) notifyDataRefresh(path, null);
    })
    .catch((error) => {
      const e = SYNC_CACHE.get(path) || { value: undefined, ts: 0 };
      e.loading = false; e.error = error; e.ts = Date.now();
      SYNC_CACHE.set(path, e);
      notifyDataRefresh(path, error);
    });
}

function fallbackValue(fallback) {
  return typeof fallback === "function" ? fallback() : fallback;
}

function cachedRead(path, fallback = []) {
  const entry = SYNC_CACHE.get(path);
  if (entry) {
    if (entry.value !== undefined) {
      // Serve cached value instantly; refresh in the background when stale (never blocks the UI).
      if (!entry.loading && Date.now() - entry.ts > CACHE_TTL_MS) backgroundFetch(path);
      return entry.value;
    }
    // An async warm/refresh is in flight, or a recent fetch failed — don't block the UI thread;
    // return the fallback now and let the background result trigger a re-render.
    if (entry.loading || Date.now() - entry.ts < CACHE_TTL_MS) return fallbackValue(fallback);
  }
  // Cold read with nothing in flight: fetch once, synchronously, so the first paint has real
  // data. Every later render reads from cache — a screen never re-blocks the way the old
  // per-render sync model did (which fired ~40 blocking calls per view).
  try {
    const value = requestBackendSync(path);
    SYNC_CACHE.set(path, { value, ts: Date.now(), loading: false, error: null });
    return value;
  } catch (error) {
    SYNC_CACHE.set(path, { value: undefined, ts: Date.now(), loading: false, error });
    throw error;
  }
}

// Warm the cache asynchronously (non-blocking) so navigation reads hit the cache.
function warmCache(paths = []) {
  paths.forEach((p) => { if (p) backgroundFetch(p); });
}

// Force the next read of a path (or all paths) to refetch — call after mutations.
function invalidateCache(prefix) {
  if (!prefix) { SYNC_CACHE.clear(); return; }
  for (const key of [...SYNC_CACHE.keys()]) {
    if (key === prefix || key.startsWith(prefix)) SYNC_CACHE.delete(key);
  }
}

function scopeHospitalRows(rows, endpoint, user) {
  if (!Array.isArray(rows) || user?.role !== "HOSPITAL_ADMIN" || user?.accessScope !== "ALL_BRANCHES" || !user?.hospitalId) return rows;
  if (endpoint === "/hospitals") return rows.filter((item) => String(item.id) === String(user.hospitalId) || String(item.hospitalCode || item.code || "").toUpperCase() === String(user.hospitalCode || "").toUpperCase());
  if (endpoint === "/branches") return rows.filter((item) => String(item.hospitalId || "") === String(user.hospitalId) || String(item.hospitalCode || "").toUpperCase() === String(user.hospitalCode || "").toUpperCase());
  const branchIds = new Set(cachedRead("/branches", []).filter((item) => String(item.hospitalId || "") === String(user.hospitalId) || String(item.hospitalCode || "").toUpperCase() === String(user.hospitalCode || "").toUpperCase()).map((item) => String(item.id)));
  return rows.filter((item) => String(item.hospitalId || "") === String(user.hospitalId) || (item.branchId && branchIds.has(String(item.branchId))));
}

const list = (endpoint) => (user) => scopeHospitalRows(cachedRead(endpoint, []), endpoint, user);
const post = (endpoint) => (user, payload = {}) => requestBackend(endpoint, { method: "POST", body: { ...payload, ...(user?.hospitalId && !payload.hospitalId ? { hospitalId: user.hospitalId } : {}), ...(user?.hospitalCode && !payload.hospitalCode ? { hospitalCode: user.hospitalCode } : {}) } });
const patch = (endpoint) => (_user, id, payload = {}) => requestBackend(`${endpoint}/${encodeURIComponent(id)}`, { method: "PATCH", body: payload });

function collectionEndpoint(collection) {
  const endpoint = ENDPOINTS[collection];
  if (!endpoint) throw new Error("This collection is not connected to production API.");
  return endpoint;
}

function dashboardEndpoint(user) {
  if (user?.role === "SUPER_ADMIN") return "/platform/dashboard";
  if (user?.role === "HOSPITAL_ADMIN") return "/hospital/dashboard";
  return "/branch/dashboard";
}

export function createProductionApiClient() {
  return {
    async login(email, password) {
      const data = await requestBackend("/auth/login", { method: "POST", body: { email, password } });
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      invalidateCache();
      return data.user;
    },
    async logout(user) {
      await requestBackend("/auth/logout", { method: "POST", body: { userId: user?.id } }).catch(() => null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
      invalidateCache();
    },
    async patientLogin(email, password) {
      const data = await requestBackend("/patient-portal/login", { method: "POST", body: { email, password } });
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      invalidateCache();
      return data.user;
    },
    patientAcceptInvite: (payload = {}) => requestBackend("/patient-portal/accept-invite", { method: "POST", body: payload }),
    patientMe: () => cachedRead("/patient-portal/me", null),
    patientRecords: () => cachedRead("/patient-portal/records", null),
    sendPatientPortalInvite: (_user, patientId) => requestBackend(`/patients/${encodeURIComponent(patientId)}/portal-invite`, { method: "POST" }),
    setBranchPatientPortalAccess: (_user, branchId, enabled) => requestBackend(`/branches/${encodeURIComponent(branchId)}/patient-portal-access`, { method: "POST", body: { enabled } }),
    setBranchPublicBookingAccess: (_user, branchId, enabled) => requestBackend(`/branches/${encodeURIComponent(branchId)}/public-booking-access`, { method: "POST", body: { enabled } }),
    publicBookingOptions: (branchId) => cachedRead(`/public/booking-options?branchId=${encodeURIComponent(branchId)}`, { departments: [], doctors: [] }),
    submitPublicBooking: (payload = {}) => requestBackend("/public/book-appointment", { method: "POST", body: payload }),
    downloadPatientPortalDocument: (documentId) => requestBackend(`/patient-portal/documents/${encodeURIComponent(documentId)}/download`),
    currentUser() {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      try {
        const sessionUser = JSON.parse(saved);
        if (getApiMode() === "local") {
          const localUser = LOCAL_USERS.find((item) => String(item.id) === String(sessionUser.id) || String(item.email).toLowerCase() === String(sessionUser.email || "").toLowerCase());
          if (localUser) {
            const refreshedUser = { ...sessionUser, ...resolveLocalUserContext(localUser), lastLoginAt: sessionUser.lastLoginAt };
            if (String(refreshedUser.status || "Active").toLowerCase() !== "active") {
              localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_TOKEN_KEY); localStorage.removeItem(SESSION_KEY);
              return null;
            }
            localStorage.setItem(SESSION_KEY, JSON.stringify(refreshedUser));
            return refreshedUser;
          }
        }
        return sessionUser;
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    },
    me: () => requestBackend("/me"),
    async updateProfile(_user, payload) {
      const user = await requestBackend("/me/profile", { method: "PUT", body: payload });
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    },
    async changePassword(_user, payload) {
      const data = await requestBackend("/me/change-password", { method: "POST", body: payload });
      if (data?.user) localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      else if (data && typeof data === "object" && ("email" in data || "role" in data || "mustChangePassword" in data)) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      }
      return data?.user || data;
    },
    forgotPassword: (email) => requestBackend("/auth/forgot-password", { method: "POST", body: { email } }),
    resetPassword: (payload) => requestBackend("/auth/reset-password", { method: "POST", body: payload }),
    onDataRefresh(cb) { onDataRefreshCb = cb; },
    warm: (paths) => warmCache(paths),
    providerStatus: () => cachedRead(ENDPOINTS.providerStatus, {}),
    automationSettings: () => cachedRead(ENDPOINTS.automationSettings, {}),
    goLiveChecklist: () => cachedRead(ENDPOINTS.goLiveChecklist, null),
    saveAutomationSettings: (_user, payload = {}) => requestBackend(ENDPOINTS.automationSettings, { method: "PUT", body: payload }),
    logSensitiveAction: (_user, module, action, target = "-") => requestBackend("/audit-logs", { method: "POST", body: { module, action, target } }),
    dashboard: (user) => cachedRead(dashboardEndpoint(user), {}),
    accessReviewUsers: () => cachedRead("/governance/access-review", []),
    getUserAccessDetail: (_user, userId) => cachedRead(`/governance/users/${encodeURIComponent(userId)}/access`, {}),
    permissionTemplates: () => cachedRead("/governance/templates", []),
    createPermissionTemplate: (_user, payload) => requestBackend("/governance/templates", { method: "POST", body: payload }),
    updatePermissionTemplate: (_user, templateId, payload) => requestBackend(`/governance/templates/${encodeURIComponent(templateId)}`, { method: "PUT", body: payload }),
    duplicatePermissionTemplate: (_user, templateId) => requestBackend(`/governance/templates/${encodeURIComponent(templateId)}/duplicate`, { method: "POST", body: {} }),
    disablePermissionTemplate: (_user, templateId) => requestBackend(`/governance/templates/${encodeURIComponent(templateId)}/disable`, { method: "POST", body: {} }),
    applyPermissionTemplate: (_user, templateId, payload) => requestBackend(`/governance/templates/${encodeURIComponent(templateId)}/apply`, { method: "POST", body: payload }),
    cloneUserPermissions: (_user, payload) => requestBackend("/governance/users/clone-permissions", { method: "POST", body: payload }),
    reviewUserAccess: (_user, userId, reviewStatus, payload = {}) => requestBackend(
      `/governance/users/${encodeURIComponent(userId)}/${reviewStatus === "Changes Required" ? "request-changes" : "mark-reviewed"}`,
      { method: "POST", body: payload }
    ),
    revokeSensitivePermissions: (_user, userId, payload = {}) => requestBackend(`/governance/users/${encodeURIComponent(userId)}/revoke-sensitive`, { method: "POST", body: payload }),
    disableUser: (_user, userId, payload = {}) => requestBackend(`/governance/users/${encodeURIComponent(userId)}/disable`, { method: "POST", body: payload }),
    governanceAudit: () => cachedRead("/governance/audit", []),
    globalSearch: (_user, query) => cachedRead(`/search?q=${encodeURIComponent(query || "")}`, []),
    createSubscriptionPlan: post("/subscriptions"),
    updateSubscriptionPlan: (_user, id, payload) => requestBackend(`/subscriptions/${encodeURIComponent(id)}`, { method: "PATCH", body: payload }),
    disableSubscriptionPlan: (_user, id) => requestBackend(`/subscriptions/${encodeURIComponent(id)}`, { method: "DELETE" }),
    createOffer: post("/offers"),
    updateOffer: (_user, id, payload) => requestBackend(`/offers/${encodeURIComponent(id)}`, { method: "PATCH", body: payload }),
    disableOffer: (_user, id) => requestBackend(`/offers/${encodeURIComponent(id)}`, { method: "DELETE" }),
    otBookings: () => cachedRead("/ot-bookings", []),
    scheduleSurgery: post("/ot-bookings"),
    updateOtBooking: (_user, id, payload) => requestBackend(`/ot-bookings/${encodeURIComponent(id)}`, { method: "PATCH", body: payload }),
    transitionOtBooking: (_user, id, payload = {}) => requestBackend(`/ot-bookings/${encodeURIComponent(id)}/status`, { method: "POST", body: payload }),
    cancelOtBooking: (_user, id) => requestBackend(`/ot-bookings/${encodeURIComponent(id)}`, { method: "DELETE" }),
    patientEmr: (_user, patientId) => cachedRead(`/emr/${encodeURIComponent(patientId)}`, null),
    radiologyOrders: () => cachedRead("/radiology-orders", []),
    orderRadiology: post("/radiology-orders"),
    updateRadiologyOrder: (_user, id, payload) => requestBackend(`/radiology-orders/${encodeURIComponent(id)}`, { method: "PATCH", body: payload }),
    transitionRadiologyOrder: (_user, id, payload = {}) => requestBackend(`/radiology-orders/${encodeURIComponent(id)}/status`, { method: "POST", body: payload }),
    mortuaryRecords: () => cachedRead("/mortuary-records", []),
    registerDeath: post("/mortuary-records"),
    updateMortuaryRecord: (_user, id, payload) => requestBackend(`/mortuary-records/${encodeURIComponent(id)}`, { method: "PATCH", body: payload }),
    releaseMortuaryBody: (_user, id, payload = {}) => requestBackend(`/mortuary-records/${encodeURIComponent(id)}/release`, { method: "POST", body: payload }),
    issueDeathCertificate: (_user, id, payload = {}) => requestBackend(`/mortuary-records/${encodeURIComponent(id)}/issue-certificate`, { method: "POST", body: payload }),
    createHospital: post("/hospitals"),
    createBranch: post("/branches"),
    createWard: post("/wards"),
    createBed: post("/beds"),
    createUser: post("/users"),
    appointmentOptions: () => cachedRead("/appointment-options", { departments: [], doctors: [] }),
    createAppointment: (user, payload = {}) => requestBackend("/appointments", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", createdBy: user?.id || user?.email || "" } }),
    registerPatient: (user, payload = {}) => requestBackend("/patients", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", createdBy: user?.id || user?.email || "" } }),
    checkInAppointment: (_user, appointmentId) => requestBackend("/visits/check-in", { method: "POST", body: { appointmentId } }),
    sendToVitals: (user, payload = {}) => requestBackend("/visits/send-to-vitals", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", createdBy: user?.id || user?.email || "" } }),
    recordVitals: (user, payload = {}) => requestBackend("/vitals", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", recordedBy: user?.name || user?.email || "" } }),
    completeConsultation: post("/consultations"),
    startConsultation: (user, encounter) => requestBackend("/consultations/start", { method: "POST", body: { ...(typeof encounter === "object" ? encounter : { queueTokenId: encounter }), doctorId: user?.id || "", doctor: user?.name || "" } }),
    saveConsultationDraft: (_user, consultationId, payload = {}) => requestBackend(`/consultations/${encodeURIComponent(consultationId)}/draft`, { method: "PATCH", body: payload }),
    completeDoctorConsultation: (user, consultationId, payload = {}) => requestBackend(`/consultations/${encodeURIComponent(consultationId)}/complete`, { method: "POST", body: { ...payload, doctorId: user?.id || "" } }),
    generateBill: (user, payload = {}) => requestBackend("/bills/generate", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", createdBy: user?.id || user?.email || "" } }),
    addMedicineStock: post("/pharmacy/stock"),
    issuePharmacy: (_user, issueId) => requestBackend("/pharmacy/issue", { method: "POST", body: { issueId } }),
    verifyPharmacyPrescription: (user, prescriptionId, payload = {}) => requestBackend(`/pharmacy/prescriptions/${encodeURIComponent(prescriptionId)}/verify`, { method: "POST", body: { ...payload, pharmacist: user?.name || user?.email || "Pharmacy User", branchId: user?.branchId || "" } }),
    payPharmacyPrescription: (user, prescriptionId, payload = {}) => {
      const body = { ...payload, prescriptionId, processedBy: user?.name || user?.email || "Pharmacy User" };
      if (getApiMode() === "local") return requestBackend(`/pharmacy/prescriptions/${encodeURIComponent(prescriptionId)}/payment`, { method: "POST", body });
      if (!payload.billId) throw new Error("The verified prescription has no linked bill.");
      return requestBackend(`/bills/${encodeURIComponent(payload.billId)}/payment`, { method: "POST", body });
    },
    dispensePharmacyPrescription: (user, prescriptionId, payload = {}) => requestBackend(`/pharmacy/prescriptions/${encodeURIComponent(prescriptionId)}/dispense`, { method: "POST", body: { ...payload, pharmacist: user?.name || user?.email || "Pharmacy User" } }),
    returnPharmacyItem: (user, prescriptionId, payload = {}) => requestBackend(`/pharmacy/prescriptions/${encodeURIComponent(prescriptionId)}/return`, { method: "POST", body: { ...payload, processedBy: user?.name || user?.email || "Pharmacy User" } }),
    pharmacyStockTransactions: () => cachedRead("/pharmacy/stock-transactions", []),
    pharmacyReturns: () => cachedRead("/pharmacy/returns", []),
    collectPayment: (_user, billId, payload = {}) => requestBackend(`/bills/${encodeURIComponent(billId)}/payment`, { method: "POST", body: payload }),
    createRazorpayOrder: (_user, billId) => requestBackend(`/bills/${encodeURIComponent(billId)}/razorpay-order`, { method: "POST" }),
    verifyRazorpayPayment: (_user, billId, payload = {}) => requestBackend(`/bills/${encodeURIComponent(billId)}/razorpay-verify`, { method: "POST", body: payload }),
    bookFollowUp: (user, payload = {}) => requestBackend("/follow-ups", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", createdBy: user?.id || user?.email || "" } }),
    createAdmissionRequest: post("/admissions"),
    assignBed: (_user, admissionId, payload = {}) => requestBackend(`/admissions/${encodeURIComponent(admissionId)}/assign-bed`, { method: "POST", body: payload }),
    admitPatient: (_user, admissionId) => requestBackend(`/admissions/${encodeURIComponent(admissionId)}/admit`, { method: "POST", body: {} }),
    addDailyPatientSheet: post("/daily-patient-sheets"),
    saveDoctorProgressNote: (user, payload = {}) => requestBackend("/doctor-progress-notes", { method: "POST", body: { ...payload, doctorId: user?.id || "", doctor: user?.name || user?.email || "Doctor" } }),
    addDutyDoctorNote: post("/duty-doctor-notes"),
    createDoctorHandover: post("/doctor-handovers"),
    addNursingNote: post("/nursing-notes"),
    recordIPDVitals: (user, payload = {}) => requestBackend("/ipd-vitals", { method: "POST", body: { ...payload, branchId: payload.branchId || user?.branchId || "", recordedBy: user?.name || user?.email || "" } }),
    markMedicationGiven: (user, id, payload = {}) => requestBackend(`/medication-records/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: {
        status: "Given",
        givenTime: new Date().toISOString(),
        givenBy: user?.name || user?.email || "Assigned Nurse",
        ...payload
      }
    }),
    addIntakeOutput: post("/intake-output"),
    acceptHandover: (user, id, payload = {}) => requestBackend(`/doctor-handovers/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: {
        status: "Accepted",
        handoverTakenBy: user?.name || user?.email || "Incoming Doctor",
        acceptedAt: new Date().toISOString(),
        ...payload
      }
    }),
    completeDischargeStep: (_user, id, payload = {}) => requestBackend(`/discharge-plans/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: {
        status: "Ready for Discharge",
        bedReleased: true,
        finalizedAt: new Date().toISOString(),
        ...payload
      }
    }),
    completeClearance: (_user, id, payload = {}) => requestBackend(`/discharge-plans/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: payload
    }),
    getDeathSummary: (_user, admissionId) => cachedRead(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary`, null),
    saveDeathSummary: (_user, admissionId, payload = {}) => requestBackend(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary`, { method: "POST", body: payload }),
    updateDeathSummary: (_user, admissionId, payload = {}) => requestBackend(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary`, { method: "PUT", body: payload }),
    submitDeathSummary: (_user, admissionId) => requestBackend(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary/submit`, { method: "POST", body: {} }),
    approveDeathSummary: (_user, admissionId, payload = {}) => requestBackend(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary/approve`, { method: "POST", body: payload }),
    returnDeathSummary: (_user, admissionId, payload = {}) => requestBackend(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary/return`, { method: "POST", body: payload }),
    printDeathSummary: (_user, admissionId) => requestBackend(`/ipd/admissions/${encodeURIComponent(admissionId)}/death-summary/print-log`, { method: "POST", body: {} }),
    completeCheckout: (_user, checkoutId, payload = {}) => requestBackend("/checkout", {
      method: "POST",
      body: { checkoutId, status: "Completed", completedAt: new Date().toISOString(), ...payload }
    }),
    createEmergencyCase: post("/emergency/quick-registration"),
    createTask: post("/tasks"),
    updateTask: (_user, id, payload = {}) => requestBackend(`/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: typeof payload === "string" ? { status: payload } : payload
    }),
    updateAlert: (_user, id, payload = {}) => requestBackend(`/alerts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: typeof payload === "string" ? { status: payload, acknowledgedAt: new Date().toISOString() } : payload
    }),
    updateLabOrder: (_user, id, payload = {}) => requestBackend(`/lab-orders/${encodeURIComponent(id)}/report`, { method: "PATCH", body: payload }),
    createMasterDataItem: post("/master-data"),
    createServicePrice: (_user, payload = {}) => requestBackend("/master-data", { method: "POST", body: { ...payload, type: "Service Price" } }),
    toggleMasterDataItem: (_user, id, payload = {}) => requestBackend(`/master-data/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: payload
    }),
    createDoctorSchedule: post("/doctor-schedules"),
    addDoctorLeave: post("/staff-leaves"),
    createStaffRoster: post("/staff-rosters"),
    createPurchaseRequest: post("/purchase-requests"),
    approvePurchaseRequest: patch("/purchase-requests"),
    receiveGoods: post("/goods-receipts"),
    submitFeedback: post("/patient-feedback"),
    createConsentForm: post("/consent-forms"),
    uploadDocument: (_user, payload = {}) => requestBackend("/documents/upload", { method: "POST", body: payload }),
    downloadDocument: (_user, documentId) => requestBackend(`/documents/${encodeURIComponent(documentId)}/download`),
    deleteDocumentFile: (_user, documentId) => requestBackend(`/documents/${encodeURIComponent(documentId)}`, { method: "DELETE" }),
    markNotificationRead: (_user, id) => requestBackend(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH", body: {} }),
    markAllNotificationsRead: () => requestBackend("/notifications/mark-all-read", { method: "POST", body: {} }),
    clearReadNotifications: () => requestBackend("/notifications/read", { method: "DELETE", body: {} }),
    backupStatus: () => cachedRead("/backup/status", {}),
    requestRestore: (_user, payload = {}) => requestBackend("/backup/restore-request", { method: "POST", body: payload }),
    runManualBackup: post("/backup-logs"),
    saveSetupWizard: post("/setup-progress"),
    saveMapping: post("/mappings"),
    ingestRows: (_user, rows, recordType) => requestBackend("/records", { method: "POST", body: { rows, recordType } }),
    adjustStock: post("/stock-adjustments"),
    printDocument: post("/print-documents"),
    sendInvite: (_user, payload) => requestBackend("/admin/invite-user", { method: "POST", body: payload }),
    acceptInvite: (inviteId, password) => requestBackend("/auth/accept-invite", { method: "POST", body: { inviteId, password } }),
    resendInvite: (_user, inviteId) => requestBackend("/admin/resend-invite", { method: "POST", body: { inviteId } }),
    updateRecord: (_user, collection, id, payload) => requestBackend(`${collectionEndpoint(collection)}/${encodeURIComponent(id)}`, { method: "PATCH", body: payload }),
    deleteRecord: (_user, collection, id) => requestBackend(`${collectionEndpoint(collection)}/${encodeURIComponent(id)}`, { method: "DELETE" }),
    ...Object.fromEntries(Object.entries(ENDPOINTS).map(([name, endpoint]) => [name, list(endpoint)]))
  };
}

export const api = createProductionApiClient();

export function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());
  return lines.filter(Boolean).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ""]));
  });
}

export function validateRows(rows, departments = ["Cardiology", "Emergency", "OPD", "Billing", "Pharmacy"]) {
  const issues = [];
  const duplicateKeys = new Set();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const department = row.Department || row.Dept || "";
    const doctor = row.Doctor || row["Doctor Name"] || "";
    const waitTime = Number(row["Wait Time"] || row.Waiting || 0);
    const key = `${row["Patient ID"] || row["Pt ID"]}-${row["Appointment ID"] || row["Claim ID"]}`;

    if (!department) issues.push({ row: rowNumber, severity: "High", message: "Missing department name." });
    if (department && !departments.includes(department)) issues.push({ row: rowNumber, severity: "Medium", message: `Unknown department "${department}".` });
    if (doctor === "" && row.Appointment) issues.push({ row: rowNumber, severity: "Medium", message: "Missing doctor name." });
    if (waitTime < 0) issues.push({ row: rowNumber, severity: "High", message: "Negative wait time is not allowed." });
    if (duplicateKeys.has(key)) issues.push({ row: rowNumber, severity: "Low", message: "Duplicate patient and record key." });
    duplicateKeys.add(key);
  });

  return {
    totalRows: rows.length,
    validRows: Math.max(rows.length - issues.length, 0),
    issueRows: issues.length,
    duplicateRecords: issues.filter((issue) => issue.message.includes("Duplicate")).length,
    missingValues: issues.filter((issue) => issue.message.includes("Missing")).length,
    formatErrors: issues.filter((issue) => issue.message.includes("Negative") || issue.message.includes("Unknown")).length,
    issues
  };
}
