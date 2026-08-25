

// import { NAV_BY_ROLE, ROLES, canAccessPage, hasPermission, normalizePageKey, scopeDescription } from "../lib/rbac.js";
// import { api, getApiMode, parseCsv, validateRows } from "../services/api.js";
// import { initFrontendSentry } from "../sentry.js";
// import { COLLECTION_MODULES, MASTER_MODULES, PAGE_TITLE_FALLBACK, SENSITIVE_USER_PERMISSIONS, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, roleLabels } from "../config/app-config.js";
// import { billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, currencyDisplay, currencyValue, escapeAttribute, escapeHtml, firstDefined, formatDateTime, formatGb, isBillPaidToday, isPendingStatus, isToday, localDateInputValue, localDateKey, minutesSince, money, recordTime, toNumber } from "../utils/formatters.js";
// import { pageFromHash, parseHashRoute, routeKey, setPage } from "../routing/router.js";
// import { asArray, badge, emptyState, formValues, strongPassword, titleCase } from "../ui/primitives.js";
// import { configurePageRenderers as configurePatientFlowPages, admissionsPage, appointmentsPage, billingPage, checkoutPage, consultationPage, documentsPage, emergencyPage, emrPage, followUpsPage, labPage, patientsPage, pharmacyPage, queuePage, radiologyPage, setAdmissionSearchQuery, setAdmissionStatusFilter, vitalsPage } from "../pages/patient-flow.js";
// import { configurePageRenderers as configureIpdClinicalPages, dailySheetsPage, dischargePage, dutyDoctorPage, handoverPage, intakeOutputPage, ipdAlertsPage, ipdPage, ipdPatient360Page, ipdReportsPage, ipdVitalsPage, marPage, mortuaryPage, nursingPage, otPage, wardsPage } from "../pages/ipd-clinical.js";
// import { configurePageRenderers as configureAdministrationPages, accessReviewPage, auditPage, backupPage, branchesPage, compliancePage, doctorSchedulePage, feedbackPage, financePage, hospitalsPage, masterDataPage, permissionTemplatesPage, purchasePage, settingsPage, setupPage, staffRosterPage, stockPage, usersPage } from "../pages/administration.js";
// import { configurePageRenderers as configureOperationsPages, alertsPage, claimsPage, globalSearchPage, inventoryPage, mappingPage, notificationsPage, recordsPage, reportsPage, tasksPage, uploadPage } from "../pages/operations.js";
// import { configurePageRenderers as configurePlatformPages, modulesPage, offersPage, productFlowPage, profilePage, subscriptionsPage } from "../pages/platform.js";
// import { nurseMyPatientsPage } from "../modules/nursing/my-patients.js";
// import { handleNursePatientClick, handleNursePatientInput } from "../modules/nursing/nurse-patient-filters.js";
// import { linkedPatientRecords, setPatientSearchQuery, setPatientStatusFilter } from "../modules/reception/patient-filters.js";
// import { opdVitalsStage } from "../modules/opd/journey-status.js";
// import { opdConsultationJourney } from "../modules/opd/consultation-journey.js";

// const app = document.querySelector("#app");
// let currentUser = api.currentUser();
// let pendingUpload = { rows: [], recordType: "Appointments", validation: null };
// let globalSearchQuery = "";
// let globalSearchSuggestions = [];
// let globalSearchActiveIndex = -1;
// let globalSearchStatus = "idle";
// let globalSearchError = "";
// let globalSearchTimer = null;
// let auditSearchQuery = "";
// let editTarget = null;
// let createTarget = null;
// let accessReviewTarget = null;
// let deleteTarget = null;
// let selectedPatientId = null;
// let selectedAdmissionId = null;
// let selectedQueueTokenId = null;
// let notificationsDrawerOpen = false;
// let renderedPageKey = "";
// let stagedPageKey = "";
// let stagedPageTimer = null;
// const draftTimers = new Map();
// let automationSettingsCache = null;
// let automationSettingsCacheUserId = null;
// let goLiveChecklistCache = null;
// let goLiveChecklistCacheUserId = null;
// let receptionEnrollMessage = ""; // for success message after patient enrollment
// let receptionAdmissionMessage = ""; // for success message after admission creation

// initFrontendSentry();
// const localFrontendMode = getApiMode() === "local";
// const environmentLabel = localFrontendMode ? "" : "Production";

// function shouldStagePage(page, query = {}) {
//   const key = routeKey(page, query);
//   if (renderedPageKey === key) return false;
//   if (stagedPageKey === key) {
//     stagedPageKey = "";
//     return false;
//   }
//   stagedPageKey = key;
//   clearTimeout(stagedPageTimer);
//   stagedPageTimer = setTimeout(() => {
//     if (stagedPageKey === key) render();
//   }, 40);
//   return true;
// }

// function isAuthError(error) {
//   return /authentication required|please sign in|invalid token|token expired|invalid token signature|jwt expired/i.test(error?.message || "");
// }

// function isUnauthorizedError(error) {
//   return /permission|access denied|forbidden|governance access denied|not allowed/i.test(error?.message || "");
// }

// function safeData(loader, fallback = []) {
//   try {
//     return loader();
//   } catch (error) {
//     if (isAuthError(error)) throw error;
//     console.warn(error.message);
//     return fallback;
//   }
// }

// function safeOptionalData(loader, fallback = []) {
//   try {
//     return loader();
//   } catch (error) {
//     if (isAuthError(error)) throw error;
//     console.warn(error.message);
//     return fallback;
//   }
// }

// function permitted(module, action = "view") {
//   return hasPermission(currentUser, module, action);
// }

// function metricTrend(label, value) {
//   const text = String(label || "").toLowerCase();
//   if (["backup provider", "frequency", "retention"].includes(text)) return "Policy setting";
//   if (text.includes("storage")) return "Current usage";
//   if (text.includes("alert") || text.includes("task") || text.includes("pending")) return Number(value || 0) > 0 ? "Needs attention" : "Clear";
//   return "Live metric";
// }

// function formatAuditValue(value) {
//   if (value === undefined || value === null || value === "") return "-";
//   if (typeof value === "object") {
//     return Object.entries(value).slice(0, 6).map(([key, entry]) => `${titleCase(key)}: ${entry}`).join("; ");
//   }
//   const text = String(value);
//   if (!/^[\[{]/.test(text.trim())) return text;
//   try {
//     const parsed = JSON.parse(text);
//     if (Array.isArray(parsed)) return `${parsed.length} item${parsed.length === 1 ? "" : "s"}`;
//     return Object.entries(parsed).slice(0, 6).map(([key, entry]) => `${titleCase(key)}: ${entry}`).join("; ");
//   } catch {
//     return text;
//   }
// }

// function riskClass(value) {
//   return `risk-${String(value || "low").toLowerCase()}`;
// }

// function statusClass(value) {
//   const text = String(value || "").toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
//   if (!text) return "status-completed";
//   if (/(cancel|blocked?|error|critical|abnormal|maintenance|expired|inactive|suspended|failed|rejected)/.test(text)) return "status-blocked";
//   if (/(wait|pending|booked|confirmed|scheduled|requested|draft|new|open|not reviewed|not started|ordered|preparing|sent to pharmacy|billing pending|pharmacy pending|lab pending|documents pending|admission requested|discharge planned)/.test(text)) return "status-pending";
//   if (/(in progress|current|checked in|checked-in|arrived|admitted|registered|under treatment|in consultation|recorded|doctor updated|nurse updated|bed assigned|queue|vitals)/.test(text)) return "status-in-progress";
//   if (/(active|clear|success|paid|issued|report ready|ready for checkout|ready for discharge|given|accepted|approved|resolved|verified|available)/.test(text)) return "status-active";
//   return "status-completed";
// }

// const SETUP_WIZARD_STEPS = [
//   "Hospital profile",
//   "Subscription",
//   "Main branch",
//   "Branch admin",
//   "Users",
//   "Roles and permissions",
//   "Departments",
//   "Providers",
//   "Test patient flow / go live"
// ];

// const SETUP_STEP_ALIASES = {
//   "hospital profile": "Hospital profile",
//   "create hospital": "Hospital profile",
//   "hospital profile completed": "Hospital profile",
//   "hospital profile done": "Hospital profile",
//   hospital: "Hospital profile",
//   subscription: "Subscription",
//   "assign subscription": "Subscription",
//   "subscription completed": "Subscription",
//   "subscription done": "Subscription",
//   "main branch": "Main branch",
//   "create main branch": "Main branch",
//   "main branch completed": "Main branch",
//   "main branch done": "Main branch",
//   branches: "Main branch",
//   "branch admin": "Branch admin",
//   "create branch admin": "Branch admin",
//   "branch admin completed": "Branch admin",
//   "branch admin done": "Branch admin",
//   users: "Users",
//   "create operational users": "Users",
//   "operational users": "Users",
//   "users completed": "Users",
//   "users done": "Users",
//   "roles and permissions": "Roles and permissions",
//   permissions: "Roles and permissions",
//   "roles and permissions completed": "Roles and permissions",
//   "roles and permissions done": "Roles and permissions",
//   departments: "Departments",
//   "configure departments": "Departments",
//   "departments completed": "Departments",
//   "departments done": "Departments",
//   providers: "Providers",
//   "configure providers": "Providers",
//   "providers completed": "Providers",
//   "providers done": "Providers",
//   "test patient flow": "Test patient flow / go live",
//   "run test patient flow": "Test patient flow / go live",
//   "go live": "Test patient flow / go live",
//   "test patient flow completed": "Test patient flow / go live",
//   "test patient flow done": "Test patient flow / go live",
//   "go live completed": "Test patient flow / go live",
//   "go live done": "Test patient flow / go live"
// };

// function normalizeSetupStep(step) {
//   const text = String(step || "")
//     .replace(/([a-z])([A-Z])/g, "$1 $2")
//     .replace(/[_-]+/g, " ")
//     .trim()
//     .toLowerCase();
//   if (!text) return "";
//   return SETUP_STEP_ALIASES[text] || SETUP_WIZARD_STEPS.find((item) => item.toLowerCase() === text) || String(step).trim();
// }

// function collectSetupStepValues(progress = {}) {
//   const values = [];
//   const add = (entry) => {
//     if (entry === undefined || entry === null || entry === false || entry === "") return;
//     if (Array.isArray(entry)) {
//       entry.forEach(add);
//       return;
//     }
//     if (typeof entry === "string") {
//       entry.split(/[\n,;|]/).map((item) => item.trim()).filter(Boolean).forEach(add);
//       return;
//     }
//     if (typeof entry === "object") {
//       Object.entries(entry).forEach(([key, value]) => {
//         if (value === true) values.push(key);
//         else if (typeof value === "string" && value.trim()) values.push(value);
//       });
//       return;
//     }
//     values.push(entry);
//   };
//   add(progress.completedSteps);
//   add(progress.completed);
//   add(progress.steps);
//   add(progress.milestones);
//   add(progress.checklist);
//   add(progress.items);
//   if (!values.length && progress && typeof progress === "object") {
//     Object.entries(progress).forEach(([key, value]) => {
//       if (value === true) values.push(key);
//       else if (typeof value === "string" && value.trim()) values.push(value);
//     });
//   }
//   return values;
// }

// function setupProgressSummary(progress = {}) {
//   const completed = new Set(collectSetupStepValues(progress).map(normalizeSetupStep).filter(Boolean));
//   const completedCount = SETUP_WIZARD_STEPS.filter((step) => completed.has(step)).length;
//   const percent = Math.round((completedCount / SETUP_WIZARD_STEPS.length) * 100);
//   const next = SETUP_WIZARD_STEPS.find((step) => !completed.has(step)) || SETUP_WIZARD_STEPS[SETUP_WIZARD_STEPS.length - 1];
//   return { completed, percent, next };
// }

// function inferredSetupProgress(progress = {}) {
//   const completed = new Set(setupProgressSummary(progress).completed);
//   if (currentUser?.hospitalId) completed.add("Hospital profile");
//   if (hasPermission(currentUser, "branches", "view")) {
//     const branches = safeOptionalData(() => api.branches(currentUser), []);
//     if (branches.length) completed.add("Main branch");
//   } else if (currentUser?.branchId) {
//     completed.add("Main branch");
//   }
//   if (hasPermission(currentUser, "users", "view")) {
//     const users = safeOptionalData(() => api.users(currentUser), []);
//     if (users.some((user) => user.role === ROLES.BRANCH_ADMIN)) completed.add("Branch admin");
//     if (users.some((user) => user.role === ROLES.BRANCH_USER)) completed.add("Users");
//   }
//   if (hasPermission(currentUser, "permissionTemplates", "view") || hasPermission(currentUser, "accessReview", "view")) {
//     completed.add("Roles and permissions");
//   }
//   if (hasPermission(currentUser, "masterData", "view")) {
//     const items = safeOptionalData(() => api.masterDataItems(currentUser), []);
//     if (items.some((item) => String(item.type || "").toLowerCase() === "department")) completed.add("Departments");
//   }
//   if (hasPermission(currentUser, "settings", "view")) {
//     const providers = safeOptionalData(() => api.providerStatus?.(), null);
//     if (providers?.mongodb?.configured || providers?.storage?.configured || providers?.email?.configured) completed.add("Providers");
//   }
//   const completedCount = SETUP_WIZARD_STEPS.filter((step) => completed.has(step)).length;
//   const percent = Math.round((completedCount / SETUP_WIZARD_STEPS.length) * 100);
//   const next = SETUP_WIZARD_STEPS.find((step) => !completed.has(step)) || SETUP_WIZARD_STEPS[SETUP_WIZARD_STEPS.length - 1];
//   return { completed, percent, next };
// }

// const OPD_JOURNEY_STEPS = [
//   { key: "appointment", label: "Appointment Booked" },
//   { key: "checkedIn", label: "Checked In" },
//   { key: "vitals", label: "Vitals Recorded" },
//   { key: "consultation", label: "Consultation Done" },
//   { key: "lab", label: "Lab Ordered" },
//   { key: "pharmacy", label: "Medicine Issued" },
//   { key: "billing", label: "Bill Paid" },
//   { key: "checkout", label: "Checkout Completed" }
// ];

// function latestPatientJourneyStage(patientId, data = deriveOperationalData()) {
//   const patientKey = String(patientId || "");
//   const hasAppointment = data.appointments.some((item) => String(item.patientId) === patientKey);
//   const hasQueue = data.queue.some((item) => String(item.patientId) === patientKey);
//   const hasVitals = data.vitals.some((item) => String(item.patientId) === patientKey);
//   const hasConsultation = data.consultations.some((item) => String(item.patientId) === patientKey);
//   const hasLab = data.labOrders.some((item) => String(item.patientId) === patientKey);
//   const hasPharmacy = data.pharmacyIssues.some((item) => String(item.patientId) === patientKey && item.status === "Issued");
//   const hasPaidBill = data.bills.some((item) => String(item.patientId) === patientKey && billPaidAmount(item) > 0);
//   const hasCheckout = (data.checkouts || []).some((item) => String(item.patientId) === patientKey && item.status === "Completed");
//   const stageStates = [
//     { key: "appointment", active: hasAppointment },
//     { key: "checkedIn", active: hasQueue },
//     { key: "vitals", active: hasVitals },
//     { key: "consultation", active: hasConsultation },
//     { key: "lab", active: hasLab },
//     { key: "pharmacy", active: hasPharmacy },
//     { key: "billing", active: hasPaidBill },
//     { key: "checkout", active: hasCheckout }
//   ];
//   const latestIndex = stageStates.reduce((index, stage, currentIndex) => (stage.active ? currentIndex : index), -1);
//   const current = latestIndex >= 0 ? stageStates[latestIndex].key : "appointment";
//   const completed = new Set(["registered"]);
//   for (let index = 0; index <= latestIndex; index += 1) {
//     completed.add(stageStates[index].key);
//   }
//   return {
//     completed,
//     current,
//     label: latestIndex >= 0 ? OPD_JOURNEY_STEPS.find((step) => step.key === current)?.label || "In progress" : "Waiting for Doctor"
//   };
// }

// function financeSummaryFromBills(bills = []) {
//   const rowsByDate = new Map();
//   bills.forEach((bill) => {
//     const dateKey = localDateKey(billPaymentTimestamp(bill) || bill.updatedAt || bill.createdAt);
//     if (!dateKey) return;
//     const bucket = rowsByDate.get(dateKey) || {
//       reportType: "Daily Revenue",
//       date: dateKey,
//       pharmacySales: 0,
//       labRevenue: 0,
//       opdRevenue: 0,
//       ipdRevenue: 0,
//       refunds: 0,
//       discounts: 0,
//       cashCollection: 0,
//       cardCollection: 0,
//       upiCollection: 0,
//       insurancePending: 0,
//       outstandingAmount: 0,
//       totalCollection: 0,
//       status: "Generated"
//     };
//     const paid = billPaidAmount(bill);
//     const total = billTotalAmount(bill);
//     const mode = String(bill.paymentType || bill.paymentMode || "").toLowerCase();
//     const itemsText = `${String(bill.items || "")} ${String(bill.department || "")} ${String(bill.notes || "")}`.toLowerCase();
//     const source = String(bill.admissionId ? "ipd" : bill.consultationId || bill.visitId || bill.appointmentId ? "opd" : "").toLowerCase();
//     bucket.totalCollection += paid;
//     bucket.discounts += toNumber(bill.discount, 0);
//     bucket.outstandingAmount += billBalanceAmount(bill);
//     if (mode.includes("cash")) bucket.cashCollection += paid;
//     else if (mode.includes("card")) bucket.cardCollection += paid;
//     else if (mode.includes("upi") || mode.includes("online")) bucket.upiCollection += paid;
//     else if (mode.includes("insurance")) bucket.insurancePending += Math.max(total - paid, 0);
//     if (source === "ipd") bucket.ipdRevenue += paid;
//     else bucket.opdRevenue += paid;
//     if (itemsText.includes("pharmacy")) bucket.pharmacySales += paid;
//     if (itemsText.includes("lab") || itemsText.includes("radiology")) bucket.labRevenue += paid;
//     rowsByDate.set(dateKey, bucket);
//   });
//   const reports = [...rowsByDate.values()].sort((a, b) => String(b.date).localeCompare(String(a.date)));
//   const todayRow = reports.find((row) => row.date === localDateKey()) || {
//     reportType: "Daily Revenue",
//     date: localDateKey(),
//     pharmacySales: 0,
//     labRevenue: 0,
//     opdRevenue: 0,
//     ipdRevenue: 0,
//     refunds: 0,
//     discounts: 0,
//     cashCollection: 0,
//     cardCollection: 0,
//     upiCollection: 0,
//     insurancePending: 0,
//     outstandingAmount: 0,
//     totalCollection: 0,
//     status: "Generated"
//   };
//   return { reports, todayRow };
// }

// function dateSeriesFromRows(rows = [], valueGetter = () => 1, dateGetter = (row) => recordTime(row)) {
//   const buckets = new Map();
//   rows.forEach((row) => {
//     const key = localDateKey(dateGetter(row));
//     if (!key) return;
//     buckets.set(key, (buckets.get(key) || 0) + Number(valueGetter(row) || 0));
//   });
//   const ordered = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-7);
//   return {
//     labels: ordered.map(([key]) => key.slice(5)),
//     values: ordered.map(([, value]) => value)
//   };
// }

// function notificationGroup(notification = {}) {
//   const explicit = String(notification.category || "").trim();
//   if (explicit) return explicit;
//   const text = `${notification.module || ""} ${notification.title || ""} ${notification.message || ""}`.toLowerCase();
//   if (/billing|payment|refund|claim/.test(text)) return "Billing";
//   if (/queue|appointment|check-in|check in|vitals/.test(text)) return "Queue";
//   if (/lab|radiology/.test(text)) return "Lab";
//   if (/pharmacy|medicine/.test(text)) return "Pharmacy";
//   if (/discharge|bed release/.test(text)) return "Discharge";
//   if (/document|upload|storage/.test(text)) return "Documents";
//   if (/access|governance|audit|permission/.test(text)) return "Permission";
//   if (/provider|backup|email|sentry|mongodb|system/.test(text)) return "System";
//   return "Clinical";
// }

// function automationSettingsForScope() {
//   const defaults = {
//     queueWaitingMinutes: 45,
//     labPendingMinutes: 120,
//     radiologyPendingMinutes: 120,
//     pharmacyPendingMinutes: 60,
//     billingPendingMinutes: 90,
//     marDueMinutes: 30,
//     dischargeClearanceMinutes: 180,
//     reportUploadDelayMinutes: 180,
//     documentReadinessMinutes: 240,
//     goLiveChecklistReminderMinutes: 1440,
//     autoTaskCreationEnabled: true,
//     reminderNotificationsEnabled: true
//   };
//   if (!currentUser || !hasPermission(currentUser, "settings", "view")) return defaults;
//   if (automationSettingsCache && automationSettingsCacheUserId === currentUser.id) return automationSettingsCache;
//   automationSettingsCache = { ...defaults, ...safeOptionalData(() => api.automationSettings(currentUser), {}) };
//   automationSettingsCacheUserId = currentUser.id;
//   return automationSettingsCache;
// }

// function goLiveChecklistForScope() {
//   if (!currentUser || !hasPermission(currentUser, "settings", "view")) return null;
//   if (goLiveChecklistCache && goLiveChecklistCacheUserId === currentUser.id) return goLiveChecklistCache;
//   goLiveChecklistCache = safeOptionalData(() => api.goLiveChecklist(currentUser), null);
//   goLiveChecklistCacheUserId = currentUser.id;
//   return goLiveChecklistCache;
// }

// function mergeNotifications(data = deriveOperationalData()) {
//   const saved = hasPermission(currentUser, "notifications", "view") ? safeOptionalData(() => api.notifications(currentUser)) : [];
//   const derived = hasPermission(currentUser, "notifications", "view") ? deriveNotifications(data) : [];
//   const all = [
//     ...saved.map((item) => ({ ...item, source: "Saved" })),
//     ...derived.map((item, index) => ({ id: item.id || `derived-${index}`, ...item, source: "Derived" }))
//   ];
//   const seen = new Set();
//   return all.filter((item) => {
//     const key = [item.automationKey, item.title, item.message, item.route, item.patientId, item.admissionId, item.module].join("|");
//     if (seen.has(key)) return false;
//     seen.add(key);
//     return true;
//   }).map((item) => ({ priority: item.priority || "info", category: notificationGroup(item), ...item }));
// }

// function severityForDelay(delayMinutes = 0, thresholdMinutes = 1) {
//   const delay = Number(delayMinutes || 0);
//   const threshold = Math.max(Number(thresholdMinutes || 1), 1);
//   if (delay >= threshold * 4) return "critical";
//   if (delay >= threshold * 2) return "high";
//   if (delay >= threshold) return "medium";
//   return "low";
// }

// function delayLabel(minutes = 0) {
//   const value = Math.max(Math.round(Number(minutes || 0)), 0);
//   if (value >= 1440) return `${Math.round(value / 1440)}d`;
//   if (value >= 60) return `${Math.floor(value / 60)}h ${value % 60}m`;
//   return `${value}m`;
// }

// function roleWorkQueue(data = deriveOperationalData()) {
//   const roleText = `${currentUser.role || ""} ${currentUser.jobRole || ""}`;
//   const lowerRole = roleText.toLowerCase();
//   return deriveTasks(data).filter((task) => {
//     const text = `${task.assignedTo || ""} ${task.module || ""} ${task.title || ""}`.toLowerCase();
//     if (currentUser.role === ROLES.SUPER_ADMIN || currentUser.role === ROLES.HOSPITAL_ADMIN || currentUser.role === ROLES.BRANCH_ADMIN) return true;
//     if (lowerRole.includes("reception")) return /queue|appointment|billing|checkout|vitals/.test(text);
//     if (lowerRole.includes("duty doctor")) return /ipd|ward|discharge|doctor|death|handover|vitals/.test(text);
//     if (lowerRole.includes("doctor")) return /consult|doctor|lab|radiology|admission|follow/.test(text);
//     if (lowerRole.includes("nurse")) return /vitals|mar|nursing|intake|handover/.test(text);
//     if (lowerRole.includes("lab")) return /lab|sample|report/.test(text);
//     if (lowerRole.includes("radiology")) return /radiology|report/.test(text);
//     if (lowerRole.includes("pharmacy")) return /pharmacy|medicine|stock/.test(text);
//     if (lowerRole.includes("billing")) return /billing|bill|payment|checkout|clearance/.test(text);
//     if (lowerRole.includes("claim")) return /claim|document|insurance/.test(text);
//     return true;
//   });
// }

// function rowRouteButton(label, route, query = {}, className = "inline-link") {
//   const params = new URLSearchParams();
//   Object.entries(query || {}).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "") params.set(key, value);
//   });
//   const attrs = [...params.entries()].map(([key, value]) => ` data-${escapeAttribute(key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`))}="${escapeAttribute(value)}"`).join("");
//   return `<button class="${escapeHtml(className)}" type="button" data-route="${escapeHtml(route)}"${attrs}>${escapeHtml(label)}</button>`;
// }

// function currentPageTitle(page) {
//   if (currentUser?.role === ROLES.BRANCH_ADMIN) {
//     const item = BRANCH_ADMIN_NAV.find(([key]) => key === page);
//     if (item) return item[1];
//   }
//   if(currentUser?.role===ROLES.BRANCH_USER&&/radiology/.test(String(currentUser.jobRole||"").toLowerCase())){const item=RADIOLOGY_NAV.find(([key])=>key===page);if(item)return item[1]}
//   if(currentUser?.role===ROLES.BRANCH_USER&&/mortuary/.test(String(currentUser.jobRole||"").toLowerCase())){const item=MORTUARY_NAV.find(([key])=>key===page);if(item)return item[1]}
//   if (currentUser?.role === ROLES.BRANCH_USER && /billing|finance/.test(String(currentUser?.jobRole || "").toLowerCase())) {
//     const item = BILLING_NAV.find(([key]) => key === page); if (item) return item[1];
//   }
//   if (currentUser?.role === ROLES.BRANCH_USER && /lab/.test(String(currentUser?.jobRole || "").toLowerCase())) {
//     const item = LAB_NAV.find(([key]) => key === page); if (item) return item[1];
//   }
//   if (currentUser?.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser?.jobRole || "").toLowerCase())) {
//     const pharmacyItem = PHARMACY_NAV.find(([key]) => key === page);
//     if (pharmacyItem) return pharmacyItem[1];
//   }
//   if (currentUser?.role === ROLES.BRANCH_USER && ["doctor", "surgeon"].includes(String(currentUser?.jobRole || "").toLowerCase())) {
//     const doctorItem = DOCTOR_NAV.find(([key]) => key === page);
//     if (doctorItem) return doctorItem[1];
//   }
//   if (currentUser?.role === ROLES.BRANCH_USER && String(currentUser?.jobRole || "").toLowerCase() === "nurse") {
//     const nurseItem = NURSE_NAV.find(([key]) => key === page);
//     if (nurseItem) return nurseItem[1];
//   }
//   if (currentUser?.role === ROLES.BRANCH_USER && String(currentUser?.jobRole || "").toLowerCase() === "reception user") {
//     const receptionItem = RECEPTION_NAV.find(([key]) => key === page);
//     if (receptionItem) return receptionItem[1];
//   }
//   const nav = NAV_BY_ROLE[currentUser?.role] || [];
//   return nav.find(([key]) => key === page)?.[1] || PAGE_TITLE_FALLBACK[page] || titleCase(String(page).replaceAll("-", " "));
// }

// function navIcon(page) {
//   return nurseNavIcon(page);
// }

// const BRANCH_ADMIN_NAV = [
//   ["dashboard", "Dashboard", "Overview"],
//   ["appointments", "Appointments", "Patient Operations"],
//   ["patients", "Patients", "Patient Operations"],
//   ["queue", "Queue", "Patient Operations"],
//   ["admissions", "Admissions", "Patient Operations"],
//   ["checkout", "Checkout", "Patient Operations"],
//   ["followups", "Follow-ups", "Patient Operations"],
//   ["lab", "Lab", "Clinical Operations"],
//   ["radiology", "Radiology", "Clinical Operations"],
//   ["pharmacy", "Pharmacy", "Clinical Operations"],
//   ["emergency", "Emergency", "Clinical Operations"],
//   ["ot", "Operation Theatre", "Clinical Operations"],
//   ["ipd", "IPD Patients", "IPD"],
//   ["wards", "Wards & Beds", "IPD"],
//   ["discharge", "Discharges", "IPD"],
//   ["ipdAlerts", "IPD Alerts", "IPD"],
//   ["users", "Staff Users", "Staff"],
//   ["doctorSchedule", "Doctor Schedule", "Staff"],
//   ["staffRoster", "Duty Roster", "Staff"],
//   ["billing", "Billing", "Finance"],
//   ["finance", "Collections", "Finance"],
//   ["reports", "Finance Reports", "Finance"],
//   ["inventory", "Inventory", "Inventory"],
//   ["stock", "Low Stock", "Inventory"],
//   ["purchase", "Purchase Orders", "Inventory"]
// ];

// const NURSE_NAV = [
//   ["dashboard", "Dashboard", "Overview"],
//   ["patients", "My Patients", "Patient Care"],
//   ["admissions", "Admissions", "Patient Care"],
//   ["ipdPatient360", "Patient 360", "Patient Care"],
//   ["nursing", "Nursing Care", "Nursing Care"],
//   ["dailySheets", "Daily Sheets", "Nursing Care"],
//   ["vitals", "OPD Vitals", "Clinical"],
//   ["ipdVitals", "IPD Vitals", "Clinical"],
//   ["mar", "MAR", "Clinical"],
//   ["dutyDoctor", "Doctor Orders", "Clinical"],
//   ["intakeOutput", "Intake / Output", "Clinical"],
//   ["handover", "Handover", "Handover"],
//   ["tasks", "My Tasks", "Work"],
//   ["alerts", "Alerts", "Work"]
// ];

// const RECEPTION_NAV = [
//   ["dashboard", "Dashboard", "Overview"],
//   ["patients", "Enroll Patient", "Patients"],
//   ["records", "Patient Records", "Patients"],
//   ["admissions", "New Admission", "Admission"],
//   ["admission-records", "Admission Records", "Admission"],
//   ["billing", "Create Invoice", "Billing"]
// ];
// const DOCTOR_NAV = [
//   ["dashboard", "My Dashboard", "Overview"],
//   ["patients", "My Patients", "Patient Care"],
//   ["queue", "Queue", "Patient Care"],
//   ["admissions", "Admitted Patients", "Patient Care"],
//   ["consultation", "Consultation", "Clinical"],
//   ["ipdPatient360", "Patient 360", "Clinical"],
//   ["pharmacy", "Prescriptions", "Clinical"],
//   ["lab", "Lab", "Orders & Results"],
//   ["radiology", "Radiology", "Orders & Results"],
//   ["ipd", "My IPD Patients", "IPD Care"],
//   ["dailySheets", "Daily Progress", "IPD Care"],
//   ["dutyDoctor", "Doctor Orders", "IPD Care"],
//   ["discharge", "Discharge", "IPD Care"],
//   ["doctorSchedule", "My Schedule", "Schedule / Follow-up"],
//   ["followups", "Follow-ups", "Schedule / Follow-up"],
//   ["documents", "Documents", "Documents"],
//   ["ot", "Operation Theatre", "Surgery"],
//   ["tasks", "My Tasks", "Work"],
//   ["notifications", "Notifications", "Work"]
// ];

// const PHARMACY_NAV = [
//   ["dashboard", "My Dashboard", "Overview"],
//   ["pharmacy", "Prescriptions", "Pharmacy"],
//   ["pharmacy-dispensing", "Dispensing", "Pharmacy"],
//   ["pharmacy-search", "Prescription Search", "Pharmacy"],
//   ["stock", "Stock", "Inventory"],
//   ["returns", "Returns", "Inventory"],
//   ["tasks", "My Tasks", "Work"],
//   ["alerts", "Alerts", "Work"],
//   ["reports", "Reports", "Reports"]
// ];

// const BILLING_NAV = [
//   ["dashboard","My Dashboard","Overview"],["billing","Bills","Billing"],["payments","Payments","Billing"],["claims","Claims","Billing"],["ipd-billing","IPD Billing","Billing"],["checkout","Checkout","Billing"],["refunds","Refunds / Adjustments","Finance"],["billing-search","Patient / Bill Search","Finance"],["tasks","My Tasks","Work"],["alerts","Alerts","Work"],["reports","Reports","Reports"]
// ];

// const LAB_NAV = [
//   ["dashboard","My Dashboard","Overview"],["lab","Lab Orders","Lab"],["lab-samples","Sample Collection","Lab"],["lab-processing","Sample Processing","Lab"],["lab-results","Results","Lab"],["lab-search","Patient / Order Search","Search / Documents"],["documents","Documents","Search / Documents"],["tasks","My Tasks","Work"],["alerts","Alerts","Work"],["reports","Reports","Reports"]
// ];
// const RADIOLOGY_NAV=[["dashboard","My Dashboard","Overview"],["radiology","Radiology Orders","Radiology"],["radiology-scheduling","Scheduling","Radiology"],["radiology-queue","Scan Queue","Radiology"],["radiology-imaging","Imaging / Scan","Radiology"],["radiology-results","Reports","Radiology"],["radiology-search","Patient / Order Search","Search / Documents"],["documents","Documents","Search / Documents"],["tasks","My Tasks","Work"],["alerts","Alerts","Work"],["reports","Radiology Reports","Analytics"]];
// // const MORTUARY_NAV=[["dashboard","My Dashboard","Overview"],["mortuary","Register Death","Mortuary"],["mortuary-storage","Body Storage","Mortuary"],["mortuary-release","Release / Handover","Mortuary"],["Issue Certificate","documents"],["documents","Issue certificate","Certificates"],["reports","Reports","Reports"]];
// const MORTUARY_NAV = [
//   ["dashboard", "My Dashboard", "Overview"],

//   ["mortuary", "Register Death", "Mortuary"],
//   ["mortuary-storage", "Body Storage", "Mortuary"],
//   ["mortuary-certificates", "Certificates", "Mortuary"],
//   ["mortuary-release", "Release Body", "Mortuary"],

//   ["mortuary-register", "Mortuary Register", "Records"],
//   ["mortuary-search", "Patient / Case Search", "Records"],
//   ["documents", "Documents", "Records"],

//   ["reports", "Reports", "Reports"]
// ];
// function nurseNavIcon(page) {
//   const paths = {
//     dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
//     appointments: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M13 14h3"/>',
//     patients: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
//     queue: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><circle cx="18" cy="16" r="3"/>',
//     admissions: '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M9 8h2M13 8h2M9 12h2M13 12h2"/>',
//     billing: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
//     checkout: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
//     followups: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
//     notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
//     globalSearch: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
//     records: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>',
//     admissions: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8M8 11h5M15 16h5m-2-3 3 3-3 3"/>',
//     ipdPatient360: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
//     nursing: '<path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z"/><path d="M2 14c3 1 5 4 5 7M22 14c-3 1-5 4-5 7"/>',
//     dailySheets: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>',
//     ipdVitals: '<path d="M3 12h4l2-5 4 10 2-5h6"/><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/>',
//     mar: '<path d="M6 3h12l2 5-2 13H6L4 8z"/><path d="M5 8h14M9 13h6M12 10v6"/>',
//     dutyDoctor: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
//     intakeOutput: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/><path d="M9 16c.7 1.2 1.7 1.8 3 1.8"/>',
//     handover: '<path d="m8 12 3 3 5-6M2 10l4-4 4 2M22 10l-4-4-4 2M6 14l4 4h4l4-4"/>',
//     tasks: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 2 2 5-5"/>',
//     alerts: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
//     ,pharmacy: '<path d="M7 3h10v5l-3 3v10H6V11L3 8V3h4M6 14h8M10 3v5"/>'
//     ,"pharmacy-dispensing": '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>'
//     ,"pharmacy-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M8 10h4M10 8v4"/>'
//     ,stock: '<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10"/>'
//     ,returns: '<path d="M9 7H5v4M5 11c2-5 9-7 13-3M15 17h4v-4M19 13c-2 5-9 7-13 3"/>'
//     ,reports: '<path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7"/>'
//     ,billing: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4"/>'
//     ,payments: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'
//     ,claims: '<path d="M12 2l8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6zM9 12l2 2 4-5"/>'
//     ,"ipd-billing": '<path d="M4 21V5l8-3 8 3v16M8 21v-5h8v5M8 8h2M14 8h2M8 12h2M14 12h2"/>'
//     ,checkout: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>'
//     ,refunds: '<path d="M4 7v5h5M5 12a8 8 0 1 0 2-6M12 8v8M9 10h5a2 2 0 0 1 0 4H9"/>'
//     ,"billing-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
//     ,lab: '<path d="M9 2h6M10 2v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3L14 8V2M8 15h8"/>'
//     ,"lab-samples": '<path d="M9 2h6v4l2 3v10a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9l2-3zM7 13h10"/>'
//     ,"lab-processing": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
//     ,"lab-results": '<path d="M6 2h12v20H6zM9 7h6M9 11h6M9 15l2 2 4-4"/>'
//     ,"lab-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
//     ,documents: '<path d="M6 2h9l4 4v16H6zM14 2v5h5M9 12h7M9 16h7"/>'
//     ,radiology: '<path d="M4 4h16v13H4zM8 21h8M12 17v4M8 8h8M8 12h5"/>'
//     ,"radiology-scheduling": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>'
//     ,"radiology-queue": '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/>'
//     ,"radiology-imaging": '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m5 18 5-5 3 3 2-2 4 4"/>'
//     ,"radiology-results": '<path d="M6 2h12v20H6zM9 7h6M9 11h6M9 15l2 2 4-4"/>'
//     ,"radiology-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
//     ,mortuary: '<path d="M5 4h14v17H5zM8 8h8M12 6v6M8 16h8"/>'
//     ,"mortuary-intake": '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5"/>'
//     ,"mortuary-storage": '<path d="M3 5h18v14H3zM3 10h18M8 5v14M16 5v14"/>'
//     ,"mortuary-release": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3 3 7-7"/>'
//     ,"mortuary-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
//     hospitals: '<path d="M3 21V5l9-3 9 3v16M8 21v-5h8v5M8 8h2M14 8h2M8 12h2M14 12h2"/>',
//     branches: '<path d="M4 21V4h10v17M14 9h6v12M7 8h4M7 12h4M7 16h4M17 13h1M17 17h1"/>',
//     users: '<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M17 5a4 4 0 0 1 0 6M19 15a5 5 0 0 1 3 4v2"/>',
//     accessReview: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="m15 16 2 2 4-4"/>',
//     permissionTemplates: '<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/>',
//     setup: '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="19" r="2"/>',
//     radiology: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v5M12 15v5M4 12h5M15 12h5"/>',
//     emr: '<path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4"/>',
//     ipd: '<path d="M4 21V5l8-3 8 3v16M8 21v-5h8v5M9 8h2M13 8h2M9 12h2M13 12h2"/>',
//     wards: '<path d="M3 18v-6h18v6M5 12V9h6v3M13 12V9h6v3M5 18v3M19 18v3"/>',
//     doctorSchedule: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M13 14h3"/>',
//     staffRoster: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><circle cx="17" cy="16" r="2"/>',
//     discharge: '<path d="M4 3h12v18H4zM16 12h5M18 9l3 3-3 3M8 7h5M8 11h5M8 15h3"/>',
//     ot: '<path d="M4 21V5h16v16M8 9h8M8 13h5M12 21v-4"/><path d="M18 2v4M16 4h4"/>',
//     ipdAlerts: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
//     finance: '<path d="M4 19V5h16v14M8 15v-3M12 15V8M16 15v-5"/>',
//     inventory: '<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10"/>',
//     purchase: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="M17 16v4M15 18h4"/>',
//     audit: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
//     compliance: '<path d="M12 2l8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6zM9 12l2 2 4-5"/>',
//     backup: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
//     productFlow: '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 11 10-4M7 13l10 4"/>',
//     masterData: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="M17 16v4M15 18h4"/>',
//     settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
//     profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
//     globalSearch: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
//     financeReports: '<path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7"/>',
//     ipdReports: '<path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7"/>',
//     records: '<path d="M6 2h9l4 4v16H6zM14 2v5h5M9 12h7M9 16h7"/>',
//     notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
//   };
//   return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[page] || '<circle cx="12" cy="12" r="9"/>'}</svg>`;
// }

// function actionIcon(name = "") {
//   const key = String(name || "").toLowerCase();
//   if (/add|create|register|book|new/.test(key)) return "＋";
//   if (/edit|review|clone|duplicate/.test(key)) return "✎";
//   if (/delete|disable|clear|close|remove|deactivate/.test(key)) return "⌫";
//   if (/refresh|provider|sync|run/.test(key)) return "↻";
//   if (/open|view|search|records/.test(key)) return "↗";
//   if (/read|mark|complete|check|acknowledge|approve|finalize/.test(key)) return "✓";
//   if (/bill|payment|receipt|collect|generate bill/.test(key)) return "₹";
//   if (/lab|radiology|report|upload/.test(key)) return "◫";
//   if (/medicine|mar|pharmacy|stock/.test(key)) return "✚";
//   if (/alert|warning|risk/.test(key)) return "⚠";
//   if (/print|export|download/.test(key)) return "⇩";
//   return "›";
// }

// function iconLabel(icon, label, hiddenLabel = true) {
//   return `<span class="button-icon" aria-hidden="true">${escapeHtml(icon)}</span><span class="${hiddenLabel ? "sr-only" : "button-label"}">${escapeHtml(label)}</span>`;
// }

// function navGroupLabel(page, previousPage) {
//   const groups = {
//     dashboard: "Overview",
//     hospitals: "Platform",
//     subscriptions: "Platform",
//     offers: "Platform",
//     modules: "Platform",
//     branches: "Hospital Overview",
//     setup: "Hospital Overview",
//     appointments: "Patient Flow",
//     patients: "Patient Flow",
//     queue: "Patient Flow",
//     checkout: "Patient Flow",
//     followups: "Patient Flow",
//     vitals: "Clinical",
//     consultation: "Clinical",
//     lab: "Clinical",
//     radiology: "Clinical",
//     emr: "Clinical",
//     admissions: "Clinical",
//     ipd: "IPD Care",
//     ipdPatient360: "IPD Care",
//     wards: "IPD Care",
//     dailySheets: "IPD Care",
//     dutyDoctor: "IPD Care",
//     nursing: "IPD Care",
//     ipdVitals: "IPD Care",
//     mar: "IPD Care",
//     intakeOutput: "IPD Care",
//     handover: "IPD Care",
//     discharge: "IPD Care",
//     ot: "IPD Care",
//     deathSummary: "IPD Care",
//     mortuary: "IPD Care",
//     ipdReports: "IPD Care",
//     ipdAlerts: "IPD Care",
//     emergency: "Emergency",
//     billing: "Revenue",
//     finance: "Revenue",
//     claims: "Revenue",
//     pharmacy: "Pharmacy & Inventory",
//     stock: "Inventory",
//     inventory: "Inventory",
//     purchase: "Inventory",
//     reports: "Reports",
//     records: "Reports",
//     uploads: "Reports",
//     mapping: "Reports",
//     users: "Administration",
//     accessReview: "Governance",
//     permissionTemplates: "Governance",
//     audit: "Governance",
//     compliance: "Governance",
//     backup: "Governance",
//     productFlow: "Reference",
//     masterData: "Settings",
//     doctorSchedule: "Settings",
//     staffRoster: "Settings",
//     settings: "Settings",
//     profile: "Account"
//   };
//   const label = groups[page];
//   const previous = groups[previousPage];
//   return label && label !== previous ? label : "";
// }

// function addButtonTestId(formAction) {
//   if (formAction === "create-user") {
//     if (currentUser?.role === ROLES.SUPER_ADMIN) return "add-hospital-admin-button";
//     if (currentUser?.role === ROLES.HOSPITAL_ADMIN) return "add-branch-admin-button";
//     return "add-user-button";
//   }
//   const ids = {
//     "create-hospital": "add-hospital-customer-button",
//     "create-branch": "add-branch-button",
//     "create-appointment": "book-appointment-button",
//     "register-patient": "create-patient-button",
//     "generate-bill": "generate-bill-button",
//     "add-stock": "add-stock-button",
//     "create-task": "create-task-button",
//     "create-master-data": "add-master-record-button",
//     "create-permission-template": "create-permission-template-button",
//     "create-subscription": "add-subscription-plan-button"
//   };
//   return ids[formAction] || `open-${formAction}-button`;
// }

// function modalSubmitTestId(action) {
//   const ids = {
//     "create-hospital": "create-hospital-submit-button",
//     "create-branch": "create-branch-submit-button",
//     "create-user": "create-user-submit-button",
//     "create-appointment": "book-appointment-submit-button",
//     "register-patient": "register-patient-submit-button",
//     "generate-bill": "generate-bill-submit-button",
//     "add-stock": "add-stock-submit-button",
//     "create-task": "create-task-submit-button",
//     "create-master-data": "create-master-record-submit-button",
//     "create-permission-template": "create-permission-template-submit-button",
//     "create-subscription": "create-subscription-submit-button"
//   };
//   return ids[action] || "modal-submit-button";
// }

// function render() {
//   try {
//     currentUser = api.currentUser();
//     const { route: page, query } = parseHashRoute();
//     if (query.patientId) selectedPatientId = query.patientId;

//     if (currentUser?.mustChangePassword) {
//       renderMustChangePasswordGate();
//       return;
//     }

//     if (["forgot", "reset", "reset-password", "patient-login", "patient-invite"].includes(page)) {
//       renderAuth(page);
//       return;
//     }

//     if (page === "book") {
//       renderPublicBooking(query);
//       return;
//     }

//     if (!currentUser) {
//       renderAuth(page);
//       return;
//     }

//     if (currentUser.role === "PATIENT") {
//       renderPatientPortal(page, query);
//       return;
//     }

//     if (!canAccessPage(currentUser, page)) {
//       renderShell(page, { forceUnauthorized: true });
//       return;
//     }
//     if (shouldStagePage(page, query)) {
//       renderShell(page, { loading: true });
//       return;
//     }
//     renderShell(page, { query });
//   } catch (error) {
//     if (isAuthError(error)) {
//       currentUser = null;
//       setPage("login");
//       renderAuth("login");
//       toast("Your session expired. Please sign in again.", "error");
//       return;
//     }
//     app.innerHTML = `<main class="auth-shell"><section class="auth-hero"><div class="auth-card narrow"><h1>Unable to load page</h1><p>${escapeHtml(error.message || "Please retry.")}</p></div></section></main>`;
//   }
// }

// function renderMustChangePasswordGate() {
//   app.innerHTML = authFrame(`
//     <div class="auth-card narrow must-change-card">
//       <div class="brand-row">
//         <div class="brand-mark">H</div>
//         <div>
//           <p class="eyebrow">Security update required</p>
//           <h1>Change your password before continuing.</h1>
//           <p>This account must set a new password before any other part of the app becomes available.</p>
//         </div>
//       </div>
//       <form data-action="change-password" class="stack" autocomplete="off">
//         ${passwordField({ label: "Current password", name: "currentPassword", autocomplete: "current-password", testid: "current-password-input", revealable: false })}
//         ${passwordField({ label: "New password", name: "newPassword", minlength: 12, autocomplete: "new-password", testid: "new-password-input" })}
//         ${passwordField({ label: "Confirm new password", name: "confirmPassword", minlength: 12, autocomplete: "new-password", testid: "confirm-password-input" })}
//         ${passwordPolicyHint("current account")}
//         <div class="notice subtle">Use at least 12 characters with uppercase, lowercase, number, and symbol.</div>
//         <button class="button primary" type="submit" data-testid="change-password-submit-button">Update password</button>
//         <button class="button ghost" type="button" data-action="logout">Logout</button>
//       </form>
//     </div>
//   `);
// }

// function renderAuth(page) {
//   if (page === "forgot") {
//     app.innerHTML = authFrame(`
//       <div class="auth-card narrow">
//         <div class="brand-mark">H</div>
//         <h1>Forgot password</h1>
//         <p>Enter your registered email address. If an account exists, we will send a secure reset link.</p>
//         <form data-action="forgot-password" class="stack">
//           <label>Email<input name="email" type="email" required placeholder="name@hospital.com" /></label>
//           <button class="button primary" type="submit">Send reset link</button>
//           <button class="button ghost" type="button" data-route="login">Back to login</button>
//         </form>
//       </div>
//     `);
//     return;
//   }

//   if (page === "reset" || page === "reset-password") {
//     const { query } = parseHashRoute();
//     const token = query.token || "";
//     app.innerHTML = authFrame(`
//       <div class="auth-card narrow">
//         <div class="brand-mark">H</div>
//         <h1>Reset password</h1>
//         <p>${token ? "Create a new password for your account." : "This reset link is invalid or missing a token."}</p>
//         <form data-action="reset-password" class="stack">
//           <input name="token" type="hidden" value="${escapeAttribute(token)}" />
//           ${passwordField({ label: "New password", name: "newPassword", minlength: 12, autocomplete: "new-password" })}
//           ${passwordField({ label: "Confirm new password", name: "confirmPassword", minlength: 12, autocomplete: "new-password" })}
//           ${passwordPolicyHint("current account")}
//           <div class="notice subtle">Minimum 12 characters with uppercase, lowercase, number, and special character.</div>
//           <button class="button primary" type="submit" ${token ? "" : "disabled"}>Reset Password</button>
//           <button class="button ghost" type="button" data-route="login">Back to login</button>
//         </form>
//       </div>
//     `);
//     return;
//   }

//   if (page === "patient-login") {
//     app.innerHTML = authFrame(`
//       <div class="auth-card">
//         <div class="brand-row">
//           <div class="brand-mark">H</div>
//           <div>
//             <p class="eyebrow">Hospital Operations Command Center</p>
//             <h1>Patient portal login.</h1>
//             <span class="mode-pill">${environmentLabel}</span>
//           </div>
//         </div>
//         <p class="lede">See your appointments, bills, and reports, and book a new appointment.</p>
//         <form data-action="patient-login" class="login-grid" autocomplete="off">
//           <label>Email<input name="loginIdentifier" type="email" required autocomplete="off" data-testid="patient-login-email" /></label>
//           ${passwordField({ label: "Password", name: "password", autocomplete: "current-password", testid: "patient-login-password", revealable: false })}
//           <button class="button primary" type="submit" data-testid="patient-login-submit">Sign in</button>
//           <button class="button ghost" type="button" data-route="login">Staff login</button>
//         </form>
//       </div>
//     `);
//     return;
//   }

//   if (page === "patient-invite") {
//     const { query } = parseHashRoute();
//     const token = query.token || "";
//     app.innerHTML = authFrame(`
//       <div class="auth-card narrow">
//         <div class="brand-mark">H</div>
//         <h1>Set up your patient portal access</h1>
//         <p>${token ? "Create a password to activate your patient portal account." : "This invite link is invalid or missing a token."}</p>
//         <form data-action="patient-accept-invite" class="stack">
//           <input name="token" type="hidden" value="${escapeAttribute(token)}" />
//           ${passwordField({ label: "Password", name: "newPassword", minlength: 12, autocomplete: "new-password" })}
//           ${passwordField({ label: "Confirm password", name: "confirmPassword", minlength: 12, autocomplete: "new-password" })}
//           ${passwordPolicyHint("your patient portal account")}
//           <div class="notice subtle">Minimum 12 characters with uppercase, lowercase, number, and special character.</div>
//           <button class="button primary" type="submit" ${token ? "" : "disabled"}>Activate portal access</button>
//           <button class="button ghost" type="button" data-route="patient-login">Back to patient login</button>
//         </form>
//       </div>
//     `);
//     return;
//   }

//   // Normal staff login page
//   app.innerHTML = authFrame(`
//     <div class="staff-login-layout">
//       <section class="staff-login-hero" aria-label="Hospital Operations Command Center">
//         <div class="staff-login-brand">
//           <div class="staff-login-mark" aria-hidden="true">H</div>
//           <p>Hospital Operations Command Center</p>
//           <h1>One command<br />center for hospital<br />operations.</h1>
//           <span class="staff-login-mode"><i></i>${environmentLabel}</span>
//           <p class="staff-login-copy">One platform for patient flow, branches, billing, pharmacy, IPD, governance, and operations intelligence.</p>
//         </div>
//       </section>
//       <section class="staff-login-card">
//         <div class="staff-login-heading">
//           <span class="staff-login-mobile-mark" aria-hidden="true">H</span>
//           <h2>Welcome back</h2>
//           <p>Sign in to access your hospital workspace.</p>
//         </div>
//         <form data-action="login" class="staff-login-form" autocomplete="off">
//           <label>Username / email
//             <span class="staff-login-input"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" /></svg><input name="loginIdentifier" type="text" required autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Enter your email or username" data-testid="login-email" /></span>
//           </label>
//           <div class="staff-password-label"><label for="staff-password">Password</label><button type="button" data-route="forgot">Forgot password?</button></div>
//           <span class="staff-login-input staff-password-input"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg><input id="staff-password" name="password" type="password" required autocomplete="current-password" placeholder="Enter your password" data-testid="login-password" /><button class="password-toggle" type="button" data-action="toggle-password-visibility" aria-label="Show password"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg></button></span>
//           <button class="staff-sign-in" type="submit" data-testid="login-submit">Sign in</button>
//         </form>
//         <p class="staff-patient-link">Are you a patient? <button type="button" data-route="patient-login">Patient login</button></p>
//       </section>
//     </div>
//   `);
// }

// function renderPatientPortal(page, query = {}) {
//   const patientPages = {
//     dashboard: patientDashboardPage,
//     "patient-appointments": patientAppointmentsPage,
//     "patient-bills": patientBillsPage,
//     "patient-documents": patientDocumentsPage
//   };
//   const activePage = patientPages[page] ? page : "dashboard";
//   try {
//     app.innerHTML = patientPortalShell(activePage, patientPages[activePage]());
//   } catch (error) {
//     if (isAuthError(error)) {
//       currentUser = null;
//       setPage("patient-login");
//       renderAuth("patient-login");
//       toast("Your session expired. Please sign in again.", "error");
//       return;
//     }
//     app.innerHTML = patientPortalShell(activePage, `<div class="notice error">${escapeHtml(error.message || "Unable to load page.")}</div>`);
//   }
// }

// function patientPortalShell(activePage, contentHtml) {
//   const navItems = [
//     ["dashboard", "Dashboard"],
//     ["patient-appointments", "Appointments"],
//     ["patient-bills", "Bills"],
//     ["patient-documents", "Documents"]
//   ];
//   return `
//     <div class="patient-portal-shell">
//       <header class="patient-portal-header">
//         <div class="brand-row"><div class="brand-mark">H</div><strong>Patient Portal</strong></div>
//         <nav class="patient-portal-nav">
//           ${navItems.map(([key, label]) => `<button class="button ${activePage === key ? "primary" : "ghost"}" type="button" data-route="${key}">${escapeHtml(label)}</button>`).join("")}
//           <button class="button ghost" type="button" data-action="logout">Logout</button>
//         </nav>
//       </header>
//       <main class="patient-portal-main">${contentHtml}</main>
//     </div>
//   `;
// }

// function patientDashboardPage() {
//   const me = safeOptionalData(() => api.patientMe(), null);
//   const records = safeOptionalData(() => api.patientRecords(), null);
//   const appointments = records?.records?.appointments || [];
//   const now = Date.now();
//   const upcoming = appointments
//     .filter((a) => new Date(a.appointmentDate || a.scheduledDate || 0).getTime() >= now)
//     .sort((a, b) => new Date(a.appointmentDate || a.scheduledDate) - new Date(b.appointmentDate || b.scheduledDate))[0];
//   const bills = records?.records?.bills || [];
//   const pendingBills = bills.filter((b) => b.status !== "Paid").length;
//   return `
//     <div class="section-head"><div><h2>Welcome${me?.name ? `, ${escapeHtml(me.name)}` : ""}</h2></div></div>
//     <div class="metric-grid">
//       ${metricCard("MRN", me?.mrn || "—", "Your medical record number")}
//       ${metricCard("Upcoming Appointment", upcoming ? formatDateTime(upcoming.appointmentDate || upcoming.scheduledDate) : "None scheduled", upcoming?.department || "Book a new appointment")}
//       ${metricCard("Pending Bills", pendingBills, "Needs review")}
//       ${metricCard("Documents", (records?.records?.documents || []).length, "Available to download")}
//     </div>
//     <section class="panel">
//       <div class="panel-head"><h3>Quick actions</h3></div>
//       <div class="quick-grid">
//         <button class="quick-action" type="button" data-route="patient-appointments"><strong>Book an appointment</strong></button>
//         <button class="quick-action" type="button" data-route="patient-bills"><strong>View bills</strong></button>
//         <button class="quick-action" type="button" data-route="patient-documents"><strong>View documents</strong></button>
//       </div>
//     </section>
//   `;
// }

// function patientAppointmentsPage() {
//   const records = safeOptionalData(() => api.patientRecords(), null);
//   const appointments = (records?.records?.appointments || []).slice().sort((a, b) => new Date(b.appointmentDate || b.scheduledDate || b.createdAt) - new Date(a.appointmentDate || a.scheduledDate || a.createdAt));
//   const options = safeOptionalData(() => api.appointmentOptions(), { departments: [], doctors: [] });
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Book an appointment</h3></div>
//       <form class="form-grid" data-action="patient-book-appointment">
//         <label>Department<select name="department" required data-appointment-department>${appointmentDepartmentOptions(options)}</select></label>
//         <label>Doctor<select name="doctor" required data-appointment-doctor>${appointmentDoctorOptions(options)}</select></label>
//         <label>Visit type<select name="visitType"><option>New</option><option>Follow-up</option></select></label>
//         <label>Date<input name="date" type="date" value="${localDateInputValue()}" required /></label>
//         <label>Time<input name="time" type="time" value="09:30" required /></label>
//         <label class="span-2">Notes<textarea name="notes"></textarea></label>
//         <button class="button primary" type="submit">Book appointment</button>
//       </form>
//     </section>
//     <section class="panel">
//       <div class="panel-head"><h3>Your appointments</h3></div>
//       ${appointments.length ? table(["Date", "Department", "Doctor", "Visit Type", "Status"], appointments.map((a) => [
//         formatDateTime(a.appointmentDate || a.scheduledDate || a.createdAt),
//         a.department,
//         a.doctor,
//         a.visitType,
//         badge(a.status, statusClass(a.status))
//       ])) : emptyState("No appointments yet. Use the form above to book one.")}
//     </section>
//   `;
// }

// function patientBillsPage() {
//   const records = safeOptionalData(() => api.patientRecords(), null);
//   const bills = (records?.records?.bills || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Your bills</h3></div>
//       ${bills.length ? table(["Bill", "Date", "Items", "Total", "Paid", "Balance", "Status"], bills.map((bill) => [
//         bill.billNumber,
//         formatDateTime(bill.createdAt),
//         bill.items,
//         currencyDisplay(firstDefined(bill.totalAmount, bill.total, bill.amount)),
//         currencyDisplay(firstDefined(bill.paidAmount, bill.paid, bill.amountPaid)),
//         currencyDisplay(firstDefined(bill.balance, bill.outstandingAmount, 0)),
//         badge(bill.status, statusClass(bill.status))
//       ])) : emptyState("No bills on file yet.")}
//     </section>
//   `;
// }

// function patientDocumentsPage() {
//   const records = safeOptionalData(() => api.patientRecords(), null);
//   const documents = (records?.records?.documents || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Your documents</h3></div>
//       ${documents.length ? table(["File", "Type", "Date", "Action"], documents.map((doc) => [
//         doc.originalFilename || doc.fileName,
//         doc.documentType,
//         formatDateTime(doc.createdAt),
//         `<button class="button tiny soft" type="button" data-action="patient-download-document" data-document-id="${doc.id}">Download</button>`
//       ])) : emptyState("No documents available yet.")}
//     </section>
//   `;
// }

// function renderPublicBooking(query = {}) {
//   const branchId = query.branch || query.branchId || "";
//   app.innerHTML = authFrame(publicBookingPage(branchId));
// }

// function publicBookingPage(branchId) {
//   if (!branchId) {
//     return `
//       <div class="auth-card narrow">
//         <div class="brand-mark">H</div>
//         <h1>Book an appointment</h1>
//         <p>This booking link is missing a location. Please use the link or QR code provided by the hospital.</p>
//       </div>
//     `;
//   }
//   const options = safeOptionalData(() => api.publicBookingOptions(branchId), { departments: [], doctors: [] });
//   return `
//     <div class="auth-card">
//       <div class="brand-row">
//         <div class="brand-mark">H</div>
//         <div>
//           <p class="eyebrow">${escapeHtml(options.branchName || "Hospital Operations Command Center")}</p>
//           <h1>Book an appointment</h1>
//         </div>
//       </div>
//       <p class="lede">Fill in your details and our team will confirm your appointment.</p>
//       <form class="form-grid" data-action="public-book-appointment" data-branch-id="${escapeAttribute(branchId)}">
//         <label>Name<input name="name" required autocomplete="name" /></label>
//         <label>Mobile<input name="mobile" type="tel" required autocomplete="tel" /></label>
//         <label>Age<input name="age" type="number" min="0" /></label>
//         <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
//         <label>Department<select name="department" required data-appointment-department>${appointmentDepartmentOptions(options)}</select></label>
//         <label>Doctor<select name="doctor" required data-appointment-doctor>${appointmentDoctorOptions(options)}</select></label>
//         <label>Preferred date<input name="date" type="date" value="${localDateInputValue()}" required /></label>
//         <label>Preferred time<input name="time" type="time" value="09:30" required /></label>
//         <label class="span-2">Notes<textarea name="notes"></textarea></label>
//         <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true" />
//         <button class="button primary" type="submit">Request appointment</button>
//       </form>
//     </div>
//   `;
// }

// function publicBookingConfirmation(appointmentNumber) {
//   return `
//     <div class="auth-card narrow">
//       <div class="brand-mark">H</div>
//       <h1>Appointment requested</h1>
//       <p>Your appointment request${appointmentNumber ? ` (${escapeHtml(appointmentNumber)})` : ""} has been received. Our team will contact you to confirm the date and time.</p>
//     </div>
//   `;
// }

// function authFrame(content) {
//   return `
//     <main class="auth-shell">
//       <section class="auth-hero">
//         ${content}
//       </section>
//     </main>
//   `;
// }

// function renderShell(page, options = {}) {
//   const isNurse = currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "nurse";
//   const isReception = currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user";
//   const doctorRole = String(currentUser.jobRole || "").toLowerCase();
//   const isDoctor = currentUser.role === ROLES.BRANCH_USER && ["doctor", "surgeon"].includes(doctorRole);
//   const isPharmacy = currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(doctorRole);
//   const isBilling = currentUser.role === ROLES.BRANCH_USER && /billing|finance/.test(doctorRole);
//   const isLab = currentUser.role === ROLES.BRANCH_USER && /lab/.test(doctorRole);
//   const isRadiology=currentUser.role===ROLES.BRANCH_USER&&/radiology/.test(doctorRole);
//   const isMortuary=currentUser.role===ROLES.BRANCH_USER&&/mortuary/.test(doctorRole);
//   const isSurgeon = doctorRole === "surgeon";
//   const isBranchAdmin = currentUser.role === ROLES.BRANCH_ADMIN;
//   const roleNav = isBranchAdmin ? BRANCH_ADMIN_NAV : isNurse ? NURSE_NAV : isReception ? RECEPTION_NAV : isDoctor ? DOCTOR_NAV : isPharmacy ? PHARMACY_NAV : isBilling ? BILLING_NAV : isLab ? LAB_NAV : isRadiology ? RADIOLOGY_NAV : isMortuary ? MORTUARY_NAV : (NAV_BY_ROLE[currentUser.role] || []).map(([key, label]) => [key, label, null]);
//   const nav = roleNav.filter(([key, _label, group]) => canAccessPage(currentUser, key) && (group !== "Surgery" || isSurgeon));
//   const premiumRoleShell = isBranchAdmin || isNurse || isReception || isDoctor || isPharmacy || isBilling || isLab || isRadiology || isMortuary;
//   const branchOptions = hasPermission(currentUser, "branches", "view") ? safeData(() => api.branches(currentUser)) : [];
//   const hospitalOptions = hasPermission(currentUser, "hospitals", "view") ? safeData(() => api.hospitals(currentUser)) : [];
//   const notificationItems = hasPermission(currentUser, "notifications", "view") ? mergeNotifications() : [];
//   const unreadNotificationCount = notificationItems.filter((item) => !item.read).length;
//   const branch = branchOptions.find((item) => item.id === currentUser.branchId);
//   const hospital = hospitalOptions.find((item) => item.id === currentUser.hospitalId);
//   const branchType = branch?.branchType || currentUser.branchType || (branch ? "Main Branch" : "");
//   const branchContext = branch ? `${branchType}: ${branch.name}` : "";

//   app.innerHTML = `
//     <div class="app-shell">
//       <aside class="sidebar ${isBranchAdmin ? "branch-admin-sidebar" : isNurse ? "nurse-sidebar" : isReception ? "reception-sidebar" : isDoctor ? "doctor-sidebar" : isPharmacy ? "pharmacy-sidebar" : isBilling ? "billing-sidebar" : isLab ? "lab-sidebar" : isRadiology ? "radiology-sidebar" : isMortuary ? "mortuary-sidebar" : ""}">
//         <div class="logo-block">
//           <div class="brand-mark">H</div>
//           <div>
//             <strong>${premiumRoleShell ? "Hospital Operations" : "HOCC"}</strong>
//             ${premiumRoleShell ? "" : "<span>Command Center</span>"}
//           </div>
//         </div>
//         <nav class="nav-list">
//           ${nav.map(([key, label, roleGroup], index) => `
//             ${(premiumRoleShell ? roleGroup !== nav[index - 1]?.[2] ? roleGroup : "" : navGroupLabel(key, nav[index - 1]?.[0])) ? `<span class="nav-group">${escapeHtml(premiumRoleShell ? roleGroup : navGroupLabel(key, nav[index - 1]?.[0]))}</span>` : ""}
//             <button class="nav-item ${page === key ? "active" : ""}" type="button" data-route="${key}" title="${escapeHtml(label)}" data-testid="sidebar-${escapeHtml(key)}">
//               <span class="nav-icon">${navIcon(key)}</span><span>${escapeHtml(label)}</span>
//             </button>
//           `).join("")}
//         </nav>
//         <div class="scope-card">
//           ${premiumRoleShell ? `<span class="nurse-avatar" aria-hidden="true">${isBranchAdmin ? "BA" : isNurse ? "N" : isReception ? "R" : isDoctor ? "Dr" : isPharmacy ? "Rx" : isBilling ? "B" : isLab ? "L" : isRadiology ? "R" : "M"}</span><div class="nurse-scope-copy">` : ""}
//           <span>${escapeHtml(isBranchAdmin ? "Branch Admin" : isDoctor ? currentUser.jobRole : isPharmacy ? "Pharmacist" : isBilling ? "Billing / Finance" : isLab ? "Laboratory" : isRadiology ? "Radiology" : isMortuary ? "Mortuary" : roleLabels[currentUser.role])}</span>
//           <strong>${escapeHtml(isBranchAdmin ? currentUser.name || "Branch Admin" : isNurse ? "Nurse" : isReception ? currentUser.name || "Receptionist" : isDoctor ? currentUser.name || "Doctor" : isPharmacy ? currentUser.name || "Pharmacy User" : isBilling ? currentUser.name || "Billing User" : isLab ? currentUser.name || "Lab User" : isRadiology ? currentUser.name || "Radiology User" : isMortuary ? currentUser.name || "Mortuary Officer" : scopeDescription(currentUser))}</strong>
//           <small>${escapeHtml(isBranchAdmin ? "Assigned branch access" : isNurse ? "Assigned ward / unit access" : isReception ? "Front Desk" : isDoctor ? currentUser.department || "Clinical Department" : isPharmacy ? currentUser.pharmacyName || "Pharmacist" : isBilling ? "Billing / Finance" : isLab ? "Laboratory" : isRadiology ? "Radiology" : isMortuary ? "Mortuary" : hospital?.name || "All hospitals")}${!premiumRoleShell && branchContext ? ` / ${escapeHtml(branchContext)}` : ""}</small>
//           ${premiumRoleShell ? `<small>${escapeHtml(isBranchAdmin ? "Main Branch" : isNurse ? "Assigned branch only" : currentUser.branchName || "Assigned Branch")}</small></div>` : ""}
//         </div>
//       </aside>
//       <main class="main">
//         <header class="topbar">
//           <div>
//             <p class="eyebrow">${escapeHtml(isBranchAdmin ? "BRANCH ADMIN" : isDoctor ? currentUser.jobRole.toUpperCase() : isPharmacy ? "PHARMACY" : isBilling ? "BILLING" : isLab ? "LAB" : isRadiology ? "RADIOLOGY" : isMortuary ? "MORTUARY" : roleLabels[currentUser.role])}</p>
//             <h1 data-testid="page-title">${escapeHtml(options.forceUnauthorized ? "Access blocked" : currentPageTitle(page))}</h1>
//             <div class="context-row">
//               <span>${escapeHtml(isDoctor && page === "notifications" ? "Main Branch" : isBranchAdmin || isPharmacy || isBilling || isLab || isRadiology || isMortuary ? currentUser.branchName || branch?.name || "Main Branch" : hospital?.name || "All hospitals")}</span>
//               ${branch ? `<span>${escapeHtml(branchType)}</span><span>${escapeHtml(branch.name)}</span>` : ""}
//               <span>${environmentLabel}</span>
//             </div>
//           </div>
//           <div class="top-actions">
//             <div class="top-search-wrap">
//               <input class="top-search" placeholder="Search MRN, patient, bill, admission" value="${escapeHtml(globalSearchQuery)}" data-global-search aria-label="Global search" />
//               ${topSearchAutocomplete()}
//             </div>
//             ${hasPermission(currentUser, "notifications", "view") ? `<button class="button soft icon-action ${unreadNotificationCount ? "has-unread" : ""}" title="Notifications: ${escapeHtml(String(unreadNotificationCount))} unread" aria-label="Notifications: ${escapeHtml(String(unreadNotificationCount))} unread" type="button" data-action="toggle-notifications" aria-expanded="${notificationsDrawerOpen ? "true" : "false"}">${iconLabel("!", `Notifications ${unreadNotificationCount}`)}</button>` : ""}
//             <button class="button soft user-chip" type="button" data-route="profile"><span>${escapeHtml(userInitials(currentUser.name || currentUser.email))}</span><strong>${escapeHtml(currentUser.name)}</strong></button>
//             <button class="button ghost" type="button" data-action="logout" data-testid="logout-button">Logout</button>
//           </div>
//         </header>
//         ${isPharmacy||isBilling||isLab||isRadiology||isMortuary?"":careCommandStrip(notificationItems,page,hospital,branch)}
//         <section class="content">
//           ${options.forceUnauthorized ? unauthorizedPage(page) : options.loading ? pageSkeleton(page) : renderPage(page)}
//         </section>
//       </main>
//       ${notificationsDrawerOpen && hasPermission(currentUser, "notifications", "view") ? renderNotificationsDrawer(notificationItems) : ""}
//       ${createModal()}
//       ${editModal()}
//       ${deleteModal()}
//     </div>
//   `;
//   if (!options.loading && !options.forceUnauthorized) renderedPageKey = routeKey(page, options.query || parseHashRoute().query);
//   wireCreateButtons();
//   const appointmentForm = app.querySelector?.('form[data-action="create-appointment"]');
//   if (appointmentForm) {
//     fillAppointmentFromPatient(appointmentForm);
//     filterAppointmentDoctors(appointmentForm);
//   }
//   normalizeBranchAdminCreateUserForm();
//   enhanceDraftAreas();
//   enhancePasswordHints();
//   animateCountUps();
// }

// function normalizeBranchAdminCreateUserForm() {
//   if (currentUser?.role !== ROLES.BRANCH_ADMIN) return;
//   const form = app.querySelector?.('form[data-action="create-user"]');
//   if (!form) return;
//   const branchField = form.querySelector('[name="branchId"]');
//   const assignedBranchId = currentUser.branchId || "";
//   const assignedBranchName = currentUser.branchName || assignedBranchId || "Assigned branch";
//   const assignedBranchType = currentUser.branchType || "Assigned branch";
//   const branchHtml = `
//     <label>Branch (${escapeHtml(assignedBranchType)})<input value="${escapeHtml(`${assignedBranchName}${assignedBranchId ? ` / ID: ${assignedBranchId}` : ""}`)}" readonly data-testid="user-form-branch-display" /></label>
//     <input type="hidden" name="branchId" value="${escapeHtml(assignedBranchId)}" data-testid="user-form-branch" />
//   `;
//   if (branchField && branchField.tagName === "SELECT") {
//     const wrapper = branchField.closest("label");
//     if (wrapper) wrapper.outerHTML = branchHtml;
//     else branchField.outerHTML = branchHtml;
//   } else if (branchField) {
//     branchField.value = assignedBranchId;
//   }
//   const accessField = form.querySelector('[name="accessExpiresAt"]');
//   if (accessField) accessField.closest("label")?.remove();
//   const assignmentText = [...form.querySelectorAll("p")]
//     .find((node) => node.textContent.includes("Branch Admin can assign users only inside"));
//   if (assignmentText) assignmentText.textContent = "This is filled from the logged-in Branch Admin and cannot be changed.";
// }

// function userInitials(value = "") {
//   const parts = String(value || "User").trim().split(/\s+/).filter(Boolean);
//   return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || "U").toUpperCase();
// }

// function careCommandStrip(notificationItems = [], page = "dashboard", hospital = null, branch = null) {
//   const countBy = (matcher) => notificationItems.filter((item) => matcher(`${item.category || ""} ${item.module || ""} ${item.title || ""} ${item.priority || ""}`.toLowerCase())).length;
//   const critical = notificationItems.filter((item) => ["critical", "high"].includes(String(item.priority || "").toLowerCase()) && !item.read).length;
//   const shortcuts = [
//     ["Queue", "queue", countBy((text) => text.includes("queue"))],
//     ["Reports", canAccessPage(currentUser, "lab") ? "lab" : "radiology", countBy((text) => text.includes("lab") || text.includes("radiology") || text.includes("report"))],
//     ["MAR", "mar", countBy((text) => text.includes("mar") || text.includes("medication"))],
//     ["Billing", "billing", countBy((text) => text.includes("billing") || text.includes("payment"))],
//     ["Discharge", "discharge", countBy((text) => text.includes("discharge"))]
//   ].filter(([, route]) => canAccessPage(currentUser, route));
//   return `
//     <section class="care-command-strip" aria-label="Hospital command strip">
//       <div class="care-status">
//         <strong>${escapeHtml(critical ? `${critical} urgent` : "No urgent alerts")}</strong>
//         <span>${escapeHtml(branch?.name || hospital?.name || scopeDescription(currentUser))}</span>
//         <small>${escapeHtml(roleLabels[currentUser.role])} / ${escapeHtml(currentUser.jobRole || "Operations")}</small>
//       </div>
//       <div class="care-shortcuts">
//         ${shortcuts.map(([label, route, count]) => `
//           <button class="${page === route ? "active" : ""}" type="button" data-route="${escapeHtml(route)}">
//             <strong>${escapeHtml(String(count))}</strong>
//             <span>${escapeHtml(label)}</span>
//           </button>
//         `).join("") || `<span class="care-note">Your visible work areas are ready.</span>`}
//       </div>
//       <div class="care-note">Use the strip to jump to delayed work before continuing routine entry.</div>
//     </section>
//   `;
// }

// function doctorDashboardPage() {
//   const data = deriveOperationalData();
//   const doctorName = String(currentUser.name || "").toLowerCase();
//   const assigned = (item) => !item.doctor && !item.admittingDoctor && !item.consultant || [item.doctor, item.admittingDoctor, item.consultant].some((value) => String(value || "").toLowerCase().includes(doctorName.replace(/^dr\.?\s*/, "")));
//   const ready = data.queue.filter((item) => item.status === "Ready for Doctor" && assigned(item));
//   const activeIpd = data.admissions.filter((item) => ["Admitted", "Under Treatment"].includes(item.admissionStatus || item.status) && assigned(item));
//   const resultsReady = data.labOrders.filter((item) => ["Report Ready", "Completed"].includes(item.status) && assigned(item)).length;
//   const followupsToday = (data.followUps || []).filter((item) => isToday(item.date || item.createdAt) && assigned(item)).length;
//   const critical = (data.alerts || []).filter((item) => ["Critical", "High"].includes(item.severity || item.priority) && !["Closed", "Resolved"].includes(item.status)).length;
//   return `<section class="panel"><div class="panel-head"><div><h3>Doctor Workspace</h3><p>Clinical work assigned to ${escapeHtml(currentUser.name || "Doctor")}.</p></div>${badge(currentUser.branchName || "Main Branch", "status-active")}</div></section><div class="metric-grid small">${metricCard("Waiting for Me", ready.length, "OPD queue")}${metricCard("Ready for Consultation", ready.length, "Ready for Doctor")}${metricCard("My IPD Patients", activeIpd.length, "Active admissions")}${metricCard("Results Ready", resultsReady, "Lab results")}${metricCard("Follow-ups Today", followupsToday, "Scheduled")}${metricCard("Critical Alerts", critical, "Needs review")}</div>${quickActionsPanel([["Open Queue", "queue"], ["Start Consultation", "consultation"], ["My IPD Patients", "ipd"], ["View Results", "lab"]])}`;
// }

// function pharmacyTabs(route, tabs) {
//   const active = parseHashRoute().query.tab || tabs[0][0];
//   return `<div class="pharmacy-tabs" role="navigation" aria-label="Page filters">${tabs.map(([key, label]) => `<button class="pharmacy-tab ${active === key ? "active" : ""}" type="button" data-route="${escapeHtml(route)}" data-tab="${escapeHtml(key)}">${escapeHtml(label)}</button>`).join("")}</div>`;
// }

// function pharmacyDashboardPage() {
//   const issues = safeOptionalData(() => api.pharmacyIssues(currentUser), []);
//   const stocks = safeOptionalData(() => api.medicineStocks(currentUser), []);
//   const tasks = safeOptionalData(() => api.tasks(currentUser), []).filter((item) => /pharmacy|medicine|stock/i.test(`${item.assignedTo || ""} ${item.module || ""} ${item.title || ""}`) && item.status !== "Completed");
//   const alerts = safeOptionalData(() => api.alerts(currentUser), []).filter((item) => /pharmacy|medicine|stock|expiry/i.test(`${item.category || ""} ${item.department || ""} ${item.title || ""}`) && !["Closed", "Resolved"].includes(item.status));
//   const low = stocks.filter((item) => Number(item.quantityAvailable || 0) <= Number(item.reorderLevel || 0));
//   const expiring = stocks.filter((item) => { const expiry = new Date(item.expiryDate || item.expiry || 0); const days = (expiry - new Date()) / 86400000; return days >= 0 && days <= 90; });
//   const issuedToday = issues.filter((item) => item.status === "Issued" && isToday(item.issuedAt || item.updatedAt || item.createdAt)).length;
//   return `<section class="panel pharmacy-page-heading"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Today's Pharmacy Work</h3><p>Prescription, inventory and assigned-work overview for ${escapeHtml(currentUser.branchName || "Main Branch")}.</p></div>${badge(currentUser.branchName || "Main Branch", "status-active")}</div></section><div class="metric-grid small">${metricCard("New Prescriptions", issues.filter((item) => ["New", "Pending"].includes(item.status)).length, "Received")}${metricCard("Waiting for Dispensing", issues.filter((item) => !["Issued", "Ready"].includes(item.status)).length, "Pending")}${metricCard("Ready for Pickup", issues.filter((item) => item.status === "Ready").length, "Prepared")}${metricCard("Dispensed Today", issuedToday, "Completed")}${metricCard("Low Stock", low.length, "Needs attention")}${metricCard("Expiring Medicines", expiring.length, "Within 90 days")}${metricCard("Pending Tasks", tasks.length, "Assigned")}${metricCard("Alerts", alerts.length, "Open")}</div>${quickActionsPanel([["Prescriptions", "pharmacy"], ["Dispensing", "pharmacy-dispensing"], ["Prescription Search", "pharmacy-search"], ["Stock", "stock"]])}`;
// }

// function pharmacyPrescriptionsPage() {
//   return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Prescriptions</h3><p>Prescription workspace shell. Receiving and dispensing actions are reserved for the next milestone.</p></div></div>${pharmacyTabs("pharmacy", [["new", "New"], ["pending", "Pending"], ["preparing", "Preparing"], ["ready", "Ready to Dispense"], ["dispensed", "Dispensed"], ["history", "History"]])}${emptyState("No prescription records are available for this filter.")}</section>`;
// }

// function pharmacyDispensingPage() {
//   return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Dispensing</h3><p>Future medicine preparation and dispensing workspace.</p></div></div>${pharmacyTabs("pharmacy-dispensing", [["due", "Due"], ["partial", "Partially Dispensed"], ["full", "Fully Dispensed"], ["unavailable", "Unavailable"], ["returned", "Cancelled / Returned"]])}${emptyState("No dispensing records are available. Dispensing actions are not enabled in this milestone.")}</section>`;
// }

// function pharmacySearchPage() {
//   return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Prescription Search</h3><p>Search without patient registration, editing or deletion access.</p></div></div><div class="pharmacy-search-box"><input type="search" placeholder="Search patient, MRN or prescription ID" aria-label="Search patient, MRN or prescription ID"/><button class="button primary" type="button">Search</button></div>${table(["Patient", "MRN", "Prescription ID", "Doctor", "Date", "Status", "Action"], [])}</section>`;
// }

// function pharmacyReturnsPage() {
//   return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Inventory</p><h3>Returns</h3><p>Return-processing shell; no stock mutation is enabled.</p></div></div>${pharmacyTabs("returns", [["patient", "Patient Returns"], ["ward", "Ward Returns"], ["damaged", "Damaged Stock"], ["expired", "Expired Stock"], ["history", "Return History"]])}${emptyState("No return records are available.")}</section>`;
// }

// function pharmacyReportsPage() {
//   return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Reports</h3><p>Pharmacy report categories.</p></div></div>${pharmacyTabs("reports", [["daily", "Daily Dispensing"], ["usage", "Medicine Usage"], ["stock", "Stock"], ["low", "Low Stock"], ["expiry", "Expiry"], ["returns", "Returns"], ["history", "Dispensing History"]])}${emptyState("No report data is available for this category.")}</section>`;
// }

// function roleShellPage(kicker, title, description, route, tabs, searchPlaceholder = "") {
//   return `<section class="panel role-shell-workspace"><div class="panel-head"><div><p class="eyebrow">${escapeHtml(kicker)}</p><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></div></div>${pharmacyTabs(route, tabs)}${searchPlaceholder ? `<div class="pharmacy-search-box"><input type="search" placeholder="${escapeHtml(searchPlaceholder)}"/><button class="button primary" type="button">Search</button></div>` : ""}${emptyState(`No ${title.toLowerCase()} records are available for this filter.`)}</section>`;
// }

// function billingDashboardPage() {
//   const bills = safeOptionalData(() => api.bills(currentUser), []), claims = safeOptionalData(() => api.claims(currentUser), []), checkouts = safeOptionalData(() => api.checkouts(currentUser), []), tasks = safeOptionalData(() => api.tasks(currentUser), []), alerts = safeOptionalData(() => api.alerts(currentUser), []);
//   const pending = bills.filter((item) => item.status !== "Paid"), collected = bills.filter((item) => item.status === "Paid" && isToday(billPaymentTimestamp(item) || item.updatedAt)).reduce((sum,item)=>sum+billPaidAmount(item),0);
//   return `<section class="panel role-page-heading"><div class="panel-head"><div><p class="eyebrow">Billing</p><h3>Today's Billing Work</h3><p>Billing and finance overview for ${escapeHtml(currentUser.branchName || "Main Branch")}.</p></div></div></section><div class="metric-grid small">${metricCard("Pending Bills",pending.length,"Open")}${metricCard("Pending Payments",pending.length,"Awaiting payment")}${metricCard("Collected Today",currencyDisplay(collected),"Paid")}${metricCard("Outstanding",currencyDisplay(pending.reduce((s,b)=>s+billBalanceAmount(b),0)),"Balance")}${metricCard("Claims Pending",claims.filter(i=>!["Approved","Rejected"].includes(i.status)).length,"Open")}${metricCard("Checkout Pending",checkouts.filter(i=>i.status!=="Completed").length,"Open")}${metricCard("Refund Requests",0,"No workflow yet")}${metricCard("Alerts",alerts.filter(i=>i.status!=="Resolved").length,"Open")}</div>`;
// }

// function labDashboardPage() {
//   const orders=safeOptionalData(()=>api.labOrders(currentUser),[]),tasks=safeOptionalData(()=>api.tasks(currentUser),[]),alerts=safeOptionalData(()=>api.alerts(currentUser),[]);
//   return `<section class="panel role-page-heading"><div class="panel-head"><div><p class="eyebrow">Lab</p><h3>Today's Laboratory Work</h3><p>Order, sample and result overview for ${escapeHtml(currentUser.branchName || "Main Branch")}.</p></div></div></section><div class="metric-grid small">${metricCard("New Lab Orders",orders.filter(i=>["New","Ordered"].includes(i.status)).length,"Received")}${metricCard("Samples Pending",orders.filter(i=>!["Sample Collected","Completed","Report Ready"].includes(i.status)).length,"To collect")}${metricCard("In Processing",orders.filter(i=>i.status==="In Processing").length,"Active")}${metricCard("Results Pending",orders.filter(i=>["Sample Collected","Processing Completed"].includes(i.status)).length,"Entry")}${metricCard("Verification Pending",orders.filter(i=>i.status==="Verification Pending").length,"Review")}${metricCard("Critical Results",orders.filter(i=>i.priority==="Critical"||i.resultFlag==="Critical").length,"Critical")}${metricCard("Pending Tasks",tasks.filter(i=>i.status!=="Completed").length,"Assigned")}${metricCard("Alerts",alerts.filter(i=>i.status!=="Resolved").length,"Open")}</div>`;
// }

// function billingBillsPage(){return `${pharmacyTabs("billing",[["create","Create Bill"],["pending","Pending"],["paid","Paid"],["unpaid","Unpaid"],["invoices","Invoices"]])}${billingPage()}`}
// function billingClaimsPage(){return `${pharmacyTabs("claims",[["create","Create"],["pending","Pending"],["approved","Approved"],["rejected","Rejected"],["status","Status"]])}${claimsPage()}`}
// function billingCheckoutPage(){return `${pharmacyTabs("checkout",[["ready","Ready for Checkout"],["charges","Pending Charges"],["clearance","Billing Clearance"],["complete","Complete Checkout"]])}${checkoutPage()}`}
// function billingReportsPage(){return roleShellPage("Billing","Reports","Billing and finance reporting categories.","reports",[["daily","Daily Collections"],["billing","Billing"],["outstanding","Outstanding"],["claims","Claims"],["payments","Payments"],["refunds","Refunds"]])}
// function labOrdersPage(){return `${pharmacyTabs("lab",[["new","New"],["pending","Pending"],["urgent","Urgent / STAT"],["completed","Completed"]])}${labPage()}`}
// function labDocumentsPage(){return `${pharmacyTabs("documents",[["attachments","Lab Attachments"],["reports","Uploaded Reports"],["supporting","Supporting Documents"]])}${documentsPage()}`}
// function labReportsPage(){return roleShellPage("Lab","Reports","Laboratory reporting categories.","reports",[["daily","Daily Lab Report"],["pending","Pending Tests"],["completed","Completed Tests"],["rejections","Rejections"],["tat","Turnaround Time"]])}
// function radiologyOrdersPage(){return `${pharmacyTabs("radiology",[["new","New"],["pending","Pending"],["urgent","Urgent / STAT"],["completed","Completed"]])}${radiologyPage()}`}
// function radiologyShell(title,route,tabs,search=""){return roleShellPage("Radiology",title,`${title} workspace shell.`,route,tabs,search)}
// function radiologyResultsPage(){const tabs=[["pending","Pending"],["create","Create Report"],["draft","Draft"],...(/radiologist/.test(String(currentUser.jobRole||"").toLowerCase())?[["verify","Verify / Sign"]]:[]),["published","Published"],["critical","Critical Findings"]];return radiologyShell("Reports","radiology-results",tabs)}
// function mortuaryShell(title,route,tabs,search=""){return roleShellPage("Mortuary",title,`${title} workspace shell.`,route,tabs,search)}

// // ===== NEW: Reception Enroll Patient and Patient Records Pages =====
// function receptionEnrollPatientPage() {
//   // Clear any previous message after render
//   const message = receptionEnrollMessage;
//   receptionEnrollMessage = "";

//   // Fetch patients sorted newest first
//   const patients = safeOptionalData(() => api.patients(currentUser), []);
//   const sortedPatients = [...patients].sort((a, b) => new Date(b.createdAt || b.registeredDate || 0) - new Date(a.createdAt || a.registeredDate || 0));

//   // Build form fields
//   const formHtml = `
//     <form class="form-grid compact-grid" data-action="reception-enroll-patient">
//       <label>Full Name *<input name="name" required placeholder="Enter full name" /></label>
//       <label>Mobile Number *<input name="mobile" type="tel" required placeholder="9876543210" /></label>
//       <label>Date of Birth<input name="dob" type="date" /></label>
//       <label>Age<input name="age" type="number" min="0" max="130" placeholder="Age" /></label>
//       <label>Gender *<select name="gender" required><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
//       <label>Email<input name="email" type="email" placeholder="patient@example.com" /></label>
//       <label>Address *<input name="address" required placeholder="Enter address" /></label>
//       <label>Emergency Contact Number<input name="emergencyContact" placeholder="9876543210" /></label>
//       <label>ID Proof Type<select name="idProofType"><option value="">Select</option><option>Aadhaar</option><option>PAN</option><option>Voter ID</option><option>Passport</option><option>Driving License</option><option>Other</option></select></label>
//       <label>ID Proof Number<input name="idProofNumber" placeholder="Enter ID number" /></label>
//       <label>Insurance / Payment Type<select name="insurance"><option value="Self Pay">Self Pay</option><option>Insurance</option><option>Corporate</option><option>Government Scheme</option><option>Other</option></select></label>
//       <div class="button-row span-2">
//         <button class="button ghost" type="reset">Reset</button>
//         <button class="button primary" type="button" data-route="records">Patient Records</button>
//         <button class="button primary" type="submit">Enroll Patient</button>
//       </div>
//     </form>
//     ${message ? `<div class="notice success">${escapeHtml(message)}</div>` : ""}
//   `;

//   // Build table rows
//   const tableRows = sortedPatients.map((patient) => {
//     const ageSex = [patient.age, patient.gender].filter(Boolean).join(" / ") || "-";
//     const idProof = patient.idProofType && patient.idProofNumber ? `${patient.idProofType}: ${patient.idProofNumber}` : "-";
//     const insurance = patient.insurance || patient.paymentType || "-";
//     const registeredDate = formatDateTime(patient.createdAt || patient.registeredDate);
//     return [
//       patient.mrn || "MRN pending",
//       patient.name || patient.fullName || "Patient",
//       patient.mobile || "-",
//       ageSex,
//       patient.dob || "-",
//       idProof,
//       insurance,
//       registeredDate,
//       `<button class="button tiny primary" type="button" data-route="admissions" data-patient-id="${escapeHtml(patient.id)}" data-testid="new-admission-button">New Admission</button>`
//     ];
//   });

//   const tableHtml = `
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Patient Records</h3></div>
//       </div>
//       ${tableRows.length ? table(
//         ["MRN", "Patient Name", "Mobile", "Age / Sex", "Date of Birth", "ID Proof", "Insurance", "Registered Date", "Actions"],
//         tableRows
//       ) : emptyState("No patients enrolled yet.")}
//     </section>
//   `;

//   return `
//     <div class="section-head">
//       <div><h2>Enroll Patient</h2></div>
//     </div>
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Enroll Patient Form</h3></div>
//       </div>
//       ${formHtml}
//     </section>
//     ${tableHtml}
//   `;
// }

// function receptionPatientRecordsPage() {
//   const patients = safeOptionalData(() => api.patients(currentUser), []);
//   const sortedPatients = [...patients].sort((a, b) => new Date(b.createdAt || b.registeredDate || 0) - new Date(a.createdAt || a.registeredDate || 0));

//   const tableRows = sortedPatients.map((patient) => {
//     const ageSex = [patient.age, patient.gender].filter(Boolean).join(" / ") || "-";
//     const idProof = patient.idProofType && patient.idProofNumber ? `${patient.idProofType}: ${patient.idProofNumber}` : "-";
//     const insurance = patient.insurance || patient.paymentType || "-";
//     const registeredDate = formatDateTime(patient.createdAt || patient.registeredDate);
//     return [
//       patient.mrn || "MRN pending",
//       patient.name || patient.fullName || "Patient",
//       patient.mobile || "-",
//       ageSex,
//       patient.dob || "-",
//       idProof,
//       insurance,
//       registeredDate,
//       `<button class="button tiny primary" type="button" data-route="admissions" data-patient-id="${escapeHtml(patient.id)}" data-testid="new-admission-button">New Admission</button>`
//     ];
//   });

//   return `
//     <div class="section-head">
//       <div><h2>Patient Records</h2></div>
//       <div class="button-row">
//         <button class="button primary" type="button" data-route="patients">Enroll Patient</button>
//       </div>
//     </div>
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Patient Records</h3></div>
//       </div>
//       ${tableRows.length ? table(
//         ["MRN", "Patient Name", "Mobile", "Age / Sex", "Date of Birth", "ID Proof", "Insurance", "Registered Date", "Actions"],
//         tableRows
//       ) : emptyState("No patients enrolled yet.")}
//     </section>
//   `;
// }

// // ===== NEW: Reception New Admission and Admission Records Pages =====
// function receptionNewAdmissionPage() {
//   const { query } = parseHashRoute();
//   const preselectedPatientId = query.patientId || "";

//   // Clear any previous message
//   const message = receptionAdmissionMessage;
//   receptionAdmissionMessage = "";

//   const patients = safeOptionalData(() => api.patients(currentUser), []);
//   const admissions = safeOptionalData(() => api.admissions(currentUser), []);
//   const sortedAdmissions = [...admissions].sort((a, b) => new Date(b.createdAt || b.admissionDateTime || 0) - new Date(a.createdAt || a.admissionDateTime || 0));

//   // Build patient dropdown options
//   const patientOptions = patients.map((p) => {
//     const selected = String(p.id) === preselectedPatientId ? "selected" : "";
//     return `<option value="${escapeHtml(p.id)}" ${selected}
//       data-mrn="${escapeHtml(p.mrn || "")}"
//       data-mobile="${escapeHtml(p.mobile || "")}"
//       data-age="${escapeHtml(p.age || "")}"
//       data-gender="${escapeHtml(p.gender || "")}"
//       data-name="${escapeHtml(p.name || p.fullName || "")}"
//     >${escapeHtml(p.mrn || "MRN pending")} - ${escapeHtml(p.name || p.fullName || "Patient")} - ${escapeHtml(p.mobile || "")}</option>`;
//   }).join("");

//   // Build admission type options (IPD, Day Care, Emergency Admission)
//   const admissionTypeOptions = `
//     <option>IPD</option>
//     <option>Day Care</option>
//     <option>Emergency Admission</option>
//   `;

//   // Payment type options
//   const paymentTypeOptions = `
//     <option value="Self Pay">Self Pay</option>
//     <option value="Insurance">Insurance</option>
//     <option value="Corporate">Corporate</option>
//     <option value="Government Scheme">Government Scheme</option>
//   `;

//   // Build form
//   const formHtml = `
//     <form class="form-grid compact-grid" data-action="reception-create-admission">
//       <label>Patient *<select name="patientId" required data-admission-patient>
//         <option value="">Select patient</option>
//         ${patientOptions}
//       </select></label>
//       <label>MRN<input name="mrn" readonly placeholder="Auto-filled" /></label>
//       <label>Mobile<input name="mobile" readonly placeholder="Auto-filled" /></label>
//       <label>Age / Gender<input name="ageGender" readonly placeholder="Auto-filled" /></label>

//       <label>Admission Type *<select name="admissionType" required>${admissionTypeOptions}</select></label>
//       <label>Department *<input name="department" required placeholder="e.g. General Medicine" /></label>
//       <label>Doctor / Consultant<input name="doctor" placeholder="Attending doctor" /></label>
//       <label>Admission Date *<input name="admissionDate" type="date" value="${localDateInputValue()}" required /></label>
//       <label>Admission Time *<input name="admissionTime" type="time" value="09:00" required /></label>

//       <label>Attendant Name<input name="attendantName" placeholder="Name of attendant" /></label>
//       <label>Attendant Mobile<input name="attendantMobile" placeholder="9876543210" /></label>

//       <label>Payment Type *<select name="paymentType" required>${paymentTypeOptions}</select></label>
//       <label>Insurance / Corporate Name<input name="insuranceCorporateName" placeholder="Name of insurer / company" /></label>

//       <label class="span-2">Administrative Notes<textarea name="adminNotes" placeholder="Any administrative remarks"></textarea></label>

//       <div class="button-row span-2">
//         <button class="button ghost" type="reset">Reset</button>
//         <button class="button primary" type="button" data-route="admission-records">Admission Records</button>
//         <button class="button primary" type="submit">Create Admission</button>
//       </div>
//     </form>
//     ${message ? `<div class="notice success">${escapeHtml(message)}</div>` : ""}
//   `;

//   // Build admission records table
//   const tableRows = sortedAdmissions.map((admission) => {
//     const patient = patients.find((p) => String(p.id) === String(admission.patientId));
//     const admissionDateTime = formatDateTime(admission.admissionDateTime || admission.createdAt);
//     const wardBed = admission.ward && admission.bedNumber ? `${admission.ward} / ${admission.bedNumber}` : (admission.ward || admission.bedNumber || "-");
//     return [
//       admission.admissionId || admission.id || "ID pending",
//       patient?.mrn || admission.mrn || "-",
//       patient?.name || admission.patientName || "-",
//       admissionDateTime,
//       admission.admissionType || "-",
//       admission.department || "-",
//       admission.doctor || admission.consultant || "-",
//       admission.paymentType || "-",
//       wardBed,
//       `<div class="grid-actions">
//         <button class="button tiny soft" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admission.id)}">View</button>
//         ${hasPermission(currentUser, "billing", "create") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${escapeHtml(admission.patientId)}">Create Invoice</button>` : ""}
//         <button class="button tiny soft" type="button" onclick="window.print()">Print</button>
//       </div>`
//     ];
//   });

//   const tableHtml = `
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Admission Records</h3></div>
//       </div>
//       ${tableRows.length ? table(
//         ["Admission ID", "MRN", "Patient Name", "Admission Date / Time", "Admission Type", "Department", "Doctor / Consultant", "Payment Type", "Ward / Bed", "Actions"],
//         tableRows
//       ) : emptyState("No admission records found.")}
//     </section>
//   `;

//   return `
//     <div class="section-head">
//       <div><h2>New Admission</h2></div>
//     </div>
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Admission Form</h3></div>
//       </div>
//       ${formHtml}
//     </section>
//     ${tableHtml}
//   `;
// }

// function receptionAdmissionRecordsPage() {
//   const patients = safeOptionalData(() => api.patients(currentUser), []);
//   const admissions = safeOptionalData(() => api.admissions(currentUser), []);
//   const sortedAdmissions = [...admissions].sort((a, b) => new Date(b.createdAt || b.admissionDateTime || 0) - new Date(a.createdAt || a.admissionDateTime || 0));

//   const tableRows = sortedAdmissions.map((admission) => {
//     const patient = patients.find((p) => String(p.id) === String(admission.patientId));
//     const admissionDateTime = formatDateTime(admission.admissionDateTime || admission.createdAt);
//     const wardBed = admission.ward && admission.bedNumber ? `${admission.ward} / ${admission.bedNumber}` : (admission.ward || admission.bedNumber || "-");
//     return [
//       admission.admissionId || admission.id || "ID pending",
//       patient?.mrn || admission.mrn || "-",
//       patient?.name || admission.patientName || "-",
//       admissionDateTime,
//       admission.admissionType || "-",
//       admission.department || "-",
//       admission.doctor || admission.consultant || "-",
//       admission.paymentType || "-",
//       wardBed,
//       `<div class="grid-actions">
//         <button class="button tiny soft" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admission.id)}">View</button>
//         ${hasPermission(currentUser, "billing", "create") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${escapeHtml(admission.patientId)}">Create Invoice</button>` : ""}
//         <button class="button tiny soft" type="button" onclick="window.print()">Print</button>
//       </div>`
//     ];
//   });

//   return `
//     <div class="section-head">
//       <div><h2>Admission Records</h2></div>
//       <div class="button-row">
//         <button class="button primary" type="button" data-route="admissions">New Admission</button>
//       </div>
//     </div>
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Admission Records</h3></div>
//       </div>
//       ${tableRows.length ? table(
//         ["Admission ID", "MRN", "Patient Name", "Admission Date / Time", "Admission Type", "Department", "Doctor / Consultant", "Payment Type", "Ward / Bed", "Actions"],
//         tableRows
//       ) : emptyState("No admission records found.")}
//     </section>
//   `;
// }
// // ===== END NEW Reception Pages =====

// function renderPage(page) {
//   const pageContext = { __dataRenderScheduled, accessDeniedPanel, accessReviewTarget, actionIcon, addButtonTestId, admissionBedLabel, admissionDisplayId, admissionPatientId, admissionWardLabel, allAssignablePages, allowedCreatorRoleOptions, animateCountUps, api, app, applyUserRolePreset, appointmentDepartmentOptions, appointmentDoctorOptions, asArray, attentionPanel, auditSearchQuery, authFrame, automationAlerts, automationAlertsPanel, automationList, automationSettingsCache, automationSettingsCacheUserId, automationSettingsForScope, badge, billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, branchDepartmentOptions, branchUserPermissionBuilder, canAccessPage, canonicalRecordId, careCommandStrip, checklistPanel, clickLoadingActions, cloneUserOptions, COLLECTION_MODULES, collectionRows, collectSetupStepValues, comparisonTable, createForm, createModal, createTarget, currencyDisplay, currencyValue, currentPageTitle, currentUser, dashboardPage, dateSeriesFromRows, deathSummaryButton, deathSummaryChecklistPanel, deathSummaryForAdmission, deathSummaryForm, deathSummaryPage, deathSummaryPreview, deathSummarySection, delayLabel, deleteModal, deleteTarget, deriveBillingSuggestions, deriveNotifications, deriveOperationalData, deriveTasks, dischargeChecklistPanel, documentActions, documentAlertsPanel, documentTable, documentTypeOptions, documentUploadPanel, downloadBase64File, draftKeyFor, draftTimers, editableEntries, editFieldControl, editFieldLabel, editModal, editTarget, emergencyOneScreenPanel, emptyState, enhanceDraftAreas, enhancePasswordHints, environmentLabel, escapeAttribute, escapeHtml, exportCsv, exportExcel, fileStorageStatus, fillAppointmentFromPatient, filterAppointmentDoctors, filterByAdmission, financeSummaryFromBills, findAdmissionForPlan, findPatient, findPatientForDischarge, firstDefined, formatAuditValue, formatDateTime, formatGb, formValues, getApiMode, globalSearchActiveIndex, globalSearchError, globalSearchQuery, globalSearchStatus, globalSearchSuggestions, globalSearchTimer, goLiveChecklistCache, goLiveChecklistCacheUserId, goLiveChecklistForScope, gridActions, gridAddButton, groupSearchResults, hasPermission, iconLabel, inferredSetupProgress, initFrontendSentry, ipd360Button, ipd360Tabs, ipdAdmissionChecklistPanel, ipdAdmissionStatus, ipdHeader, ipdJourneyTracker, ipdNextActions, ipdTimelineEvents, ipdTimelinePanel, isAuthError, isBillPaidToday, isDeathOutcome, isPendingStatus, isToday, isUnauthorizedError, jobRoleOptions, journeyTracker, latestForPatient, latestPatientJourneyStage, latestRecord, livePatientFlowBoard, loadingLabel, loadingLabels, localDateInputValue, localDateKey, localFrontendMode, MASTER_MODULES, medicineField, mergeNotifications, metricCard, metricTrend, minutesSince, missingDocumentAlerts, modalSubmitTestId, money, NAV_BY_ROLE, navGroupLabel, navIcon, normalizeBranchAdminCreateUserForm, normalizeDashboardData, normalizeEditValues, normalizePageKey, normalizeSetupStep, notificationGroup, notificationsDrawerOpen, OPD_JOURNEY_STEPS, opdCheckoutChecklistPanel, opdJourneyTrackerForPatient, PAGE_TITLE_FALLBACK, pageErrorPanel, pageFromHash, pageSkeleton, parseCsv, parseHashRoute, passwordField, passwordPolicyHint, passwordPolicyState, patientActions, patientAppointmentsPage, patientBillsPage, patientCardGrid, patientDashboardPage, patientDocumentsPage, patientJourneyTimelinePanel, patientLabel, patientName, patientOption, patientPortalShell, patientRiskIndicator, patientStickyHeader, patientTimeline, pendingCount, pendingUpload, permissionMatrix, permissionMatrixRows, permissionRiskAlerts, permissionRiskPanel, permissionTemplateOptions, permitted, printableButton, priorityCards, providerStatusGrid, publicBookingConfirmation, publicBookingLinkBlock, publicBookingPage, queueDelayAlerts, queueDelayPanel, quickActionsPanel, readFileAsDataUrl, readFileAsText, recordTime, render, renderAuth, renderedPageKey, renderMustChangePasswordGate, renderNotificationsDrawer, renderPage, renderPatientPortal, renderPublicBooking, renderShell, resolveDischargePatient, resolveMedicationName, riskClass, riskSummary, roleDashboardPanel, roleLabels, ROLES, roleSmartCards, roleWorkQueue, routeKey, rowRouteButton, runGlobalSearch, safeAiAssistantPanel, safeData, safeMrn, safeOptionalData, safeRenderPage, sameId, sampleCsv, scheduleDataRender, scheduleDraftSave, scopeDescription, searchFilterBar, searchResultRoute, selectedPatientId, selectedPermissionPages, selectPatientPanel, SENSITIVE_USER_PERMISSIONS, sensitivePermissionList, setPage, setPermissionPages, SETUP_STEP_ALIASES, SETUP_WIZARD_STEPS, setupPercent, setupProgressSummary, severityForDelay, shouldStagePage, simpleOpsPage, skeletonLine, skeletonMetricCards, skeletonTable, smartBillingDraftPanel, stagedPageKey, stagedPageTimer, startButtonLoading, startFormLoading, statusClass, stopButtonLoading, stopFormLoading, strongPassword, table, taskStatus, TEXT_TEMPLATES, titleCase, toast, toNumber, topSearchAutocomplete, trendChart, unauthorizedPage, uniquePages, updatePermissionBuilder, uploadValidation, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, userAccessDetail, userAccessPreview, userInitials, userPageCheckboxGroups, validateRows, warmDataCache };
//   configurePatientFlowPages(pageContext);
//   configureIpdClinicalPages(pageContext);
//   configureAdministrationPages(pageContext);
//   configureOperationsPages(pageContext);
//   configurePlatformPages(pageContext);
//   const pages = {
//     dashboard: currentUser.role === ROLES.BRANCH_USER && ["doctor", "surgeon"].includes(String(currentUser.jobRole || "").toLowerCase()) ? doctorDashboardPage : currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? pharmacyDashboardPage : currentUser.role === ROLES.BRANCH_USER && /billing|finance/.test(String(currentUser.jobRole||"").toLowerCase()) ? billingDashboardPage : currentUser.role === ROLES.BRANCH_USER && /lab/.test(String(currentUser.jobRole||"").toLowerCase()) ? labDashboardPage : dashboardPage,
//     hospitals: hospitalsPage,
//     branches: branchesPage,
//     users: usersPage,
//     accessReview: accessReviewPage,
//     permissionTemplates: permissionTemplatesPage,
//     setup: setupPage,
//     masterData: masterDataPage,
//     doctorSchedule: doctorSchedulePage,
//     staffRoster: staffRosterPage,
//     emergency: emergencyPage,
//     documents: currentUser.role===ROLES.BRANCH_USER&&/lab/.test(String(currentUser.jobRole||"").toLowerCase())?labDocumentsPage:documentsPage,
//     notifications: notificationsPage,
//     finance: financePage,
//     stock: stockPage,
//     purchase: purchasePage,
//     feedback: feedbackPage,
//     backup: backupPage,
//     compliance: compliancePage,
//     globalSearch: globalSearchPage,
//     appointments: appointmentsPage,
//     patients: currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "nurse"
//       ? () => nurseMyPatientsPage({ api, currentUser, safeData, safeOptionalData, escapeHtml })
//       : currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
//         ? receptionEnrollPatientPage
//         : patientsPage,
//     queue: queuePage,
//     vitals: vitalsPage,
//     consultation: consultationPage,
//     lab: currentUser.role===ROLES.BRANCH_USER&&/lab/.test(String(currentUser.jobRole||"").toLowerCase())?labOrdersPage:labPage,
//     radiology: currentUser.role===ROLES.BRANCH_USER&&/radiology/.test(String(currentUser.jobRole||"").toLowerCase())?radiologyOrdersPage:radiologyPage,
//     "radiology-scheduling":()=>radiologyShell("Scheduling","radiology-scheduling",[["schedule","To Schedule"],["today","Today"],["upcoming","Upcoming"],["reschedule","Reschedule / Cancel"],["xray","X-Ray"],["ct","CT"],["mri","MRI"],["ultrasound","Ultrasound"],["mammography","Mammography"],["other","Other"]]),
//     "radiology-queue":()=>radiologyShell("Scan Queue","radiology-queue",[["waiting","Waiting"],["scheduled","Scheduled"],["arrived","Arrived"],["progress","In Progress"],["completed","Scan Completed"],["reporting","Reporting Pending"]]),
//     "radiology-imaging":()=>radiologyShell("Imaging / Scan","radiology-imaging",[["xray","X-Ray"],["ct","CT"],["mri","MRI"],["ultrasound","Ultrasound"],["other","Other Imaging"]]),
//     "radiology-results":radiologyResultsPage,
//     "radiology-search":()=>radiologyShell("Patient / Order Search","radiology-search",[["patient","Patient"],["mrn","MRN"],["order","Radiology Order"],["study","Study / Scan ID"]],"Search patient, MRN, radiology order or study ID"),
//     pharmacy: currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? pharmacyPrescriptionsPage : pharmacyPage,
//     "pharmacy-dispensing": pharmacyDispensingPage,
//     "pharmacy-search": pharmacySearchPage,
//     returns: pharmacyReturnsPage,
//     billing: currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingBillsPage:billingPage,
//     payments: () => roleShellPage("Billing","Payments","Payment workspace shell.","payments",[["receive","Receive Payment"],["partial","Partial Payments"],["receipts","Receipts"],["history","Payment History"]]),
//     "ipd-billing": () => roleShellPage("Billing","IPD Billing","Admission-linked charge-category shell.","ipd-billing",[["bed","Bed / Room"],["doctor","Doctor"],["lab","Lab"],["radiology","Radiology"],["pharmacy","Pharmacy"],["procedure","OT / Procedure"],["final","Final Bill"]]),
//     refunds: () => roleShellPage("Finance","Refunds / Adjustments","Finance adjustment shell; no mutation actions enabled.","refunds",[["requests","Refund Requests"],["discounts","Discounts"],["credit","Credit Notes"],["corrections","Bill Corrections"]]),
//     "billing-search": () => roleShellPage("Finance","Patient / Bill Search","Search billing references without patient management.","billing-search",[["patient","Patient Name"],["mrn","MRN"],["bill","Bill No"],["admission","Admission No"],["receipt","Receipt No"]],"Search patient, MRN, bill, admission or receipt number"),
//     "lab-samples": () => roleShellPage("Lab","Sample Collection","Sample collection workspace shell.","lab-samples",[["collect","To Collect"],["collected","Collected"],["recollect","Recollection"],["rejected","Rejected"],["labels","Barcode / Labels"]]),
//     "lab-processing": () => roleShellPage("Lab","Sample Processing","Sample processing status shell.","lab-processing",[["received","Received"],["processing","In Processing"],["completed","Processing Completed"],["result","Pending Result Entry"]]),
//     "lab-results": () => roleShellPage("Lab","Results","Laboratory results status shell.","lab-results",[["entry","Enter Results"],["draft","Draft"],["verification","Verification Pending"],["verified","Verified"],["published","Published"],["critical","Critical"]]),
//     "lab-search": () => roleShellPage("Lab","Patient / Order Search","Search laboratory references.","lab-search",[["patient","Patient"],["mrn","MRN"],["order","Lab Order"],["sample","Barcode / Sample ID"]],"Search patient, MRN, lab order or sample ID"),
//     checkout: currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingCheckoutPage:checkoutPage,
//     followups: followUpsPage,
//     admissions: currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
//       ? receptionNewAdmissionPage
//       : admissionsPage,
//     ipd: ipdPage,
//     ipdPatient360: ipdPatient360Page,
//     emr: emrPage,
//     deathSummary: deathSummaryPage,
//     wards: wardsPage,
//     dailySheets: dailySheetsPage,
//     dutyDoctor: dutyDoctorPage,
//     nursing: nursingPage,
//     ipdVitals: ipdVitalsPage,
//     mar: marPage,
//     intakeOutput: intakeOutputPage,
//     handover: handoverPage,
//     discharge: dischargePage,
//     ot: otPage,
//     mortuary: mortuaryPage,
//     "mortuary-intake":()=>mortuaryShell("Admissions / Intake","mortuary-intake",[["new","New Intake"],["identification","Identification"],["received","Received Details"],["property","Property / Belongings"]]),
//     "mortuary-storage":()=>mortuaryShell("Body Storage","mortuary-storage",[["available","Available Units"],["occupied","Occupied Units"],["assign","Assign Storage"],["transfer","Transfer Storage"],["history","Storage History"]]),
//     "mortuary-release":()=>mortuaryShell("Release / Handover","mortuary-release",[["ready","Ready for Release"],["clearance","Pending Clearance"],["authority","Relative / Authority Details"],["documents","Release Documentation"],["completed","Completed Handover"]]),
//     "mortuary-search":()=>mortuaryShell("Patient / Case Search","mortuary-search",[["patient","Patient"],["mrn","MRN"],["case","Mortuary Case ID"],["admission","Admission ID"]],"Search patient, MRN, mortuary case or admission ID"),
//     ipdReports: ipdReportsPage,
//     ipdAlerts: ipdAlertsPage,
//     claims: currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingClaimsPage:claimsPage,
//     uploads: uploadPage,
//     mapping: mappingPage,
//     records: currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
//       ? receptionPatientRecordsPage
//       : recordsPage,
//     "admission-records": currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
//       ? receptionAdmissionRecordsPage
//       : recordsPage, // fallback for non-reception
//     alerts: alertsPage,
//     tasks: tasksPage,
//     reports: currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? pharmacyReportsPage : currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingReportsPage:currentUser.role===ROLES.BRANCH_USER&&/lab/.test(String(currentUser.jobRole||"").toLowerCase())?labReportsPage:reportsPage,
//     audit: auditPage,
//     settings: settingsPage,
//     productFlow: productFlowPage,
//     subscriptions: subscriptionsPage,
//     offers: offersPage,
//     modules: modulesPage,
//     inventory: inventoryPage,
//     staff: () => simpleOpsPage("Staff Master", api.staff(currentUser), ["name", "role", "department", "shift", "utilization"]),
//     beds: () => simpleOpsPage("Beds / Rooms", api.beds(currentUser), ["bed", "room", "status", "patientId"]),
//     incidents: () => simpleOpsPage("Incidents", api.incidents(currentUser), ["title", "category", "risk", "status", "date"]),
//     profile: profilePage
//   };
//   return safeRenderPage(page, pages[page]);
// }

// function safeRenderPage(page, renderFn) {
//   if (!renderFn) return pageErrorPanel(currentPageTitle(page), "This page is not connected yet.", "Choose another page from the sidebar.");
//   try {
//     return renderFn();
//   } catch (error) {
//     if (isAuthError(error)) throw error;
//     if (isUnauthorizedError(error)) return accessDeniedPanel(page);
//     console.warn(error.message);
//     return pageErrorPanel(currentPageTitle(page), error.message || "This page could not load its data.", "Your session is still active. Try again or choose another page.");
//   }
// }

// function accessDeniedPanel(page = pageFromHash()) {
//   const helpByPage = {
//     ipd: "IPD pages are usually available to Hospital Admin, Branch Admin, Duty Doctor, and Nurse roles with assigned IPD access.",
//     ipdPatient360: "IPD Patient 360 is usually available to Branch Admin, Duty Doctor, and Nurse roles with IPD access.",
//     dailySheets: "Daily Sheets are usually available to Branch Admin and Nurse roles assigned to IPD care.",
//     mar: "MAR is usually available to Nurse and Branch Admin roles with medication workflow access.",
//     discharge: "Discharge Planning is usually available to Duty Doctor, Branch Admin, and authorized discharge teams.",
//     finance: "Finance is usually available to Hospital Admin, Branch Admin, and finance-authorized staff.",
//     stock: "Stock Logic is usually available to Hospital Admin, Branch Admin, Pharmacy, and Inventory roles.",
//     documents: "Documents are usually available to document-enabled clinical, claims, lab, and admin staff."
//   };
//   return `
//     <section class="panel state-panel" data-testid="access-denied-panel">
//       <div class="empty error-state">
//         <span class="empty-icon lock-icon" aria-hidden="true">!</span>
//         <strong>You do not have permission to access this page.</strong>
//         <p>${escapeHtml(currentPageTitle(page))} is outside your current role or branch access.</p>
//         <small>${escapeHtml(helpByPage[page] || "Ask your administrator to review your branch, page, and action permissions.")}</small>
//       </div>
//     </section>
//   `;
// }

// function pageErrorPanel(title, message, note = "Try again.") {
//   return `
//     <section class="panel state-panel" data-testid="page-error-panel">
//       <div class="empty error-state">
//         <span class="empty-icon error-icon" aria-hidden="true">!</span>
//         <strong>${escapeHtml(title || "Page could not load")}</strong>
//         <p>${escapeHtml(message || "This page could not load its data. Try again.")}</p>
//         <small>${escapeHtml(note)}</small>
//         <div class="button-row"><button class="button soft" type="button" data-action="retry-page">Retry</button></div>
//       </div>
//     </section>
//   `;
// }

// function skeletonLine(width = "100%") {
//   return `<span class="skeleton-line" style="--skeleton-width:${escapeHtml(width)}"></span>`;
// }

// function skeletonMetricCards(count = 6) {
//   return `<div class="metric-grid">${Array.from({ length: count }).map(() => `
//     <article class="metric-card skeleton-card" aria-hidden="true">
//       ${skeletonLine("58%")}
//       ${skeletonLine("38%")}
//       ${skeletonLine("76%")}
//     </article>
//   `).join("")}</div>`;
// }

// function skeletonTable(rows = 6, columns = 6) {
//   const widths = ["72%", "48%", "64%", "38%", "58%", "44%", "68%", "54%"];
//   return `
//     <section class="panel skeleton-card" aria-busy="true" aria-live="polite">
//       <div class="panel-head">
//         <div>${skeletonLine("180px")}${skeletonLine("320px")}</div>
//         ${skeletonLine("96px")}
//       </div>
//       <div class="table-wrap">
//         <table class="skeleton-table">
//           <thead><tr>${Array.from({ length: columns }).map((_, index) => `<th>${skeletonLine(widths[index % widths.length])}</th>`).join("")}</tr></thead>
//           <tbody>
//             ${Array.from({ length: rows }).map((_, rowIndex) => `<tr>${Array.from({ length: columns }).map((__, colIndex) => `<td>${skeletonLine(widths[(rowIndex + colIndex) % widths.length])}</td>`).join("")}</tr>`).join("")}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   `;
// }

// function pageSkeleton(page = pageFromHash()) {
//   const title = currentPageTitle(page);
//   const heavy = new Set(["dashboard", "patients", "appointments", "queue", "billing", "documents", "audit", "ipd", "ipdPatient360", "emergency"]);
//   return `
//     <div class="page-transition page-loading" data-testid="page-loading-state">
//       <section class="panel page-loading-head">
//         <div>
//           <p class="eyebrow">Loading</p>
//           <h2>${escapeHtml(title)}</h2>
//           <p>Preparing live data for your permitted hospital and branch scope.</p>
//         </div>
//         <span class="loading-spinner" aria-hidden="true"></span>
//       </section>
//       ${heavy.has(page) ? skeletonMetricCards(page === "ipdPatient360" ? 6 : 3) : ""}
//       ${skeletonTable(page === "ipdPatient360" ? 4 : 6, page === "ipdPatient360" ? 2 : 7)}
//     </div>
//   `;
// }

// function selectPatientPanel(message = "Select a patient to continue.", patients = [], action = "patient-start-consultation") {
//   return `
//     <section class="panel state-panel" data-testid="select-patient-panel">
//       <div class="panel-head"><h3>Select patient</h3><p>${escapeHtml(message)}</p></div>
//       ${patients.length ? patientCardGrid(patients.map((patient) => ({
//         id: patient.id,
//         patientId: patient.id,
//         patientName: patient.name || patient.fullName,
//         mrn: patient.mrn,
//         age: patient.age,
//         gender: patient.gender,
//         priority: patient.priority || "Normal",
//         status: patient.status || "Active",
//         action,
//         actionLabel: action === "patient-record-vitals" ? "Record Vitals" : "Start Consultation"
//       }))) : emptyState("No patients are available for this step right now.")}
//     </section>
//   `;
// }

// function normalizeDashboardData(data = {}) {
//   return {
//     ...data,
//     metrics: data.metrics || {},
//     hospitals: Array.isArray(data.hospitals) ? data.hospitals : [],
//     branches: Array.isArray(data.branches) ? data.branches : [],
//     alerts: Array.isArray(data.alerts) ? data.alerts : [],
//     tasks: Array.isArray(data.tasks) ? data.tasks : []
//   };
// }

// function deriveOperationalData() {
//   return {
//     patients: permitted("patients") ? safeOptionalData(() => api.patients(currentUser)) : [],
//     appointments: permitted("appointments") ? safeOptionalData(() => api.appointments(currentUser)) : [],
//     queue: permitted("queue") ? safeOptionalData(() => api.queueTokens(currentUser)) : [],
//     vitals: permitted("vitals") ? safeOptionalData(() => api.vitals(currentUser)) : [],
//     consultations: permitted("consultation") ? safeOptionalData(() => api.consultations(currentUser)) : [],
//     labOrders: permitted("lab") ? safeOptionalData(() => api.labOrders(currentUser)) : [],
//     pharmacyIssues: permitted("pharmacy") ? safeOptionalData(() => api.pharmacyIssues(currentUser)) : [],
//     bills: permitted("billing") ? safeOptionalData(() => api.bills(currentUser)) : [],
//     checkouts: permitted("checkout") ? safeOptionalData(() => api.checkouts(currentUser)) : [],
//     admissions: permitted("admissions") ? safeOptionalData(() => api.admissions(currentUser)) : [],
//     beds: permitted("wards") || permitted("beds") ? safeOptionalData(() => api.beds(currentUser)) : [],
//     documents: permitted("documents") ? safeOptionalData(() => api.patientDocuments(currentUser)) : [],
//     users: permitted("accessReview") ? safeOptionalData(() => api.accessReviewUsers(currentUser)) : [],
//     branches: permitted("branches") ? safeOptionalData(() => api.branches(currentUser)) : [],
//     permissionTemplates: permitted("permissionTemplates") ? safeOptionalData(() => api.permissionTemplates(currentUser)) : [],
//     dischargePlans: permitted("discharge") ? safeOptionalData(() => api.dischargePlans(currentUser)) : [],
//     deathSummaries: permitted("deathSummary") ? safeOptionalData(() => api.deathSummaries(currentUser)) : [],
//     otBookings: permitted("ot") ? safeOptionalData(() => api.otBookings(currentUser)) : [],
//     radiologyOrders: permitted("radiology") ? safeOptionalData(() => api.radiologyOrders(currentUser)) : [],
//     mortuaryRecords: permitted("mortuary") ? safeOptionalData(() => api.mortuaryRecords(currentUser)) : [],
//     providers: permitted("settings") ? safeOptionalData(() => api.providerStatus?.(), null) : null
//   };
// }

// function deriveTasks(data = deriveOperationalData()) {
//   const tasks = [];
//   const add = (condition, task) => {
//     if (condition) tasks.push({ priority: "Medium", due: "Today", status: "Open", ...task });
//   };
//   data.queue.forEach((token) => add(permitted("vitals", "create") && !latestForPatient(data.vitals, token.patientId), {
//     title: `Record vitals for ${token.patientName || token.patientId}`,
//     assignedTo: "Nursing",
//     module: "Vitals",
//     priority: minutesSince(recordTime(token)) > 15 || Number(token.waitingMinutes || 0) > 15 ? "High" : "Medium",
//     route: "vitals",
//     patientId: token.patientId
//   }));
//   data.labOrders.forEach((order) => add(isPendingStatus(order.status, ["Report Ready", "Doctor Reviewed"]), {
//     title: `${order.orderType || "Lab"} report pending for ${patientName(data.patients, order.patientId, order.patientName || order.patientId)}`,
//     assignedTo: order.orderType === "Radiology" ? "Radiology" : "Lab",
//     module: order.orderType || "Lab",
//     route: order.orderType === "Radiology" ? "radiology" : "lab"
//   }));
//   data.pharmacyIssues.forEach((issue) => add(issue.status !== "Issued", {
//     title: `Issue medicines for ${issue.patientName || patientName(data.patients, issue.patientId, issue.patientId)}`,
//     assignedTo: "Pharmacy",
//     module: "Pharmacy",
//     route: "pharmacy"
//   }));
//   data.bills.forEach((bill) => add(bill.status !== "Paid", {
//     title: `Collect payment for ${bill.patientName || patientName(data.patients, bill.patientId, bill.patientId)}`,
//     assignedTo: "Billing",
//     module: "Billing",
//     priority: "High",
//     route: "billing",
//     patientId: bill.patientId
//   }));
//   data.admissions.forEach((admission) => add(permitted("wards", "edit") && !admission.bedNumber && !admission.bedId && !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(admission)), {
//     title: `Assign bed for ${admission.patientName || admissionPatientId(admission)}`,
//     assignedTo: "IPD Team",
//     module: "Wards",
//     priority: "High",
//     route: "wards",
//     admissionId: admissionDisplayId(admission)
//   }));
//   data.dischargePlans.forEach((plan) => add(plan.status !== "Ready for Discharge", {
//     title: `Complete discharge clearances for ${plan.patientName || plan.patientId || plan.admissionId}`,
//     assignedTo: "Discharge Team",
//     module: "Discharge",
//     priority: "High",
//     route: "discharge",
//     admissionId: plan.admissionId
//   }));
//   data.deathSummaries.forEach((summary) => add(["Submitted", "Submitted for Review", "Returned"].includes(summary.status), {
//     title: `Death Summary ${summary.status} for ${summary.patientName || summary.mrn || summary.admissionId}`,
//     assignedTo: "Clinical Reviewer",
//     module: "Death Summary",
//     priority: "Critical",
//     route: "ipdPatient360",
//     admissionId: summary.admissionId
//   }));
//   return tasks;
// }

// function deriveNotifications(data = deriveOperationalData()) {
//   const thresholds = automationSettingsForScope();
//   if (!thresholds.reminderNotificationsEnabled) return [];
//   const notices = [];
//   const add = (condition, item) => {
//     if (condition) notices.push({ time: "Now", read: false, ...item });
//   };
//   data.queue.slice(0, 6).forEach((token) => add(minutesSince(recordTime(token)) >= thresholds.queueWaitingMinutes, {
//     title: "Queue wait threshold reached",
//     message: `${token.patientName || token.patientId} has been waiting ${minutesSince(recordTime(token))} minutes in OPD queue.`,
//     module: "Queue",
//     category: "Queue",
//     priority: minutesSince(recordTime(token)) >= thresholds.queueWaitingMinutes * 2 ? "critical" : "warning",
//     route: "queue",
//     patientId: token.patientId,
//     time: formatDateTime(recordTime(token))
//   }));
//   data.labOrders.filter((order) => order.status === "Report Ready").slice(0, 6).forEach((order) => add(true, {
//     title: "Lab report ready",
//     message: `${order.tests || order.orderType || "Report"} is ready for doctor review.`,
//     module: order.orderType || "Lab",
//     category: "Lab",
//     priority: "info",
//     route: order.orderType === "Radiology" ? "radiology" : "lab",
//     patientId: order.patientId,
//     time: formatDateTime(recordTime(order))
//   }));
//   data.labOrders.filter((order) => isPendingStatus(order.status, ["Report Ready", "Doctor Reviewed", "Completed"])).slice(0, 8).forEach((order) => {
//     const isRadiology = String(order.orderType || "").toLowerCase().includes("radiology");
//     const threshold = isRadiology ? thresholds.radiologyPendingMinutes : thresholds.labPendingMinutes;
//     const delay = minutesSince(recordTime(order));
//     add(delay >= threshold, {
//     title: `${isRadiology ? "Radiology" : "Lab"} processing delayed`,
//     message: `${order.tests || order.orderType || "Report"} is pending beyond ${threshold} minutes.`,
//     module: order.orderType || "Lab",
//     category: isRadiology ? "Radiology" : "Lab",
//     priority: severityForDelay(delay, threshold),
//     route: order.orderType === "Radiology" ? "radiology" : "lab",
//     patientId: order.patientId,
//     mrn: order.mrn,
//     delayMinutes: delay,
//     assignedRole: isRadiology ? "Radiology User" : "Lab User",
//     recommendedAction: isRadiology ? "Upload the radiology report or mark the report ready." : "Collect sample, upload the lab report, or mark the report ready.",
//     automationKey: `report-delay-${order.id || order._id || order.patientId}-${order.orderType || "lab"}`,
//     time: formatDateTime(recordTime(order))
//     });
//   });
//   data.labOrders.filter((order) => isPendingStatus(order.status, ["Report Ready", "Doctor Reviewed", "Completed"]) && minutesSince(recordTime(order)) >= thresholds.reportUploadDelayMinutes).slice(0, 6).forEach((order) => add(true, {
//     title: "Report upload delayed",
//     message: `${order.tests || order.orderType || "Report"} still needs upload or ready marking.`,
//     module: order.orderType || "Lab",
//     category: order.orderType === "Radiology" ? "Radiology" : "Lab",
//     priority: severityForDelay(minutesSince(recordTime(order)), thresholds.reportUploadDelayMinutes),
//     route: order.orderType === "Radiology" ? "radiology" : "lab",
//     patientId: order.patientId,
//     mrn: order.mrn,
//     delayMinutes: minutesSince(recordTime(order)),
//     assignedRole: order.orderType === "Radiology" ? "Radiology User" : "Lab User",
//     recommendedAction: "Upload the final report and mark it ready for doctor review.",
//     automationKey: `report-upload-delay-${order.id || order._id || order.patientId}`
//   }));
//   data.pharmacyIssues.filter((issue) => issue.status !== "Issued").slice(0, 6).forEach((issue) => add(minutesSince(recordTime(issue)) >= thresholds.pharmacyPendingMinutes, {
//     title: "Prescription pending issue",
//     message: `${issue.patientName || issue.patientId} has medicines pending beyond ${thresholds.pharmacyPendingMinutes} minutes.`,
//     module: "Pharmacy",
//     category: "Pharmacy",
//     priority: "warning",
//     route: "pharmacy",
//     patientId: issue.patientId,
//     time: formatDateTime(recordTime(issue))
//   }));
//   data.bills.filter((bill) => bill.status !== "Paid").slice(0, 6).forEach((bill) => add(minutesSince(recordTime(bill)) >= thresholds.billingPendingMinutes, {
//     title: "Bill unpaid",
//     message: `${bill.patientName || bill.patientId} has a pending bill beyond ${thresholds.billingPendingMinutes} minutes.`,
//     module: "Billing",
//     category: "Billing",
//     priority: "warning",
//     route: "billing",
//     patientId: bill.patientId,
//     time: formatDateTime(recordTime(bill))
//   }));
//   safeOptionalData(() => permitted("mar") ? api.medicationAdministrationRecords(currentUser) : [], []).filter((item) => item.status === "Scheduled").slice(0, 6).forEach((item) => add(minutesSince(item.scheduledTime || item.createdAt) >= thresholds.marDueMinutes, {
//     title: "MAR dose pending",
//     message: `${item.medicineName || item.drugName || "Medication"} is due or overdue for administration.`,
//     module: "MAR",
//     category: "Clinical",
//     priority: "warning",
//     route: "mar",
//     patientId: item.patientId,
//     admissionId: item.admissionId,
//     time: formatDateTime(item.scheduledTime || item.createdAt)
//   }));
//   data.dischargePlans.filter((plan) => plan.status !== "Ready for Discharge").slice(0, 4).forEach((plan) => add(minutesSince(recordTime(plan)) >= thresholds.dischargeClearanceMinutes, {
//     title: "Discharge clearance pending",
//     message: `Admission ${plan.admissionId || plan.patientId} still needs department clearance after ${thresholds.dischargeClearanceMinutes} minutes.`,
//     module: "Discharge",
//     category: "Discharge",
//     priority: severityForDelay(minutesSince(recordTime(plan)), thresholds.dischargeClearanceMinutes),
//     route: "discharge",
//     admissionId: plan.admissionId,
//     patientId: plan.patientId,
//     delayMinutes: minutesSince(recordTime(plan)),
//     assignedRole: "Discharge Team",
//     recommendedAction: "Review doctor, nursing, pharmacy, billing, document, and summary clearances.",
//     automationKey: `discharge-delay-${plan.id || plan.admissionId || plan.patientId}`
//   }));
//   data.deathSummaries.filter((summary) => ["Submitted", "Submitted for Review"].includes(summary.status)).slice(0, 4).forEach((summary) => add(true, {
//     title: "Death Summary waiting for approval",
//     message: `${summary.patientName || summary.admissionId} requires clinical review.`,
//     module: "Death Summary",
//     category: "Clinical",
//     priority: "critical",
//     route: "ipdPatient360",
//     admissionId: summary.admissionId
//   }));
//   data.documents.filter((doc) => isToday(doc.createdAt || doc.uploadedAt)).slice(0, 5).forEach((doc) => add(true, {
//     title: "Document uploaded",
//     message: `${doc.originalFilename || doc.fileName || doc.documentType} was added.`,
//     module: "Documents",
//     category: "Documents",
//     priority: "info",
//     route: "documents",
//     time: formatDateTime(doc.createdAt || doc.uploadedAt)
//   }));
//   data.users.filter((user) => Number(user.sensitivePermissionsCount || 0) > 0 || String(user.reviewStatus || "").includes("Required")).slice(0, 5).forEach((user) => add(true, {
//     title: "Permission review needed",
//     message: `${user.name || user.email} has sensitive or pending access review.`,
//     module: "Governance",
//     category: "Permission",
//     priority: "warning",
//     route: "accessReview"
//   }));
//   const providers = data.providers ? [data.providers.mongodb, data.providers.email, data.providers.storage, data.providers.sentry, data.providers.betterStack].filter(Boolean) : [];
//   providers.forEach((provider) => add(/error|not configured/i.test(provider.status || ""), {
//     title: "Provider attention needed",
//     message: `${provider.name || "Provider"} is ${provider.status || "not configured"}.`,
//     module: "Providers",
//     category: "System",
//     priority: "critical",
//     route: "backup"
//   }));
//   data.documents.filter((doc) => minutesSince(recordTime(doc)) >= thresholds.documentReadinessMinutes && /pending|draft|missing/i.test(doc.status || doc.readinessStatus || "")).slice(0, 4).forEach((doc) => add(true, {
//     title: "Document readiness delayed",
//     message: `${doc.documentType || doc.originalFilename || "Document"} needs completion or readiness review.`,
//     module: "Documents",
//     category: "Documents",
//     priority: severityForDelay(minutesSince(recordTime(doc)), thresholds.documentReadinessMinutes),
//     route: "documents",
//     patientId: doc.patientId,
//     admissionId: doc.admissionId,
//     delayMinutes: minutesSince(recordTime(doc)),
//     assignedRole: "Documents Owner",
//     recommendedAction: "Upload the missing file, finalize the draft, or mark the document ready.",
//     automationKey: `document-readiness-${doc.id || doc._id || doc.patientId || doc.admissionId}`
//   }));
//   const checklist = goLiveChecklistForScope();
//   if (checklist?.items?.length) {
//     checklist.items.filter((item) => !item.completed && item.critical !== false).slice(0, 5).forEach((item) => add(true, {
//       title: "Go-live checklist gap",
//       message: `${item.label || "Checklist item"} is not complete.`,
//       module: "Go-live",
//       category: "System",
//       priority: "high",
//       route: "setup",
//       assignedRole: currentUser.role === ROLES.SUPER_ADMIN ? "Super Admin" : currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital Admin" : "Branch Admin",
//       recommendedAction: item.action || "Open the go-live checklist and complete the required item.",
//       automationKey: `go-live-gap-${item.key || item.label}`
//     }));
//   }
//   return notices;
// }

// function automationAlerts(data = deriveOperationalData()) {
//   return deriveNotifications(data)
//     .filter((item) => ["medium", "high", "critical", "warning"].includes(String(item.priority || "").toLowerCase()))
//     .map((item) => ({
//       patient: patientName(data.patients, item.patientId, item.patientId || item.admissionId || "-"),
//       mrn: item.mrn || data.patients.find((patient) => String(patient.id) === String(item.patientId))?.mrn || "-",
//       module: item.module || item.category || "Operations",
//       branch: item.branchName || data.branches.find((branch) => String(branch.id) === String(item.branchId || currentUser.branchId))?.name || currentUser.branchName || "Current scope",
//       status: item.title || "Needs attention",
//       delay: item.delayMinutes !== undefined ? delayLabel(item.delayMinutes) : "Now",
//       recommendedAction: item.recommendedAction || item.message || "Review the linked workflow.",
//       assignedRole: item.assignedRole || "Responsible team",
//       severity: String(item.priority || "medium").toLowerCase(),
//       route: item.route || "alerts",
//       patientId: item.patientId,
//       admissionId: item.admissionId
//     }));
// }

// function automationList(title, subtitle, items = [], emptyMessage = "No pending work is visible for your role.", options = {}) {
//   const { group = false, showMessage = false } = options;
//   let list = items;
//   if (group) {
//     const grouped = new Map();
//     for (const item of items) {
//       const key = `${item.title}|${item.module || ""}`;
//       if (grouped.has(key)) grouped.get(key).count += 1;
//       else grouped.set(key, { ...item, count: 1 });
//     }
//     list = [...grouped.values()];
//   }
//   const totalLabel = group ? `${list.length} type${list.length === 1 ? "" : "s"}` : `${items.length} visible`;
//   return `
//     <section class="panel automation-panel">
//       <div class="panel-head">
//         <div><h3>${escapeHtml(title)}</h3>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}</div>
//         <span class="badge ${list.length ? "risk-medium" : "status-active"}">${escapeHtml(totalLabel)}</span>
//       </div>
//       ${list.length ? `<div class="automation-list">${list.slice(0, 8).map((item) => {
//         const count = item.count || 1;
//         const meta = count > 1
//           ? `${item.module || "Alerts"} · ${count} items need attention`
//           : (showMessage && item.message ? item.message : [item.module, item.assignedTo, item.due].filter(Boolean).join(" / "));
//         return `
//         <button class="automation-card" type="button" data-route="${escapeHtml(item.route || "tasks")}" ${item.patientId ? `data-patient-id="${escapeHtml(item.patientId)}"` : ""} ${item.admissionId ? `data-admission-id="${escapeHtml(item.admissionId)}"` : ""}>
//           <span class="card-top"><span class="badge ${riskClass(item.priority || "Medium")}">${escapeHtml(item.priority || item.module || "Task")}</span>${count > 1 ? `<span class="badge count-badge">×${count}</span>` : ""}</span>
//           <strong>${escapeHtml(item.title)}</strong>
//           <small>${escapeHtml(meta)}</small>
//         </button>`;
//       }).join("")}</div>` : emptyState(emptyMessage)}
//     </section>
//   `;
// }

// function automationAlertsPanel(alerts = []) {
//   return `
//     <section class="panel wide" data-testid="automation-alert-table">
//       <div class="panel-head">
//         <h3>Escalation and Delay Alerts</h3>
//         <span class="badge ${alerts.length ? "risk-high" : "status-active"}">${alerts.length} active</span>
//       </div>
//       ${alerts.length ? table(["Patient / Ref", "MRN", "Module", "Branch", "Status", "Delay", "Owner", "Severity", "Recommended action"], alerts.slice(0, 12).map((alert) => [
//         alert.patient,
//         alert.mrn,
//         alert.module,
//         alert.branch,
//         alert.status,
//         alert.delay,
//         alert.assignedRole,
//         badge(alert.severity, riskClass(alert.severity)),
//         alert.recommendedAction
//       ])) : emptyState("No threshold alerts are active for your visible scope.")}
//     </section>
//   `;
// }

// function permissionRiskAlerts(users = []) {
//   const alerts = [];
//   users.forEach((user) => {
//     const text = `${user.jobRole || ""} ${user.allowedModules || ""} ${user.allowedPages || ""}`.toLowerCase();
//     const inactiveDays = user.lastLogin ? Math.floor((Date.now() - new Date(user.lastLogin).getTime()) / 86400000) : null;
//     if (inactiveDays !== null && inactiveDays >= 30) alerts.push([user, "Inactive for 30+ days", "Review whether access is still required."]);
//     if (Number(user.sensitivePermissionsCount || 0) > 0) alerts.push([user, "High-risk permission", "Confirm sensitive actions and export rights."]);
//     if (text.includes("doctor") && text.includes("billing")) alerts.push([user, "Doctor has billing access", "Separate clinical and billing admin duties where possible."]);
//     if (text.includes("billing") && text.includes("admin")) alerts.push([user, "Billing user has admin access", "Review elevated access before next audit."]);
//     if (String(user.branchName || "").toLowerCase().includes("multiple") || text.includes("cross-branch")) alerts.push([user, "Cross-branch access", "Confirm this user requires multi-branch visibility."]);
//   });
//   return alerts;
// }

// function permissionRiskPanel(users = []) {
//   const alerts = permissionRiskAlerts(users);
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Permission Review Automation</h3><p>Advisory governance alerts only. No permission is changed automatically.</p></div>
//       ${alerts.length ? table(["User", "Risk", "Recommended action"], alerts.slice(0, 12).map(([user, risk, action]) => [
//         user.name || user.email,
//         badge(risk, risk.includes("High") || risk.includes("Cross") ? "risk-high" : "risk-medium"),
//         action
//       ])) : emptyState("No risky permission patterns are visible for this scope.")}
//     </section>
//   `;
// }

// function roleSmartCards(data = deriveOperationalData()) {
//   const jobRole = String(currentUser.jobRole || "");
//   if (currentUser.role === ROLES.SUPER_ADMIN) {
//     const dashboard = normalizeDashboardData(api.dashboard(currentUser));
//     return [
//       ["Total hospitals", dashboard.metrics.totalHospitals, "Platform customers"],
//       ["Active hospitals", dashboard.metrics.activeHospitals, "Live tenants"],
//       ["Subscription status", `${dashboard.hospitals.filter((h) => h.plan).length} assigned`, "Plans configured"],
//       ["Provider health", deriveNotifications(data).filter((n) => n.module === "Providers").length ? "Needs review" : "Connected", "MongoDB/R2/email/observability"],
//       ["Recent audit events", permitted("audit") ? safeOptionalData(() => api.auditLogs(currentUser)).length : 0, "Visible trail"],
//       ["Governance alerts", permissionRiskAlerts(data.users).length, "Access review"]
//     ];
//   }
//   if (currentUser.role === ROLES.HOSPITAL_ADMIN) {
//     return [
//       ["Hospital overview", data.branches.length, "Branches visible"],
//       ["IPD overview", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active admissions"],
//       ["Finance summary", data.bills.filter((b) => b.status !== "Paid").length, "Pending bills"],
//       ["Compliance", permissionRiskAlerts(data.users).length, "Access reviews"],
//       ["Reports", data.labOrders.length + data.dischargePlans.length, "Clinical signals"],
//       ["Branch performance", setupPercent(), "Setup complete"]
//     ];
//   }
//   if (currentUser.role === ROLES.BRANCH_ADMIN) {
//     return [
//       ["Appointments", data.appointments.filter((a) => isToday(a.date || a.createdAt)).length || data.appointments.length, "Booked"],
//       ["Admissions", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active IPD"],
//       ["Billing pending", data.bills.filter((b) => b.status !== "Paid").length, "Needs collection"],
//       ["Stock alerts", safeOptionalData(() => permitted("stock") ? api.medicineStocks(currentUser) : []).filter((s) => Number(s.quantityAvailable || s.quantity || 0) <= Number(s.reorderLevel || 0)).length, "Low stock"],
//       ["Daily IPD report", data.dischargePlans.length, "Discharge watch"],
//       ["Bed occupancy", data.beds.length ? `${Math.round((data.beds.filter((bed) => bed.status === "Occupied").length / data.beds.length) * 100)}%` : "0%", "Current"]
//     ];
//   }
//   if (jobRole.includes("Reception")) return [
//     ["Today's appointments", data.appointments.filter((a) => isToday(a.date || a.createdAt)).length || data.appointments.length, "Booked"],
//     ["Walk-ins", data.appointments.filter((a) => String(a.source || "").includes("Walk")).length, "Arrivals"],
//     ["Pending check-ins", data.appointments.filter((a) => ["Booked", "Active"].includes(a.status || "Active")).length, "Reception"],
//     ["OPD queue", data.queue.length, "Waiting"],
//     ["Recent patients", data.patients.slice(0, 20).length, "Registered"]
//   ];
//   if (jobRole.includes("Duty Doctor")) return [
//     ["Emergency cases", data.alerts.filter((alert) => ["Critical", "High"].includes(alert.risk || alert.priority)).length, "Escalated"],
//     ["IPD patients", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active"],
//     ["IPD vitals pending", safeOptionalData(() => permitted("ipdVitals") ? api.ipdVitals(currentUser) : []).filter((v) => v.status === "Abnormal").length, "Review"],
//     ["Discharge pending", data.dischargePlans.filter((p) => p.status !== "Ready for Discharge").length, "Clearances"],
//     ["Handover pending", safeOptionalData(() => permitted("handover") ? api.doctorHandovers(currentUser) : []).filter((h) => h.status !== "Accepted").length, "Shift"]
//   ];
//   if (jobRole.includes("Doctor")) return [
//     ["Waiting patients", data.queue.length, "Doctor queue"],
//     ["Vitals completed", data.vitals.length, "Ready"],
//     ["Pending consultations", Math.max(data.queue.length - data.consultations.length, 0), "To complete"],
//     ["Reports ready", data.labOrders.filter((o) => o.status === "Report Ready").length, "Review"],
//     ["IPD assigned", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active"]
//   ];
//   if (jobRole.includes("Nurse")) return [
//     ["Waiting vitals", deriveTasks(data).filter((t) => t.module === "Vitals").length, "To record"],
//     ["Assigned IPD patients", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Under care"],
//     ["Pending MAR", safeOptionalData(() => permitted("mar") ? api.medicationAdministrationRecords(currentUser) : []).filter((m) => m.status === "Scheduled").length, "Due"],
//     ["Intake/output pending", data.admissions.length, "Review"],
//     ["Daily sheets due", safeOptionalData(() => permitted("dailySheets") ? api.dailyPatientSheets(currentUser) : []).filter((s) => !["Nurse Updated", "Completed", "Verified"].includes(s.status)).length, "Today"],
//     ["My tasks", deriveTasks(data).length, "Visible"]
//   ];
//   if (jobRole.includes("Lab") || jobRole.includes("Radiology")) return [
//     ["Pending lab orders", data.labOrders.filter((o) => isPendingStatus(o.status, ["Report Ready", "Doctor Reviewed"])).length, "Open"],
//     ["Samples pending", data.labOrders.filter((o) => /sample|ordered|pending/i.test(o.status || "")).length, "Collection"],
//     ["Reports pending upload", data.labOrders.filter((o) => o.status !== "Report Ready").length, "Documents"],
//     ["Completed today", data.labOrders.filter((o) => o.status === "Report Ready" && isToday(recordTime(o))).length, "Ready"]
//   ];
//   if (jobRole.includes("Pharmacy")) return [
//     ["Pending prescriptions", data.pharmacyIssues.filter((i) => i.status !== "Issued").length, "Issue"],
//     ["Medicines pending issue", data.pharmacyIssues.filter((i) => i.status !== "Issued").length, "Queue"],
//     ["Low stock alerts", safeOptionalData(() => permitted("stock") ? api.medicineStocks(currentUser) : []).filter((s) => Number(s.quantityAvailable || 0) <= Number(s.reorderLevel || 0)).length, "Inventory"],
//     ["Issued today", data.pharmacyIssues.filter((i) => i.status === "Issued" && isToday(recordTime(i))).length, "Done"]
//   ];
//   if (jobRole.includes("Billing")) return [
//     ["Unpaid bills", data.bills.filter((b) => b.status !== "Paid").length, "Collect"],
//     ["Pending payments", data.bills.filter((b) => b.status !== "Paid").length, "Open"],
//     ["IPD clearances", data.dischargePlans.filter((p) => !p.billingClearance).length, "Discharge"],
//     ["Charges pending", deriveBillingSuggestions(data).length, "Review"]
//   ];
//   return [
//     ["My tasks", deriveTasks(data).length, "Visible"],
//     ["Notifications", deriveNotifications(data).length, "Unread signals"],
//     ["Patients", data.patients.length, "Scope"],
//     ["Open bills", data.bills.filter((b) => b.status !== "Paid").length, "Billing"]
//   ];
// }

// function setupPercent() {
//   const progress = safeOptionalData(() => permitted("setup") ? api.setupProgress(currentUser)[0] : null, null);
//   return `${inferredSetupProgress(progress || {}).percent}%`;
// }

// function roleDashboardPanel(data = deriveOperationalData()) {
//   const cards = roleSmartCards(data);
//   return `
//     <section class="panel wide">
//       <div class="panel-head"><h3>Today's Work</h3></div>
//       <div class="metric-grid small">
//         ${cards.map(([label, value, note]) => metricCard(label, value ?? 0, note)).join("")}
//       </div>
//     </section>
//   `;
// }

// function missingDocumentAlerts({ documents = [], admission = null, patient = null, deathSummary = null, labOrders = [], bills = [] } = {}) {
//   const hasType = (type) => documents.some((doc) => String(doc.documentType || doc.type || "").toLowerCase() === type);
//   const alerts = [];
//   if (admission && !hasType("consent")) alerts.push(["Consent form missing", "Upload consent before major procedures or discharge readiness review."]);
//   if (patient?.insurance && !hasType("insurance")) alerts.push(["Insurance paper missing", "Claims may be delayed without insurance documents."]);
//   if (admission && ["Discharged", "Ready for Discharge"].includes(ipdAdmissionStatus(admission)) && !hasType("discharge-summary")) alerts.push(["Discharge summary not attached", "Attach the final approved discharge summary."]);
//   if (isDeathOutcome(admission || {}) && (!deathSummary || deathSummary.status !== "Approved")) alerts.push(["Death summary not approved", "Complete the reviewed death summary before final export."]);
//   if (labOrders.some((order) => order.status === "Report Ready") && !documents.some((doc) => ["lab-report", "radiology-report"].includes(doc.documentType))) alerts.push(["Lab report pending upload", "Attach report documents after report readiness."]);
//   if (bills.some((bill) => bill.status === "Paid") && !hasType("billing-document")) alerts.push(["Billing document missing", "Upload bill or receipt document for the patient file."]);
//   return alerts;
// }

// function documentAlertsPanel(alerts = []) {
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Missing Document Alerts</h3><p>Advisory checks from visible document metadata.</p></div>
//       ${alerts.length ? `<div class="alert-list">${alerts.map(([title, message]) => `
//         <div class="alert-card compact-alert">
//           <div>${badge("Missing", "risk-medium")}<h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>
//           ${canAccessPage(currentUser, "documents") ? `<button class="button tiny soft" type="button" data-route="documents">Open documents</button>` : ""}
//         </div>
//       `).join("")}</div>` : emptyState("No required document gaps are visible for this scope.")}
//     </section>
//   `;
// }

// function deriveBillingSuggestions(data = deriveOperationalData()) {
//   const suggestions = [];
//   data.consultations.forEach((item) => {
//     const amount = Number(item.consultationFee || 0) + Number(item.labCharges || 0) + Number(item.radiologyCharges || 0) + Number(item.pharmacyAmount || 0);
//     if (amount > 0) suggestions.push({ source: "Consultation", patientId: item.patientId, patientName: patientName(data.patients, item.patientId, item.patientId), item: item.diagnosis || "OPD consultation", amount });
//   });
//   data.labOrders.filter((item) => item.status !== "Billed").forEach((item) => suggestions.push({ source: item.orderType || "Lab", patientId: item.patientId, patientName: patientName(data.patients, item.patientId, item.patientId), item: item.tests || "Investigation", amount: Number(item.amount || item.charges || 0) }));
//   data.pharmacyIssues.filter((item) => item.status === "Issued").forEach((item) => suggestions.push({ source: "Pharmacy", patientId: item.patientId, patientName: item.patientName || patientName(data.patients, item.patientId, item.patientId), item: item.medicines || "Medicines", amount: Number(item.amount || 0) }));
//   data.admissions.filter((item) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(item))).forEach((item) => suggestions.push({ source: "IPD", patientId: admissionPatientId(item), patientName: item.patientName || admissionPatientId(item), item: `${item.ward || "Ward"} bed charges`, amount: Number(item.bedCharges || 0) }));
//   return suggestions.filter((item) => Number(item.amount || 0) >= 0).slice(0, 12);
// }

// function smartBillingDraftPanel(data = deriveOperationalData()) {
//   const suggestions = deriveBillingSuggestions(data);
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Smart Billing Draft</h3><p>Suggested charges from visible workflow records. Billing staff must review and generate the final bill.</p></div>
//       ${suggestions.length ? table(["Patient", "Source", "Suggested item", "Amount"], suggestions.map((item) => [
//         item.patientName,
//         item.source,
//         item.item,
//         `Rs. ${money(item.amount)}`
//       ])) : emptyState("No unbilled workflow charges are visible right now.")}
//       <div class="notice subtle">Suggestions are draft-only and never finalized without a billing user action.</div>
//     </section>
//   `;
// }

// function queueDelayAlerts(queue = [], vitals = [], consultations = [], bills = []) {
//   const alerts = [];
//   queue.forEach((token) => {
//     const wait = Number(token.waitingMinutes ?? minutesSince(recordTime(token)) ?? 0);
//     const patient = token.patientName || token.patientId;
//     const hasVitals = vitals.some((item) => String(item.patientId) === String(token.patientId));
//     const hasConsultation = consultations.some((item) => String(item.patientId) === String(token.patientId));
//     const billPending = bills.some((item) => String(item.patientId) === String(token.patientId) && item.status !== "Paid");
//     if (wait > 30 && !hasConsultation) alerts.push(["Patient waiting more than 30 minutes", `${patient} has waited ${wait} minutes.`, "High", "queue", token.patientId]);
//     if (wait > 15 && !hasVitals) alerts.push(["Vitals pending more than 15 minutes", `${patient} needs vitals before doctor review.`, "Medium", "vitals", token.patientId]);
//     if (billPending) alerts.push(["Billing pending too long", `${patient} has a pending payment before checkout.`, "Medium", "billing", token.patientId]);
//   });
//   if (queue.filter((token) => !consultations.some((item) => String(item.patientId) === String(token.patientId))).length > 8) {
//     alerts.push(["Doctor queue overloaded", "More than 8 patients are waiting for consultation.", "High", "consultation", ""]);
//   }
//   return alerts;
// }

// function queueDelayPanel(alerts = []) {
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Smart Queue Delay Alerts</h3><p>Advisory queue signals based on visible timestamps and waiting minutes.</p></div>
//       ${alerts.length ? `<div class="alert-list">${alerts.map(([title, message, risk, route, patientId]) => `
//         <div class="alert-card compact-alert">
//           <div>${badge(risk, riskClass(risk))}<h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>
//           ${canAccessPage(currentUser, route) ? `<button class="button tiny soft" type="button" data-route="${escapeHtml(route)}" ${patientId ? `data-patient-id="${escapeHtml(patientId)}"` : ""}>Open</button>` : ""}
//         </div>
//       `).join("")}</div>` : emptyState("No queue delay alerts are visible right now.")}
//     </section>
//   `;
// }

// function dashboardPage() {
//   const data = normalizeDashboardData(api.dashboard(currentUser));
//   const operationalData = deriveOperationalData();
//   const patientVolumeSeries = dateSeriesFromRows(
//     [...operationalData.appointments, ...operationalData.admissions],
//     () => 1,
//     (row) => row.date || row.createdAt || row.admissionDateTime || row.updatedAt
//   );
//   const m = data.metrics;
//   const role = currentUser.role;
//   const title =
//     role === ROLES.SUPER_ADMIN ? "Platform health and hospital risk" :
//     role === ROLES.HOSPITAL_ADMIN ? "Hospital group operations" :
//     role === ROLES.BRANCH_ADMIN ? "Branch operations today" :
//     "My work and assigned records";

//   const cards = role === ROLES.SUPER_ADMIN
//     ? [
//         ["Total Hospitals", m.totalHospitals, "Active: " + m.activeHospitals],
//         ["Total Branches", m.totalBranches, "Across platform"],
//         ["Total Users", m.totalUsers, "All accounts"],
//         ["Uploaded Records", m.uploadedRecords, "Tenant-scoped"],
//         ["Storage Used", formatGb(m.storageUsedGb), "Across hospitals"],
//         ["Critical Alerts", m.criticalAlerts, "Needs support review"]
//       ]
//     : [
//         ["Today Appointments", m.todayAppointments, "Booked and arrived"],
//         ["Waiting Patients", m.waitingPatients, "Queue now"],
//         ["In Consultation", m.inConsultation, "With doctor"],
//         ["Pending Bills", m.pendingBills, "Needs collection"],
//         ["Pharmacy Pending", m.pharmacyPending, "Prescriptions"],
//         ["Lab Reports Pending", m.labReportsPending, "Orders in progress"],
//         ["Patient Volume", money(m.patientVolume), "Today"],
//         ["Average Wait Time", `${m.averageWait} min`, "Across visible records"],
//         ["Bed Occupancy", `${m.bedOccupancy}%`, "Current"],
//         ["Staff Utilization", `${m.staffUtilization}%`, "Roster load"],
//         ["Open Alerts", m.openAlerts, "Operational risk"],
//         ["Overdue Tasks", m.overdueTasks, "Needs action"]
//       ];

//   return `
//     <div class="section-head">
//       <div>
//         <h2>${title}</h2>
//       </div>
//       <div class="filter-row compact">
//         <select><option>Last 30 days</option><option>Today</option><option>This week</option></select>
//         <select><option>All departments</option><option>Emergency</option><option>OPD</option><option>ICU</option></select>
//       </div>
//     </div>
//     <div class="metric-grid">
//       ${cards.map(([label, value, note]) => metricCard(label, value, note)).join("")}
//     </div>
//     ${roleDashboardPanel(operationalData)}
//     ${automationAlertsPanel(automationAlerts(operationalData))}
//     <div class="dashboard-grid compact-dashboard">
//       ${attentionPanel(data)}
//       ${quickActionsPanel(role)}
//     </div>
//     <div class="dashboard-grid compact-dashboard">
//       <div data-testid="role-work-queue">
//         ${automationList("Role-Based Work Queue", "", roleWorkQueue(operationalData))}
//       </div>
//       ${automationList("Smart Notifications", "", deriveNotifications(operationalData), "No notifications are visible for your role right now.", { group: true, showMessage: true })}
//     </div>
//     <div class="dashboard-grid">
//       <section class="panel wide">
//         <div class="panel-head">
//           <h3>Patient volume and wait time trend</h3>
//           <span class="badge status-active">Live</span>
//         </div>
//         ${trendChart(
//           patientVolumeSeries.values.length ? patientVolumeSeries.values : [Math.max(Number(m.patientVolume || 0), 0)],
//           patientVolumeSeries.labels.length ? patientVolumeSeries.labels : [localDateKey().slice(5)]
//         )}
//       </section>
//       <section class="panel">
//         <div class="panel-head"><h3>Risk summary</h3></div>
//         ${riskSummary(data.alerts)}
//       </section>
//       <section class="panel">
//         <div class="panel-head"><h3>Task status</h3></div>
//         ${taskStatus(data.tasks)}
//       </section>
//       <section class="panel wide">
//         <div class="panel-head">
//           <h3>${role === ROLES.SUPER_ADMIN ? "High-risk hospitals" : "Branch comparison"}</h3>
//           <button class="button small" type="button" data-route="${role === ROLES.SUPER_ADMIN ? "hospitals" : "branches"}">View details</button>
//         </div>
//         ${comparisonTable(data)}
//       </section>
//     </div>
//   `;
// }

// function attentionPanel(data) {
//   const items = [
//     ["Critical alerts", data.alerts.filter((alert) => ["Critical", "High"].includes(alert.risk)).length, "alerts", "Review now"],
//     ["Billing pending", data.metrics.pendingBills, "billing", "Collect payment"],
//     ["Lab reports pending", data.metrics.labReportsPending, "lab", "Follow up"],
//     ["Low stock / pharmacy", data.metrics.pharmacyPending, "pharmacy", "Issue or restock"],
//     ["Overdue tasks", data.metrics.overdueTasks, "tasks", "Assign owner"]
//   ].filter(([, value]) => Number(value) > 0);
//   return `
//     <section class="panel attention-panel">
//       <div class="panel-head">
//         <h3>What needs attention</h3>
//       </div>
//       ${items.length ? `<div class="attention-list">${items.map(([label, value, route, action]) => `
//         <button class="attention-item" type="button" data-route="${route}">
//           <span>${escapeHtml(label)}</span>
//           <strong>${escapeHtml(value)}</strong>
//           <small>${escapeHtml(action)}</small>
//         </button>
//       `).join("")}</div>` : emptyState("Nothing urgent right now. Operations look healthy for your visible scope.")}
//     </section>
//   `;
// }

// function quickActionsPanel(role) {
//   const jobRole = String(currentUser.jobRole || "");
//   const branchUserActions =
//     jobRole.includes("Reception") ? [["Register Patient", "patients"], ["Book Appointment", "appointments"], ["Check In Patient", "queue"], ["Billing before checkout", "billing"], ["Search Patient", "globalSearch"]] :
//     jobRole.includes("Duty Doctor") ? [["Open Duty Doctor", "dutyDoctor"], ["Record IPD Vitals", "ipdVitals"], ["Add Doctor Note", "dutyDoctor"], ["Start Discharge Planning", "discharge"], ["Open Handover", "handover"]] :
//     jobRole.includes("Doctor") ? [["Start Consultation", "consultation"], ["Add Prescription", "consultation"], ["Order Lab", "lab"], ["Order Radiology", "radiology"], ["Request Admission", "admissions"], ["Start Discharge Planning", "discharge"], ["Follow-ups", "followups"]] :
//     jobRole.includes("Nurse") ? [["Record Vitals", "ipdVitals"], ["Mark MAR Given", "mar"], ["Add Nursing Note", "nursing"], ["Add Handover", "handover"], ["Record Intake/Output", "intakeOutput"], ["View My Tasks", "tasks"]] :
//     jobRole.includes("Billing") ? [["Generate Bill", "billing"], ["Collect Payment", "billing"], ["Mark Billing Clearance", "discharge"], ["Print Receipt", "billing"], ["Checkout", "checkout"]] :
//     jobRole.includes("Pharmacy") ? [["Issue Medicine", "pharmacy"], ["Mark Unavailable", "pharmacy"], ["Raise Stock-Low Alert", "stock"], ["View Low Stock", "stock"], ["Open Stock", "stock"]] :
//     jobRole.includes("Lab") ? [["Mark Sample Collected", "lab"], ["Upload Report", "lab"], ["Mark Report Ready", "lab"], ["Pending Orders", "lab"]] :
//     jobRole.includes("Radiology") ? [["Open Radiology Orders", "radiology"], ["Upload Report", "radiology"], ["Mark Report Ready", "radiology"]] :
//     jobRole.includes("Claim") ? [["Review Claim Documents", "claims"], ["Pending Claims", "claims"], ["Open Documents", "documents"]] :
//     jobRole.includes("Inventory") ? [["Open Stock", "stock"], ["Inventory", "inventory"], ["Purchase Requests", "purchase"], ["Alerts", "alerts"]] :
//     jobRole.includes("Quality") || jobRole.includes("Incident") ? [["Feedback", "feedback"], ["Incidents", "incidents"], ["Tasks", "tasks"], ["Alerts", "alerts"]] :
//     [["My Work", "dashboard"], ["Tasks", "tasks"], ["Alerts", "alerts"]];
//   const actionsByRole = {
//     [ROLES.SUPER_ADMIN]: [["Hospitals", "hospitals"], ["Provider Health", "settings"], ["Backup Requests", "backup"], ["Subscription Plans", "subscriptions"], ["Platform Audit", "audit"]],
//     [ROLES.HOSPITAL_ADMIN]: [["Open IPD Overview", "ipd"], ["Open Reports", "reports"], ["Open Finance", "finance"], ["Open Compliance", "compliance"]],
//     [ROLES.BRANCH_ADMIN]: [["Review Access", "accessReview"], ["Clone Permissions", "permissionTemplates"], ["Open Go-Live Checklist", "setup"], ["Review Branch Alerts", "alerts"], ["Admit Patient", "admissions"], ["Open Daily IPD Report", "ipdReports"]],
//     [ROLES.BRANCH_USER]: branchUserActions
//   };
//   return `
//     <section class="panel quick-panel">
//       <div class="panel-head">
//         <h3>Quick actions</h3>
//       </div>
//       <div class="quick-grid">
//         ${(actionsByRole[role] || []).filter(([, route]) => canAccessPage(currentUser, route)).map(([label, route]) => `
//           <button class="quick-action" type="button" data-route="${route}" aria-label="${escapeHtml(label)}">
//             <span class="quick-action-icon">${navIcon(route)}</span>
//             <span class="quick-action-copy">
//               <strong>${escapeHtml(label)}</strong>
//               <small>${escapeHtml(actionIcon(label))}</small>
//             </span>
//             <span class="quick-action-arrow" aria-hidden="true">↗</span>
//           </button>
//         `).join("") || emptyState("No quick actions assigned for this role.")}
//       </div>
//     </section>
//   `;
// }

// function groupSearchResults(results = []) {
//   return results.reduce((groups, item) => {
//     const key = item.category || item.type || "Records";
//     groups[key] = groups[key] || [];
//     groups[key].push(item);
//     return groups;
//   }, {});
// }

// function searchResultRoute(item = {}) {
//   const category = String(item.category || "").toLowerCase();
//   if (category.includes("patient")) return { page: "patients", query: { patientId: item.patientId || item.id } };
//   if (category.includes("appointment") || category.includes("opd")) return { page: "appointments", query: { patientId: item.patientId } };
//   if (category.includes("admission") || category.includes("ipd")) return { page: "ipdPatient360", query: { admissionId: item.admissionId || item.id } };
//   if (category.includes("bill")) return { page: "billing", query: { patientId: item.patientId } };
//   if (category.includes("document")) return { page: "documents", query: { patientId: item.patientId } };
//   if (category.includes("user") || category.includes("doctor")) return { page: "users", query: {} };
//   if (category.includes("branch")) return { page: "branches", query: {} };
//   return { page: "globalSearch", query: {} };
// }

// function topSearchAutocomplete() {
//   if (!globalSearchQuery.trim()) return "";
//   const groups = groupSearchResults(globalSearchSuggestions.slice(0, 8));
//   return `
//     <div class="search-popover" data-search-popover>
//       ${globalSearchStatus === "loading" ? `<div class="search-state"><span class="loading-spinner" aria-hidden="true"></span><strong>Searching...</strong></div>` : ""}
//       ${globalSearchStatus === "error" ? `<div class="empty compact error-state"><strong>Search failed</strong><small>${escapeHtml(globalSearchError || "Retry search.")}</small><button class="button tiny soft" type="button" data-action="retry-global-search">Retry</button></div>` : ""}
//       ${globalSearchStatus !== "loading" && globalSearchStatus !== "error" && globalSearchSuggestions.length ? Object.entries(groups).map(([group, items]) => `
//         <div class="search-group">
//           <span class="search-group-title">${escapeHtml(group)}</span>
//           ${items.map((item) => {
//             const currentIndex = globalSearchSuggestions.indexOf(item);
//             return `
//               <button class="search-result ${currentIndex === globalSearchActiveIndex ? "active" : ""}" type="button" data-action="select-search-result" data-search-index="${currentIndex}">
//                 <span class="badge status-active">${escapeHtml(item.category || "Record")}</span>
//                 <strong>${escapeHtml(item.title || "Record")}</strong>
//                 <small>${escapeHtml(item.subtitle || item.detail || "")}</small>
//               </button>
//             `;
//           }).join("")}
//         </div>
//       `).join("") : ""}
//       ${globalSearchStatus === "ready" && !globalSearchSuggestions.length ? `<div class="empty compact"><strong>No matching records found.</strong><small>Try patient name, MRN, mobile, bill, admission, document, doctor, or branch.</small></div>` : ""}
//       <button class="search-view-all" type="button" data-action="view-all-search">View all results</button>
//     </div>
//   `;
// }

// function metricCard(label, value, note) {
//   const numericValue = typeof value === "number"
//     ? value
//     : /^-?\d+(\.\d+)?$/.test(String(value || "").trim())
//       ? Number(value)
//       : null;
//   const key = String(label || "").toLowerCase();
//   const badgeLetter = key.includes("pharmacy") ? "Rx"
//     : key.includes("today appointments") ? "T"
//     : key.includes("waiting") ? "W"
//     : key.includes("consultation") ? "I"
//     : key.includes("pending bills") ? "P"
//     : key.includes("lab") ? "L"
//     : key.includes("patient") ? "P"
//     : key.includes("average") ? "A"
//     : key.includes("bed") ? "B"
//     : key.includes("staff") ? "S"
//     : key.includes("alert") ? "A"
//     : key.includes("task") ? "T"
//     : String(label || "?").trim().charAt(0).toUpperCase() || "?";
//   return `
//     <article class="metric-card">
//       <div class="metric-top"><span>${escapeHtml(label)}</span><i class="metric-letter" aria-hidden="true">${escapeHtml(badgeLetter)}</i></div>
//       <strong ${numericValue !== null ? `data-countup="${escapeAttribute(numericValue)}"` : ""}>${escapeHtml(value)}</strong>
//       <small>${escapeHtml(note)}</small>
//     </article>
//   `;
// }

// function trendChart(values, labels) {
//   const safe = (values || []).map((value) => Math.max(Number(value) || 0, 0));
//   if (!safe.length) return emptyState("No trend data is available yet for your scope.");
//   const max = Math.max(...safe, 1);
//   const cols = Math.min(Math.max(safe.length, 1), 14);
//   return `
//     <div class="bar-chart" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))" aria-label="Patient volume trend">
//       ${safe.map((value, index) => `
//         <div class="bar-item">
//           <strong class="bar-value">${escapeHtml(String(value))}</strong>
//           <div class="bar-track" title="${escapeHtml(String(labels[index] ?? ""))}: ${escapeHtml(String(value))}"><span style="height:${Math.max(Math.round((value / max) * 100), 6)}%"></span></div>
//           <small>${escapeHtml(String(labels[index] ?? ""))}</small>
//         </div>
//       `).join("")}
//     </div>
//   `;
// }

// function riskSummary(alerts) {
//   const risks = ["Critical", "High", "Medium", "Low"];
//   return `
//     <div class="risk-list">
//       ${risks.map((risk) => `
//         <div>
//           <span class="badge ${riskClass(risk)}">${risk}</span>
//           <strong>${alerts.filter((alert) => alert.risk === risk).length}</strong>
//         </div>
//       `).join("")}
//     </div>
//   `;
// }

// function taskStatus(tasks) {
//   const statuses = ["Open", "In Progress", "Waiting for Review", "Completed"];
//   return `
//     <div class="status-list">
//       ${statuses.map((status) => `
//         <div>
//           <span>${escapeHtml(status)}</span>
//           <strong>${tasks.filter((task) => task.status === status).length}</strong>
//         </div>
//       `).join("")}
//     </div>
//   `;
// }

// function comparisonTable(data) {
//   const branches = data.branches.length ? data.branches : [{ id: currentUser?.branchId || "visible-scope", name: "Visible scope", city: "Current", status: "Active" }];
//   const admissions = safeOptionalData(() => hasPermission(currentUser, "admissions", "view") ? api.admissions(currentUser) : [], []);
//   const appointments = safeOptionalData(() => hasPermission(currentUser, "appointments", "view") ? api.appointments(currentUser) : [], []);
//   const beds = safeOptionalData(() => hasPermission(currentUser, "beds", "view") || hasPermission(currentUser, "wards", "view") ? api.beds(currentUser) : [], []);
//   return table(
//     ["Branch", "City", "Patient Volume", "Wait Time", "Bed Occupancy", "Open Alerts"],
//     branches.map((branch) => [
//       branch.name,
//       branch.city || "Multiple",
//       appointments.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id)).length +
//         admissions.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id)).length,
//       `${Math.round(appointments
//         .filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id))
//         .reduce((sum, item) => sum + Number(item.waitTime || item.waitMinutes || 0), 0) / Math.max(appointments.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id)).length, 1))} min`,
//       (() => {
//         const branchBeds = beds.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id));
//         const occupied = branchBeds.filter((item) => String(item.status || "").toLowerCase() === "occupied").length;
//         return `${branchBeds.length ? Math.round((occupied / branchBeds.length) * 100) : 0}%`;
//       })(),
//       data.alerts.filter((alert) => !branch.id || alert.branchId === branch.id).length
//     ])
//   );
// }

// // ===== Disabled functions (journey trackers, patient timelines, live flow board) =====
// function journeyTracker() {
//   return "";
// }

// function patientTimeline() {
//   return "";
// }

// function opdJourneyTrackerForPatient() {
//   return "";
// }

// function patientJourneyTimelinePanel() {
//   return "";
// }

// function ipdJourneyTracker() {
//   return "";
// }

// function ipdTimelinePanel() {
//   return "";
// }

// function livePatientFlowBoard() {
//   return "";
// }

// function patientName(patients, patientId, fallback = "Patient") {
//   const patient = patients.find((item) => String(item.id) === String(patientId));
//   return patient?.name || patient?.fullName || fallback || patientId || "Patient";
// }

// function patientOption(patient) {
//   const name = patient.name || patient.fullName || "Patient";
//   const mobile = patient.mobile || patient.mobileNumber || "";
//   return `<option value="${escapeHtml(patient.id)}" ${String(patient.id) === String(selectedPatientId) ? "selected" : ""} data-name="${escapeHtml(name)}" data-mrn="${escapeHtml(patient.mrn || "")}" data-mobile="${escapeHtml(mobile)}" data-age="${escapeHtml(patient.age || "")}" data-gender="${escapeHtml(patient.gender || "")}" data-dob="${escapeHtml(patient.dob || "")}" data-email="${escapeHtml(patient.email || "")}" data-emergency-contact="${escapeHtml(patient.emergencyContact || "")}" data-allergies="${escapeHtml(patient.allergies || "")}">${escapeHtml(patient.mrn || "MRN pending")} - ${escapeHtml(name)}</option>`;
// }

// function patientLabel(patient) {
//   return `${patient.mrn || "MRN pending"} - ${patient.name || patient.fullName || "Patient"}`;
// }

// function findPatient(patients = [], patientId = selectedPatientId) {
//   return patients.find((patient) => String(patient.id) === String(patientId));
// }

// function patientStickyHeader(patient, status = "In progress") {
//   if (!patient) return "";
//   const ageGender = [patient.age, patient.gender].filter(Boolean).join("/");
//   return `
//     <div class="patient-sticky" data-testid="patient-sticky-header">
//       <strong>${escapeHtml(patient.name || patient.fullName || "Patient")}</strong>
//       <span>MRN: ${escapeHtml(patient.mrn || "MRN pending")}</span>
//       ${ageGender ? `<span>${escapeHtml(ageGender)}</span>` : ""}
//       <span>Allergy: ${escapeHtml(patient.allergies || "None")}</span>
//       <span>Status: ${escapeHtml(status)}</span>
//     </div>
//   `;
// }

// function patientRiskIndicator(patientId, data = deriveOperationalData()) {
//   const highVitals = data.vitals.some((item) => String(item.patientId) === String(patientId) && /abnormal|critical|high/i.test(item.status || item.risk || ""));
//   const delayedQueue = data.queue.some((item) => String(item.patientId) === String(patientId) && Number(item.waitingMinutes ?? minutesSince(recordTime(item))) >= automationSettingsForScope().queueWaitingMinutes);
//   const pendingReport = data.labOrders.some((item) => String(item.patientId) === String(patientId) && isPendingStatus(item.status, ["Report Ready", "Doctor Reviewed", "Completed"]));
//   const pendingPharmacy = data.pharmacyIssues.some((item) => String(item.patientId) === String(patientId) && item.status !== "Issued");
//   const pendingPayment = data.bills.some((item) => String(item.patientId) === String(patientId) && item.status !== "Paid");
//   const dischargeBlocked = data.dischargePlans.some((item) => String(item.patientId) === String(patientId) && item.status !== "Ready for Discharge");
//   if (highVitals) return ["Critical", "risk-critical"];
//   if (delayedQueue || dischargeBlocked) return ["Delayed", "risk-high"];
//   if (pendingReport || pendingPharmacy || pendingPayment) return ["Attention", "risk-medium"];
//   return ["Normal", "status-active"];
// }

// function opdCheckoutChecklistPanel(patientId, data = deriveOperationalData()) {
//   const hasConsultation = data.consultations.some((item) => String(item.patientId) === String(patientId));
//   const orderedReports = data.labOrders.filter((item) => String(item.patientId) === String(patientId));
//   const reportsReviewed = orderedReports.every((item) => ["Report Ready", "Doctor Reviewed", "Completed"].includes(item.status));
//   const prescriptions = data.pharmacyIssues.filter((item) => String(item.patientId) === String(patientId));
//   const pharmacyDone = prescriptions.length === 0 || prescriptions.every((item) => item.status === "Issued");
//   const bills = data.bills.filter((item) => String(item.patientId) === String(patientId));
//   const billGenerated = bills.length > 0;
//   const paymentDone = bills.length === 0 || bills.every((item) => item.status === "Paid");
//   const followupDone = data.appointments.some((item) => String(item.followUpForPatientId || "") === String(patientId) || String(item.patientId) === String(patientId) && /follow/i.test(item.type || item.source || ""));
//   const checkoutDone = data.checkouts.some((item) => String(item.patientId) === String(patientId));
//   const rows = [
//     ["Consultation completed", hasConsultation],
//     ["Lab/radiology reports reviewed, if ordered", reportsReviewed],
//     ["Pharmacy issue completed, if prescription exists", pharmacyDone],
//     ["Bill generated", billGenerated],
//     ["Payment completed", paymentDone],
//     ["Follow-up added, if required", followupDone || checkoutDone],
//     ["Checkout completed", checkoutDone]
//   ];
//   return checklistPanel("OPD Checkout Checklist", "Guided closeout before OPD checkout.", rows);
// }

// function patientCardGrid(items = []) {
//   return `
//     <div class="patient-card-grid" data-testid="patient-card-grid">
//       ${items.map((item) => `
//         <article class="patient-card">
//           <div>
//             <strong>${escapeHtml(item.patientName || item.name || item.fullName || "Patient")}</strong>
//             <span>${escapeHtml(item.mrn || item.tokenNumber || "MRN pending")}</span>
//           </div>
//           <div class="card-meta">
//             ${item.age || item.gender ? `<span>${escapeHtml([item.age, item.gender].filter(Boolean).join("/"))}</span>` : ""}
//             ${item.department ? `<span>${escapeHtml(item.department)}</span>` : ""}
//             ${item.doctor ? `<span>${escapeHtml(item.doctor)}</span>` : ""}
//             ${item.waitingMinutes !== undefined ? `<span>${escapeHtml(item.waitingMinutes)} min</span>` : ""}
//           </div>
//           <div class="card-meta">
//             ${badge(item.priority || "Normal", riskClass(item.priority === "Emergency" ? "Critical" : item.priority || "Low"))}
//             ${badge(item.status || item.stage || "Waiting", statusClass(item.status || item.stage || "Waiting"))}
//           </div>
//           ${item.action ? `<button class="button small primary" type="button" data-action="${escapeHtml(item.action)}" data-patient="${escapeHtml(item.patientId || item.id || "")}" data-appointment="${escapeHtml(item.appointmentId || "")}" data-testid="${escapeHtml(item.testId || "patient-card-next-action")}">${escapeHtml(item.actionLabel || "Open")}</button>` : ""}
//         </article>
//       `).join("")}
//     </div>
//   `;
// }

// function fileStorageStatus() {
//   return hasPermission(currentUser, "documents", "view")
//     ? safeOptionalData(() => api.documentStorageStatus(currentUser), { configured: false, status: "Not configured", message: "File storage is not configured. Please contact system administrator.", missing: [] })
//     : { configured: false, status: "Not configured", message: "File storage is not configured. Please contact system administrator.", missing: [] };
// }

// function documentTypeOptions(types = []) {
//   const defaults = ["consent", "lab-report", "radiology-report", "insurance", "admission-document", "discharge-summary", "death-summary", "death-certificate", "body-handover", "mlc-document", "billing-document", "pharmacy-document", "other"];
//   return (types.length ? types : defaults).map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(titleCase(type.replaceAll("-", " ")))}</option>`).join("");
// }

// function documentUploadPanel({ patientId = "", admissionId = "", relatedModule = "documents", types = [], title = "Upload Document" } = {}) {
//   const storage = fileStorageStatus();
//   if (!storage.configured) {
//     return "";
//   }
//   if (!hasPermission(currentUser, "documents", "create") || (relatedModule !== "documents" && !hasPermission(currentUser, relatedModule, "create"))) return "";
//   return `
//     <section class="panel" data-testid="document-upload-section">
//       <div class="panel-head"><h3>${escapeHtml(title)}</h3><p>Allowed files: PDF, JPG, PNG, WebP. Max ${escapeHtml(storage.maxUploadMb || 10)} MB.</p></div>
//       <div class="upload-progress" aria-hidden="true"><span></span></div>
//       <form class="form-grid" data-action="upload-document">
//         <input type="hidden" name="patientId" value="${escapeHtml(patientId)}" />
//         <input type="hidden" name="admissionId" value="${escapeHtml(admissionId)}" />
//         <input type="hidden" name="relatedModule" value="${escapeHtml(relatedModule)}" />
//         <label>Document type<select name="documentType" required>${documentTypeOptions(types)}</select></label>
//         <label>Category<input name="category" value="${escapeHtml(types[0] || "other")}" /></label>
//         <label class="span-2">File<input name="fileInput" type="file" accept="application/pdf,image/jpeg,image/png,image/webp,.docx" required /></label>
//         <label class="span-2">Description<textarea name="description" placeholder="Short note for this document"></textarea></label>
//         <button class="button primary" type="submit" data-testid="document-upload-button">Upload Document</button>
//       </form>
//     </section>
//   `;
// }

// function documentActions(doc) {
//   const id = escapeHtml(doc.id);
//   const download = hasPermission(currentUser, "documents", "view")
//     ? `<button class="button tiny soft" type="button" data-action="download-document" data-document-id="${id}" data-testid="document-download-button">Download</button>`
//     : "";
//   const remove = hasPermission(currentUser, "documents", "delete")
//     ? `<button class="button tiny danger" type="button" data-action="delete-document-file" data-document-id="${id}" data-testid="document-delete-button">Delete</button>`
//     : "";
//   return `<div class="grid-actions">${download}${remove}</div>`;
// }

// function documentTable(docs = []) {
//   const fileBadge = (doc) => {
//     const name = doc.originalFilename || doc.fileName || doc.title || "-";
//     const type = String(doc.mimeType || name.split(".").pop() || "file").replace("application/", "").replace("image/", "");
//     return `<span class="file-chip"><strong>${escapeHtml(type.toUpperCase().slice(0, 6))}</strong>${escapeHtml(name)}</span>`;
//   };
//   return docs.length ? table(["Type", "File", "Category", "Uploaded By", "Date", "Status", "Action"], docs.map((doc) => [
//     titleCase(String(doc.documentType || doc.type || "-").replaceAll("-", " ")),
//     fileBadge(doc),
//     doc.category || doc.relatedModule || "-",
//     doc.uploadedBy || "-",
//     formatDateTime(doc.createdAt || doc.uploadedAt || doc.uploadedDate),
//     badge(doc.status || "Active", statusClass(doc.status || "Active")),
//     documentActions(doc)
//   ])) : emptyState("No documents are linked yet. Uploaded documents will appear here after Cloudflare R2 storage is configured.");
// }

// function searchFilterBar(placeholder = "Search by name / MRN / mobile", chips = ["All", "Waiting", "Today", "Completed"]) {
//   return `
//     <div class="filter-row compact workflow-filter">
//       <input class="panel-search" placeholder="${escapeHtml(placeholder)}" data-table-search />
//       <div class="chip-row">${chips.map((chip, index) => `<button class="chip ${index === 0 ? "active" : ""}" type="button" data-filter-chip="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`).join("")}</div>
//     </div>
//   `;
// }

// function patientActions(patient) {
//   const id = escapeHtml(patient.id);
//   const isDoctor = ["doctor", "surgeon"].includes(String(currentUser.jobRole || "").toLowerCase());
//   const readyToken = isDoctor ? safeOptionalData(() => api.queueTokens(currentUser), []).find((item) => String(item.patientId) === String(patient.id) && item.status === "Ready for Doctor") : null;
//   const primary = hasPermission(currentUser, "consultation", "create") && (!isDoctor || readyToken)
//     ? `<button class="button tiny primary" type="button" data-action="${isDoctor ? "doctor-start-consultation" : "patient-start-consultation"}" ${isDoctor ? `data-queue-token="${escapeHtml(readyToken.id)}"` : `data-patient="${id}"`} data-testid="patient-action-start-consultation">Start Consultation</button>`
//     : `<button class="button tiny soft" type="button" data-action="patient-view" data-patient="${id}" data-testid="patient-action-view">Open Patient</button>`;
//   const actions = [
//     `<button class="button tiny soft" type="button" data-action="patient-view" data-patient="${id}" data-testid="patient-action-view">View</button>`,
//     hasPermission(currentUser, "appointments", "create") ? `<button class="button tiny soft" type="button" data-action="patient-book-appointment" data-patient="${id}" data-testid="patient-action-book-appointment">Book Appointment</button>` : "",
//     hasPermission(currentUser, "queue", "create") ? `<button class="button tiny soft" type="button" data-action="patient-check-in" data-patient="${id}" data-testid="patient-action-check-in">Check In</button>` : "",
//     hasPermission(currentUser, "vitals", "create") ? `<button class="button tiny soft" type="button" data-action="patient-record-vitals" data-patient="${id}" data-testid="patient-action-record-vitals">Record Vitals</button>` : "",
//     hasPermission(currentUser, "consultation", "view") ? `<button class="button tiny soft" type="button" data-action="patient-view-history" data-patient="${id}" data-testid="patient-action-view-history">View History</button>` : "",
//     hasPermission(currentUser, "billing", "view") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${id}">View Bills</button>` : "",
//     hasPermission(currentUser, "pharmacy", "view") ? `<button class="button tiny soft" type="button" data-route="pharmacy" data-patient-id="${id}">View Prescriptions</button>` : ""
//   ].filter(Boolean);
//   return `
//     <div class="grid-actions patient-actions-cell">
//       ${primary}
//       <details class="row-action-menu">
//         <summary class="button tiny soft" data-testid="patient-action-menu-button">More</summary>
//         <div class="row-action-popover">
//           ${actions.join("")}
//         </div>
//       </details>
//     </div>
//   `;
// }

// function latestForPatient(rows, patientId) {
//   return [...(rows || [])]
//     .filter((row) => String(row.patientId) === String(patientId))
//     .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))[0];
// }

// function pendingCount(rows, doneStatuses = ["Paid", "Issued", "Report Ready", "Completed"]) {
//   return (rows || []).filter((row) => !doneStatuses.includes(row.status)).length;
// }

// function printableButton(action, id, label, testId) {
//   return `<button class="button tiny soft" type="button" data-action="${escapeHtml(action)}" data-id="${escapeHtml(id)}" ${testId ? `data-testid="${escapeHtml(testId)}"` : ""}>${escapeHtml(label)}</button>`;
// }

// function ipd360Button(admissionId, label = "View 360") {
//   if (!admissionId || !canAccessPage(currentUser, "ipdPatient360")) return "";
//   return `<button class="button tiny primary" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-testid="ipd-view-360-button">${escapeHtml(label)}</button>`;
// }

// function isDeathOutcome(record = {}) {
//   const values = [
//     record.outcome,
//     record.outcomeStatus,
//     record.patientOutcome,
//     record.dischargeDisposition,
//     record.admissionStatus,
//     record.status,
//     record.decision
//   ].map((value) => String(value || "").trim().toLowerCase());
//   return values.some((value) => ["death", "expired", "deceased", "mortality"].includes(value));
// }

// function deathSummaryForAdmission(summaries = [], admissionId) {
//   return summaries.find((summary) => String(summary.admissionId) === String(admissionId));
// }

// function deathSummaryButton(record = {}, summaries = []) {
//   const admissionId = admissionDisplayId(record) || record.admissionId;
//   if (!admissionId || !hasPermission(currentUser, "deathSummary", "view") || !isDeathOutcome(record)) return "";
//   const summary = deathSummaryForAdmission(summaries, admissionId);
//   const label = summary ? "View Death Summary" : hasPermission(currentUser, "deathSummary", "create") ? "Create Death Summary" : "View Death Summary";
//   return `<button class="button tiny ${summary ? "soft" : "primary"}" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="deathSummary" data-testid="death-summary-entry-button">${escapeHtml(label)}</button>`;
// }

// function admissionDisplayId(admission = {}) {
//   return admission.id || admission.admissionId || admission._id || "";
// }

// function admissionPatientId(admission = {}) {
//   return admission.patientId || admission.patient || admission.patient_id || "";
// }

// function admissionBedLabel(admission = {}, beds = []) {
//   const directBed = firstDefined(admission.bedNumber, admission.bed, admission.bedLabel);
//   if (directBed) return directBed;
//   const bed = beds.find((item) => String(item.id || item._id || "") === String(admission.bedId || ""));
//   return firstDefined(bed?.bed, bed?.bedNumber, bed?.name, admission.bedId) || "Bed not assigned";
// }

// function admissionWardLabel(admission = {}, beds = []) {
//   const directWard = firstDefined(admission.ward, admission.wardName, admission.departmentWard);
//   if (directWard) return directWard;
//   const bed = beds.find((item) => String(item.id || item._id || "") === String(admission.bedId || ""));
//   return firstDefined(bed?.ward, bed?.wardName, bed?.departmentWard) || "Bed not assigned";
// }

// function safeMrn(value, fallback = "MRN not available") {
//   return String(value || "").trim() || fallback;
// }

// function canonicalRecordId(record = {}) {
//   return String(record.id || record._id || record.admissionId || record.patientId || "").trim();
// }

// function sameId(left, right) {
//   return Boolean(left && right && String(left) === String(right));
// }

// function medicineField(record = {}) {
//   return firstDefined(record.medicineName, record.drugName, record.medicationName, record.medicine, record.itemName, record.orderMedicineName, record.name);
// }

// function resolveMedicationName(item = {}, context = {}) {
//   const direct = firstDefined(
//     medicineField(item),
//     medicineField(item.medicationOrder),
//     medicineField(item.prescriptionItem),
//     medicineField(item.orderItem),
//     medicineField(item.pharmacyIssueItem)
//   );
//   if (direct) return direct;
//   const linkedPrescriptionItem = (context.prescriptionItems || []).find((prescriptionItem) => {
//     const prescriptionItemId = canonicalRecordId(prescriptionItem);
//     return sameId(prescriptionItemId, item.prescriptionItemId) ||
//       sameId(prescriptionItemId, item.medicationOrderId) ||
//       sameId(prescriptionItemId, item.orderItemId) ||
//       sameId(prescriptionItem.prescriptionId, item.prescriptionId) ||
//       (sameId(prescriptionItem.patientId, item.patientId) && sameId(prescriptionItem.admissionId || item.admissionId, item.admissionId) && medicineField(prescriptionItem));
//   });
//   const linkedIssue = (context.pharmacyIssues || []).find((issue) => (
//     sameId(canonicalRecordId(issue), item.pharmacyIssueId) ||
//     sameId(issue.prescriptionId, item.prescriptionId) ||
//     (sameId(issue.patientId, item.patientId) && (!item.admissionId || sameId(issue.admissionId, item.admissionId) || !issue.admissionId))
//   ));
//   const linkedConsultation = (context.consultations || []).find((consultation) => (
//     sameId(canonicalRecordId(consultation), item.consultationId) ||
//     sameId(consultation.prescriptionId, item.prescriptionId) ||
//     (sameId(consultation.patientId, item.patientId) && (!item.admissionId || sameId(consultation.admissionId, item.admissionId) || !consultation.admissionId))
//   ));
//   return firstDefined(
//     medicineField(linkedPrescriptionItem),
//     medicineField(linkedIssue),
//     linkedIssue?.medicines,
//     medicineField(linkedConsultation),
//     linkedConsultation?.prescription,
//     linkedConsultation?.medicines
//   ) || "Medication order not linked";
// }

// function findAdmissionForPlan(plan = {}, admissions = []) {
//   return admissions.find((item) => (
//     sameId(admissionDisplayId(item), plan.admissionId || plan.admission) ||
//     sameId(item.admissionNumber, plan.admissionId || plan.admissionNumber) ||
//     (plan.patientId && sameId(admissionPatientId(item), plan.patientId))
//   )) || {};
// }

// function findPatientForDischarge(plan = {}, admission = {}, patients = []) {
//   return patients.find((item) => (
//     sameId(item.id || item._id, plan.patientId) ||
//     sameId(item.id || item._id, admissionPatientId(admission)) ||
//     sameId(item.mrn, plan.mrn || admission.mrn)
//   )) || {};
// }

// function resolveDischargePatient(plan = {}, admissions = [], patients = []) {
//   const admission = findAdmissionForPlan(plan, admissions);
//   const patient = findPatientForDischarge(plan, admission, patients);
//   const mrn = firstDefined(
//     patient.mrn,
//     admission.mrn,
//     plan.mrn,
//     patient.displayId,
//     patient.patientNumber,
//     admission.admissionNumber
//   );
//   const name = firstDefined(plan.patientName, admission.patientName, patient.name, patient.fullName, "Patient");
//   return {
//     admission,
//     patient,
//     mrn: safeMrn(mrn, "MRN unavailable in linked records"),
//     name
//   };
// }

// function filterByAdmission(rows = [], admission = {}) {
//   const admissionId = admissionDisplayId(admission);
//   const patientId = admissionPatientId(admission);
//   return (rows || []).filter((row) => (
//     String(row.admissionId || row.admission || "") === String(admissionId) ||
//     (patientId && String(row.patientId || row.patient || "") === String(patientId))
//   ));
// }

// function latestRecord(rows = []) {
//   return [...rows].sort((a, b) => new Date(b.dateTime || b.date || b.updatedAt || b.createdAt || 0) - new Date(a.dateTime || a.date || a.updatedAt || a.createdAt || 0))[0];
// }

// function ipdAdmissionStatus(admission = {}) {
//   return admission.admissionStatus || admission.status || "Admitted";
// }

// function ipdHeader(admission = {}, patient = {}) {
//   const ageGender = [patient.age || admission.age, patient.gender || admission.gender].filter(Boolean).join("/");
//   return `
//     <div class="patient-sticky ipd-sticky" data-testid="ipd-360-sticky-header">
//       <strong>${escapeHtml(admission.patientName || patient.name || patient.fullName || "Admitted patient")}</strong>
//       <span>${escapeHtml(safeMrn(patient.mrn || admission.mrn, "MRN not available"))}</span>
//       ${ageGender ? `<span>${escapeHtml(ageGender)}</span>` : ""}
//       <span>${escapeHtml(admission.ward || "Bed not assigned")}</span>
//       <span>${escapeHtml(admission.bedNumber || admission.bedId || "Bed not assigned")}</span>
//       <span>${escapeHtml(admission.consultant || admission.admittingDoctor || admission.requestedBy || "Consultant pending")}</span>
//       <span>${escapeHtml(ipdAdmissionStatus(admission))}</span>
//       <span>Allergy: ${escapeHtml(patient.allergies || admission.allergies || "No known drug allergies")}</span>
//     </div>
//   `;
// }

// function ipd360Tabs(activeTab, admissionId) {
//   const allTabs = [
//     ["overview", "Overview", "ipd"],
//     ["dailySheet", "Daily Sheet", "dailySheets"],
//     ["doctorNotes", "Doctor Notes", "dutyDoctor"],
//     ["nursingNotes", "Nursing Notes", "nursing"],
//     ["vitals", "Vitals", "ipdVitals"],
//     ["mar", "MAR", "mar"],
//     ["intakeOutput", "Intake / Output", "intakeOutput"],
//     ["handover", "Handover", "handover"],
//     ["discharge", "Discharge", "discharge"],
//     ["billing", "Billing Clearance", "billing"],
//     ["documents", "Documents", "documents"]
//   ];
//   const visible = allTabs.filter(([, , module]) => hasPermission(currentUser, module, "view"));
//   return `
//     <div class="tab-strip" data-testid="ipd-360-tabs">
//       ${visible.map(([key, label]) => `<button class="tab-button ${key === activeTab ? "active" : ""}" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="${escapeHtml(key)}">${escapeHtml(label)}</button>`).join("")}
//     </div>
//   `;
// }

// function ipdTimelineEvents(admission = {}, context = {}) {
//   const events = [];
//   const add = (when, title, module, user = "-") => {
//     if (when || title) events.push({ when: when || new Date().toISOString(), title, module, user });
//   };
//   add(admission.createdAt || admission.admissionDateTime, "Admission active", "Admissions", admission.createdBy || admission.requestedBy || admission.admittingDoctor);
//   if (admission.bedNumber || admission.bedId) add(admission.updatedAt || admission.createdAt, "Bed assigned", "Wards", admission.updatedBy || "-");
//   (context.vitals || []).forEach((item) => add(item.dateTime || item.createdAt, "Vitals recorded", "Vitals", item.recordedBy));
//   (context.doctorNotes || []).forEach((item) => add(item.dateTime || item.createdAt, "Doctor note added", "Doctor Notes", item.doctorName));
//   (context.nursingNotes || []).forEach((item) => add(item.dateTime || item.createdAt, "Nursing note added", "Nursing", item.nurseName));
//   (context.labOrders || []).forEach((item) => add(recordTime(item), item.status === "Report Ready" ? "Lab report uploaded" : "Lab order created", item.orderType || "Lab", item.doctor));
//   (context.pharmacyIssues || []).forEach((item) => add(recordTime(item), "Medicine issued", "Pharmacy", item.issuedBy || "-"));
//   (context.bills || []).forEach((item) => add(recordTime(item), "Bill generated", "Billing", item.createdBy || "-"));
//   (context.documents || []).forEach((item) => add(recordTime(item), "Document uploaded", "Documents", item.uploadedBy || "-"));
//   (context.dischargePlans || []).forEach((item) => add(recordTime(item), "Discharge planning started", "Discharge", item.createdBy || "-"));
//   (context.deathSummaries || []).forEach((item) => add(recordTime(item), `Death Summary ${item.status || "updated"}`, "Death Summary", item.updatedBy || item.createdBy || "-"));
//   return events.sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 30);
// }

// function checklistPanel(title, subtitle, rows = [], options = {}) {
//   const ready = rows.every(([, done]) => done);
//   return `
//     <section class="panel" ${options.testId ? `data-testid="${escapeHtml(options.testId)}"` : ""}>
//       <div class="panel-head"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div>${badge(ready ? "Ready" : "Pending", ready ? "status-active" : "risk-medium")}</div>
//       <div class="checklist-grid">
//         ${rows.map(([label, done]) => `<span class="${done ? "done" : ""}"><i>${done ? "OK" : "!"}</i>${escapeHtml(label)}</span>`).join("")}
//       </div>
//       ${options.note ? `<div class="notice subtle">${escapeHtml(options.note)}</div>` : ""}
//     </section>
//   `;
// }

// function ipdAdmissionChecklistPanel(admission = {}, context = {}) {
//   const admissionId = admissionDisplayId(admission);
//   const rows = [
//     ["Admission request created", Boolean(admissionId)],
//     ["Admission reviewed", !["Requested", "Pending"].includes(ipdAdmissionStatus(admission))],
//     ["Ward selected", Boolean(admission.ward)],
//     ["Bed assigned", Boolean(admission.bedNumber || admission.bedId)],
//     ["Admission activated", !["Requested", "Pending", "Cancelled"].includes(ipdAdmissionStatus(admission))],
//     ["Initial nursing assessment added", (context.nursingNotes || []).length > 0],
//     ["Initial doctor note added", (context.doctorNotes || []).length > 0]
//   ];
//   return checklistPanel("IPD Admission Checklist", "Guided activation steps for a safe IPD handoff.", rows, {
//     testId: "ipd-admission-checklist",
//     note: "Admission activation still uses existing admission, ward, bed, and role permission rules."
//   });
// }

// function dischargeChecklistPanel({ admission = {}, dischargePlans = [], documents = [], bills = [], pharmacyIssues = [], labOrders = [], deathSummary = null } = {}) {
//   const plan = dischargePlans[0] || {};
//   const paid = bills.some((bill) => bill.status === "Paid");
//   const rows = [
//     ["Doctor discharge summary completed", Boolean(plan.doctorAdviceCompleted || documents.some((doc) => doc.documentType === "discharge-summary"))],
//     ["Nursing clearance done", Boolean(plan.nursingClearance)],
//     ["Pharmacy clearance done", Boolean(plan.pharmacyClearance) || pharmacyIssues.every((issue) => issue.status === "Issued")],
//     ["Lab reports attached", Boolean(plan.labRadiologyClearance) || labOrders.every((order) => ["Report Ready", "Doctor Reviewed"].includes(order.status))],
//     ["Billing cleared", Boolean(plan.billingClearance) || paid],
//     ["Documents completed", missingDocumentAlerts({ documents, admission, deathSummary, labOrders, bills }).length === 0],
//     ["Final bill paid", paid]
//   ];
//   return checklistPanel("Discharge Checklist Automation", "Doctor, nursing, pharmacy, billing, document, and summary readiness.", rows, {
//     testId: "discharge-checklist",
//     note: "Final discharge still requires an authorized user action and server-side validation."
//   });
// }

// function deathSummaryChecklistPanel(summary = null, documents = [], admission = {}) {
//   const deathDocumentUploaded = documents.some((doc) => ["death-summary", "death-certificate"].includes(doc.documentType));
//   const rows = [
//     ["Death outcome recorded", isDeathOutcome(admission)],
//     ["Draft created", Boolean(summary)],
//     ["Submitted for review", ["Submitted", "Submitted for Review", "Approved / Finalized", "Printed"].includes(summary?.status)],
//     ["Finalized or returned", ["Approved / Finalized", "Printed", "Returned for Correction"].includes(summary?.status)],
//     ["Print/export audit captured", Boolean(summary?.printedAt || summary?.exportedAt)],
//     ["Death certificate document uploaded, if applicable", deathDocumentUploaded || summary?.deathCertificateIssued !== "Yes"]
//   ];
//   return checklistPanel("Death Summary Checklist", "Mortality workflow stays separate from normal discharge summary.", rows, {
//     testId: "death-summary-checklist",
//     note: "Death Summary actions remain audit logged and permission controlled."
//   });
// }

// function safeAiAssistantPanel(context = "patient record") {
//   return `
//     <section class="panel assistive-panel">
//       <div class="panel-head">
//         <div><h3>Safe AI Assistant Placeholder</h3><p>Assistive draft only &mdash; requires human review.</p></div>
//         ${badge("Draft-only", "status-draft")}
//       </div>
//       <div class="notice subtle">
//         Future support may summarize ${escapeHtml(context)}, draft discharge/death summaries from approved notes, clean up rough notes, explain billing breakup, find pending tasks, and surface missing documents. It will not diagnose, prescribe, approve discharge, or certify death.
//       </div>
//     </section>
//   `;
// }

// function ipdNextActions(admissionId, admission = {}) {
//   const actions = [
//     ["ipdVitals", "Record Vitals", "ipdVitals", "create"],
//     ["nursing", "Add Nursing Note", "nursing", "create"],
//     ["dutyDoctor", "Add Doctor Note", "dutyDoctor", "create"],
//     ["mar", "Mark Medication Given", "mar", "edit"],
//     ["intakeOutput", "Update Intake/Output", "intakeOutput", "create"],
//     ["handover", "Add Handover Note", "handover", "create"],
//     ["discharge", "Start Discharge Clearance", "discharge", "edit"],
//     ["discharge", "Generate Discharge Summary", "discharge", "create"],
//     ["ipdPatient360", "Create Death Summary", "deathSummary", "create"]
//   ].filter(([route, , module, action]) => hasPermission(currentUser, module, action) && (route !== "ipdPatient360" || isDeathOutcome(admission)));
//   return `
//     <aside class="panel next-action-panel" data-testid="ipd-360-next-actions">
//       <div class="panel-head"><h3>Next Action</h3><p>Allowed actions for this admission.</p></div>
//       <div class="quick-grid compact">
//         ${actions.length ? actions.map(([route, label]) => `<button class="button soft" type="button" data-route="${route}" data-admission-id="${escapeHtml(admissionId)}"${route === "ipdPatient360" ? ` data-tab="deathSummary"` : ""}>${escapeHtml(label)}</button>`).join("") : emptyState("No next actions are available for your current permissions.")}
//       </div>
//     </aside>
//   `;
// }

// function deathSummaryForm(admission = {}, patient = {}, summary = null) {
//   const admissionId = admissionDisplayId(admission);
//   const locked = summary && ["Approved / Finalized", "Printed", "Closed"].includes(summary.status);
//   if (locked || (!summary && !hasPermission(currentUser, "deathSummary", "create")) || (summary && !hasPermission(currentUser, "deathSummary", "edit"))) return "";
//   const action = summary ? "update-death-summary" : "create-death-summary";
//   return `
//     <section class="panel" data-testid="death-summary-form">
//       <div class="panel-head"><h3>${summary ? "Edit Death Summary" : "Create Death Summary"}</h3><p>Mortality Summary for admitted/IPD patient.</p></div>
//       <form class="form-grid" data-action="${action}">
//         <input type="hidden" name="admissionId" value="${escapeHtml(admissionId)}" />
//         <label>Patient name<input name="patientName" value="${escapeHtml(summary?.patientName || admission.patientName || patient.name || patient.fullName || "")}" readonly /></label>
//         <label>MRN<input name="mrn" value="${escapeHtml(summary?.mrn || patient.mrn || admission.mrn || "")}" readonly /></label>
//         <label>Age<input name="age" value="${escapeHtml(summary?.age || patient.age || admission.age || "")}" readonly /></label>
//         <label>Gender<input name="gender" value="${escapeHtml(summary?.gender || patient.gender || admission.gender || "")}" readonly /></label>
//         <label>Admission number<input name="admissionNumber" value="${escapeHtml(summary?.admissionNumber || admission.admissionNumber || admissionId)}" readonly /></label>
//         <label>Admission date/time<input name="admissionDateTime" value="${escapeHtml(summary?.admissionDateTime || admission.admissionDateTime || admission.createdAt || "")}" readonly /></label>
//         <label>Ward / bed<input name="wardBed" value="${escapeHtml(summary?.wardBed || `${admission.ward || ""}${admission.bedNumber || admission.bedId ? ` / ${admission.bedNumber || admission.bedId}` : ""}`.trim())}" readonly /></label>
//         <label>Consultant<input name="consultant" value="${escapeHtml(summary?.consultant || admission.consultant || admission.admittingDoctor || admission.requestedBy || "")}" readonly /></label>
//         <label class="span-2">Diagnosis at admission<input name="diagnosisAtAdmission" value="${escapeHtml(summary?.diagnosisAtAdmission || admission.diagnosisAtAdmission || "")}" readonly /></label>

//         <label>Date of death<input name="dateOfDeath" type="date" value="${escapeHtml(summary?.dateOfDeath || "")}" required /></label>
//         <label>Time of death<input name="timeOfDeath" type="time" value="${escapeHtml(summary?.timeOfDeath || "")}" required /></label>
//         <label>Place of death<select name="placeOfDeath"><option ${summary?.placeOfDeath === "Ward" ? "selected" : ""}>Ward</option><option ${summary?.placeOfDeath === "ICU" ? "selected" : ""}>ICU</option><option ${summary?.placeOfDeath === "Emergency" ? "selected" : ""}>Emergency</option><option ${summary?.placeOfDeath === "OT" ? "selected" : ""}>OT</option><option ${summary?.placeOfDeath === "Other" ? "selected" : ""}>Other</option></select></label>
//         <label>Attending doctor<input name="attendingDoctor" value="${escapeHtml(summary?.attendingDoctor || admission.admittingDoctor || "")}" /></label>
//         <label>Witnessed by<input name="witnessedBy" value="${escapeHtml(summary?.witnessedBy || "")}" /></label>
//         <label>MLC / medico-legal case<select name="mlcCase"><option ${summary?.mlcCase === "No" ? "selected" : ""}>No</option><option ${summary?.mlcCase === "Yes" ? "selected" : ""}>Yes</option></select></label>
//         <label>Family informed<select name="familyInformed"><option ${summary?.familyInformed === "Yes" ? "selected" : ""}>Yes</option><option ${summary?.familyInformed === "No" ? "selected" : ""}>No</option></select></label>
//         <label>Family informed by<input name="familyInformedBy" value="${escapeHtml(summary?.familyInformedBy || "")}" /></label>
//         <label>Body handover status<select name="bodyHandoverStatus"><option ${summary?.bodyHandoverStatus === "Pending" ? "selected" : ""}>Pending</option><option ${summary?.bodyHandoverStatus === "Approved" ? "selected" : ""}>Approved</option><option ${summary?.bodyHandoverStatus === "Handed Over" ? "selected" : ""}>Handed Over</option></select></label>

//         <label class="span-2">Immediate cause<textarea name="immediateCause" required>${escapeHtml(summary?.immediateCause || "")}</textarea></label>
//         <label class="span-2">Antecedent cause<textarea name="antecedentCause">${escapeHtml(summary?.antecedentCause || "")}</textarea></label>
//         <label class="span-2">Underlying cause<textarea name="underlyingCause">${escapeHtml(summary?.underlyingCause || "")}</textarea></label>
//         <label class="span-2">Other significant conditions<textarea name="otherSignificantConditions">${escapeHtml(summary?.otherSignificantConditions || "")}</textarea></label>
//         <label class="span-2">Brief history<textarea name="briefHistory">${escapeHtml(summary?.briefHistory || "")}</textarea></label>
//         <label class="span-2">Course in hospital<textarea name="courseInHospital">${escapeHtml(summary?.courseInHospital || "")}</textarea></label>
//         <label class="span-2">Investigations summary<textarea name="investigationsSummary">${escapeHtml(summary?.investigationsSummary || "")}</textarea></label>
//         <label class="span-2">Treatment given<textarea name="treatmentGiven">${escapeHtml(summary?.treatmentGiven || "")}</textarea></label>
//         <label class="span-2">Events leading to death<textarea name="eventsLeadingToDeath">${escapeHtml(summary?.eventsLeadingToDeath || "")}</textarea></label>
//         <label>Resuscitation attempted<select name="resuscitationAttempted"><option ${summary?.resuscitationAttempted === "Yes" ? "selected" : ""}>Yes</option><option ${summary?.resuscitationAttempted === "No" ? "selected" : ""}>No</option></select></label>
//         <label>Death certificate issued<select name="deathCertificateIssued"><option ${summary?.deathCertificateIssued === "No" ? "selected" : ""}>No</option><option ${summary?.deathCertificateIssued === "Yes" ? "selected" : ""}>Yes</option></select></label>
//         <label>Body release approved<select name="bodyReleaseApproved"><option ${summary?.bodyReleaseApproved === "No" ? "selected" : ""}>No</option><option ${summary?.bodyReleaseApproved === "Yes" ? "selected" : ""}>Yes</option></select></label>
//         <label>Billing clearance<select name="billingClearanceStatus"><option>${escapeHtml(summary?.billingClearanceStatus || "Pending")}</option><option>Cleared</option><option>Pending</option></select></label>
//         <label>Pharmacy clearance<select name="pharmacyClearanceStatus"><option>${escapeHtml(summary?.pharmacyClearanceStatus || "Pending")}</option><option>Cleared</option><option>Pending</option></select></label>
//         <label class="span-2">CPR details<textarea name="cprDetails">${escapeHtml(summary?.cprDetails || "")}</textarea></label>
//         <label class="span-2">Final clinical impression<textarea name="finalClinicalImpression">${escapeHtml(summary?.finalClinicalImpression || "")}</textarea></label>
//         <label class="span-2">Document checklist<textarea name="documentChecklist">${escapeHtml(summary?.documentChecklist || "Death certificate, body handover form, identity verification")}</textarea></label>
//         <label class="span-2">Remarks<textarea name="remarks">${escapeHtml(summary?.remarks || "")}</textarea></label>
//         <button class="button primary" type="submit" data-testid="save-death-summary-button">${summary ? "Save Death Summary" : "Create Death Summary"}</button>
//       </form>
//     </section>
//   `;
// }

// function deathSummaryPreview(summary = {}, admission = {}, patient = {}) {
//   if (!summary) return emptyState("Death Summary is not created yet. Authorized doctors can create it after the admission outcome is marked Death, Expired, Deceased, or Mortality.");
//   return `
//     <section class="panel print-death-summary" data-testid="death-summary-print-layout">
//       <div class="print-doc-head">
//         <div>
//           <p class="eyebrow">Hospital Operations Command Center</p>
//           <h2>Death Summary</h2>
//           <p>Mortality Summary</p>
//         </div>
//         ${badge(summary.status || "Draft", statusClass(summary.status || "Draft"))}
//       </div>
//       ${table(["Field", "Details"], [
//         ["Patient", `${summary.patientName || admission.patientName || patient.name || "-"} | MRN: ${summary.mrn || patient.mrn || "-"} | ${[summary.age || patient.age, summary.gender || patient.gender].filter(Boolean).join("/") || "-"}`],
//         ["Admission", `${summary.admissionNumber || admission.admissionNumber || admissionDisplayId(admission)} | ${summary.admissionDateTime || admission.admissionDateTime || "-"}`],
//         ["Ward / Bed", summary.wardBed || `${admission.ward || "-"} / ${admission.bedNumber || admission.bedId || "-"}`],
//         ["Consultant", summary.consultant || admission.consultant || admission.admittingDoctor || "-"],
//         ["Date / Time of death", `${summary.dateOfDeath || "-"} ${summary.timeOfDeath || ""}`],
//         ["Cause of death", `Immediate: ${summary.immediateCause || "-"}; Antecedent: ${summary.antecedentCause || "-"}; Underlying: ${summary.underlyingCause || "-"}`],
//         ["Clinical course", summary.courseInHospital || summary.briefHistory || "-"],
//         ["Treatment given", summary.treatmentGiven || "-"],
//         ["Events leading to death", summary.eventsLeadingToDeath || "-"],
//         ["Final impression", summary.finalClinicalImpression || "-"],
//         ["MLC / Family / Body", `MLC: ${summary.mlcCase || "No"}; Family informed: ${summary.familyInformed || "-"}; Body handover: ${summary.bodyHandoverStatus || "Pending"}`],
//         ["Prepared / Approved", `${summary.preparedBy || "-"} / ${summary.approverName || "-"}`],
//         ["Printed", summary.printedAt || "Not printed"]
//       ])}
//       <p class="print-footer">This Death Summary is generated from HOCC clinical records and must be validated by authorized hospital staff before external release.</p>
//     </section>
//   `;
// }

// function deathSummarySection(admission = {}, patient = {}, summary = null) {
//   if (!isDeathOutcome(admission) && !summary) return emptyState("Death Summary is available only after outcome is marked Death, Expired, Deceased, or Mortality.");
//   const admissionId = admissionDisplayId(admission);
//   const documents = hasPermission(currentUser, "documents", "view") ? filterByAdmission(safeOptionalData(() => api.patientDocuments(currentUser)), admission) : [];
//   const deathDocuments = documents.filter((doc) => ["death-summary", "death-certificate", "body-handover", "mlc-document"].includes(doc.documentType));
//   const canSubmit = summary && hasPermission(currentUser, "deathSummary", "edit") && ["Draft", "Returned for Correction"].includes(summary.status);
//   const canApprove = summary && hasPermission(currentUser, "deathSummary", "approve") && summary.status === "Submitted for Review";
//   const canPrint = summary && hasPermission(currentUser, "deathSummary", "export") && ["Approved / Finalized", "Printed"].includes(summary.status);
//   return `
//     <section class="panel">
//       <div class="panel-head">
//         <div><h3>Death Summary</h3><p>Mortality Summary workflow, separate from normal discharge summary.</p></div>
//         <div class="button-row">
//           ${summary ? `<button class="button soft" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="deathSummary">View Death Summary</button>` : ""}
//           ${canSubmit ? `<button class="button soft" type="button" data-action="submit-death-summary" data-admission="${escapeHtml(admissionId)}" data-testid="submit-death-summary-button">Submit for Review</button>` : ""}
//           ${canApprove ? `<button class="button primary" type="button" data-action="approve-death-summary" data-admission="${escapeHtml(admissionId)}" data-testid="finalize-death-summary-button">Finalize Death Summary</button><button class="button soft" type="button" data-action="return-death-summary" data-admission="${escapeHtml(admissionId)}">Return for Correction</button>` : ""}
//           ${canPrint ? `<button class="button primary" type="button" data-action="print-death-summary" data-admission="${escapeHtml(admissionId)}" data-testid="print-death-summary-button">Print Death Summary</button>` : ""}
//         </div>
//       </div>
//       <div class="metric-grid small">
//         ${metricCard("Death Summary", summary?.status || "Not Created", "Workflow status")}
//         ${metricCard("Death Certificate", summary?.deathCertificateIssued || "No", "Administrative")}
//         ${metricCard("Body Handover", summary?.bodyHandoverStatus || "Pending", "Closure")}
//         ${metricCard("MLC", summary?.mlcCase || "No", "Medico-legal")}
//       </div>
//     </section>
//     ${deathSummaryChecklistPanel(summary, deathDocuments, admission)}
//     ${deathSummaryForm(admission, patient, summary)}
//     ${deathSummaryPreview(summary, admission, patient)}
//     ${documentUploadPanel({ patientId: admissionPatientId(admission), admissionId, relatedModule: "deathSummary", types: ["death-summary", "death-certificate", "body-handover", "mlc-document"], title: "Upload Death Summary Documents" })}
//     <section class="panel">
//       <div class="panel-head"><h3>Death Summary Documents</h3><p>Death summary PDF, death certificate copy, body handover form, and MLC documents.</p></div>
//       ${documentTable(deathDocuments)}
//     </section>
//     <section class="panel">
//       <div class="panel-head"><h3>Audit history</h3></div>
//       <p class="muted">Created, edited, submitted, finalized, returned, printed, certificate, body handover, and MLC changes are logged in the audit trail.</p>
//     </section>
//   `;
// }

// function deathSummaryPage() {
//   const admissions = hasPermission(currentUser, "admissions", "view") ? safeOptionalData(() => api.admissions(currentUser)) : [];
//   const summaries = safeData(() => api.deathSummaries(currentUser));
//   const terminalAdmissions = admissions.filter((admission) => isDeathOutcome(admission));
//   const rows = [
//     ...terminalAdmissions.map((admission) => ({
//       admission,
//       summary: deathSummaryForAdmission(summaries, admissionDisplayId(admission))
//     })),
//     ...summaries
//       .filter((summary) => !terminalAdmissions.some((admission) => String(admissionDisplayId(admission)) === String(summary.admissionId)))
//       .map((summary) => ({ admission: {}, summary }))
//   ];
//   const openButton = (admissionId, summary) => {
//     if (!admissionId) return "Open from IPD patient record";
//     const label = summary ? "View Death Summary" : hasPermission(currentUser, "deathSummary", "create") ? "Create Death Summary" : "View Death Summary";
//     return `<button class="button tiny ${summary ? "soft" : "primary"}" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="deathSummary" data-testid="death-summary-entry-button">${escapeHtml(label)}</button>`;
//   };
//   return `
//     <section class="panel">
//       <div class="panel-head">
//         <div>
//           <h3>Death Summary</h3>
//           <p>Mortality Summary worklist for admitted patients marked Death, Expired, Deceased, or Mortality.</p>
//         </div>
//         ${badge(`${rows.length} case${rows.length === 1 ? "" : "s"}`, "status-active")}
//       </div>
//       ${rows.length ? table(["Patient", "MRN", "Admission", "Ward / Bed", "Outcome", "Summary Status", "Action"], rows.map(({ admission, summary }) => {
//         const admissionId = admissionDisplayId(admission) || summary?.admissionId;
//         return [
//           admission.patientName || summary?.patientName || "Admitted patient",
//           admission.mrn || summary?.mrn || "MRN pending",
//           admission.admissionNumber || summary?.admissionNumber || admissionId || "-",
//           summary?.wardBed || `${admission.ward || "-"} / ${admission.bedNumber || admission.bedId || "-"}`,
//           admission.outcome || admission.outcomeStatus || admission.patientOutcome || admission.dischargeDisposition || admission.admissionStatus || admission.status || "Death",
//           badge(summary?.status || "Not Created", statusClass(summary?.status || "Draft")),
//           openButton(admissionId, summary)
//         ];
//       })) : emptyState("No Death Summary cases found. Cases appear here only after an admitted patient outcome is marked Death, Expired, Deceased, or Mortality.")}
//     </section>
//   `;
// }

// function priorityCards(items) {
//   return `
//     <div class="priority-grid">
//       ${items.map(([label, count, note]) => `
//         <article class="priority-card ${riskClass(label)}">
//           <span>${escapeHtml(label)}</span>
//           <strong>${escapeHtml(count)}</strong>
//           <small>${escapeHtml(note)}</small>
//         </article>
//       `).join("")}
//     </div>
//   `;
// }

// function publicBookingLinkBlock(branch) {
//   if (!branch.publicBookingEnabled) return "";
//   const url = `${location.origin}${location.pathname}#/book?branch=${encodeURIComponent(branch.id)}`;
//   const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
//   return `
//     <details class="qr-disclosure">
//       <summary>Get QR / link</summary>
//       <div class="qr-disclosure-body">
//         <img src="${escapeAttribute(qrSrc)}" alt="Booking QR code" width="140" height="140" />
//         <input type="text" readonly value="${escapeAttribute(url)}" onclick="this.select()" />
//       </div>
//     </details>
//   `;
// }

// function sensitivePermissionList(permissions = {}) {
//   return Object.entries(permissions || {}).flatMap(([module, actions]) =>
//     asArray(actions)
//       .filter((action) => SENSITIVE_USER_PERMISSIONS.has(action))
//       .map((action) => `${currentPageTitle(module)}: ${action}`)
//   );
// }

// function allAssignablePages() {
//   return uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
// }

// function userAccessDetail(user) {
//   if (!user) return `
//     <section class="panel empty-panel">
//       <h3>Select a user to view access</h3>
//       <p>Use View Access to inspect allowed pages, blocked pages, actions, sensitive permissions, and permission audit history.</p>
//     </section>
//   `;
//   const allowedPages = user.allowedPages || [];
//   const blockedPages = allAssignablePages().filter((page) => !allowedPages.includes(page));
//   const permissions = user.permissions || {};
//   const actions = Object.entries(permissions).flatMap(([module, values]) => asArray(values).map((action) => `${currentPageTitle(module)}: ${action}`));
//   const sensitive = sensitivePermissionList(permissions);
//   const audits = api.auditLogs(currentUser)
//     .filter((log) => [user.email, user.name, user.id].some((value) => String(log.newValue || "").includes(value) || String(log.oldValue || "").includes(value)))
//     .slice(0, 5);
//   return `
//     <section class="panel access-detail" data-testid="user-access-detail-panel">
//       <div class="panel-head">
//         <div>
//           <h3>${escapeHtml(user.name)}</h3>
//           <p>${escapeHtml(user.email)} · ${escapeHtml(user.jobRole || roleLabels[user.role])} · ${escapeHtml(user.branchName || "Hospital group")}</p>
//         </div>
//         ${badge(user.reviewStatus || "Not Reviewed", statusClass(user.reviewStatus || "Pending"))}
//       </div>
//       <div class="access-preview">
//         <div>
//           <h4>Allowed pages</h4>
//           <ul>${allowedPages.map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("") || "<li>No pages assigned</li>"}</ul>
//         </div>
//         <div>
//           <h4>Blocked pages</h4>
//           <ul>${blockedPages.slice(0, 14).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("") || "<li>No blocked pages</li>"}</ul>
//         </div>
//       </div>
//       <div class="access-preview">
//         <div>
//           <h4>Allowed actions</h4>
//           <ul>${actions.slice(0, 18).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>View-only or preset access</li>"}</ul>
//         </div>
//         <div>
//           <h4>Sensitive permissions</h4>
//           <ul>${sensitive.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>No sensitive permissions</li>"}</ul>
//         </div>
//       </div>
//       <div class="mini-grid">
//         <span><strong>Last login</strong>${escapeHtml(user.lastLogin || user.lastLoginAt || "-")}</span>
//         <span><strong>Last permission update</strong>${escapeHtml(user.lastPermissionUpdate || "-")}</span>
//         <span><strong>Created by</strong>${escapeHtml(user.createdBy || "-")}</span>
//       </div>
//       <div class="button-row">
//         <button class="button small primary" type="button" data-action="review-access" data-review="Reviewed" data-user="${escapeHtml(user.id)}">Mark Reviewed</button>
//         <button class="button small soft" type="button" data-action="review-access" data-review="Changes Required" data-user="${escapeHtml(user.id)}">Request Changes</button>
//         <button class="button small danger" type="button" data-action="disable-access-user" data-user="${escapeHtml(user.id)}">Disable User</button>
//       </div>
//       <h4>Permission audit history</h4>
//       ${audits.length ? table(["Date/time", "User", "Module", "Action", "New value"], audits.map((log) => [log.at, log.user, log.module, log.action, log.newValue])) : emptyState("No permission audit entries for this user yet.")}
//     </section>
//   `;
// }

// function permissionMatrix() {
//   const modules = ["Appointments", "Bed Usage", "Claims", "Incidents", "Reports"];
//   const permissions = [
//     ["Yes", "Yes", "Yes", "No", "No", "No"],
//     ["Yes", "Yes", "Yes", "No", "Yes", "Yes"],
//     ["Yes", "Yes", "Yes", "No", "Yes", "Yes"],
//     ["Yes", "Yes", "Yes", "No", "Yes", "Yes"],
//     ["Yes", "No", "No", "No", "Yes", "No"]
//   ];
//   return `
//     <div class="subsection">
//       <h3>Sample permission matrix</h3>
//       ${table(["Module", "View", "Create", "Edit", "Delete", "Export", "Assign Task"], modules.map((module, index) => [module, ...permissions[index]]))}
//     </div>
//   `;
// }

// function emergencyOneScreenPanel(cases = []) {
//   const active = cases.filter((item) => !["Discharged", "Transferred", "Closed"].includes(item.status));
//   return `
//     <section class="panel emergency-one-screen">
//       <div class="panel-head">
//         <div><h3>Emergency One-Screen Mode</h3><p>Quick registration, triage, vitals, doctor decision, move to OPD/IPD, billing later, or discharge.</p></div>
//         <span class="badge risk-critical">${active.length} active</span>
//       </div>
//       <div class="emergency-action-grid">
//         ${hasPermission(currentUser, "emergency", "create") ? `<button class="emergency-action primary" type="button" data-route="emergency"><strong>Quick registration</strong><small>Capture essentials first</small></button>` : ""}
//         <button class="emergency-action" type="button" data-route="emergency"><strong>Triage level</strong><small>Critical / High / Medium / Low</small></button>
//         ${canAccessPage(currentUser, "vitals") ? `<button class="emergency-action" type="button" data-route="vitals"><strong>Vitals</strong><small>Record immediate observations</small></button>` : ""}
//         ${canAccessPage(currentUser, "consultation") ? `<button class="emergency-action" type="button" data-route="consultation"><strong>Doctor action</strong><small>Clinical review remains human-led</small></button>` : ""}
//         ${canAccessPage(currentUser, "appointments") ? `<button class="emergency-action" type="button" data-route="appointments"><strong>Move to OPD</strong><small>Continue normal OPD flow</small></button>` : ""}
//         ${canAccessPage(currentUser, "admissions") ? `<button class="emergency-action" type="button" data-route="admissions"><strong>Admit to IPD</strong><small>Request bed assignment</small></button>` : ""}
//         ${canAccessPage(currentUser, "billing") ? `<button class="emergency-action" type="button" data-route="billing"><strong>Billing later</strong><small>Create reviewed bill</small></button>` : ""}
//         ${canAccessPage(currentUser, "checkout") ? `<button class="emergency-action" type="button" data-route="checkout"><strong>Discharge</strong><small>Close only after valid clearance</small></button>` : ""}
//       </div>
//     </section>
//   `;
// }

// function renderNotificationsDrawer(notifications = []) {
//   const categories = ["Clinical", "Queue", "Billing", "Lab", "Pharmacy", "Discharge", "Documents", "Permission", "System"];
//   const groups = Object.fromEntries(categories.map((category) => [category, notifications.filter((item) => notificationGroup(item) === category)]).filter(([, items]) => items.length));
//   return `
//     <div class="notifications-backdrop" data-action="close-notifications" aria-hidden="true"></div>
//     <aside class="notifications-drawer" aria-label="Notifications">
//       <div class="panel-head">
//         <div>
//           <h3>Notifications</h3>
//           <p>Derived live from today’s workflow signals and saved in-app messages.</p>
//         </div>
//         <div class="button-row">${hasPermission(currentUser, "notifications", "edit") ? `<button class="button tiny soft" type="button" title="Mark all read" aria-label="Mark all read" data-action="mark-all-notifications-read">${iconLabel(actionIcon("mark read"), "Mark all read")}</button><button class="button tiny soft" type="button" title="Clear read" aria-label="Clear read" data-action="clear-read-notifications">${iconLabel(actionIcon("clear"), "Clear read")}</button>` : ""}<button class="icon-button" type="button" title="Close notifications" data-action="close-notifications" aria-label="Close notifications">${iconLabel(actionIcon("close"), "Close")}</button></div>
//       </div>
//       ${notifications.length ? Object.entries(groups).map(([group, items]) => `
//         <section class="drawer-group">
//           <div class="drawer-group-head">
//             <strong>${escapeHtml(group)}</strong>
//             <span class="badge ${items.some((item) => !item.read) ? "risk-medium" : "status-active"}">${items.length}</span>
//           </div>
//           ${items.length ? `<div class="drawer-list">${items.slice(0, 6).map((item) => `
//             <button class="drawer-item" type="button" data-route="${escapeHtml(item.route || "notifications")}" data-notification="${escapeHtml(item.id || "")}" ${item.patientId ? `data-patient-id="${escapeHtml(item.patientId)}"` : ""} ${item.admissionId ? `data-admission-id="${escapeHtml(item.admissionId)}"` : ""}>
//               <strong>${escapeHtml(item.title || "Notification")}</strong>
//               <small>${escapeHtml(item.message || item.detail || "")}</small>
//               <span>${escapeHtml([item.time || item.createdAt || "Now", String(item.priority || "info").toUpperCase()].join(" / "))}</span>
//             </button>
//           `).join("")}</div>` : emptyState("No notifications yet.")}
//         </section>
//       `).join("") : emptyState("No notifications yet.")}
//     </aside>
//   `;
// }

// function providerStatusGrid() {
//   const configured = "Configured in environment";
//   const storage = fileStorageStatus();
//   const providerStatus = safeOptionalData(() => hasPermission(currentUser, "settings", "view") && api.providerStatus ? api.providerStatus() : null, null);
//   const emailStatus = providerStatus?.email?.status || "Not configured";
//   const lastChecked = providerStatus?.lastChecked || providerStatus?.checkedAt || new Date().toISOString();
//   const recommendedAction = (status) => {
//     const text = String(status || "").toLowerCase();
//     if (text.includes("error")) return "Review credentials and provider logs.";
//     if (text.includes("not")) return "Configure environment variables before go-live.";
//     return "Monitor during smoke tests.";
//   };
//   const providerClass = (status) => {
//     const text = String(status || "").toLowerCase();
//     if (text.includes("error")) return "status-blocked";
//     if (text.includes("not")) return "status-draft";
//     return "status-active";
//   };
//   const providers = [
//     ["MongoDB Atlas", providerStatus?.mongodb?.status || configured, "Database"],
//     ["Resend", emailStatus, "Email provider"],
//     ["Cloudflare R2", providerStatus?.storage?.status || storage.status || "Not configured", "File storage"],
//     ["Sentry", providerStatus?.sentry?.status || "Not configured", "Error tracking"],
//     ["Better Stack", providerStatus?.betterStack?.status || "Not configured", "Backend logs"],
//     ["Razorpay", providerStatus?.razorpay?.status || "Not configured", "Online payments"]
//   ];
//   return `
//     <div class="provider-grid">
//       ${providers.map(([name, status, note]) => `
//         <div class="provider-card">
//           <div class="provider-card-head">
//             <span>${escapeHtml(name)}</span>
//             ${badge(status, providerClass(status))}
//           </div>
//           <small>${escapeHtml(note)}</small>
//           <small>Last checked: ${escapeHtml(formatDateTime(lastChecked))}</small>
//           <small>${escapeHtml(recommendedAction(status))}</small>
//         </div>
//       `).join("")}
//     </div>
//   `;
// }

// function uploadValidation(validation) {
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>Validation results</h3><span class="badge ${validation.issueRows ? "risk-medium" : "status-active"}">${validation.issueRows} issues</span></div>
//       <div class="metric-grid small">
//         ${metricCard("Total rows", validation.totalRows, "Uploaded")}
//         ${metricCard("Valid rows", validation.validRows, "Ready")}
//         ${metricCard("Rows with issues", validation.issueRows, "Needs review")}
//         ${metricCard("Duplicates", validation.duplicateRecords, "Detected")}
//         ${metricCard("Missing values", validation.missingValues, "Fix or assign")}
//         ${metricCard("Format errors", validation.formatErrors, "Review")}
//       </div>
//       ${validation.issues.length ? table(["Row", "Severity", "Issue", "Action"], validation.issues.map((issue) => [
//         issue.row,
//         badge(issue.severity, riskClass(issue.severity)),
//         issue.message,
//         "Fix, assign, ignore with reason, or re-upload"
//       ])) : `<div class="empty">All rows passed basic validation.</div>`}
//     </section>
//   `;
// }

// function simpleOpsPage(title, rows, keys) {
//   const collection = title.includes("Inventory") ? "inventory" : title.includes("Staff") ? "staff" : title.includes("Beds") ? "beds" : title.includes("Incidents") ? "incidents" : null;
//   return `
//     <section class="panel">
//       <div class="panel-head"><h3>${escapeHtml(title)}</h3><span class="badge status-active">${rows.length} records</span></div>
//       ${rows.length ? table([...keys.map(titleCase), "Actions"], rows.map((row) => [...keys.map((key) => {
//         const value = row[key];
//         if (["status", "risk"].includes(key)) return badge(value, key === "risk" ? riskClass(value) : statusClass(value));
//         return value;
//       }), gridActions(collection, row.id)])) : emptyState(`No ${title.toLowerCase()} records visible for your access scope.`)}
//     </section>
//   `;
// }

// function unauthorizedPage(page = pageFromHash()) {
//   return accessDeniedPanel(page);
// }

// function table(headers, rows) {
//   if (!rows.length) return emptyState("No records found.");
//   const hasActionColumn = headers.some((header) => /actions?/i.test(String(header)));
//   const normalizedRows = rows.map((row) => {
//     if (Array.isArray(row)) return { cells: row, attrs: {} };
//     return {
//       cells: Array.isArray(row?.cells) ? row.cells : Array.isArray(row?.row) ? row.row : [],
//       attrs: row?.attrs || {}
//     };
//   });
//   const rowAttributes = (attrs = {}) => Object.entries(attrs)
//     .filter(([, value]) => value !== undefined && value !== null && value !== false)
//     .map(([key, value]) => value === true ? ` ${key}` : ` ${key}="${escapeAttribute(value)}"`)
//     .join("");
//   return `
//     <div class="table-wrap ${hasActionColumn ? "has-sticky-actions" : ""}" role="region" aria-label="Data table" tabindex="0">
//       <table>
//         <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
//         <tbody>
//           ${normalizedRows.map((row) => `<tr${rowAttributes(row.attrs)}>${row.cells.map((cell) => `<td>${cell && String(cell).includes("<") ? cell : escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
//         </tbody>
//       </table>
//     </div>
//   `;
// }

// function gridActions(collection, id) {
//   if (!collection || !id) return "";
//   const module = COLLECTION_MODULES[collection];
//   const edit = module && hasPermission(currentUser, module, "edit")
//     ? `<button class="icon-button" type="button" data-action="open-edit" data-collection="${escapeHtml(collection)}" data-id="${escapeHtml(id)}" title="Edit ${collection === "patients" ? "patient" : "record"}" aria-label="Edit ${collection === "patients" ? "patient" : "record"}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>`
//     : "";
//   const remove = module && hasPermission(currentUser, module, "delete")
//     ? `<button class="icon-button danger" type="button" data-action="delete-record" data-collection="${escapeHtml(collection)}" data-id="${escapeHtml(id)}" title="Delete ${collection === "patients" ? "patient" : "record"}" aria-label="Delete ${collection === "patients" ? "patient" : "record"}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg></button>`
//     : "";
//   return `<div class="grid-actions">${edit}${remove || ""}</div>`;
// }

// function gridAddButton(label, formAction) {
//   const moduleMap = {
//     "create-hospital": "hospitals",
//     "create-branch": "branches",
//     "create-ward": "wards",
//     "create-bed": "beds",
//     "create-user": "users",
//     "create-subscription": "subscriptions",
//     "create-offer": "offers",
//     "schedule-surgery": "ot",
//     "order-radiology": "radiology",
//     "register-death": "mortuary",
//     "create-permission-template": "permissionTemplates",
//     "create-master-data": "masterData",
//     "create-appointment": "appointments",
//     "register-patient": "patients",
//     "create-task": "tasks",
//     "generate-bill": "billing",
//     "add-stock": "stock"
//   };
//   const module = moduleMap[formAction];
//   const action = formAction === "create-user" ? "manageUsers" : "create";
//   if (module && !hasPermission(currentUser, module, action)) return "";
//   return `<button class="button small soft" type="button" title="Add ${escapeHtml(label)}" aria-label="Add ${escapeHtml(label)}" data-action="open-create" data-form-action="${escapeHtml(formAction)}" data-testid="${escapeHtml(addButtonTestId(formAction))}">${iconLabel(actionIcon(formAction), `Add ${label}`)}</button>`;
// }

// function wireCreateButtons() {
//   app.querySelectorAll?.('[data-action="open-create"][data-form-action]').forEach((button) => {
//     if (button.dataset.createBound === "true") return;
//     button.dataset.createBound = "true";
//     button.addEventListener("click", (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       const formAction = String(event.currentTarget.dataset.formAction || "").trim();
//       if (!formAction || !createForm(formAction)) {
//         toast("This form is unavailable for your current access.", "error");
//         return;
//       }
//       createTarget = formAction;
//       render();
//     });
//   });
// }

// function createModal() {
//   if (!createTarget) return "";
//   const form = createForm(createTarget);
//   if (!form) return "";
//   return `
//     <div class="modal-backdrop" data-testid="create-modal-backdrop" role="presentation">
//       <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
//         <div class="panel-head">
//           <div>
//             <p class="eyebrow">Add new</p>
//             <h3 id="create-modal-title" data-testid="modal-title">${escapeHtml(form.title)}</h3>
//             <p>${escapeHtml(form.note)}</p>
//           </div>
//           <button class="icon-button" type="button" data-action="close-create" data-testid="modal-close-button">Close</button>
//         </div>
//         ${form.html}
//       </section>
//     </div>
//   `;
// }

// function allowedCreatorRoleOptions() {
//   if (currentUser.role === ROLES.SUPER_ADMIN) return `<option value="${ROLES.HOSPITAL_ADMIN}">Hospital Admin</option>`;
//   if (currentUser.role === ROLES.HOSPITAL_ADMIN) return `<option value="${ROLES.BRANCH_ADMIN}">Branch Admin</option>`;
//   if (currentUser.role === ROLES.BRANCH_ADMIN) return `<option value="${ROLES.BRANCH_USER}">Branch User</option>`;
//   return "";
// }

// function jobRoleOptions() {
//   return [
//     "Reception User",
//     "Doctor",
//     "Duty Doctor",
//     "Nurse",
//     "Lab User",
//     "Radiology User",
//     "Pharmacy User",
//     "Billing User",
//     "Claims Officer",
//     "HR / Staff Admin",
//     "Inventory Officer",
//     "Quality Officer",
//     "Incident Officer",
//     "Branch Manager",
//     "Custom Role"
//   ].map((role) => `<option>${role}</option>`).join("");
// }

// function uniquePages(pages) {
//   return [...new Set(pages.filter(Boolean))];
// }

// function userPageCheckboxGroups() {
//   const preset = uniquePages(USER_ROLE_PRESETS["Reception User"]);
//   return USER_PERMISSION_GROUPS.map((group) => {
//     const uniqueGroupPages = [];
//     const seen = new Set();
//     group.pages.forEach(([route, label, sensitive]) => {
//       if (seen.has(`${route}:${label}`)) return;
//       seen.add(`${route}:${label}`);
//       uniqueGroupPages.push([route, label, sensitive]);
//     });
//     const checkedCount = uniqueGroupPages.filter(([route]) => preset.includes(route)).length;
//     return `
//       <fieldset class="permission-group" data-testid="${group.testId}" data-permission-group="${group.key}">
//         <legend><span>${escapeHtml(group.label)}</span><small data-group-count="${group.key}">${checkedCount} selected</small></legend>
//         <div class="permission-tools">
//           <button class="button tiny" type="button" data-action="select-permission-group" data-group="${group.key}">Select all</button>
//           <button class="button tiny ghost" type="button" data-action="clear-permission-group" data-group="${group.key}">Clear</button>
//         </div>
//         <div class="checkbox-grid">
//           ${uniqueGroupPages.map(([route, label, sensitive]) => {
//             const disabled = currentUser.role === ROLES.BRANCH_ADMIN && ["users", "settings"].includes(route);
//             return `
//               <label class="check-card ${sensitive ? "sensitive" : ""} ${disabled ? "disabled" : ""}">
//                 <input type="checkbox" name="allowedPages" value="${escapeHtml(route)}" data-page-label="${escapeHtml(label)}" data-group="${group.key}" ${preset.includes(route) ? "checked" : ""} ${disabled ? "disabled" : ""} />
//                 <span>${escapeHtml(label)}</span>
//                 ${sensitive ? `<small>Sensitive</small>` : ""}
//               </label>
//             `;
//           }).join("")}
//         </div>
//       </fieldset>
//     `;
//   }).join("");
// }

// function permissionMatrixRows() {
//   const defaultModules = uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
//   return `
//     <div class="permission-matrix" data-testid="permission-matrix">
//       <div class="matrix-row matrix-head">
//         <span>Module</span>
//         ${USER_PERMISSION_ACTIONS.map(([, label]) => `<span>${escapeHtml(label)}</span>`).join("")}
//       </div>
//       ${defaultModules.map((module) => `
//         <div class="matrix-row" data-permission-row="${module}">
//           <strong>${escapeHtml(titleCase(module))}</strong>
//           ${USER_PERMISSION_ACTIONS.map(([action]) => `
//             <label class="matrix-check ${SENSITIVE_USER_PERMISSIONS.has(action) ? "sensitive" : ""}">
//               <input type="checkbox" name="permission:${module}" value="${action}" ${["view", "create", "edit"].includes(action) && !SENSITIVE_USER_PERMISSIONS.has(action) ? "checked" : ""} />
//               <span>${escapeHtml(action)}</span>
//             </label>
//           `).join("")}
//         </div>
//       `).join("")}
//     </div>
//   `;
// }

// function userAccessPreview() {
//   const allowed = USER_ROLE_PRESETS["Reception User"];
//   const allPages = uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
//   const blocked = allPages.filter((route) => !allowed.includes(route)).slice(0, 8);
//   return `
//     <div class="access-preview" data-testid="permission-preview-panel">
//       <div>
//         <h4>This user will see</h4>
//         <ul data-preview-allowed>${allowed.slice(0, 10).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("")}</ul>
//       </div>
//       <div>
//         <h4>This user will NOT see</h4>
//         <ul data-preview-blocked>${blocked.map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("")}</ul>
//       </div>
//     </div>
//   `;
// }

// function cloneUserOptions() {
//   return api.users(currentUser)
//     .filter((user) => user.role === ROLES.BRANCH_USER && user.branchId === currentUser.branchId)
//     .map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)} · ${escapeHtml(user.jobRole || "Custom Role")}</option>`)
//     .join("");
// }

// function permissionTemplateOptions() {
//   return api.permissionTemplates(currentUser)
//     .map((template) => `<option value="${escapeHtml(template.id)}">${escapeHtml(template.templateName || template.name)} · ${escapeHtml(template.scope || "Default")}</option>`)
//     .join("");
// }

// function branchDepartmentOptions() {
//   const departments = safeOptionalData(() => api.masterDataItems(currentUser), [])
//     .filter((item) => ["department", "departments", "dept", "department master"].includes(String(item.type || "").trim().toLowerCase()))
//     .filter((item) => ["active", "enabled"].includes(String(item.status || "Active").trim().toLowerCase()))
//     .filter((item) => !currentUser.branchId || !item.branchId || String(item.branchId) === String(currentUser.branchId));
//   if (!departments.length) return "";
//   return departments.map((department) => `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`).join("");
// }

// function appointmentDepartmentOptions(options = {}) {
//   const departments = options.departments || [];
//   if (!departments.length) return `<option value="">No active departments configured</option>`;
//   return `<option value="">Select department</option>${departments.map((department) =>
//     `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`
//   ).join("")}`;
// }

// function appointmentDoctorOptions(options = {}) {
//   const doctors = options.doctors || [];
//   if (!doctors.length) return `<option value="">No active doctors configured</option>`;
//   return `<option value="">Select doctor</option>${doctors.map((doctor) =>
//     `<option value="${escapeHtml(doctor.name)}" data-department="${escapeHtml(doctor.department || "")}">${escapeHtml(doctor.name)}${doctor.department ? ` · ${escapeHtml(doctor.department)}` : ""}</option>`
//   ).join("")}`;
// }

// function filterAppointmentDoctors(form) {
//   const department = form?.querySelector("[data-appointment-department]")?.value || "";
//   const doctorSelect = form?.querySelector("[data-appointment-doctor]");
//   if (!doctorSelect) return;
//   let visibleDoctors = 0;
//   [...doctorSelect.options].forEach((option) => {
//     if (option.dataset.noDoctorOption === "true") {
//       option.remove();
//       return;
//     }
//     if (!option.value) {
//       option.hidden = false;
//       option.disabled = false;
//       return;
//     }
//     const optionDepartment = option.dataset.department || "";
//     const visible = !department || !optionDepartment || optionDepartment === department;
//     if (visible) visibleDoctors += 1;
//     option.hidden = !visible;
//     option.disabled = !visible;
//   });
//   if (department && visibleDoctors === 0) {
//     const option = document.createElement("option");
//     option.value = "";
//     option.dataset.noDoctorOption = "true";
//     option.textContent = "No doctors available for this department.";
//     doctorSelect.appendChild(option);
//   }
//   if (doctorSelect.selectedOptions[0]?.disabled) doctorSelect.value = "";
// }

// function fillAppointmentFromPatient(form) {
//   const select = form?.querySelector("[data-existing-patient]");
//   if (!select) return;
//   const option = select.selectedOptions[0];
//   const existing = Boolean(option?.value);
//   const fill = (name, value, lock = existing) => {
//     const input = form.elements[name];
//     if (!input) return;
//     input.value = value || "";
//     if (["patientName", "mobile", "age", "gender"].includes(name)) input.readOnly = lock;
//   };
//   fill("patientName", option?.dataset.name);
//   fill("mobile", option?.dataset.mobile);
//   fill("age", option?.dataset.age);
//   if (form.elements.gender) form.elements.gender.value = option?.dataset.gender || "Male";
//   if (form.elements.gender) form.elements.gender.disabled = existing;
//   fill("mrn", option?.dataset.mrn, true);
//   fill("dob", option?.dataset.dob, true);
//   fill("email", option?.dataset.email, true);
//   fill("emergencyContact", option?.dataset.emergencyContact, true);
//   fill("allergies", option?.dataset.allergies, true);
// }

// function branchUserPermissionBuilder(branches) {
//   const assignedBranch = branches.find((branch) => String(branch.id) === String(currentUser.branchId)) || {};
//   const assignedBranchType = assignedBranch.branchType || currentUser.branchType || "Main Branch";
//   const assignedBranchLabel = [
//     assignedBranch.name || currentUser.branchName || "Assigned branch",
//     currentUser.branchId ? `ID: ${currentUser.branchId}` : ""
//   ].filter(Boolean).join(" / ");
//   const departmentOptions = branchDepartmentOptions();
//   const canCreateStaff = Boolean(currentUser.branchId && departmentOptions);
//   const clones = cloneUserOptions();
//   const templates = permissionTemplateOptions();
//   return `
//     <form class="user-wizard" data-action="create-user">
//       <section class="wizard-step">
//         <div class="step-index">1</div>
//         <div>
//           <h4>Basic Details</h4>
//           <p>Create a staff login. Temporary password is shown only in this confirmation flow.</p>
//           <div class="form-grid compact-grid">
//             <label>Full name<input name="name" required placeholder="Asha Kumar" data-testid="user-form-name" /></label>
//             <label>Login username<input name="email" type="text" required placeholder="asha-login" autocomplete="username" data-testid="user-form-username" /></label>
//             <label>Email<input name="contactEmail" type="email" placeholder="asha@hospital.com" data-testid="user-form-email" /></label>
//             <label>Mobile number<input name="mobile" placeholder="9876543210" /></label>
//             ${passwordField({ label: "Temporary password", name: "password", minlength: 8, autocomplete: "new-password", testid: "user-form-temp-password" })}
//             <label>Account status<select name="status"><option>Active</option><option>Pending Invite</option><option>Disabled</option></select></label>
//             <label class="check-line span-2"><input type="checkbox" name="mustChangePassword" value="Yes" checked /> Must change password on first login</label>
//             <input type="hidden" name="role" value="${ROLES.BRANCH_USER}" data-testid="form-role" />
//           </div>
//         </div>
//       </section>

//       <section class="wizard-step">
//         <div class="step-index">2</div>
//         <div>
//           <h4>Job Role</h4>
//           <p data-role-preset-message>Default access preset applied for Reception User. You can adjust allowed pages before saving.</p>
//           <div class="form-grid compact-grid">
//             <label>Job role<select name="jobRole" data-testid="user-form-job-role">${jobRoleOptions()}</select></label>
//             <label>Department${departmentOptions ? `<select name="department" required data-testid="user-form-department"><option value="">Select department</option>${departmentOptions}</select>` : `<select name="department" required disabled data-testid="user-form-department"><option value="">Create department master data first</option></select>`}</label>
//             <label>Apply permission template<select name="templateId" data-testid="permission-template-select"><option value="">Use job role preset</option>${templates}</select></label>
//             <label class="span-2">Clone permissions from existing user<select name="cloneFromUserId" data-testid="clone-user-select"><option value="">Do not clone</option>${clones}</select></label>
//           </div>
//           ${departmentOptions ? "" : `<div class="notice subtle">No active departments are configured for this branch yet. Add departments in Master Data before saving staff users.</div>`}
//           <p class="helper-text">Clone/template copies only job role, allowed pages, and permission matrix. It never copies password, login status, audit history, or personal details.</p>
//         </div>
//       </section>

//       <section class="wizard-step">
//         <div class="step-index">3</div>
//         <div>
//           <h4>Branch Assignment</h4>
//           <p>This is filled from the logged-in Branch Admin and cannot be changed.</p>
//           <div class="form-grid compact-grid">
//             <label>Branch (${escapeHtml(assignedBranchType)})<input value="${escapeHtml(assignedBranchLabel)}" readonly data-testid="user-form-branch-display" /></label>
//             <input type="hidden" name="branchId" value="${escapeHtml(currentUser.branchId || "")}" data-testid="user-form-branch" />
//             <label class="check-line span-2"><input type="checkbox" name="shiftOnly" value="Yes" /> Allow login only during assigned shift</label>
//           </div>
//         </div>
//       </section>

//       <section class="wizard-step">
//         <div class="step-index">4</div>
//         <div>
//           <h4>Allowed Pages / Modules</h4>
//           <p>Sidebar visibility and direct URL access both use these assigned pages.</p>
//           <input class="panel-search" placeholder="Search pages or modules" data-testid="permissions-search-input" data-permission-search />
//           <div class="permission-groups">${userPageCheckboxGroups()}</div>
//           <input type="hidden" name="allowedModules" data-allowed-modules value="${escapeHtml(USER_ROLE_MODULES["Reception User"].join(","))}" />
//         </div>
//       </section>

//       <section class="wizard-step">
//         <div class="step-index">5</div>
//         <div>
//           <h4>Permission Matrix</h4>
//           <p>View is required before create, edit, export, or sensitive actions can be used.</p>
//           ${permissionMatrixRows()}
//           <div class="notice subtle hidden" data-testid="sensitive-permission-warning" data-sensitive-warning>
//             Sensitive permission selected. Add a reason and confirm before saving.
//           </div>
//           <label class="span-2">Reason for sensitive access<textarea name="sensitiveReason" placeholder="Required for export, delete, refund, manage users, or manage settings."></textarea></label>
//           <label class="check-line"><input type="checkbox" name="sensitiveConfirmed" value="Yes" /> I confirm sensitive access is required</label>
//         </div>
//       </section>

//       <section class="wizard-step">
//         <div class="step-index">6</div>
//         <div>
//           <div class="panel-head tight">
//             <div><h4>Access Preview</h4><p>Review what this user can and cannot open.</p></div>
//             <button class="button small" type="button" data-action="preview-permissions" data-testid="permission-preview-button">Preview User Access</button>
//           </div>
//           ${userAccessPreview()}
//         </div>
//       </section>

//       <section class="wizard-step">
//         <div class="step-index">7</div>
//         <div>
//           <h4>Save User / Send Invite</h4>
//           <p>Save creates the account now. Send invite keeps the account pending until password setup.</p>
//           ${canCreateStaff ? "" : `<div class="notice subtle">Create at least one active Department in Master Data for this branch before creating staff users.</div>`}
//         </div>
//       </section>
//       <div class="wizard-sticky-footer">
//         <span class="wizard-sticky-footer-label">Step 7 of 7 — ready to save</span>
//         <div class="button-row">
//           <button class="button primary" type="submit" data-testid="save-user-button">Save User</button>
//           <button class="button soft" type="submit" name="inviteMode" value="Yes" data-testid="send-invite-button">Send Invite</button>
//         </div>
//       </div>
//     </form>
//   `;
// }

// function createForm(action) {
//   const hospitals = hasPermission(currentUser, "hospitals", "view") ? safeOptionalData(() => api.hospitals(currentUser)) : [];
//   const branches = hasPermission(currentUser, "branches", "view") ? safeOptionalData(() => api.branches(currentUser)) : [];
//   const patientFormActions = new Set([
//     "register-patient",
//     "create-appointment",
//     "record-vitals",
//     "complete-consultation",
//     "book-followup",
//     "create-admission",
//     "generate-bill",
//     "upload-document",
//     "create-consent",
//     "submit-feedback"
//   ]);
//   const patients = patientFormActions.has(action) && hasPermission(currentUser, "patients", "view")
//     ? safeOptionalData(() => api.patients(currentUser))
//     : [];
//   const appointmentLookup = action === "create-appointment" ? safeOptionalData(() => api.appointmentOptions(currentUser), { departments: [], doctors: [] }) : { departments: [], doctors: [] };
//   const activePlans = currentUser.role === ROLES.SUPER_ADMIN ? safeOptionalData(() => api.subscriptions(currentUser)).filter((plan) => plan.status !== "Disabled") : [];
//   const mainBranchExists = branches.some((branch) => (branch.branchType || "Main Branch") === "Main Branch");
//   const wardsForBedForm = action === "create-bed" && hasPermission(currentUser, "wards", "view") ? safeOptionalData(() => api.wards(currentUser), []) : [];
//   const admissionsForManage = action === "manage-admission" ? safeOptionalData(() => api.admissions(currentUser), []) : [];
//   const managedAdmission = admissionsForManage.find((item) => String(item.id || item._id) === String(selectedAdmissionId)) || null;
//   const managePatients = action === "manage-admission" ? safeOptionalData(() => api.patients(currentUser), []) : [];
//   const managedPatient = managePatients.find((item) => String(item.id) === String(managedAdmission?.patientId)) || null;
//   const manageWards = action === "manage-admission" ? safeOptionalData(() => api.wards(currentUser), []).filter((item) => !item.branchId || String(item.branchId) === String(currentUser.branchId)) : [];
//   const manageBeds = action === "manage-admission" ? safeOptionalData(() => api.beds(currentUser), []).filter((item) => (!item.branchId || String(item.branchId) === String(currentUser.branchId)) && ["Available", "Cleaning"].includes(item.status || "Available")) : [];
//   const reviewQueue = action === "review-opd-vitals" ? safeOptionalData(() => api.queueTokens(currentUser), []) : [];
//   const reviewedToken = reviewQueue.find((item) => String(item.id) === String(selectedQueueTokenId));
//   const reviewPatients = action === "review-opd-vitals" ? safeOptionalData(() => api.patients(currentUser), []) : [];
//   const reviewedPatient = reviewPatients.find((item) => String(item.id) === String(reviewedToken?.patientId));
//   const reviewedVitals = action === "review-opd-vitals" ? safeOptionalData(() => api.vitals(currentUser), []).filter((item) => String(item.patientId) === String(reviewedToken?.patientId) && (String(item.queueTokenId || "") === String(reviewedToken?.id) || String(item.appointmentId || "") === String(reviewedToken?.appointmentId))).sort((a,b) => new Date(b.recordedAt || b.createdAt || 0) - new Date(a.recordedAt || a.createdAt || 0))[0] : null;
//   const userRoleOptions = allowedCreatorRoleOptions();
//   const hospitalBranchOptions = branches.length
//     ? `<option value="">Select branch</option>${branches.map((branch) => {
//         const label = `${branch.branchType || "Main Branch"}: ${branch.name}${branch.branchCode ? ` (${branch.branchCode})` : ""}`;
//         return `<option value="${escapeHtml(branch.id)}">${escapeHtml(label)}</option>`;
//       }).join("")}`
//     : `<option value="">Create a branch first</option>`;
//   const forms = {
//     "review-opd-vitals": reviewedToken && reviewedVitals ? { title:"Review OPD Vitals", note:"Read-only Nurse-recorded vitals for this OPD encounter.", html:`<div class="notice subtle"><strong>${escapeHtml(reviewedPatient?.name || reviewedToken.patientName || "Unknown Patient")}</strong><br>${escapeHtml(reviewedPatient?.mrn || reviewedToken.mrn || "-")} · Token ${escapeHtml(reviewedToken.tokenNumber || "-")} · ${escapeHtml(reviewedToken.appointmentId || "-")} · ${escapeHtml(reviewedToken.department || "-")} · ${escapeHtml(reviewedToken.doctor || currentUser.name || "-")}</div><div class="mini-grid"><span><strong>${escapeHtml(reviewedVitals.temperature || "-")}</strong><small>Temperature</small></span><span><strong>${escapeHtml(reviewedVitals.bloodPressure || "-")}</strong><small>Blood Pressure</small></span><span><strong>${escapeHtml(reviewedVitals.pulse || "-")}</strong><small>Pulse</small></span><span><strong>${escapeHtml(reviewedVitals.respiratoryRate || "-")}</strong><small>Respiratory Rate</small></span><span><strong>${escapeHtml(reviewedVitals.spo2 || "-")}</strong><small>SpO2</small></span><span><strong>${escapeHtml(reviewedVitals.bloodSugar || "-")}</strong><small>Blood Sugar</small></span><span><strong>${escapeHtml(reviewedVitals.painScore || "-")}</strong><small>Pain Score</small></span><span><strong>${escapeHtml(reviewedVitals.recordedBy || "-")}</strong><small>Recorded By</small></span></div><div class="notice subtle">Symptoms: ${escapeHtml(reviewedVitals.symptoms || "-")}<br>Notes: ${escapeHtml(reviewedVitals.notes || "-")}<br>Recorded: ${escapeHtml(formatDateTime(reviewedVitals.recordedAt || reviewedVitals.createdAt))}</div>` } : null,
//     "manage-admission": managedAdmission ? {
//       title: "Manage Admission",
//       note: "Assign an available ward and bed to this admission request.",
//       html: `<form class="form-grid compact-grid" data-action="assign-admission-bed">
//         <input type="hidden" name="admissionId" value="${escapeHtml(managedAdmission.id)}" />
//         <div class="notice subtle span-2"><strong>${escapeHtml(managedPatient?.name || managedAdmission.patientName || "Unknown Patient")}</strong><br>${escapeHtml(managedPatient?.mrn || managedAdmission.mrn || "MRN unavailable")} · ${escapeHtml(managedAdmission.id)} · ${escapeHtml(managedAdmission.department || "Department pending")} · ${escapeHtml(managedAdmission.admittingDoctor || "Doctor pending")} · ${escapeHtml(managedAdmission.admissionType || "Admission")} · ${escapeHtml(managedAdmission.reason || "Reason not recorded")} · ${escapeHtml(managedAdmission.status || managedAdmission.admissionStatus || "Admission Requested")}</div>
//         <label>Ward<select name="wardId" required data-admission-ward><option value="">Select ward</option>${manageWards.map((ward) => `<option value="${escapeHtml(ward.id)}">${escapeHtml(ward.name || ward.wardName || ward.ward)}</option>`).join("")}</select></label>
//         <label>Bed<select name="bedId" required data-admission-bed><option value="">Select available bed</option>${manageBeds.map((bed) => `<option value="${escapeHtml(bed.id)}" data-ward-id="${escapeHtml(bed.wardId || "")}">${escapeHtml(bed.bed || bed.bedNumber || bed.name)}</option>`).join("")}</select></label>
//         <button class="button primary" type="submit">Save Ward / Bed</button>
//       </form>`
//     } : null,
//     "create-hospital": {
//       title: "Hospital customer",
//       note: "Create the hospital group first. Admin login can be created from Admin Users.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-hospital">
//           <label>Hospital name<input name="name" required placeholder="Metro Health Group" /></label>
//           <label>Owner name<input name="owner" required placeholder="Owner or CEO" /></label>
//           <label class="span-2">Plan<select name="plan">${activePlans.length ? activePlans.map((plan) => `<option value="${escapeAttribute(plan.name)}">${escapeHtml(plan.name)} — ${escapeHtml(plan.branches ?? 0)} branches · ${escapeHtml(plan.users ?? 0)} users · ${escapeHtml(plan.storageGb ?? 0)} GB storage</option>`).join("") : `<option>Growth</option>`}</select></label>
//           <div class="notice subtle span-2">Branch limit, user limit, and storage limit are set from the selected plan. Manage plan limits from Subscriptions.</div>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create hospital</button>
//         </form>`
//     },
//     "create-branch": {
//       title: "Hospital branch",
//       note: "One Main Branch is allowed. Extra locations become Sub Branches.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-branch">
//           <label>Branch name<input name="name" required placeholder="Main Branch" /></label>
//           <label>Branch type<select name="branchType">
//             <option ${mainBranchExists ? "disabled" : "selected"}>Main Branch</option>
//             <option ${mainBranchExists ? "selected" : ""}>Sub Branch</option>
//           </select></label>
//           <label>City<input name="city" required placeholder="Mumbai" /></label>
//           <label>Beds<input name="beds" type="number" value="80" /></label>
//           <label>Rooms<input name="rooms" type="number" value="45" /></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create branch</button>
//         </form>`
//     },
//     "create-ward": {
//       title: "Ward",
//       note: "Wards group beds by floor and department for admission and occupancy tracking.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-ward">
//           <label>Ward name<input name="name" required placeholder="Ward A" /></label>
//           <label>Floor<input name="floor" placeholder="2nd Floor" /></label>
//           <label>Department<select name="department">${branchDepartmentOptions() || `<option value="">No active departments configured</option>`}</select></label>
//           <label>Total beds<input name="totalBeds" type="number" min="1" value="10" /></label>
//           <label>Status<select name="status"><option>Active</option><option>Inactive</option></select></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create ward</button>
//         </form>`
//     },
//     "create-bed": {
//       title: "Bed",
//       note: "Add a bed to an existing ward so it can be assigned during admission.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-bed">
//           <label>Bed number<input name="bed" required placeholder="A-101" /></label>
//           <label>Ward<select name="ward" required>${wardsForBedForm.length
//             ? `<option value="">Select ward</option>${wardsForBedForm.map((ward) => `<option value="${escapeHtml(ward.name)}">${escapeHtml(ward.name)}</option>`).join("")}`
//             : `<option value="">Create a ward first</option>`}</select></label>
//           <label>Room<input name="room" placeholder="Room 204" /></label>
//           <label>Status<select name="status"><option>Available</option><option>Reserved</option><option>Cleaning</option><option>Maintenance</option></select></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create bed</button>
//         </form>`
//     },
//     "create-user": {
//       title: currentUser.role === ROLES.SUPER_ADMIN ? "Hospital admin login" : currentUser.role === ROLES.HOSPITAL_ADMIN ? "Branch admin login" : "Branch staff login",
//       note: currentUser.role === ROLES.BRANCH_ADMIN
//         ? "Create branch staff, choose a job role, assign pages, preview access, then save."
//         : currentUser.role === ROLES.HOSPITAL_ADMIN
//           ? "Create a Branch Admin or Sub-Branch Admin assigned to one branch. Staff users are created inside that branch by the Branch Admin."
//           : "Create the next admin level in the hospital hierarchy.",
//       html: currentUser.role === ROLES.BRANCH_ADMIN ? branchUserPermissionBuilder(branches) : `
//         <form class="form-grid compact-grid" data-action="create-user">
//           <label>Name<input name="name" required placeholder="Asha Kumar" data-testid="user-form-name" /></label>
//           <label>Login username<input name="email" type="text" required placeholder="asha-login" autocomplete="username" data-testid="user-form-username" /></label>
//           <label>Email<input name="contactEmail" type="email" placeholder="asha@hospital.com" data-testid="user-form-email" /></label>
//           ${passwordField({ label: "Temporary password", name: "password", minlength: 8, autocomplete: "new-password", testid: "user-form-temp-password" })}
//           <label>Role<select name="role" data-testid="form-role">${userRoleOptions}</select></label>
//           <input type="hidden" name="jobRole" value="${currentUser.role === ROLES.SUPER_ADMIN ? "Hospital Admin" : "Branch Admin"}" data-testid="user-form-job-role" />
//           ${currentUser.role === ROLES.SUPER_ADMIN ? `<label>Hospital<select name="hospitalId" required data-testid="form-hospital"><option value="">Select hospital</option>${hospitals.map((hospital) => `<option value="${hospital.id}">${escapeHtml(hospital.name)}</option>`).join("")}</select></label>` : ""}
//           ${currentUser.role === ROLES.HOSPITAL_ADMIN ? `<label>Hospital group branches<select name="branchId" required data-testid="user-form-branch">${hospitalBranchOptions}</select></label>` : ""}
//           <label>Account status<select name="status"><option>Active</option><option>Pending Invite</option><option>Disabled</option></select></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">${currentUser.role === ROLES.HOSPITAL_ADMIN ? "Create branch admin" : "Create user"}</button>
//         </form>`
//     },
//     "create-master-data": {
//       title: "Master record",
//       note: "Add one setup item such as department, doctor, ward, service, medicine, or threshold.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-master-data">
//           <label>Type<select name="type"><option>Department</option><option>Doctor</option><option>Nurse</option><option>Ward</option><option>Room</option><option>Bed</option><option>Service Price</option><option>Consultation Service</option><option>Lab Test</option><option>Radiology Test</option><option>Medicine</option><option>Inventory Item</option><option>Insurance Company</option><option>Payment Mode</option><option>Appointment Slot</option><option>Alert Threshold</option></select></label>
//           <label>Name<input name="name" required placeholder="Neurology or Consultation Fee" /></label>
//           <label>Code<input name="code" placeholder="NEUR" /></label>
//           <label>Department<input name="department" placeholder="OPD" /></label>
//           <label>Category<select name="category"><option></option><option>Registration Fee</option><option>Consultation Fee</option><option>Lab Test Fee</option><option>Radiology Fee</option><option>Procedure Fee</option><option>Bed Charges</option><option>Nursing Charges</option><option>Pharmacy Item Price</option><option>Emergency Charges</option><option>Package Charges</option></select></label>
//           <label>Price<input name="price" type="number" value="0" /></label>
//           <label>Tax %<input name="taxPercentage" type="number" value="0" /></label>
//           <label>Effective from<input name="effectiveFrom" type="date" value="${localDateInputValue()}" /></label>
//           <label class="span-2">Description<textarea name="description" placeholder="Short description"></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create master record</button>
//         </form>`
//     },
//     "create-permission-template": {
//       title: "Permission template",
//       note: "Create a reusable permission preset from a job role. You can adjust user access again before saving a user.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-permission-template">
//           <label>Template name<input name="templateName" required placeholder="Senior Reception Preset" /></label>
//           <label>Job role<select name="jobRole" data-testid="template-job-role">${jobRoleOptions()}</select></label>
//           <label>Scope<select name="scope"><option>${currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital Scope" : "Branch Scope"}</option><option>Branch Scope</option></select></label>
//           <label>Status<select name="status"><option>Active</option><option>Inactive</option></select></label>
//           <label class="span-2">Allowed pages<input name="allowedPages" placeholder="Optional comma-separated page routes; leave blank to use selected job role preset" /></label>
//           <label class="span-2">Allowed modules<input name="allowedModules" placeholder="Optional comma-separated modules; leave blank to use selected job role preset" /></label>
//           <div class="notice subtle span-2">Sensitive permissions in a template will show warnings during user review and are audited when the template is created or applied.</div>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create template</button>
//         </form>`
//     },
//     "create-subscription": {
//       title: "Subscription plan",
//       note: "Create a SaaS plan with limits, storage, support level, and enabled modules.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-subscription">
//           <label>Plan name<input name="name" required placeholder="Growth" /></label>
//           <label>Monthly price<input name="monthlyPrice" type="number" min="0" value="0" /></label>
//           <label>Yearly price<input name="yearlyPrice" type="number" min="0" value="0" /></label>
//           <label>Max branches<input name="branches" type="number" min="1" value="3" /></label>
//           <label>Max users<input name="users" type="number" min="1" value="80" /></label>
//           <label>Storage limit, GB<input name="storageGb" type="number" min="1" value="50" /></label>
//           <label>Support level<select name="supportLevel"><option>Standard</option><option>Priority</option><option>Enterprise</option></select></label>
//           <label>Status<select name="status"><option>Draft</option><option selected>Active</option><option>Disabled</option></select></label>
//           <label class="span-2">Enabled modules<textarea name="modules" placeholder="Appointments, Billing, Pharmacy, Reports">${escapeHtml(MASTER_MODULES.slice(0, 8).join(", "))}</textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create plan</button>
//         </form>`
//     },
//     "create-offer": {
//       title: "Offer / coupon",
//       note: "Create a discount offer Super Admin can apply to subscription plans.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-offer">
//           <label>Offer name<input name="name" required placeholder="New Year Launch" /></label>
//           <label>Coupon code<input name="code" required placeholder="NY2026" style="text-transform:uppercase" /></label>
//           <label>Discount type<select name="discountType"><option value="Percent" selected>Percent (%)</option><option value="Flat">Flat amount</option></select></label>
//           <label>Discount value<input name="discountValue" type="number" min="0" value="10" /></label>
//           <label>Valid from<input name="validFrom" type="date" /></label>
//           <label>Valid to<input name="validTo" type="date" /></label>
//           <label>Max redemptions<input name="maxRedemptions" type="number" min="0" value="0" placeholder="0 = unlimited" /></label>
//           <label>Status<select name="status"><option selected>Active</option><option>Draft</option><option>Disabled</option></select></label>
//           <label class="span-2">Applies to plans<input name="appliesToPlans" placeholder="All plans (or: Growth, Enterprise)" value="All plans" /></label>
//           <label class="span-2">Description<textarea name="description" placeholder="Promotion details shown to hospital admins."></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Create offer</button>
//         </form>`
//     },
//     "schedule-surgery": {
//       title: "Schedule surgery",
//       note: "Book an operation theatre slot and surgical team.",
//       html: `
//         <form class="form-grid compact-grid" data-action="schedule-surgery">
//           <label>Patient name<input name="patientName" required placeholder="Patient full name" /></label>
//           <label>MRN<input name="mrn" placeholder="MRN (optional)" /></label>
//           <label>Procedure / surgery<input name="procedure" required placeholder="e.g. Laparoscopic Appendectomy" /></label>
//           <label>Surgeon<input name="surgeon" required placeholder="Lead surgeon" /></label>
//           <label>Anaesthetist<input name="anaesthetist" placeholder="Anaesthetist" /></label>
//           <label>Theatre / OT room<input name="theatre" placeholder="e.g. OT-1" /></label>
//           <label>Scheduled date<input name="scheduledDate" type="date" required /></label>
//           <label>Scheduled time<input name="scheduledTime" type="time" /></label>
//           <label>Priority<select name="priority"><option selected>Elective</option><option>Urgent</option><option>Emergency</option></select></label>
//           <label>Anaesthesia type<select name="anaesthesiaType"><option>General</option><option>Regional / Spinal</option><option>Local</option><option>Sedation</option></select></label>
//           <label class="span-2">Pre-op checklist / notes<textarea name="preOpChecklist" placeholder="Consent signed, fasting confirmed, investigations ready, cross-match done..."></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Schedule surgery</button>
//         </form>`
//     },
//     "register-death": {
//       title: "Register death / receive body",
//       note: "Record a death in the mortuary register and assign cold-storage.",
//       html: `
//         <form class="form-grid compact-grid" data-action="register-death">
//           <label>Deceased name<input name="deceasedName" required placeholder="Full name of deceased" /></label>
//           <label>MRN<input name="mrn" placeholder="MRN (optional)" /></label>
//           <label>Age<input name="age" type="number" min="0" placeholder="Age" /></label>
//           <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
//           <label>Date of death<input name="dateOfDeath" type="date" required /></label>
//           <label>Time of death<input name="timeOfDeath" type="time" /></label>
//           <label>Cold-storage bay<input name="bayNumber" placeholder="e.g. Bay-3" /></label>
//           <label>Cause of death<input name="causeOfDeath" placeholder="Provisional cause" /></label>
//           <label>MLC case?<select name="mlcCase"><option value="">No</option><option value="true">Yes (medico-legal)</option></select></label>
//           <label>Brought in dead?<select name="broughtInDead"><option value="">No</option><option value="true">Yes</option></select></label>
//           <label class="span-2">Notes / identification marks<textarea name="notes" placeholder="Police station (if MLC), identification, belongings handed over..."></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Register death</button>
//         </form>`
//     },
//     "order-radiology": {
//       title: "Order imaging study",
//       note: "Raise a radiology / imaging order (RIS).",
//       html: `
//         <form class="form-grid compact-grid" data-action="order-radiology">
//           <label>Patient name<input name="patientName" required placeholder="Patient full name" /></label>
//           <label>MRN<input name="mrn" placeholder="MRN (optional)" /></label>
//           <label>Modality<select name="modality" required><option>X-Ray</option><option>CT</option><option>MRI</option><option>Ultrasound</option><option>Mammography</option><option>PET-CT</option><option>Fluoroscopy</option><option>DEXA</option><option>Angiography</option></select></label>
//           <label>Study / scan<input name="studyType" required placeholder="e.g. Chest PA, CT Brain plain" /></label>
//           <label>Body part / region<input name="bodyPart" placeholder="e.g. Chest, Brain" /></label>
//           <label>Priority<select name="priority"><option>Routine</option><option>Urgent</option><option>STAT</option></select></label>
//           <label>Referring doctor<input name="referredBy" placeholder="Ordering doctor" /></label>
//           <label class="span-2">Clinical history / reason<textarea name="clinicalHistory" placeholder="Relevant history and clinical question for the radiologist."></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Order study</button>
//         </form>`
//     },
//     "request-restore": {
//       title: "Restore request",
//       note: "Submit a restore request for approval. The app will not execute a destructive restore.",
//       html: `
//         <form class="form-grid compact-grid" data-action="request-restore">
//           <label>Requested by<input name="requestedBy" value="${escapeHtml(currentUser.name || currentUser.email)}" disabled /></label>
//           <label>Approval status<select name="approvalStatus"><option>Requested</option><option disabled>Approved</option><option disabled>Rejected</option><option disabled>Completed</option></select></label>
//           <label class="span-2">Restore reason<textarea name="notes" required placeholder="Explain what data needs review and why restore may be needed."></textarea></label>
//           <div class="notice subtle span-2">Restore execution remains manual in MongoDB Atlas and requires authorized approval outside this app.</div>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Submit restore request</button>
//         </form>`
//     },
//     "create-appointment": {
//       title: "Appointment",
//       note: "Book walk-in, phone, website, WhatsApp, referral, emergency, or follow-up visit.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-appointment">
//           <label>Patient name<input name="patientName" required data-testid="form-patient-name" /></label>
//           <label>Mobile<input name="mobile" required value="9876543210" data-testid="form-patient-mobile" /></label>
//           <label>Age<input name="age" type="number" value="46" data-testid="form-patient-age" /></label>
//           <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
//           <label>Source<select name="source"><option>Walk-in</option><option>Phone Call</option><option>Website</option><option>WhatsApp</option><option>Doctor Referral</option><option>Emergency</option><option>Follow-up</option></select></label>
//           <label>Visit type<select name="visitType"><option>New</option><option>Follow-up</option></select></label>
//           <label>Department<select name="department" required data-testid="form-department" data-appointment-department>${appointmentDepartmentOptions(appointmentLookup)}</select></label>
//           <label>Doctor<select name="doctor" required data-testid="form-doctor" data-appointment-doctor>${appointmentDoctorOptions(appointmentLookup)}</select></label>
//           <label>Date<input name="date" type="date" value="${localDateInputValue()}" data-testid="form-appointment-date" /></label>
//           <label>Time<input name="time" type="time" value="09:30" data-testid="form-appointment-time" /></label>
//           <label>Payment type<select name="paymentType"><option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option><option>Corporate</option><option>Credit</option><option>Package</option></select></label>
//           <label>Priority<select name="priority"><option>Normal</option><option>Urgent</option><option>Emergency</option></select></label>
//           <label>Existing patient<select name="patientId" data-existing-patient><option value="">New patient</option>${patients.map(patientOption).join("")}</select></label>
//           <label>MRN<input name="mrn" readonly data-appointment-mrn /></label>
//           <label>Date of birth<input name="dob" type="date" readonly data-appointment-dob /></label>
//           <label>Email<input name="email" type="email" readonly data-appointment-email /></label>
//           <label>Emergency contact<input name="emergencyContact" readonly data-appointment-emergency /></label>
//           <label>Allergies<input name="allergies" readonly data-appointment-allergies /></label>
//           <label class="span-2">Notes<textarea name="notes"></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Book appointment</button>
//         </form>`
//     },
//     "register-patient": {
//       title: "Patient registration",
//       note: "Register a new patient profile and generate MRN.",
//       html: `
//         <form class="form-grid compact-grid" data-action="register-patient">
//           <label>Full name<input name="name" required data-testid="form-patient-name" /></label>
//           <label>Mobile<input name="mobile" required value="9876543210" data-testid="form-patient-mobile" /></label>
//           <label>Age<input name="age" type="number" value="46" data-testid="form-patient-age" /></label>
//           <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
//           <label>Date of birth<input name="dob" type="date" value="1980-02-14" /></label>
//           <label>Email<input name="email" type="email" /></label>
//           <label>Emergency contact<input name="emergencyContact" /></label>
//           <label>ID proof type<input name="idProofType" value="Aadhaar" /></label>
//           <label>ID proof number<input name="idProofNumber" value="XXXX-XXXX-2145" /></label>
//           <label>Duplicate action<select name="duplicateAction"><option value="">Check first</option><option value="use-existing">Use Existing Patient</option><option value="create-new-anyway">Create New Anyway</option></select></label>
//           <label>Duplicate reason<input name="duplicateReason" placeholder="Required if creating duplicate" /></label>
//           <label>Insurance<input name="insurance" value="Self Pay" /></label>
//           <label>Allergies<input name="allergies" value="None" /></label>
//           <label class="span-2">Address<textarea name="address"></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Register patient</button>
//         </form>`
//     },
//     "generate-bill": {
//       title: "Generate Bill",
//       note: "Create a draft bill from consultation, lab, pharmacy, and procedure charges. Payment is collected only by authorized billing staff.",
//       html: `
//         <form class="form-grid compact-grid" data-action="generate-bill">
//           <label>Patient<select name="patientId" required><option value="">Select patient</option>${patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patientLabel(patient))}</option>`).join("")}</select></label>
//           <label>Visit / Appointment<input name="appointmentId" placeholder="Appointment or visit number" /></label>
//           <label>Department<input name="department" placeholder="General" data-testid="form-department" /></label>
//           <label>Doctor<input name="doctor" placeholder="Duty Doctor" data-testid="form-doctor" /></label>
//           <label>Registration fee<input name="registrationFee" type="number" min="0" /></label>
//           <label>Consultation fee<input name="consultationFee" type="number" min="0" /></label>
//           <label>Lab charges<input name="labCharges" type="number" min="0" value="0" /></label>
//           <label>Radiology charges<input name="radiologyCharges" type="number" min="0" value="0" /></label>
//           <label>Pharmacy charges<input name="pharmacyCharges" type="number" min="0" value="0" /></label>
//           <label>Procedure charges<input name="procedureCharges" type="number" min="0" value="0" /></label>
//           <label>Bed charges<input name="bedCharges" type="number" min="0" value="0" /></label>
//           <label>Nursing charges<input name="nursingCharges" type="number" min="0" value="0" /></label>
//           <label>Emergency charges<input name="emergencyCharges" type="number" min="0" value="0" /></label>
//           <label>Discount<input name="discount" type="number" min="0" value="0" /></label>
//           <label>Tax<input name="tax" type="number" min="0" value="0" /></label>
//           <label>Total amount<input name="totalPreview" type="number" min="0" placeholder="Auto-calculated after save" disabled /></label>
//           <label>Override price<select name="overridePrice"><option>No</option><option>Yes</option></select></label>
//           <label class="span-2">Override reason<input name="overrideReason" placeholder="Required when overriding configured price" /></label>
//           <label>Payment mode<select name="paymentType" data-testid="form-payment-mode"><option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option><option>Corporate</option><option>Credit</option><option>Package</option></select></label>
//           <label>Mark as paid<select name="markPaid"><option>No</option><option>Yes</option></select></label>
//           <label class="span-2">Billing items<textarea name="billingItems" placeholder="One item per line"></textarea></label>
//           <label class="span-2">Notes<textarea name="notes" placeholder="Optional billing note"></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Generate draft bill</button>
//         </form>`
//     },
//     "add-stock": {
//       title: "Add Stock",
//       note: "Add medicine batch stock before pharmacy issue. Expired or zero quantity stock is blocked.",
//       html: `
//         <form class="form-grid compact-grid" data-action="add-stock">
//           <label>Medicine<input name="medicine" required placeholder="Paracetamol 500mg" data-testid="form-medicine" /></label>
//           <label>Batch number<input name="batchNumber" required placeholder="BATCH-001" /></label>
//           <label>Expiry date<input name="expiryDate" type="date" required value="2027-12-31" /></label>
//           <label>Supplier<input name="supplier" placeholder="Supplier name" /></label>
//           <label>Quantity<input name="quantityAvailable" type="number" min="1" required value="20" data-testid="form-stock-quantity" /></label>
//           <label>Purchase price<input name="purchasePrice" type="number" min="0" value="0" /></label>
//           <label>Selling price<input name="sellingPrice" type="number" min="0" value="0" /></label>
//           <label>Reorder level<input name="reorderLevel" type="number" min="0" value="5" /></label>
//           <label>Storage location<input name="storageLocation" placeholder="Pharmacy" /></label>
//           <label class="span-2">Notes<textarea name="notes" placeholder="Optional stock note"></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Add stock</button>
//         </form>`
//     },
//     "create-task": {
//       title: "Task",
//       note: "Assign a follow-up action to staff.",
//       html: `
//         <form class="form-grid compact-grid" data-action="create-task">
//           <label>Title<input name="title" required placeholder="Review wait time delay" /></label>
//           <label>Assigned to<input name="assignedTo" required placeholder="OPD Manager" /></label>
//           <label>Priority<select name="priority"><option>Low</option><option>Medium</option><option selected>High</option><option>Critical</option></select></label>
//           <label>Due date<input name="due" type="date" value="${localDateInputValue()}" /></label>
//           <label class="span-2">Description<textarea name="description" placeholder="Describe the action needed"></textarea></label>
//           <button class="button primary" type="submit" data-testid="modal-submit-button">Assign task</button>
//         </form>`
//     }
//   };
//   return forms[action];
// }

// function collectionRows(collection) {
//   const getters = {
//     hospitals: () => api.hospitals(currentUser),
//     branches: () => api.branches(currentUser),
//     users: () => api.users(currentUser),
//     subscriptions: () => api.subscriptions(currentUser),
//     offers: () => api.offers(currentUser),
//     appointments: () => api.appointments(currentUser),
//     patients: () => api.patients(currentUser),
//     alerts: () => api.alerts(currentUser),
//     tasks: () => api.tasks(currentUser),
//     masterDataItems: () => api.masterDataItems(currentUser),
//     inventory: () => api.inventory(currentUser),
//     staff: () => api.staff(currentUser),
//     beds: () => api.beds(currentUser),
//     incidents: () => api.incidents(currentUser)
//   };
//   return getters[collection]?.() || [];
// }

// function editableEntries(record, collection = "") {
//   const blocked = new Set(["id", "_id", "hospitalId", "password", "passwordHash", "createdAt", "updatedAt", "createdBy", "updatedBy", "allowedPages", "permissions"]);
//   if (collection !== "users") blocked.add("branchId");
//   if (collection !== "users") blocked.add("allowedModules");
//   blocked.add("role");
//   if (collection === "hospitals") {
//     blocked.add("branchLimit");
//     blocked.add("userLimit");
//     blocked.add("storageGb");
//     blocked.add("storageUsedGb");
//   }
//   return Object.entries(record || {})
//     .filter(([key, value]) => !blocked.has(key) && ["string", "number", "boolean"].includes(typeof value))
//     .slice(0, 10);
// }

// function editFieldLabel(collection, key) {
//   if (collection === "users" && key === "email") return "Login username";
//   if (key === "contactEmail") return "Email";
//   if (key === "branchId") return "Branch";
//   return titleCase(key);
// }

// function editFieldControl(collection, key, value) {
//   const name = escapeHtml(key);
//   const label = escapeHtml(editFieldLabel(collection, key));
//   const current = String(value ?? "");
//   const optionList = (options) => options.map((option) => `<option value="${escapeHtml(option)}" ${String(option) === current ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
//   if (collection === "subscriptions" && key === "status") {
//     return `<label>${label}<select name="${name}">${optionList(["Active", "Draft", "Disabled"])}</select></label>`;
//   }
//   if (key === "status") {
//     return `<label>${label}<select name="${name}">${optionList(["Active", "Inactive", "Pending Review", "Suspended", "Disabled", "Pending Invite"])}</select></label>`;
//   }
//   if (collection === "hospitals" && key === "plan") {
//     return `<label>${label}<select name="${name}">${optionList(["Starter", "Growth", "Enterprise"])}</select></label>`;
//   }
//   if (collection === "hospitals" && key === "supportAccess") {
//     return `<label>Support Access<select name="${name}">${optionList(["false", "true"])}</select></label>`;
//   }
//   if (collection === "branches" && key === "branchType") {
//     return `<label>${label}<select name="${name}">${optionList(["Main Branch", "Sub Branch"])}</select></label>`;
//   }
//   if (collection === "subscriptions" && key === "supportLevel") {
//     return `<label>${label}<select name="${name}">${optionList(["Standard", "Priority", "Enterprise"])}</select></label>`;
//   }
//   if (collection === "users" && key === "jobRole") {
//     return `<label>${label}<select name="${name}">${jobRoleOptions().replace(`>${escapeHtml(current)}<`, ` selected>${escapeHtml(current)}<`)}</select></label>`;
//   }
//   if (collection === "users" && key === "branchId") {
//     const branches = api.branches(currentUser);
//     return `<label>${label}<select name="${name}">${branches.map((branch) => `<option value="${escapeHtml(branch.id)}" ${branch.id === current ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}</select></label>`;
//   }
//   if (key === "allowedModules" || key === "enabledModules" || key === "modules") {
//     const modules = Array.isArray(value) ? value.join(", ") : current;
//     return `<label class="span-2">${label}<textarea name="${name}" placeholder="Comma-separated modules">${escapeHtml(modules)}</textarea></label>`;
//   }
//   if (typeof value === "boolean") {
//     return `<label>${label}<select name="${name}">${optionList(["false", "true"])}</select></label>`;
//   }
//   if (typeof value === "number" || ["branchLimit", "userLimit", "storageUsedGb", "beds", "rooms", "monthlyPrice", "yearlyPrice", "branches", "users", "storageGb"].includes(key)) {
//     return `<label>${label}<input name="${name}" type="number" value="${escapeHtml(value)}" /></label>`;
//   }
//   return `<label>${label}<input name="${name}" value="${escapeHtml(value)}" /></label>`;
// }

// function normalizeEditValues(collection, values) {
//   const normalized = { ...values };
//   for (const [key, value] of Object.entries(normalized)) {
//     if (["branchLimit", "userLimit", "storageUsedGb", "beds", "rooms"].includes(key)) normalized[key] = Number(value || 0);
//     if (["monthlyPrice", "yearlyPrice", "branches", "users", "storageGb"].includes(key)) normalized[key] = Number(value || 0);
//     if (["supportAccess"].includes(key)) normalized[key] = value === "true";
//     if (["allowedModules", "enabledModules", "modules"].includes(key)) normalized[key] = String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
//   }
//   return normalized;
// }

// function editModal() {
//   if (!editTarget) return "";
//   const record = collectionRows(editTarget.collection).find((item) => item.id === editTarget.id);
//   if (!record) return "";
//   const fields = editableEntries(record, editTarget.collection);
//   return `
//     <div class="modal-backdrop">
//       <section class="modal-card">
//         <div class="panel-head">
//           <div>
//             <p class="eyebrow">Edit record</p>
//             <h3>${escapeHtml(record.name || record.title || record.patientName || record.email || record.id)}</h3>
//           </div>
//           <button class="icon-button" type="button" data-action="close-edit">Close</button>
//         </div>
//         <form class="form-grid compact-grid" data-action="save-edit" data-collection="${escapeHtml(editTarget.collection)}" data-id="${escapeHtml(editTarget.id)}">
//           ${fields.map(([key, value]) => editFieldControl(editTarget.collection, key, value)).join("")}
//           <button class="button primary" type="submit">Save changes</button>
//         </form>
//       </section>
//     </div>
//   `;
// }

// function patientDeleteDependencies(patientId) {
//   const read = (name) => safeOptionalData(() => api[name](currentUser), []);
//   return linkedPatientRecords(patientId, {
//     appointments: read("appointments"),
//     queueTokens: read("queueTokens"),
//     vitals: read("vitals"),
//     consultations: read("consultations"),
//     admissions: read("admissions"),
//     bills: read("bills"),
//     payments: read("payments"),
//     checkouts: read("checkouts"),
//     followUps: read("followUps")
//   });
// }

// function deleteModal() {
//   if (!deleteTarget) return "";
//   const record = collectionRows(deleteTarget.collection).find((item) => item.id === deleteTarget.id);
//   const title = record?.name || record?.title || record?.patientName || record?.email || record?.id || "this record";
//   const isPatient = deleteTarget.collection === "patients";
//   return `
//     <div class="modal-backdrop">
//       <section class="modal-card confirm-card" role="dialog" aria-modal="true">
//         <div class="panel-head">
//           <div>
//             <p class="eyebrow">Confirm delete</p>
//             <h3>Delete ${escapeHtml(title)}?</h3>
//             <p>${isPatient ? "This patient has no linked hospital workflow records. This action cannot be undone." : "This action can remove important hospital data. Confirm only after checking the record carefully."}</p>
//           </div>
//           <button class="icon-button" type="button" data-action="cancel-delete">Close</button>
//         </div>
//         <div class="notice danger">Deleted records cannot be restored from this screen.</div>
//         <div class="button-row footer-actions">
//           <button class="button ghost" type="button" data-action="cancel-delete">Cancel</button>
//           <button class="button danger" type="button" data-action="confirm-delete-record" data-collection="${escapeHtml(deleteTarget.collection)}" data-id="${escapeHtml(deleteTarget.id)}">${isPatient ? "Delete Patient" : "Delete record"}</button>
//         </div>
//       </section>
//     </div>
//   `;
// }

// function passwordPolicyState(password = "", user = currentUser || {}) {
//   const value = String(password || "");
//   const lowered = value.toLowerCase();
//   const emailName = String(user?.email || user?.contactEmail || "").split("@")[0]?.toLowerCase();
//   const nameParts = String(user?.name || "").toLowerCase().split(/\s+/).filter((part) => part.length >= 3);
//   return {
//     length: value.length >= 12,
//     uppercase: /[A-Z]/.test(value),
//     lowercase: /[a-z]/.test(value),
//     number: /\d/.test(value),
//     symbol: /[^A-Za-z0-9]/.test(value),
//     email: !(emailName && lowered.includes(emailName)),
//     name: !nameParts.some((part) => lowered.includes(part))
//   };
// }

// function passwordField({ label, name, required = true, minlength, autocomplete, testid, revealable = true }) {
//   const attrs = [
//     `name="${escapeAttribute(name)}"`,
//     `type="password"`,
//     required ? "required" : "",
//     minlength ? `minlength="${minlength}"` : "",
//     autocomplete ? `autocomplete="${escapeAttribute(autocomplete)}"` : "",
//     testid ? `data-testid="${escapeAttribute(testid)}"` : ""
//   ].filter(Boolean).join(" ");
//   if (!revealable) return `<label>${escapeHtml(label)}<input ${attrs} /></label>`;
//   return `<label>${escapeHtml(label)}<span class="password-field"><input ${attrs} /><button class="password-toggle" type="button" data-action="toggle-password-visibility" aria-label="Show password">Show</button></span></label>`;
// }

// function passwordPolicyHint(target = "current account") {
//   return `
//     <div class="password-hints" data-password-hints data-password-target="${escapeAttribute(target)}">
//       <span data-rule="length">12+ characters</span>
//       <span data-rule="uppercase">Uppercase letter</span>
//       <span data-rule="lowercase">Lowercase letter</span>
//       <span data-rule="number">Number</span>
//       <span data-rule="symbol">Special character</span>
//       <span data-rule="email">Does not contain your email</span>
//       <span data-rule="name">Does not contain your name</span>
//     </div>
//   `;
// }

// function selectedPermissionPages(form) {
//   return uniquePages([...form.querySelectorAll('input[name="allowedPages"]:checked')].map((input) => input.value));
// }

// function setPermissionPages(form, pages) {
//   const allowed = new Set(pages);
//   form.querySelectorAll('input[name="allowedPages"]').forEach((input) => {
//     input.checked = allowed.has(input.value) && !input.disabled;
//   });
//   updatePermissionBuilder(form);
// }

// function updatePermissionBuilder(form) {
//   if (!form?.matches?.('[data-action="create-user"]')) return;
//   const selected = selectedPermissionPages(form);
//   const modules = USER_ROLE_MODULES[form.jobRole?.value] || selected.map((page) => currentPageTitle(page));
//   const modulesInput = form.querySelector("[data-allowed-modules]");
//   if (modulesInput) modulesInput.value = modules.join(",");

//   USER_PERMISSION_GROUPS.forEach((group) => {
//     const count = [...form.querySelectorAll(`input[name="allowedPages"][data-group="${group.key}"]:checked`)].length;
//     const counter = form.querySelector(`[data-group-count="${group.key}"]`);
//     if (counter) counter.textContent = `${count} selected`;
//   });

//   const allowedList = form.querySelector("[data-preview-allowed]");
//   const blockedList = form.querySelector("[data-preview-blocked]");
//   const allPages = uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
//   if (allowedList) {
//     allowedList.innerHTML = selected.slice(0, 12).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("") || "<li>No pages selected</li>";
//   }
//   if (blockedList) {
//     blockedList.innerHTML = allPages.filter((page) => !selected.includes(page)).slice(0, 12).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("");
//   }

//   const sensitiveChecked = [...form.querySelectorAll(".matrix-check.sensitive input:checked")];
//   const warning = form.querySelector("[data-sensitive-warning]");
//   if (warning) warning.classList.toggle("hidden", sensitiveChecked.length === 0);
// }

// function applyUserRolePreset(form) {
//   const role = form.jobRole?.value;
//   const preset = USER_ROLE_PRESETS[role] || ["dashboard", "tasks", "alerts"];
//   const message = form.querySelector("[data-role-preset-message]");
//   if (message) {
//     message.textContent = role === "Custom Role"
//       ? "Custom role selected. Choose pages and permissions manually before saving."
//       : `Default access preset applied for ${role}. You can adjust allowed pages before saving.`;
//   }
//   setPermissionPages(form, preset);
// }

// function toast(message, type = "success") {
//   const node = document.createElement("div");
//   node.className = `toast ${type}`;
//   node.innerHTML = `<span>${escapeHtml(message)}</span><i class="toast-progress" aria-hidden="true"></i>`;
//   document.body.appendChild(node);
//   setTimeout(() => node.remove(), 2600);
// }

// const loadingLabels = {
//   login: "Signing in...",
//   "forgot-password": "Sending...",
//   "reset-password": "Resetting...",
//   "upload-document": "Uploading...",
//   "upload-records": "Uploading...",
//   "global-search": "Searching...",
//   "change-password": "Changing...",
//   "create-appointment": "Booking...",
//   "register-patient": "Registering...",
//   "generate-bill": "Generating...",
//   "create-admission": "Creating...",
//   "save-edit": "Saving..."
// };

// const clickLoadingActions = new Set([
//   "run-provider-check",
//   "patient-check-in",
//   "download-document",
//   "patient-download-document",
//   "send-patient-portal-invite",
//   "toggle-branch-patient-portal",
//   "toggle-branch-public-booking",
//   "delete-document-file",
//   "review-access",
//   "revoke-sensitive",
//   "disable-access-user",
//   "duplicate-template",
//   "disable-template",
//   "disable-subscription",
//   "confirm-delete-record",
//   "logout",
//   "ack-alert",
//   "task-from-alert",
//   "complete-task",
//   "check-in",
//   "lab-ready",
//   "issue-pharmacy",
//   "collect-payment",
//   "pay-online",
//   "complete-checkout",
//   "assign-bed",
//   "mark-med-given",
//   "accept-handover",
//   "complete-discharge",
//   "complete-clearance",
//   "update-bed-status",
//   "submit-death-summary",
//   "approve-death-summary",
//   "return-death-summary",
//   "print-death-summary",
//   "toggle-master-data",
//   "mark-notification-read",
//   "stock-adjust",
//   "approve-purchase",
//   "receive-goods",
//   "manual-backup",
//   "export-csv",
//   "export-excel",
//   "print-report",
//   "print-prescription",
//   "print-lab-order",
//   "print-bill"
// ]);

// function loadingLabel(action) {
//   if (loadingLabels[action]) return loadingLabels[action];
//   if (action?.startsWith("create-")) return "Creating...";
//   if (action?.startsWith("add-")) return "Saving...";
//   if (action?.startsWith("save-")) return "Saving...";
//   if (action?.startsWith("update-")) return "Saving...";
//   return "Working...";
// }

// function startButtonLoading(button, action) {
//   if (!(button instanceof HTMLButtonElement) || !clickLoadingActions.has(action)) return null;
//   const previous = {
//     html: button.innerHTML,
//     disabled: button.disabled,
//     ariaBusy: button.getAttribute("aria-busy")
//   };
//   button.disabled = true;
//   button.classList.add("is-loading");
//   button.setAttribute("aria-busy", "true");
//   button.innerHTML = `<span class="loading-spinner" aria-hidden="true"></span><span>${escapeHtml(loadingLabel(action))}</span>`;
//   return previous;
// }

// function stopButtonLoading(button, previous) {
//   if (!(button instanceof HTMLButtonElement) || !button.isConnected || !previous) return;
//   button.disabled = previous.disabled;
//   button.classList.remove("is-loading");
//   button.innerHTML = previous.html;
//   if (previous.ariaBusy === null) button.removeAttribute("aria-busy");
//   else button.setAttribute("aria-busy", previous.ariaBusy);
// }

// function startFormLoading(form, submitter, action) {
//   const button = submitter instanceof HTMLButtonElement ? submitter : form.querySelector('button[type="submit"]');
//   const controls = [...form.querySelectorAll("button, input, select, textarea")];
//   const previous = {
//     button,
//     buttonHtml: button?.innerHTML,
//     buttonAriaBusy: button?.getAttribute("aria-busy"),
//     controls: controls.map((control) => [control, control.disabled])
//   };

//   form.classList.add("is-loading");
//   form.setAttribute("aria-busy", "true");
//   controls.forEach((control) => {
//     control.disabled = true;
//   });
//   if (button) {
//     button.innerHTML = `<span class="loading-spinner" aria-hidden="true"></span><span>${escapeHtml(loadingLabel(action))}</span>`;
//     button.setAttribute("aria-busy", "true");
//   }
//   return previous;
// }

// function stopFormLoading(form, previous) {
//   if (!form?.isConnected || !previous) return;
//   form.classList.remove("is-loading");
//   form.removeAttribute("aria-busy");
//   previous.controls.forEach(([control, disabled]) => {
//     if (control.isConnected) control.disabled = disabled;
//   });
//   if (previous.button?.isConnected) {
//     previous.button.innerHTML = previous.buttonHtml;
//     if (previous.buttonAriaBusy === null) previous.button.removeAttribute("aria-busy");
//     else previous.button.setAttribute("aria-busy", previous.buttonAriaBusy);
//   }
// }

// function exportCsv(kind) {
//   const module = kind === "audit" ? "audit" : kind === "alerts" ? "alerts" : "reports";
//   if (!hasPermission(currentUser, module, "export")) {
//     throw new Error("You do not have permission to perform this action.");
//   }
//   api.logSensitiveAction?.(currentUser, module, "Export");
//   const rowsByKind = {
//     audit: api.auditLogs(currentUser),
//     alerts: api.alerts(currentUser),
//     reports: currentUser.role === ROLES.SUPER_ADMIN ? api.hospitals(currentUser) : api.branches(currentUser)
//   };
//   const rows = rowsByKind[kind] || api.records(currentUser);
//   const headers = Object.keys(rows[0] || { message: "No data" });
//   const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
//   link.download = `hocc-${kind}-${Date.now()}.csv`;
//   link.click();
//   URL.revokeObjectURL(link.href);
// }

// function exportExcel() {
//   if (!hasPermission(currentUser, "reports", "export")) {
//     throw new Error("You do not have permission to perform this action.");
//   }
//   api.logSensitiveAction?.(currentUser, "reports", "Export");
//   const rows = api.records(currentUser);
//   const html = `<table>${rows.map((row) => `<tr><td>${escapeHtml(row.patientId)}</td><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("")}</table>`;
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(new Blob([html], { type: "application/vnd.ms-excel" }));
//   link.download = `hocc-report-${Date.now()}.xls`;
//   link.click();
//   URL.revokeObjectURL(link.href);
// }

// function sampleCsv() {
//   return `Patient ID,Appointment ID,Department,Doctor,Arrival Time,Appointment Time,Doctor Seen Time,Wait Time
// P-9001,A-9001,Emergency,Dr. Banerjee,08:10,08:00,08:54,54
// P-9002,A-9002,OPD,,09:00,08:45,09:28,43
// P-9002,A-9002,OPD,Dr. Nair,09:02,08:45,09:30,45
// P-9003,A-9003,Unknown Dept,Dr. Rao,10:10,10:00,10:20,-5`;
// }

// function readFileAsText(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(String(reader.result));
//     reader.onerror = reject;
//     reader.readAsText(file);
//   });
// }

// function readFileAsDataUrl(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(String(reader.result));
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }

// function downloadBase64File(file) {
//   const bytes = atob(file.contentBase64 || "");
//   const buffer = new Uint8Array(bytes.length);
//   for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(new Blob([buffer], { type: file.mimeType || "application/octet-stream" }));
//   link.download = file.fileName || "document";
//   link.click();
//   URL.revokeObjectURL(link.href);
// }

// const TEXT_TEMPLATES = [
//   ["", "Insert template"],
//   ["Fever consultation", "Chief complaint: Fever with associated symptoms.\nClinical notes: Patient reviewed and examined. Vitals reviewed. Red flag symptoms explained.\nPlan: Investigations and follow-up to be decided by the treating doctor after clinical review."],
//   ["Diabetes follow-up", "Follow-up reason: Diabetes review.\nClinical notes: Symptoms, adherence, home monitoring, and recent reports reviewed.\nPlan: Doctor to update medicines, investigations, lifestyle advice, and next follow-up manually."],
//   ["Hypertension follow-up", "Follow-up reason: Blood pressure review.\nClinical notes: Readings, symptoms, adherence, and risk factors reviewed.\nPlan: Doctor to confirm treatment plan and follow-up manually."],
//   ["Emergency trauma", "Emergency note: Trauma patient assessed by emergency team.\nTriage/vitals: Record findings manually.\nPlan: Stabilization, investigations, referral, OPD/IPD movement, or discharge to be decided by responsible clinician."],
//   ["Daily IPD progress note", "Daily progress: Patient reviewed during rounds.\nCurrent condition:\nInvestigations:\nTreatment plan:\nPending actions:\nResponsible clinician to review and sign."],
//   ["Nursing note", "Nursing observation:\nVitals:\nMedication/care provided:\nPatient comfort and safety:\nEscalation, if any:\nRecorded by nursing staff."],
//   ["Discharge summary", "Discharge summary draft:\nAdmission reason:\nHospital course:\nInvestigations:\nTreatment given:\nDischarge condition:\nFollow-up advice:\nPrepared for clinician review and approval."],
//   ["Death summary", "Death Summary draft:\nClinical course:\nImmediate cause:\nAntecedent/underlying cause:\nFamily informed:\nMedico-legal status:\nDraft only. Requires responsible doctor review and approval."]
// ];

// function draftKeyFor(textarea) {
//   const form = textarea.closest("form");
//   const action = form?.dataset.action || "draft";
//   const route = pageFromHash();
//   const id = form?.admissionId?.value || form?.patientId?.value || selectedPatientId || "general";
//   return `hocc:draft:${currentUser?.id || currentUser?.email}:${route}:${action}:${textarea.name || "notes"}:${id}`;
// }

// function enhanceDraftAreas() {
//   app.querySelectorAll("textarea").forEach((textarea) => {
//     const form = textarea.closest("form");
//     if (!form || textarea.dataset.draftReady === "true") return;
//     const action = form.dataset.action || "";
//     const allowed = /consult|duty|nursing|death|discharge|handover|daily|emergency|feedback|consent|bill/i.test(action);
//     if (!allowed) return;
//     textarea.dataset.draftReady = "true";
//     textarea.dataset.draftKey = draftKeyFor(textarea);
//     const saved = localStorage.getItem(textarea.dataset.draftKey);
//     if (saved && !textarea.value.trim()) textarea.value = saved;
//     const tools = document.createElement("div");
//     tools.className = "draft-tools";
//     tools.innerHTML = `
//       <select data-template-select aria-label="Insert text template">
//         ${TEXT_TEMPLATES.map(([label]) => `<option value="${escapeAttribute(label)}">${escapeHtml(label || "Insert template")}</option>`).join("")}
//       </select>
//       <small data-draft-status>${saved ? "Saved locally ✓" : "Draft autosave ready"}</small>
//     `;
//     textarea.insertAdjacentElement("afterend", tools);
//   });
// }

// function enhancePasswordHints() {
//   app.querySelectorAll("[data-password-hints]").forEach((hint) => {
//     if (hint.dataset.bound === "true") return;
//     hint.dataset.bound = "true";
//     const form = hint.closest("form");
//     const input = form?.querySelector('input[name="newPassword"]');
//     if (!input) return;
//     const applyState = () => {
//       const state = passwordPolicyState(input.value, currentUser || {});
//       Object.entries(state).forEach(([rule, passed]) => {
//         const node = hint.querySelector(`[data-rule="${rule}"]`);
//         if (!node) return;
//         node.classList.toggle("pass", Boolean(passed));
//         node.classList.toggle("fail", input.value.length > 0 && !passed);
//       });
//     };
//     input.addEventListener("input", applyState);
//     applyState();
//   });
// }

// function animateCountUps() {
//   if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
//   app.querySelectorAll("[data-countup]").forEach((node) => {
//     if (node.dataset.counted === "true") return;
//     node.dataset.counted = "true";
//     const target = Number(node.dataset.countup || 0);
//     if (!Number.isFinite(target)) return;
//     const start = performance.now();
//     const duration = 480;
//     const step = (now) => {
//       const progress = Math.min(1, (now - start) / duration);
//       const value = Math.round(target * progress);
//       node.textContent = String(value);
//       if (progress < 1) requestAnimationFrame(step);
//       else node.textContent = String(target);
//     };
//     requestAnimationFrame(step);
//   });
// }

// function scheduleDraftSave(textarea) {
//   const key = textarea.dataset.draftKey;
//   if (!key) return;
//   const status = textarea.parentElement?.querySelector("[data-draft-status]");
//   const consultationStatus = textarea.closest("form")?.querySelector("[data-consultation-save-status]");
//   if (status) status.textContent = "Saving...";
//   if (consultationStatus) consultationStatus.textContent = "Saving...";
//   clearTimeout(draftTimers.get(key));
//   draftTimers.set(key, setTimeout(() => {
//     localStorage.setItem(key, textarea.value);
//     if (status) status.textContent = "Saved locally ✓";
//     if (consultationStatus) consultationStatus.textContent = "Saved locally ✓";
//   }, 700));
// }

// function runGlobalSearch(query, debounce = 0) {
//   clearTimeout(globalSearchTimer);
//   const text = String(query || "").trim();
//   globalSearchQuery = query || "";
//   globalSearchActiveIndex = -1;
//   globalSearchError = "";
//   if (text.length < 2) {
//     globalSearchSuggestions = [];
//     globalSearchStatus = "idle";
//     render();
//     return;
//   }
//   globalSearchStatus = "loading";
//   render();
//   globalSearchTimer = setTimeout(() => {
//     try {
//       globalSearchSuggestions = api.globalSearch(currentUser, text).slice(0, 12);
//       globalSearchStatus = "ready";
//       globalSearchError = "";
//     } catch (error) {
//       globalSearchSuggestions = [];
//       globalSearchStatus = "error";
//       globalSearchError = error.message || "Unable to search records. Please retry.";
//     }
//     render();
//   }, debounce);
// }

// document.addEventListener("submit", async (event) => {
//   const form = event.target;
//   if (!(form instanceof HTMLFormElement)) return;
//   event.preventDefault();
//   const action = form.dataset.action;
//   const values = formValues(form);
//   if (event.submitter?.name) values[event.submitter.name] = event.submitter.value || "Yes";
//   const loadingState = startFormLoading(form, event.submitter, action);

//   try {
//     if (action === "login") {
//       await api.login(values.loginIdentifier || values.email, values.password);
//       currentUser = api.currentUser();
//       setPage("dashboard");
//       render();
//       setTimeout(warmDataCache, 60);
//     }
//     if (action === "patient-login") {
//       await api.patientLogin(values.loginIdentifier || values.email, values.password);
//       currentUser = api.currentUser();
//       setPage("dashboard");
//       render();
//     }
//     if (action === "patient-accept-invite") {
//       if (!values.token) throw new Error("Invite link is invalid or missing.");
//       if (values.newPassword !== values.confirmPassword) throw new Error("Password and confirmation do not match.");
//       if (!strongPassword(values.newPassword)) throw new Error("Use at least 12 characters with uppercase, lowercase, number, and symbol.");
//       const result = await api.patientAcceptInvite({
//         token: values.token,
//         newPassword: values.newPassword,
//         confirmPassword: values.confirmPassword
//       });
//       toast(result.message || "Portal access set up successfully. Please sign in.");
//       setPage("patient-login");
//     }
//     if (action === "patient-book-appointment") {
//       await api.createAppointment(currentUser, values);
//       toast("Appointment requested. Next action: watch your appointments list for confirmation.");
//       setPage("patient-appointments");
//       render();
//     }
//     if (action === "public-book-appointment") {
//       const branchId = form.dataset.branchId;
//       const result = await api.submitPublicBooking({ ...values, branchId });
//       app.innerHTML = authFrame(publicBookingConfirmation(result.appointmentNumber));
//     }
//     if (action === "forgot-password") {
//       const result = await api.forgotPassword(values.email);
//       toast(result.message || "If an account exists for this email, a password reset link has been sent.");
//       setPage("login");
//     }
//     if (action === "reset-password") {
//       if (!values.token) throw new Error("Reset link is invalid or missing.");
//       if (values.newPassword !== values.confirmPassword) throw new Error("New password and confirmation do not match.");
//       if (!strongPassword(values.newPassword)) throw new Error("Use at least 12 characters with uppercase, lowercase, number, and symbol.");
//       const result = await api.resetPassword({
//         token: values.token,
//         newPassword: values.newPassword,
//         confirmPassword: values.confirmPassword
//       });
//       toast(result.message || "Password reset successfully. Please sign in with your new password.");
//       setPage("login");
//     }
//     if (action === "create-hospital") {
//       await api.createHospital(currentUser, values);
//       createTarget = null;
//       toast("Hospital customer created.");
//       render();
//     }
//     if (action === "create-branch") {
//       await api.createBranch(currentUser, values);
//       createTarget = null;
//       toast("Branch created.");
//       render();
//     }
//     if (action === "create-ward") {
//       await api.createWard(currentUser, values);
//       createTarget = null;
//       toast("Ward created.");
//       render();
//     }
//     if (action === "create-bed") {
//       await api.createBed(currentUser, values);
//       createTarget = null;
//       toast("Bed created.");
//       render();
//     }
//     if (action === "create-user") {
//       const allowedPages = uniquePages(asArray(values.allowedPages));
//       const allowedModules = asArray(values.allowedModules).flatMap((item) => String(item).split(",")).map((item) => item.trim()).filter(Boolean);
//       const permissions = Object.fromEntries(Object.entries(values)
//         .filter(([key]) => key.startsWith("permission:"))
//         .map(([key, value]) => [key.replace("permission:", ""), asArray(value)]));
//       if (currentUser.role === ROLES.BRANCH_ADMIN) {
//         if (!currentUser.branchId) throw new Error("Your Branch Admin account is not assigned to a branch yet.");
//         values.branchId = currentUser.branchId;
//         delete values.accessExpiresAt;
//         if (!String(values.department || "").trim()) {
//           throw new Error("Create an active Department in Master Data for this branch before creating staff users.");
//         }
//       }
//       const hasSensitive = Object.values(permissions).flat().some((permission) => SENSITIVE_USER_PERMISSIONS.has(permission));
//       if (hasSensitive && values.sensitiveConfirmed !== "Yes") {
//         throw new Error("Confirm sensitive permission access before saving.");
//       }
//       if (hasSensitive && !String(values.sensitiveReason || "").trim()) {
//         throw new Error("Add a reason for sensitive permission access.");
//       }
//       await api.createUser(currentUser, { ...values, allowedModules, allowedPages, permissions });
//       createTarget = null;
//       toast(values.inviteMode === "Yes" ? "Invite created. User remains pending until password setup." : `User created. Login: ${values.email} / ${values.password}`);
//       render();
//     }
//     if (action === "create-master-data") {
//       if (values.type === "Service Price") {
//         await api.createServicePrice(currentUser, {
//           serviceName: values.name,
//           serviceCode: values.code,
//           category: values.category,
//           department: values.department,
//           price: values.price,
//           taxPercentage: values.taxPercentage,
//           effectiveFrom: values.effectiveFrom,
//           notes: values.description
//         });
//       } else {
//         await api.createMasterDataItem(currentUser, values);
//       }
//       createTarget = null;
//       toast("Master record created.");
//       render();
//     }
//     if (action === "create-permission-template") {
//       await api.createPermissionTemplate(currentUser, values);
//       createTarget = null;
//       toast("Permission template created.");
//       render();
//     }
//     if (action === "create-subscription") {
//       await api.createSubscriptionPlan(currentUser, values);
//       createTarget = null;
//       toast("Subscription plan created.");
//       render();
//     }
//     if (action === "create-offer") {
//       await api.createOffer(currentUser, values);
//       createTarget = null;
//       toast("Offer created.");
//       render();
//     }
//     if (action === "schedule-surgery") {
//       await api.scheduleSurgery(currentUser, values);
//       createTarget = null;
//       toast("Surgery scheduled.");
//       render();
//     }
//     if (action === "register-death") {
//       await api.registerDeath(currentUser, values);
//       createTarget = null;
//       toast("Death registered in mortuary register.");
//       render();
//     }
//     if (action === "order-radiology") {
//       await api.orderRadiology(currentUser, values);
//       createTarget = null;
//       toast("Imaging study ordered.");
//       render();
//     }
//     if (action === "update-profile") {
//       await api.updateProfile(currentUser, { name: values.name, mobile: values.mobile });
//       currentUser = api.currentUser();
//       toast("Profile updated successfully.");
//       render();
//     }
//     if (action === "change-password") {
//       if (values.newPassword !== values.confirmPassword) throw new Error("New password and confirmation do not match.");
//       if (!strongPassword(values.newPassword)) throw new Error("Use at least 12 characters with uppercase, lowercase, number, and symbol.");
//       await api.changePassword(currentUser, {
//         currentPassword: values.currentPassword,
//         newPassword: values.newPassword,
//         confirmPassword: values.confirmPassword
//       });
//       currentUser = api.currentUser();
//       form.reset();
//       toast("Password changed successfully.");
//       render();
//     }
//     if (action === "save-settings") {
//       const queueWaitingMinutes = Number(values.queueWaitingMinutes);
//       const labPendingMinutes = Number(values.labPendingMinutes);
//       const radiologyPendingMinutes = Number(values.radiologyPendingMinutes);
//       const pharmacyPendingMinutes = Number(values.pharmacyPendingMinutes);
//       const billingPendingMinutes = Number(values.billingPendingMinutes);
//       const marDueMinutes = Number(values.marDueMinutes);
//       const dischargeClearanceMinutes = Number(values.dischargeClearanceMinutes);
//       const reportUploadDelayMinutes = Number(values.reportUploadDelayMinutes);
//       const documentReadinessMinutes = Number(values.documentReadinessMinutes);
//       const goLiveChecklistReminderMinutes = Number(values.goLiveChecklistReminderMinutes);
//       if (!Number.isFinite(queueWaitingMinutes) || queueWaitingMinutes < 1) throw new Error("Queue waiting threshold must be a number of minutes.");
//       if (!Number.isFinite(labPendingMinutes) || labPendingMinutes < 1) throw new Error("Lab threshold must be a number of minutes.");
//       if (!Number.isFinite(radiologyPendingMinutes) || radiologyPendingMinutes < 1) throw new Error("Radiology threshold must be a number of minutes.");
//       if (!Number.isFinite(pharmacyPendingMinutes) || pharmacyPendingMinutes < 1) throw new Error("Pharmacy threshold must be a number of minutes.");
//       if (!Number.isFinite(billingPendingMinutes) || billingPendingMinutes < 1) throw new Error("Billing threshold must be a number of minutes.");
//       if (!Number.isFinite(marDueMinutes) || marDueMinutes < 1) throw new Error("MAR threshold must be a number of minutes.");
//       if (!Number.isFinite(dischargeClearanceMinutes) || dischargeClearanceMinutes < 1) throw new Error("Discharge threshold must be a number of minutes.");
//       if (!Number.isFinite(reportUploadDelayMinutes) || reportUploadDelayMinutes < 1) throw new Error("Report upload threshold must be a number of minutes.");
//       if (!Number.isFinite(documentReadinessMinutes) || documentReadinessMinutes < 1) throw new Error("Document readiness threshold must be a number of minutes.");
//       if (!Number.isFinite(goLiveChecklistReminderMinutes) || goLiveChecklistReminderMinutes < 1) throw new Error("Go-live checklist threshold must be a number of minutes.");
//       await api.saveAutomationSettings(currentUser, {
//         hospitalId: currentUser.hospitalId || undefined,
//         branchId: currentUser.role === ROLES.BRANCH_ADMIN ? currentUser.branchId : undefined,
//         queueWaitingMinutes,
//         labPendingMinutes,
//         radiologyPendingMinutes,
//         pharmacyPendingMinutes,
//         billingPendingMinutes,
//         marDueMinutes,
//         dischargeClearanceMinutes,
//         reportUploadDelayMinutes,
//         documentReadinessMinutes,
//         goLiveChecklistReminderMinutes,
//         autoTaskCreationEnabled: Boolean(values.autoTaskCreationEnabled),
//         reminderNotificationsEnabled: Boolean(values.reminderNotificationsEnabled)
//       });
//       automationSettingsCache = null;
//       goLiveChecklistCache = null;
//       toast("Settings saved.");
//       render();
//     }
//     if (action === "save-compliance") {
//       api.logSensitiveAction?.(currentUser, "compliance", "Compliance settings updated", "Privacy controls");
//       toast("Compliance settings saved.");
//       render();
//     }
//     if (action === "request-restore") {
//       await api.requestRestore(currentUser, { notes: values.notes, approvalStatus: "Requested" });
//       createTarget = null;
//       toast("Restore request logged for approval.");
//       render();
//     }
//     if (action === "save-setup") {
//       await api.saveSetupWizard(currentUser, values);
//       goLiveChecklistCache = null;
//       toast("Setup progress saved.");
//       render();
//     }
//     if (action === "create-doctor-schedule") {
//       await api.createDoctorSchedule(currentUser, values);
//       toast("Doctor schedule created.");
//       render();
//     }
//     if (action === "create-staff-roster") {
//       await api.createStaffRoster(currentUser, values);
//       toast("Duty roster created.");
//       render();
//     }
//     if (action === "create-emergency") {
//       await api.createEmergencyCase(currentUser, values);
//       toast("Emergency case created.");
//       render();
//     }
//     if (action === "upload-document") {
//       const file = form.querySelector('input[type="file"]')?.files?.[0];
//       if (file) {
//         const dataUrl = await readFileAsDataUrl(file);
//         values.originalFilename = file.name;
//         values.mimeType = file.type;
//         values.sizeBytes = file.size;
//         values.contentBase64 = dataUrl.split(",")[1] || "";
//       }
//       await api.uploadDocument(currentUser, values);
//       toast("Document uploaded.");
//       render();
//     }
//     if (action === "create-consent") {
//       await api.createConsentForm(currentUser, values);
//       toast("Consent form created.");
//       render();
//     }
//     if (action === "create-purchase-request") {
//       await api.createPurchaseRequest(currentUser, values);
//       toast("Purchase request created.");
//       render();
//     }
//     if (action === "submit-feedback") {
//       await api.submitFeedback(currentUser, values);
//       toast("Feedback recorded.");
//       render();
//     }
//     if (action === "global-search") {
//       globalSearchQuery = values.query || "";
//       render();
//     }
//     if (action === "create-appointment") {
//       const appointment = await api.createAppointment(currentUser, values);
//       selectedPatientId = appointment.patientId || values.patientId || selectedPatientId;
//       createTarget = null;
//       toast("Appointment booked successfully. Next action: Check In Patient or View Queue.");
//       render();
//     }
//     if (action === "register-patient") {
//       const patient = await api.registerPatient(currentUser, values);
//       selectedPatientId = patient.id;
//       createTarget = null;
//       toast(`Patient registered successfully. MRN: ${patient.mrn || "Generated"}. Next action: Book Appointment or Check In Now.`);
//       render();
//     }
//     if (action === "record-vitals") {
//       await api.recordVitals(currentUser, values);
//       selectedPatientId = values.patientId || selectedPatientId;
//       toast("Vitals saved. Next action: Send to Doctor Queue or Start Consultation.");
//       render();
//     }
//     if (action === "complete-consultation") {
//       await api.completeConsultation(currentUser, values);
//       selectedPatientId = values.patientId || selectedPatientId;
//       toast("Consultation completed. Next action: Send to Billing, Pharmacy, Lab, or Follow-up.");
//       render();
//     }
//     if (action === "generate-bill") {
//       await api.generateBill(currentUser, values);
//       selectedPatientId = values.patientId || selectedPatientId;
//       createTarget = null;
//       toast(values.markPaid === "Yes" ? "Payment collected. Next action: Checkout Patient or Print Receipt." : "Draft bill generated. Next action: Collect Payment.");
//       render();
//     }
//     if (action === "add-stock") {
//       await api.addMedicineStock(currentUser, values);
//       createTarget = null;
//       toast("Stock added successfully.");
//       render();
//     }
//     if (action === "book-followup") {
//       await api.bookFollowUp(currentUser, values);
//       toast("Follow-up booked.");
//       render();
//     }
//     if (action === "create-admission") {
//       await api.createAdmissionRequest(currentUser, values);
//       toast("Admission request created.");
//       render();
//     }
//     if (action === "save-consultation-draft") {
//       if (values.consultationAction === "complete") {
//         const validation = form.querySelector("[data-consultation-validation]");
//         const primaryDiagnosis = String(asArray(values.diagnosis)[0] || "").trim();
//         const admissionReason = String(values.admissionReason || "").trim();
//         const hasOrders = [...asArray(values.labTest), ...asArray(values.radiologyTest)].some((item) => String(item || "").trim());
//         let validationMessage = "";
//         if (!primaryDiagnosis) validationMessage = "Primary diagnosis is required before completing this consultation.";
//         else if (values.admissionRecommended === "Yes" && !admissionReason) validationMessage = "Admission reason is required when admission is recommended.";
//         else if (values.noInvestigationRequired === "Yes" && hasOrders) validationMessage = "Remove investigation orders or uncheck No Investigation Required.";
//         if (validationMessage) {
//           if (validation) { validation.textContent = `⚠ ${validationMessage}`; validation.classList.remove("hidden"); validation.scrollIntoView({ behavior: "smooth", block: "center" }); }
//           throw new Error(validationMessage);
//         }
//         const completed = await api.completeDoctorConsultation(currentUser, values.consultationId, values);
//         toast(`Consultation completed. Next stage: ${completed.downstreamStatus}.`);
//         setPage("queue");
//       } else {
//         await api.saveConsultationDraft(currentUser, values.consultationId, values);
//         toast("Consultation draft saved.");
//         render();
//       }
//     }
//     if (action === "assign-admission-bed") {
//       const ward = safeOptionalData(() => api.wards(currentUser), []).find((item) => String(item.id) === String(values.wardId));
//       const bed = safeOptionalData(() => api.beds(currentUser), []).find((item) => String(item.id) === String(values.bedId));
//       if (!ward || !bed || String(bed.wardId || "") !== String(ward.id)) throw new Error("Select an available bed from the selected ward.");
//       await api.assignBed(currentUser, values.admissionId, { bedId: bed.id, bedNumber: bed.bed || bed.bedNumber || bed.name, wardId: ward.id, ward: ward.name || ward.wardName || ward.ward });
//       createTarget = null;
//       selectedAdmissionId = null;
//       toast("Ward and bed assigned. Next action: Admit Patient.");
//       render();
//     }
//     if (action === "add-daily-sheet") {
//       await api.addDailyPatientSheet(currentUser, values);
//       toast("Daily sheet entry saved.");
//       render();
//     }
//     if (action === "save-doctor-progress") {
//       await api.saveDoctorProgressNote(currentUser, values);
//       toast("Doctor progress note draft saved.");
//       render();
//     }
//     if (action === "add-duty-note") {
//       await api.addDutyDoctorNote(currentUser, values);
//       toast("Duty doctor note saved.");
//       render();
//     }
//     if (action === "add-nursing-note") {
//       await api.addNursingNote(currentUser, values);
//       toast("Nursing note saved.");
//       render();
//     }
//     if (action === "record-ipd-vitals") {
//       await api.recordIPDVitals(currentUser, values);
//       toast("IPD vitals saved.");
//       render();
//     }
//     if (action === "add-intake-output") {
//       await api.addIntakeOutput(currentUser, values);
//       toast("Intake-output chart saved.");
//       render();
//     }
//     if (action === "add-handover-note") {
//       await api.createDoctorHandover(currentUser, values);
//       toast("Handover note saved.");
//       render();
//     }
//     if (action === "create-death-summary") {
//       await api.saveDeathSummary(currentUser, values.admissionId, values);
//       toast("Death Summary draft created.");
//       setPage("ipdPatient360", { admissionId: values.admissionId, tab: "deathSummary" });
//     }
//     if (action === "update-death-summary") {
//       await api.updateDeathSummary(currentUser, values.admissionId, values);
//       toast("Death Summary saved.");
//       setPage("ipdPatient360", { admissionId: values.admissionId, tab: "deathSummary" });
//     }
//     if (action === "save-mapping") {
//       await api.saveMapping(currentUser, values);
//       toast("Mapping saved.");
//       render();
//     }
//     if (action === "create-task") {
//       await api.createTask(currentUser, values);
//       createTarget = null;
//       toast("Task assigned.");
//       render();
//     }
//     if (action === "save-edit") {
//       await api.updateRecord(currentUser, form.dataset.collection, form.dataset.id, normalizeEditValues(form.dataset.collection, values));
//       editTarget = null;
//       toast("Record updated.");
//       render();
//     }
//     if (action === "upload-records") {
//       await api.ingestRows(currentUser, pendingUpload.rows, values.recordType);
//       pendingUpload = { rows: [], recordType: values.recordType, validation: null };
//       toast("Records uploaded and added to drilldown.");
//       setPage("records");
//     }
//     // ===== NEW: reception enroll patient =====
//     if (action === "reception-enroll-patient") {
//       // Validation
//       if (!values.name) throw new Error("Full Name is required.");
//       if (!values.mobile) throw new Error("Mobile Number is required.");
//       if (!values.gender) throw new Error("Gender is required.");
//       if (!values.address) throw new Error("Address is required.");
//       if (!/^\d{10}$/.test(values.mobile)) throw new Error("Mobile must be a valid 10-digit number.");
//       if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new Error("Email is invalid.");
//       if (values.dob) {
//         const dobDate = new Date(values.dob);
//         if (dobDate > new Date()) throw new Error("Date of Birth cannot be in the future.");
//       }
//       if (values.age) {
//         const ageNum = Number(values.age);
//         if (ageNum < 0 || ageNum > 130) throw new Error("Age must be between 0 and 130.");
//       }

//       // Call API
//       const patient = await api.registerPatient(currentUser, values);
//       // Set success message and re-render
//       receptionEnrollMessage = `Patient enrolled successfully. MRN: ${patient.mrn || "Generated"}`;
//       render();
//     }
//     // ===== NEW: reception create admission =====
//     if (action === "reception-create-admission") {
//       // Validation
//       if (!values.patientId) throw new Error("Please select a patient.");
//       if (!values.admissionType) throw new Error("Admission Type is required.");
//       if (!values.department) throw new Error("Department is required.");
//       if (!values.admissionDate) throw new Error("Admission Date is required.");
//       if (!values.admissionTime) throw new Error("Admission Time is required.");
//       if (!values.paymentType) throw new Error("Payment Type is required.");

//       // Prepare data for API (map field names)
//       const admissionData = {
//         patientId: values.patientId,
//         admissionType: values.admissionType,
//         department: values.department,
//         doctor: values.doctor || "",
//         admissionDateTime: `${values.admissionDate}T${values.admissionTime}`,
//         attendantName: values.attendantName || "",
//         attendantMobile: values.attendantMobile || "",
//         paymentType: values.paymentType,
//         insuranceCorporateName: values.insuranceCorporateName || "",
//         adminNotes: values.adminNotes || ""
//       };

//       await api.createAdmissionRequest(currentUser, admissionData);
//       receptionAdmissionMessage = "Admission created successfully.";
//       render();
//     }
//   } catch (error) {
//     toast(error.message, "error");
//   } finally {
//     stopFormLoading(form, loadingState);
//   }
// });

// document.addEventListener("keydown", (event) => {
//   if (event.key !== "Enter" && event.key !== " ") return;
//   const target = event.target.closest?.("[data-route], [data-action], [data-patient-filter], [data-admission-filter]");
//   if (!target) return;
//   if (target.matches("button, a, input, select, textarea")) return;
//   event.preventDefault();
//   target.click();
// });

// function emptyStateCreateAction(page) {
//   const map = {
//     dashboard: "register-patient", appointments: "create-appointment", patients: "register-patient", queue: "create-appointment",
//     admissions: "create-admission", billing: "generate-bill", finance: "generate-bill", stock: "add-stock", inventory: "add-stock",
//     purchase: "create-purchase-request", doctorSchedule: "create-doctor-schedule", staffRoster: "create-staff-roster", emergency: "create-emergency",
//     ot: "schedule-surgery", radiology: "order-radiology", mortuary: "register-death", permissionTemplates: "create-permission-template",
//     masterData: "create-master-data", subscriptions: "create-subscription", offers: "create-offer", tasks: "create-task", followups: "book-followup",
//     vitals: "record-vitals", ipdVitals: "record-ipd-vitals", dailySheets: "add-daily-sheet", dutyDoctor: "add-duty-note", nursing: "add-nursing-note",
//     intakeOutput: "add-intake-output", handover: "add-handover-note", documents: "upload-document", feedback: "submit-feedback",
//     "lab-samples": "create-master-data", "lab-processing": "create-master-data", "lab-results": "create-master-data",
//     "radiology-scheduling": "order-radiology", "radiology-queue": "order-radiology", "radiology-imaging": "order-radiology",
//     wards: "create-ward", ipd: "create-admission",
//   };
//   return map[page] || null;
// }

// document.addEventListener("click", async (event) => {
//   const target = event.target.closest("button, a");
//   const delegatedTarget = target || event.target.closest?.("[data-route], [data-action], [data-patient-filter], [data-admission-filter]");
//   if (!delegatedTarget) {
//     const row = event.target.closest("tr[data-route]");
//     if (!row) return;
//     if (event.target.closest("button, a, input, select, textarea, label")) return;
//     const patientId = row.dataset.patientId;
//     const admissionId = row.dataset.admissionId;
//     const tab = row.dataset.tab;
//     if (patientId) selectedPatientId = patientId;
//     notificationsDrawerOpen = false;
//     setPage(row.dataset.route, { patientId, admissionId, tab });
//     return;
//   }

//   if (delegatedTarget.dataset.action === "empty-state-add") {
//     event.preventDefault();
//     event.stopPropagation();
//     const page = String(delegatedTarget.dataset.emptyPage || pageFromHash() || "dashboard");
//     if (currentUser?.role === ROLES.BRANCH_USER && /^(doctor|surgeon)$/.test(String(currentUser?.jobRole || "").toLowerCase()) && page === "notifications") return;
//     const formAction = emptyStateCreateAction(page);
//     if (!formAction || !createForm(formAction)) {
//       toast("There is no add form available for this section.", "error");
//       return;
//     }
//     createTarget = formAction;
//     render();
//     return;
//   }

//   if (target.dataset.action === "open-create") {
//     event.preventDefault();
//     const formAction = String(target.dataset.formAction || "").trim();
//     if (!formAction || !createForm(formAction)) {
//       toast("This form is unavailable for your current access.", "error");
//       return;
//     }
//     createTarget = formAction;
//     render();
//     return;
//   }

//   if (handleNursePatientClick(delegatedTarget)) return;

//   if (delegatedTarget.dataset.route) {
//     const patientId = delegatedTarget.dataset.patientId;
//     const admissionId = delegatedTarget.dataset.admissionId;
//     const tab = delegatedTarget.dataset.tab;
//     if (delegatedTarget.dataset.notification && hasPermission(currentUser, "notifications", "edit")) {
//       await api.markNotificationRead(currentUser, delegatedTarget.dataset.notification).catch(() => null);
//     }
//     if (patientId) selectedPatientId = patientId;
//     notificationsDrawerOpen = false;
//     setPage(delegatedTarget.dataset.route, { patientId, admissionId, tab });
//     return;
//   }

//   const action = delegatedTarget.dataset.action;
//   if (delegatedTarget.dataset.patientFilter) {
//     setPatientStatusFilter(delegatedTarget.dataset.patientFilter);
//     render();
//     return;
//   }
//   if (delegatedTarget.dataset.admissionFilter) {
//     setAdmissionStatusFilter(delegatedTarget.dataset.admissionFilter);
//     render();
//     return;
//   }
//   if (action === "manage-admission") {
//     selectedAdmissionId = target.dataset.admission;
//     createTarget = "manage-admission";
//     render();
//     return;
//   }
//   if (action === "doctor-review-vitals") {
//     selectedQueueTokenId = target.dataset.queueToken;
//     createTarget = "review-opd-vitals";
//     render();
//     return;
//   }
//   if (action === "toggle-password-visibility") {
//     const input = target.closest(".password-field")?.querySelector("input");
//     if (input) {
//       const revealing = input.type === "password";
//       input.type = revealing ? "text" : "password";
//       target.textContent = revealing ? "Hide" : "Show";
//       target.setAttribute("aria-label", revealing ? "Hide password" : "Show password");
//     }
//     return;
//   }
//   const buttonLoadingState = startButtonLoading(target, action);
//   try {
//     if (action === "retry-page") {
//       render();
//     }
//     if (action === "toggle-notifications") {
//       notificationsDrawerOpen = !notificationsDrawerOpen;
//       render();
//     }
//     if (action === "close-notifications") {
//       notificationsDrawerOpen = false;
//       render();
//     }
//     if (action === "mark-all-notifications-read") {
//       await api.markAllNotificationsRead(currentUser);
//       toast("All notifications marked read.");
//       render();
//     }
//     if (action === "clear-read-notifications") {
//       await api.clearReadNotifications(currentUser);
//       toast("Read notifications cleared.");
//       render();
//     }
//     if (action === "run-provider-check") {
//       goLiveChecklistCache = null;
//       const status = await api.providerStatus();
//       const summary = [
//         status.mongodb?.status,
//         status.email?.status,
//         status.storage?.status,
//         status.sentry?.status,
//         status.betterStack?.status
//       ].filter(Boolean).join(" / ");
//       toast(`Provider status refreshed: ${summary}`);
//       render();
//     }
//     if (action === "patient-view" || action === "patient-view-history") {
//       selectedPatientId = target.dataset.patient;
//       toast("Patient context selected.");
//       render();
//     }
//     if (action === "emr-select") {
//       selectedPatientId = target.dataset.patient;
//       render();
//     }
//     if (action === "emr-clear") {
//       selectedPatientId = null;
//       render();
//     }
//     if (action === "patient-book-appointment") {
//       selectedPatientId = target.dataset.patient;
//       createTarget = "create-appointment";
//       render();
//     }
//     if (action === "patient-create-admission") {
//       selectedPatientId = target.dataset.patient;
//       setPage("admissions", { patientId: selectedPatientId });
//     }
//     if (action === "admit-patient") {
//       await api.admitPatient(currentUser, target.dataset.admission);
//       toast("Patient admitted. The admission is now visible to Nursing.");
//       render();
//     }
//     if (action === "patient-record-vitals") {
//       selectedPatientId = target.dataset.patient;
//       setPage("vitals", { patientId: selectedPatientId });
//     }
//     if (action === "patient-start-consultation") {
//       selectedPatientId = target.dataset.patient;
//       setPage("consultation", { patientId: selectedPatientId });
//     }
//     if (action === "add-consultation-row") {
//       const form = target.closest("form");
//       const kind = target.dataset.rowKind;
//       const list = form?.querySelector(`[data-consultation-list="${kind}"]`);
//       if (!list) return;
//       list.querySelector(".consultation-empty")?.remove();
//       const remove = `<button class="button tiny danger" type="button" data-action="remove-consultation-row">Remove</button>`;
//       const templates = {
//         diagnosis: `<div class="consultation-repeat-row diagnosis-row" data-consultation-row="diagnosis"><label>Secondary Diagnosis<input name="diagnosis" /></label><label>Notes<input name="diagnosisNotes" /></label>${remove}</div>`,
//         lab: `<div class="consultation-repeat-row" data-consultation-row="lab"><label>Lab Test<input name="labTest" placeholder="CBC" /></label><label>Clinical Indication<input name="labIndication" /></label><label>Priority<select name="labPriority"><option>Routine</option><option>Urgent</option><option>STAT</option></select></label><label>Notes<input name="labNotes" /></label>${remove}</div>`,
//         radiology: `<div class="consultation-repeat-row" data-consultation-row="radiology"><label>Study<input name="radiologyTest" placeholder="Chest X-ray" /></label><label>Clinical Indication<input name="radiologyIndication" /></label><label>Priority<select name="radiologyPriority"><option>Routine</option><option>Urgent</option><option>STAT</option></select></label><label>Notes<input name="radiologyNotes" /></label>${remove}</div>`,
//         medicine: `<div class="consultation-repeat-row medicine-row" data-consultation-row="medicine"><label>Medicine<input name="medicine" placeholder="Paracetamol" /></label><label>Strength<input name="strength" placeholder="500 mg" /></label><label>Dose<input name="dose" placeholder="1 tablet" /></label><label>Route<input name="route" placeholder="Oral" /></label><label>Frequency<input name="frequency" placeholder="Twice daily" /></label><label>Duration<input name="duration" placeholder="3 days" /></label><label>Instructions<input name="instructions" placeholder="After food" /></label>${remove}</div>`
//       };
//       list.insertAdjacentHTML("beforeend", templates[kind] || "");
//       if (["lab", "radiology"].includes(kind)) { const noInvestigation = form.querySelector("[data-no-investigation]"); if (noInvestigation) noInvestigation.checked = false; }
//       list.querySelector(`[data-consultation-row="${kind}"]:last-child input`)?.focus();
//     }
//     if (action === "remove-consultation-row") {
//       const row = target.closest("[data-consultation-row]");
//       const list = row?.parentElement;
//       const kind = row?.dataset.consultationRow;
//       row?.remove();
//       if (list && !list.querySelector("[data-consultation-row]")) list.innerHTML = `<p class="consultation-empty">No ${kind === "medicine" ? "medicines" : kind === "lab" ? "lab orders" : kind === "radiology" ? "radiology orders" : "secondary diagnoses"} added.</p>`;
//     }
//     if (action === "doctor-start-consultation") {
//       const encounter = { queueTokenId: target.dataset.queueToken || "", patientId: target.dataset.patientId || "", appointmentId: target.dataset.appointmentId || "" };
//       if (!encounter.queueTokenId && !(encounter.patientId && encounter.appointmentId)) throw new Error("Unable to start consultation: queue encounter is incomplete.");
//       const consultation = await api.startConsultation(currentUser, encounter);
//       selectedPatientId = consultation.patientId;
//       toast(`Consultation ${consultation.id} started.`);
//       setPage("consultation", { patientId: consultation.patientId, consultationId: consultation.id });
//     }
//     if (action === "patient-generate-bill") {
//       selectedPatientId = target.dataset.patient;
//       createTarget = "generate-bill";
//       render();
//     }
//     if (action === "open-ipd-360") {
//       setPage("ipdPatient360", { admissionId: target.dataset.patient });
//     }
//     if (action === "patient-check-in") {
//       const appointments = safeOptionalData(() => api.appointments(currentUser), []);
//       const appointment = appointments.find((item) => String(item.patientId) === String(target.dataset.patient) && ["Booked", "Active"].includes(item.status || "Active"));
//       if (!appointment) {
//         toast("Book an appointment before check-in.", "error");
//       } else {
//         await api.checkInAppointment(currentUser, appointment.id);
//         toast("Patient checked in. Next action: record vitals or view queue.");
//         setPage("queue", { patientId: target.dataset.patient });
//       }
//     }
//     if (action === "download-document") {
//       const file = await api.downloadDocument(currentUser, target.dataset.documentId);
//       downloadBase64File(file);
//       toast("Document downloaded.");
//     }
//     if (action === "patient-download-document") {
//       const file = await api.downloadPatientPortalDocument(target.dataset.documentId);
//       downloadBase64File(file);
//       toast("Document downloaded.");
//     }
//     if (action === "send-patient-portal-invite") {
//       const result = await api.sendPatientPortalInvite(currentUser, target.dataset.patientId);
//       toast(result.emailStatus === "skipped" ? "Portal invite recorded. Email provider is not configured, so no email was sent." : "Portal invite sent.");
//       render();
//     }
//     if (action === "toggle-branch-patient-portal") {
//       const nextEnabled = target.dataset.enabled !== "true";
//       await api.setBranchPatientPortalAccess(currentUser, target.dataset.branchId, nextEnabled);
//       toast(nextEnabled ? "Patient portal access enabled for this branch." : "Patient portal access disabled for this branch.");
//       render();
//     }
//     if (action === "toggle-branch-public-booking") {
//       const nextEnabled = target.dataset.enabled !== "true";
//       await api.setBranchPublicBookingAccess(currentUser, target.dataset.branchId, nextEnabled);
//       toast(nextEnabled ? "Public website booking enabled for this branch." : "Public website booking disabled for this branch.");
//       render();
//     }
//     if (action === "delete-document-file") {
//       await api.deleteDocumentFile(currentUser, target.dataset.documentId);
//       toast("Document deleted.");
//       render();
//     }
//     if (action === "close-create") {
//       createTarget = null;
//       render();
//     }
//     if (action === "select-permission-group" || action === "clear-permission-group") {
//       const form = target.closest('form[data-action="create-user"]');
//       form?.querySelectorAll(`input[name="allowedPages"][data-group="${target.dataset.group}"]`).forEach((input) => {
//         if (!input.disabled) input.checked = action === "select-permission-group";
//       });
//       updatePermissionBuilder(form);
//     }
//     if (action === "preview-permissions") {
//       updatePermissionBuilder(target.closest('form[data-action="create-user"]'));
//       toast("Access preview updated.");
//     }
//     if (action === "view-access") {
//       accessReviewTarget = target.dataset.user;
//       render();
//     }
//     if (action === "review-access") {
//       await api.reviewUserAccess(currentUser, target.dataset.user, target.dataset.review);
//       accessReviewTarget = target.dataset.user;
//       toast(target.dataset.review === "Reviewed" ? "User access marked reviewed." : "Access changes requested.");
//       render();
//     }
//     if (action === "revoke-sensitive") {
//       await api.revokeSensitivePermissions(currentUser, target.dataset.user);
//       accessReviewTarget = target.dataset.user;
//       toast("Sensitive permissions revoked.");
//       render();
//     }
//     if (action === "disable-access-user") {
//       await api.disableUser(currentUser, target.dataset.user);
//       accessReviewTarget = target.dataset.user;
//       toast("User disabled.");
//       render();
//     }
//     if (action === "duplicate-template") {
//       await api.duplicatePermissionTemplate(currentUser, target.dataset.template);
//       toast("Permission template duplicated.");
//       render();
//     }
//     if (action === "disable-template") {
//       await api.disablePermissionTemplate(currentUser, target.dataset.template);
//       toast("Permission template disabled.");
//       render();
//     }
//     if (action === "subscription-info") {
//       api.logSensitiveAction?.(currentUser, "subscriptions", "Plan setup opened", "Subscription plans");
//       toast("Plan setup request logged. Configure billing limits with the SaaS owner.");
//     }
//     if (action === "disable-subscription") {
//       await api.disableSubscriptionPlan(currentUser, target.dataset.plan);
//       toast("Subscription plan disabled. Existing hospitals remain visible.");
//       render();
//     }
//     if (action === "disable-offer") {
//       await api.disableOffer(currentUser, target.dataset.offer);
//       toast("Offer disabled.");
//       render();
//     }
//     if (action === "ot-advance") {
//       const note = target.dataset.note || "";
//       await api.transitionOtBooking(currentUser, target.dataset.ot, { status: target.dataset.status, note });
//       toast(`OT case moved to ${target.dataset.status}.`);
//       render();
//     }
//     if (action === "ot-cancel") {
//       await api.transitionOtBooking(currentUser, target.dataset.ot, { status: "Cancelled", note: "Cancelled from OT board." });
//       toast("OT case cancelled.");
//       render();
//     }
//     if (action === "rad-advance") {
//       const nextStatus = target.dataset.status;
//       const payload = { status: nextStatus };
//       if (nextStatus === "Reported") {
//         const impression = window.prompt("Radiologist impression (required to report):", target.dataset.impression || "");
//         if (!impression) return;
//         payload.impression = impression;
//         payload.findings = window.prompt("Findings (optional):", "") || "";
//       }
//       await api.transitionRadiologyOrder(currentUser, target.dataset.rad, payload);
//       toast(`Imaging study moved to ${nextStatus}.`);
//       render();
//     }
//     if (action === "rad-cancel") {
//       await api.transitionRadiologyOrder(currentUser, target.dataset.rad, { status: "Cancelled", note: "Cancelled from RIS board." });
//       toast("Imaging study cancelled.");
//       render();
//     }
//     if (action === "mortuary-release") {
//       const releasedTo = window.prompt("Released to (name of person receiving the body):");
//       if (!releasedTo) return;
//       const relationship = window.prompt("Relationship to the deceased:") || "";
//       const isMlc = target.dataset.mlc === "true";
//       const policeClearance = isMlc ? window.confirm("MLC case: confirm police clearance has been obtained?") : false;
//       await api.releaseMortuaryBody(currentUser, target.dataset.mortuary, { releasedTo, relationship, policeClearance });
//       toast("Body released and recorded.");
//       render();
//     }
//     if (action === "mortuary-certificate") {
//       const causeOfDeath = window.prompt("Cause of death for the certificate:", target.dataset.cause || "");
//       if (!causeOfDeath) return;
//       await api.issueDeathCertificate(currentUser, target.dataset.mortuary, { causeOfDeath });
//       toast("Death certificate issued.");
//       render();
//     }
//     if (action === "module-toggle") {
//       api.logSensitiveAction?.(currentUser, "modules", "Module configuration reviewed", target.dataset.module);
//       toast(`${target.dataset.module} module configuration reviewed.`);
//     }
//     if (action === "select-search-result") {
//       const item = globalSearchSuggestions[Number(target.dataset.searchIndex || 0)];
//       if (item) {
//         globalSearchQuery = item.title || globalSearchQuery;
//         const route = searchResultRoute(item);
//         setPage(route.page, route.query);
//       }
//     }
//     if (action === "view-all-search") {
//       setPage("globalSearch");
//       render();
//     }
//     if (action === "retry-global-search") {
//       runGlobalSearch(globalSearchQuery);
//     }
//     if (action === "open-edit") {
//       editTarget = { collection: target.dataset.collection, id: target.dataset.id };
//       render();
//     }
//     if (action === "close-edit") {
//       editTarget = null;
//       render();
//     }
//     if (action === "delete-record") {
//       if (target.dataset.collection === "patients") {
//         const dependencies = patientDeleteDependencies(target.dataset.id);
//         if (dependencies.length) {
//           toast("Patient cannot be deleted because hospital workflow records are linked to this patient.", "error");
//           return;
//         }
//       }
//       deleteTarget = { collection: target.dataset.collection, id: target.dataset.id };
//       render();
//     }
//     if (action === "cancel-delete") {
//       deleteTarget = null;
//       render();
//     }
//     if (action === "confirm-delete-record") {
//       if (target.dataset.collection === "patients" && patientDeleteDependencies(target.dataset.id).length) {
//         deleteTarget = null;
//         toast("Patient cannot be deleted because an appointment or workflow record is linked.", "error");
//         render();
//         return;
//       }
//       await api.deleteRecord(currentUser, target.dataset.collection, target.dataset.id);
//       if (target.dataset.collection === "patients" && String(selectedPatientId || "") === String(target.dataset.id || "")) selectedPatientId = null;
//       deleteTarget = null;
//       toast("Record deleted.");
//       render();
//     }
//     if (action === "logout") {
//       await api.logout(currentUser);
//       currentUser = null;
//       selectedPatientId = null;
//       globalSearchQuery = "";
//       globalSearchSuggestions = [];
//       globalSearchStatus = "idle";
//       globalSearchError = "";
//       notificationsDrawerOpen = false;
//       setPage("login");
//       render();
//     }
//     if (action === "sample-upload") {
//       const type = document.querySelector('select[name="recordType"]')?.value || "Appointments";
//       pendingUpload.rows = parseCsv(sampleCsv());
//       pendingUpload.recordType = type;
//       pendingUpload.validation = validateRows(pendingUpload.rows, type);
//       toast("Sample CSV loaded.");
//       render();
//     }
//     if (action === "ack-alert") {
//       await api.updateAlert(currentUser, target.dataset.alert, "Acknowledged");
//       toast("Alert acknowledged.");
//       render();
//     }
//     if (action === "task-from-alert") {
//       const alert = api.alerts(currentUser).find((item) => item.id === target.dataset.alert);
//       await api.createTask(currentUser, {
//         title: `Action: ${alert.title}`,
//         description: alert.recommendation,
//         linkedAlert: alert.id,
//         linkedRecords: alert.linkedRecords,
//         branchId: alert.branchId,
//         department: alert.department,
//         assignedTo: alert.owner,
//         priority: alert.risk,
//         due: alert.due
//       });
//       toast("Task created from alert.");
//       setPage("tasks");
//     }
//     if (action === "complete-task") {
//       await api.updateTask(currentUser, target.dataset.task, "Completed");
//       toast("Task marked complete.");
//       render();
//     }
//     if (action === "check-in") {
//       const result = await api.checkInAppointment(currentUser, target.dataset.appointment);
//       toast(result?.status === "Arrived" ? "Patient arrival confirmed. Check-In is now available." : `Patient checked in${result?.tokenNumber ? ` with token ${result.tokenNumber}` : ""}. Next action: Record Vitals or View Queue.`);
//       render();
//     }
//     if (action === "lab-ready") {
//       await api.updateLabOrder(currentUser, target.dataset.order, {
//         status: "Report Ready",
//         reportFile: `Report-${target.dataset.order}.pdf`
//       });
//       toast("Report marked ready.");
//       render();
//     }
//     if (action === "issue-pharmacy") {
//       await api.issuePharmacy(currentUser, target.dataset.issue);
//       toast("Medicines issued.");
//       render();
//     }
//     if (action === "collect-payment") {
//       await api.collectPayment(currentUser, target.dataset.bill);
//       toast("Payment collected. Next action: Checkout Patient or Print Receipt.");
//       render();
//     }
//     if (action === "pay-online") {
//       const billId = target.dataset.bill;
//       const order = await api.createRazorpayOrder(currentUser, billId);
//       if (typeof window.Razorpay !== "function") throw new Error("Payment popup could not load. Check your connection and try again.");
//       const checkout = new window.Razorpay({
//         key: order.keyId,
//         order_id: order.orderId,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Hospital Operations",
//         description: "Bill payment",
//         handler: async (response) => {
//           try {
//             await api.verifyRazorpayPayment(currentUser, billId, {
//               razorpayOrderId: response.razorpay_order_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature
//             });
//             toast("Payment verified and recorded. Next action: Checkout Patient or Print Receipt.");
//             render();
//           } catch (error) {
//             toast(error.message, "error");
//           }
//         },
//         modal: {
//           ondismiss: () => toast("Payment window closed. No payment was recorded.")
//         }
//       });
//       checkout.open();
//     }
//     if (action === "complete-checkout") {
//       await api.completeCheckout(currentUser, target.dataset.checkout);
//       toast("Patient checkout completed.");
//       render();
//     }
//     if (action === "assign-bed") {
//       await api.assignBed(currentUser, target.dataset.admission, { bedId: target.dataset.bed });
//       toast("Bed assigned and daily sheet created.");
//       render();
//     }
//     if (action === "update-bed-status") {
//       await api.updateRecord(currentUser, "beds", target.dataset.bed, { status: target.dataset.status });
//       toast(`Bed marked ${target.dataset.status}.`);
//       render();
//     }
//     if (action === "mark-med-given") {
//       await api.markMedicationGiven(currentUser, target.dataset.mar);
//       toast("Medication marked given.");
//       render();
//     }
//     if (action === "accept-handover") {
//       await api.acceptHandover(currentUser, target.dataset.handover);
//       toast("Handover accepted.");
//       render();
//     }
//     if (action === "complete-discharge") {
//       await api.completeDischargeStep(currentUser, target.dataset.plan);
//       toast("Discharge checklist completed.");
//       render();
//     }
//     if (action === "complete-clearance") {
//       const fieldMap = {
//         doctor: { doctorAdviceCompleted: true },
//         nursing: { nursingClearance: true },
//         pharmacy: { pharmacyClearance: true },
//         lab: { labRadiologyClearance: true },
//         billing: { billingClearance: true },
//         insurance: { insuranceClearance: true },
//         education: { patientEducationGiven: true },
//         bed: { bedReleased: true }
//       };
//       await api.completeClearance(currentUser, target.dataset.plan, fieldMap[target.dataset.clearance] || {});
//       toast("Clearance completed.");
//       render();
//     }
//     if (action === "submit-death-summary") {
//       await api.submitDeathSummary(currentUser, target.dataset.admission);
//       toast("Death Summary submitted for review.");
//       setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
//     }
//     if (action === "approve-death-summary") {
//       await api.approveDeathSummary(currentUser, target.dataset.admission);
//       toast("Death Summary finalized.");
//       setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
//     }
//     if (action === "return-death-summary") {
//       await api.returnDeathSummary(currentUser, target.dataset.admission, { reason: "Correction requested from clinical review." });
//       toast("Death Summary returned for correction.");
//       setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
//     }
//     if (action === "print-death-summary") {
//       await api.printDeathSummary(currentUser, target.dataset.admission);
//       toast("Death Summary print/export recorded.");
//       setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
//       setTimeout(() => window.print?.(), 100);
//     }
//     if (action === "toggle-master-data") {
//       const item = safeOptionalData(() => api.masterDataItems(currentUser), []).find((entry) => String(entry.id) === String(target.dataset.master));
//       await api.toggleMasterDataItem(currentUser, target.dataset.master, {
//         status: item?.status === "Active" ? "Inactive" : "Active",
//         isActive: item?.status !== "Active"
//       });
//       toast("Master record updated.");
//       render();
//     }
//     if (action === "mark-notification-read") {
//       await api.markNotificationRead(currentUser, target.dataset.notification);
//       toast("Notification marked read.");
//       render();
//     }
//     if (action === "stock-adjust") {
//       await api.adjustStock(currentUser, { stockId: target.dataset.stock, quantityChange: 10, reason: "Manual stock correction" });
//       toast("Stock adjusted.");
//       render();
//     }
//     if (action === "approve-purchase") {
//       await api.approvePurchaseRequest(currentUser, target.dataset.request);
//       toast("Purchase request approved and PO created.");
//       render();
//     }
//     if (action === "receive-goods") {
//       await api.receiveGoods(currentUser, target.dataset.po);
//       toast("Goods received and stock updated.");
//       render();
//     }
//     if (action === "manual-backup") {
//       await api.runManualBackup(currentUser, {
//         backupId: `check-${Date.now()}`,
//         dateTime: new Date().toISOString(),
//         provider: "MongoDB Atlas",
//         status: "Checked",
//         size: "Managed in Atlas",
//         triggeredBy: currentUser.email || currentUser.name,
//         notes: "Backup status check recorded. Snapshot execution remains in MongoDB Atlas."
//       });
//       toast("Backup check logged. Complete snapshots in MongoDB Atlas.");
//       render();
//     }
//     if (action === "request-restore") {
//       createTarget = "request-restore";
//       toast("Restore request logged for manual approval.");
//       render();
//     }
//     if (action === "export-csv") {
//       exportCsv(target.dataset.kind || "records");
//       toast("CSV export started.");
//     }
//     if (action === "export-excel") {
//       exportExcel();
//       toast("Excel export started.");
//     }
//     if (action === "print-report") {
//       if (!hasPermission(currentUser, "reports", "export")) throw new Error("You do not have permission to perform this action.");
//       api.logSensitiveAction?.(currentUser, "reports", "Export PDF", target.dataset.kind || "report");
//       await api.printDocument(currentUser, { documentType: "Report", module: "reports", recordId: target.dataset.kind || "report" }).catch(() => null);
//       window.print();
//     }
//     if (action === "print-prescription") {
//       const id = target.dataset.id;
//       await api.printDocument(currentUser, { documentType: "Prescription", module: "consultation", recordId: id }).catch(() => null);
//       toast("Prescription print copy opened.");
//       window.print();
//     }
//     if (action === "print-lab-order") {
//       const id = target.dataset.id;
//       await api.printDocument(currentUser, { documentType: "Lab / Radiology Order", module: "lab", recordId: id }).catch(() => null);
//       toast("Order print copy opened.");
//       window.print();
//     }
//     if (action === "print-bill") {
//       const id = target.dataset.id;
//       await api.printDocument(currentUser, { documentType: "Bill / Receipt", module: "billing", recordId: id }).catch(() => null);
//       toast("Bill print copy opened.");
//       window.print();
//     }
//   } catch (error) {
//     toast(error.message, "error");
//   } finally {
//     stopButtonLoading(target, buttonLoadingState);
//   }
// });

// document.addEventListener("change", async (event) => {
//   const input = event.target;
//   if (input.matches?.("[data-progressive-toggle]")) {
//     const form = input.closest("form");
//     const fields = form?.querySelector(`[data-progressive-fields="${input.dataset.progressiveToggle}"]`);
//     fields?.classList.toggle("hidden", !input.checked);
//     return;
//   }
//   if (input.matches?.("[data-no-investigation]")) {
//     const form = input.closest("form");
//     const orderRows = form?.querySelectorAll('[data-consultation-row="lab"], [data-consultation-row="radiology"]') || [];
//     if (input.checked && orderRows.length) {
//       if (!window.confirm("Clear the added Lab and Radiology orders?")) { input.checked = false; return; }
//       orderRows.forEach((row) => row.remove());
//       ["lab", "radiology"].forEach((kind) => {
//         const list = form.querySelector(`[data-consultation-list="${kind}"]`);
//         if (list) list.innerHTML = `<p class="consultation-empty">No ${kind} orders added.</p>`;
//       });
//     }
//     return;
//   }
//   if (input.matches?.("[data-admission-ward]")) {
//     const bedSelect = input.closest("form")?.querySelector("[data-admission-bed]");
//     if (bedSelect) {
//       bedSelect.value = "";
//       [...bedSelect.options].forEach((option) => {
//         if (!option.value) return;
//         const matches = String(option.dataset.wardId || "") === String(input.value || "");
//         option.hidden = !matches;
//         option.disabled = !matches;
//       });
//     }
//     return;
//   }
//   if (input.matches?.("[data-template-select]")) {
//     const textarea = input.closest("label")?.querySelector("textarea") || input.parentElement?.previousElementSibling;
//     const template = TEXT_TEMPLATES.find(([label]) => label === input.value);
//     if (textarea && template?.[1]) {
//       textarea.value = textarea.value.trim() ? `${textarea.value.trim()}\n\n${template[1]}` : template[1];
//       textarea.dispatchEvent(new Event("input", { bubbles: true }));
//       toast("Template inserted as editable draft.");
//       input.value = "";
//     }
//     return;
//   }
//   const appointmentForm = input.closest?.('form[data-action="create-appointment"], form[data-action="patient-book-appointment"], form[data-action="public-book-appointment"]');
//   if (appointmentForm && input.matches?.("[data-existing-patient]")) {
//     fillAppointmentFromPatient(appointmentForm);
//     return;
//   }
//   if (appointmentForm && input.matches?.("[data-appointment-department]")) {
//     filterAppointmentDoctors(appointmentForm);
//     return;
//   }
//   const userForm = input.closest?.('form[data-action="create-user"]');
//   if (userForm && input.name === "jobRole") {
//     applyUserRolePreset(userForm);
//     return;
//   }
//   if (userForm && input.name === "templateId" && input.value) {
//     const template = api.permissionTemplates(currentUser).find((item) => item.id === input.value);
//     if (template) {
//       if (userForm.jobRole) userForm.jobRole.value = template.jobRole || userForm.jobRole.value;
//       setPermissionPages(userForm, template.allowedPages || []);
//       const modulesInput = userForm.querySelector("[data-allowed-modules]");
//       if (modulesInput) modulesInput.value = (template.allowedModules || []).join(",");
//       toast("Permission template applied to preview.");
//     }
//     return;
//   }
//   if (userForm && input.name === "cloneFromUserId" && input.value) {
//     const source = api.users(currentUser).find((item) => item.id === input.value);
//     if (source) {
//       if (userForm.jobRole) userForm.jobRole.value = source.jobRole || userForm.jobRole.value;
//       setPermissionPages(userForm, source.allowedPages || []);
//       const modulesInput = userForm.querySelector("[data-allowed-modules]");
//       if (modulesInput) modulesInput.value = (source.allowedModules || []).join(",");
//       toast("Existing user permissions copied to preview.");
//     }
//     return;
//   }
//   if (userForm && (input.name === "allowedPages" || input.name?.startsWith("permission:"))) {
//     if (input.name?.startsWith("permission:") && input.value !== "view" && input.checked) {
//       const row = input.closest("[data-permission-row]");
//       const view = row?.querySelector('input[value="view"]');
//       if (view) view.checked = true;
//     }
//     updatePermissionBuilder(userForm);
//     return;
//   }
//   if (input.matches('input[type="file"][name="file"]') && input.files?.[0]) {
//     const type = document.querySelector('select[name="recordType"]')?.value || "Appointments";
//     const text = await readFileAsText(input.files[0]);
//     pendingUpload.rows = parseCsv(text);
//     pendingUpload.recordType = type;
//     pendingUpload.validation = validateRows(pendingUpload.rows, type);
//     toast(`${pendingUpload.rows.length} rows parsed.`);
//     render();
//   }

//   // ===== NEW: Admission patient select auto-fill =====
//   if (input.matches?.("[data-admission-patient]")) {
//     const form = input.closest("form");
//     const selectedOption = input.options[input.selectedIndex];
//     if (selectedOption && selectedOption.value) {
//       const mrn = selectedOption.dataset.mrn || "";
//       const mobile = selectedOption.dataset.mobile || "";
//       const age = selectedOption.dataset.age || "";
//       const gender = selectedOption.dataset.gender || "";
//       const ageGender = age && gender ? `${age} / ${gender}` : (age || gender || "");
//       form.querySelector('[name="mrn"]').value = mrn;
//       form.querySelector('[name="mobile"]').value = mobile;
//       form.querySelector('[name="ageGender"]').value = ageGender;
//     } else {
//       form.querySelector('[name="mrn"]').value = "";
//       form.querySelector('[name="mobile"]').value = "";
//       form.querySelector('[name="ageGender"]').value = "";
//     }
//   }
// });

// document.addEventListener("input", (event) => {
//   const input = event.target;
//   if (input.matches?.("[data-admission-search]")) {
//     setAdmissionSearchQuery(input.value);
//     render();
//     return;
//   }
//   if (handleNursePatientInput(input)) return;
//   if (input.matches?.("[data-patient-search]")) {
//     setPatientSearchQuery(input.value);
//     render();
//     const refreshed = app.querySelector?.("[data-patient-search]");
//     refreshed?.focus();
//     refreshed?.setSelectionRange(refreshed.value.length, refreshed.value.length);
//     return;
//   }
//   if (input.matches?.("[data-global-search]")) {
//     runGlobalSearch(input.value, 300);
//     return;
//   }
//   if (input.matches?.("[data-draft-key]")) {
//     scheduleDraftSave(input);
//     return;
//   }
//   if (input.matches?.("[data-permission-search]")) {
//     const query = input.value.toLowerCase();
//     const form = input.closest('form[data-action="create-user"]');
//     form?.querySelectorAll(".check-card").forEach((card) => {
//       card.classList.toggle("hidden", query && !card.textContent.toLowerCase().includes(query));
//     });
//   }
//   if (input.matches?.("[data-audit-search]")) {
//     auditSearchQuery = input.value;
//     render();
//   }
// });

// document.addEventListener("keydown", (event) => {
//   const input = event.target;
//   if (input.matches?.("[data-global-search]")) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();
//       globalSearchActiveIndex = Math.min(globalSearchSuggestions.length - 1, globalSearchActiveIndex + 1);
//       render();
//     }
//     if (event.key === "ArrowUp") {
//       event.preventDefault();
//       globalSearchActiveIndex = Math.max(-1, globalSearchActiveIndex - 1);
//       render();
//     }
//     if (event.key === "Escape") {
//       globalSearchSuggestions = [];
//       globalSearchActiveIndex = -1;
//       render();
//     }
//     if (event.key === "Enter") {
//       event.preventDefault();
//       const selected = globalSearchSuggestions[globalSearchActiveIndex];
//       if (selected) globalSearchQuery = selected.title || globalSearchQuery;
//       else globalSearchQuery = input.value;
//       setPage("globalSearch");
//     }
//   }
//   const row = input.closest?.("tr[data-route]");
//   if (row && !input.closest?.("button, a, input, select, textarea, label")) {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       row.click();
//     }
//   }
// });

// window.addEventListener("hashchange", render);

// let __dataRenderScheduled = false;
// function scheduleDataRender() {
//   if (__dataRenderScheduled) return;
//   __dataRenderScheduled = true;
//   const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(cb, 16);
//   raf(() => { __dataRenderScheduled = false; try { render(); } catch (_e) { /* render guards itself */ } });
// }
// if (typeof api.onDataRefresh === "function") {
//   api.onDataRefresh((_path, error) => {
//     if (error && isAuthError(error)) {
//       if (currentUser) {
//         currentUser = null;
//         setPage("login");
//         renderAuth("login");
//         toast("Your session expired. Please sign in again.", "error");
//       }
//       return;
//     }
//     scheduleDataRender();
//   });
// }

// function warmDataCache() {
//   if (!currentUser || typeof api.warm !== "function") return;
//   const dash = currentUser.role === "SUPER_ADMIN" ? "/platform/dashboard"
//     : currentUser.role === "HOSPITAL_ADMIN" ? "/hospital/dashboard" : "/branch/dashboard";
//   const gatedPaths = [
//     ["/notifications", "notifications"],
//     ["/patients", "patients"],
//     ["/appointments", "appointments"],
//     ["/queue-tokens", "queue"],
//     ["/patient-flows", "queue"],
//     ["/lab-orders", "lab"],
//     ["/pharmacy-issues", "pharmacy"],
//     ["/bills", "billing"],
//     ["/admissions", "admissions"],
//     ["/beds", "wards"],
//     ["/tasks", "tasks"],
//     ["/alerts", "alerts"],
//     ["/master-data", "masterData"],
//     ["/branches", "branches"],
//     ["/users", "users"],
//     ["/discharge-plans", "discharge"],
//     ["/death-summaries", "deathSummary"],
//     ["/ot-bookings", "ot"],
//     ["/mortuary-records", "mortuary"],
//     ["/radiology-orders", "radiology"]
//   ].filter(([, module]) => permitted(module)).map(([path]) => path);
//   api.warm([dash, ...gatedPaths]);
// }

// if (!location.hash) setPage(currentUser ? "dashboard" : "login");
// render();
// setTimeout(warmDataCache, 60);
import { NAV_BY_ROLE, ROLES, canAccessPage, hasPermission, normalizePageKey, scopeDescription } from "../lib/rbac.js";
import { api, getApiMode, parseCsv, validateRows } from "../services/api.js";
import { initFrontendSentry } from "../sentry.js";
import { COLLECTION_MODULES, MASTER_MODULES, PAGE_TITLE_FALLBACK, SENSITIVE_USER_PERMISSIONS, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, roleLabels } from "../config/app-config.js";
import { billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, currencyDisplay, currencyValue, escapeAttribute, escapeHtml, firstDefined, formatDateTime, formatGb, isBillPaidToday, isPendingStatus, isToday, localDateInputValue, localDateKey, minutesSince, money, recordTime, toNumber } from "../utils/formatters.js";
import { pageFromHash, parseHashRoute, routeKey, setPage } from "../routing/router.js";
import { asArray, badge, emptyState, formValues, strongPassword, titleCase } from "../ui/primitives.js";
import { configurePageRenderers as configurePatientFlowPages, admissionsPage, appointmentsPage, billingPage, checkoutPage, consultationPage, documentsPage, emergencyPage, emrPage, followUpsPage, labPage, patientsPage, pharmacyPage, queuePage, radiologyPage, setAdmissionSearchQuery, setAdmissionStatusFilter, vitalsPage } from "../pages/patient-flow.js";
import { configurePageRenderers as configureIpdClinicalPages, dailySheetsPage, dischargePage, dutyDoctorPage, handoverPage, intakeOutputPage, ipdAlertsPage, ipdPage, ipdPatient360Page, ipdReportsPage, ipdVitalsPage, marPage, mortuaryPage, nursingPage, otPage, wardsPage } from "../pages/ipd-clinical.js";
import {
  mortuaryStoragePage,
  mortuaryCertificatesPage,
  mortuaryReleasePage,
  mortuaryRegisterPage,
  mortuarySearchPage,
  mortuaryReportsPage,
  handleMortuarySubmit
} from "../modules/mortuary/index.js";
import { configurePageRenderers as configureAdministrationPages, accessReviewPage, auditPage, backupPage, branchesPage, compliancePage, doctorSchedulePage, feedbackPage, financePage, hospitalsPage, masterDataPage, permissionTemplatesPage, purchasePage, settingsPage, setupPage, staffRosterPage, stockPage, usersPage } from "../pages/administration.js";
import { configurePageRenderers as configureOperationsPages, alertsPage, claimsPage, globalSearchPage, inventoryPage, mappingPage, notificationsPage, recordsPage, reportsPage, tasksPage, uploadPage } from "../pages/operations.js";
import { configurePageRenderers as configurePlatformPages, modulesPage, offersPage, productFlowPage, profilePage, subscriptionsPage } from "../pages/platform.js";
import { nurseMyPatientsPage } from "../modules/nursing/my-patients.js";
import { buildNursePatientRows } from "../modules/nursing/nurse-patient-data.js";
import { handleNursePatientClick, handleNursePatientInput } from "../modules/nursing/nurse-patient-filters.js";
import { linkedPatientRecords, setPatientSearchQuery, setPatientStatusFilter } from "../modules/reception/patient-filters.js";
import { opdVitalsStage } from "../modules/opd/journey-status.js";
import { opdConsultationJourney } from "../modules/opd/consultation-journey.js";
import { clearPharmacySearch, dispensePayload, dispensingPage as pharmacyWorkflowDispensingPage, inventoryPage as pharmacyWorkflowInventoryPage, paymentsPage as pharmacyWorkflowPaymentsPage, prescriptionsPage as pharmacyWorkflowPrescriptionsPage, returnsPage as pharmacyWorkflowReturnsPage, setPharmacySearch } from "../modules/pharmacy/workflow.js";

const app = document.querySelector("#app");
let currentUser = api.currentUser();
let pendingUpload = { rows: [], recordType: "Appointments", validation: null };
let globalSearchQuery = "";
let globalSearchSuggestions = [];
let globalSearchActiveIndex = -1;
let globalSearchStatus = "idle";
let globalSearchError = "";
let globalSearchTimer = null;
let auditSearchQuery = "";
let editTarget = null;
let createTarget = null;
let accessReviewTarget = null;
let deleteTarget = null;
let selectedPatientId = null;
let selectedAdmissionId = null;
let selectedQueueTokenId = null;
let notificationsDrawerOpen = false;
let renderedPageKey = "";
let stagedPageKey = "";
let stagedPageTimer = null;
const draftTimers = new Map();
let automationSettingsCache = null;
let automationSettingsCacheUserId = null;
let goLiveChecklistCache = null;
let goLiveChecklistCacheUserId = null;
let receptionEnrollMessage = ""; // for success message after patient enrollment
let receptionAdmissionMessage = ""; // for success message after admission creation
let hospitalAdminBranchId = "all";

initFrontendSentry();
const localFrontendMode = getApiMode() === "local";
const environmentLabel = localFrontendMode ? "" : "Production";

function shouldStagePage(page, query = {}) {
  const key = routeKey(page, query);
  if (renderedPageKey === key) return false;
  if (stagedPageKey === key) {
    stagedPageKey = "";
    return false;
  }
  stagedPageKey = key;
  clearTimeout(stagedPageTimer);
  stagedPageTimer = setTimeout(() => {
    if (stagedPageKey === key) render();
  }, 40);
  return true;
}

function isAuthError(error) {
  return /authentication required|please sign in|invalid token|token expired|invalid token signature|jwt expired/i.test(error?.message || "");
}

function isUnauthorizedError(error) {
  return /permission|access denied|forbidden|governance access denied|not allowed/i.test(error?.message || "");
}

function safeData(loader, fallback = []) {
  try {
    return loader();
  } catch (error) {
    if (isAuthError(error)) throw error;
    console.warn(error.message);
    return fallback;
  }
}

function safeOptionalData(loader, fallback = []) {
  try {
    return loader();
  } catch (error) {
    if (isAuthError(error)) throw error;
    console.warn(error.message);
    return fallback;
  }
}

function permitted(module, action = "view") {
  return hasPermission(currentUser, module, action);
}

function metricTrend(label, value) {
  const text = String(label || "").toLowerCase();
  if (["backup provider", "frequency", "retention"].includes(text)) return "Policy setting";
  if (text.includes("storage")) return "Current usage";
  if (text.includes("alert") || text.includes("task") || text.includes("pending")) return Number(value || 0) > 0 ? "Needs attention" : "Clear";
  return "Live metric";
}

function formatAuditValue(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") {
    return Object.entries(value).slice(0, 6).map(([key, entry]) => `${titleCase(key)}: ${entry}`).join("; ");
  }
  const text = String(value);
  if (!/^[\[{]/.test(text.trim())) return text;
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return `${parsed.length} item${parsed.length === 1 ? "" : "s"}`;
    return Object.entries(parsed).slice(0, 6).map(([key, entry]) => `${titleCase(key)}: ${entry}`).join("; ");
  } catch {
    return text;
  }
}

function riskClass(value) {
  return `risk-${String(value || "low").toLowerCase()}`;
}

function statusClass(value) {
  const text = String(value || "").toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "status-completed";
  if (/(cancel|blocked?|error|critical|abnormal|maintenance|expired|inactive|suspended|failed|rejected)/.test(text)) return "status-blocked";
  if (/(wait|pending|booked|confirmed|scheduled|requested|draft|new|open|not reviewed|not started|ordered|preparing|sent to pharmacy|billing pending|pharmacy pending|lab pending|documents pending|admission requested|discharge planned)/.test(text)) return "status-pending";
  if (/(in progress|current|checked in|checked-in|arrived|admitted|registered|under treatment|in consultation|recorded|doctor updated|nurse updated|bed assigned|queue|vitals)/.test(text)) return "status-in-progress";
  if (/(active|clear|success|paid|issued|report ready|ready for checkout|ready for discharge|given|accepted|approved|resolved|verified|available)/.test(text)) return "status-active";
  return "status-completed";
}

const SETUP_WIZARD_STEPS = [
  "Hospital profile",
  "Subscription",
  "Main branch",
  "Branch admin",
  "Users",
  "Roles and permissions",
  "Departments",
  "Providers",
  "Test patient flow / go live"
];

const SETUP_STEP_ALIASES = {
  "hospital profile": "Hospital profile",
  "create hospital": "Hospital profile",
  "hospital profile completed": "Hospital profile",
  "hospital profile done": "Hospital profile",
  hospital: "Hospital profile",
  subscription: "Subscription",
  "assign subscription": "Subscription",
  "subscription completed": "Subscription",
  "subscription done": "Subscription",
  "main branch": "Main branch",
  "create main branch": "Main branch",
  "main branch completed": "Main branch",
  "main branch done": "Main branch",
  branches: "Main branch",
  "branch admin": "Branch admin",
  "create branch admin": "Branch admin",
  "branch admin completed": "Branch admin",
  "branch admin done": "Branch admin",
  users: "Users",
  "create operational users": "Users",
  "operational users": "Users",
  "users completed": "Users",
  "users done": "Users",
  "roles and permissions": "Roles and permissions",
  permissions: "Roles and permissions",
  "roles and permissions completed": "Roles and permissions",
  "roles and permissions done": "Roles and permissions",
  departments: "Departments",
  "configure departments": "Departments",
  "departments completed": "Departments",
  "departments done": "Departments",
  providers: "Providers",
  "configure providers": "Providers",
  "providers completed": "Providers",
  "providers done": "Providers",
  "test patient flow": "Test patient flow / go live",
  "run test patient flow": "Test patient flow / go live",
  "go live": "Test patient flow / go live",
  "test patient flow completed": "Test patient flow / go live",
  "test patient flow done": "Test patient flow / go live",
  "go live completed": "Test patient flow / go live",
  "go live done": "Test patient flow / go live"
};

function normalizeSetupStep(step) {
  const text = String(step || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  if (!text) return "";
  return SETUP_STEP_ALIASES[text] || SETUP_WIZARD_STEPS.find((item) => item.toLowerCase() === text) || String(step).trim();
}

function collectSetupStepValues(progress = {}) {
  const values = [];
  const add = (entry) => {
    if (entry === undefined || entry === null || entry === false || entry === "") return;
    if (Array.isArray(entry)) {
      entry.forEach(add);
      return;
    }
    if (typeof entry === "string") {
      entry.split(/[\n,;|]/).map((item) => item.trim()).filter(Boolean).forEach(add);
      return;
    }
    if (typeof entry === "object") {
      Object.entries(entry).forEach(([key, value]) => {
        if (value === true) values.push(key);
        else if (typeof value === "string" && value.trim()) values.push(value);
      });
      return;
    }
    values.push(entry);
  };
  add(progress.completedSteps);
  add(progress.completed);
  add(progress.steps);
  add(progress.milestones);
  add(progress.checklist);
  add(progress.items);
  if (!values.length && progress && typeof progress === "object") {
    Object.entries(progress).forEach(([key, value]) => {
      if (value === true) values.push(key);
      else if (typeof value === "string" && value.trim()) values.push(value);
    });
  }
  return values;
}

function setupProgressSummary(progress = {}) {
  const completed = new Set(collectSetupStepValues(progress).map(normalizeSetupStep).filter(Boolean));
  const completedCount = SETUP_WIZARD_STEPS.filter((step) => completed.has(step)).length;
  const percent = Math.round((completedCount / SETUP_WIZARD_STEPS.length) * 100);
  const next = SETUP_WIZARD_STEPS.find((step) => !completed.has(step)) || SETUP_WIZARD_STEPS[SETUP_WIZARD_STEPS.length - 1];
  return { completed, percent, next };
}

function inferredSetupProgress(progress = {}) {
  const completed = new Set(setupProgressSummary(progress).completed);
  if (currentUser?.hospitalId) completed.add("Hospital profile");
  if (hasPermission(currentUser, "branches", "view")) {
    const branches = safeOptionalData(() => api.branches(currentUser), []);
    if (branches.length) completed.add("Main branch");
  } else if (currentUser?.branchId) {
    completed.add("Main branch");
  }
  if (hasPermission(currentUser, "users", "view")) {
    const users = safeOptionalData(() => api.users(currentUser), []);
    if (users.some((user) => user.role === ROLES.BRANCH_ADMIN)) completed.add("Branch admin");
    if (users.some((user) => user.role === ROLES.BRANCH_USER)) completed.add("Users");
  }
  if (hasPermission(currentUser, "permissionTemplates", "view") || hasPermission(currentUser, "accessReview", "view")) {
    completed.add("Roles and permissions");
  }
  if (hasPermission(currentUser, "masterData", "view")) {
    const items = safeOptionalData(() => api.masterDataItems(currentUser), []);
    if (items.some((item) => String(item.type || "").toLowerCase() === "department")) completed.add("Departments");
  }
  if (hasPermission(currentUser, "settings", "view")) {
    const providers = safeOptionalData(() => api.providerStatus?.(), null);
    if (providers?.mongodb?.configured || providers?.storage?.configured || providers?.email?.configured) completed.add("Providers");
  }
  const completedCount = SETUP_WIZARD_STEPS.filter((step) => completed.has(step)).length;
  const percent = Math.round((completedCount / SETUP_WIZARD_STEPS.length) * 100);
  const next = SETUP_WIZARD_STEPS.find((step) => !completed.has(step)) || SETUP_WIZARD_STEPS[SETUP_WIZARD_STEPS.length - 1];
  return { completed, percent, next };
}

const OPD_JOURNEY_STEPS = [
  { key: "appointment", label: "Appointment Booked" },
  { key: "checkedIn", label: "Checked In" },
  { key: "vitals", label: "Vitals Recorded" },
  { key: "consultation", label: "Consultation Done" },
  { key: "lab", label: "Lab Ordered" },
  { key: "pharmacy", label: "Medicine Issued" },
  { key: "billing", label: "Bill Paid" },
  { key: "checkout", label: "Checkout Completed" }
];

function latestPatientJourneyStage(patientId, data = deriveOperationalData()) {
  const patientKey = String(patientId || "");
  const hasAppointment = data.appointments.some((item) => String(item.patientId) === patientKey);
  const hasQueue = data.queue.some((item) => String(item.patientId) === patientKey);
  const hasVitals = data.vitals.some((item) => String(item.patientId) === patientKey);
  const hasConsultation = data.consultations.some((item) => String(item.patientId) === patientKey);
  const hasLab = data.labOrders.some((item) => String(item.patientId) === patientKey);
  const hasPharmacy = data.pharmacyIssues.some((item) => String(item.patientId) === patientKey && item.status === "Issued");
  const hasPaidBill = data.bills.some((item) => String(item.patientId) === patientKey && billPaidAmount(item) > 0);
  const hasCheckout = (data.checkouts || []).some((item) => String(item.patientId) === patientKey && item.status === "Completed");
  const stageStates = [
    { key: "appointment", active: hasAppointment },
    { key: "checkedIn", active: hasQueue },
    { key: "vitals", active: hasVitals },
    { key: "consultation", active: hasConsultation },
    { key: "lab", active: hasLab },
    { key: "pharmacy", active: hasPharmacy },
    { key: "billing", active: hasPaidBill },
    { key: "checkout", active: hasCheckout }
  ];
  const latestIndex = stageStates.reduce((index, stage, currentIndex) => (stage.active ? currentIndex : index), -1);
  const current = latestIndex >= 0 ? stageStates[latestIndex].key : "appointment";
  const completed = new Set(["registered"]);
  for (let index = 0; index <= latestIndex; index += 1) {
    completed.add(stageStates[index].key);
  }
  return {
    completed,
    current,
    label: latestIndex >= 0 ? OPD_JOURNEY_STEPS.find((step) => step.key === current)?.label || "In progress" : "Waiting for Doctor"
  };
}

function financeSummaryFromBills(bills = []) {
  const rowsByDate = new Map();
  bills.forEach((bill) => {
    const dateKey = localDateKey(billPaymentTimestamp(bill) || bill.updatedAt || bill.createdAt);
    if (!dateKey) return;
    const bucket = rowsByDate.get(dateKey) || {
      reportType: "Daily Revenue",
      date: dateKey,
      pharmacySales: 0,
      labRevenue: 0,
      opdRevenue: 0,
      ipdRevenue: 0,
      refunds: 0,
      discounts: 0,
      cashCollection: 0,
      cardCollection: 0,
      upiCollection: 0,
      insurancePending: 0,
      outstandingAmount: 0,
      totalCollection: 0,
      status: "Generated"
    };
    const paid = billPaidAmount(bill);
    const total = billTotalAmount(bill);
    const mode = String(bill.paymentType || bill.paymentMode || "").toLowerCase();
    const itemsText = `${String(bill.items || "")} ${String(bill.department || "")} ${String(bill.notes || "")}`.toLowerCase();
    const source = String(bill.admissionId ? "ipd" : bill.consultationId || bill.visitId || bill.appointmentId ? "opd" : "").toLowerCase();
    bucket.totalCollection += paid;
    bucket.discounts += toNumber(bill.discount, 0);
    bucket.outstandingAmount += billBalanceAmount(bill);
    if (mode.includes("cash")) bucket.cashCollection += paid;
    else if (mode.includes("card")) bucket.cardCollection += paid;
    else if (mode.includes("upi") || mode.includes("online")) bucket.upiCollection += paid;
    else if (mode.includes("insurance")) bucket.insurancePending += Math.max(total - paid, 0);
    if (source === "ipd") bucket.ipdRevenue += paid;
    else bucket.opdRevenue += paid;
    if (itemsText.includes("pharmacy")) bucket.pharmacySales += paid;
    if (itemsText.includes("lab") || itemsText.includes("radiology")) bucket.labRevenue += paid;
    rowsByDate.set(dateKey, bucket);
  });
  const reports = [...rowsByDate.values()].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const todayRow = reports.find((row) => row.date === localDateKey()) || {
    reportType: "Daily Revenue",
    date: localDateKey(),
    pharmacySales: 0,
    labRevenue: 0,
    opdRevenue: 0,
    ipdRevenue: 0,
    refunds: 0,
    discounts: 0,
    cashCollection: 0,
    cardCollection: 0,
    upiCollection: 0,
    insurancePending: 0,
    outstandingAmount: 0,
    totalCollection: 0,
    status: "Generated"
  };
  return { reports, todayRow };
}

function dateSeriesFromRows(rows = [], valueGetter = () => 1, dateGetter = (row) => recordTime(row)) {
  const buckets = new Map();
  rows.forEach((row) => {
    const key = localDateKey(dateGetter(row));
    if (!key) return;
    buckets.set(key, (buckets.get(key) || 0) + Number(valueGetter(row) || 0));
  });
  const ordered = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-7);
  return {
    labels: ordered.map(([key]) => key.slice(5)),
    values: ordered.map(([, value]) => value)
  };
}

function notificationGroup(notification = {}) {
  const explicit = String(notification.category || "").trim();
  if (explicit) return explicit;
  const text = `${notification.module || ""} ${notification.title || ""} ${notification.message || ""}`.toLowerCase();
  if (/billing|payment|refund|claim/.test(text)) return "Billing";
  if (/queue|appointment|check-in|check in|vitals/.test(text)) return "Queue";
  if (/lab|radiology/.test(text)) return "Lab";
  if (/pharmacy|medicine/.test(text)) return "Pharmacy";
  if (/discharge|bed release/.test(text)) return "Discharge";
  if (/document|upload|storage/.test(text)) return "Documents";
  if (/access|governance|audit|permission/.test(text)) return "Permission";
  if (/provider|backup|email|sentry|mongodb|system/.test(text)) return "System";
  return "Clinical";
}

function automationSettingsForScope() {
  const defaults = {
    queueWaitingMinutes: 45,
    labPendingMinutes: 120,
    radiologyPendingMinutes: 120,
    pharmacyPendingMinutes: 60,
    billingPendingMinutes: 90,
    marDueMinutes: 30,
    dischargeClearanceMinutes: 180,
    reportUploadDelayMinutes: 180,
    documentReadinessMinutes: 240,
    goLiveChecklistReminderMinutes: 1440,
    autoTaskCreationEnabled: true,
    reminderNotificationsEnabled: true
  };
  if (!currentUser || !hasPermission(currentUser, "settings", "view")) return defaults;
  if (automationSettingsCache && automationSettingsCacheUserId === currentUser.id) return automationSettingsCache;
  automationSettingsCache = { ...defaults, ...safeOptionalData(() => api.automationSettings(currentUser), {}) };
  automationSettingsCacheUserId = currentUser.id;
  return automationSettingsCache;
}

function goLiveChecklistForScope() {
  if (!currentUser || !hasPermission(currentUser, "settings", "view")) return null;
  if (goLiveChecklistCache && goLiveChecklistCacheUserId === currentUser.id) return goLiveChecklistCache;
  goLiveChecklistCache = safeOptionalData(() => api.goLiveChecklist(currentUser), null);
  goLiveChecklistCacheUserId = currentUser.id;
  return goLiveChecklistCache;
}

function mergeNotifications(data = deriveOperationalData()) {
  const saved = hasPermission(currentUser, "notifications", "view") ? safeOptionalData(() => api.notifications(currentUser)) : [];
  const derived = hasPermission(currentUser, "notifications", "view") ? deriveNotifications(data) : [];
  const all = [
    ...saved.map((item) => ({ ...item, source: "Saved" })),
    ...derived.map((item, index) => ({ id: item.id || `derived-${index}`, ...item, source: "Derived" }))
  ];
  const seen = new Set();
  return all.filter((item) => {
    const key = [item.automationKey, item.title, item.message, item.route, item.patientId, item.admissionId, item.module].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((item) => ({ priority: item.priority || "info", category: notificationGroup(item), ...item }));
}

function severityForDelay(delayMinutes = 0, thresholdMinutes = 1) {
  const delay = Number(delayMinutes || 0);
  const threshold = Math.max(Number(thresholdMinutes || 1), 1);
  if (delay >= threshold * 4) return "critical";
  if (delay >= threshold * 2) return "high";
  if (delay >= threshold) return "medium";
  return "low";
}

function delayLabel(minutes = 0) {
  const value = Math.max(Math.round(Number(minutes || 0)), 0);
  if (value >= 1440) return `${Math.round(value / 1440)}d`;
  if (value >= 60) return `${Math.floor(value / 60)}h ${value % 60}m`;
  return `${value}m`;
}

function roleWorkQueue(data = deriveOperationalData()) {
  const roleText = `${currentUser.role || ""} ${currentUser.jobRole || ""}`;
  const lowerRole = roleText.toLowerCase();
  return deriveTasks(data).filter((task) => {
    const text = `${task.assignedTo || ""} ${task.module || ""} ${task.title || ""}`.toLowerCase();
    if (currentUser.role === ROLES.SUPER_ADMIN || currentUser.role === ROLES.HOSPITAL_ADMIN || currentUser.role === ROLES.BRANCH_ADMIN) return true;
    if (lowerRole.includes("reception")) return /queue|appointment|billing|checkout|vitals/.test(text);
    if (lowerRole.includes("duty doctor")) return /ipd|ward|discharge|doctor|death|handover|vitals/.test(text);
    if (lowerRole.includes("doctor")) return /consult|doctor|lab|radiology|admission|follow/.test(text);
    if (lowerRole.includes("nurse")) return /vitals|mar|nursing|intake|handover/.test(text);
    if (lowerRole.includes("lab")) return /lab|sample|report/.test(text);
    if (lowerRole.includes("radiology")) return /radiology|report/.test(text);
    if (lowerRole.includes("pharmacy")) return /pharmacy|medicine|stock/.test(text);
    if (lowerRole.includes("billing")) return /billing|bill|payment|checkout|clearance/.test(text);
    if (lowerRole.includes("claim")) return /claim|document|insurance/.test(text);
    return true;
  });
}

function rowRouteButton(label, route, query = {}, className = "inline-link") {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  const attrs = [...params.entries()].map(([key, value]) => ` data-${escapeAttribute(key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`))}="${escapeAttribute(value)}"`).join("");
  return `<button class="${escapeHtml(className)}" type="button" data-route="${escapeHtml(route)}"${attrs}>${escapeHtml(label)}</button>`;
}

function currentPageTitle(page) {
  if (currentUser?.role === ROLES.BRANCH_ADMIN) {
    const item = BRANCH_ADMIN_NAV.find(([key]) => key === page);
    if (item) return item[1];
  }
  if(currentUser?.role===ROLES.BRANCH_USER&&/radiology/.test(String(currentUser.jobRole||"").toLowerCase())){const item=RADIOLOGY_NAV.find(([key])=>key===page);if(item)return item[1]}
  if(currentUser?.role===ROLES.BRANCH_USER&&/mortuary/.test(String(currentUser.jobRole||"").toLowerCase())){const item=MORTUARY_NAV.find(([key])=>key===page);if(item)return item[1]}
  if (currentUser?.role === ROLES.BRANCH_USER && /billing|finance/.test(String(currentUser?.jobRole || "").toLowerCase())) {
    const item = BILLING_NAV.find(([key]) => key === page); if (item) return item[1];
  }
  if (currentUser?.role === ROLES.BRANCH_USER && /lab/.test(String(currentUser?.jobRole || "").toLowerCase())) {
    const item = LAB_NAV.find(([key]) => key === page); if (item) return item[1];
  }
  if (currentUser?.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser?.jobRole || "").toLowerCase())) {
    const pharmacyItem = PHARMACY_NAV.find(([key]) => key === page);
    if (pharmacyItem) return pharmacyItem[1];
  }
  if (currentUser?.role === ROLES.BRANCH_USER && ["doctor", "surgeon"].includes(String(currentUser?.jobRole || "").toLowerCase())) {
    const doctorItem = DOCTOR_NAV.find(([key]) => key === page);
    if (doctorItem) return doctorItem[1];
  }
  if (currentUser?.role === ROLES.BRANCH_USER && String(currentUser?.jobRole || "").toLowerCase() === "nurse") {
    const nurseItem = NURSE_NAV.find(([key]) => key === page);
    if (nurseItem) return nurseItem[1];
  }
  if (currentUser?.role === ROLES.BRANCH_USER && String(currentUser?.jobRole || "").toLowerCase() === "reception user") {
    const receptionItem = RECEPTION_NAV.find(([key]) => key === page);
    if (receptionItem) return receptionItem[1];
  }
  const nav = NAV_BY_ROLE[currentUser?.role] || [];
  return nav.find(([key]) => key === page)?.[1] || PAGE_TITLE_FALLBACK[page] || titleCase(String(page).replaceAll("-", " "));
}

function navIcon(page) {
  return nurseNavIcon(page);
}

const BRANCH_ADMIN_NAV = [
  ["dashboard", "Dashboard", "Overview"],
  ["appointments", "Appointments", "Patient Operations"],
  ["patients", "Patients", "Patient Operations"],
  ["queue", "Queue", "Patient Operations"],
  ["admissions", "Admissions", "Patient Operations"],
  ["checkout", "Checkout", "Patient Operations"],
  ["followups", "Follow-ups", "Patient Operations"],
  ["lab", "Lab", "Clinical Operations"],
  ["radiology", "Radiology", "Clinical Operations"],
  ["pharmacy", "Pharmacy", "Clinical Operations"],
  ["emergency", "Emergency", "Clinical Operations"],
  ["ot", "Operation Theatre", "Clinical Operations"],
  ["ipd", "IPD Patients", "IPD"],
  ["wards", "Wards & Beds", "IPD"],
  ["discharge", "Discharges", "IPD"],
  ["ipdAlerts", "IPD Alerts", "IPD"],
  ["users", "Staff Users", "Staff"],
  ["doctorSchedule", "Doctor Schedule", "Staff"],
  ["staffRoster", "Duty Roster", "Staff"],
  ["billing", "Billing", "Finance"],
  ["finance", "Collections", "Finance"],
  ["reports", "Finance Reports", "Finance"],
  ["inventory", "Inventory", "Inventory"],
  ["stock", "Low Stock", "Inventory"],
  ["purchase", "Purchase Orders", "Inventory"]
];

const HOSPITAL_ADMIN_NAV = [
  ["dashboard", "Dashboard", "OVERVIEW"],
  ["hospitals", "Hospital Profile", "ORGANIZATION"],
  ["branches", "Branch Management", "ORGANIZATION"],
  ["users", "Branch Admins", "ORGANIZATION"],
  ["masterData", "Departments", "ORGANIZATION"],
  ["staffRoster", "Staff Management", "ORGANIZATION"],
  ["permissionTemplates", "Roles & Permissions", "ORGANIZATION"],
  ["patients", "Patients", "OPERATIONS"],
  ["appointments", "Appointments", "OPERATIONS"],
  ["ipd", "OPD / IPD", "OPERATIONS"],
  ["wards", "Wards & Beds", "OPERATIONS"],
  ["billing", "Billing", "FINANCE"],
  ["finance", "Services & Pricing", "FINANCE"],
  ["stock", "Pharmacy Inventory", "SUPPORT SERVICES"],
  ["records", "Laboratory Management", "SUPPORT SERVICES"],
  ["compliance", "Radiology Management", "SUPPORT SERVICES"],
  ["inventory", "Inventory", "SUPPORT SERVICES"],
  ["reports", "Reports & Analytics", "INSIGHTS"],
  ["notifications", "Notifications", "INSIGHTS"],
  ["audit", "Audit Logs", "INSIGHTS"],
  ["settings", "Settings", "SYSTEM"]
];

const NURSE_NAV = [
  ["dashboard", "Dashboard", "Overview"],
  ["patients", "My Patients", "Patient Care"],
  ["admissions", "Admissions", "Patient Care"],
  ["ipdPatient360", "Patient 360", "Patient Care"],
  ["nursing", "Nursing Care", "Nursing Care"],
  ["dailySheets", "Daily Sheets", "Nursing Care"],
  ["vitals", "OPD Vitals", "Clinical"],
  ["ipdVitals", "IPD Vitals", "Clinical"],
  ["dutyDoctor", "Doctor Orders", "Clinical"],
  ["intakeOutput", "Intake / Output", "Clinical"],
  ["handover", "Handover", "Handover"],
  ["tasks", "My Tasks", "Work"],
  ["alerts", "Alerts", "Work"]
];

const RECEPTION_NAV = [
  ["dashboard", "Dashboard", "Overview"],
  ["patients", "Enroll Patient", "Patients"],
  ["records", "Patient Records", "Patients"],
  ["admissions", "New Admission", "Admission"],
  ["admission-records", "Admission Records", "Admission"],
  ["billing", "Create Invoice", "Billing"]
];
const DOCTOR_NAV = [
  ["dashboard", "My Dashboard", "Overview"],
  ["patients", "My Patients", "Patient Care"],
  ["queue", "Queue", "Patient Care"],
  ["admissions", "Admitted Patients", "Patient Care"],
  ["consultation", "Consultation", "Clinical"],
  ["ipdPatient360", "Patient 360", "Clinical"],
  ["pharmacy", "Prescriptions", "Clinical"],
  ["lab", "Lab", "Orders & Results"],
  ["radiology", "Radiology", "Orders & Results"],
  ["ipd", "My IPD Patients", "IPD Care"],
  ["dailySheets", "Daily Progress", "IPD Care"],
  ["dutyDoctor", "Doctor Orders", "IPD Care"],
  ["discharge", "Discharge", "IPD Care"],
  ["doctorSchedule", "My Schedule", "Schedule / Follow-up"],
  ["followups", "Follow-ups", "Schedule / Follow-up"],
  ["documents", "Documents", "Documents"],
  ["ot", "Operation Theatre", "Surgery"],
  ["tasks", "My Tasks", "Work"],
  ["notifications", "Notifications", "Work"]
];

const PHARMACY_NAV = [
  ["pharmacy", "Prescriptions", "Pharmacy"],
  ["pharmacy-payments", "Payments", "Pharmacy"],
  ["pharmacy-dispensing", "Dispensing", "Pharmacy"],
  ["stock", "Inventory / Stock", "Pharmacy"],
  ["returns", "Returns", "Pharmacy"]
];

const BILLING_NAV = [
  ["dashboard","My Dashboard","Overview"],["billing","Bills","Billing"],["payments","Payments","Billing"],["claims","Claims","Billing"],["ipd-billing","IPD Billing","Billing"],["checkout","Checkout","Billing"],["refunds","Refunds / Adjustments","Finance"],["billing-search","Patient / Bill Search","Finance"],["tasks","My Tasks","Work"],["alerts","Alerts","Work"],["reports","Reports","Reports"]
];

const LAB_NAV = [
  ["dashboard","My Dashboard","Overview"],["lab","Lab Orders","Lab"],["lab-samples","Sample Collection","Lab"],["lab-processing","Sample Processing","Lab"],["lab-results","Results","Lab"],["lab-search","Patient / Order Search","Search / Documents"],["documents","Documents","Search / Documents"],["tasks","My Tasks","Work"],["alerts","Alerts","Work"],["reports","Reports","Reports"]
];
const RADIOLOGY_NAV=[["dashboard","My Dashboard","Overview"],["radiology","Radiology Orders","Radiology"],["radiology-scheduling","Scheduling","Radiology"],["radiology-queue","Scan Queue","Radiology"],["radiology-imaging","Imaging / Scan","Radiology"],["radiology-results","Reports","Radiology"],["radiology-search","Patient / Order Search","Search / Documents"],["documents","Documents","Search / Documents"],["tasks","My Tasks","Work"],["alerts","Alerts","Work"],["reports","Radiology Reports","Analytics"]];
// const MORTUARY_NAV=[["dashboard","My Dashboard","Overview"],["mortuary","Register Death","Mortuary"],["mortuary-storage","Body Storage","Mortuary"],["mortuary-release","Release / Handover","Mortuary"],["Issue Certificate","documents"],["documents","Issue certificate","Certificates"],["reports","Reports","Reports"]];
const MORTUARY_NAV = [
  ["dashboard", "My Dashboard", "Overview"],

  ["mortuary", "Register Death", "Mortuary"],
  ["mortuary-storage", "Body Storage", "Mortuary"],
  ["mortuary-certificates", "Certificates", "Mortuary"],
  ["mortuary-release", "Release Body", "Mortuary"],

  ["mortuary-register", "Mortuary Register", "Records"],
  ["mortuary-search", "Patient / Case Search", "Records"],
  ["documents", "Documents", "Records"],

  ["reports", "Reports", "Reports"]
];
function nurseNavIcon(page) {
  const paths = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    appointments: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M13 14h3"/>',
    patients: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    queue: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><circle cx="18" cy="16" r="3"/>',
    admissions: '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M9 8h2M13 8h2M9 12h2M13 12h2"/>',
    billing: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    checkout: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
    followups: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
    notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    globalSearch: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    records: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>',
    admissions: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8M8 11h5M15 16h5m-2-3 3 3-3 3"/>',
    ipdPatient360: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
    nursing: '<path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z"/><path d="M2 14c3 1 5 4 5 7M22 14c-3 1-5 4-5 7"/>',
    dailySheets: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>',
    ipdVitals: '<path d="M3 12h4l2-5 4 10 2-5h6"/><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/>',
    mar: '<path d="M6 3h12l2 5-2 13H6L4 8z"/><path d="M5 8h14M9 13h6M12 10v6"/>',
    dutyDoctor: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
    intakeOutput: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/><path d="M9 16c.7 1.2 1.7 1.8 3 1.8"/>',
    handover: '<path d="m8 12 3 3 5-6M2 10l4-4 4 2M22 10l-4-4-4 2M6 14l4 4h4l4-4"/>',
    tasks: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 2 2 5-5"/>',
    alerts: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
    ,pharmacy: '<path d="M7 3h10v5l-3 3v10H6V11L3 8V3h4M6 14h8M10 3v5"/>'
    ,"pharmacy-dispensing": '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>'
    ,"pharmacy-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M8 10h4M10 8v4"/>'
    ,stock: '<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10"/>'
    ,returns: '<path d="M9 7H5v4M5 11c2-5 9-7 13-3M15 17h4v-4M19 13c-2 5-9 7-13 3"/>'
    ,reports: '<path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7"/>'
    ,billing: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4"/>'
    ,payments: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'
    ,claims: '<path d="M12 2l8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6zM9 12l2 2 4-5"/>'
    ,"ipd-billing": '<path d="M4 21V5l8-3 8 3v16M8 21v-5h8v5M8 8h2M14 8h2M8 12h2M14 12h2"/>'
    ,checkout: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>'
    ,refunds: '<path d="M4 7v5h5M5 12a8 8 0 1 0 2-6M12 8v8M9 10h5a2 2 0 0 1 0 4H9"/>'
    ,"billing-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
    ,lab: '<path d="M9 2h6M10 2v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3L14 8V2M8 15h8"/>'
    ,"lab-samples": '<path d="M9 2h6v4l2 3v10a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9l2-3zM7 13h10"/>'
    ,"lab-processing": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
    ,"lab-results": '<path d="M6 2h12v20H6zM9 7h6M9 11h6M9 15l2 2 4-4"/>'
    ,"lab-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
    ,documents: '<path d="M6 2h9l4 4v16H6zM14 2v5h5M9 12h7M9 16h7"/>'
    ,radiology: '<path d="M4 4h16v13H4zM8 21h8M12 17v4M8 8h8M8 12h5"/>'
    ,"radiology-scheduling": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>'
    ,"radiology-queue": '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/>'
    ,"radiology-imaging": '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m5 18 5-5 3 3 2-2 4 4"/>'
    ,"radiology-results": '<path d="M6 2h12v20H6zM9 7h6M9 11h6M9 15l2 2 4-4"/>'
    ,"radiology-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
    ,mortuary: '<path d="M5 4h14v17H5zM8 8h8M12 6v6M8 16h8"/>'
    ,"mortuary-intake": '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5"/>'
    ,"mortuary-storage": '<path d="M3 5h18v14H3zM3 10h18M8 5v14M16 5v14"/>'
    ,"mortuary-release": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3 3 7-7"/>'
    ,"mortuary-search": '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    hospitals: '<path d="M3 21V5l9-3 9 3v16M8 21v-5h8v5M8 8h2M14 8h2M8 12h2M14 12h2"/>',
    branches: '<path d="M4 21V4h10v17M14 9h6v12M7 8h4M7 12h4M7 16h4M17 13h1M17 17h1"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M17 5a4 4 0 0 1 0 6M19 15a5 5 0 0 1 3 4v2"/>',
    accessReview: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="m15 16 2 2 4-4"/>',
    permissionTemplates: '<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/>',
    setup: '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="19" r="2"/>',
    radiology: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v5M12 15v5M4 12h5M15 12h5"/>',
    emr: '<path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4"/>',
    ipd: '<path d="M4 21V5l8-3 8 3v16M8 21v-5h8v5M9 8h2M13 8h2M9 12h2M13 12h2"/>',
    wards: '<path d="M3 18v-6h18v6M5 12V9h6v3M13 12V9h6v3M5 18v3M19 18v3"/>',
    doctorSchedule: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M13 14h3"/>',
    staffRoster: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><circle cx="17" cy="16" r="2"/>',
    discharge: '<path d="M4 3h12v18H4zM16 12h5M18 9l3 3-3 3M8 7h5M8 11h5M8 15h3"/>',
    ot: '<path d="M4 21V5h16v16M8 9h8M8 13h5M12 21v-4"/><path d="M18 2v4M16 4h4"/>',
    ipdAlerts: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    finance: '<path d="M4 19V5h16v14M8 15v-3M12 15V8M16 15v-5"/>',
    inventory: '<path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10"/>',
    purchase: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="M17 16v4M15 18h4"/>',
    audit: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
    compliance: '<path d="M12 2l8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6zM9 12l2 2 4-5"/>',
    backup: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    productFlow: '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 11 10-4M7 13l10 4"/>',
    masterData: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="M17 16v4M15 18h4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    globalSearch: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    financeReports: '<path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7"/>',
    ipdReports: '<path d="M5 20V10h4v10M10 20V4h4v16M15 20v-7h4v7"/>',
    records: '<path d="M6 2h9l4 4v16H6zM14 2v5h5M9 12h7M9 16h7"/>',
    notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[page] || '<circle cx="12" cy="12" r="9"/>'}</svg>`;
}

function actionIcon(name = "") {
  const key = String(name || "").toLowerCase();
  if (/add|create|register|book|new/.test(key)) return "＋";
  if (/edit|review|clone|duplicate/.test(key)) return "✎";
  if (/delete|disable|clear|close|remove|deactivate/.test(key)) return "⌫";
  if (/refresh|provider|sync|run/.test(key)) return "↻";
  if (/open|view|search|records/.test(key)) return "↗";
  if (/read|mark|complete|check|acknowledge|approve|finalize/.test(key)) return "✓";
  if (/bill|payment|receipt|collect|generate bill/.test(key)) return "₹";
  if (/lab|radiology|report|upload/.test(key)) return "◫";
  if (/medicine|mar|pharmacy|stock/.test(key)) return "✚";
  if (/alert|warning|risk/.test(key)) return "⚠";
  if (/print|export|download/.test(key)) return "⇩";
  return "›";
}

function iconLabel(icon, label, hiddenLabel = true) {
  return `<span class="button-icon" aria-hidden="true">${escapeHtml(icon)}</span><span class="${hiddenLabel ? "sr-only" : "button-label"}">${escapeHtml(label)}</span>`;
}

function navGroupLabel(page, previousPage) {
  const groups = {
    dashboard: "Overview",
    hospitals: "Platform",
    subscriptions: "Platform",
    offers: "Platform",
    modules: "Platform",
    branches: "Hospital Overview",
    setup: "Hospital Overview",
    appointments: "Patient Flow",
    patients: "Patient Flow",
    queue: "Patient Flow",
    checkout: "Patient Flow",
    followups: "Patient Flow",
    vitals: "Clinical",
    consultation: "Clinical",
    lab: "Clinical",
    radiology: "Clinical",
    emr: "Clinical",
    admissions: "Clinical",
    ipd: "IPD Care",
    ipdPatient360: "IPD Care",
    wards: "IPD Care",
    dailySheets: "IPD Care",
    dutyDoctor: "IPD Care",
    nursing: "IPD Care",
    ipdVitals: "IPD Care",
    mar: "IPD Care",
    intakeOutput: "IPD Care",
    handover: "IPD Care",
    discharge: "IPD Care",
    ot: "IPD Care",
    deathSummary: "IPD Care",
    mortuary: "IPD Care",
    ipdReports: "IPD Care",
    ipdAlerts: "IPD Care",
    emergency: "Emergency",
    billing: "Revenue",
    finance: "Revenue",
    claims: "Revenue",
    pharmacy: "Pharmacy & Inventory",
    stock: "Inventory",
    inventory: "Inventory",
    purchase: "Inventory",
    reports: "Reports",
    records: "Reports",
    uploads: "Reports",
    mapping: "Reports",
    users: "Administration",
    accessReview: "Governance",
    permissionTemplates: "Governance",
    audit: "Governance",
    compliance: "Governance",
    backup: "Governance",
    productFlow: "Reference",
    masterData: "Settings",
    doctorSchedule: "Settings",
    staffRoster: "Settings",
    settings: "Settings",
    profile: "Account"
  };
  const label = groups[page];
  const previous = groups[previousPage];
  return label && label !== previous ? label : "";
}

function addButtonTestId(formAction) {
  if (formAction === "create-user") {
    if (currentUser?.role === ROLES.SUPER_ADMIN) return "add-hospital-admin-button";
    if (currentUser?.role === ROLES.HOSPITAL_ADMIN) return "add-branch-admin-button";
    return "add-user-button";
  }
  const ids = {
    "create-hospital": "add-hospital-customer-button",
    "create-branch": "add-branch-button",
    "create-appointment": "book-appointment-button",
    "register-patient": "create-patient-button",
    "generate-bill": "generate-bill-button",
    "add-stock": "add-stock-button",
    "create-task": "create-task-button",
    "create-master-data": "add-master-record-button",
    "create-permission-template": "create-permission-template-button",
    "create-subscription": "add-subscription-plan-button"
  };
  return ids[formAction] || `open-${formAction}-button`;
}

function modalSubmitTestId(action) {
  const ids = {
    "create-hospital": "create-hospital-submit-button",
    "create-branch": "create-branch-submit-button",
    "create-user": "create-user-submit-button",
    "create-appointment": "book-appointment-submit-button",
    "register-patient": "register-patient-submit-button",
    "generate-bill": "generate-bill-submit-button",
    "add-stock": "add-stock-submit-button",
    "create-task": "create-task-submit-button",
    "create-master-data": "create-master-record-submit-button",
    "create-permission-template": "create-permission-template-submit-button",
    "create-subscription": "create-subscription-submit-button"
  };
  return ids[action] || "modal-submit-button";
}

function render() {
  try {
    currentUser = api.currentUser();
    const { route: page, query } = parseHashRoute();
    if (query.patientId) selectedPatientId = query.patientId;

    if (currentUser?.mustChangePassword) {
      renderMustChangePasswordGate();
      return;
    }

    if (["forgot", "reset", "reset-password", "patient-login", "patient-invite"].includes(page)) {
      renderAuth(page);
      return;
    }

    if (page === "book") {
      renderPublicBooking(query);
      return;
    }

    if (!currentUser) {
      renderAuth(page);
      return;
    }

    if (currentUser.role === "PATIENT") {
      renderPatientPortal(page, query);
      return;
    }

    if (!canAccessPage(currentUser, page)) {
      renderShell(page, { forceUnauthorized: true });
      return;
    }
    if (shouldStagePage(page, query)) {
      renderShell(page, { loading: true });
      return;
    }
    renderShell(page, { query });
  } catch (error) {
    if (isAuthError(error)) {
      currentUser = null;
      setPage("login");
      renderAuth("login");
      toast("Your session expired. Please sign in again.", "error");
      return;
    }
    app.innerHTML = `<main class="auth-shell"><section class="auth-hero"><div class="auth-card narrow"><h1>Unable to load page</h1><p>${escapeHtml(error.message || "Please retry.")}</p></div></section></main>`;
  }
}

function renderMustChangePasswordGate() {
  app.innerHTML = authFrame(`
    <div class="auth-card narrow must-change-card">
      <div class="brand-row">
        <div class="brand-mark">H</div>
        <div>
          <p class="eyebrow">Security update required</p>
          <h1>Change your password before continuing.</h1>
          <p>This account must set a new password before any other part of the app becomes available.</p>
        </div>
      </div>
      <form data-action="change-password" class="stack" autocomplete="off">
        ${passwordField({ label: "Current password", name: "currentPassword", autocomplete: "current-password", testid: "current-password-input", revealable: false })}
        ${passwordField({ label: "New password", name: "newPassword", minlength: 12, autocomplete: "new-password", testid: "new-password-input" })}
        ${passwordField({ label: "Confirm new password", name: "confirmPassword", minlength: 12, autocomplete: "new-password", testid: "confirm-password-input" })}
        ${passwordPolicyHint("current account")}
        <div class="notice subtle">Use at least 12 characters with uppercase, lowercase, number, and symbol.</div>
        <button class="button primary" type="submit" data-testid="change-password-submit-button">Update password</button>
        <button class="button ghost" type="button" data-action="logout">Logout</button>
      </form>
    </div>
  `);
}

function renderAuth(page) {
  if (page === "forgot") {
    app.innerHTML = authFrame(`
      <div class="auth-card narrow">
        <div class="brand-mark">H</div>
        <h1>Forgot password</h1>
        <p>Enter your registered email address. If an account exists, we will send a secure reset link.</p>
        <form data-action="forgot-password" class="stack">
          <label>Email<input name="email" type="email" required placeholder="name@hospital.com" /></label>
          <button class="button primary" type="submit">Send reset link</button>
          <button class="button ghost" type="button" data-route="login">Back to login</button>
        </form>
      </div>
    `);
    return;
  }

  if (page === "reset" || page === "reset-password") {
    const { query } = parseHashRoute();
    const token = query.token || "";
    app.innerHTML = authFrame(`
      <div class="auth-card narrow">
        <div class="brand-mark">H</div>
        <h1>Reset password</h1>
        <p>${token ? "Create a new password for your account." : "This reset link is invalid or missing a token."}</p>
        <form data-action="reset-password" class="stack">
          <input name="token" type="hidden" value="${escapeAttribute(token)}" />
          ${passwordField({ label: "New password", name: "newPassword", minlength: 12, autocomplete: "new-password" })}
          ${passwordField({ label: "Confirm new password", name: "confirmPassword", minlength: 12, autocomplete: "new-password" })}
          ${passwordPolicyHint("current account")}
          <div class="notice subtle">Minimum 12 characters with uppercase, lowercase, number, and special character.</div>
          <button class="button primary" type="submit" ${token ? "" : "disabled"}>Reset Password</button>
          <button class="button ghost" type="button" data-route="login">Back to login</button>
        </form>
      </div>
    `);
    return;
  }

  if (page === "patient-login") {
    app.innerHTML = authFrame(`
      <div class="auth-card">
        <div class="brand-row">
          <div class="brand-mark">H</div>
          <div>
            <p class="eyebrow">Hospital Operations Command Center</p>
            <h1>Patient portal login.</h1>
            <span class="mode-pill">${environmentLabel}</span>
          </div>
        </div>
        <p class="lede">See your appointments, bills, and reports, and book a new appointment.</p>
        <form data-action="patient-login" class="login-grid" autocomplete="off">
          <label>Email<input name="loginIdentifier" type="email" required autocomplete="off" data-testid="patient-login-email" /></label>
          ${passwordField({ label: "Password", name: "password", autocomplete: "current-password", testid: "patient-login-password", revealable: false })}
          <button class="button primary" type="submit" data-testid="patient-login-submit">Sign in</button>
          <button class="button ghost" type="button" data-route="login">Staff login</button>
        </form>
      </div>
    `);
    return;
  }

  if (page === "patient-invite") {
    const { query } = parseHashRoute();
    const token = query.token || "";
    app.innerHTML = authFrame(`
      <div class="auth-card narrow">
        <div class="brand-mark">H</div>
        <h1>Set up your patient portal access</h1>
        <p>${token ? "Create a password to activate your patient portal account." : "This invite link is invalid or missing a token."}</p>
        <form data-action="patient-accept-invite" class="stack">
          <input name="token" type="hidden" value="${escapeAttribute(token)}" />
          ${passwordField({ label: "Password", name: "newPassword", minlength: 12, autocomplete: "new-password" })}
          ${passwordField({ label: "Confirm password", name: "confirmPassword", minlength: 12, autocomplete: "new-password" })}
          ${passwordPolicyHint("your patient portal account")}
          <div class="notice subtle">Minimum 12 characters with uppercase, lowercase, number, and special character.</div>
          <button class="button primary" type="submit" ${token ? "" : "disabled"}>Activate portal access</button>
          <button class="button ghost" type="button" data-route="patient-login">Back to patient login</button>
        </form>
      </div>
    `);
    return;
  }

  // Normal staff login page
  app.innerHTML = authFrame(`
    <div class="staff-login-layout">
      <section class="staff-login-hero" aria-label="Hospital Operations Command Center">
        <div class="staff-login-brand">
          <div class="staff-login-mark" aria-hidden="true">H</div>
          <p>Hospital Operations Command Center</p>
          <h1>One command<br />center for hospital<br />operations.</h1>
          <span class="staff-login-mode"><i></i>${environmentLabel}</span>
          <p class="staff-login-copy">One platform for patient flow, branches, billing, pharmacy, IPD, governance, and operations intelligence.</p>
        </div>
      </section>
      <section class="staff-login-card">
        <div class="staff-login-heading">
          <span class="staff-login-mobile-mark" aria-hidden="true">H</span>
          <h2>Welcome back</h2>
          <p>Sign in to access your hospital workspace.</p>
        </div>
        <form data-action="login" class="staff-login-form" autocomplete="off">
          <label>Username / email
            <span class="staff-login-input"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" /></svg><input name="loginIdentifier" type="text" required autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Enter your email or username" data-testid="login-email" /></span>
          </label>
          <div class="staff-password-label"><label for="staff-password">Password</label><button type="button" data-route="forgot">Forgot password?</button></div>
          <span class="staff-login-input staff-password-input"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg><input id="staff-password" name="password" type="password" required autocomplete="current-password" placeholder="Enter your password" data-testid="login-password" /><button class="password-toggle" type="button" data-action="toggle-password-visibility" aria-label="Show password"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg></button></span>
          <button class="staff-sign-in" type="submit" data-testid="login-submit">Sign in</button>
        </form>
        <p class="staff-patient-link">Are you a patient? <button type="button" data-route="patient-login">Patient login</button></p>
      </section>
    </div>
  `);
}

function renderPatientPortal(page, query = {}) {
  const patientPages = {
    dashboard: patientDashboardPage,
    "patient-appointments": patientAppointmentsPage,
    "patient-bills": patientBillsPage,
    "patient-documents": patientDocumentsPage
  };
  const activePage = patientPages[page] ? page : "dashboard";
  try {
    app.innerHTML = patientPortalShell(activePage, patientPages[activePage]());
  } catch (error) {
    if (isAuthError(error)) {
      currentUser = null;
      setPage("patient-login");
      renderAuth("patient-login");
      toast("Your session expired. Please sign in again.", "error");
      return;
    }
    app.innerHTML = patientPortalShell(activePage, `<div class="notice error">${escapeHtml(error.message || "Unable to load page.")}</div>`);
  }
}

function patientPortalShell(activePage, contentHtml) {
  const navItems = [
    ["dashboard", "Dashboard"],
    ["patient-appointments", "Appointments"],
    ["patient-bills", "Bills"],
    ["patient-documents", "Documents"]
  ];
  return `
    <div class="patient-portal-shell">
      <header class="patient-portal-header">
        <div class="brand-row"><div class="brand-mark">H</div><strong>Patient Portal</strong></div>
        <nav class="patient-portal-nav">
          ${navItems.map(([key, label]) => `<button class="button ${activePage === key ? "primary" : "ghost"}" type="button" data-route="${key}">${escapeHtml(label)}</button>`).join("")}
          <button class="button ghost" type="button" data-action="logout">Logout</button>
        </nav>
      </header>
      <main class="patient-portal-main">${contentHtml}</main>
    </div>
  `;
}

function patientDashboardPage() {
  const me = safeOptionalData(() => api.patientMe(), null);
  const records = safeOptionalData(() => api.patientRecords(), null);
  const appointments = records?.records?.appointments || [];
  const now = Date.now();
  const upcoming = appointments
    .filter((a) => new Date(a.appointmentDate || a.scheduledDate || 0).getTime() >= now)
    .sort((a, b) => new Date(a.appointmentDate || a.scheduledDate) - new Date(b.appointmentDate || b.scheduledDate))[0];
  const bills = records?.records?.bills || [];
  const pendingBills = bills.filter((b) => b.status !== "Paid").length;
  return `
    <div class="section-head"><div><h2>Welcome${me?.name ? `, ${escapeHtml(me.name)}` : ""}</h2></div></div>
    <div class="metric-grid">
      ${metricCard("MRN", me?.mrn || "—", "Your medical record number")}
      ${metricCard("Upcoming Appointment", upcoming ? formatDateTime(upcoming.appointmentDate || upcoming.scheduledDate) : "None scheduled", upcoming?.department || "Book a new appointment")}
      ${metricCard("Pending Bills", pendingBills, "Needs review")}
      ${metricCard("Documents", (records?.records?.documents || []).length, "Available to download")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Quick actions</h3></div>
      <div class="quick-grid">
        <button class="quick-action" type="button" data-route="patient-appointments"><strong>Book an appointment</strong></button>
        <button class="quick-action" type="button" data-route="patient-bills"><strong>View bills</strong></button>
        <button class="quick-action" type="button" data-route="patient-documents"><strong>View documents</strong></button>
      </div>
    </section>
  `;
}

function patientAppointmentsPage() {
  const records = safeOptionalData(() => api.patientRecords(), null);
  const appointments = (records?.records?.appointments || []).slice().sort((a, b) => new Date(b.appointmentDate || b.scheduledDate || b.createdAt) - new Date(a.appointmentDate || a.scheduledDate || a.createdAt));
  const options = safeOptionalData(() => api.appointmentOptions(), { departments: [], doctors: [] });
  return `
    <section class="panel">
      <div class="panel-head"><h3>Book an appointment</h3></div>
      <form class="form-grid" data-action="patient-book-appointment">
        <label>Department<select name="department" required data-appointment-department>${appointmentDepartmentOptions(options)}</select></label>
        <label>Doctor<select name="doctor" required data-appointment-doctor>${appointmentDoctorOptions(options)}</select></label>
        <label>Visit type<select name="visitType"><option>New</option><option>Follow-up</option></select></label>
        <label>Date<input name="date" type="date" value="${localDateInputValue()}" required /></label>
        <label>Time<input name="time" type="time" value="09:30" required /></label>
        <label class="span-2">Notes<textarea name="notes"></textarea></label>
        <button class="button primary" type="submit">Book appointment</button>
      </form>
    </section>
    <section class="panel">
      <div class="panel-head"><h3>Your appointments</h3></div>
      ${appointments.length ? table(["Date", "Department", "Doctor", "Visit Type", "Status"], appointments.map((a) => [
        formatDateTime(a.appointmentDate || a.scheduledDate || a.createdAt),
        a.department,
        a.doctor,
        a.visitType,
        badge(a.status, statusClass(a.status))
      ])) : emptyState("No appointments yet. Use the form above to book one.")}
    </section>
  `;
}

function patientBillsPage() {
  const records = safeOptionalData(() => api.patientRecords(), null);
  const bills = (records?.records?.bills || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return `
    <section class="panel">
      <div class="panel-head"><h3>Your bills</h3></div>
      ${bills.length ? table(["Bill", "Date", "Items", "Total", "Paid", "Balance", "Status"], bills.map((bill) => [
        bill.billNumber,
        formatDateTime(bill.createdAt),
        bill.items,
        currencyDisplay(firstDefined(bill.totalAmount, bill.total, bill.amount)),
        currencyDisplay(firstDefined(bill.paidAmount, bill.paid, bill.amountPaid)),
        currencyDisplay(firstDefined(bill.balance, bill.outstandingAmount, 0)),
        badge(bill.status, statusClass(bill.status))
      ])) : emptyState("No bills on file yet.")}
    </section>
  `;
}

function patientDocumentsPage() {
  const records = safeOptionalData(() => api.patientRecords(), null);
  const documents = (records?.records?.documents || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return `
    <section class="panel">
      <div class="panel-head"><h3>Your documents</h3></div>
      ${documents.length ? table(["File", "Type", "Date", "Action"], documents.map((doc) => [
        doc.originalFilename || doc.fileName,
        doc.documentType,
        formatDateTime(doc.createdAt),
        `<button class="button tiny soft" type="button" data-action="patient-download-document" data-document-id="${doc.id}">Download</button>`
      ])) : emptyState("No documents available yet.")}
    </section>
  `;
}

function renderPublicBooking(query = {}) {
  const branchId = query.branch || query.branchId || "";
  app.innerHTML = authFrame(publicBookingPage(branchId));
}

function publicBookingPage(branchId) {
  if (!branchId) {
    return `
      <div class="auth-card narrow">
        <div class="brand-mark">H</div>
        <h1>Book an appointment</h1>
        <p>This booking link is missing a location. Please use the link or QR code provided by the hospital.</p>
      </div>
    `;
  }
  const options = safeOptionalData(() => api.publicBookingOptions(branchId), { departments: [], doctors: [] });
  return `
    <div class="auth-card">
      <div class="brand-row">
        <div class="brand-mark">H</div>
        <div>
          <p class="eyebrow">${escapeHtml(options.branchName || "Hospital Operations Command Center")}</p>
          <h1>Book an appointment</h1>
        </div>
      </div>
      <p class="lede">Fill in your details and our team will confirm your appointment.</p>
      <form class="form-grid" data-action="public-book-appointment" data-branch-id="${escapeAttribute(branchId)}">
        <label>Name<input name="name" required autocomplete="name" /></label>
        <label>Mobile<input name="mobile" type="tel" required autocomplete="tel" /></label>
        <label>Age<input name="age" type="number" min="0" /></label>
        <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
        <label>Department<select name="department" required data-appointment-department>${appointmentDepartmentOptions(options)}</select></label>
        <label>Doctor<select name="doctor" required data-appointment-doctor>${appointmentDoctorOptions(options)}</select></label>
        <label>Preferred date<input name="date" type="date" value="${localDateInputValue()}" required /></label>
        <label>Preferred time<input name="time" type="time" value="09:30" required /></label>
        <label class="span-2">Notes<textarea name="notes"></textarea></label>
        <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true" />
        <button class="button primary" type="submit">Request appointment</button>
      </form>
    </div>
  `;
}

function publicBookingConfirmation(appointmentNumber) {
  return `
    <div class="auth-card narrow">
      <div class="brand-mark">H</div>
      <h1>Appointment requested</h1>
      <p>Your appointment request${appointmentNumber ? ` (${escapeHtml(appointmentNumber)})` : ""} has been received. Our team will contact you to confirm the date and time.</p>
    </div>
  `;
}

function authFrame(content) {
  return `
    <main class="auth-shell">
      <section class="auth-hero">
        ${content}
      </section>
    </main>
  `;
}

function renderShell(page, options = {}) {
  const isHospitalAdmin = currentUser.role === ROLES.HOSPITAL_ADMIN;
  const isNurse = currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "nurse";
  const isReception = currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user";
  const doctorRole = String(currentUser.jobRole || "").toLowerCase();
  const isDoctor = currentUser.role === ROLES.BRANCH_USER && ["doctor", "surgeon"].includes(doctorRole);
  const isPharmacy = currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(doctorRole);
  const isBilling = currentUser.role === ROLES.BRANCH_USER && /billing|finance/.test(doctorRole);
  const isLab = currentUser.role === ROLES.BRANCH_USER && /lab/.test(doctorRole);
  const isRadiology=currentUser.role===ROLES.BRANCH_USER&&/radiology/.test(doctorRole);
  const isMortuary=currentUser.role===ROLES.BRANCH_USER&&/mortuary/.test(doctorRole);
  const isSurgeon = doctorRole === "surgeon";
  const isBranchAdmin = currentUser.role === ROLES.BRANCH_ADMIN;
  const roleNav = isHospitalAdmin ? HOSPITAL_ADMIN_NAV : isBranchAdmin ? BRANCH_ADMIN_NAV : isNurse ? NURSE_NAV : isReception ? RECEPTION_NAV : isDoctor ? DOCTOR_NAV : isPharmacy ? PHARMACY_NAV : isBilling ? BILLING_NAV : isLab ? LAB_NAV : isRadiology ? RADIOLOGY_NAV : isMortuary ? MORTUARY_NAV : (NAV_BY_ROLE[currentUser.role] || []).map(([key, label]) => [key, label, null]);
  const nav = roleNav.filter(([key, _label, group]) => canAccessPage(currentUser, key) && (group !== "Surgery" || isSurgeon));
  const premiumRoleShell = isHospitalAdmin || isBranchAdmin || isNurse || isReception || isDoctor || isPharmacy || isBilling || isLab || isRadiology || isMortuary;
  const branchOptions = hasPermission(currentUser, "branches", "view") ? safeData(() => api.branches(currentUser)) : [];
  const hospitalOptions = hasPermission(currentUser, "hospitals", "view") ? safeData(() => api.hospitals(currentUser)) : [];
  const notificationItems = hasPermission(currentUser, "notifications", "view") ? mergeNotifications() : [];
  const unreadNotificationCount = notificationItems.filter((item) => !item.read).length;
  const branch = branchOptions.find((item) => item.id === currentUser.branchId);
  const hospital = hospitalOptions.find((item) => item.id === currentUser.hospitalId);
  const branchType = branch?.branchType || currentUser.branchType || (branch ? "Main Branch" : "");
  const branchContext = branch ? `${branchType}: ${branch.name}` : "";

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar ${isHospitalAdmin ? "hospital-admin-sidebar" : isBranchAdmin ? "branch-admin-sidebar" : isNurse ? "nurse-sidebar" : isReception ? "reception-sidebar" : isDoctor ? "doctor-sidebar" : isPharmacy ? "pharmacy-sidebar" : isBilling ? "billing-sidebar" : isLab ? "lab-sidebar" : isRadiology ? "radiology-sidebar" : isMortuary ? "mortuary-sidebar" : ""}">
        <div class="logo-block">
          <div class="brand-mark">H</div>
          <div>
            <strong>${premiumRoleShell ? "Hospital Operations" : "HOCC"}</strong>
            ${premiumRoleShell ? "" : "<span>Command Center</span>"}
          </div>
        </div>
        <nav class="nav-list">
          ${nav.map(([key, label, roleGroup], index) => `
            ${(premiumRoleShell ? roleGroup !== nav[index - 1]?.[2] ? roleGroup : "" : navGroupLabel(key, nav[index - 1]?.[0])) ? `<span class="nav-group">${escapeHtml(premiumRoleShell ? roleGroup : navGroupLabel(key, nav[index - 1]?.[0]))}</span>` : ""}
            <button class="nav-item ${page === key ? "active" : ""}" type="button" data-route="${key}" title="${escapeHtml(label)}" data-testid="sidebar-${escapeHtml(key)}">
              <span class="nav-icon">${navIcon(key)}</span><span>${escapeHtml(label)}</span>
            </button>
          `).join("")}
        </nav>
        <div class="scope-card">
          ${premiumRoleShell ? `${isHospitalAdmin && (hospital?.logoDataUrl || hospital?.logoUrl || hospital?.logo) ? `<span class="nurse-avatar hospital-profile-avatar"><img src="${escapeAttribute(hospital.logoDataUrl || hospital.logoUrl || hospital.logo)}" alt="${escapeAttribute(hospital.name || "Hospital")} logo" /></span>` : `<span class="nurse-avatar" aria-hidden="true">${isHospitalAdmin ? "HA" : isBranchAdmin ? "BA" : isNurse ? "N" : isReception ? "R" : isDoctor ? "Dr" : isPharmacy ? "Rx" : isBilling ? "B" : isLab ? "L" : isRadiology ? "R" : "M"}</span>`}<div class="nurse-scope-copy">` : ""}
          <span>${escapeHtml(isHospitalAdmin ? "Hospital Admin" : isBranchAdmin ? "Branch Admin" : isDoctor ? currentUser.jobRole : isPharmacy ? "Pharmacist" : isBilling ? "Billing / Finance" : isLab ? "Laboratory" : isRadiology ? "Radiology" : isMortuary ? "Mortuary" : roleLabels[currentUser.role])}</span>
          <strong>${escapeHtml(isHospitalAdmin ? hospital?.name ? `${hospital.name} Admin` : currentUser.name || "Hospital Admin" : isBranchAdmin ? currentUser.name || "Branch Admin" : isNurse ? "Nurse" : isReception ? currentUser.name || "Receptionist" : isDoctor ? currentUser.name || "Doctor" : isPharmacy ? currentUser.name || "Pharmacy User" : isBilling ? currentUser.name || "Billing User" : isLab ? currentUser.name || "Lab User" : isRadiology ? currentUser.name || "Radiology User" : isMortuary ? currentUser.name || "Mortuary Officer" : scopeDescription(currentUser))}</strong>
          <small>${escapeHtml(isHospitalAdmin ? hospital?.name || "All Branches" : isBranchAdmin ? "Assigned branch access" : isNurse ? "Assigned ward / unit access" : isReception ? "Front Desk" : isDoctor ? currentUser.department || "Clinical Department" : isPharmacy ? currentUser.pharmacyName || "Pharmacist" : isBilling ? "Billing / Finance" : isLab ? "Laboratory" : isRadiology ? "Radiology" : isMortuary ? "Mortuary" : hospital?.name || "All hospitals")}${!premiumRoleShell && branchContext ? ` / ${escapeHtml(branchContext)}` : ""}</small>
          ${premiumRoleShell ? `<small>${escapeHtml(isHospitalAdmin ? "Administrator · All Branch Access" : isBranchAdmin ? "Main Branch" : isNurse ? "Assigned branch only" : currentUser.branchName || "Assigned Branch")}</small></div>` : ""}
        </div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <p class="eyebrow">${escapeHtml(isHospitalAdmin ? "HOSPITAL ADMIN" : isBranchAdmin ? "BRANCH ADMIN" : isDoctor ? currentUser.jobRole.toUpperCase() : isPharmacy ? "PHARMACY" : isBilling ? "BILLING" : isLab ? "LAB" : isRadiology ? "RADIOLOGY" : isMortuary ? "MORTUARY" : roleLabels[currentUser.role])}</p>
            <h1 data-testid="page-title">${escapeHtml(options.forceUnauthorized ? "Access blocked" : currentPageTitle(page))}</h1>
            <div class="context-row">
              <span>${escapeHtml(isDoctor && page === "notifications" ? "Main Branch" : isBranchAdmin || isPharmacy || isBilling || isLab || isRadiology || isMortuary ? currentUser.branchName || branch?.name || "Main Branch" : hospital?.name || (isHospitalAdmin ? "All Branches" : "All hospitals"))}</span>
              ${branch ? `<span>${escapeHtml(branchType)}</span><span>${escapeHtml(branch.name)}</span>` : ""}
              <span>${environmentLabel}</span>
            </div>
          </div>
          <div class="top-actions">
            <div class="top-search-wrap">
              <input class="top-search" placeholder="${isHospitalAdmin ? "Search patient, branch, staff, bill, appointment" : "Search MRN, patient, bill, admission"}" value="${escapeHtml(globalSearchQuery)}" data-global-search aria-label="Global search" />
              ${topSearchAutocomplete()}
            </div>
            ${hasPermission(currentUser, "notifications", "view") ? `<button class="button soft icon-action ${unreadNotificationCount ? "has-unread" : ""}" title="Notifications: ${escapeHtml(String(unreadNotificationCount))} unread" aria-label="Notifications: ${escapeHtml(String(unreadNotificationCount))} unread" type="button" data-action="toggle-notifications" aria-expanded="${notificationsDrawerOpen ? "true" : "false"}">${iconLabel("!", `Notifications ${unreadNotificationCount}`)}</button>` : ""}
            <button class="button soft user-chip" type="button" data-route="profile"><span>${escapeHtml(userInitials(currentUser.name || currentUser.email))}</span><strong>${escapeHtml(currentUser.name)}</strong></button>
            <button class="button ghost" type="button" data-action="logout" data-testid="logout-button">Logout</button>
          </div>
        </header>
        ${isHospitalAdmin||isPharmacy||isBilling||isLab||isRadiology||isMortuary?"":careCommandStrip(notificationItems,page,hospital,branch)}
        <section class="content">
          ${options.forceUnauthorized ? unauthorizedPage(page) : options.loading ? pageSkeleton(page) : renderPage(page)}
        </section>
      </main>
      ${notificationsDrawerOpen && hasPermission(currentUser, "notifications", "view") ? renderNotificationsDrawer(notificationItems) : ""}
      ${createModal()}
      ${editModal()}
      ${deleteModal()}
    </div>
  `;
  if (!options.loading && !options.forceUnauthorized) renderedPageKey = routeKey(page, options.query || parseHashRoute().query);
  wireCreateButtons();
  enhanceEmptyStateActions(page);
  const appointmentForm = app.querySelector?.('form[data-action="create-appointment"]');
  if (appointmentForm) {
    fillAppointmentFromPatient(appointmentForm);
    filterAppointmentDoctors(appointmentForm);
  }
  normalizeBranchAdminCreateUserForm();
  enhanceDraftAreas();
  enhancePasswordHints();
  animateCountUps();
}

function normalizeBranchAdminCreateUserForm() {
  if (currentUser?.role !== ROLES.BRANCH_ADMIN) return;
  const form = app.querySelector?.('form[data-action="create-user"]');
  if (!form) return;
  const branchField = form.querySelector('[name="branchId"]');
  const assignedBranchId = currentUser.branchId || "";
  const assignedBranchName = currentUser.branchName || assignedBranchId || "Assigned branch";
  const assignedBranchType = currentUser.branchType || "Assigned branch";
  const branchHtml = `
    <label>Branch (${escapeHtml(assignedBranchType)})<input value="${escapeHtml(`${assignedBranchName}${assignedBranchId ? ` / ID: ${assignedBranchId}` : ""}`)}" readonly data-testid="user-form-branch-display" /></label>
    <input type="hidden" name="branchId" value="${escapeHtml(assignedBranchId)}" data-testid="user-form-branch" />
  `;
  if (branchField && branchField.tagName === "SELECT") {
    const wrapper = branchField.closest("label");
    if (wrapper) wrapper.outerHTML = branchHtml;
    else branchField.outerHTML = branchHtml;
  } else if (branchField) {
    branchField.value = assignedBranchId;
  }
  const accessField = form.querySelector('[name="accessExpiresAt"]');
  if (accessField) accessField.closest("label")?.remove();
  const assignmentText = [...form.querySelectorAll("p")]
    .find((node) => node.textContent.includes("Branch Admin can assign users only inside"));
  if (assignmentText) assignmentText.textContent = "This is filled from the logged-in Branch Admin and cannot be changed.";
}

function userInitials(value = "") {
  const parts = String(value || "User").trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || "U").toUpperCase();
}

function careCommandStrip(notificationItems = [], page = "dashboard", hospital = null, branch = null) {
  const countBy = (matcher) => notificationItems.filter((item) => matcher(`${item.category || ""} ${item.module || ""} ${item.title || ""} ${item.priority || ""}`.toLowerCase())).length;
  const critical = notificationItems.filter((item) => ["critical", "high"].includes(String(item.priority || "").toLowerCase()) && !item.read).length;
  const shortcuts = [
    ["Queue", "queue", countBy((text) => text.includes("queue"))],
    ["Reports", canAccessPage(currentUser, "lab") ? "lab" : "radiology", countBy((text) => text.includes("lab") || text.includes("radiology") || text.includes("report"))],
    ["MAR", "mar", countBy((text) => text.includes("mar") || text.includes("medication"))],
    ["Billing", "billing", countBy((text) => text.includes("billing") || text.includes("payment"))],
    ["Discharge", "discharge", countBy((text) => text.includes("discharge"))]
  ].filter(([, route]) => canAccessPage(currentUser, route));
  return `
    <section class="care-command-strip" aria-label="Hospital command strip">
      <div class="care-status">
        <strong>${escapeHtml(critical ? `${critical} urgent` : "No urgent alerts")}</strong>
        <span>${escapeHtml(branch?.name || hospital?.name || scopeDescription(currentUser))}</span>
        <small>${escapeHtml(roleLabels[currentUser.role])} / ${escapeHtml(currentUser.jobRole || "Operations")}</small>
      </div>
      <div class="care-shortcuts">
        ${shortcuts.map(([label, route, count]) => `
          <button class="${page === route ? "active" : ""}" type="button" data-route="${escapeHtml(route)}">
            <strong>${escapeHtml(String(count))}</strong>
            <span>${escapeHtml(label)}</span>
          </button>
        `).join("") || `<span class="care-note">Your visible work areas are ready.</span>`}
      </div>
      <div class="care-note">Use the strip to jump to delayed work before continuing routine entry.</div>
    </section>
  `;
}

function doctorDashboardPage() {
  const data = deriveOperationalData();
  const doctorName = String(currentUser.name || "").toLowerCase();
  const assigned = (item) => !item.doctor && !item.admittingDoctor && !item.consultant || [item.doctor, item.admittingDoctor, item.consultant].some((value) => String(value || "").toLowerCase().includes(doctorName.replace(/^dr\.?\s*/, "")));
  const ready = data.queue.filter((item) => ["Ready for Doctor", "READY_FOR_DOCTOR"].includes(item.status) && assigned(item));
  const activeIpd = data.admissions.filter((item) => ["Admitted", "Under Treatment"].includes(item.admissionStatus || item.status) && assigned(item));
  const resultsReady = data.labOrders.filter((item) => ["Report Ready", "Completed"].includes(item.status) && assigned(item)).length;
  const followupsToday = (data.followUps || []).filter((item) => isToday(item.date || item.createdAt) && assigned(item)).length;
  const critical = (data.alerts || []).filter((item) => ["Critical", "High"].includes(item.severity || item.priority) && !["Closed", "Resolved"].includes(item.status)).length;
  return `<section class="panel"><div class="panel-head"><div><h3>Doctor Workspace</h3><p>Clinical work assigned to ${escapeHtml(currentUser.name || "Doctor")}.</p></div>${badge(currentUser.branchName || "Main Branch", "status-active")}</div></section><div class="metric-grid small">${metricCard("Waiting for Me", ready.length, "OPD queue")}${metricCard("Ready for Consultation", ready.length, "Ready for Doctor")}${metricCard("My IPD Patients", activeIpd.length, "Active admissions")}${metricCard("Results Ready", resultsReady, "Lab results")}${metricCard("Follow-ups Today", followupsToday, "Scheduled")}${metricCard("Critical Alerts", critical, "Needs review")}</div>${quickActionsPanel([["Open Queue", "queue"], ["Start Consultation", "consultation"], ["My IPD Patients", "ipd"], ["View Results", "lab"]])}`;
}

function pharmacyTabs(route, tabs) {
  const active = parseHashRoute().query.tab || tabs[0][0];
  return `<div class="pharmacy-tabs" role="navigation" aria-label="Page filters">${tabs.map(([key, label]) => `<button class="pharmacy-tab ${active === key ? "active" : ""}" type="button" data-route="${escapeHtml(route)}" data-tab="${escapeHtml(key)}">${escapeHtml(label)}</button>`).join("")}</div>`;
}

function pharmacyDashboardPage() {
  const issues = safeOptionalData(() => api.pharmacyIssues(currentUser), []);
  const stocks = safeOptionalData(() => api.medicineStocks(currentUser), []);
  const tasks = safeOptionalData(() => api.tasks(currentUser), []).filter((item) => /pharmacy|medicine|stock/i.test(`${item.assignedTo || ""} ${item.module || ""} ${item.title || ""}`) && item.status !== "Completed");
  const alerts = safeOptionalData(() => api.alerts(currentUser), []).filter((item) => /pharmacy|medicine|stock|expiry/i.test(`${item.category || ""} ${item.department || ""} ${item.title || ""}`) && !["Closed", "Resolved"].includes(item.status));
  const low = stocks.filter((item) => Number(item.quantityAvailable || 0) <= Number(item.reorderLevel || 0));
  const expiring = stocks.filter((item) => { const expiry = new Date(item.expiryDate || item.expiry || 0); const days = (expiry - new Date()) / 86400000; return days >= 0 && days <= 90; });
  const issuedToday = issues.filter((item) => item.status === "Issued" && isToday(item.issuedAt || item.updatedAt || item.createdAt)).length;
  return `<section class="panel pharmacy-page-heading"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Today's Pharmacy Work</h3><p>Prescription, inventory and assigned-work overview for ${escapeHtml(currentUser.branchName || "Main Branch")}.</p></div>${badge(currentUser.branchName || "Main Branch", "status-active")}</div></section><div class="metric-grid small">${metricCard("New Prescriptions", issues.filter((item) => ["New", "Pending"].includes(item.status)).length, "Received")}${metricCard("Waiting for Dispensing", issues.filter((item) => !["Issued", "Ready"].includes(item.status)).length, "Pending")}${metricCard("Ready for Pickup", issues.filter((item) => item.status === "Ready").length, "Prepared")}${metricCard("Dispensed Today", issuedToday, "Completed")}${metricCard("Low Stock", low.length, "Needs attention")}${metricCard("Expiring Medicines", expiring.length, "Within 90 days")}${metricCard("Pending Tasks", tasks.length, "Assigned")}${metricCard("Alerts", alerts.length, "Open")}</div>${quickActionsPanel([["Prescriptions", "pharmacy"], ["Dispensing", "pharmacy-dispensing"], ["Prescription Search", "pharmacy-search"], ["Stock", "stock"]])}`;
}

function pharmacyPrescriptionsPage() {
  return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Prescriptions</h3><p>Prescription workspace shell. Receiving and dispensing actions are reserved for the next milestone.</p></div></div>${pharmacyTabs("pharmacy", [["new", "New"], ["pending", "Pending"], ["preparing", "Preparing"], ["ready", "Ready to Dispense"], ["dispensed", "Dispensed"], ["history", "History"]])}${emptyState("No prescription records are available for this filter.")}</section>`;
}

function pharmacyDispensingPage() {
  return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Dispensing</h3><p>Future medicine preparation and dispensing workspace.</p></div></div>${pharmacyTabs("pharmacy-dispensing", [["due", "Due"], ["partial", "Partially Dispensed"], ["full", "Fully Dispensed"], ["unavailable", "Unavailable"], ["returned", "Cancelled / Returned"]])}${emptyState("No dispensing records are available. Dispensing actions are not enabled in this milestone.")}</section>`;
}

function pharmacySearchPage() {
  return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Prescription Search</h3><p>Search without patient registration, editing or deletion access.</p></div></div><div class="pharmacy-search-box"><input type="search" placeholder="Search patient, MRN or prescription ID" aria-label="Search patient, MRN or prescription ID"/><button class="button primary" type="button">Search</button></div>${table(["Patient", "MRN", "Prescription ID", "Doctor", "Date", "Status", "Action"], [])}</section>`;
}

function pharmacyReturnsPage() {
  return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Inventory</p><h3>Returns</h3><p>Return-processing shell; no stock mutation is enabled.</p></div></div>${pharmacyTabs("returns", [["patient", "Patient Returns"], ["ward", "Ward Returns"], ["damaged", "Damaged Stock"], ["expired", "Expired Stock"], ["history", "Return History"]])}${emptyState("No return records are available.")}</section>`;
}

function pharmacyReportsPage() {
  return `<section class="panel pharmacy-workspace"><div class="panel-head"><div><p class="eyebrow">Pharmacy</p><h3>Reports</h3><p>Pharmacy report categories.</p></div></div>${pharmacyTabs("reports", [["daily", "Daily Dispensing"], ["usage", "Medicine Usage"], ["stock", "Stock"], ["low", "Low Stock"], ["expiry", "Expiry"], ["returns", "Returns"], ["history", "Dispensing History"]])}${emptyState("No report data is available for this category.")}</section>`;
}

function roleShellPage(kicker, title, description, route, tabs, searchPlaceholder = "") {
  return `<section class="panel role-shell-workspace"><div class="panel-head"><div><p class="eyebrow">${escapeHtml(kicker)}</p><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></div></div>${pharmacyTabs(route, tabs)}${searchPlaceholder ? `<div class="pharmacy-search-box"><input type="search" placeholder="${escapeHtml(searchPlaceholder)}"/><button class="button primary" type="button">Search</button></div>` : ""}${emptyState(`No ${title.toLowerCase()} records are available for this filter.`)}</section>`;
}

function enhanceEmptyStateActions(page) {
  if (!currentUser) return;
  const configs = {
    hospitals: ["create-hospital", currentUser.role === ROLES.HOSPITAL_ADMIN ? "Create Hospital Profile" : "Add Hospital", currentUser.role === ROLES.HOSPITAL_ADMIN ? "No hospital profile has been created yet." : "No hospital customers have been created yet.", "hospitals", "create"],
    branches: ["create-branch", "Add Branch", "No branches have been created yet.", "branches", "create"],
    users: ["create-user", currentUser.role === ROLES.HOSPITAL_ADMIN ? "Add Branch Admin" : "Add User", currentUser.role === ROLES.HOSPITAL_ADMIN ? "No branch administrators have been created yet." : "No users have been created yet.", "users", "manageUsers"],
    masterData: ["create-master-data", "Add Department", "No departments have been created yet.", "masterData", "create"],
    staffRoster: ["create-staff", "Add Staff", "No staff accounts have been created yet.", "staffRoster", "create"],
    appointments: ["create-appointment", "Book Appointment", "No appointments found.", "appointments", "create"],
    patients: ["register-patient", "Enroll Patient", "No patients have been registered yet.", "patients", "create"],
    admissions: ["create-admission", "New Admission", "No admissions found.", "admissions", "create"],
    billing: ["generate-bill", "Create Invoice", "No invoices found.", "billing", "create"],
    finance: ["create-master-data", "Add Service", "No services or pricing records have been created yet.", "masterData", "create"],
    stock: ["add-stock", "Add Medicine / Stock Item", "No medicine stock items have been created yet.", "stock", "create"],
    inventory: ["create-master-data", "Add Inventory Item", "No inventory items have been created yet.", "masterData", "create"],
    purchase: ["create-purchase-request", "Create Purchase Request", "No purchase requests found.", "purchase", "create"],
    subscriptions: ["create-subscription", "Add Plan", "No subscription plans found.", "subscriptions", "create"],
    offers: ["create-offer", "Add Offer", "No offers have been created yet.", "offers", "create"],
    permissionTemplates: ["create-permission-template", "Add Role Template", "No permission templates have been created yet.", "permissionTemplates", "create"],
    tasks: ["create-task", "Add Task", "No tasks have been created yet.", "tasks", "create"],
    ot: ["schedule-surgery", "Add Surgery", "No surgeries have been scheduled.", "ot", "create"],
    radiology: ["order-radiology", "Add Imaging", "No imaging orders found.", "radiology", "create"],
    mortuary: ["register-death", "Add Mortuary Record", "No mortuary records found.", "mortuary", "create"]
  };
  let config = configs[page];
  app.querySelectorAll?.(".content .empty").forEach((empty) => {
    if (empty.querySelector("button, a") || empty.classList.contains("error-state")) return;
    if (page === "wards") {
      const heading = empty.closest(".panel")?.querySelector("h3")?.textContent || "";
      config = /bed/i.test(heading) ? ["create-bed", "Add Bed", "No beds have been configured yet.", "beds", "create"] : ["create-ward", "Add Ward", "No wards have been configured yet.", "wards", "create"];
    }
    if (!config) return;
    const [formAction, actionLabel, title, module, permission] = config;
    if (!hasPermission(currentUser, module, permission) || !createForm(formAction)) return;
    const strong = empty.querySelector("strong");
    if (strong && /no records found|visible for your access scope|use add|no .* (yet|found)/i.test(strong.textContent || "")) strong.textContent = title;
    const button = document.createElement("button");
    button.className = "button primary small empty-state-action";
    button.type = "button";
    button.dataset.action = "open-create";
    button.dataset.formAction = formAction;
    button.textContent = `+ ${actionLabel}`;
    empty.append(button);
  });
}

function nurseDashboardPage() {
  const rows = buildNursePatientRows({
    currentUser,
    patients: safeOptionalData(() => api.patients(currentUser), []),
    admissions: safeOptionalData(() => api.admissions(currentUser), []),
    vitals: safeOptionalData(() => api.ipdVitals(currentUser), []),
    mar: safeOptionalData(() => api.medicationAdministrationRecords(currentUser), []),
    tasks: safeOptionalData(() => api.tasks(currentUser), []),
    alerts: safeOptionalData(() => api.alerts(currentUser), []),
    nursingNotes: safeOptionalData(() => api.nursingNotes(currentUser), []),
    intakeOutput: safeOptionalData(() => api.intakeOutputCharts(currentUser), [])
  });
  const tasks = safeOptionalData(() => api.tasks(currentUser), []).filter((item) => String(item.status || "").toLowerCase() !== "completed");
  const alerts = safeOptionalData(() => api.alerts(currentUser), []).filter((item) => !["resolved", "closed", "completed"].includes(String(item.status || "").toLowerCase()));
  const medicationRows = rows.filter((row) => row.medicationsDueCount > 0);
  const vitalsRows = rows.filter((row) => row.vitalsDue);
  const criticalRows = rows.filter((row) => row.status === "Critical" || row.criticalAlertsCount > 0);
  const cards = [
    ["Assigned Patients", rows.length, "patients"],
    ["Pending Vitals", vitalsRows.length, "ipdVitals"],
    ["Medications Due", medicationRows.reduce((sum, row) => sum + row.medicationsDueCount, 0), "mar"],
    ["Pending Nursing Tasks", tasks.length, "tasks"],
    ["Critical Patients", criticalRows.length, "alerts"]
  ];
  const compactList = (items, emptyMessage, renderer) => items.length
    ? `<div class="nurse-dashboard-list">${items.slice(0, 5).map(renderer).join("")}</div>`
    : `<p class="nurse-dashboard-empty">${escapeHtml(emptyMessage)}</p>`;
  return `<div class="nurse-dashboard-only">
    <div class="section-head nurse-dashboard-heading"><div><h2>Nurse Dashboard</h2><p>Assigned patient care for the current ward and shift.</p></div></div>
    <div class="metric-grid nurse-dashboard-kpis">${cards.map(([label, value, route]) => `<button class="metric-card metric-link" type="button" data-route="${route}"><span class="nurse-kpi-icon">${navIcon(route)}</span><span>${escapeHtml(label)}</span><strong>${value}</strong><small>View records</small></button>`).join("")}</div>
    <section class="nurse-dashboard-actions" aria-labelledby="nurse-quick-actions-title"><h3 id="nurse-quick-actions-title">Quick Actions</h3><div class="nurse-dashboard-action-grid">
      <button class="reception-action" type="button" data-route="ipdVitals"><span>${actionIcon("record")}</span><strong>Record Vitals</strong></button>
      <button class="reception-action" type="button" data-route="mar"><span>${actionIcon("medicine")}</span><strong>Give Medication</strong></button>
      <button class="reception-action" type="button" data-route="nursing"><span>${actionIcon("add")}</span><strong>Add Nursing Note</strong></button>
      <button class="reception-action" type="button" data-route="patients"><span>${actionIcon("update")}</span><strong>Update Patient Status</strong></button>
    </div></section>
    <div class="nurse-dashboard-sections">
      <section class="nurse-dashboard-section"><div class="nurse-dashboard-section-head"><h3>My Patients</h3><button data-route="patients">View all</button></div>${compactList(rows, "No patients currently assigned.", (row) => `<button class="nurse-dashboard-row" data-route="patients" data-patient-id="${escapeHtml(row.patientId)}"><span><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(`${row.ward} · Bed ${row.bed}`)}</small></span><b>${escapeHtml(row.status)}</b></button>`)}</section>
      <section class="nurse-dashboard-section"><div class="nurse-dashboard-section-head"><h3>Medication Due</h3><button data-route="mar">View all</button></div>${compactList(medicationRows, "No medications currently due.", (row) => `<button class="nurse-dashboard-row" data-route="mar" data-patient-id="${escapeHtml(row.patientId)}"><span><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.nextMedication?.medicine || row.nextMedication?.medication || "Scheduled medication")}</small></span><b>${row.medicationsDueCount} due</b></button>`)}</section>
      <section class="nurse-dashboard-section"><div class="nurse-dashboard-section-head"><h3>Vitals Due</h3><button data-route="ipdVitals">View all</button></div>${compactList(vitalsRows, "No patient vitals currently due.", (row) => `<button class="nurse-dashboard-row" data-route="ipdVitals" data-patient-id="${escapeHtml(row.patientId)}"><span><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(`${row.ward} · Bed ${row.bed}`)}</small></span><b>Due</b></button>`)}</section>
      <section class="nurse-dashboard-section"><div class="nurse-dashboard-section-head"><h3>Nursing Tasks</h3><button data-route="tasks">View all</button></div>${compactList(tasks, "No pending nursing tasks.", (item) => `<button class="nurse-dashboard-row" data-route="tasks"><span><strong>${escapeHtml(item.title || item.task || "Nursing task")}</strong><small>${escapeHtml(item.due || item.dueDate || "Pending")}</small></span><b>${escapeHtml(item.priority || "Open")}</b></button>`)}</section>
      <section class="nurse-dashboard-section"><div class="nurse-dashboard-section-head"><h3>Alerts</h3><button data-route="alerts">View all</button></div>${compactList(alerts, "No active nursing alerts.", (item) => `<button class="nurse-dashboard-row" data-route="alerts"><span><strong>${escapeHtml(item.title || item.message || "Patient alert")}</strong><small>${escapeHtml(item.patientName || item.module || "Nursing")}</small></span><b>${escapeHtml(item.severity || item.priority || "Open")}</b></button>`)}</section>
    </div>
  </div>`;
}

function hospitalAdminScope(rows = []) {
  return hospitalAdminBranchId === "all" ? rows : rows.filter((item) => String(item.branchId || "") === String(hospitalAdminBranchId));
}

function hospitalAdminOperationalAlerts(alerts = [], stocks = [], beds = [], bills = [], claims = []) {
  const items = [];
  const totalBeds = beds.length;
  const availableBeds = beds.filter((bed) => String(bed.status || "Available") === "Available").length;
  if (totalBeds && availableBeds / totalBeds < .15) items.push({ title: "Low bed availability", detail: `${availableBeds} of ${totalBeds} beds available`, route: "wards" });
  const lowStock = stocks.filter((item) => Number(item.quantityAvailable || item.quantity || 0) <= Number(item.reorderLevel || 0));
  if (lowStock.length) items.push({ title: "Low pharmacy stock", detail: `${lowStock.length} items require replenishment`, route: "stock" });
  const pendingBills = bills.filter((bill) => !["Paid", "Refunded"].includes(bill.status));
  if (pendingBills.length) items.push({ title: "Pending invoices", detail: `${pendingBills.length} invoices have outstanding balances`, route: "billing" });
  const pendingClaims = claims.filter((claim) => !["Approved", "Rejected", "Paid"].includes(claim.status));
  if (pendingClaims.length) items.push({ title: "Insurance claims pending", detail: `${pendingClaims.length} claims need review`, route: "billing" });
  alerts.filter((item) => !item.patientId && !/clinical|vital|diagnos|treatment|medication/i.test(`${item.module || ""} ${item.title || ""}`)).slice(0, 5).forEach((item) => items.push({ title: item.title || "Operational alert", detail: item.message || item.department || "Needs administrative review", route: "notifications" }));
  return items;
}

function hospitalAdminDashboardPage() {
  const hospital = safeOptionalData(() => api.hospitals(currentUser), [])[0] || null;
  const branches = safeOptionalData(() => api.branches(currentUser), []);
  const patients = safeOptionalData(() => api.patients(currentUser), []);
  const appointments = safeOptionalData(() => api.appointments(currentUser), []);
  const admissions = safeOptionalData(() => api.admissions(currentUser), []);
  const beds = safeOptionalData(() => api.beds(currentUser), []);
  const bills = safeOptionalData(() => api.bills(currentUser), []);
  const payments = safeOptionalData(() => api.payments(currentUser), []);
  const users = safeOptionalData(() => api.accessReviewUsers(currentUser), []);
  const alerts = safeOptionalData(() => api.alerts(currentUser), []);
  const stocks = safeOptionalData(() => api.medicineStocks(currentUser), []);
  const claims = safeOptionalData(() => api.claims(currentUser), []);
  const scopedPatients = hospitalAdminScope(patients), scopedAppointments = hospitalAdminScope(appointments), scopedAdmissions = hospitalAdminScope(admissions), scopedBeds = hospitalAdminScope(beds), scopedBills = hospitalAdminScope(bills), scopedPayments = hospitalAdminScope(payments), scopedUsers = hospitalAdminScope(users), scopedStocks = hospitalAdminScope(stocks), scopedClaims = hospitalAdminScope(claims);
  const todayAppointments = scopedAppointments.filter((item) => isToday(item.date || item.appointmentDate || item.createdAt));
  const currentAdmissions = scopedAdmissions.filter((item) => !["Discharged", "Cancelled"].includes(item.admissionStatus || item.status));
  const occupied = scopedBeds.filter((item) => item.status === "Occupied").length;
  const todayRevenue = scopedPayments.filter((item) => isToday(item.createdAt || item.paidAt)).reduce((sum, item) => sum + Number(item.amount || item.paidAmount || 0), 0);
  const pendingBills = scopedBills.filter((item) => !["Paid", "Refunded"].includes(item.status));
  const activeStaff = scopedUsers.filter((item) => !["Inactive", "Disabled", "Suspended"].includes(item.status));
  const operationalAlerts = hospitalAdminOperationalAlerts(alerts, scopedStocks, scopedBeds, scopedBills, scopedClaims);
  const kpis = [["Total Patients", scopedPatients.length, "patients"], ["Today's Appointments", todayAppointments.length, "appointments"], ["Current Admissions", currentAdmissions.length, "ipd"], ["Bed Occupancy", scopedBeds.length ? `${Math.round(occupied / scopedBeds.length * 100)}%` : "0%", "wards"], ["Today's Revenue", currencyDisplay(todayRevenue), "billing"], ["Pending Bills", pendingBills.length, "billing"], ["Staff on Duty", activeStaff.length, "staffRoster"], ["Operational Alerts", operationalAlerts.length, "notifications"]];
  const branchMetric = (branch) => {
    const own = (rows) => rows.filter((item) => String(item.branchId || "") === String(branch.id));
    const branchBeds = own(beds), branchBills = own(bills), branchPayments = own(payments);
    const revenue = branchPayments.filter((item) => isToday(item.createdAt || item.paidAt)).reduce((sum, item) => sum + Number(item.amount || item.paidAmount || 0), 0);
    const pending = branchBills.filter((item) => !["Paid", "Refunded"].includes(item.status)).reduce((sum, item) => sum + billBalanceAmount(item), 0);
    return [branch.name || branch.branchName || "Branch", own(patients).filter((item) => isToday(item.createdAt)).length, own(appointments).filter((item) => isToday(item.date || item.createdAt)).length, own(admissions).filter((item) => !["Discharged", "Cancelled"].includes(item.admissionStatus || item.status)).length, branchBeds.length ? `${Math.round(branchBeds.filter((item) => item.status === "Occupied").length / branchBeds.length * 100)}%` : "0%", currencyDisplay(revenue), currencyDisplay(pending), `<button class="button tiny soft" data-action="select-admin-branch" data-branch-id="${escapeHtml(branch.id)}">Open</button>`];
  };
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const monthRevenue = scopedPayments.filter((item) => new Date(item.createdAt || item.paidAt || 0) >= monthStart).reduce((sum, item) => sum + Number(item.amount || item.paidAmount || 0), 0);
  const staffCount = (pattern) => activeStaff.filter((item) => pattern.test(String(item.jobRole || item.roleName || ""))).length;
  return `<div class="hospital-admin-dashboard">
    <div class="section-head"><div><h2>${escapeHtml(hospital?.name ? `${hospital.name} Dashboard` : "Hospital Dashboard")}</h2><p>Administrative, financial and operational command center.</p></div><label class="admin-branch-filter">Branch<select data-hospital-admin-branch><option value="all">All Branches</option>${branches.map((branch) => `<option value="${escapeHtml(branch.id)}" ${String(hospitalAdminBranchId) === String(branch.id) ? "selected" : ""}>${escapeHtml(branch.name || branch.branchName || "Branch")}</option>`).join("")}</select></label></div>
    <div class="metric-grid hospital-admin-kpis">${kpis.map(([label,value,route]) => `<button class="metric-card metric-link" data-route="${route}"><span class="admin-kpi-icon">${navIcon(route)}</span><span>${escapeHtml(label)}</span><strong>${value}</strong><small>View records</small></button>`).join("")}</div>
    <section class="panel admin-compact-panel"><div class="panel-head"><div><h3>${hospitalAdminBranchId === "all" ? "Branch Overview" : `Branch Overview — ${escapeHtml(branches.find((item) => String(item.id) === String(hospitalAdminBranchId))?.name || "Selected Branch")}`}</h3><p>Administrative performance across hospital branches.</p></div></div>${branches.length ? table(["Branch","Patients Today","Appointments","Admissions","Bed Occupancy","Revenue","Pending Bills",""], (hospitalAdminBranchId === "all" ? branches : branches.filter((item) => String(item.id) === String(hospitalAdminBranchId))).map(branchMetric)) : `<p class="compact-empty">No branches are configured.</p>`}</section>
    <div class="admin-overview-grid">
      <section class="panel admin-compact-panel"><div class="panel-head"><h3>Bed & Ward Overview</h3></div><div class="admin-inline-stats"><span><b>${scopedBeds.length}</b>Total Beds</span><span><b>${occupied}</b>Occupied</span><span><b>${scopedBeds.filter((b) => (b.status || "Available") === "Available").length}</b>Available</span><span><b>${scopedBeds.filter((b) => b.status === "Reserved").length}</b>Reserved</span><span><b>${scopedBeds.filter((b) => b.status === "Maintenance").length}</b>Maintenance</span></div></section>
      <section class="panel admin-compact-panel"><div class="panel-head"><h3>Revenue Summary</h3></div><div class="admin-inline-stats"><span><b>${currencyDisplay(todayRevenue)}</b>Today</span><span><b>${currencyDisplay(monthRevenue)}</b>This Month</span><span><b>${currencyDisplay(pendingBills.reduce((sum,bill)=>sum+billBalanceAmount(bill),0))}</b>Pending</span><span><b>${scopedBills.filter((b)=>b.status==="Refunded").length}</b>Refunds</span><span><b>${scopedClaims.filter((c)=>!["Approved","Paid"].includes(c.status)).length}</b>Insurance Pending</span></div></section>
      <section class="panel admin-compact-panel"><div class="panel-head"><h3>Staff Overview</h3></div><div class="admin-inline-stats"><span><b>${staffCount(/doctor|surgeon/i)}</b>Doctors</span><span><b>${staffCount(/nurse/i)}</b>Nurses</span><span><b>${staffCount(/reception/i)}</b>Reception</span><span><b>${staffCount(/billing|finance/i)}</b>Billing</span><span><b>${staffCount(/lab/i)}</b>Lab</span><span><b>${staffCount(/pharmacy/i)}</b>Pharmacy</span><span><b>${staffCount(/radiology/i)}</b>Radiology</span></div></section>
      <section class="panel admin-compact-panel"><div class="panel-head"><h3>Operational Alerts</h3></div>${operationalAlerts.length ? `<div class="admin-alert-list">${operationalAlerts.slice(0,6).map((item)=>`<button data-route="${item.route}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></button>`).join("")}</div>` : `<p class="compact-empty">No operational alerts require attention.</p>`}</section>
    </div></div>`;
}

function hospitalAdminPatientsPage() {
  const patients = hospitalAdminScope(safeOptionalData(() => api.patients(currentUser), []));
  const appointments = hospitalAdminScope(safeOptionalData(() => api.appointments(currentUser), []));
  const admissions = hospitalAdminScope(safeOptionalData(() => api.admissions(currentUser), []));
  const branches = safeOptionalData(() => api.branches(currentUser), []);
  return `<section class="panel"><div class="panel-head"><div><h3>Patients</h3><p>Administrative registration and visit visibility only.</p></div></div>${patients.length ? table(["Patient","MRN / UHID","Gender","Age","Mobile","Registration Date","Branch","OPD / IPD Status"], patients.map((patient)=>[patient.name || patient.fullName || "Patient", patient.mrn || patient.uhid || patient.id, patient.gender || "-", patient.age || "-", patient.mobile || patient.mobileNumber || "-", formatDateTime(patient.createdAt), branches.find((b)=>String(b.id)===String(patient.branchId))?.name || patient.branchName || "-", admissions.some((a)=>String(a.patientId)===String(patient.id)&&!["Discharged","Cancelled"].includes(a.status || a.admissionStatus)) ? "IPD" : appointments.some((a)=>String(a.patientId)===String(patient.id)&&!["Completed","Cancelled"].includes(a.status)) ? "OPD" : "Registered"])) : `<p class="compact-empty">No registered patients in this scope.</p>`}</section>`;
}

function hospitalAdminIpdPage() {
  const admissions = hospitalAdminScope(safeOptionalData(() => api.admissions(currentUser), []));
  const appointments = hospitalAdminScope(safeOptionalData(() => api.appointments(currentUser), []));
  const branches = safeOptionalData(() => api.branches(currentUser), []);
  return `<div class="metric-grid small">${metricCard("Current OPD", appointments.filter((a)=>!["Completed","Cancelled"].includes(a.status)).length,"Administrative count")}${metricCard("Current IPD", admissions.filter((a)=>!["Discharged","Cancelled"].includes(a.status || a.admissionStatus)).length,"Active admissions")}${metricCard("Discharges", admissions.filter((a)=>(a.status || a.admissionStatus)==="Discharged").length,"Recorded")}</div><section class="panel"><div class="panel-head"><div><h3>OPD / IPD Administration</h3><p>No diagnosis, treatment, vitals or clinical notes are shown.</p></div></div>${admissions.length ? table(["Admission","Patient","Branch","Ward","Bed","Admission Status","Admission Date"], admissions.map((a)=>[a.id || a.admissionId, a.patientName || a.mrn || a.patientId, branches.find((b)=>String(b.id)===String(a.branchId))?.name || a.branchName || "-", a.ward || a.wardName || "-", a.bedNumber || a.bed || "-", a.admissionStatus || a.status || "-", formatDateTime(a.admissionDate || a.admittedAt || a.createdAt)])) : `<p class="compact-empty">No admissions in this scope.</p>`}</section>`;
}

function hospitalAdminSupportPage(title, description, kind) {
  const items = safeOptionalData(() => api.masterDataItems(currentUser), []).filter((item) => new RegExp(kind, "i").test(`${item.type || ""} ${item.category || ""} ${item.name || ""}`));
  return `<section class="panel"><div class="panel-head"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></div></div>${items.length ? table(["Service / Resource","Code","Branch","Price","Status"],items.map((item)=>[item.name || item.itemName || "-",item.code || item.itemCode || "-",item.branchName || item.branchId || "All Branches",currencyDisplay(item.price || item.amount || 0),item.status || "Active"])) : `<p class="compact-empty">No configured ${escapeHtml(title.toLowerCase())} records.</p>`}</section>`;
}

function billingDashboardPage() {
  return billingFocusedDashboardPage(deriveOperationalData());
}

function labDashboardPage() {
  const orders=safeOptionalData(()=>api.labOrders(currentUser),[]),tasks=safeOptionalData(()=>api.tasks(currentUser),[]),alerts=safeOptionalData(()=>api.alerts(currentUser),[]);
  return `<section class="panel role-page-heading"><div class="panel-head"><div><p class="eyebrow">Lab</p><h3>Today's Laboratory Work</h3><p>Order, sample and result overview for ${escapeHtml(currentUser.branchName || "Main Branch")}.</p></div></div></section><div class="metric-grid small">${metricCard("New Lab Orders",orders.filter(i=>["New","Ordered"].includes(i.status)).length,"Received")}${metricCard("Samples Pending",orders.filter(i=>!["Sample Collected","Completed","Report Ready"].includes(i.status)).length,"To collect")}${metricCard("In Processing",orders.filter(i=>i.status==="In Processing").length,"Active")}${metricCard("Results Pending",orders.filter(i=>["Sample Collected","Processing Completed"].includes(i.status)).length,"Entry")}${metricCard("Verification Pending",orders.filter(i=>i.status==="Verification Pending").length,"Review")}${metricCard("Critical Results",orders.filter(i=>i.priority==="Critical"||i.resultFlag==="Critical").length,"Critical")}${metricCard("Pending Tasks",tasks.filter(i=>i.status!=="Completed").length,"Assigned")}${metricCard("Alerts",alerts.filter(i=>i.status!=="Resolved").length,"Open")}</div>`;
}

function billingBillsPage(){return `${pharmacyTabs("billing",[["create","Create Bill"],["pending","Pending"],["paid","Paid"],["unpaid","Unpaid"],["invoices","Invoices"]])}${billingPage()}`}
function billingClaimsPage(){return `${pharmacyTabs("claims",[["create","Create"],["pending","Pending"],["approved","Approved"],["rejected","Rejected"],["status","Status"]])}${claimsPage()}`}
function billingCheckoutPage(){return `${pharmacyTabs("checkout",[["ready","Ready for Checkout"],["charges","Pending Charges"],["clearance","Billing Clearance"],["complete","Complete Checkout"]])}${checkoutPage()}`}
function billingReportsPage(){return roleShellPage("Billing","Reports","Billing and finance reporting categories.","reports",[["daily","Daily Collections"],["billing","Billing"],["outstanding","Outstanding"],["claims","Claims"],["payments","Payments"],["refunds","Refunds"]])}
function labOrdersPage(){return `${pharmacyTabs("lab",[["new","New"],["pending","Pending"],["urgent","Urgent / STAT"],["completed","Completed"]])}${labPage()}`}
function labDocumentsPage(){return `${pharmacyTabs("documents",[["attachments","Lab Attachments"],["reports","Uploaded Reports"],["supporting","Supporting Documents"]])}${documentsPage()}`}
function labReportsPage(){return roleShellPage("Lab","Reports","Laboratory reporting categories.","reports",[["daily","Daily Lab Report"],["pending","Pending Tests"],["completed","Completed Tests"],["rejections","Rejections"],["tat","Turnaround Time"]])}
function radiologyOrdersPage(){return `${pharmacyTabs("radiology",[["new","New"],["pending","Pending"],["urgent","Urgent / STAT"],["completed","Completed"]])}${radiologyPage()}`}
function radiologyShell(title,route,tabs,search=""){return roleShellPage("Radiology",title,`${title} workspace shell.`,route,tabs,search)}
function radiologyResultsPage(){const tabs=[["pending","Pending"],["create","Create Report"],["draft","Draft"],...(/radiologist/.test(String(currentUser.jobRole||"").toLowerCase())?[["verify","Verify / Sign"]]:[]),["published","Published"],["critical","Critical Findings"]];return radiologyShell("Reports","radiology-results",tabs)}
function mortuaryShell(title,route,tabs,search=""){return roleShellPage("Mortuary",title,`${title} workspace shell.`,route,tabs,search)}

// ===== NEW: Reception Enroll Patient and Patient Records Pages =====
function receptionEnrollPatientPage() {
  // Clear any previous message after render
  const message = receptionEnrollMessage;
  receptionEnrollMessage = "";

  // Fetch patients sorted newest first
  const patients = safeOptionalData(() => api.patients(currentUser), []);
  const sortedPatients = [...patients].sort((a, b) => new Date(b.createdAt || b.registeredDate || 0) - new Date(a.createdAt || a.registeredDate || 0));

  // Build form fields
  const formHtml = `
    <form class="form-grid compact-grid" data-action="reception-enroll-patient">
      <label>Full Name *<input name="name" required placeholder="Enter full name" /></label>
      <label>Mobile Number *<input name="mobile" type="tel" required placeholder="9876543210" /></label>
      <label>Date of Birth<input name="dob" type="date" /></label>
      <label>Age<input name="age" type="number" min="0" max="130" placeholder="Age" /></label>
      <label>Gender *<select name="gender" required><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
      <label>Email<input name="email" type="email" placeholder="patient@example.com" /></label>
      <label>Address *<input name="address" required placeholder="Enter address" /></label>
      <label>Emergency Contact Number<input name="emergencyContact" placeholder="9876543210" /></label>
      <label>ID Proof Type<select name="idProofType"><option value="">Select</option><option>Aadhaar</option><option>PAN</option><option>Voter ID</option><option>Passport</option><option>Driving License</option><option>Other</option></select></label>
      <label>ID Proof Number<input name="idProofNumber" placeholder="Enter ID number" /></label>
      <label>Insurance / Payment Type<select name="insurance"><option value="Self Pay">Self Pay</option><option>Insurance</option><option>Corporate</option><option>Government Scheme</option><option>Other</option></select></label>
      <label>OPD Department<input name="department" placeholder="Required when sending to vitals" /></label>
      <label>OPD Doctor<input name="doctor" placeholder="Required when sending to vitals" /></label>
      <div class="button-row span-2">
        <button class="button ghost" type="reset">Reset</button>
        <button class="button primary" type="button" data-route="records">Patient Records</button>
        <button class="button soft" type="submit" name="enrollAction" value="save">Save Patient</button>
        <button class="button primary" type="submit" name="enrollAction" value="send-to-vitals">Save &amp; Send to Vitals</button>
      </div>
    </form>
    ${message ? `<div class="notice success">${escapeHtml(message)}</div>` : ""}
  `;

  // Build table rows
  const tableRows = sortedPatients.map((patient) => {
    const ageSex = [patient.age, patient.gender].filter(Boolean).join(" / ") || "-";
    const idProof = patient.idProofType && patient.idProofNumber ? `${patient.idProofType}: ${patient.idProofNumber}` : "-";
    const insurance = patient.insurance || patient.paymentType || "-";
    const registeredDate = formatDateTime(patient.createdAt || patient.registeredDate);
    return [
      patient.mrn || "MRN pending",
      patient.name || patient.fullName || "Patient",
      patient.mobile || "-",
      ageSex,
      patient.dob || "-",
      idProof,
      insurance,
      registeredDate,
      `<button class="button tiny primary" type="button" data-route="admissions" data-patient-id="${escapeHtml(patient.id)}" data-testid="new-admission-button">New Admission</button>`
    ];
  });

  const tableHtml = `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Patient Records</h3></div>
      </div>
      ${tableRows.length ? table(
        ["MRN", "Patient Name", "Mobile", "Age / Sex", "Date of Birth", "ID Proof", "Insurance", "Registered Date", "Actions"],
        tableRows
      ) : emptyState("No patients enrolled yet.")}
    </section>
  `;

  return `
    <div class="section-head">
      <div><h2>Enroll Patient</h2></div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h3>Enroll Patient Form</h3></div>
      </div>
      ${formHtml}
      <div class="reception-existing-vitals">
        <div><h3>Existing Patient</h3><p>Search and select an existing patient without creating a duplicate record.</p></div>
        <form class="form-grid compact-grid" data-action="reception-existing-send-to-vitals">
          <label class="span-2">Search Patient<input type="search" data-existing-patient-search placeholder="Search name, MRN / UHID or mobile" /></label>
          <label class="span-2">Patient<select name="patientId" required data-existing-patient-select><option value="">Select patient</option>${patients.map((patient) => `<option value="${escapeHtml(patient.id)}" data-search="${escapeAttribute([patient.name, patient.fullName, patient.mrn, patient.uhid, patient.mobile, patient.mobileNumber].filter(Boolean).join(" ").toLowerCase())}">${escapeHtml(`${patient.name || patient.fullName || "Patient"} · ${patient.mrn || patient.uhid || patient.id} · ${patient.mobile || patient.mobileNumber || "No mobile"}`)}</option>`).join("")}</select></label>
          <label>Department<input name="department" required placeholder="OPD department" /></label>
          <label>Doctor<input name="doctor" required placeholder="Doctor" /></label>
          <button class="button primary span-2" type="submit">Send to Vitals</button>
        </form>
      </div>
    </section>
    ${tableHtml}
  `;
}

function receptionPatientRecordsPage() {
  const patients = safeOptionalData(() => api.patients(currentUser), []);
  const sortedPatients = [...patients].sort((a, b) => new Date(b.createdAt || b.registeredDate || 0) - new Date(a.createdAt || a.registeredDate || 0));

  const tableRows = sortedPatients.map((patient) => {
    const ageSex = [patient.age, patient.gender].filter(Boolean).join(" / ") || "-";
    const idProof = patient.idProofType && patient.idProofNumber ? `${patient.idProofType}: ${patient.idProofNumber}` : "-";
    const insurance = patient.insurance || patient.paymentType || "-";
    const registeredDate = formatDateTime(patient.createdAt || patient.registeredDate);
    return [
      patient.mrn || "MRN pending",
      patient.name || patient.fullName || "Patient",
      patient.mobile || "-",
      ageSex,
      patient.dob || "-",
      idProof,
      insurance,
      registeredDate,
      `<button class="button tiny primary" type="button" data-route="admissions" data-patient-id="${escapeHtml(patient.id)}" data-testid="new-admission-button">New Admission</button>`
    ];
  });

  return `
    <div class="section-head">
      <div><h2>Patient Records</h2></div>
      <div class="button-row">
        <button class="button primary" type="button" data-route="patients">Enroll Patient</button>
      </div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h3>Patient Records</h3></div>
      </div>
      ${tableRows.length ? table(
        ["MRN", "Patient Name", "Mobile", "Age / Sex", "Date of Birth", "ID Proof", "Insurance", "Registered Date", "Actions"],
        tableRows
      ) : emptyState("No patients enrolled yet.")}
    </section>
  `;
}

// ===== NEW: Reception New Admission and Admission Records Pages =====
function receptionNewAdmissionPage() {
  const { query } = parseHashRoute();
  const preselectedPatientId = query.patientId || "";

  // Clear any previous message
  const message = receptionAdmissionMessage;
  receptionAdmissionMessage = "";

  const patients = safeOptionalData(() => api.patients(currentUser), []);
  const admissions = safeOptionalData(() => api.admissions(currentUser), []);
  const sortedAdmissions = [...admissions].sort((a, b) => new Date(b.createdAt || b.admissionDateTime || 0) - new Date(a.createdAt || a.admissionDateTime || 0));

  // Build patient dropdown options
  const patientOptions = patients.map((p) => {
    const selected = String(p.id) === preselectedPatientId ? "selected" : "";
    return `<option value="${escapeHtml(p.id)}" ${selected}
      data-mrn="${escapeHtml(p.mrn || "")}"
      data-mobile="${escapeHtml(p.mobile || "")}"
      data-age="${escapeHtml(p.age || "")}"
      data-gender="${escapeHtml(p.gender || "")}"
      data-name="${escapeHtml(p.name || p.fullName || "")}"
    >${escapeHtml(p.mrn || "MRN pending")} - ${escapeHtml(p.name || p.fullName || "Patient")} - ${escapeHtml(p.mobile || "")}</option>`;
  }).join("");

  // Build admission type options (IPD, Day Care, Emergency Admission)
  const admissionTypeOptions = `
    <option>IPD</option>
    <option>Day Care</option>
    <option>Emergency Admission</option>
  `;

  // Payment type options
  const paymentTypeOptions = `
    <option value="Self Pay">Self Pay</option>
    <option value="Insurance">Insurance</option>
    <option value="Corporate">Corporate</option>
    <option value="Government Scheme">Government Scheme</option>
  `;

  // Build form
  const formHtml = `
    <form class="form-grid compact-grid" data-action="reception-create-admission">
      <label>Patient *<select name="patientId" required data-admission-patient>
        <option value="">Select patient</option>
        ${patientOptions}
      </select></label>
      <label>MRN<input name="mrn" readonly placeholder="Auto-filled" /></label>
      <label>Mobile<input name="mobile" readonly placeholder="Auto-filled" /></label>
      <label>Age / Gender<input name="ageGender" readonly placeholder="Auto-filled" /></label>

      <label>Admission Type *<select name="admissionType" required>${admissionTypeOptions}</select></label>
      <label>Department *<input name="department" required placeholder="e.g. General Medicine" /></label>
      <label>Doctor / Consultant<input name="doctor" placeholder="Attending doctor" /></label>
      <label>Admission Date *<input name="admissionDate" type="date" value="${localDateInputValue()}" required /></label>
      <label>Admission Time *<input name="admissionTime" type="time" value="09:00" required /></label>

      <label>Attendant Name<input name="attendantName" placeholder="Name of attendant" /></label>
      <label>Attendant Mobile<input name="attendantMobile" placeholder="9876543210" /></label>

      <label>Payment Type *<select name="paymentType" required>${paymentTypeOptions}</select></label>
      <label>Insurance / Corporate Name<input name="insuranceCorporateName" placeholder="Name of insurer / company" /></label>

      <label class="span-2">Administrative Notes<textarea name="adminNotes" placeholder="Any administrative remarks"></textarea></label>

      <div class="button-row span-2">
        <button class="button ghost" type="reset">Reset</button>
        <button class="button primary" type="button" data-route="admission-records">Admission Records</button>
        <button class="button primary" type="submit">Create Admission</button>
      </div>
    </form>
    ${message ? `<div class="notice success">${escapeHtml(message)}</div>` : ""}
  `;

  // Build admission records table
  const tableRows = sortedAdmissions.map((admission) => {
    const patient = patients.find((p) => String(p.id) === String(admission.patientId));
    const admissionDateTime = formatDateTime(admission.admissionDateTime || admission.createdAt);
    const wardBed = admission.ward && admission.bedNumber ? `${admission.ward} / ${admission.bedNumber}` : (admission.ward || admission.bedNumber || "-");
    return [
      admission.admissionId || admission.id || "ID pending",
      patient?.mrn || admission.mrn || "-",
      patient?.name || admission.patientName || "-",
      admissionDateTime,
      admission.admissionType || "-",
      admission.department || "-",
      admission.doctor || admission.consultant || "-",
      admission.paymentType || "-",
      wardBed,
      `<div class="grid-actions">
        <button class="button tiny soft" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admission.id)}">View</button>
        ${hasPermission(currentUser, "billing", "create") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${escapeHtml(admission.patientId)}">Create Invoice</button>` : ""}
        <button class="button tiny soft" type="button" onclick="window.print()">Print</button>
      </div>`
    ];
  });

  const tableHtml = `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Admission Records</h3></div>
      </div>
      ${tableRows.length ? table(
        ["Admission ID", "MRN", "Patient Name", "Admission Date / Time", "Admission Type", "Department", "Doctor / Consultant", "Payment Type", "Ward / Bed", "Actions"],
        tableRows
      ) : emptyState("No admission records found.")}
    </section>
  `;

  return `
    <div class="section-head">
      <div><h2>New Admission</h2></div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h3>Admission Form</h3></div>
      </div>
      ${formHtml}
    </section>
    ${tableHtml}
  `;
}

function receptionAdmissionRecordsPage() {
  const patients = safeOptionalData(() => api.patients(currentUser), []);
  const admissions = safeOptionalData(() => api.admissions(currentUser), []);
  const sortedAdmissions = [...admissions].sort((a, b) => new Date(b.createdAt || b.admissionDateTime || 0) - new Date(a.createdAt || a.admissionDateTime || 0));

  const tableRows = sortedAdmissions.map((admission) => {
    const patient = patients.find((p) => String(p.id) === String(admission.patientId));
    const admissionDateTime = formatDateTime(admission.admissionDateTime || admission.createdAt);
    const wardBed = admission.ward && admission.bedNumber ? `${admission.ward} / ${admission.bedNumber}` : (admission.ward || admission.bedNumber || "-");
    return [
      admission.admissionId || admission.id || "ID pending",
      patient?.mrn || admission.mrn || "-",
      patient?.name || admission.patientName || "-",
      admissionDateTime,
      admission.admissionType || "-",
      admission.department || "-",
      admission.doctor || admission.consultant || "-",
      admission.paymentType || "-",
      wardBed,
      `<div class="grid-actions">
        <button class="button tiny soft" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admission.id)}">View</button>
        ${hasPermission(currentUser, "billing", "create") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${escapeHtml(admission.patientId)}">Create Invoice</button>` : ""}
        <button class="button tiny soft" type="button" onclick="window.print()">Print</button>
      </div>`
    ];
  });

  return `
    <div class="section-head">
      <div><h2>Admission Records</h2></div>
      <div class="button-row">
        <button class="button primary" type="button" data-route="admissions">New Admission</button>
      </div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h3>Admission Records</h3></div>
      </div>
      ${tableRows.length ? table(
        ["Admission ID", "MRN", "Patient Name", "Admission Date / Time", "Admission Type", "Department", "Doctor / Consultant", "Payment Type", "Ward / Bed", "Actions"],
        tableRows
      ) : emptyState("No admission records found.")}
    </section>
  `;
}
// ===== END NEW Reception Pages =====

function renderPage(page) {
  const pageContext = { __dataRenderScheduled, accessDeniedPanel, accessReviewTarget, actionIcon, addButtonTestId, admissionBedLabel, admissionDisplayId, admissionPatientId, admissionWardLabel, allAssignablePages, allowedCreatorRoleOptions, animateCountUps, api, app, applyUserRolePreset, appointmentDepartmentOptions, appointmentDoctorOptions, asArray, attentionPanel, auditSearchQuery, authFrame, automationAlerts, automationAlertsPanel, automationList, automationSettingsCache, automationSettingsCacheUserId, automationSettingsForScope, badge, billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, branchDepartmentOptions, branchUserPermissionBuilder, canAccessPage, canonicalRecordId, careCommandStrip, checklistPanel, clickLoadingActions, cloneUserOptions, COLLECTION_MODULES, collectionRows, collectSetupStepValues, comparisonTable, createForm, createModal, createTarget, currencyDisplay, currencyValue, currentPageTitle, currentUser, dashboardPage, dateSeriesFromRows, deathSummaryButton, deathSummaryChecklistPanel, deathSummaryForAdmission, deathSummaryForm, deathSummaryPage, deathSummaryPreview, deathSummarySection, delayLabel, deleteModal, deleteTarget, deriveBillingSuggestions, deriveNotifications, deriveOperationalData, deriveTasks, dischargeChecklistPanel, documentActions, documentAlertsPanel, documentTable, documentTypeOptions, documentUploadPanel, downloadBase64File, draftKeyFor, draftTimers, editableEntries, editFieldControl, editFieldLabel, editModal, editTarget, emergencyOneScreenPanel, emptyState, enhanceDraftAreas, enhancePasswordHints, environmentLabel, escapeAttribute, escapeHtml, exportCsv, exportExcel, fileStorageStatus, fillAppointmentFromPatient, filterAppointmentDoctors, filterByAdmission, financeSummaryFromBills, findAdmissionForPlan, findPatient, findPatientForDischarge, firstDefined, formatAuditValue, formatDateTime, formatGb, formValues, getApiMode, globalSearchActiveIndex, globalSearchError, globalSearchQuery, globalSearchStatus, globalSearchSuggestions, globalSearchTimer, goLiveChecklistCache, goLiveChecklistCacheUserId, goLiveChecklistForScope, gridActions, gridAddButton, groupSearchResults, hasPermission, iconLabel, inferredSetupProgress, initFrontendSentry, ipd360Button, ipd360Tabs, ipdAdmissionChecklistPanel, ipdAdmissionStatus, ipdHeader, ipdJourneyTracker, ipdNextActions, ipdTimelineEvents, ipdTimelinePanel, isAuthError, isBillPaidToday, isDeathOutcome, isPendingStatus, isToday, isUnauthorizedError, jobRoleOptions, journeyTracker, latestForPatient, latestPatientJourneyStage, latestRecord, livePatientFlowBoard, loadingLabel, loadingLabels, localDateInputValue, localDateKey, localFrontendMode, MASTER_MODULES, medicineField, mergeNotifications, metricCard, metricTrend, minutesSince, missingDocumentAlerts, modalSubmitTestId, money, NAV_BY_ROLE, navGroupLabel, navIcon, normalizeBranchAdminCreateUserForm, normalizeDashboardData, normalizeEditValues, normalizePageKey, normalizeSetupStep, notificationGroup, notificationsDrawerOpen, OPD_JOURNEY_STEPS, opdCheckoutChecklistPanel, opdJourneyTrackerForPatient, PAGE_TITLE_FALLBACK, pageErrorPanel, pageFromHash, pageSkeleton, parseCsv, parseHashRoute, passwordField, passwordPolicyHint, passwordPolicyState, patientActions, patientAppointmentsPage, patientBillsPage, patientCardGrid, patientDashboardPage, patientDocumentsPage, patientJourneyTimelinePanel, patientLabel, patientName, patientOption, patientPortalShell, patientRiskIndicator, patientStickyHeader, patientTimeline, pendingCount, pendingUpload, permissionMatrix, permissionMatrixRows, permissionRiskAlerts, permissionRiskPanel, permissionTemplateOptions, permitted, printableButton, priorityCards, providerStatusGrid, publicBookingConfirmation, publicBookingLinkBlock, publicBookingPage, queueDelayAlerts, queueDelayPanel, quickActionsPanel, readFileAsDataUrl, readFileAsText, recordTime, render, renderAuth, renderedPageKey, renderMustChangePasswordGate, renderNotificationsDrawer, renderPage, renderPatientPortal, renderPublicBooking, renderShell, resolveDischargePatient, resolveMedicationName, riskClass, riskSummary, roleDashboardPanel, roleLabels, ROLES, roleSmartCards, roleWorkQueue, routeKey, rowRouteButton, runGlobalSearch, safeAiAssistantPanel, safeData, safeMrn, safeOptionalData, safeRenderPage, sameId, sampleCsv, scheduleDataRender, scheduleDraftSave, scopeDescription, searchFilterBar, searchResultRoute, selectedPatientId, selectedPermissionPages, selectPatientPanel, SENSITIVE_USER_PERMISSIONS, sensitivePermissionList, setPage, setPermissionPages, SETUP_STEP_ALIASES, SETUP_WIZARD_STEPS, setupPercent, setupProgressSummary, severityForDelay, shouldStagePage, simpleOpsPage, skeletonLine, skeletonMetricCards, skeletonTable, smartBillingDraftPanel, stagedPageKey, stagedPageTimer, startButtonLoading, startFormLoading, statusClass, stopButtonLoading, stopFormLoading, strongPassword, table, taskStatus, TEXT_TEMPLATES, titleCase, toast, toNumber, topSearchAutocomplete, trendChart, unauthorizedPage, uniquePages, updatePermissionBuilder, uploadValidation, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, userAccessDetail, userAccessPreview, userInitials, userPageCheckboxGroups, validateRows, warmDataCache };
  configurePatientFlowPages(pageContext);
  configureIpdClinicalPages(pageContext);
  configureAdministrationPages(pageContext);
  configureOperationsPages(pageContext);
  configurePlatformPages(pageContext);
  const pages = {
    dashboard: currentUser.role === ROLES.HOSPITAL_ADMIN ? hospitalAdminDashboardPage : currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "nurse" ? nurseDashboardPage : currentUser.role === ROLES.BRANCH_USER && ["doctor", "surgeon"].includes(String(currentUser.jobRole || "").toLowerCase()) ? doctorDashboardPage : currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? pharmacyDashboardPage : currentUser.role === ROLES.BRANCH_USER && /billing|finance/.test(String(currentUser.jobRole||"").toLowerCase()) ? billingDashboardPage : currentUser.role === ROLES.BRANCH_USER && /lab/.test(String(currentUser.jobRole||"").toLowerCase()) ? labDashboardPage : dashboardPage,
    hospitals: hospitalsPage,
    branches: branchesPage,
    users: usersPage,
    accessReview: accessReviewPage,
    permissionTemplates: permissionTemplatesPage,
    setup: setupPage,
    masterData: masterDataPage,
    doctorSchedule: doctorSchedulePage,
    staffRoster: staffRosterPage,
    emergency: emergencyPage,
    documents: currentUser.role===ROLES.BRANCH_USER&&/lab/.test(String(currentUser.jobRole||"").toLowerCase())?labDocumentsPage:documentsPage,
    notifications: notificationsPage,
    finance: financePage,
    stock: currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? () => pharmacyWorkflowInventoryPage(currentUser) : stockPage,
    purchase: purchasePage,
    feedback: feedbackPage,
    backup: backupPage,
    compliance: currentUser.role === ROLES.HOSPITAL_ADMIN ? () => hospitalAdminSupportPage("Radiology Management", "Imaging catalog, pricing, equipment and operational status only. Patient reports and images are excluded.", "radiology|imaging") : compliancePage,
    globalSearch: globalSearchPage,
    appointments: appointmentsPage,
    patients: currentUser.role === ROLES.HOSPITAL_ADMIN ? hospitalAdminPatientsPage : currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "nurse"
      ? () => nurseMyPatientsPage({ api, currentUser, safeData, safeOptionalData, escapeHtml })
      : currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
        ? receptionEnrollPatientPage
        : patientsPage,
    queue: queuePage,
    vitals: vitalsPage,
    consultation: consultationPage,
    lab: currentUser.role===ROLES.BRANCH_USER&&/lab/.test(String(currentUser.jobRole||"").toLowerCase())?labOrdersPage:labPage,
    radiology: currentUser.role===ROLES.BRANCH_USER&&/radiology/.test(String(currentUser.jobRole||"").toLowerCase())?radiologyOrdersPage:radiologyPage,
    "radiology-scheduling":()=>radiologyShell("Scheduling","radiology-scheduling",[["schedule","To Schedule"],["today","Today"],["upcoming","Upcoming"],["reschedule","Reschedule / Cancel"],["xray","X-Ray"],["ct","CT"],["mri","MRI"],["ultrasound","Ultrasound"],["mammography","Mammography"],["other","Other"]]),
    "radiology-queue":()=>radiologyShell("Scan Queue","radiology-queue",[["waiting","Waiting"],["scheduled","Scheduled"],["arrived","Arrived"],["progress","In Progress"],["completed","Scan Completed"],["reporting","Reporting Pending"]]),
    "radiology-imaging":()=>radiologyShell("Imaging / Scan","radiology-imaging",[["xray","X-Ray"],["ct","CT"],["mri","MRI"],["ultrasound","Ultrasound"],["other","Other Imaging"]]),
    "radiology-results":radiologyResultsPage,
    "radiology-search":()=>radiologyShell("Patient / Order Search","radiology-search",[["patient","Patient"],["mrn","MRN"],["order","Radiology Order"],["study","Study / Scan ID"]],"Search patient, MRN, radiology order or study ID"),
    pharmacy: currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? () => pharmacyWorkflowPrescriptionsPage(currentUser) : pharmacyPage,
    "pharmacy-payments": () => pharmacyWorkflowPaymentsPage(currentUser),
    "pharmacy-dispensing": () => pharmacyWorkflowDispensingPage(currentUser),
    returns: () => pharmacyWorkflowReturnsPage(currentUser),
    billing: currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingBillsPage:billingPage,
    payments: () => roleShellPage("Billing","Payments","Payment workspace shell.","payments",[["receive","Receive Payment"],["partial","Partial Payments"],["receipts","Receipts"],["history","Payment History"]]),
    "ipd-billing": () => roleShellPage("Billing","IPD Billing","Admission-linked charge-category shell.","ipd-billing",[["bed","Bed / Room"],["doctor","Doctor"],["lab","Lab"],["radiology","Radiology"],["pharmacy","Pharmacy"],["procedure","OT / Procedure"],["final","Final Bill"]]),
    refunds: () => roleShellPage("Finance","Refunds / Adjustments","Finance adjustment shell; no mutation actions enabled.","refunds",[["requests","Refund Requests"],["discounts","Discounts"],["credit","Credit Notes"],["corrections","Bill Corrections"]]),
    "billing-search": () => roleShellPage("Finance","Patient / Bill Search","Search billing references without patient management.","billing-search",[["patient","Patient Name"],["mrn","MRN"],["bill","Bill No"],["admission","Admission No"],["receipt","Receipt No"]],"Search patient, MRN, bill, admission or receipt number"),
    "lab-samples": () => roleShellPage("Lab","Sample Collection","Sample collection workspace shell.","lab-samples",[["collect","To Collect"],["collected","Collected"],["recollect","Recollection"],["rejected","Rejected"],["labels","Barcode / Labels"]]),
    "lab-processing": () => roleShellPage("Lab","Sample Processing","Sample processing status shell.","lab-processing",[["received","Received"],["processing","In Processing"],["completed","Processing Completed"],["result","Pending Result Entry"]]),
    "lab-results": () => roleShellPage("Lab","Results","Laboratory results status shell.","lab-results",[["entry","Enter Results"],["draft","Draft"],["verification","Verification Pending"],["verified","Verified"],["published","Published"],["critical","Critical"]]),
    "lab-search": () => roleShellPage("Lab","Patient / Order Search","Search laboratory references.","lab-search",[["patient","Patient"],["mrn","MRN"],["order","Lab Order"],["sample","Barcode / Sample ID"]],"Search patient, MRN, lab order or sample ID"),
    checkout: currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingCheckoutPage:checkoutPage,
    followups: followUpsPage,
    admissions: currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
      ? receptionNewAdmissionPage
      : admissionsPage,
    ipd: currentUser.role === ROLES.HOSPITAL_ADMIN ? hospitalAdminIpdPage : ipdPage,
    ipdPatient360: ipdPatient360Page,
    emr: emrPage,
    deathSummary: deathSummaryPage,
    wards: wardsPage,
    dailySheets: dailySheetsPage,
    dutyDoctor: dutyDoctorPage,
    nursing: nursingPage,
    ipdVitals: ipdVitalsPage,
    mar: marPage,
    intakeOutput: intakeOutputPage,
    handover: handoverPage,
    discharge: dischargePage,
    ot: otPage,
    mortuary: mortuaryPage,
    //"mortuary-intake":()=>mortuaryShell("Admissions / Intake","mortuary-intake",[["new","New Intake"],["identification","Identification"],["received","Received Details"],["property","Property / Belongings"]]),
    "mortuary-storage": () => mortuaryStoragePage({ api, currentUser }),
    "mortuary-certificates": () => mortuaryCertificatesPage({ api, currentUser }),
    "mortuary-release": () => mortuaryReleasePage({ api, currentUser }),
    "mortuary-register": () => mortuaryRegisterPage({ api, currentUser }),
    "mortuary-search": () => mortuarySearchPage({ api, currentUser }),
    ipdReports: ipdReportsPage,
    ipdAlerts: ipdAlertsPage,
    claims: currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingClaimsPage:claimsPage,
    uploads: uploadPage,
    mapping: mappingPage,
    records: currentUser.role === ROLES.HOSPITAL_ADMIN ? () => hospitalAdminSupportPage("Laboratory Management", "Test catalog, pricing, staffing and operational status only. Patient results are excluded.", "lab|laboratory|test") : currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
      ? receptionPatientRecordsPage
      : recordsPage,
    "admission-records": currentUser.role === ROLES.BRANCH_USER && String(currentUser.jobRole || "").toLowerCase() === "reception user"
      ? receptionAdmissionRecordsPage
      : recordsPage, // fallback for non-reception
    alerts: alertsPage,
    tasks: tasksPage,
    reports: (currentUser.role === ROLES.BRANCH_USER && /mortuary/.test(String(currentUser.jobRole || "").toLowerCase()))
      ? () => mortuaryReportsPage({ api, currentUser })
      : (currentUser.role === ROLES.BRANCH_USER && /pharmacy|pharmacist/.test(String(currentUser.jobRole || "").toLowerCase()) ? pharmacyReportsPage : currentUser.role===ROLES.BRANCH_USER&&/billing|finance/.test(String(currentUser.jobRole||"").toLowerCase())?billingReportsPage:currentUser.role===ROLES.BRANCH_USER&&/lab/.test(String(currentUser.jobRole||"").toLowerCase())?labReportsPage:reportsPage),
    audit: auditPage,
    settings: settingsPage,
    productFlow: productFlowPage,
    subscriptions: subscriptionsPage,
    offers: offersPage,
    modules: modulesPage,
    inventory: inventoryPage,
    staff: () => simpleOpsPage("Staff Master", api.staff(currentUser), ["name", "role", "department", "shift", "utilization"]),
    beds: () => simpleOpsPage("Beds / Rooms", api.beds(currentUser), ["bed", "room", "status", "patientId"]),
    incidents: () => simpleOpsPage("Incidents", api.incidents(currentUser), ["title", "category", "risk", "status", "date"]),
    profile: profilePage
  };
  return safeRenderPage(page, pages[page]);
}

function safeRenderPage(page, renderFn) {
  if (!renderFn) return pageErrorPanel(currentPageTitle(page), "This page is not connected yet.", "Choose another page from the sidebar.");
  try {
    return renderFn();
  } catch (error) {
    if (isAuthError(error)) throw error;
    if (isUnauthorizedError(error)) return accessDeniedPanel(page);
    console.warn(error.message);
    return pageErrorPanel(currentPageTitle(page), error.message || "This page could not load its data.", "Your session is still active. Try again or choose another page.");
  }
}

function accessDeniedPanel(page = pageFromHash()) {
  const helpByPage = {
    ipd: "IPD pages are usually available to Hospital Admin, Branch Admin, Duty Doctor, and Nurse roles with assigned IPD access.",
    ipdPatient360: "IPD Patient 360 is usually available to Branch Admin, Duty Doctor, and Nurse roles with IPD access.",
    dailySheets: "Daily Sheets are usually available to Branch Admin and Nurse roles assigned to IPD care.",
    mar: "MAR is usually available to Nurse and Branch Admin roles with medication workflow access.",
    discharge: "Discharge Planning is usually available to Duty Doctor, Branch Admin, and authorized discharge teams.",
    finance: "Finance is usually available to Hospital Admin, Branch Admin, and finance-authorized staff.",
    stock: "Stock Logic is usually available to Hospital Admin, Branch Admin, Pharmacy, and Inventory roles.",
    documents: "Documents are usually available to document-enabled clinical, claims, lab, and admin staff."
  };
  return `
    <section class="panel state-panel" data-testid="access-denied-panel">
      <div class="empty error-state">
        <span class="empty-icon lock-icon" aria-hidden="true">!</span>
        <strong>You do not have permission to access this page.</strong>
        <p>${escapeHtml(currentPageTitle(page))} is outside your current role or branch access.</p>
        <small>${escapeHtml(helpByPage[page] || "Ask your administrator to review your branch, page, and action permissions.")}</small>
      </div>
    </section>
  `;
}

function pageErrorPanel(title, message, note = "Try again.") {
  return `
    <section class="panel state-panel" data-testid="page-error-panel">
      <div class="empty error-state">
        <span class="empty-icon error-icon" aria-hidden="true">!</span>
        <strong>${escapeHtml(title || "Page could not load")}</strong>
        <p>${escapeHtml(message || "This page could not load its data. Try again.")}</p>
        <small>${escapeHtml(note)}</small>
        <div class="button-row"><button class="button soft" type="button" data-action="retry-page">Retry</button></div>
      </div>
    </section>
  `;
}

function skeletonLine(width = "100%") {
  return `<span class="skeleton-line" style="--skeleton-width:${escapeHtml(width)}"></span>`;
}

function skeletonMetricCards(count = 6) {
  return `<div class="metric-grid">${Array.from({ length: count }).map(() => `
    <article class="metric-card skeleton-card" aria-hidden="true">
      ${skeletonLine("58%")}
      ${skeletonLine("38%")}
      ${skeletonLine("76%")}
    </article>
  `).join("")}</div>`;
}

function skeletonTable(rows = 6, columns = 6) {
  const widths = ["72%", "48%", "64%", "38%", "58%", "44%", "68%", "54%"];
  return `
    <section class="panel skeleton-card" aria-busy="true" aria-live="polite">
      <div class="panel-head">
        <div>${skeletonLine("180px")}${skeletonLine("320px")}</div>
        ${skeletonLine("96px")}
      </div>
      <div class="table-wrap">
        <table class="skeleton-table">
          <thead><tr>${Array.from({ length: columns }).map((_, index) => `<th>${skeletonLine(widths[index % widths.length])}</th>`).join("")}</tr></thead>
          <tbody>
            ${Array.from({ length: rows }).map((_, rowIndex) => `<tr>${Array.from({ length: columns }).map((__, colIndex) => `<td>${skeletonLine(widths[(rowIndex + colIndex) % widths.length])}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function pageSkeleton(page = pageFromHash()) {
  const title = currentPageTitle(page);
  const heavy = new Set(["dashboard", "patients", "appointments", "queue", "billing", "documents", "audit", "ipd", "ipdPatient360", "emergency"]);
  return `
    <div class="page-transition page-loading" data-testid="page-loading-state">
      <section class="panel page-loading-head">
        <div>
          <p class="eyebrow">Loading</p>
          <h2>${escapeHtml(title)}</h2>
          <p>Preparing live data for your permitted hospital and branch scope.</p>
        </div>
        <span class="loading-spinner" aria-hidden="true"></span>
      </section>
      ${heavy.has(page) ? skeletonMetricCards(page === "ipdPatient360" ? 6 : 3) : ""}
      ${skeletonTable(page === "ipdPatient360" ? 4 : 6, page === "ipdPatient360" ? 2 : 7)}
    </div>
  `;
}

function selectPatientPanel(message = "Select a patient to continue.", patients = [], action = "patient-start-consultation") {
  return `
    <section class="panel state-panel" data-testid="select-patient-panel">
      <div class="panel-head"><h3>Select patient</h3><p>${escapeHtml(message)}</p></div>
      ${patients.length ? patientCardGrid(patients.map((patient) => ({
        id: patient.id,
        patientId: patient.id,
        patientName: patient.name || patient.fullName,
        mrn: patient.mrn,
        age: patient.age,
        gender: patient.gender,
        priority: patient.priority || "Normal",
        status: patient.status || "Active",
        action,
        actionLabel: action === "patient-record-vitals" ? "Record Vitals" : "Start Consultation"
      }))) : emptyState("No patients are available for this step right now.")}
    </section>
  `;
}

function normalizeDashboardData(data = {}) {
  return {
    ...data,
    metrics: data.metrics || {},
    hospitals: Array.isArray(data.hospitals) ? data.hospitals : [],
    branches: Array.isArray(data.branches) ? data.branches : [],
    alerts: Array.isArray(data.alerts) ? data.alerts : [],
    tasks: Array.isArray(data.tasks) ? data.tasks : []
  };
}

function deriveOperationalData() {
  return {
    patients: permitted("patients") ? safeOptionalData(() => api.patients(currentUser)) : [],
    appointments: permitted("appointments") ? safeOptionalData(() => api.appointments(currentUser)) : [],
    queue: permitted("queue") ? safeOptionalData(() => api.queueTokens(currentUser)) : [],
    vitals: permitted("vitals") ? safeOptionalData(() => api.vitals(currentUser)) : [],
    consultations: permitted("consultation") ? safeOptionalData(() => api.consultations(currentUser)) : [],
    labOrders: permitted("lab") ? safeOptionalData(() => api.labOrders(currentUser)) : [],
    pharmacyIssues: permitted("pharmacy") ? safeOptionalData(() => api.pharmacyIssues(currentUser)) : [],
    bills: permitted("billing") ? safeOptionalData(() => api.bills(currentUser)) : [],
    payments: permitted("payments") || permitted("billing") ? safeOptionalData(() => api.payments(currentUser)) : [],
    checkouts: permitted("checkout") ? safeOptionalData(() => api.checkouts(currentUser)) : [],
    admissions: permitted("admissions") ? safeOptionalData(() => api.admissions(currentUser)) : [],
    beds: permitted("wards") || permitted("beds") ? safeOptionalData(() => api.beds(currentUser)) : [],
    documents: permitted("documents") ? safeOptionalData(() => api.patientDocuments(currentUser)) : [],
    users: permitted("accessReview") ? safeOptionalData(() => api.accessReviewUsers(currentUser)) : [],
    branches: permitted("branches") ? safeOptionalData(() => api.branches(currentUser)) : [],
    permissionTemplates: permitted("permissionTemplates") ? safeOptionalData(() => api.permissionTemplates(currentUser)) : [],
    dischargePlans: permitted("discharge") ? safeOptionalData(() => api.dischargePlans(currentUser)) : [],
    deathSummaries: permitted("deathSummary") ? safeOptionalData(() => api.deathSummaries(currentUser)) : [],
    otBookings: permitted("ot") ? safeOptionalData(() => api.otBookings(currentUser)) : [],
    radiologyOrders: permitted("radiology") ? safeOptionalData(() => api.radiologyOrders(currentUser)) : [],
    mortuaryRecords: permitted("mortuary") ? safeOptionalData(() => api.mortuaryRecords(currentUser)) : [],
    providers: permitted("settings") ? safeOptionalData(() => api.providerStatus?.(), null) : null
  };
}

function deriveTasks(data = deriveOperationalData()) {
  const tasks = [];
  const add = (condition, task) => {
    if (condition) tasks.push({ priority: "Medium", due: "Today", status: "Open", ...task });
  };
  data.queue.forEach((token) => add(permitted("vitals", "create") && !latestForPatient(data.vitals, token.patientId), {
    title: `Record vitals for ${token.patientName || token.patientId}`,
    assignedTo: "Nursing",
    module: "Vitals",
    priority: minutesSince(recordTime(token)) > 15 || Number(token.waitingMinutes || 0) > 15 ? "High" : "Medium",
    route: "vitals",
    patientId: token.patientId
  }));
  data.labOrders.forEach((order) => add(isPendingStatus(order.status, ["Report Ready", "Doctor Reviewed"]), {
    title: `${order.orderType || "Lab"} report pending for ${patientName(data.patients, order.patientId, order.patientName || order.patientId)}`,
    assignedTo: order.orderType === "Radiology" ? "Radiology" : "Lab",
    module: order.orderType || "Lab",
    route: order.orderType === "Radiology" ? "radiology" : "lab"
  }));
  data.pharmacyIssues.forEach((issue) => add(issue.status !== "Issued", {
    title: `Issue medicines for ${issue.patientName || patientName(data.patients, issue.patientId, issue.patientId)}`,
    assignedTo: "Pharmacy",
    module: "Pharmacy",
    route: "pharmacy"
  }));
  data.bills.forEach((bill) => add(bill.status !== "Paid", {
    title: `Collect payment for ${bill.patientName || patientName(data.patients, bill.patientId, bill.patientId)}`,
    assignedTo: "Billing",
    module: "Billing",
    priority: "High",
    route: "billing",
    patientId: bill.patientId
  }));
  data.admissions.forEach((admission) => add(permitted("wards", "edit") && !admission.bedNumber && !admission.bedId && !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(admission)), {
    title: `Assign bed for ${admission.patientName || admissionPatientId(admission)}`,
    assignedTo: "IPD Team",
    module: "Wards",
    priority: "High",
    route: "wards",
    admissionId: admissionDisplayId(admission)
  }));
  data.dischargePlans.forEach((plan) => add(plan.status !== "Ready for Discharge", {
    title: `Complete discharge clearances for ${plan.patientName || plan.patientId || plan.admissionId}`,
    assignedTo: "Discharge Team",
    module: "Discharge",
    priority: "High",
    route: "discharge",
    admissionId: plan.admissionId
  }));
  data.deathSummaries.forEach((summary) => add(["Submitted", "Submitted for Review", "Returned"].includes(summary.status), {
    title: `Death Summary ${summary.status} for ${summary.patientName || summary.mrn || summary.admissionId}`,
    assignedTo: "Clinical Reviewer",
    module: "Death Summary",
    priority: "Critical",
    route: "ipdPatient360",
    admissionId: summary.admissionId
  }));
  return tasks;
}

function deriveNotifications(data = deriveOperationalData()) {
  const thresholds = automationSettingsForScope();
  if (!thresholds.reminderNotificationsEnabled) return [];
  const notices = [];
  const add = (condition, item) => {
    if (condition) notices.push({ time: "Now", read: false, ...item });
  };
  data.queue.slice(0, 6).forEach((token) => add(minutesSince(recordTime(token)) >= thresholds.queueWaitingMinutes, {
    title: "Queue wait threshold reached",
    message: `${token.patientName || token.patientId} has been waiting ${minutesSince(recordTime(token))} minutes in OPD queue.`,
    module: "Queue",
    category: "Queue",
    priority: minutesSince(recordTime(token)) >= thresholds.queueWaitingMinutes * 2 ? "critical" : "warning",
    route: "queue",
    patientId: token.patientId,
    time: formatDateTime(recordTime(token))
  }));
  data.labOrders.filter((order) => order.status === "Report Ready").slice(0, 6).forEach((order) => add(true, {
    title: "Lab report ready",
    message: `${order.tests || order.orderType || "Report"} is ready for doctor review.`,
    module: order.orderType || "Lab",
    category: "Lab",
    priority: "info",
    route: order.orderType === "Radiology" ? "radiology" : "lab",
    patientId: order.patientId,
    time: formatDateTime(recordTime(order))
  }));
  data.labOrders.filter((order) => isPendingStatus(order.status, ["Report Ready", "Doctor Reviewed", "Completed"])).slice(0, 8).forEach((order) => {
    const isRadiology = String(order.orderType || "").toLowerCase().includes("radiology");
    const threshold = isRadiology ? thresholds.radiologyPendingMinutes : thresholds.labPendingMinutes;
    const delay = minutesSince(recordTime(order));
    add(delay >= threshold, {
    title: `${isRadiology ? "Radiology" : "Lab"} processing delayed`,
    message: `${order.tests || order.orderType || "Report"} is pending beyond ${threshold} minutes.`,
    module: order.orderType || "Lab",
    category: isRadiology ? "Radiology" : "Lab",
    priority: severityForDelay(delay, threshold),
    route: order.orderType === "Radiology" ? "radiology" : "lab",
    patientId: order.patientId,
    mrn: order.mrn,
    delayMinutes: delay,
    assignedRole: isRadiology ? "Radiology User" : "Lab User",
    recommendedAction: isRadiology ? "Upload the radiology report or mark the report ready." : "Collect sample, upload the lab report, or mark the report ready.",
    automationKey: `report-delay-${order.id || order._id || order.patientId}-${order.orderType || "lab"}`,
    time: formatDateTime(recordTime(order))
    });
  });
  data.labOrders.filter((order) => isPendingStatus(order.status, ["Report Ready", "Doctor Reviewed", "Completed"]) && minutesSince(recordTime(order)) >= thresholds.reportUploadDelayMinutes).slice(0, 6).forEach((order) => add(true, {
    title: "Report upload delayed",
    message: `${order.tests || order.orderType || "Report"} still needs upload or ready marking.`,
    module: order.orderType || "Lab",
    category: order.orderType === "Radiology" ? "Radiology" : "Lab",
    priority: severityForDelay(minutesSince(recordTime(order)), thresholds.reportUploadDelayMinutes),
    route: order.orderType === "Radiology" ? "radiology" : "lab",
    patientId: order.patientId,
    mrn: order.mrn,
    delayMinutes: minutesSince(recordTime(order)),
    assignedRole: order.orderType === "Radiology" ? "Radiology User" : "Lab User",
    recommendedAction: "Upload the final report and mark it ready for doctor review.",
    automationKey: `report-upload-delay-${order.id || order._id || order.patientId}`
  }));
  data.pharmacyIssues.filter((issue) => issue.status !== "Issued").slice(0, 6).forEach((issue) => add(minutesSince(recordTime(issue)) >= thresholds.pharmacyPendingMinutes, {
    title: "Prescription pending issue",
    message: `${issue.patientName || issue.patientId} has medicines pending beyond ${thresholds.pharmacyPendingMinutes} minutes.`,
    module: "Pharmacy",
    category: "Pharmacy",
    priority: "warning",
    route: "pharmacy",
    patientId: issue.patientId,
    time: formatDateTime(recordTime(issue))
  }));
  data.bills.filter((bill) => bill.status !== "Paid").slice(0, 6).forEach((bill) => add(minutesSince(recordTime(bill)) >= thresholds.billingPendingMinutes, {
    title: "Bill unpaid",
    message: `${bill.patientName || bill.patientId} has a pending bill beyond ${thresholds.billingPendingMinutes} minutes.`,
    module: "Billing",
    category: "Billing",
    priority: "warning",
    route: "billing",
    patientId: bill.patientId,
    time: formatDateTime(recordTime(bill))
  }));
  safeOptionalData(() => permitted("mar") ? api.medicationAdministrationRecords(currentUser) : [], []).filter((item) => item.status === "Scheduled").slice(0, 6).forEach((item) => add(minutesSince(item.scheduledTime || item.createdAt) >= thresholds.marDueMinutes, {
    title: "MAR dose pending",
    message: `${item.medicineName || item.drugName || "Medication"} is due or overdue for administration.`,
    module: "MAR",
    category: "Clinical",
    priority: "warning",
    route: "mar",
    patientId: item.patientId,
    admissionId: item.admissionId,
    time: formatDateTime(item.scheduledTime || item.createdAt)
  }));
  data.dischargePlans.filter((plan) => plan.status !== "Ready for Discharge").slice(0, 4).forEach((plan) => add(minutesSince(recordTime(plan)) >= thresholds.dischargeClearanceMinutes, {
    title: "Discharge clearance pending",
    message: `Admission ${plan.admissionId || plan.patientId} still needs department clearance after ${thresholds.dischargeClearanceMinutes} minutes.`,
    module: "Discharge",
    category: "Discharge",
    priority: severityForDelay(minutesSince(recordTime(plan)), thresholds.dischargeClearanceMinutes),
    route: "discharge",
    admissionId: plan.admissionId,
    patientId: plan.patientId,
    delayMinutes: minutesSince(recordTime(plan)),
    assignedRole: "Discharge Team",
    recommendedAction: "Review doctor, nursing, pharmacy, billing, document, and summary clearances.",
    automationKey: `discharge-delay-${plan.id || plan.admissionId || plan.patientId}`
  }));
  data.deathSummaries.filter((summary) => ["Submitted", "Submitted for Review"].includes(summary.status)).slice(0, 4).forEach((summary) => add(true, {
    title: "Death Summary waiting for approval",
    message: `${summary.patientName || summary.admissionId} requires clinical review.`,
    module: "Death Summary",
    category: "Clinical",
    priority: "critical",
    route: "ipdPatient360",
    admissionId: summary.admissionId
  }));
  data.documents.filter((doc) => isToday(doc.createdAt || doc.uploadedAt)).slice(0, 5).forEach((doc) => add(true, {
    title: "Document uploaded",
    message: `${doc.originalFilename || doc.fileName || doc.documentType} was added.`,
    module: "Documents",
    category: "Documents",
    priority: "info",
    route: "documents",
    time: formatDateTime(doc.createdAt || doc.uploadedAt)
  }));
  data.users.filter((user) => Number(user.sensitivePermissionsCount || 0) > 0 || String(user.reviewStatus || "").includes("Required")).slice(0, 5).forEach((user) => add(true, {
    title: "Permission review needed",
    message: `${user.name || user.email} has sensitive or pending access review.`,
    module: "Governance",
    category: "Permission",
    priority: "warning",
    route: "accessReview"
  }));
  const providers = data.providers ? [data.providers.mongodb, data.providers.email, data.providers.storage, data.providers.sentry, data.providers.betterStack].filter(Boolean) : [];
  providers.forEach((provider) => add(/error|not configured/i.test(provider.status || ""), {
    title: "Provider attention needed",
    message: `${provider.name || "Provider"} is ${provider.status || "not configured"}.`,
    module: "Providers",
    category: "System",
    priority: "critical",
    route: "backup"
  }));
  data.documents.filter((doc) => minutesSince(recordTime(doc)) >= thresholds.documentReadinessMinutes && /pending|draft|missing/i.test(doc.status || doc.readinessStatus || "")).slice(0, 4).forEach((doc) => add(true, {
    title: "Document readiness delayed",
    message: `${doc.documentType || doc.originalFilename || "Document"} needs completion or readiness review.`,
    module: "Documents",
    category: "Documents",
    priority: severityForDelay(minutesSince(recordTime(doc)), thresholds.documentReadinessMinutes),
    route: "documents",
    patientId: doc.patientId,
    admissionId: doc.admissionId,
    delayMinutes: minutesSince(recordTime(doc)),
    assignedRole: "Documents Owner",
    recommendedAction: "Upload the missing file, finalize the draft, or mark the document ready.",
    automationKey: `document-readiness-${doc.id || doc._id || doc.patientId || doc.admissionId}`
  }));
  const checklist = goLiveChecklistForScope();
  if (checklist?.items?.length) {
    checklist.items.filter((item) => !item.completed && item.critical !== false).slice(0, 5).forEach((item) => add(true, {
      title: "Go-live checklist gap",
      message: `${item.label || "Checklist item"} is not complete.`,
      module: "Go-live",
      category: "System",
      priority: "high",
      route: "setup",
      assignedRole: currentUser.role === ROLES.SUPER_ADMIN ? "Super Admin" : currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital Admin" : "Branch Admin",
      recommendedAction: item.action || "Open the go-live checklist and complete the required item.",
      automationKey: `go-live-gap-${item.key || item.label}`
    }));
  }
  return notices;
}

function automationAlerts(data = deriveOperationalData()) {
  return deriveNotifications(data)
    .filter((item) => ["medium", "high", "critical", "warning"].includes(String(item.priority || "").toLowerCase()))
    .map((item) => ({
      patient: patientName(data.patients, item.patientId, item.patientId || item.admissionId || "-"),
      mrn: item.mrn || data.patients.find((patient) => String(patient.id) === String(item.patientId))?.mrn || "-",
      module: item.module || item.category || "Operations",
      branch: item.branchName || data.branches.find((branch) => String(branch.id) === String(item.branchId || currentUser.branchId))?.name || currentUser.branchName || "Current scope",
      status: item.title || "Needs attention",
      delay: item.delayMinutes !== undefined ? delayLabel(item.delayMinutes) : "Now",
      recommendedAction: item.recommendedAction || item.message || "Review the linked workflow.",
      assignedRole: item.assignedRole || "Responsible team",
      severity: String(item.priority || "medium").toLowerCase(),
      route: item.route || "alerts",
      patientId: item.patientId,
      admissionId: item.admissionId
    }));
}

function automationList(title, subtitle, items = [], emptyMessage = "No pending work is visible for your role.", options = {}) {
  const { group = false, showMessage = false } = options;
  let list = items;
  if (group) {
    const grouped = new Map();
    for (const item of items) {
      const key = `${item.title}|${item.module || ""}`;
      if (grouped.has(key)) grouped.get(key).count += 1;
      else grouped.set(key, { ...item, count: 1 });
    }
    list = [...grouped.values()];
  }
  const totalLabel = group ? `${list.length} type${list.length === 1 ? "" : "s"}` : `${items.length} visible`;
  return `
    <section class="panel automation-panel">
      <div class="panel-head">
        <div><h3>${escapeHtml(title)}</h3>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}</div>
        <span class="badge ${list.length ? "risk-medium" : "status-active"}">${escapeHtml(totalLabel)}</span>
      </div>
      ${list.length ? `<div class="automation-list">${list.slice(0, 8).map((item) => {
        const count = item.count || 1;
        const meta = count > 1
          ? `${item.module || "Alerts"} · ${count} items need attention`
          : (showMessage && item.message ? item.message : [item.module, item.assignedTo, item.due].filter(Boolean).join(" / "));
        return `
        <button class="automation-card" type="button" data-route="${escapeHtml(item.route || "tasks")}" ${item.patientId ? `data-patient-id="${escapeHtml(item.patientId)}"` : ""} ${item.admissionId ? `data-admission-id="${escapeHtml(item.admissionId)}"` : ""}>
          <span class="card-top"><span class="badge ${riskClass(item.priority || "Medium")}">${escapeHtml(item.priority || item.module || "Task")}</span>${count > 1 ? `<span class="badge count-badge">×${count}</span>` : ""}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(meta)}</small>
        </button>`;
      }).join("")}</div>` : emptyState(emptyMessage)}
    </section>
  `;
}

function automationAlertsPanel(alerts = []) {
  return `
    <section class="panel wide" data-testid="automation-alert-table">
      <div class="panel-head">
        <h3>Escalation and Delay Alerts</h3>
        <span class="badge ${alerts.length ? "risk-high" : "status-active"}">${alerts.length} active</span>
      </div>
      ${alerts.length ? table(["Patient / Ref", "MRN", "Module", "Branch", "Status", "Delay", "Owner", "Severity", "Recommended action"], alerts.slice(0, 12).map((alert) => [
        alert.patient,
        alert.mrn,
        alert.module,
        alert.branch,
        alert.status,
        alert.delay,
        alert.assignedRole,
        badge(alert.severity, riskClass(alert.severity)),
        alert.recommendedAction
      ])) : emptyState("No threshold alerts are active for your visible scope.")}
    </section>
  `;
}

function permissionRiskAlerts(users = []) {
  const alerts = [];
  users.forEach((user) => {
    const text = `${user.jobRole || ""} ${user.allowedModules || ""} ${user.allowedPages || ""}`.toLowerCase();
    const inactiveDays = user.lastLogin ? Math.floor((Date.now() - new Date(user.lastLogin).getTime()) / 86400000) : null;
    if (inactiveDays !== null && inactiveDays >= 30) alerts.push([user, "Inactive for 30+ days", "Review whether access is still required."]);
    if (Number(user.sensitivePermissionsCount || 0) > 0) alerts.push([user, "High-risk permission", "Confirm sensitive actions and export rights."]);
    if (text.includes("doctor") && text.includes("billing")) alerts.push([user, "Doctor has billing access", "Separate clinical and billing admin duties where possible."]);
    if (text.includes("billing") && text.includes("admin")) alerts.push([user, "Billing user has admin access", "Review elevated access before next audit."]);
    if (String(user.branchName || "").toLowerCase().includes("multiple") || text.includes("cross-branch")) alerts.push([user, "Cross-branch access", "Confirm this user requires multi-branch visibility."]);
  });
  return alerts;
}

function permissionRiskPanel(users = []) {
  const alerts = permissionRiskAlerts(users);
  return `
    <section class="panel">
      <div class="panel-head"><h3>Permission Review Automation</h3><p>Advisory governance alerts only. No permission is changed automatically.</p></div>
      ${alerts.length ? table(["User", "Risk", "Recommended action"], alerts.slice(0, 12).map(([user, risk, action]) => [
        user.name || user.email,
        badge(risk, risk.includes("High") || risk.includes("Cross") ? "risk-high" : "risk-medium"),
        action
      ])) : emptyState("No risky permission patterns are visible for this scope.")}
    </section>
  `;
}

function roleSmartCards(data = deriveOperationalData()) {
  const jobRole = String(currentUser.jobRole || "");
  if (currentUser.role === ROLES.SUPER_ADMIN) {
    const dashboard = normalizeDashboardData(api.dashboard(currentUser));
    return [
      ["Total hospitals", dashboard.metrics.totalHospitals, "Platform customers"],
      ["Active hospitals", dashboard.metrics.activeHospitals, "Live tenants"],
      ["Subscription status", `${dashboard.hospitals.filter((h) => h.plan).length} assigned`, "Plans configured"],
      ["Provider health", deriveNotifications(data).filter((n) => n.module === "Providers").length ? "Needs review" : "Connected", "MongoDB/R2/email/observability"],
      ["Recent audit events", permitted("audit") ? safeOptionalData(() => api.auditLogs(currentUser)).length : 0, "Visible trail"],
      ["Governance alerts", permissionRiskAlerts(data.users).length, "Access review"]
    ];
  }
  if (currentUser.role === ROLES.HOSPITAL_ADMIN) {
    return [
      ["Hospital overview", data.branches.length, "Branches visible"],
      ["IPD overview", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active admissions"],
      ["Finance summary", data.bills.filter((b) => b.status !== "Paid").length, "Pending bills"],
      ["Compliance", permissionRiskAlerts(data.users).length, "Access reviews"],
      ["Reports", data.labOrders.length + data.dischargePlans.length, "Clinical signals"],
      ["Branch performance", setupPercent(), "Setup complete"]
    ];
  }
  if (currentUser.role === ROLES.BRANCH_ADMIN) {
    return [
      ["Appointments", data.appointments.filter((a) => isToday(a.date || a.createdAt)).length || data.appointments.length, "Booked"],
      ["Admissions", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active IPD"],
      ["Billing pending", data.bills.filter((b) => b.status !== "Paid").length, "Needs collection"],
      ["Stock alerts", safeOptionalData(() => permitted("stock") ? api.medicineStocks(currentUser) : []).filter((s) => Number(s.quantityAvailable || s.quantity || 0) <= Number(s.reorderLevel || 0)).length, "Low stock"],
      ["Daily IPD report", data.dischargePlans.length, "Discharge watch"],
      ["Bed occupancy", data.beds.length ? `${Math.round((data.beds.filter((bed) => bed.status === "Occupied").length / data.beds.length) * 100)}%` : "0%", "Current"]
    ];
  }
  if (jobRole.includes("Reception")) return [
    ["Today's appointments", data.appointments.filter((a) => isToday(a.date || a.createdAt)).length || data.appointments.length, "Booked"],
    ["Walk-ins", data.appointments.filter((a) => String(a.source || "").includes("Walk")).length, "Arrivals"],
    ["Pending check-ins", data.appointments.filter((a) => ["Booked", "Active"].includes(a.status || "Active")).length, "Reception"],
    ["OPD queue", data.queue.length, "Waiting"],
    ["Recent patients", data.patients.slice(0, 20).length, "Registered"]
  ];
  if (jobRole.includes("Duty Doctor")) return [
    ["Emergency cases", data.alerts.filter((alert) => ["Critical", "High"].includes(alert.risk || alert.priority)).length, "Escalated"],
    ["IPD patients", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active"],
    ["IPD vitals pending", safeOptionalData(() => permitted("ipdVitals") ? api.ipdVitals(currentUser) : []).filter((v) => v.status === "Abnormal").length, "Review"],
    ["Discharge pending", data.dischargePlans.filter((p) => p.status !== "Ready for Discharge").length, "Clearances"],
    ["Handover pending", safeOptionalData(() => permitted("handover") ? api.doctorHandovers(currentUser) : []).filter((h) => h.status !== "Accepted").length, "Shift"]
  ];
  if (jobRole.includes("Doctor")) return [
    ["Waiting patients", data.queue.length, "Doctor queue"],
    ["Vitals completed", data.vitals.length, "Ready"],
    ["Pending consultations", Math.max(data.queue.length - data.consultations.length, 0), "To complete"],
    ["Reports ready", data.labOrders.filter((o) => o.status === "Report Ready").length, "Review"],
    ["IPD assigned", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Active"]
  ];
  if (jobRole.includes("Nurse")) return [
    ["Waiting vitals", deriveTasks(data).filter((t) => t.module === "Vitals").length, "To record"],
    ["Assigned IPD patients", data.admissions.filter((a) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(a))).length, "Under care"],
    ["Pending MAR", safeOptionalData(() => permitted("mar") ? api.medicationAdministrationRecords(currentUser) : []).filter((m) => m.status === "Scheduled").length, "Due"],
    ["Intake/output pending", data.admissions.length, "Review"],
    ["Daily sheets due", safeOptionalData(() => permitted("dailySheets") ? api.dailyPatientSheets(currentUser) : []).filter((s) => !["Nurse Updated", "Completed", "Verified"].includes(s.status)).length, "Today"],
    ["My tasks", deriveTasks(data).length, "Visible"]
  ];
  if (jobRole.includes("Lab") || jobRole.includes("Radiology")) return [
    ["Pending lab orders", data.labOrders.filter((o) => isPendingStatus(o.status, ["Report Ready", "Doctor Reviewed"])).length, "Open"],
    ["Samples pending", data.labOrders.filter((o) => /sample|ordered|pending/i.test(o.status || "")).length, "Collection"],
    ["Reports pending upload", data.labOrders.filter((o) => o.status !== "Report Ready").length, "Documents"],
    ["Completed today", data.labOrders.filter((o) => o.status === "Report Ready" && isToday(recordTime(o))).length, "Ready"]
  ];
  if (jobRole.includes("Pharmacy")) return [
    ["Pending prescriptions", data.pharmacyIssues.filter((i) => i.status !== "Issued").length, "Issue"],
    ["Medicines pending issue", data.pharmacyIssues.filter((i) => i.status !== "Issued").length, "Queue"],
    ["Low stock alerts", safeOptionalData(() => permitted("stock") ? api.medicineStocks(currentUser) : []).filter((s) => Number(s.quantityAvailable || 0) <= Number(s.reorderLevel || 0)).length, "Inventory"],
    ["Issued today", data.pharmacyIssues.filter((i) => i.status === "Issued" && isToday(recordTime(i))).length, "Done"]
  ];
  if (jobRole.includes("Billing")) return [
    ["Unpaid bills", data.bills.filter((b) => b.status !== "Paid").length, "Collect"],
    ["Pending payments", data.bills.filter((b) => b.status !== "Paid").length, "Open"],
    ["IPD clearances", data.dischargePlans.filter((p) => !p.billingClearance).length, "Discharge"],
    ["Charges pending", deriveBillingSuggestions(data).length, "Review"]
  ];
  return [
    ["My tasks", deriveTasks(data).length, "Visible"],
    ["Notifications", deriveNotifications(data).length, "Unread signals"],
    ["Patients", data.patients.length, "Scope"],
    ["Open bills", data.bills.filter((b) => b.status !== "Paid").length, "Billing"]
  ];
}

function setupPercent() {
  const progress = safeOptionalData(() => permitted("setup") ? api.setupProgress(currentUser)[0] : null, null);
  return `${inferredSetupProgress(progress || {}).percent}%`;
}

function roleDashboardPanel(data = deriveOperationalData()) {
  const cards = roleSmartCards(data);
  return `
    <section class="panel wide">
      <div class="panel-head"><h3>Today's Work</h3></div>
      <div class="metric-grid small">
        ${cards.map(([label, value, note]) => metricCard(label, value ?? 0, note)).join("")}
      </div>
    </section>
  `;
}

function missingDocumentAlerts({ documents = [], admission = null, patient = null, deathSummary = null, labOrders = [], bills = [] } = {}) {
  const hasType = (type) => documents.some((doc) => String(doc.documentType || doc.type || "").toLowerCase() === type);
  const alerts = [];
  if (admission && !hasType("consent")) alerts.push(["Consent form missing", "Upload consent before major procedures or discharge readiness review."]);
  if (patient?.insurance && !hasType("insurance")) alerts.push(["Insurance paper missing", "Claims may be delayed without insurance documents."]);
  if (admission && ["Discharged", "Ready for Discharge"].includes(ipdAdmissionStatus(admission)) && !hasType("discharge-summary")) alerts.push(["Discharge summary not attached", "Attach the final approved discharge summary."]);
  if (isDeathOutcome(admission || {}) && (!deathSummary || deathSummary.status !== "Approved")) alerts.push(["Death summary not approved", "Complete the reviewed death summary before final export."]);
  if (labOrders.some((order) => order.status === "Report Ready") && !documents.some((doc) => ["lab-report", "radiology-report"].includes(doc.documentType))) alerts.push(["Lab report pending upload", "Attach report documents after report readiness."]);
  if (bills.some((bill) => bill.status === "Paid") && !hasType("billing-document")) alerts.push(["Billing document missing", "Upload bill or receipt document for the patient file."]);
  return alerts;
}

function documentAlertsPanel(alerts = []) {
  return `
    <section class="panel">
      <div class="panel-head"><h3>Missing Document Alerts</h3><p>Advisory checks from visible document metadata.</p></div>
      ${alerts.length ? `<div class="alert-list">${alerts.map(([title, message]) => `
        <div class="alert-card compact-alert">
          <div>${badge("Missing", "risk-medium")}<h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>
          ${canAccessPage(currentUser, "documents") ? `<button class="button tiny soft" type="button" data-route="documents">Open documents</button>` : ""}
        </div>
      `).join("")}</div>` : emptyState("No required document gaps are visible for this scope.")}
    </section>
  `;
}

function deriveBillingSuggestions(data = deriveOperationalData()) {
  const suggestions = [];
  data.consultations.forEach((item) => {
    const amount = Number(item.consultationFee || 0) + Number(item.labCharges || 0) + Number(item.radiologyCharges || 0) + Number(item.pharmacyAmount || 0);
    if (amount > 0) suggestions.push({ source: "Consultation", patientId: item.patientId, patientName: patientName(data.patients, item.patientId, item.patientId), item: item.diagnosis || "OPD consultation", amount });
  });
  data.labOrders.filter((item) => item.status !== "Billed").forEach((item) => suggestions.push({ source: item.orderType || "Lab", patientId: item.patientId, patientName: patientName(data.patients, item.patientId, item.patientId), item: item.tests || "Investigation", amount: Number(item.amount || item.charges || 0) }));
  data.pharmacyIssues.filter((item) => item.status === "Issued").forEach((item) => suggestions.push({ source: "Pharmacy", patientId: item.patientId, patientName: item.patientName || patientName(data.patients, item.patientId, item.patientId), item: item.medicines || "Medicines", amount: Number(item.amount || 0) }));
  data.admissions.filter((item) => !["Discharged", "Cancelled"].includes(ipdAdmissionStatus(item))).forEach((item) => suggestions.push({ source: "IPD", patientId: admissionPatientId(item), patientName: item.patientName || admissionPatientId(item), item: `${item.ward || "Ward"} bed charges`, amount: Number(item.bedCharges || 0) }));
  return suggestions.filter((item) => Number(item.amount || 0) >= 0).slice(0, 12);
}

function smartBillingDraftPanel(data = deriveOperationalData()) {
  const suggestions = deriveBillingSuggestions(data);
  return `
    <section class="panel">
      <div class="panel-head"><h3>Smart Billing Draft</h3><p>Suggested charges from visible workflow records. Billing staff must review and generate the final bill.</p></div>
      ${suggestions.length ? table(["Patient", "Source", "Suggested item", "Amount"], suggestions.map((item) => [
        item.patientName,
        item.source,
        item.item,
        `Rs. ${money(item.amount)}`
      ])) : emptyState("No unbilled workflow charges are visible right now.")}
      <div class="notice subtle">Suggestions are draft-only and never finalized without a billing user action.</div>
    </section>
  `;
}

function queueDelayAlerts(queue = [], vitals = [], consultations = [], bills = []) {
  const alerts = [];
  queue.forEach((token) => {
    const wait = Number(token.waitingMinutes ?? minutesSince(recordTime(token)) ?? 0);
    const patient = token.patientName || token.patientId;
    const hasVitals = vitals.some((item) => String(item.patientId) === String(token.patientId));
    const hasConsultation = consultations.some((item) => String(item.patientId) === String(token.patientId));
    const billPending = bills.some((item) => String(item.patientId) === String(token.patientId) && item.status !== "Paid");
    if (wait > 30 && !hasConsultation) alerts.push(["Patient waiting more than 30 minutes", `${patient} has waited ${wait} minutes.`, "High", "queue", token.patientId]);
    if (wait > 15 && !hasVitals) alerts.push(["Vitals pending more than 15 minutes", `${patient} needs vitals before doctor review.`, "Medium", "vitals", token.patientId]);
    if (billPending) alerts.push(["Billing pending too long", `${patient} has a pending payment before checkout.`, "Medium", "billing", token.patientId]);
  });
  if (queue.filter((token) => !consultations.some((item) => String(item.patientId) === String(token.patientId))).length > 8) {
    alerts.push(["Doctor queue overloaded", "More than 8 patients are waiting for consultation.", "High", "consultation", ""]);
  }
  return alerts;
}

function queueDelayPanel(alerts = []) {
  return `
    <section class="panel">
      <div class="panel-head"><h3>Smart Queue Delay Alerts</h3><p>Advisory queue signals based on visible timestamps and waiting minutes.</p></div>
      ${alerts.length ? `<div class="alert-list">${alerts.map(([title, message, risk, route, patientId]) => `
        <div class="alert-card compact-alert">
          <div>${badge(risk, riskClass(risk))}<h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>
          ${canAccessPage(currentUser, route) ? `<button class="button tiny soft" type="button" data-route="${escapeHtml(route)}" ${patientId ? `data-patient-id="${escapeHtml(patientId)}"` : ""}>Open</button>` : ""}
        </div>
      `).join("")}</div>` : emptyState("No queue delay alerts are visible right now.")}
    </section>
  `;
}

function receptionDashboardPage(data = deriveOperationalData()) {
  const today = localDateInputValue();
  const appointments = data.appointments.filter((item) => String(item.date || item.appointmentDate || "").slice(0, 10) === today);
  const queue = data.queue.filter((item) => !["Completed", "Cancelled"].includes(item.status));
  const registeredToday = data.patients.filter((item) => String(item.createdAt || "").slice(0, 10) === today);
  const cards = [
    ["Today's Appointments", appointments.length, "appointments"],
    ["Waiting Patients", queue.length, "queue"],
    ["Walk-in Patients", appointments.filter((item) => /walk/i.test(item.visitType || item.source || "")).length, "appointments"],
    ["New Registrations", registeredToday.length, "patients"],
    ["Pending Appointments", appointments.filter((item) => ["Booked", "Scheduled", "Pending"].includes(item.status)).length, "appointments"]
  ];
  return `<div class="reception-dashboard">
    <div class="section-head reception-heading"><div><h2>Reception Dashboard</h2><p>Manage today's essential reception work.</p></div></div>
    <div class="metric-grid reception-kpis">${cards.map(([label, value, route]) => `<button class="metric-card metric-link" type="button" data-route="${route}"><span class="reception-kpi-icon">${navIcon(route)}</span><span>${escapeHtml(label)}</span><strong>${value}</strong><small>View records</small></button>`).join("")}</div>
    <section class="reception-quick-actions" aria-labelledby="reception-quick-actions-title">
      <h3 id="reception-quick-actions-title">Quick Actions</h3>
      <div class="reception-action-grid">
        <button class="reception-action" type="button" data-action="open-create" data-form-action="register-patient"><span>${actionIcon("register")}</span><strong>Enroll Patient</strong></button>
        <button class="reception-action" type="button" data-action="open-create" data-form-action="create-appointment"><span>${actionIcon("book")}</span><strong>Book Appointment</strong></button>
        <button class="reception-action" type="button" data-action="open-create" data-form-action="create-admission"><span>${actionIcon("new")}</span><strong>New Admission</strong></button>
        <button class="reception-action" type="button" data-action="open-create" data-form-action="generate-bill"><span>${actionIcon("bill")}</span><strong>Create Invoice</strong></button>
      </div>
    </section>
  </div>`;
}

function billingFocusedDashboardPage(data = deriveOperationalData()) {
  const today = localDateInputValue();
  const bills = data.bills;
  const todayBills = bills.filter((item) => String(item.createdAt || item.invoiceDate || "").slice(0, 10) === today);
  const payments = data.payments || [];
  const todayPayments = payments.filter((item) => String(item.createdAt || "").slice(0, 10) === today);
  const pending = bills.filter((item) => !["Paid", "Refunded"].includes(item.status));
  const refunded = bills.filter((item) => item.status === "Refunded" && String(item.updatedAt || item.createdAt || "").slice(0, 10) === today);
  const cards = [["Today's Invoices", todayBills.length, "billing"], ["Today's Collection", `Rs. ${money(todayPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0))}`, "payments"], ["Pending Amount", `Rs. ${money(pending.reduce((sum, item) => sum + Math.max(0, Number(item.totalAmount || 0) - Number(item.paidAmount || 0)), 0))}`, "billing"], ["Paid Invoices", bills.filter((item) => item.status === "Paid").length, "billing"], ["Pending Bills", pending.length, "billing"], ["Refunds Today", refunded.length, "refunds"]];
  return `<div class="billing-dashboard"><div class="section-head"><div><h2>Billing Dashboard</h2><p>Create invoices, collect payments and review billing history.</p></div><button class="button primary" data-action="open-create" data-form-action="generate-bill">Create Invoice</button></div>
    <div class="metric-grid reception-kpis">${cards.map(([label, value, route]) => `<button class="metric-card metric-link" type="button" data-route="${route}"><span>${escapeHtml(label)}</span><strong>${value}</strong><small>Open records</small></button>`).join("")}</div>
    <section class="panel"><div class="panel-head"><div><h3>Billing Actions</h3><p>Find patient → add charges → generate invoice → collect payment.</p></div></div><div class="billing-action-grid"><button class="action-tile primary-tile" data-action="open-create" data-form-action="generate-bill"><strong>Create Invoice</strong><small>Start a patient invoice</small></button><button class="action-tile" data-route="billing"><strong>Pending Bills</strong><small>Outstanding balances</small></button><button class="action-tile" data-route="billing"><strong>Paid Bills</strong><small>Completed invoices</small></button><button class="action-tile" data-route="payments"><strong>Payment Collection</strong><small>Cash, card, UPI and split</small></button><button class="action-tile" data-route="refunds"><strong>Refunds</strong><small>Refund history</small></button><button class="action-tile" data-route="billing-search"><strong>Invoice History</strong><small>Search every invoice</small></button></div></section></div>`;
}

function dashboardPage() {
  const operationalData = deriveOperationalData();
  const jobRole = String(currentUser.jobRole || "").toLowerCase();
  if (jobRole.includes("reception")) return receptionDashboardPage(operationalData);
  if (jobRole.includes("billing")) return billingFocusedDashboardPage(operationalData);
  const data = normalizeDashboardData(api.dashboard(currentUser));
  const patientVolumeSeries = dateSeriesFromRows(
    [...operationalData.appointments, ...operationalData.admissions],
    () => 1,
    (row) => row.date || row.createdAt || row.admissionDateTime || row.updatedAt
  );
  const m = data.metrics;
  const role = currentUser.role;
  const title =
    role === ROLES.SUPER_ADMIN ? "Platform health and hospital risk" :
    role === ROLES.HOSPITAL_ADMIN ? "Hospital group operations" :
    role === ROLES.BRANCH_ADMIN ? "Branch operations today" :
    "My work and assigned records";

  const cards = role === ROLES.SUPER_ADMIN
    ? [
        ["Total Hospitals", m.totalHospitals, "Active: " + m.activeHospitals],
        ["Total Branches", m.totalBranches, "Across platform"],
        ["Total Users", m.totalUsers, "All accounts"],
        ["Uploaded Records", m.uploadedRecords, "Tenant-scoped"],
        ["Storage Used", formatGb(m.storageUsedGb), "Across hospitals"],
        ["Critical Alerts", m.criticalAlerts, "Needs support review"]
      ]
    : [
        ["Today Appointments", m.todayAppointments, "Booked and arrived"],
        ["Waiting Patients", m.waitingPatients, "Queue now"],
        ["In Consultation", m.inConsultation, "With doctor"],
        ["Pending Bills", m.pendingBills, "Needs collection"],
        ["Pharmacy Pending", m.pharmacyPending, "Prescriptions"],
        ["Lab Reports Pending", m.labReportsPending, "Orders in progress"],
        ["Patient Volume", money(m.patientVolume), "Today"],
        ["Average Wait Time", `${m.averageWait} min`, "Across visible records"],
        ["Bed Occupancy", `${m.bedOccupancy}%`, "Current"],
        ["Staff Utilization", `${m.staffUtilization}%`, "Roster load"],
        ["Open Alerts", m.openAlerts, "Operational risk"],
        ["Overdue Tasks", m.overdueTasks, "Needs action"]
      ];

  return `
    <div class="section-head">
      <div>
        <h2>${title}</h2>
      </div>
      <div class="filter-row compact">
        <select><option>Last 30 days</option><option>Today</option><option>This week</option></select>
        <select><option>All departments</option><option>Emergency</option><option>OPD</option><option>ICU</option></select>
      </div>
    </div>
    <div class="metric-grid">
      ${cards.map(([label, value, note]) => metricCard(label, value, note)).join("")}
    </div>
    ${roleDashboardPanel(operationalData)}
    ${automationAlertsPanel(automationAlerts(operationalData))}
    <div class="dashboard-grid compact-dashboard">
      ${attentionPanel(data)}
      ${quickActionsPanel(role)}
    </div>
    <div class="dashboard-grid compact-dashboard">
      <div data-testid="role-work-queue">
        ${automationList("Role-Based Work Queue", "", roleWorkQueue(operationalData))}
      </div>
      ${automationList("Smart Notifications", "", deriveNotifications(operationalData), "No notifications are visible for your role right now.", { group: true, showMessage: true })}
    </div>
    <div class="dashboard-grid">
      <section class="panel wide">
        <div class="panel-head">
          <h3>Patient volume and wait time trend</h3>
          <span class="badge status-active">Live</span>
        </div>
        ${trendChart(
          patientVolumeSeries.values.length ? patientVolumeSeries.values : [Math.max(Number(m.patientVolume || 0), 0)],
          patientVolumeSeries.labels.length ? patientVolumeSeries.labels : [localDateKey().slice(5)]
        )}
      </section>
      <section class="panel">
        <div class="panel-head"><h3>Risk summary</h3></div>
        ${riskSummary(data.alerts)}
      </section>
      <section class="panel">
        <div class="panel-head"><h3>Task status</h3></div>
        ${taskStatus(data.tasks)}
      </section>
      <section class="panel wide">
        <div class="panel-head">
          <h3>${role === ROLES.SUPER_ADMIN ? "High-risk hospitals" : "Branch comparison"}</h3>
          <button class="button small" type="button" data-route="${role === ROLES.SUPER_ADMIN ? "hospitals" : "branches"}">View details</button>
        </div>
        ${comparisonTable(data)}
      </section>
    </div>
  `;
}

function attentionPanel(data) {
  const items = [
    ["Critical alerts", data.alerts.filter((alert) => ["Critical", "High"].includes(alert.risk)).length, "alerts", "Review now"],
    ["Billing pending", data.metrics.pendingBills, "billing", "Collect payment"],
    ["Lab reports pending", data.metrics.labReportsPending, "lab", "Follow up"],
    ["Low stock / pharmacy", data.metrics.pharmacyPending, "pharmacy", "Issue or restock"],
    ["Overdue tasks", data.metrics.overdueTasks, "tasks", "Assign owner"]
  ].filter(([, value]) => Number(value) > 0);
  return `
    <section class="panel attention-panel">
      <div class="panel-head">
        <h3>What needs attention</h3>
      </div>
      ${items.length ? `<div class="attention-list">${items.map(([label, value, route, action]) => `
        <button class="attention-item" type="button" data-route="${route}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(action)}</small>
        </button>
      `).join("")}</div>` : emptyState("Nothing urgent right now. Operations look healthy for your visible scope.")}
    </section>
  `;
}

function quickActionsPanel(role) {
  const jobRole = String(currentUser.jobRole || "");
  const branchUserActions =
    jobRole.includes("Reception") ? [["Register Patient", "patients"], ["Book Appointment", "appointments"], ["Check In Patient", "queue"], ["Billing before checkout", "billing"], ["Search Patient", "globalSearch"]] :
    jobRole.includes("Duty Doctor") ? [["Open Duty Doctor", "dutyDoctor"], ["Record IPD Vitals", "ipdVitals"], ["Add Doctor Note", "dutyDoctor"], ["Start Discharge Planning", "discharge"], ["Open Handover", "handover"]] :
    jobRole.includes("Doctor") ? [["Start Consultation", "consultation"], ["Add Prescription", "consultation"], ["Order Lab", "lab"], ["Order Radiology", "radiology"], ["Request Admission", "admissions"], ["Start Discharge Planning", "discharge"], ["Follow-ups", "followups"]] :
    jobRole.includes("Nurse") ? [["Record Vitals", "ipdVitals"], ["Mark MAR Given", "mar"], ["Add Nursing Note", "nursing"], ["Add Handover", "handover"], ["Record Intake/Output", "intakeOutput"], ["View My Tasks", "tasks"]] :
    jobRole.includes("Billing") ? [["Generate Bill", "billing"], ["Collect Payment", "billing"], ["Mark Billing Clearance", "discharge"], ["Print Receipt", "billing"], ["Checkout", "checkout"]] :
    jobRole.includes("Pharmacy") ? [["Issue Medicine", "pharmacy"], ["Mark Unavailable", "pharmacy"], ["Raise Stock-Low Alert", "stock"], ["View Low Stock", "stock"], ["Open Stock", "stock"]] :
    jobRole.includes("Lab") ? [["Mark Sample Collected", "lab"], ["Upload Report", "lab"], ["Mark Report Ready", "lab"], ["Pending Orders", "lab"]] :
    jobRole.includes("Radiology") ? [["Open Radiology Orders", "radiology"], ["Upload Report", "radiology"], ["Mark Report Ready", "radiology"]] :
    jobRole.includes("Claim") ? [["Review Claim Documents", "claims"], ["Pending Claims", "claims"], ["Open Documents", "documents"]] :
    jobRole.includes("Inventory") ? [["Open Stock", "stock"], ["Inventory", "inventory"], ["Purchase Requests", "purchase"], ["Alerts", "alerts"]] :
    jobRole.includes("Quality") || jobRole.includes("Incident") ? [["Feedback", "feedback"], ["Incidents", "incidents"], ["Tasks", "tasks"], ["Alerts", "alerts"]] :
    [["My Work", "dashboard"], ["Tasks", "tasks"], ["Alerts", "alerts"]];
  const actionsByRole = {
    [ROLES.SUPER_ADMIN]: [["Hospitals", "hospitals"], ["Provider Health", "settings"], ["Backup Requests", "backup"], ["Subscription Plans", "subscriptions"], ["Platform Audit", "audit"]],
    [ROLES.HOSPITAL_ADMIN]: [["Open IPD Overview", "ipd"], ["Open Reports", "reports"], ["Open Finance", "finance"], ["Open Compliance", "compliance"]],
    [ROLES.BRANCH_ADMIN]: [["Review Access", "accessReview"], ["Clone Permissions", "permissionTemplates"], ["Open Go-Live Checklist", "setup"], ["Review Branch Alerts", "alerts"], ["Admit Patient", "admissions"], ["Open Daily IPD Report", "ipdReports"]],
    [ROLES.BRANCH_USER]: branchUserActions
  };
  return `
    <section class="panel quick-panel">
      <div class="panel-head">
        <h3>Quick actions</h3>
      </div>
      <div class="quick-grid">
        ${(actionsByRole[role] || []).filter(([, route]) => canAccessPage(currentUser, route)).map(([label, route]) => `
          <button class="quick-action" type="button" data-route="${route}" aria-label="${escapeHtml(label)}">
            <span class="quick-action-icon">${navIcon(route)}</span>
            <span class="quick-action-copy">
              <strong>${escapeHtml(label)}</strong>
              <small>${escapeHtml(actionIcon(label))}</small>
            </span>
            <span class="quick-action-arrow" aria-hidden="true">↗</span>
          </button>
        `).join("") || emptyState("No quick actions assigned for this role.")}
      </div>
    </section>
  `;
}

function groupSearchResults(results = []) {
  return results.reduce((groups, item) => {
    const key = item.category || item.type || "Records";
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function searchResultRoute(item = {}) {
  const category = String(item.category || "").toLowerCase();
  if (category.includes("patient")) return { page: "patients", query: { patientId: item.patientId || item.id } };
  if (category.includes("appointment") || category.includes("opd")) return { page: "appointments", query: { patientId: item.patientId } };
  if (category.includes("admission") || category.includes("ipd")) return { page: "ipdPatient360", query: { admissionId: item.admissionId || item.id } };
  if (category.includes("bill")) return { page: "billing", query: { patientId: item.patientId } };
  if (category.includes("document")) return { page: "documents", query: { patientId: item.patientId } };
  if (category.includes("user") || category.includes("doctor")) return { page: "users", query: {} };
  if (category.includes("branch")) return { page: "branches", query: {} };
  return { page: "globalSearch", query: {} };
}

function topSearchAutocomplete() {
  if (!globalSearchQuery.trim()) return "";
  const groups = groupSearchResults(globalSearchSuggestions.slice(0, 8));
  return `
    <div class="search-popover" data-search-popover>
      ${globalSearchStatus === "loading" ? `<div class="search-state"><span class="loading-spinner" aria-hidden="true"></span><strong>Searching...</strong></div>` : ""}
      ${globalSearchStatus === "error" ? `<div class="empty compact error-state"><strong>Search failed</strong><small>${escapeHtml(globalSearchError || "Retry search.")}</small><button class="button tiny soft" type="button" data-action="retry-global-search">Retry</button></div>` : ""}
      ${globalSearchStatus !== "loading" && globalSearchStatus !== "error" && globalSearchSuggestions.length ? Object.entries(groups).map(([group, items]) => `
        <div class="search-group">
          <span class="search-group-title">${escapeHtml(group)}</span>
          ${items.map((item) => {
            const currentIndex = globalSearchSuggestions.indexOf(item);
            return `
              <button class="search-result ${currentIndex === globalSearchActiveIndex ? "active" : ""}" type="button" data-action="select-search-result" data-search-index="${currentIndex}">
                <span class="badge status-active">${escapeHtml(item.category || "Record")}</span>
                <strong>${escapeHtml(item.title || "Record")}</strong>
                <small>${escapeHtml(item.subtitle || item.detail || "")}</small>
              </button>
            `;
          }).join("")}
        </div>
      `).join("") : ""}
      ${globalSearchStatus === "ready" && !globalSearchSuggestions.length ? `<div class="empty compact"><strong>No matching records found.</strong><small>Try patient name, MRN, mobile, bill, admission, document, doctor, or branch.</small></div>` : ""}
      <button class="search-view-all" type="button" data-action="view-all-search">View all results</button>
    </div>
  `;
}

function metricCard(label, value, note) {
  const numericValue = typeof value === "number"
    ? value
    : /^-?\d+(\.\d+)?$/.test(String(value || "").trim())
      ? Number(value)
      : null;
  const key = String(label || "").toLowerCase();
  const badgeLetter = key.includes("pharmacy") ? "Rx"
    : key.includes("today appointments") ? "T"
    : key.includes("waiting") ? "W"
    : key.includes("consultation") ? "I"
    : key.includes("pending bills") ? "P"
    : key.includes("lab") ? "L"
    : key.includes("patient") ? "P"
    : key.includes("average") ? "A"
    : key.includes("bed") ? "B"
    : key.includes("staff") ? "S"
    : key.includes("alert") ? "A"
    : key.includes("task") ? "T"
    : String(label || "?").trim().charAt(0).toUpperCase() || "?";
  return `
    <article class="metric-card">
      <div class="metric-top"><span>${escapeHtml(label)}</span><i class="metric-letter" aria-hidden="true">${escapeHtml(badgeLetter)}</i></div>
      <strong ${numericValue !== null ? `data-countup="${escapeAttribute(numericValue)}"` : ""}>${escapeHtml(value)}</strong>
      <small>${escapeHtml(note)}</small>
    </article>
  `;
}

function trendChart(values, labels) {
  const safe = (values || []).map((value) => Math.max(Number(value) || 0, 0));
  if (!safe.length) return emptyState("No trend data is available yet for your scope.");
  const max = Math.max(...safe, 1);
  const cols = Math.min(Math.max(safe.length, 1), 14);
  return `
    <div class="bar-chart" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))" aria-label="Patient volume trend">
      ${safe.map((value, index) => `
        <div class="bar-item">
          <strong class="bar-value">${escapeHtml(String(value))}</strong>
          <div class="bar-track" title="${escapeHtml(String(labels[index] ?? ""))}: ${escapeHtml(String(value))}"><span style="height:${Math.max(Math.round((value / max) * 100), 6)}%"></span></div>
          <small>${escapeHtml(String(labels[index] ?? ""))}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function riskSummary(alerts) {
  const risks = ["Critical", "High", "Medium", "Low"];
  return `
    <div class="risk-list">
      ${risks.map((risk) => `
        <div>
          <span class="badge ${riskClass(risk)}">${risk}</span>
          <strong>${alerts.filter((alert) => alert.risk === risk).length}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function taskStatus(tasks) {
  const statuses = ["Open", "In Progress", "Waiting for Review", "Completed"];
  return `
    <div class="status-list">
      ${statuses.map((status) => `
        <div>
          <span>${escapeHtml(status)}</span>
          <strong>${tasks.filter((task) => task.status === status).length}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function comparisonTable(data) {
  const branches = data.branches.length ? data.branches : [{ id: currentUser?.branchId || "visible-scope", name: "Visible scope", city: "Current", status: "Active" }];
  const admissions = safeOptionalData(() => hasPermission(currentUser, "admissions", "view") ? api.admissions(currentUser) : [], []);
  const appointments = safeOptionalData(() => hasPermission(currentUser, "appointments", "view") ? api.appointments(currentUser) : [], []);
  const beds = safeOptionalData(() => hasPermission(currentUser, "beds", "view") || hasPermission(currentUser, "wards", "view") ? api.beds(currentUser) : [], []);
  return table(
    ["Branch", "City", "Patient Volume", "Wait Time", "Bed Occupancy", "Open Alerts"],
    branches.map((branch) => [
      branch.name,
      branch.city || "Multiple",
      appointments.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id)).length +
        admissions.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id)).length,
      `${Math.round(appointments
        .filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id))
        .reduce((sum, item) => sum + Number(item.waitTime || item.waitMinutes || 0), 0) / Math.max(appointments.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id)).length, 1))} min`,
      (() => {
        const branchBeds = beds.filter((item) => !branch.id || String(item.branchId || currentUser?.branchId || "") === String(branch.id));
        const occupied = branchBeds.filter((item) => String(item.status || "").toLowerCase() === "occupied").length;
        return `${branchBeds.length ? Math.round((occupied / branchBeds.length) * 100) : 0}%`;
      })(),
      data.alerts.filter((alert) => !branch.id || alert.branchId === branch.id).length
    ])
  );
}

// ===== Disabled functions (journey trackers, patient timelines, live flow board) =====
function journeyTracker() {
  return "";
}

function patientTimeline() {
  return "";
}

function opdJourneyTrackerForPatient() {
  return "";
}

function patientJourneyTimelinePanel() {
  return "";
}

function ipdJourneyTracker() {
  return "";
}

function ipdTimelinePanel() {
  return "";
}

function livePatientFlowBoard() {
  return "";
}

function patientName(patients, patientId, fallback = "Patient") {
  const patient = patients.find((item) => String(item.id) === String(patientId));
  return patient?.name || patient?.fullName || fallback || patientId || "Patient";
}

function patientOption(patient) {
  const name = patient.name || patient.fullName || "Patient";
  const mobile = patient.mobile || patient.mobileNumber || "";
  return `<option value="${escapeHtml(patient.id)}" ${String(patient.id) === String(selectedPatientId) ? "selected" : ""} data-name="${escapeHtml(name)}" data-mrn="${escapeHtml(patient.mrn || "")}" data-mobile="${escapeHtml(mobile)}" data-age="${escapeHtml(patient.age || "")}" data-gender="${escapeHtml(patient.gender || "")}" data-dob="${escapeHtml(patient.dob || "")}" data-email="${escapeHtml(patient.email || "")}" data-emergency-contact="${escapeHtml(patient.emergencyContact || "")}" data-allergies="${escapeHtml(patient.allergies || "")}">${escapeHtml(patient.mrn || "MRN pending")} - ${escapeHtml(name)}</option>`;
}

function patientLabel(patient) {
  return `${patient.mrn || "MRN pending"} - ${patient.name || patient.fullName || "Patient"}`;
}

function findPatient(patients = [], patientId = selectedPatientId) {
  return patients.find((patient) => String(patient.id) === String(patientId));
}

function patientStickyHeader(patient, status = "In progress") {
  if (!patient) return "";
  const ageGender = [patient.age, patient.gender].filter(Boolean).join("/");
  return `
    <div class="patient-sticky" data-testid="patient-sticky-header">
      <strong>${escapeHtml(patient.name || patient.fullName || "Patient")}</strong>
      <span>MRN: ${escapeHtml(patient.mrn || "MRN pending")}</span>
      ${ageGender ? `<span>${escapeHtml(ageGender)}</span>` : ""}
      <span>Allergy: ${escapeHtml(patient.allergies || "None")}</span>
      <span>Status: ${escapeHtml(status)}</span>
    </div>
  `;
}

function patientRiskIndicator(patientId, data = deriveOperationalData()) {
  const highVitals = data.vitals.some((item) => String(item.patientId) === String(patientId) && /abnormal|critical|high/i.test(item.status || item.risk || ""));
  const delayedQueue = data.queue.some((item) => String(item.patientId) === String(patientId) && Number(item.waitingMinutes ?? minutesSince(recordTime(item))) >= automationSettingsForScope().queueWaitingMinutes);
  const pendingReport = data.labOrders.some((item) => String(item.patientId) === String(patientId) && isPendingStatus(item.status, ["Report Ready", "Doctor Reviewed", "Completed"]));
  const pendingPharmacy = data.pharmacyIssues.some((item) => String(item.patientId) === String(patientId) && item.status !== "Issued");
  const pendingPayment = data.bills.some((item) => String(item.patientId) === String(patientId) && item.status !== "Paid");
  const dischargeBlocked = data.dischargePlans.some((item) => String(item.patientId) === String(patientId) && item.status !== "Ready for Discharge");
  if (highVitals) return ["Critical", "risk-critical"];
  if (delayedQueue || dischargeBlocked) return ["Delayed", "risk-high"];
  if (pendingReport || pendingPharmacy || pendingPayment) return ["Attention", "risk-medium"];
  return ["Normal", "status-active"];
}

function opdCheckoutChecklistPanel(patientId, data = deriveOperationalData()) {
  const hasConsultation = data.consultations.some((item) => String(item.patientId) === String(patientId));
  const orderedReports = data.labOrders.filter((item) => String(item.patientId) === String(patientId));
  const reportsReviewed = orderedReports.every((item) => ["Report Ready", "Doctor Reviewed", "Completed"].includes(item.status));
  const prescriptions = data.pharmacyIssues.filter((item) => String(item.patientId) === String(patientId));
  const pharmacyDone = prescriptions.length === 0 || prescriptions.every((item) => item.status === "Issued");
  const bills = data.bills.filter((item) => String(item.patientId) === String(patientId));
  const billGenerated = bills.length > 0;
  const paymentDone = bills.length === 0 || bills.every((item) => item.status === "Paid");
  const followupDone = data.appointments.some((item) => String(item.followUpForPatientId || "") === String(patientId) || String(item.patientId) === String(patientId) && /follow/i.test(item.type || item.source || ""));
  const checkoutDone = data.checkouts.some((item) => String(item.patientId) === String(patientId));
  const rows = [
    ["Consultation completed", hasConsultation],
    ["Lab/radiology reports reviewed, if ordered", reportsReviewed],
    ["Pharmacy issue completed, if prescription exists", pharmacyDone],
    ["Bill generated", billGenerated],
    ["Payment completed", paymentDone],
    ["Follow-up added, if required", followupDone || checkoutDone],
    ["Checkout completed", checkoutDone]
  ];
  return checklistPanel("OPD Checkout Checklist", "Guided closeout before OPD checkout.", rows);
}

function patientCardGrid(items = []) {
  return `
    <div class="patient-card-grid" data-testid="patient-card-grid">
      ${items.map((item) => `
        <article class="patient-card">
          <div>
            <strong>${escapeHtml(item.patientName || item.name || item.fullName || "Patient")}</strong>
            <span>${escapeHtml(item.mrn || item.tokenNumber || "MRN pending")}</span>
          </div>
          <div class="card-meta">
            ${item.age || item.gender ? `<span>${escapeHtml([item.age, item.gender].filter(Boolean).join("/"))}</span>` : ""}
            ${item.department ? `<span>${escapeHtml(item.department)}</span>` : ""}
            ${item.doctor ? `<span>${escapeHtml(item.doctor)}</span>` : ""}
            ${item.waitingMinutes !== undefined ? `<span>${escapeHtml(item.waitingMinutes)} min</span>` : ""}
          </div>
          <div class="card-meta">
            ${badge(item.priority || "Normal", riskClass(item.priority === "Emergency" ? "Critical" : item.priority || "Low"))}
            ${badge(item.status || item.stage || "Waiting", statusClass(item.status || item.stage || "Waiting"))}
          </div>
          ${item.action ? `<button class="button small primary" type="button" data-action="${escapeHtml(item.action)}" data-patient="${escapeHtml(item.patientId || item.id || "")}" data-appointment="${escapeHtml(item.appointmentId || "")}" data-testid="${escapeHtml(item.testId || "patient-card-next-action")}">${escapeHtml(item.actionLabel || "Open")}</button>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function fileStorageStatus() {
  return hasPermission(currentUser, "documents", "view")
    ? safeOptionalData(() => api.documentStorageStatus(currentUser), { configured: false, status: "Not configured", message: "File storage is not configured. Please contact system administrator.", missing: [] })
    : { configured: false, status: "Not configured", message: "File storage is not configured. Please contact system administrator.", missing: [] };
}

function documentTypeOptions(types = []) {
  const defaults = ["consent", "lab-report", "radiology-report", "insurance", "admission-document", "discharge-summary", "death-summary", "death-certificate", "body-handover", "mlc-document", "billing-document", "pharmacy-document", "other"];
  return (types.length ? types : defaults).map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(titleCase(type.replaceAll("-", " ")))}</option>`).join("");
}

function documentUploadPanel({ patientId = "", admissionId = "", relatedModule = "documents", types = [], title = "Upload Document" } = {}) {
  const storage = fileStorageStatus();
  if (!storage.configured) {
    return "";
  }
  if (!hasPermission(currentUser, "documents", "create") || (relatedModule !== "documents" && !hasPermission(currentUser, relatedModule, "create"))) return "";
  return `
    <section class="panel" data-testid="document-upload-section">
      <div class="panel-head"><h3>${escapeHtml(title)}</h3><p>Allowed files: PDF, JPG, PNG, WebP. Max ${escapeHtml(storage.maxUploadMb || 10)} MB.</p></div>
      <div class="upload-progress" aria-hidden="true"><span></span></div>
      <form class="form-grid" data-action="upload-document">
        <input type="hidden" name="patientId" value="${escapeHtml(patientId)}" />
        <input type="hidden" name="admissionId" value="${escapeHtml(admissionId)}" />
        <input type="hidden" name="relatedModule" value="${escapeHtml(relatedModule)}" />
        <label>Document type<select name="documentType" required>${documentTypeOptions(types)}</select></label>
        <label>Category<input name="category" value="${escapeHtml(types[0] || "other")}" /></label>
        <label class="span-2">File<input name="fileInput" type="file" accept="application/pdf,image/jpeg,image/png,image/webp,.docx" required /></label>
        <label class="span-2">Description<textarea name="description" placeholder="Short note for this document"></textarea></label>
        <button class="button primary" type="submit" data-testid="document-upload-button">Upload Document</button>
      </form>
    </section>
  `;
}

function documentActions(doc) {
  const id = escapeHtml(doc.id);
  const download = hasPermission(currentUser, "documents", "view")
    ? `<button class="button tiny soft" type="button" data-action="download-document" data-document-id="${id}" data-testid="document-download-button">Download</button>`
    : "";
  const remove = hasPermission(currentUser, "documents", "delete")
    ? `<button class="button tiny danger" type="button" data-action="delete-document-file" data-document-id="${id}" data-testid="document-delete-button">Delete</button>`
    : "";
  return `<div class="grid-actions">${download}${remove}</div>`;
}

function documentTable(docs = []) {
  const fileBadge = (doc) => {
    const name = doc.originalFilename || doc.fileName || doc.title || "-";
    const type = String(doc.mimeType || name.split(".").pop() || "file").replace("application/", "").replace("image/", "");
    return `<span class="file-chip"><strong>${escapeHtml(type.toUpperCase().slice(0, 6))}</strong>${escapeHtml(name)}</span>`;
  };
  return docs.length ? table(["Type", "File", "Category", "Uploaded By", "Date", "Status", "Action"], docs.map((doc) => [
    titleCase(String(doc.documentType || doc.type || "-").replaceAll("-", " ")),
    fileBadge(doc),
    doc.category || doc.relatedModule || "-",
    doc.uploadedBy || "-",
    formatDateTime(doc.createdAt || doc.uploadedAt || doc.uploadedDate),
    badge(doc.status || "Active", statusClass(doc.status || "Active")),
    documentActions(doc)
  ])) : emptyState("No documents are linked yet. Uploaded documents will appear here after Cloudflare R2 storage is configured.");
}

function searchFilterBar(placeholder = "Search by name / MRN / mobile", chips = ["All", "Waiting", "Today", "Completed"]) {
  return `
    <div class="filter-row compact workflow-filter">
      <input class="panel-search" placeholder="${escapeHtml(placeholder)}" data-table-search />
      <div class="chip-row">${chips.map((chip, index) => `<button class="chip ${index === 0 ? "active" : ""}" type="button" data-filter-chip="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`).join("")}</div>
    </div>
  `;
}

function patientActions(patient) {
  const id = escapeHtml(patient.id);
  const isDoctor = ["doctor", "surgeon"].includes(String(currentUser.jobRole || "").toLowerCase());
  const readyToken = isDoctor ? safeOptionalData(() => api.queueTokens(currentUser), []).find((item) => String(item.patientId) === String(patient.id) && ["Ready for Doctor", "READY_FOR_DOCTOR"].includes(item.status)) : null;
  const primary = hasPermission(currentUser, "consultation", "create") && (!isDoctor || readyToken)
    ? `<button class="button tiny primary" type="button" data-action="${isDoctor ? "doctor-start-consultation" : "patient-start-consultation"}" ${isDoctor ? `data-queue-token="${escapeHtml(readyToken.id)}"` : `data-patient="${id}"`} data-testid="patient-action-start-consultation">Start Consultation</button>`
    : `<button class="button tiny soft" type="button" data-action="patient-view" data-patient="${id}" data-testid="patient-action-view">Open Patient</button>`;
  const actions = [
    `<button class="button tiny soft" type="button" data-action="patient-view" data-patient="${id}" data-testid="patient-action-view">View</button>`,
    hasPermission(currentUser, "appointments", "create") ? `<button class="button tiny soft" type="button" data-action="patient-book-appointment" data-patient="${id}" data-testid="patient-action-book-appointment">Book Appointment</button>` : "",
    hasPermission(currentUser, "queue", "create") ? `<button class="button tiny soft" type="button" data-action="patient-check-in" data-patient="${id}" data-testid="patient-action-check-in">Check In</button>` : "",
    hasPermission(currentUser, "vitals", "create") ? `<button class="button tiny soft" type="button" data-action="patient-record-vitals" data-patient="${id}" data-testid="patient-action-record-vitals">Record Vitals</button>` : "",
    hasPermission(currentUser, "consultation", "view") ? `<button class="button tiny soft" type="button" data-action="patient-view-history" data-patient="${id}" data-testid="patient-action-view-history">View History</button>` : "",
    hasPermission(currentUser, "billing", "view") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${id}">View Bills</button>` : "",
    hasPermission(currentUser, "pharmacy", "view") ? `<button class="button tiny soft" type="button" data-route="pharmacy" data-patient-id="${id}">View Prescriptions</button>` : ""
  ].filter(Boolean);
  return `
    <div class="grid-actions patient-actions-cell">
      ${primary}
      <details class="row-action-menu">
        <summary class="button tiny soft" data-testid="patient-action-menu-button">More</summary>
        <div class="row-action-popover">
          ${actions.join("")}
        </div>
      </details>
    </div>
  `;
}

function latestForPatient(rows, patientId) {
  return [...(rows || [])]
    .filter((row) => String(row.patientId) === String(patientId))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))[0];
}

function pendingCount(rows, doneStatuses = ["Paid", "Issued", "Report Ready", "Completed"]) {
  return (rows || []).filter((row) => !doneStatuses.includes(row.status)).length;
}

function printableButton(action, id, label, testId) {
  return `<button class="button tiny soft" type="button" data-action="${escapeHtml(action)}" data-id="${escapeHtml(id)}" ${testId ? `data-testid="${escapeHtml(testId)}"` : ""}>${escapeHtml(label)}</button>`;
}

function ipd360Button(admissionId, label = "View 360") {
  if (!admissionId || !canAccessPage(currentUser, "ipdPatient360")) return "";
  return `<button class="button tiny primary" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-testid="ipd-view-360-button">${escapeHtml(label)}</button>`;
}

function isDeathOutcome(record = {}) {
  const values = [
    record.outcome,
    record.outcomeStatus,
    record.patientOutcome,
    record.dischargeDisposition,
    record.admissionStatus,
    record.status,
    record.decision
  ].map((value) => String(value || "").trim().toLowerCase());
  return values.some((value) => ["death", "expired", "deceased", "mortality"].includes(value));
}

function deathSummaryForAdmission(summaries = [], admissionId) {
  return summaries.find((summary) => String(summary.admissionId) === String(admissionId));
}

function deathSummaryButton(record = {}, summaries = []) {
  const admissionId = admissionDisplayId(record) || record.admissionId;
  if (!admissionId || !hasPermission(currentUser, "deathSummary", "view") || !isDeathOutcome(record)) return "";
  const summary = deathSummaryForAdmission(summaries, admissionId);
  const label = summary ? "View Death Summary" : hasPermission(currentUser, "deathSummary", "create") ? "Create Death Summary" : "View Death Summary";
  return `<button class="button tiny ${summary ? "soft" : "primary"}" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="deathSummary" data-testid="death-summary-entry-button">${escapeHtml(label)}</button>`;
}

function admissionDisplayId(admission = {}) {
  return admission.id || admission.admissionId || admission._id || "";
}

function admissionPatientId(admission = {}) {
  return admission.patientId || admission.patient || admission.patient_id || "";
}

function admissionBedLabel(admission = {}, beds = []) {
  const directBed = firstDefined(admission.bedNumber, admission.bed, admission.bedLabel);
  if (directBed) return directBed;
  const bed = beds.find((item) => String(item.id || item._id || "") === String(admission.bedId || ""));
  return firstDefined(bed?.bed, bed?.bedNumber, bed?.name, admission.bedId) || "Bed not assigned";
}

function admissionWardLabel(admission = {}, beds = []) {
  const directWard = firstDefined(admission.ward, admission.wardName, admission.departmentWard);
  if (directWard) return directWard;
  const bed = beds.find((item) => String(item.id || item._id || "") === String(admission.bedId || ""));
  return firstDefined(bed?.ward, bed?.wardName, bed?.departmentWard) || "Bed not assigned";
}

function safeMrn(value, fallback = "MRN not available") {
  return String(value || "").trim() || fallback;
}

function canonicalRecordId(record = {}) {
  return String(record.id || record._id || record.admissionId || record.patientId || "").trim();
}

function sameId(left, right) {
  return Boolean(left && right && String(left) === String(right));
}

function medicineField(record = {}) {
  return firstDefined(record.medicineName, record.drugName, record.medicationName, record.medicine, record.itemName, record.orderMedicineName, record.name);
}

function resolveMedicationName(item = {}, context = {}) {
  const direct = firstDefined(
    medicineField(item),
    medicineField(item.medicationOrder),
    medicineField(item.prescriptionItem),
    medicineField(item.orderItem),
    medicineField(item.pharmacyIssueItem)
  );
  if (direct) return direct;
  const linkedPrescriptionItem = (context.prescriptionItems || []).find((prescriptionItem) => {
    const prescriptionItemId = canonicalRecordId(prescriptionItem);
    return sameId(prescriptionItemId, item.prescriptionItemId) ||
      sameId(prescriptionItemId, item.medicationOrderId) ||
      sameId(prescriptionItemId, item.orderItemId) ||
      sameId(prescriptionItem.prescriptionId, item.prescriptionId) ||
      (sameId(prescriptionItem.patientId, item.patientId) && sameId(prescriptionItem.admissionId || item.admissionId, item.admissionId) && medicineField(prescriptionItem));
  });
  const linkedIssue = (context.pharmacyIssues || []).find((issue) => (
    sameId(canonicalRecordId(issue), item.pharmacyIssueId) ||
    sameId(issue.prescriptionId, item.prescriptionId) ||
    (sameId(issue.patientId, item.patientId) && (!item.admissionId || sameId(issue.admissionId, item.admissionId) || !issue.admissionId))
  ));
  const linkedConsultation = (context.consultations || []).find((consultation) => (
    sameId(canonicalRecordId(consultation), item.consultationId) ||
    sameId(consultation.prescriptionId, item.prescriptionId) ||
    (sameId(consultation.patientId, item.patientId) && (!item.admissionId || sameId(consultation.admissionId, item.admissionId) || !consultation.admissionId))
  ));
  return firstDefined(
    medicineField(linkedPrescriptionItem),
    medicineField(linkedIssue),
    linkedIssue?.medicines,
    medicineField(linkedConsultation),
    linkedConsultation?.prescription,
    linkedConsultation?.medicines
  ) || "Medication order not linked";
}

function findAdmissionForPlan(plan = {}, admissions = []) {
  return admissions.find((item) => (
    sameId(admissionDisplayId(item), plan.admissionId || plan.admission) ||
    sameId(item.admissionNumber, plan.admissionId || plan.admissionNumber) ||
    (plan.patientId && sameId(admissionPatientId(item), plan.patientId))
  )) || {};
}

function findPatientForDischarge(plan = {}, admission = {}, patients = []) {
  return patients.find((item) => (
    sameId(item.id || item._id, plan.patientId) ||
    sameId(item.id || item._id, admissionPatientId(admission)) ||
    sameId(item.mrn, plan.mrn || admission.mrn)
  )) || {};
}

function resolveDischargePatient(plan = {}, admissions = [], patients = []) {
  const admission = findAdmissionForPlan(plan, admissions);
  const patient = findPatientForDischarge(plan, admission, patients);
  const mrn = firstDefined(
    patient.mrn,
    admission.mrn,
    plan.mrn,
    patient.displayId,
    patient.patientNumber,
    admission.admissionNumber
  );
  const name = firstDefined(plan.patientName, admission.patientName, patient.name, patient.fullName, "Patient");
  return {
    admission,
    patient,
    mrn: safeMrn(mrn, "MRN unavailable in linked records"),
    name
  };
}

function filterByAdmission(rows = [], admission = {}) {
  const admissionId = admissionDisplayId(admission);
  const patientId = admissionPatientId(admission);
  return (rows || []).filter((row) => (
    String(row.admissionId || row.admission || "") === String(admissionId) ||
    (patientId && String(row.patientId || row.patient || "") === String(patientId))
  ));
}

function latestRecord(rows = []) {
  return [...rows].sort((a, b) => new Date(b.dateTime || b.date || b.updatedAt || b.createdAt || 0) - new Date(a.dateTime || a.date || a.updatedAt || a.createdAt || 0))[0];
}

function ipdAdmissionStatus(admission = {}) {
  return admission.admissionStatus || admission.status || "Admitted";
}

function ipdHeader(admission = {}, patient = {}) {
  const ageGender = [patient.age || admission.age, patient.gender || admission.gender].filter(Boolean).join("/");
  return `
    <div class="patient-sticky ipd-sticky" data-testid="ipd-360-sticky-header">
      <strong>${escapeHtml(admission.patientName || patient.name || patient.fullName || "Admitted patient")}</strong>
      <span>${escapeHtml(safeMrn(patient.mrn || admission.mrn, "MRN not available"))}</span>
      ${ageGender ? `<span>${escapeHtml(ageGender)}</span>` : ""}
      <span>${escapeHtml(admission.ward || "Bed not assigned")}</span>
      <span>${escapeHtml(admission.bedNumber || admission.bedId || "Bed not assigned")}</span>
      <span>${escapeHtml(admission.consultant || admission.admittingDoctor || admission.requestedBy || "Consultant pending")}</span>
      <span>${escapeHtml(ipdAdmissionStatus(admission))}</span>
      <span>Allergy: ${escapeHtml(patient.allergies || admission.allergies || "No known drug allergies")}</span>
    </div>
  `;
}

function ipd360Tabs(activeTab, admissionId) {
  const allTabs = [
    ["overview", "Overview", "ipd"],
    ["dailySheet", "Daily Sheet", "dailySheets"],
    ["doctorNotes", "Doctor Notes", "dutyDoctor"],
    ["nursingNotes", "Nursing Notes", "nursing"],
    ["vitals", "Vitals", "ipdVitals"],
    ["mar", "MAR", "mar"],
    ["intakeOutput", "Intake / Output", "intakeOutput"],
    ["handover", "Handover", "handover"],
    ["discharge", "Discharge", "discharge"],
    ["billing", "Billing Clearance", "billing"],
    ["documents", "Documents", "documents"]
  ];
  const visible = allTabs.filter(([, , module]) => hasPermission(currentUser, module, "view"));
  return `
    <div class="tab-strip" data-testid="ipd-360-tabs">
      ${visible.map(([key, label]) => `<button class="tab-button ${key === activeTab ? "active" : ""}" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="${escapeHtml(key)}">${escapeHtml(label)}</button>`).join("")}
    </div>
  `;
}

function ipdTimelineEvents(admission = {}, context = {}) {
  const events = [];
  const add = (when, title, module, user = "-") => {
    if (when || title) events.push({ when: when || new Date().toISOString(), title, module, user });
  };
  add(admission.createdAt || admission.admissionDateTime, "Admission active", "Admissions", admission.createdBy || admission.requestedBy || admission.admittingDoctor);
  if (admission.bedNumber || admission.bedId) add(admission.updatedAt || admission.createdAt, "Bed assigned", "Wards", admission.updatedBy || "-");
  (context.vitals || []).forEach((item) => add(item.dateTime || item.createdAt, "Vitals recorded", "Vitals", item.recordedBy));
  (context.doctorNotes || []).forEach((item) => add(item.dateTime || item.createdAt, "Doctor note added", "Doctor Notes", item.doctorName));
  (context.nursingNotes || []).forEach((item) => add(item.dateTime || item.createdAt, "Nursing note added", "Nursing", item.nurseName));
  (context.labOrders || []).forEach((item) => add(recordTime(item), item.status === "Report Ready" ? "Lab report uploaded" : "Lab order created", item.orderType || "Lab", item.doctor));
  (context.pharmacyIssues || []).forEach((item) => add(recordTime(item), "Medicine issued", "Pharmacy", item.issuedBy || "-"));
  (context.bills || []).forEach((item) => add(recordTime(item), "Bill generated", "Billing", item.createdBy || "-"));
  (context.documents || []).forEach((item) => add(recordTime(item), "Document uploaded", "Documents", item.uploadedBy || "-"));
  (context.dischargePlans || []).forEach((item) => add(recordTime(item), "Discharge planning started", "Discharge", item.createdBy || "-"));
  (context.deathSummaries || []).forEach((item) => add(recordTime(item), `Death Summary ${item.status || "updated"}`, "Death Summary", item.updatedBy || item.createdBy || "-"));
  return events.sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 30);
}

function checklistPanel(title, subtitle, rows = [], options = {}) {
  const ready = rows.every(([, done]) => done);
  return `
    <section class="panel" ${options.testId ? `data-testid="${escapeHtml(options.testId)}"` : ""}>
      <div class="panel-head"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div>${badge(ready ? "Ready" : "Pending", ready ? "status-active" : "risk-medium")}</div>
      <div class="checklist-grid">
        ${rows.map(([label, done]) => `<span class="${done ? "done" : ""}"><i>${done ? "OK" : "!"}</i>${escapeHtml(label)}</span>`).join("")}
      </div>
      ${options.note ? `<div class="notice subtle">${escapeHtml(options.note)}</div>` : ""}
    </section>
  `;
}

function ipdAdmissionChecklistPanel(admission = {}, context = {}) {
  const admissionId = admissionDisplayId(admission);
  const rows = [
    ["Admission request created", Boolean(admissionId)],
    ["Admission reviewed", !["Requested", "Pending"].includes(ipdAdmissionStatus(admission))],
    ["Ward selected", Boolean(admission.ward)],
    ["Bed assigned", Boolean(admission.bedNumber || admission.bedId)],
    ["Admission activated", !["Requested", "Pending", "Cancelled"].includes(ipdAdmissionStatus(admission))],
    ["Initial nursing assessment added", (context.nursingNotes || []).length > 0],
    ["Initial doctor note added", (context.doctorNotes || []).length > 0]
  ];
  return checklistPanel("IPD Admission Checklist", "Guided activation steps for a safe IPD handoff.", rows, {
    testId: "ipd-admission-checklist",
    note: "Admission activation still uses existing admission, ward, bed, and role permission rules."
  });
}

function dischargeChecklistPanel({ admission = {}, dischargePlans = [], documents = [], bills = [], pharmacyIssues = [], labOrders = [], deathSummary = null } = {}) {
  const plan = dischargePlans[0] || {};
  const paid = bills.some((bill) => bill.status === "Paid");
  const rows = [
    ["Doctor discharge summary completed", Boolean(plan.doctorAdviceCompleted || documents.some((doc) => doc.documentType === "discharge-summary"))],
    ["Nursing clearance done", Boolean(plan.nursingClearance)],
    ["Pharmacy clearance done", Boolean(plan.pharmacyClearance) || pharmacyIssues.every((issue) => issue.status === "Issued")],
    ["Lab reports attached", Boolean(plan.labRadiologyClearance) || labOrders.every((order) => ["Report Ready", "Doctor Reviewed"].includes(order.status))],
    ["Billing cleared", Boolean(plan.billingClearance) || paid],
    ["Documents completed", missingDocumentAlerts({ documents, admission, deathSummary, labOrders, bills }).length === 0],
    ["Final bill paid", paid]
  ];
  return checklistPanel("Discharge Checklist Automation", "Doctor, nursing, pharmacy, billing, document, and summary readiness.", rows, {
    testId: "discharge-checklist",
    note: "Final discharge still requires an authorized user action and server-side validation."
  });
}

function deathSummaryChecklistPanel(summary = null, documents = [], admission = {}) {
  const deathDocumentUploaded = documents.some((doc) => ["death-summary", "death-certificate"].includes(doc.documentType));
  const rows = [
    ["Death outcome recorded", isDeathOutcome(admission)],
    ["Draft created", Boolean(summary)],
    ["Submitted for review", ["Submitted", "Submitted for Review", "Approved / Finalized", "Printed"].includes(summary?.status)],
    ["Finalized or returned", ["Approved / Finalized", "Printed", "Returned for Correction"].includes(summary?.status)],
    ["Print/export audit captured", Boolean(summary?.printedAt || summary?.exportedAt)],
    ["Death certificate document uploaded, if applicable", deathDocumentUploaded || summary?.deathCertificateIssued !== "Yes"]
  ];
  return checklistPanel("Death Summary Checklist", "Mortality workflow stays separate from normal discharge summary.", rows, {
    testId: "death-summary-checklist",
    note: "Death Summary actions remain audit logged and permission controlled."
  });
}

function safeAiAssistantPanel(context = "patient record") {
  return `
    <section class="panel assistive-panel">
      <div class="panel-head">
        <div><h3>Safe AI Assistant Placeholder</h3><p>Assistive draft only &mdash; requires human review.</p></div>
        ${badge("Draft-only", "status-draft")}
      </div>
      <div class="notice subtle">
        Future support may summarize ${escapeHtml(context)}, draft discharge/death summaries from approved notes, clean up rough notes, explain billing breakup, find pending tasks, and surface missing documents. It will not diagnose, prescribe, approve discharge, or certify death.
      </div>
    </section>
  `;
}

function ipdNextActions(admissionId, admission = {}) {
  const actions = [
    ["ipdVitals", "Record Vitals", "ipdVitals", "create"],
    ["nursing", "Add Nursing Note", "nursing", "create"],
    ["dutyDoctor", "Add Doctor Note", "dutyDoctor", "create"],
    ["mar", "Mark Medication Given", "mar", "edit"],
    ["intakeOutput", "Update Intake/Output", "intakeOutput", "create"],
    ["handover", "Add Handover Note", "handover", "create"],
    ["discharge", "Start Discharge Clearance", "discharge", "edit"],
    ["discharge", "Generate Discharge Summary", "discharge", "create"],
    ["ipdPatient360", "Create Death Summary", "deathSummary", "create"]
  ].filter(([route, , module, action]) => hasPermission(currentUser, module, action) && (route !== "ipdPatient360" || isDeathOutcome(admission)));
  return `
    <aside class="panel next-action-panel" data-testid="ipd-360-next-actions">
      <div class="panel-head"><h3>Next Action</h3><p>Allowed actions for this admission.</p></div>
      <div class="quick-grid compact">
        ${actions.length ? actions.map(([route, label]) => `<button class="button soft" type="button" data-route="${route}" data-admission-id="${escapeHtml(admissionId)}"${route === "ipdPatient360" ? ` data-tab="deathSummary"` : ""}>${escapeHtml(label)}</button>`).join("") : emptyState("No next actions are available for your current permissions.")}
      </div>
    </aside>
  `;
}

function deathSummaryForm(admission = {}, patient = {}, summary = null) {
  const admissionId = admissionDisplayId(admission);
  const locked = summary && ["Approved / Finalized", "Printed", "Closed"].includes(summary.status);
  if (locked || (!summary && !hasPermission(currentUser, "deathSummary", "create")) || (summary && !hasPermission(currentUser, "deathSummary", "edit"))) return "";
  const action = summary ? "update-death-summary" : "create-death-summary";
  return `
    <section class="panel" data-testid="death-summary-form">
      <div class="panel-head"><h3>${summary ? "Edit Death Summary" : "Create Death Summary"}</h3><p>Mortality Summary for admitted/IPD patient.</p></div>
      <form class="form-grid" data-action="${action}">
        <input type="hidden" name="admissionId" value="${escapeHtml(admissionId)}" />
        <label>Patient name<input name="patientName" value="${escapeHtml(summary?.patientName || admission.patientName || patient.name || patient.fullName || "")}" readonly /></label>
        <label>MRN<input name="mrn" value="${escapeHtml(summary?.mrn || patient.mrn || admission.mrn || "")}" readonly /></label>
        <label>Age<input name="age" value="${escapeHtml(summary?.age || patient.age || admission.age || "")}" readonly /></label>
        <label>Gender<input name="gender" value="${escapeHtml(summary?.gender || patient.gender || admission.gender || "")}" readonly /></label>
        <label>Admission number<input name="admissionNumber" value="${escapeHtml(summary?.admissionNumber || admission.admissionNumber || admissionId)}" readonly /></label>
        <label>Admission date/time<input name="admissionDateTime" value="${escapeHtml(summary?.admissionDateTime || admission.admissionDateTime || admission.createdAt || "")}" readonly /></label>
        <label>Ward / bed<input name="wardBed" value="${escapeHtml(summary?.wardBed || `${admission.ward || ""}${admission.bedNumber || admission.bedId ? ` / ${admission.bedNumber || admission.bedId}` : ""}`.trim())}" readonly /></label>
        <label>Consultant<input name="consultant" value="${escapeHtml(summary?.consultant || admission.consultant || admission.admittingDoctor || admission.requestedBy || "")}" readonly /></label>
        <label class="span-2">Diagnosis at admission<input name="diagnosisAtAdmission" value="${escapeHtml(summary?.diagnosisAtAdmission || admission.diagnosisAtAdmission || "")}" readonly /></label>

        <label>Date of death<input name="dateOfDeath" type="date" value="${escapeHtml(summary?.dateOfDeath || "")}" required /></label>
        <label>Time of death<input name="timeOfDeath" type="time" value="${escapeHtml(summary?.timeOfDeath || "")}" required /></label>
        <label>Place of death<select name="placeOfDeath"><option ${summary?.placeOfDeath === "Ward" ? "selected" : ""}>Ward</option><option ${summary?.placeOfDeath === "ICU" ? "selected" : ""}>ICU</option><option ${summary?.placeOfDeath === "Emergency" ? "selected" : ""}>Emergency</option><option ${summary?.placeOfDeath === "OT" ? "selected" : ""}>OT</option><option ${summary?.placeOfDeath === "Other" ? "selected" : ""}>Other</option></select></label>
        <label>Attending doctor<input name="attendingDoctor" value="${escapeHtml(summary?.attendingDoctor || admission.admittingDoctor || "")}" /></label>
        <label>Witnessed by<input name="witnessedBy" value="${escapeHtml(summary?.witnessedBy || "")}" /></label>
        <label>MLC / medico-legal case<select name="mlcCase"><option ${summary?.mlcCase === "No" ? "selected" : ""}>No</option><option ${summary?.mlcCase === "Yes" ? "selected" : ""}>Yes</option></select></label>
        <label>Family informed<select name="familyInformed"><option ${summary?.familyInformed === "Yes" ? "selected" : ""}>Yes</option><option ${summary?.familyInformed === "No" ? "selected" : ""}>No</option></select></label>
        <label>Family informed by<input name="familyInformedBy" value="${escapeHtml(summary?.familyInformedBy || "")}" /></label>
        <label>Body handover status<select name="bodyHandoverStatus"><option ${summary?.bodyHandoverStatus === "Pending" ? "selected" : ""}>Pending</option><option ${summary?.bodyHandoverStatus === "Approved" ? "selected" : ""}>Approved</option><option ${summary?.bodyHandoverStatus === "Handed Over" ? "selected" : ""}>Handed Over</option></select></label>

        <label class="span-2">Immediate cause<textarea name="immediateCause" required>${escapeHtml(summary?.immediateCause || "")}</textarea></label>
        <label class="span-2">Antecedent cause<textarea name="antecedentCause">${escapeHtml(summary?.antecedentCause || "")}</textarea></label>
        <label class="span-2">Underlying cause<textarea name="underlyingCause">${escapeHtml(summary?.underlyingCause || "")}</textarea></label>
        <label class="span-2">Other significant conditions<textarea name="otherSignificantConditions">${escapeHtml(summary?.otherSignificantConditions || "")}</textarea></label>
        <label class="span-2">Brief history<textarea name="briefHistory">${escapeHtml(summary?.briefHistory || "")}</textarea></label>
        <label class="span-2">Course in hospital<textarea name="courseInHospital">${escapeHtml(summary?.courseInHospital || "")}</textarea></label>
        <label class="span-2">Investigations summary<textarea name="investigationsSummary">${escapeHtml(summary?.investigationsSummary || "")}</textarea></label>
        <label class="span-2">Treatment given<textarea name="treatmentGiven">${escapeHtml(summary?.treatmentGiven || "")}</textarea></label>
        <label class="span-2">Events leading to death<textarea name="eventsLeadingToDeath">${escapeHtml(summary?.eventsLeadingToDeath || "")}</textarea></label>
        <label>Resuscitation attempted<select name="resuscitationAttempted"><option ${summary?.resuscitationAttempted === "Yes" ? "selected" : ""}>Yes</option><option ${summary?.resuscitationAttempted === "No" ? "selected" : ""}>No</option></select></label>
        <label>Death certificate issued<select name="deathCertificateIssued"><option ${summary?.deathCertificateIssued === "No" ? "selected" : ""}>No</option><option ${summary?.deathCertificateIssued === "Yes" ? "selected" : ""}>Yes</option></select></label>
        <label>Body release approved<select name="bodyReleaseApproved"><option ${summary?.bodyReleaseApproved === "No" ? "selected" : ""}>No</option><option ${summary?.bodyReleaseApproved === "Yes" ? "selected" : ""}>Yes</option></select></label>
        <label>Billing clearance<select name="billingClearanceStatus"><option>${escapeHtml(summary?.billingClearanceStatus || "Pending")}</option><option>Cleared</option><option>Pending</option></select></label>
        <label>Pharmacy clearance<select name="pharmacyClearanceStatus"><option>${escapeHtml(summary?.pharmacyClearanceStatus || "Pending")}</option><option>Cleared</option><option>Pending</option></select></label>
        <label class="span-2">CPR details<textarea name="cprDetails">${escapeHtml(summary?.cprDetails || "")}</textarea></label>
        <label class="span-2">Final clinical impression<textarea name="finalClinicalImpression">${escapeHtml(summary?.finalClinicalImpression || "")}</textarea></label>
        <label class="span-2">Document checklist<textarea name="documentChecklist">${escapeHtml(summary?.documentChecklist || "Death certificate, body handover form, identity verification")}</textarea></label>
        <label class="span-2">Remarks<textarea name="remarks">${escapeHtml(summary?.remarks || "")}</textarea></label>
        <button class="button primary" type="submit" data-testid="save-death-summary-button">${summary ? "Save Death Summary" : "Create Death Summary"}</button>
      </form>
    </section>
  `;
}

function deathSummaryPreview(summary = {}, admission = {}, patient = {}) {
  if (!summary) return emptyState("Death Summary is not created yet. Authorized doctors can create it after the admission outcome is marked Death, Expired, Deceased, or Mortality.");
  return `
    <section class="panel print-death-summary" data-testid="death-summary-print-layout">
      <div class="print-doc-head">
        <div>
          <p class="eyebrow">Hospital Operations Command Center</p>
          <h2>Death Summary</h2>
          <p>Mortality Summary</p>
        </div>
        ${badge(summary.status || "Draft", statusClass(summary.status || "Draft"))}
      </div>
      ${table(["Field", "Details"], [
        ["Patient", `${summary.patientName || admission.patientName || patient.name || "-"} | MRN: ${summary.mrn || patient.mrn || "-"} | ${[summary.age || patient.age, summary.gender || patient.gender].filter(Boolean).join("/") || "-"}`],
        ["Admission", `${summary.admissionNumber || admission.admissionNumber || admissionDisplayId(admission)} | ${summary.admissionDateTime || admission.admissionDateTime || "-"}`],
        ["Ward / Bed", summary.wardBed || `${admission.ward || "-"} / ${admission.bedNumber || admission.bedId || "-"}`],
        ["Consultant", summary.consultant || admission.consultant || admission.admittingDoctor || "-"],
        ["Date / Time of death", `${summary.dateOfDeath || "-"} ${summary.timeOfDeath || ""}`],
        ["Cause of death", `Immediate: ${summary.immediateCause || "-"}; Antecedent: ${summary.antecedentCause || "-"}; Underlying: ${summary.underlyingCause || "-"}`],
        ["Clinical course", summary.courseInHospital || summary.briefHistory || "-"],
        ["Treatment given", summary.treatmentGiven || "-"],
        ["Events leading to death", summary.eventsLeadingToDeath || "-"],
        ["Final impression", summary.finalClinicalImpression || "-"],
        ["MLC / Family / Body", `MLC: ${summary.mlcCase || "No"}; Family informed: ${summary.familyInformed || "-"}; Body handover: ${summary.bodyHandoverStatus || "Pending"}`],
        ["Prepared / Approved", `${summary.preparedBy || "-"} / ${summary.approverName || "-"}`],
        ["Printed", summary.printedAt || "Not printed"]
      ])}
      <p class="print-footer">This Death Summary is generated from HOCC clinical records and must be validated by authorized hospital staff before external release.</p>
    </section>
  `;
}

function deathSummarySection(admission = {}, patient = {}, summary = null) {
  if (!isDeathOutcome(admission) && !summary) return emptyState("Death Summary is available only after outcome is marked Death, Expired, Deceased, or Mortality.");
  const admissionId = admissionDisplayId(admission);
  const documents = hasPermission(currentUser, "documents", "view") ? filterByAdmission(safeOptionalData(() => api.patientDocuments(currentUser)), admission) : [];
  const deathDocuments = documents.filter((doc) => ["death-summary", "death-certificate", "body-handover", "mlc-document"].includes(doc.documentType));
  const canSubmit = summary && hasPermission(currentUser, "deathSummary", "edit") && ["Draft", "Returned for Correction"].includes(summary.status);
  const canApprove = summary && hasPermission(currentUser, "deathSummary", "approve") && summary.status === "Submitted for Review";
  const canPrint = summary && hasPermission(currentUser, "deathSummary", "export") && ["Approved / Finalized", "Printed"].includes(summary.status);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Death Summary</h3><p>Mortality Summary workflow, separate from normal discharge summary.</p></div>
        <div class="button-row">
          ${summary ? `<button class="button soft" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="deathSummary">View Death Summary</button>` : ""}
          ${canSubmit ? `<button class="button soft" type="button" data-action="submit-death-summary" data-admission="${escapeHtml(admissionId)}" data-testid="submit-death-summary-button">Submit for Review</button>` : ""}
          ${canApprove ? `<button class="button primary" type="button" data-action="approve-death-summary" data-admission="${escapeHtml(admissionId)}" data-testid="finalize-death-summary-button">Finalize Death Summary</button><button class="button soft" type="button" data-action="return-death-summary" data-admission="${escapeHtml(admissionId)}">Return for Correction</button>` : ""}
          ${canPrint ? `<button class="button primary" type="button" data-action="print-death-summary" data-admission="${escapeHtml(admissionId)}" data-testid="print-death-summary-button">Print Death Summary</button>` : ""}
        </div>
      </div>
      <div class="metric-grid small">
        ${metricCard("Death Summary", summary?.status || "Not Created", "Workflow status")}
        ${metricCard("Death Certificate", summary?.deathCertificateIssued || "No", "Administrative")}
        ${metricCard("Body Handover", summary?.bodyHandoverStatus || "Pending", "Closure")}
        ${metricCard("MLC", summary?.mlcCase || "No", "Medico-legal")}
      </div>
    </section>
    ${deathSummaryChecklistPanel(summary, deathDocuments, admission)}
    ${deathSummaryForm(admission, patient, summary)}
    ${deathSummaryPreview(summary, admission, patient)}
    ${documentUploadPanel({ patientId: admissionPatientId(admission), admissionId, relatedModule: "deathSummary", types: ["death-summary", "death-certificate", "body-handover", "mlc-document"], title: "Upload Death Summary Documents" })}
    <section class="panel">
      <div class="panel-head"><h3>Death Summary Documents</h3><p>Death summary PDF, death certificate copy, body handover form, and MLC documents.</p></div>
      ${documentTable(deathDocuments)}
    </section>
    <section class="panel">
      <div class="panel-head"><h3>Audit history</h3></div>
      <p class="muted">Created, edited, submitted, finalized, returned, printed, certificate, body handover, and MLC changes are logged in the audit trail.</p>
    </section>
  `;
}

function deathSummaryPage() {
  const admissions = hasPermission(currentUser, "admissions", "view") ? safeOptionalData(() => api.admissions(currentUser)) : [];
  const summaries = safeData(() => api.deathSummaries(currentUser));
  const terminalAdmissions = admissions.filter((admission) => isDeathOutcome(admission));
  const rows = [
    ...terminalAdmissions.map((admission) => ({
      admission,
      summary: deathSummaryForAdmission(summaries, admissionDisplayId(admission))
    })),
    ...summaries
      .filter((summary) => !terminalAdmissions.some((admission) => String(admissionDisplayId(admission)) === String(summary.admissionId)))
      .map((summary) => ({ admission: {}, summary }))
  ];
  const openButton = (admissionId, summary) => {
    if (!admissionId) return "Open from IPD patient record";
    const label = summary ? "View Death Summary" : hasPermission(currentUser, "deathSummary", "create") ? "Create Death Summary" : "View Death Summary";
    return `<button class="button tiny ${summary ? "soft" : "primary"}" type="button" data-route="ipdPatient360" data-admission-id="${escapeHtml(admissionId)}" data-tab="deathSummary" data-testid="death-summary-entry-button">${escapeHtml(label)}</button>`;
  };
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h3>Death Summary</h3>
          <p>Mortality Summary worklist for admitted patients marked Death, Expired, Deceased, or Mortality.</p>
        </div>
        ${badge(`${rows.length} case${rows.length === 1 ? "" : "s"}`, "status-active")}
      </div>
      ${rows.length ? table(["Patient", "MRN", "Admission", "Ward / Bed", "Outcome", "Summary Status", "Action"], rows.map(({ admission, summary }) => {
        const admissionId = admissionDisplayId(admission) || summary?.admissionId;
        return [
          admission.patientName || summary?.patientName || "Admitted patient",
          admission.mrn || summary?.mrn || "MRN pending",
          admission.admissionNumber || summary?.admissionNumber || admissionId || "-",
          summary?.wardBed || `${admission.ward || "-"} / ${admission.bedNumber || admission.bedId || "-"}`,
          admission.outcome || admission.outcomeStatus || admission.patientOutcome || admission.dischargeDisposition || admission.admissionStatus || admission.status || "Death",
          badge(summary?.status || "Not Created", statusClass(summary?.status || "Draft")),
          openButton(admissionId, summary)
        ];
      })) : emptyState("No Death Summary cases found. Cases appear here only after an admitted patient outcome is marked Death, Expired, Deceased, or Mortality.")}
    </section>
  `;
}

function priorityCards(items) {
  return `
    <div class="priority-grid">
      ${items.map(([label, count, note]) => `
        <article class="priority-card ${riskClass(label)}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(count)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function publicBookingLinkBlock(branch) {
  if (!branch.publicBookingEnabled) return "";
  const url = `${location.origin}${location.pathname}#/book?branch=${encodeURIComponent(branch.id)}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  return `
    <details class="qr-disclosure">
      <summary>Get QR / link</summary>
      <div class="qr-disclosure-body">
        <img src="${escapeAttribute(qrSrc)}" alt="Booking QR code" width="140" height="140" />
        <input type="text" readonly value="${escapeAttribute(url)}" onclick="this.select()" />
      </div>
    </details>
  `;
}

function sensitivePermissionList(permissions = {}) {
  return Object.entries(permissions || {}).flatMap(([module, actions]) =>
    asArray(actions)
      .filter((action) => SENSITIVE_USER_PERMISSIONS.has(action))
      .map((action) => `${currentPageTitle(module)}: ${action}`)
  );
}

function allAssignablePages() {
  return uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
}

function userAccessDetail(user) {
  if (!user) return `
    <section class="panel empty-panel">
      <h3>Select a user to view access</h3>
      <p>Use View Access to inspect allowed pages, blocked pages, actions, sensitive permissions, and permission audit history.</p>
    </section>
  `;
  const allowedPages = user.allowedPages || [];
  const blockedPages = allAssignablePages().filter((page) => !allowedPages.includes(page));
  const permissions = user.permissions || {};
  const actions = Object.entries(permissions).flatMap(([module, values]) => asArray(values).map((action) => `${currentPageTitle(module)}: ${action}`));
  const sensitive = sensitivePermissionList(permissions);
  const audits = api.auditLogs(currentUser)
    .filter((log) => [user.email, user.name, user.id].some((value) => String(log.newValue || "").includes(value) || String(log.oldValue || "").includes(value)))
    .slice(0, 5);
  return `
    <section class="panel access-detail" data-testid="user-access-detail-panel">
      <div class="panel-head">
        <div>
          <h3>${escapeHtml(user.name)}</h3>
          <p>${escapeHtml(user.email)} · ${escapeHtml(user.jobRole || roleLabels[user.role])} · ${escapeHtml(user.branchName || "Hospital group")}</p>
        </div>
        ${badge(user.reviewStatus || "Not Reviewed", statusClass(user.reviewStatus || "Pending"))}
      </div>
      <div class="access-preview">
        <div>
          <h4>Allowed pages</h4>
          <ul>${allowedPages.map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("") || "<li>No pages assigned</li>"}</ul>
        </div>
        <div>
          <h4>Blocked pages</h4>
          <ul>${blockedPages.slice(0, 14).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("") || "<li>No blocked pages</li>"}</ul>
        </div>
      </div>
      <div class="access-preview">
        <div>
          <h4>Allowed actions</h4>
          <ul>${actions.slice(0, 18).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>View-only or preset access</li>"}</ul>
        </div>
        <div>
          <h4>Sensitive permissions</h4>
          <ul>${sensitive.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>No sensitive permissions</li>"}</ul>
        </div>
      </div>
      <div class="mini-grid">
        <span><strong>Last login</strong>${escapeHtml(user.lastLogin || user.lastLoginAt || "-")}</span>
        <span><strong>Last permission update</strong>${escapeHtml(user.lastPermissionUpdate || "-")}</span>
        <span><strong>Created by</strong>${escapeHtml(user.createdBy || "-")}</span>
      </div>
      <div class="button-row">
        <button class="button small primary" type="button" data-action="review-access" data-review="Reviewed" data-user="${escapeHtml(user.id)}">Mark Reviewed</button>
        <button class="button small soft" type="button" data-action="review-access" data-review="Changes Required" data-user="${escapeHtml(user.id)}">Request Changes</button>
        <button class="button small danger" type="button" data-action="disable-access-user" data-user="${escapeHtml(user.id)}">Disable User</button>
      </div>
      <h4>Permission audit history</h4>
      ${audits.length ? table(["Date/time", "User", "Module", "Action", "New value"], audits.map((log) => [log.at, log.user, log.module, log.action, log.newValue])) : emptyState("No permission audit entries for this user yet.")}
    </section>
  `;
}

function permissionMatrix() {
  const modules = ["Appointments", "Bed Usage", "Claims", "Incidents", "Reports"];
  const permissions = [
    ["Yes", "Yes", "Yes", "No", "No", "No"],
    ["Yes", "Yes", "Yes", "No", "Yes", "Yes"],
    ["Yes", "Yes", "Yes", "No", "Yes", "Yes"],
    ["Yes", "Yes", "Yes", "No", "Yes", "Yes"],
    ["Yes", "No", "No", "No", "Yes", "No"]
  ];
  return `
    <div class="subsection">
      <h3>Sample permission matrix</h3>
      ${table(["Module", "View", "Create", "Edit", "Delete", "Export", "Assign Task"], modules.map((module, index) => [module, ...permissions[index]]))}
    </div>
  `;
}

function emergencyOneScreenPanel(cases = []) {
  const active = cases.filter((item) => !["Discharged", "Transferred", "Closed"].includes(item.status));
  return `
    <section class="panel emergency-one-screen">
      <div class="panel-head">
        <div><h3>Emergency One-Screen Mode</h3><p>Quick registration, triage, vitals, doctor decision, move to OPD/IPD, billing later, or discharge.</p></div>
        <span class="badge risk-critical">${active.length} active</span>
      </div>
      <div class="emergency-action-grid">
        ${hasPermission(currentUser, "emergency", "create") ? `<button class="emergency-action primary" type="button" data-route="emergency"><strong>Quick registration</strong><small>Capture essentials first</small></button>` : ""}
        <button class="emergency-action" type="button" data-route="emergency"><strong>Triage level</strong><small>Critical / High / Medium / Low</small></button>
        ${canAccessPage(currentUser, "vitals") ? `<button class="emergency-action" type="button" data-route="vitals"><strong>Vitals</strong><small>Record immediate observations</small></button>` : ""}
        ${canAccessPage(currentUser, "consultation") ? `<button class="emergency-action" type="button" data-route="consultation"><strong>Doctor action</strong><small>Clinical review remains human-led</small></button>` : ""}
        ${canAccessPage(currentUser, "appointments") ? `<button class="emergency-action" type="button" data-route="appointments"><strong>Move to OPD</strong><small>Continue normal OPD flow</small></button>` : ""}
        ${canAccessPage(currentUser, "admissions") ? `<button class="emergency-action" type="button" data-route="admissions"><strong>Admit to IPD</strong><small>Request bed assignment</small></button>` : ""}
        ${canAccessPage(currentUser, "billing") ? `<button class="emergency-action" type="button" data-route="billing"><strong>Billing later</strong><small>Create reviewed bill</small></button>` : ""}
        ${canAccessPage(currentUser, "checkout") ? `<button class="emergency-action" type="button" data-route="checkout"><strong>Discharge</strong><small>Close only after valid clearance</small></button>` : ""}
      </div>
    </section>
  `;
}

function renderNotificationsDrawer(notifications = []) {
  const categories = ["Clinical", "Queue", "Billing", "Lab", "Pharmacy", "Discharge", "Documents", "Permission", "System"];
  const groups = Object.fromEntries(categories.map((category) => [category, notifications.filter((item) => notificationGroup(item) === category)]).filter(([, items]) => items.length));
  return `
    <div class="notifications-backdrop" data-action="close-notifications" aria-hidden="true"></div>
    <aside class="notifications-drawer" aria-label="Notifications">
      <div class="panel-head">
        <div>
          <h3>Notifications</h3>
          <p>Derived live from today’s workflow signals and saved in-app messages.</p>
        </div>
        <div class="button-row">${hasPermission(currentUser, "notifications", "edit") ? `<button class="button tiny soft" type="button" title="Mark all read" aria-label="Mark all read" data-action="mark-all-notifications-read">${iconLabel(actionIcon("mark read"), "Mark all read")}</button><button class="button tiny soft" type="button" title="Clear read" aria-label="Clear read" data-action="clear-read-notifications">${iconLabel(actionIcon("clear"), "Clear read")}</button>` : ""}<button class="icon-button" type="button" title="Close notifications" data-action="close-notifications" aria-label="Close notifications">${iconLabel(actionIcon("close"), "Close")}</button></div>
      </div>
      ${notifications.length ? Object.entries(groups).map(([group, items]) => `
        <section class="drawer-group">
          <div class="drawer-group-head">
            <strong>${escapeHtml(group)}</strong>
            <span class="badge ${items.some((item) => !item.read) ? "risk-medium" : "status-active"}">${items.length}</span>
          </div>
          ${items.length ? `<div class="drawer-list">${items.slice(0, 6).map((item) => `
            <button class="drawer-item" type="button" data-route="${escapeHtml(item.route || "notifications")}" data-notification="${escapeHtml(item.id || "")}" ${item.patientId ? `data-patient-id="${escapeHtml(item.patientId)}"` : ""} ${item.admissionId ? `data-admission-id="${escapeHtml(item.admissionId)}"` : ""}>
              <strong>${escapeHtml(item.title || "Notification")}</strong>
              <small>${escapeHtml(item.message || item.detail || "")}</small>
              <span>${escapeHtml([item.time || item.createdAt || "Now", String(item.priority || "info").toUpperCase()].join(" / "))}</span>
            </button>
          `).join("")}</div>` : emptyState("No notifications yet.")}
        </section>
      `).join("") : emptyState("No notifications yet.")}
    </aside>
  `;
}

function providerStatusGrid() {
  const configured = "Configured in environment";
  const storage = fileStorageStatus();
  const providerStatus = safeOptionalData(() => hasPermission(currentUser, "settings", "view") && api.providerStatus ? api.providerStatus() : null, null);
  const emailStatus = providerStatus?.email?.status || "Not configured";
  const lastChecked = providerStatus?.lastChecked || providerStatus?.checkedAt || new Date().toISOString();
  const recommendedAction = (status) => {
    const text = String(status || "").toLowerCase();
    if (text.includes("error")) return "Review credentials and provider logs.";
    if (text.includes("not")) return "Configure environment variables before go-live.";
    return "Monitor during smoke tests.";
  };
  const providerClass = (status) => {
    const text = String(status || "").toLowerCase();
    if (text.includes("error")) return "status-blocked";
    if (text.includes("not")) return "status-draft";
    return "status-active";
  };
  const providers = [
    ["MongoDB Atlas", providerStatus?.mongodb?.status || configured, "Database"],
    ["Resend", emailStatus, "Email provider"],
    ["Cloudflare R2", providerStatus?.storage?.status || storage.status || "Not configured", "File storage"],
    ["Sentry", providerStatus?.sentry?.status || "Not configured", "Error tracking"],
    ["Better Stack", providerStatus?.betterStack?.status || "Not configured", "Backend logs"],
    ["Razorpay", providerStatus?.razorpay?.status || "Not configured", "Online payments"]
  ];
  return `
    <div class="provider-grid">
      ${providers.map(([name, status, note]) => `
        <div class="provider-card">
          <div class="provider-card-head">
            <span>${escapeHtml(name)}</span>
            ${badge(status, providerClass(status))}
          </div>
          <small>${escapeHtml(note)}</small>
          <small>Last checked: ${escapeHtml(formatDateTime(lastChecked))}</small>
          <small>${escapeHtml(recommendedAction(status))}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function uploadValidation(validation) {
  return `
    <section class="panel">
      <div class="panel-head"><h3>Validation results</h3><span class="badge ${validation.issueRows ? "risk-medium" : "status-active"}">${validation.issueRows} issues</span></div>
      <div class="metric-grid small">
        ${metricCard("Total rows", validation.totalRows, "Uploaded")}
        ${metricCard("Valid rows", validation.validRows, "Ready")}
        ${metricCard("Rows with issues", validation.issueRows, "Needs review")}
        ${metricCard("Duplicates", validation.duplicateRecords, "Detected")}
        ${metricCard("Missing values", validation.missingValues, "Fix or assign")}
        ${metricCard("Format errors", validation.formatErrors, "Review")}
      </div>
      ${validation.issues.length ? table(["Row", "Severity", "Issue", "Action"], validation.issues.map((issue) => [
        issue.row,
        badge(issue.severity, riskClass(issue.severity)),
        issue.message,
        "Fix, assign, ignore with reason, or re-upload"
      ])) : `<div class="empty">All rows passed basic validation.</div>`}
    </section>
  `;
}

function simpleOpsPage(title, rows, keys) {
  const collection = title.includes("Inventory") ? "inventory" : title.includes("Staff") ? "staff" : title.includes("Beds") ? "beds" : title.includes("Incidents") ? "incidents" : null;
  return `
    <section class="panel">
      <div class="panel-head"><h3>${escapeHtml(title)}</h3><span class="badge status-active">${rows.length} records</span></div>
      ${rows.length ? table([...keys.map(titleCase), "Actions"], rows.map((row) => [...keys.map((key) => {
        const value = row[key];
        if (["status", "risk"].includes(key)) return badge(value, key === "risk" ? riskClass(value) : statusClass(value));
        return value;
      }), gridActions(collection, row.id)])) : emptyState(`No ${title.toLowerCase()} records visible for your access scope.`)}
    </section>
  `;
}

function unauthorizedPage(page = pageFromHash()) {
  return accessDeniedPanel(page);
}

function table(headers, rows) {
  if (!rows.length) return emptyState("No records found.");
  const hasActionColumn = headers.some((header) => /actions?/i.test(String(header)));
  const normalizedRows = rows.map((row) => {
    if (Array.isArray(row)) return { cells: row, attrs: {} };
    return {
      cells: Array.isArray(row?.cells) ? row.cells : Array.isArray(row?.row) ? row.row : [],
      attrs: row?.attrs || {}
    };
  });
  const rowAttributes = (attrs = {}) => Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === true ? ` ${key}` : ` ${key}="${escapeAttribute(value)}"`)
    .join("");
  return `
    <div class="table-wrap ${hasActionColumn ? "has-sticky-actions" : ""}" role="region" aria-label="Data table" tabindex="0">
      <table>
        <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>
          ${normalizedRows.map((row) => `<tr${rowAttributes(row.attrs)}>${row.cells.map((cell) => `<td>${cell && String(cell).includes("<") ? cell : escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function gridActions(collection, id) {
  if (!collection || !id) return "";
  const module = COLLECTION_MODULES[collection];
  const edit = module && hasPermission(currentUser, module, "edit")
    ? `<button class="icon-button" type="button" data-action="open-edit" data-collection="${escapeHtml(collection)}" data-id="${escapeHtml(id)}" title="Edit ${collection === "patients" ? "patient" : "record"}" aria-label="Edit ${collection === "patients" ? "patient" : "record"}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>`
    : "";
  const remove = module && hasPermission(currentUser, module, "delete")
    ? `<button class="icon-button danger" type="button" data-action="delete-record" data-collection="${escapeHtml(collection)}" data-id="${escapeHtml(id)}" title="Delete ${collection === "patients" ? "patient" : "record"}" aria-label="Delete ${collection === "patients" ? "patient" : "record"}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg></button>`
    : "";
  return `<div class="grid-actions">${edit}${remove || ""}</div>`;
}

function gridAddButton(label, formAction) {
  const moduleMap = {
    "create-hospital": "hospitals",
    "create-branch": "branches",
    "create-ward": "wards",
    "create-bed": "beds",
    "create-user": "users",
    "create-staff": "staffRoster",
    "create-subscription": "subscriptions",
    "create-offer": "offers",
    "schedule-surgery": "ot",
    "order-radiology": "radiology",
    "register-death": "mortuary",
    "create-permission-template": "permissionTemplates",
    "create-master-data": "masterData",
    "create-appointment": "appointments",
    "register-patient": "patients",
    "create-task": "tasks",
    "generate-bill": "billing",
    "add-stock": "stock"
  };
  const module = moduleMap[formAction];
  const action = formAction === "create-user" ? "manageUsers" : "create";
  if (module && !hasPermission(currentUser, module, action)) return "";
  return `<button class="button small soft" type="button" title="Add ${escapeHtml(label)}" aria-label="Add ${escapeHtml(label)}" data-action="open-create" data-form-action="${escapeHtml(formAction)}" data-testid="${escapeHtml(addButtonTestId(formAction))}">${iconLabel(actionIcon(formAction), `Add ${label}`)}</button>`;
}

function wireCreateButtons() {
  app.querySelectorAll?.('[data-action="open-create"][data-form-action]').forEach((button) => {
    if (button.dataset.createBound === "true") return;
    button.dataset.createBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const formAction = String(event.currentTarget.dataset.formAction || "").trim();
      if (!formAction || !createForm(formAction)) {
        toast("This form is unavailable for your current access.", "error");
        return;
      }
      createTarget = formAction;
      render();
    });
  });
}

function createModal() {
  if (!createTarget) return "";
  const form = createForm(createTarget);
  if (!form) return "";
  return `
    <div class="modal-backdrop" data-testid="create-modal-backdrop" role="presentation">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Add new</p>
            <h3 id="create-modal-title" data-testid="modal-title">${escapeHtml(form.title)}</h3>
            <p>${escapeHtml(form.note)}</p>
          </div>
          <button class="icon-button" type="button" data-action="close-create" data-testid="modal-close-button">Close</button>
        </div>
        ${form.html}
      </section>
    </div>
  `;
}

function allowedCreatorRoleOptions() {
  if (currentUser.role === ROLES.SUPER_ADMIN) return `<option value="${ROLES.HOSPITAL_ADMIN}">Hospital Admin</option>`;
  if (currentUser.role === ROLES.HOSPITAL_ADMIN) return `<option value="${ROLES.BRANCH_ADMIN}">Branch Admin</option>`;
  if (currentUser.role === ROLES.BRANCH_ADMIN) return `<option value="${ROLES.BRANCH_USER}">Branch User</option>`;
  return "";
}

function jobRoleOptions() {
  return [
    "Reception User",
    "Doctor",
    "Duty Doctor",
    "Nurse",
    "Lab User",
    "Radiology User",
    "Pharmacy User",
    "Billing User",
    "Claims Officer",
    "HR / Staff Admin",
    "Inventory Officer",
    "Quality Officer",
    "Incident Officer",
    "Branch Manager",
    "Custom Role"
  ].map((role) => `<option>${role}</option>`).join("");
}

function uniquePages(pages) {
  return [...new Set(pages.filter(Boolean))];
}

function userPageCheckboxGroups() {
  const preset = uniquePages(USER_ROLE_PRESETS["Reception User"]);
  return USER_PERMISSION_GROUPS.map((group) => {
    const uniqueGroupPages = [];
    const seen = new Set();
    group.pages.forEach(([route, label, sensitive]) => {
      if (seen.has(`${route}:${label}`)) return;
      seen.add(`${route}:${label}`);
      uniqueGroupPages.push([route, label, sensitive]);
    });
    const checkedCount = uniqueGroupPages.filter(([route]) => preset.includes(route)).length;
    return `
      <fieldset class="permission-group" data-testid="${group.testId}" data-permission-group="${group.key}">
        <legend><span>${escapeHtml(group.label)}</span><small data-group-count="${group.key}">${checkedCount} selected</small></legend>
        <div class="permission-tools">
          <button class="button tiny" type="button" data-action="select-permission-group" data-group="${group.key}">Select all</button>
          <button class="button tiny ghost" type="button" data-action="clear-permission-group" data-group="${group.key}">Clear</button>
        </div>
        <div class="checkbox-grid">
          ${uniqueGroupPages.map(([route, label, sensitive]) => {
            const disabled = currentUser.role === ROLES.BRANCH_ADMIN && ["users", "settings"].includes(route);
            return `
              <label class="check-card ${sensitive ? "sensitive" : ""} ${disabled ? "disabled" : ""}">
                <input type="checkbox" name="allowedPages" value="${escapeHtml(route)}" data-page-label="${escapeHtml(label)}" data-group="${group.key}" ${preset.includes(route) ? "checked" : ""} ${disabled ? "disabled" : ""} />
                <span>${escapeHtml(label)}</span>
                ${sensitive ? `<small>Sensitive</small>` : ""}
              </label>
            `;
          }).join("")}
        </div>
      </fieldset>
    `;
  }).join("");
}

function permissionMatrixRows() {
  const defaultModules = uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
  return `
    <div class="permission-matrix" data-testid="permission-matrix">
      <div class="matrix-row matrix-head">
        <span>Module</span>
        ${USER_PERMISSION_ACTIONS.map(([, label]) => `<span>${escapeHtml(label)}</span>`).join("")}
      </div>
      ${defaultModules.map((module) => `
        <div class="matrix-row" data-permission-row="${module}">
          <strong>${escapeHtml(titleCase(module))}</strong>
          ${USER_PERMISSION_ACTIONS.map(([action]) => `
            <label class="matrix-check ${SENSITIVE_USER_PERMISSIONS.has(action) ? "sensitive" : ""}">
              <input type="checkbox" name="permission:${module}" value="${action}" ${["view", "create", "edit"].includes(action) && !SENSITIVE_USER_PERMISSIONS.has(action) ? "checked" : ""} />
              <span>${escapeHtml(action)}</span>
            </label>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function userAccessPreview() {
  const allowed = USER_ROLE_PRESETS["Reception User"];
  const allPages = uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
  const blocked = allPages.filter((route) => !allowed.includes(route)).slice(0, 8);
  return `
    <div class="access-preview" data-testid="permission-preview-panel">
      <div>
        <h4>This user will see</h4>
        <ul data-preview-allowed>${allowed.slice(0, 10).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("")}</ul>
      </div>
      <div>
        <h4>This user will NOT see</h4>
        <ul data-preview-blocked>${blocked.map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function cloneUserOptions() {
  return api.users(currentUser)
    .filter((user) => user.role === ROLES.BRANCH_USER && user.branchId === currentUser.branchId)
    .map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)} · ${escapeHtml(user.jobRole || "Custom Role")}</option>`)
    .join("");
}

function permissionTemplateOptions() {
  return api.permissionTemplates(currentUser)
    .map((template) => `<option value="${escapeHtml(template.id)}">${escapeHtml(template.templateName || template.name)} · ${escapeHtml(template.scope || "Default")}</option>`)
    .join("");
}

function branchDepartmentOptions() {
  const departments = safeOptionalData(() => api.masterDataItems(currentUser), [])
    .filter((item) => ["department", "departments", "dept", "department master"].includes(String(item.type || "").trim().toLowerCase()))
    .filter((item) => ["active", "enabled"].includes(String(item.status || "Active").trim().toLowerCase()))
    .filter((item) => !currentUser.branchId || !item.branchId || String(item.branchId) === String(currentUser.branchId));
  if (!departments.length) return "";
  return departments.map((department) => `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`).join("");
}

function appointmentDepartmentOptions(options = {}) {
  const departments = options.departments || [];
  if (!departments.length) return `<option value="">No active departments configured</option>`;
  return `<option value="">Select department</option>${departments.map((department) =>
    `<option value="${escapeHtml(department.name)}">${escapeHtml(department.name)}</option>`
  ).join("")}`;
}

function appointmentDoctorOptions(options = {}) {
  const doctors = options.doctors || [];
  if (!doctors.length) return `<option value="">No active doctors configured</option>`;
  return `<option value="">Select doctor</option>${doctors.map((doctor) =>
    `<option value="${escapeHtml(doctor.name)}" data-department="${escapeHtml(doctor.department || "")}">${escapeHtml(doctor.name)}${doctor.department ? ` · ${escapeHtml(doctor.department)}` : ""}</option>`
  ).join("")}`;
}

function filterAppointmentDoctors(form) {
  const department = form?.querySelector("[data-appointment-department]")?.value || "";
  const doctorSelect = form?.querySelector("[data-appointment-doctor]");
  if (!doctorSelect) return;
  let visibleDoctors = 0;
  [...doctorSelect.options].forEach((option) => {
    if (option.dataset.noDoctorOption === "true") {
      option.remove();
      return;
    }
    if (!option.value) {
      option.hidden = false;
      option.disabled = false;
      return;
    }
    const optionDepartment = option.dataset.department || "";
    const visible = !department || !optionDepartment || optionDepartment === department;
    if (visible) visibleDoctors += 1;
    option.hidden = !visible;
    option.disabled = !visible;
  });
  if (department && visibleDoctors === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.dataset.noDoctorOption = "true";
    option.textContent = "No doctors available for this department.";
    doctorSelect.appendChild(option);
  }
  if (doctorSelect.selectedOptions[0]?.disabled) doctorSelect.value = "";
}

function fillAppointmentFromPatient(form) {
  const select = form?.querySelector("[data-existing-patient]");
  if (!select) return;
  const option = select.selectedOptions[0];
  const existing = Boolean(option?.value);
  const fill = (name, value, lock = existing) => {
    const input = form.elements[name];
    if (!input) return;
    input.value = value || "";
    if (["patientName", "mobile", "age", "gender"].includes(name)) input.readOnly = lock;
  };
  fill("patientName", option?.dataset.name);
  fill("mobile", option?.dataset.mobile);
  fill("age", option?.dataset.age);
  if (form.elements.gender) form.elements.gender.value = option?.dataset.gender || "Male";
  if (form.elements.gender) form.elements.gender.disabled = existing;
  fill("mrn", option?.dataset.mrn, true);
  fill("dob", option?.dataset.dob, true);
  fill("email", option?.dataset.email, true);
  fill("emergencyContact", option?.dataset.emergencyContact, true);
  fill("allergies", option?.dataset.allergies, true);
}

function branchUserPermissionBuilder(branches) {
  const assignedBranch = branches.find((branch) => String(branch.id) === String(currentUser.branchId)) || {};
  const assignedBranchType = assignedBranch.branchType || currentUser.branchType || "Main Branch";
  const assignedBranchLabel = [
    assignedBranch.name || currentUser.branchName || "Assigned branch",
    currentUser.branchId ? `ID: ${currentUser.branchId}` : ""
  ].filter(Boolean).join(" / ");
  const departmentOptions = branchDepartmentOptions();
  const canCreateStaff = Boolean(currentUser.branchId && departmentOptions);
  const clones = cloneUserOptions();
  const templates = permissionTemplateOptions();
  return `
    <form class="user-wizard" data-action="create-user">
      <section class="wizard-step">
        <div class="step-index">1</div>
        <div>
          <h4>Basic Details</h4>
          <p>Create a staff login. Temporary password is shown only in this confirmation flow.</p>
          <div class="form-grid compact-grid">
            <label>Full name<input name="name" required placeholder="Asha Kumar" data-testid="user-form-name" /></label>
            <label>Login username<input name="email" type="text" required placeholder="asha-login" autocomplete="username" data-testid="user-form-username" /></label>
            <label>Email<input name="contactEmail" type="email" placeholder="asha@hospital.com" data-testid="user-form-email" /></label>
            <label>Mobile number<input name="mobile" placeholder="9876543210" /></label>
            ${passwordField({ label: "Temporary password", name: "password", minlength: 8, autocomplete: "new-password", testid: "user-form-temp-password" })}
            <label>Account status<select name="status"><option>Active</option><option>Pending Invite</option><option>Disabled</option></select></label>
            <label class="check-line span-2"><input type="checkbox" name="mustChangePassword" value="Yes" checked /> Must change password on first login</label>
            <input type="hidden" name="role" value="${ROLES.BRANCH_USER}" data-testid="form-role" />
          </div>
        </div>
      </section>

      <section class="wizard-step">
        <div class="step-index">2</div>
        <div>
          <h4>Job Role</h4>
          <p data-role-preset-message>Default access preset applied for Reception User. You can adjust allowed pages before saving.</p>
          <div class="form-grid compact-grid">
            <label>Job role<select name="jobRole" data-testid="user-form-job-role">${jobRoleOptions()}</select></label>
            <label>Department${departmentOptions ? `<select name="department" required data-testid="user-form-department"><option value="">Select department</option>${departmentOptions}</select>` : `<select name="department" required disabled data-testid="user-form-department"><option value="">Create department master data first</option></select>`}</label>
            <label>Apply permission template<select name="templateId" data-testid="permission-template-select"><option value="">Use job role preset</option>${templates}</select></label>
            <label class="span-2">Clone permissions from existing user<select name="cloneFromUserId" data-testid="clone-user-select"><option value="">Do not clone</option>${clones}</select></label>
          </div>
          ${departmentOptions ? "" : `<div class="notice subtle">No active departments are configured for this branch yet. Add departments in Master Data before saving staff users.</div>`}
          <p class="helper-text">Clone/template copies only job role, allowed pages, and permission matrix. It never copies password, login status, audit history, or personal details.</p>
        </div>
      </section>

      <section class="wizard-step">
        <div class="step-index">3</div>
        <div>
          <h4>Branch Assignment</h4>
          <p>This is filled from the logged-in Branch Admin and cannot be changed.</p>
          <div class="form-grid compact-grid">
            <label>Branch (${escapeHtml(assignedBranchType)})<input value="${escapeHtml(assignedBranchLabel)}" readonly data-testid="user-form-branch-display" /></label>
            <input type="hidden" name="branchId" value="${escapeHtml(currentUser.branchId || "")}" data-testid="user-form-branch" />
            <label class="check-line span-2"><input type="checkbox" name="shiftOnly" value="Yes" /> Allow login only during assigned shift</label>
          </div>
        </div>
      </section>

      <section class="wizard-step">
        <div class="step-index">4</div>
        <div>
          <h4>Allowed Pages / Modules</h4>
          <p>Sidebar visibility and direct URL access both use these assigned pages.</p>
          <input class="panel-search" placeholder="Search pages or modules" data-testid="permissions-search-input" data-permission-search />
          <div class="permission-groups">${userPageCheckboxGroups()}</div>
          <input type="hidden" name="allowedModules" data-allowed-modules value="${escapeHtml(USER_ROLE_MODULES["Reception User"].join(","))}" />
        </div>
      </section>

      <section class="wizard-step">
        <div class="step-index">5</div>
        <div>
          <h4>Permission Matrix</h4>
          <p>View is required before create, edit, export, or sensitive actions can be used.</p>
          ${permissionMatrixRows()}
          <div class="notice subtle hidden" data-testid="sensitive-permission-warning" data-sensitive-warning>
            Sensitive permission selected. Add a reason and confirm before saving.
          </div>
          <label class="span-2">Reason for sensitive access<textarea name="sensitiveReason" placeholder="Required for export, delete, refund, manage users, or manage settings."></textarea></label>
          <label class="check-line"><input type="checkbox" name="sensitiveConfirmed" value="Yes" /> I confirm sensitive access is required</label>
        </div>
      </section>

      <section class="wizard-step">
        <div class="step-index">6</div>
        <div>
          <div class="panel-head tight">
            <div><h4>Access Preview</h4><p>Review what this user can and cannot open.</p></div>
            <button class="button small" type="button" data-action="preview-permissions" data-testid="permission-preview-button">Preview User Access</button>
          </div>
          ${userAccessPreview()}
        </div>
      </section>

      <section class="wizard-step">
        <div class="step-index">7</div>
        <div>
          <h4>Save User / Send Invite</h4>
          <p>Save creates the account now. Send invite keeps the account pending until password setup.</p>
          ${canCreateStaff ? "" : `<div class="notice subtle">Create at least one active Department in Master Data for this branch before creating staff users.</div>`}
        </div>
      </section>
      <div class="wizard-sticky-footer">
        <span class="wizard-sticky-footer-label">Step 7 of 7 — ready to save</span>
        <div class="button-row">
          <button class="button primary" type="submit" data-testid="save-user-button">Save User</button>
          <button class="button soft" type="submit" name="inviteMode" value="Yes" data-testid="send-invite-button">Send Invite</button>
        </div>
      </div>
    </form>
  `;
}

function createForm(action) {
  const hospitals = hasPermission(currentUser, "hospitals", "view") ? safeOptionalData(() => api.hospitals(currentUser)) : [];
  const branches = hasPermission(currentUser, "branches", "view") ? safeOptionalData(() => api.branches(currentUser)) : [];
  const patientFormActions = new Set([
    "register-patient",
    "add-to-vitals-queue",
    "create-appointment",
    "record-vitals",
    "complete-consultation",
    "book-followup",
    "create-admission",
    "generate-bill",
    "upload-document",
    "create-consent",
    "submit-feedback"
  ]);
  const patients = patientFormActions.has(action) && hasPermission(currentUser, "patients", "view")
    ? safeOptionalData(() => api.patients(currentUser))
    : [];
  const vitalsQueueOptions = action === "add-to-vitals-queue" ? (() => {
    const today = localDateInputValue();
    const appointments = safeOptionalData(() => api.appointments(currentUser), []).filter((item) => String(item.date || item.appointmentDate || item.createdAt || "").slice(0, 10) === today && (!currentUser.branchId || !item.branchId || String(item.branchId) === String(currentUser.branchId)));
    const queue = safeOptionalData(() => api.queueTokens(currentUser), []);
    const vitals = safeOptionalData(() => api.vitals(currentUser), []);
    return appointments.filter((appointment, index, all) => appointment.patientId && all.findIndex((item) => String(item.patientId) === String(appointment.patientId)) === index && !queue.some((item) => String(item.patientId) === String(appointment.patientId) && !["Completed", "Cancelled"].includes(item.status)) && !vitals.some((item) => String(item.appointmentId || "") === String(appointment.id))).map((appointment) => ({ appointment, patient: patients.find((item) => String(item.id) === String(appointment.patientId)) })).filter((item) => item.patient);
  })() : [];
  const appointmentLookup = action === "create-appointment" ? safeOptionalData(() => api.appointmentOptions(currentUser), { departments: [], doctors: [] }) : { departments: [], doctors: [] };
  const activePlans = currentUser.role === ROLES.SUPER_ADMIN ? safeOptionalData(() => api.subscriptions(currentUser)).filter((plan) => plan.status !== "Disabled") : [];
  const mainBranchExists = branches.some((branch) => (branch.branchType || "Main Branch") === "Main Branch");
  const wardsForBedForm = action === "create-bed" && hasPermission(currentUser, "wards", "view") ? safeOptionalData(() => api.wards(currentUser), []) : [];
  const admissionsForManage = action === "manage-admission" ? safeOptionalData(() => api.admissions(currentUser), []) : [];
  const managedAdmission = admissionsForManage.find((item) => String(item.id || item._id) === String(selectedAdmissionId)) || null;
  const managePatients = action === "manage-admission" ? safeOptionalData(() => api.patients(currentUser), []) : [];
  const managedPatient = managePatients.find((item) => String(item.id) === String(managedAdmission?.patientId)) || null;
  const manageWards = action === "manage-admission" ? safeOptionalData(() => api.wards(currentUser), []).filter((item) => !item.branchId || String(item.branchId) === String(currentUser.branchId)) : [];
  const manageBeds = action === "manage-admission" ? safeOptionalData(() => api.beds(currentUser), []).filter((item) => (!item.branchId || String(item.branchId) === String(currentUser.branchId)) && ["Available", "Cleaning"].includes(item.status || "Available")) : [];
  const reviewQueue = action === "review-opd-vitals" ? safeOptionalData(() => api.queueTokens(currentUser), []) : [];
  const reviewedToken = reviewQueue.find((item) => String(item.id) === String(selectedQueueTokenId));
  const reviewPatients = action === "review-opd-vitals" ? safeOptionalData(() => api.patients(currentUser), []) : [];
  const reviewedPatient = reviewPatients.find((item) => String(item.id) === String(reviewedToken?.patientId));
  const reviewedVitals = action === "review-opd-vitals" ? safeOptionalData(() => api.vitals(currentUser), []).filter((item) => String(item.patientId) === String(reviewedToken?.patientId) && (String(item.queueTokenId || "") === String(reviewedToken?.id) || String(item.appointmentId || "") === String(reviewedToken?.appointmentId))).sort((a,b) => new Date(b.recordedAt || b.createdAt || 0) - new Date(a.recordedAt || a.createdAt || 0))[0] : null;
  const userRoleOptions = allowedCreatorRoleOptions();
  const hospitalBranchOptions = branches.length
    ? `<option value="">Select branch</option>${branches.map((branch) => {
        const label = `${branch.branchType || "Main Branch"}: ${branch.name}${branch.branchCode ? ` (${branch.branchCode})` : ""}`;
        return `<option value="${escapeHtml(branch.id)}">${escapeHtml(label)}</option>`;
      }).join("")}`
    : `<option value="">Create a branch first</option>`;
  const staffDepartments = action === "create-staff"
    ? safeOptionalData(() => api.masterDataItems(currentUser), []).filter((item) => item.type === "Department" && String(item.status || "Active").toLowerCase() === "active")
    : [];
  const staffRoleOptions = [["Doctor", "Doctor"], ["Nurse", "Nurse"], ["Reception User", "Receptionist"], ["Billing User", "Billing"], ["Lab User", "Lab"], ["Pharmacy User", "Pharmacy"], ["Radiology User", "Radiology"], ["Mortuary Officer", "Mortuary"]];
  const forms = {
    "review-opd-vitals": reviewedToken && reviewedVitals ? { title:"Review OPD Vitals", note:"Read-only Nurse-recorded vitals for this OPD encounter.", html:`<div class="notice subtle"><strong>${escapeHtml(reviewedPatient?.name || reviewedToken.patientName || "Unknown Patient")}</strong><br>${escapeHtml(reviewedPatient?.mrn || reviewedToken.mrn || "-")} · Token ${escapeHtml(reviewedToken.tokenNumber || "-")} · ${escapeHtml(reviewedToken.appointmentId || "-")} · ${escapeHtml(reviewedToken.department || "-")} · ${escapeHtml(reviewedToken.doctor || currentUser.name || "-")}</div><div class="mini-grid"><span><strong>${escapeHtml(reviewedVitals.temperature || "-")}</strong><small>Temperature</small></span><span><strong>${escapeHtml(reviewedVitals.bloodPressure || "-")}</strong><small>Blood Pressure</small></span><span><strong>${escapeHtml(reviewedVitals.pulse || "-")}</strong><small>Pulse</small></span><span><strong>${escapeHtml(reviewedVitals.respiratoryRate || "-")}</strong><small>Respiratory Rate</small></span><span><strong>${escapeHtml(reviewedVitals.spo2 || "-")}</strong><small>SpO2</small></span><span><strong>${escapeHtml(reviewedVitals.bloodSugar || "-")}</strong><small>Blood Sugar</small></span><span><strong>${escapeHtml(reviewedVitals.painScore || "-")}</strong><small>Pain Score</small></span><span><strong>${escapeHtml(reviewedVitals.recordedBy || "-")}</strong><small>Recorded By</small></span></div><div class="notice subtle">Symptoms: ${escapeHtml(reviewedVitals.symptoms || "-")}<br>Notes: ${escapeHtml(reviewedVitals.notes || "-")}<br>Recorded: ${escapeHtml(formatDateTime(reviewedVitals.recordedAt || reviewedVitals.createdAt))}</div>` } : null,
    "manage-admission": managedAdmission ? {
      title: "Manage Admission",
      note: "Assign an available ward and bed to this admission request.",
      html: `<form class="form-grid compact-grid" data-action="assign-admission-bed">
        <input type="hidden" name="admissionId" value="${escapeHtml(managedAdmission.id)}" />
        <div class="notice subtle span-2"><strong>${escapeHtml(managedPatient?.name || managedAdmission.patientName || "Unknown Patient")}</strong><br>${escapeHtml(managedPatient?.mrn || managedAdmission.mrn || "MRN unavailable")} · ${escapeHtml(managedAdmission.id)} · ${escapeHtml(managedAdmission.department || "Department pending")} · ${escapeHtml(managedAdmission.admittingDoctor || "Doctor pending")} · ${escapeHtml(managedAdmission.admissionType || "Admission")} · ${escapeHtml(managedAdmission.reason || "Reason not recorded")} · ${escapeHtml(managedAdmission.status || managedAdmission.admissionStatus || "Admission Requested")}</div>
        <label>Ward<select name="wardId" required data-admission-ward><option value="">Select ward</option>${manageWards.map((ward) => `<option value="${escapeHtml(ward.id)}">${escapeHtml(ward.name || ward.wardName || ward.ward)}</option>`).join("")}</select></label>
        <label>Bed<select name="bedId" required data-admission-bed><option value="">Select available bed</option>${manageBeds.map((bed) => `<option value="${escapeHtml(bed.id)}" data-ward-id="${escapeHtml(bed.wardId || "")}">${escapeHtml(bed.bed || bed.bedNumber || bed.name)}</option>`).join("")}</select></label>
        <button class="button primary" type="submit">Save Ward / Bed</button>
      </form>`
    } : null,
    "create-hospital": {
      title: currentUser.role === ROLES.HOSPITAL_ADMIN ? "Create Hospital Profile" : "Hospital customer",
      note: currentUser.role === ROLES.HOSPITAL_ADMIN ? "Create the parent hospital organization profile. Branches remain managed separately." : "Create the hospital group first. Admin login can be created from Admin Users.",
      html: `
        <form class="form-grid compact-grid hospital-profile-form" data-action="create-hospital" novalidate>
          ${currentUser.role === ROLES.HOSPITAL_ADMIN ? `<h4 class="form-section-title span-2">Hospital Information</h4><label>Hospital Name*<input name="name" required value="Janatha Hospitals" /></label><label>Hospital Code*<input name="hospitalCode" required value="JANATHA" /></label><label>Hospital Type<select name="hospitalType"><option>Multi-Speciality Hospital</option><option>General Hospital</option><option>Specialty Hospital</option><option>Clinic</option><option>Other</option></select></label><label>Registration Number<input name="registrationNumber" /></label>
          <h4 class="form-section-title span-2">Address</h4><label class="span-2">Address Line*<input name="address" required /></label><label>City*<input name="city" required /></label><label>State*<input name="state" required /></label><label>PIN Code*<input name="pinCode" required pattern="[0-9]{6}" maxlength="6" /></label>
          <h4 class="form-section-title span-2">Contact Information</h4><label>Contact Number*<input name="contactNumber" required /></label><label>Email*<input name="email" type="email" required /></label><label>Website<input name="website" type="url" placeholder="https://janathahospitals.com" /></label>
          <h4 class="form-section-title span-2">Hospital Logo</h4><label class="span-2">Upload Hospital Logo<input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp" data-hospital-logo-input /></label><input type="hidden" name="logoDataUrl" data-hospital-logo-value /><div class="hospital-logo-preview span-2" data-hospital-logo-preview><small>Logo preview</small></div>
          <label>Status*<select name="status" required><option selected>Active</option><option>Inactive</option></select></label><div class="button-row span-2 footer-actions"><button class="button ghost" type="button" data-action="close-create">Cancel</button><button class="button primary" type="submit" data-testid="modal-submit-button">Save Hospital Profile</button></div>` : `<label>Hospital name<input name="name" required placeholder="Metro Health Group" /></label><label>Owner name<input name="owner" required placeholder="Owner or CEO" /></label><label class="span-2">Plan<select name="plan">${activePlans.length ? activePlans.map((plan) => `<option value="${escapeAttribute(plan.name)}">${escapeHtml(plan.name)} — ${escapeHtml(plan.branches ?? 0)} branches · ${escapeHtml(plan.users ?? 0)} users · ${escapeHtml(plan.storageGb ?? 0)} GB storage</option>`).join("") : `<option>Growth</option>`}</select></label><div class="notice subtle span-2">Branch limit, user limit, and storage limit are set from the selected plan. Manage plan limits from Subscriptions.</div><button class="button primary" type="submit" data-testid="modal-submit-button">Create hospital</button>`}
        </form>`
    },
    "create-branch": {
      title: "Add Branch",
      note: "Create a hospital location. A Branch Admin can be assigned separately after saving.",
      html: `
        <form class="form-grid compact-grid branch-form" data-action="create-branch" novalidate>
          <h4 class="form-section-title span-2">Basic Information</h4>
          <label>Branch Name*<input name="name" required placeholder="Hyderabad Branch" /></label>
          <label>Branch Code*<input name="branchCode" required placeholder="HYD001" autocomplete="off" /></label>
          <label>Status*<select name="status" required><option selected>Active</option><option>Inactive</option></select></label>
          <input type="hidden" name="branchType" value="${mainBranchExists ? "Sub Branch" : "Main Branch"}" />
          <h4 class="form-section-title span-2">Address</h4>
          <label class="span-2">Address Line<input name="address" placeholder="Street and area" /></label>
          <label>City*<input name="city" required placeholder="Hyderabad" /></label>
          <label>State*<input name="state" required placeholder="Telangana" /></label>
          <label>PIN Code*<input name="pinCode" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="500001" /></label>
          <h4 class="form-section-title span-2">Contact Information</h4>
          <label>Contact Number*<input name="contactNumber" required inputmode="tel" pattern="[0-9+() -]{7,15}" placeholder="9876543210" /></label>
          <label>Email<input name="email" type="email" placeholder="branch@hospital.com" /></label>
          <h4 class="form-section-title span-2">Working Hours</h4>
          <label>Opening Time<input name="openingTime" type="time" /></label>
          <label>Closing Time<input name="closingTime" type="time" /></label>
          <div class="button-row span-2 footer-actions"><button class="button ghost" type="button" data-action="close-create">Cancel</button><button class="button primary" type="submit" data-testid="modal-submit-button">Save Branch</button></div>
        </form>`
    },
    "create-ward": {
      title: "Ward",
      note: "Wards group beds by floor and department for admission and occupancy tracking.",
      html: `
        <form class="form-grid compact-grid" data-action="create-ward">
          <label>Ward name<input name="name" required placeholder="Ward A" /></label>
          <label>Floor<input name="floor" placeholder="2nd Floor" /></label>
          <label>Department<select name="department">${branchDepartmentOptions() || `<option value="">No active departments configured</option>`}</select></label>
          <label>Total beds<input name="totalBeds" type="number" min="1" value="10" /></label>
          <label>Status<select name="status"><option>Active</option><option>Inactive</option></select></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Create ward</button>
        </form>`
    },
    "create-bed": {
      title: "Bed",
      note: "Add a bed to an existing ward so it can be assigned during admission.",
      html: `
        <form class="form-grid compact-grid" data-action="create-bed">
          <label>Bed number<input name="bed" required placeholder="A-101" /></label>
          <label>Ward<select name="ward" required>${wardsForBedForm.length
            ? `<option value="">Select ward</option>${wardsForBedForm.map((ward) => `<option value="${escapeHtml(ward.name)}">${escapeHtml(ward.name)}</option>`).join("")}`
            : `<option value="">Create a ward first</option>`}</select></label>
          <label>Room<input name="room" placeholder="Room 204" /></label>
          <label>Status<select name="status"><option>Available</option><option>Reserved</option><option>Cleaning</option><option>Maintenance</option></select></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Create bed</button>
        </form>`
    },
    "create-staff": currentUser.role === ROLES.HOSPITAL_ADMIN ? {
      title: "Add Staff",
      note: "Create an employee login and assign it to an existing branch and department.",
      html: `<form class="form-grid compact-grid staff-form" data-action="create-staff" novalidate>
        <label>Full Name*<input name="name" required placeholder="Asha Kumar" /></label><label>Employee ID*<input name="employeeId" required placeholder="EMP001" /></label>
        <label>Email*<input name="contactEmail" type="email" required placeholder="asha@hospital.com" /></label><label>Mobile Number*<input name="mobile" required inputmode="tel" placeholder="9876543210" /></label>
        <label>Username / Login*<input name="email" required autocomplete="username" placeholder="asha-login" /></label>${passwordField({ label: "Password", name: "password", minlength: 8, autocomplete: "new-password" })}
        ${passwordField({ label: "Confirm Password", name: "confirmPassword", minlength: 8, autocomplete: "new-password" })}
        <label>Role*<select name="jobRole" required><option value="">Select role</option>${staffRoleOptions.map(([value, label]) => `<option value="${escapeAttribute(value)}">${escapeHtml(label)}</option>`).join("")}</select></label>
        <label>Branch*<select name="branchId" required data-staff-branch><option value="">Select branch</option>${branches.filter((branch) => String(branch.status || "Active").toLowerCase() === "active").map((branch) => `<option value="${escapeAttribute(branch.id)}">${escapeHtml(branch.name)}</option>`).join("")}</select></label>
        <label>Department*<select name="department" required data-staff-department><option value="">Select branch first</option>${staffDepartments.map((department) => `<option value="${escapeAttribute(department.name)}" data-branch-id="${escapeAttribute(department.branchId || "all")}" hidden>${escapeHtml(department.name)}</option>`).join("")}</select></label>
        <label>Status*<select name="status" required><option selected>Active</option><option>Inactive</option></select></label>
        <input type="hidden" name="role" value="${ROLES.BRANCH_USER}" /><div class="button-row span-2 footer-actions"><button class="button ghost" type="button" data-action="close-create">Cancel</button><button class="button primary" type="submit">Create Login</button></div>
      </form>`
    } : null,
    "create-user": {
      title: currentUser.role === ROLES.SUPER_ADMIN ? "Hospital admin login" : currentUser.role === ROLES.HOSPITAL_ADMIN ? "Branch admin login" : "Branch staff login",
      note: currentUser.role === ROLES.BRANCH_ADMIN
        ? "Create branch staff, choose a job role, assign pages, preview access, then save."
        : currentUser.role === ROLES.HOSPITAL_ADMIN
          ? "Create a Branch Admin or Sub-Branch Admin assigned to one branch. Staff users are created inside that branch by the Branch Admin."
          : "Create the next admin level in the hospital hierarchy.",
      html: currentUser.role === ROLES.BRANCH_ADMIN ? branchUserPermissionBuilder(branches) : `
        <form class="form-grid compact-grid" data-action="create-user">
          <label>Name<input name="name" required placeholder="Asha Kumar" data-testid="user-form-name" /></label>
          <label>Login username<input name="email" type="text" required placeholder="asha-login" autocomplete="username" data-testid="user-form-username" /></label>
          <label>Email<input name="contactEmail" type="email" placeholder="asha@hospital.com" data-testid="user-form-email" /></label>
          ${passwordField({ label: "Temporary password", name: "password", minlength: 8, autocomplete: "new-password", testid: "user-form-temp-password" })}
          <label>Role<select name="role" data-testid="form-role">${userRoleOptions}</select></label>
          <input type="hidden" name="jobRole" value="${currentUser.role === ROLES.SUPER_ADMIN ? "Hospital Admin" : "Branch Admin"}" data-testid="user-form-job-role" />
          ${currentUser.role === ROLES.SUPER_ADMIN ? `<label>Hospital<select name="hospitalId" required data-testid="form-hospital"><option value="">Select hospital</option>${hospitals.map((hospital) => `<option value="${hospital.id}">${escapeHtml(hospital.name)}</option>`).join("")}</select></label>` : ""}
          ${currentUser.role === ROLES.HOSPITAL_ADMIN ? `<label>Hospital group branches<select name="branchId" required data-testid="user-form-branch">${hospitalBranchOptions}</select></label>` : ""}
          <label>Account status<select name="status"><option>Active</option><option>Pending Invite</option><option>Disabled</option></select></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">${currentUser.role === ROLES.HOSPITAL_ADMIN ? "Create branch admin" : "Create user"}</button>
        </form>`
    },
    "create-master-data": {
      title: "Master record",
      note: "Add one setup item such as department, doctor, ward, service, medicine, or threshold.",
      html: `
        <form class="form-grid compact-grid" data-action="create-master-data">
          <label>Type<select name="type"><option>Department</option><option>Doctor</option><option>Nurse</option><option>Ward</option><option>Room</option><option>Bed</option><option>Service Price</option><option>Consultation Service</option><option>Lab Test</option><option>Radiology Test</option><option>Medicine</option><option>Inventory Item</option><option>Insurance Company</option><option>Payment Mode</option><option>Appointment Slot</option><option>Alert Threshold</option></select></label>
          <label>Name<input name="name" required placeholder="Neurology or Consultation Fee" /></label>
          <label>Code<input name="code" placeholder="NEUR" /></label>
          <label>Department<input name="department" placeholder="OPD" /></label>
          <label>Category<select name="category"><option></option><option>Registration Fee</option><option>Consultation Fee</option><option>Lab Test Fee</option><option>Radiology Fee</option><option>Procedure Fee</option><option>Bed Charges</option><option>Nursing Charges</option><option>Pharmacy Item Price</option><option>Emergency Charges</option><option>Package Charges</option></select></label>
          <label>Price<input name="price" type="number" value="0" /></label>
          <label>Tax %<input name="taxPercentage" type="number" value="0" /></label>
          <label>Effective from<input name="effectiveFrom" type="date" value="${localDateInputValue()}" /></label>
          <label class="span-2">Description<textarea name="description" placeholder="Short description"></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Create master record</button>
        </form>`
    },
    "create-permission-template": {
      title: "Permission template",
      note: "Create a reusable permission preset from a job role. You can adjust user access again before saving a user.",
      html: `
        <form class="form-grid compact-grid" data-action="create-permission-template">
          <label>Template name<input name="templateName" required placeholder="Senior Reception Preset" /></label>
          <label>Job role<select name="jobRole" data-testid="template-job-role">${jobRoleOptions()}</select></label>
          <label>Scope<select name="scope"><option>${currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital Scope" : "Branch Scope"}</option><option>Branch Scope</option></select></label>
          <label>Status<select name="status"><option>Active</option><option>Inactive</option></select></label>
          <label class="span-2">Allowed pages<input name="allowedPages" placeholder="Optional comma-separated page routes; leave blank to use selected job role preset" /></label>
          <label class="span-2">Allowed modules<input name="allowedModules" placeholder="Optional comma-separated modules; leave blank to use selected job role preset" /></label>
          <div class="notice subtle span-2">Sensitive permissions in a template will show warnings during user review and are audited when the template is created or applied.</div>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Create template</button>
        </form>`
    },
    "create-subscription": {
      title: "Subscription plan",
      note: "Create a SaaS plan with limits, storage, support level, and enabled modules.",
      html: `
        <form class="form-grid compact-grid" data-action="create-subscription">
          <label>Plan name<input name="name" required placeholder="Growth" /></label>
          <label>Monthly price<input name="monthlyPrice" type="number" min="0" value="0" /></label>
          <label>Yearly price<input name="yearlyPrice" type="number" min="0" value="0" /></label>
          <label>Max branches<input name="branches" type="number" min="1" value="3" /></label>
          <label>Max users<input name="users" type="number" min="1" value="80" /></label>
          <label>Storage limit, GB<input name="storageGb" type="number" min="1" value="50" /></label>
          <label>Support level<select name="supportLevel"><option>Standard</option><option>Priority</option><option>Enterprise</option></select></label>
          <label>Status<select name="status"><option>Draft</option><option selected>Active</option><option>Disabled</option></select></label>
          <label class="span-2">Enabled modules<textarea name="modules" placeholder="Appointments, Billing, Pharmacy, Reports">${escapeHtml(MASTER_MODULES.slice(0, 8).join(", "))}</textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Create plan</button>
        </form>`
    },
    "create-offer": {
      title: "Offer / coupon",
      note: "Create a discount offer Super Admin can apply to subscription plans.",
      html: `
        <form class="form-grid compact-grid" data-action="create-offer">
          <label>Offer name<input name="name" required placeholder="New Year Launch" /></label>
          <label>Coupon code<input name="code" required placeholder="NY2026" style="text-transform:uppercase" /></label>
          <label>Discount type<select name="discountType"><option value="Percent" selected>Percent (%)</option><option value="Flat">Flat amount</option></select></label>
          <label>Discount value<input name="discountValue" type="number" min="0" value="10" /></label>
          <label>Valid from<input name="validFrom" type="date" /></label>
          <label>Valid to<input name="validTo" type="date" /></label>
          <label>Max redemptions<input name="maxRedemptions" type="number" min="0" value="0" placeholder="0 = unlimited" /></label>
          <label>Status<select name="status"><option selected>Active</option><option>Draft</option><option>Disabled</option></select></label>
          <label class="span-2">Applies to plans<input name="appliesToPlans" placeholder="All plans (or: Growth, Enterprise)" value="All plans" /></label>
          <label class="span-2">Description<textarea name="description" placeholder="Promotion details shown to hospital admins."></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Create offer</button>
        </form>`
    },
    "schedule-surgery": {
      title: "Schedule surgery",
      note: "Book an operation theatre slot and surgical team.",
      html: `
        <form class="form-grid compact-grid" data-action="schedule-surgery">
          <label>Patient name<input name="patientName" required placeholder="Patient full name" /></label>
          <label>MRN<input name="mrn" placeholder="MRN (optional)" /></label>
          <label>Procedure / surgery<input name="procedure" required placeholder="e.g. Laparoscopic Appendectomy" /></label>
          <label>Surgeon<input name="surgeon" required placeholder="Lead surgeon" /></label>
          <label>Anaesthetist<input name="anaesthetist" placeholder="Anaesthetist" /></label>
          <label>Theatre / OT room<input name="theatre" placeholder="e.g. OT-1" /></label>
          <label>Scheduled date<input name="scheduledDate" type="date" required /></label>
          <label>Scheduled time<input name="scheduledTime" type="time" /></label>
          <label>Priority<select name="priority"><option selected>Elective</option><option>Urgent</option><option>Emergency</option></select></label>
          <label>Anaesthesia type<select name="anaesthesiaType"><option>General</option><option>Regional / Spinal</option><option>Local</option><option>Sedation</option></select></label>
          <label class="span-2">Pre-op checklist / notes<textarea name="preOpChecklist" placeholder="Consent signed, fasting confirmed, investigations ready, cross-match done..."></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Schedule surgery</button>
        </form>`
    },
    "register-death": {
      title: "Register death / receive body",
      note: "Record a death in the mortuary register and assign cold-storage.",
      html: `
        <form class="form-grid compact-grid" data-action="register-death">
          <label>Deceased name<input name="deceasedName" required placeholder="Full name of deceased" /></label>
          <label>MRN<input name="mrn" placeholder="MRN (optional)" /></label>
          <label>Age<input name="age" type="number" min="0" placeholder="Age" /></label>
          <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
          <label>Date of death<input name="dateOfDeath" type="date" required /></label>
          <label>Time of death<input name="timeOfDeath" type="time" /></label>
          <label>Cold-storage bay<input name="bayNumber" placeholder="e.g. Bay-3" /></label>
          <label>Cause of death<input name="causeOfDeath" placeholder="Provisional cause" /></label>
          <label>MLC case?<select name="mlcCase"><option value="">No</option><option value="true">Yes (medico-legal)</option></select></label>
          <label>Brought in dead?<select name="broughtInDead"><option value="">No</option><option value="true">Yes</option></select></label>
          <label class="span-2">Notes / identification marks<textarea name="notes" placeholder="Police station (if MLC), identification, belongings handed over..."></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Register death</button>
        </form>`
    },
    "order-radiology": {
      title: "Order imaging study",
      note: "Raise a radiology / imaging order (RIS).",
      html: `
        <form class="form-grid compact-grid" data-action="order-radiology">
          <label>Patient name<input name="patientName" required placeholder="Patient full name" /></label>
          <label>MRN<input name="mrn" placeholder="MRN (optional)" /></label>
          <label>Modality<select name="modality" required><option>X-Ray</option><option>CT</option><option>MRI</option><option>Ultrasound</option><option>Mammography</option><option>PET-CT</option><option>Fluoroscopy</option><option>DEXA</option><option>Angiography</option></select></label>
          <label>Study / scan<input name="studyType" required placeholder="e.g. Chest PA, CT Brain plain" /></label>
          <label>Body part / region<input name="bodyPart" placeholder="e.g. Chest, Brain" /></label>
          <label>Priority<select name="priority"><option>Routine</option><option>Urgent</option><option>STAT</option></select></label>
          <label>Referring doctor<input name="referredBy" placeholder="Ordering doctor" /></label>
          <label class="span-2">Clinical history / reason<textarea name="clinicalHistory" placeholder="Relevant history and clinical question for the radiologist."></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Order study</button>
        </form>`
    },
    "request-restore": {
      title: "Restore request",
      note: "Submit a restore request for approval. The app will not execute a destructive restore.",
      html: `
        <form class="form-grid compact-grid" data-action="request-restore">
          <label>Requested by<input name="requestedBy" value="${escapeHtml(currentUser.name || currentUser.email)}" disabled /></label>
          <label>Approval status<select name="approvalStatus"><option>Requested</option><option disabled>Approved</option><option disabled>Rejected</option><option disabled>Completed</option></select></label>
          <label class="span-2">Restore reason<textarea name="notes" required placeholder="Explain what data needs review and why restore may be needed."></textarea></label>
          <div class="notice subtle span-2">Restore execution remains manual in MongoDB Atlas and requires authorized approval outside this app.</div>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Submit restore request</button>
        </form>`
    },
    "create-appointment": {
      title: "Appointment",
      note: "Book walk-in, phone, website, WhatsApp, referral, emergency, or follow-up visit.",
      html: `
        <form class="form-grid compact-grid" data-action="create-appointment">
          <label>Patient name<input name="patientName" required data-testid="form-patient-name" /></label>
          <label>Mobile<input name="mobile" required value="9876543210" data-testid="form-patient-mobile" /></label>
          <label>Age<input name="age" type="number" value="46" data-testid="form-patient-age" /></label>
          <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
          <label>Source<select name="source"><option>Walk-in</option><option>Phone Call</option><option>Website</option><option>WhatsApp</option><option>Doctor Referral</option><option>Emergency</option><option>Follow-up</option></select></label>
          <label>Visit type<select name="visitType"><option>New</option><option>Follow-up</option></select></label>
          <label>Department<select name="department" required data-testid="form-department" data-appointment-department>${appointmentDepartmentOptions(appointmentLookup)}</select></label>
          <label>Doctor<select name="doctor" required data-testid="form-doctor" data-appointment-doctor>${appointmentDoctorOptions(appointmentLookup)}</select></label>
          <label>Date<input name="date" type="date" value="${localDateInputValue()}" data-testid="form-appointment-date" /></label>
          <label>Time<input name="time" type="time" value="09:30" data-testid="form-appointment-time" /></label>
          <label>Payment type<select name="paymentType"><option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option><option>Corporate</option><option>Credit</option><option>Package</option></select></label>
          <label>Priority<select name="priority"><option>Normal</option><option>Urgent</option><option>Emergency</option></select></label>
          <label>Existing patient<select name="patientId" data-existing-patient><option value="">New patient</option>${patients.map(patientOption).join("")}</select></label>
          <label>MRN<input name="mrn" readonly data-appointment-mrn /></label>
          <label>Date of birth<input name="dob" type="date" readonly data-appointment-dob /></label>
          <label>Email<input name="email" type="email" readonly data-appointment-email /></label>
          <label>Emergency contact<input name="emergencyContact" readonly data-appointment-emergency /></label>
          <label>Allergies<input name="allergies" readonly data-appointment-allergies /></label>
          <label class="span-2">Notes<textarea name="notes"></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Book appointment</button>
        </form>`
    },
    "register-patient": {
      title: "Patient registration",
      note: "Register a new patient profile and generate MRN.",
      html: `
        <form class="form-grid compact-grid" data-action="register-patient">
          <label>Full name<input name="name" required data-testid="form-patient-name" /></label>
          <label>Mobile<input name="mobile" required value="9876543210" data-testid="form-patient-mobile" /></label>
          <label>Age<input name="age" type="number" value="46" data-testid="form-patient-age" /></label>
          <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
          <label>Date of birth<input name="dob" type="date" value="1980-02-14" /></label>
          <label>Email<input name="email" type="email" /></label>
          <label>Emergency contact<input name="emergencyContact" /></label>
          <label>ID proof type<input name="idProofType" value="Aadhaar" /></label>
          <label>ID proof number<input name="idProofNumber" value="XXXX-XXXX-2145" /></label>
          <label>Duplicate action<select name="duplicateAction"><option value="">Check first</option><option value="use-existing">Use Existing Patient</option><option value="create-new-anyway">Create New Anyway</option></select></label>
          <label>Duplicate reason<input name="duplicateReason" placeholder="Required if creating duplicate" /></label>
          <label>Insurance<input name="insurance" value="Self Pay" /></label>
          <label>Allergies<input name="allergies" value="None" /></label>
          <label class="span-2">Address<textarea name="address"></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Register patient</button>
        </form>`
    },
    "add-to-vitals-queue": {
      title: "Add Patient to Vitals Queue",
      note: "Select an eligible active OPD patient from today. This does not create a patient record.",
      html: `<form class="form-grid compact-grid" data-action="add-to-vitals-queue">
        <label class="span-2">Search Patient<input type="search" data-vitals-patient-search placeholder="Search name, MRN / UHID or mobile" /></label>
        <label class="span-2">Eligible Patient<select name="appointmentId" required data-vitals-patient-select><option value="">Select patient</option>${vitalsQueueOptions.map(({ patient, appointment }) => `<option value="${escapeHtml(appointment.id)}" data-search="${escapeAttribute([patient.name, patient.fullName, patient.mrn, patient.uhid, patient.mobile, patient.mobileNumber].filter(Boolean).join(" ").toLowerCase())}">${escapeHtml(`${patient.name || patient.fullName || "Patient"} · ${patient.mrn || patient.uhid || patient.id} · ${appointment.department || "OPD"}`)}</option>`).join("")}</select></label>
        ${vitalsQueueOptions.length ? "" : `<p class="compact-empty span-2">No eligible OPD patients are available.</p>`}
        <button class="button primary span-2" type="submit" ${vitalsQueueOptions.length ? "" : "disabled"}>Add to Vitals Queue</button>
      </form>`
    },
    "generate-bill": {
      title: "Generate Bill",
      note: "Create a draft bill from consultation, lab, pharmacy, and procedure charges. Payment is collected only by authorized billing staff.",
      html: `
        <form class="form-grid compact-grid" data-action="generate-bill">
          <label class="span-2">Find patient (name, ID, UHID or mobile)<select name="patientId" required><option value="">Select existing patient</option>${patients.map((patient) => `<option value="${patient.id}">${escapeHtml(`${patient.name || patient.fullName || "Patient"} · ${patient.mrn || patient.uhid || patient.id} · ${patient.mobile || patient.mobileNumber || "No mobile"}`)}</option>`).join("")}</select></label>
          <label>Visit / Appointment<input name="appointmentId" placeholder="Appointment or visit number" /></label>
          <label>Department<input name="department" placeholder="General" data-testid="form-department" /></label>
          <label>Doctor<input name="doctor" placeholder="Duty Doctor" data-testid="form-doctor" /></label>
          <label>Registration fee<input name="registrationFee" type="number" min="0" /></label>
          <label>Consultation fee<input name="consultationFee" type="number" min="0" /></label>
          <label>Lab charges<input name="labCharges" type="number" min="0" value="0" /></label>
          <label>Radiology charges<input name="radiologyCharges" type="number" min="0" value="0" /></label>
          <label>Pharmacy charges<input name="pharmacyCharges" type="number" min="0" value="0" /></label>
          <label>Procedure charges<input name="procedureCharges" type="number" min="0" value="0" /></label>
          <label>Bed charges<input name="bedCharges" type="number" min="0" value="0" /></label>
          <label>Nursing charges<input name="nursingCharges" type="number" min="0" value="0" /></label>
          <label>Emergency charges<input name="emergencyCharges" type="number" min="0" value="0" /></label>
          <label>Discount<input name="discount" type="number" min="0" value="0" /></label>
          <label>Tax<input name="tax" type="number" min="0" value="0" /></label>
          <label>Previous / advance amount<input name="advanceAmount" type="number" min="0" value="0" /></label>
          <label>Amount paid now<input name="amountPaid" type="number" min="0" value="0" /></label>
          <label>Total amount<input name="totalPreview" type="number" min="0" placeholder="Auto-calculated after save" disabled /></label>
          <label>Override price<select name="overridePrice"><option>No</option><option>Yes</option></select></label>
          <label class="span-2">Override reason<input name="overrideReason" placeholder="Required when overriding configured price" /></label>
          <label>Payment mode<select name="paymentType" data-testid="form-payment-mode"><option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option><option>Insurance</option><option>Split Payment</option></select></label>
          <label>Mark as paid<select name="markPaid"><option>No</option><option>Yes</option></select></label>
          <label class="span-2">Additional itemized services (optional JSON)<textarea name="billingItems" placeholder='[{"service":"Procedure","qty":1,"rate":1500,"discount":0,"tax":0}]'></textarea></label>
          <label class="span-2">Notes<textarea name="notes" placeholder="Optional billing note"></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Generate draft bill</button>
        </form>`
    },
    "add-stock": {
      title: "Add Stock",
      note: "Add medicine batch stock before pharmacy issue. Expired or zero quantity stock is blocked.",
      html: `
        <form class="form-grid compact-grid" data-action="add-stock">
          <label>Medicine<input name="medicine" required placeholder="Paracetamol 500mg" data-testid="form-medicine" /></label>
          <label>Batch number<input name="batchNumber" required placeholder="BATCH-001" /></label>
          <label>Expiry date<input name="expiryDate" type="date" required value="2027-12-31" /></label>
          <label>Supplier<input name="supplier" placeholder="Supplier name" /></label>
          <label>Quantity<input name="quantityAvailable" type="number" min="1" required value="20" data-testid="form-stock-quantity" /></label>
          <label>Purchase price<input name="purchasePrice" type="number" min="0" value="0" /></label>
          <label>Selling price<input name="sellingPrice" type="number" min="0" value="0" /></label>
          <label>Reorder level<input name="reorderLevel" type="number" min="0" value="5" /></label>
          <label>Storage location<input name="storageLocation" placeholder="Pharmacy" /></label>
          <label class="span-2">Notes<textarea name="notes" placeholder="Optional stock note"></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Add stock</button>
        </form>`
    },
    "create-task": {
      title: "Task",
      note: "Assign a follow-up action to staff.",
      html: `
        <form class="form-grid compact-grid" data-action="create-task">
          <label>Title<input name="title" required placeholder="Review wait time delay" /></label>
          <label>Assigned to<input name="assignedTo" required placeholder="OPD Manager" /></label>
          <label>Priority<select name="priority"><option>Low</option><option>Medium</option><option selected>High</option><option>Critical</option></select></label>
          <label>Due date<input name="due" type="date" value="${localDateInputValue()}" /></label>
          <label class="span-2">Description<textarea name="description" placeholder="Describe the action needed"></textarea></label>
          <button class="button primary" type="submit" data-testid="modal-submit-button">Assign task</button>
        </form>`
    }
  };
  return forms[action];
}

function collectionRows(collection) {
  const getters = {
    hospitals: () => api.hospitals(currentUser),
    branches: () => api.branches(currentUser),
    users: () => api.users(currentUser),
    subscriptions: () => api.subscriptions(currentUser),
    offers: () => api.offers(currentUser),
    appointments: () => api.appointments(currentUser),
    patients: () => api.patients(currentUser),
    alerts: () => api.alerts(currentUser),
    tasks: () => api.tasks(currentUser),
    masterDataItems: () => api.masterDataItems(currentUser),
    inventory: () => api.inventory(currentUser),
    staff: () => api.staff(currentUser),
    beds: () => api.beds(currentUser),
    incidents: () => api.incidents(currentUser)
  };
  return getters[collection]?.() || [];
}

function editableEntries(record, collection = "") {
  const blocked = new Set(["id", "_id", "hospitalId", "password", "passwordHash", "createdAt", "updatedAt", "createdBy", "updatedBy", "allowedPages", "permissions"]);
  if (collection !== "users") blocked.add("branchId");
  if (collection !== "users") blocked.add("allowedModules");
  blocked.add("role");
  if (collection === "hospitals") {
    blocked.add("branchLimit");
    blocked.add("userLimit");
    blocked.add("storageGb");
    blocked.add("storageUsedGb");
  }
  return Object.entries(record || {})
    .filter(([key, value]) => !blocked.has(key) && ["string", "number", "boolean"].includes(typeof value))
    .slice(0, 10);
}

function editFieldLabel(collection, key) {
  if (collection === "users" && key === "email") return "Login username";
  if (key === "contactEmail") return "Email";
  if (key === "branchId") return "Branch";
  return titleCase(key);
}

function editFieldControl(collection, key, value) {
  const name = escapeHtml(key);
  const label = escapeHtml(editFieldLabel(collection, key));
  const current = String(value ?? "");
  const optionList = (options) => options.map((option) => `<option value="${escapeHtml(option)}" ${String(option) === current ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
  if (collection === "subscriptions" && key === "status") {
    return `<label>${label}<select name="${name}">${optionList(["Active", "Draft", "Disabled"])}</select></label>`;
  }
  if (key === "status") {
    return `<label>${label}<select name="${name}">${optionList(["Active", "Inactive", "Pending Review", "Suspended", "Disabled", "Pending Invite"])}</select></label>`;
  }
  if (collection === "hospitals" && key === "plan") {
    return `<label>${label}<select name="${name}">${optionList(["Starter", "Growth", "Enterprise"])}</select></label>`;
  }
  if (collection === "hospitals" && key === "supportAccess") {
    return `<label>Support Access<select name="${name}">${optionList(["false", "true"])}</select></label>`;
  }
  if (collection === "branches" && key === "branchType") {
    return `<label>${label}<select name="${name}">${optionList(["Main Branch", "Sub Branch"])}</select></label>`;
  }
  if (collection === "subscriptions" && key === "supportLevel") {
    return `<label>${label}<select name="${name}">${optionList(["Standard", "Priority", "Enterprise"])}</select></label>`;
  }
  if (collection === "users" && key === "jobRole") {
    return `<label>${label}<select name="${name}">${jobRoleOptions().replace(`>${escapeHtml(current)}<`, ` selected>${escapeHtml(current)}<`)}</select></label>`;
  }
  if (collection === "users" && key === "branchId") {
    const branches = api.branches(currentUser);
    return `<label>${label}<select name="${name}">${branches.map((branch) => `<option value="${escapeHtml(branch.id)}" ${branch.id === current ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}</select></label>`;
  }
  if (key === "allowedModules" || key === "enabledModules" || key === "modules") {
    const modules = Array.isArray(value) ? value.join(", ") : current;
    return `<label class="span-2">${label}<textarea name="${name}" placeholder="Comma-separated modules">${escapeHtml(modules)}</textarea></label>`;
  }
  if (typeof value === "boolean") {
    return `<label>${label}<select name="${name}">${optionList(["false", "true"])}</select></label>`;
  }
  if (typeof value === "number" || ["branchLimit", "userLimit", "storageUsedGb", "beds", "rooms", "monthlyPrice", "yearlyPrice", "branches", "users", "storageGb"].includes(key)) {
    return `<label>${label}<input name="${name}" type="number" value="${escapeHtml(value)}" /></label>`;
  }
  return `<label>${label}<input name="${name}" value="${escapeHtml(value)}" /></label>`;
}

function normalizeEditValues(collection, values) {
  const normalized = { ...values };
  for (const [key, value] of Object.entries(normalized)) {
    if (["branchLimit", "userLimit", "storageUsedGb", "beds", "rooms"].includes(key)) normalized[key] = Number(value || 0);
    if (["monthlyPrice", "yearlyPrice", "branches", "users", "storageGb"].includes(key)) normalized[key] = Number(value || 0);
    if (["supportAccess"].includes(key)) normalized[key] = value === "true";
    if (["allowedModules", "enabledModules", "modules"].includes(key)) normalized[key] = String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }
  return normalized;
}

function editModal() {
  if (!editTarget) return "";
  const record = collectionRows(editTarget.collection).find((item) => item.id === editTarget.id);
  if (!record) return "";
  if (editTarget.collection === "hospitals" && editTarget.hospitalProfile) {
    const types = ["Multi-Speciality Hospital", "General Hospital", "Specialty Hospital", "Clinic", "Other"];
    return `<div class="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true"><div class="panel-head"><div><p class="eyebrow">Hospital Profile</p><h3>Edit Profile</h3></div><button class="icon-button" type="button" data-action="close-edit">Close</button></div>
      <form class="form-grid compact-grid hospital-profile-form" data-action="save-edit" data-collection="hospitals" data-id="${escapeHtml(record.id)}" novalidate>
        <label>Hospital Name*<input name="name" required value="${escapeAttribute(record.name || "")}" /></label><label>Hospital Code*<input name="hospitalCode" required value="${escapeAttribute(record.hospitalCode || record.code || "")}" /></label>
        <label>Hospital Type<select name="hospitalType">${types.map((type) => `<option ${record.hospitalType === type ? "selected" : ""}>${type}</option>`).join("")}</select></label><label>Registration Number<input name="registrationNumber" value="${escapeAttribute(record.registrationNumber || "")}" /></label>
        <label class="span-2">Address Line*<input name="address" required value="${escapeAttribute(record.address || "")}" /></label><label>City*<input name="city" required value="${escapeAttribute(record.city || "")}" /></label><label>State*<input name="state" required value="${escapeAttribute(record.state || "")}" /></label><label>PIN Code*<input name="pinCode" required pattern="[0-9]{6}" maxlength="6" value="${escapeAttribute(record.pinCode || "")}" /></label>
        <label>Contact Number*<input name="contactNumber" required value="${escapeAttribute(record.contactNumber || record.contact || "")}" /></label><label>Email*<input name="email" type="email" required value="${escapeAttribute(record.email || "")}" /></label><label>Website<input name="website" type="url" value="${escapeAttribute(record.website || "")}" /></label>
        <label class="span-2">Upload Hospital Logo<input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp" data-hospital-logo-input /></label><input type="hidden" name="logoDataUrl" value="${escapeAttribute(record.logoDataUrl || "")}" data-hospital-logo-value /><div class="hospital-logo-preview span-2" data-hospital-logo-preview>${record.logoDataUrl ? `<img src="${escapeAttribute(record.logoDataUrl)}" alt="Hospital logo preview" />` : `<small>Logo preview</small>`}</div>
        <label>Status*<select name="status"><option ${record.status !== "Inactive" ? "selected" : ""}>Active</option><option ${record.status === "Inactive" ? "selected" : ""}>Inactive</option></select></label><div class="button-row span-2 footer-actions"><button class="button ghost" type="button" data-action="close-edit">Cancel</button><button class="button primary" type="submit">Save Hospital Profile</button></div>
      </form></section></div>`;
  }
  if (editTarget.collection === "users" && editTarget.staffOnly) {
    const branches = safeOptionalData(() => api.branches(currentUser), []);
    const departments = safeOptionalData(() => api.masterDataItems(currentUser), []).filter((item) => item.type === "Department" && String(item.status || "Active").toLowerCase() === "active");
    const roles = [["Doctor", "Doctor"], ["Nurse", "Nurse"], ["Reception User", "Receptionist"], ["Billing User", "Billing"], ["Lab User", "Lab"], ["Pharmacy User", "Pharmacy"], ["Radiology User", "Radiology"], ["Mortuary Officer", "Mortuary"]];
    return `<div class="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true"><div class="panel-head"><div><p class="eyebrow">Edit Staff</p><h3>${escapeHtml(record.name)}</h3></div><button class="icon-button" type="button" data-action="close-edit">Close</button></div>
      <form class="form-grid compact-grid staff-form" data-action="save-edit" data-collection="users" data-id="${escapeHtml(record.id)}" novalidate>
        <label>Full Name*<input name="name" required value="${escapeAttribute(record.name || "")}" /></label><label>Employee ID*<input name="employeeId" required value="${escapeAttribute(record.employeeId || "")}" /></label>
        <label>Email*<input name="contactEmail" type="email" required value="${escapeAttribute(record.contactEmail || "")}" /></label><label>Mobile Number*<input name="mobile" required value="${escapeAttribute(record.mobile || "")}" /></label><label>Username / Login<input value="${escapeAttribute(record.email || "")}" readonly /></label>
        <label>Role*<select name="jobRole" required>${roles.map(([value, label]) => `<option value="${escapeAttribute(value)}" ${record.jobRole === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></label>
        <label>Branch*<select name="branchId" required data-staff-branch>${branches.map((branch) => `<option value="${escapeAttribute(branch.id)}" ${String(record.branchId) === String(branch.id) ? "selected" : ""}>${escapeHtml(branch.name)}</option>`).join("")}</select></label>
        <label>Department*<select name="department" required data-staff-department>${departments.map((department) => `<option value="${escapeAttribute(department.name)}" data-branch-id="${escapeAttribute(department.branchId || "all")}" ${record.department === department.name ? "selected" : ""}>${escapeHtml(department.name)}</option>`).join("")}</select></label>
        <label>Status*<select name="status"><option ${record.status !== "Inactive" ? "selected" : ""}>Active</option><option ${record.status === "Inactive" ? "selected" : ""}>Inactive</option></select></label>
        <div class="button-row span-2 footer-actions"><button class="button ghost" type="button" data-action="close-edit">Cancel</button><button class="button primary" type="submit">Save Changes</button></div>
      </form></section></div>`;
  }
  if (editTarget.collection === "branches" && editTarget.viewOnly) {
    const branchId = String(record.id);
    const inBranch = (item) => String(item.branchId || "") === branchId;
    const users = safeOptionalData(() => api.users(currentUser), []);
    const branchAdmin = users.find((user) => inBranch(user) && [ROLES.BRANCH_ADMIN, "BRANCH_ADMIN"].includes(user.role));
    const appointments = safeOptionalData(() => api.appointments(currentUser), []).filter((item) => inBranch(item) && isToday(item.date || item.appointmentDate || item.createdAt));
    const admissions = safeOptionalData(() => api.admissions(currentUser), []).filter((item) => inBranch(item) && !["Discharged", "Cancelled"].includes(item.status || item.admissionStatus));
    const beds = safeOptionalData(() => api.beds(currentUser), []).filter(inBranch);
    const bills = safeOptionalData(() => api.bills(currentUser), []).filter((item) => inBranch(item) && isToday(item.createdAt || item.date));
    const patientsToday = new Set(appointments.map((item) => item.patientId).filter(Boolean)).size;
    const revenue = bills.reduce((sum, bill) => sum + billPaidAmount(bill), 0);
    const shortcuts = [["Branch Admin", "users"], ["Departments", "masterData"], ["Staff", "staffRoster"], ["Wards & Beds", "wards"], ["Billing", "billing"], ["Reports", "reports"]];
    return `<div class="modal-backdrop"><section class="modal-card branch-overview-modal" role="dialog" aria-modal="true">
      <div class="panel-head"><div><p class="eyebrow">Branch Overview</p><h3>${escapeHtml(record.name)}</h3><p>${escapeHtml(record.branchCode || record.code || "-")} · ${escapeHtml([record.city, record.state].filter(Boolean).join(", ") || "Location unavailable")}</p></div><button class="icon-button" type="button" data-action="close-edit">Close</button></div>
      <div class="branch-detail-grid"><span><small>Address</small><strong>${escapeHtml(record.address || "-")}</strong></span><span><small>Contact</small><strong>${escapeHtml(record.contactNumber || record.contact || record.phone || "-")}</strong></span><span><small>Email</small><strong>${escapeHtml(record.email || "-")}</strong></span><span><small>Status</small>${badge(record.status || "Active", statusClass(record.status || "Active"))}</span><span><small>Branch Admin</small><strong>${escapeHtml(branchAdmin?.name || "Not Assigned")}</strong></span><span><small>Working Hours</small><strong>${escapeHtml(record.openingTime && record.closingTime ? `${record.openingTime} – ${record.closingTime}` : "-")}</strong></span></div>
      <div class="branch-stat-grid">${[["Patients Today", patientsToday], ["Today's Appointments", appointments.length], ["Current Admissions", admissions.length], ["Total Beds", beds.length], ["Available Beds", beds.filter((bed) => String(bed.status || "Available").toLowerCase() === "available").length], ["Staff Count", users.filter((user) => inBranch(user) && user.role !== ROLES.BRANCH_ADMIN).length], ["Today's Revenue", money(revenue)]].map(([label, value]) => `<span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(label)}</small></span>`).join("")}</div>
      <div class="branch-shortcuts">${shortcuts.map(([label, route]) => `<button class="button soft" type="button" data-route="${route}" data-branch-id="${escapeHtml(record.id)}">${label}</button>`).join("")}</div>
    </section></div>`;
  }
  if (editTarget.collection === "branches") {
    return `<div class="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true"><div class="panel-head"><div><p class="eyebrow">Edit Branch</p><h3>${escapeHtml(record.name)}</h3></div><button class="icon-button" type="button" data-action="close-edit">Close</button></div>
      <form class="form-grid compact-grid branch-form" data-action="save-edit" data-collection="branches" data-id="${escapeHtml(record.id)}" novalidate>
        <label>Branch Name*<input name="name" required value="${escapeAttribute(record.name || "")}" /></label><label>Branch Code<input value="${escapeAttribute(record.branchCode || record.code || "-")}" readonly /></label>
        <label class="span-2">Address Line<input name="address" value="${escapeAttribute(record.address || "")}" /></label><label>City*<input name="city" required value="${escapeAttribute(record.city || "")}" /></label><label>State*<input name="state" required value="${escapeAttribute(record.state || "")}" /></label>
        <label>PIN Code*<input name="pinCode" required pattern="[0-9]{6}" maxlength="6" value="${escapeAttribute(record.pinCode || record.pin || "")}" /></label><label>Contact Number*<input name="contactNumber" required value="${escapeAttribute(record.contactNumber || record.contact || record.phone || "")}" /></label><label>Email<input name="email" type="email" value="${escapeAttribute(record.email || "")}" /></label>
        <label>Opening Time<input name="openingTime" type="time" value="${escapeAttribute(record.openingTime || "")}" /></label><label>Closing Time<input name="closingTime" type="time" value="${escapeAttribute(record.closingTime || "")}" /></label><label>Status*<select name="status"><option ${record.status !== "Inactive" ? "selected" : ""}>Active</option><option ${record.status === "Inactive" ? "selected" : ""}>Inactive</option></select></label>
        <div class="button-row span-2 footer-actions"><button class="button ghost" type="button" data-action="close-edit">Cancel</button><button class="button primary" type="submit">Save Changes</button></div>
      </form></section></div>`;
  }
  const fields = editableEntries(record, editTarget.collection);
  return `
    <div class="modal-backdrop">
      <section class="modal-card">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Edit record</p>
            <h3>${escapeHtml(record.name || record.title || record.patientName || record.email || record.id)}</h3>
          </div>
          <button class="icon-button" type="button" data-action="close-edit">Close</button>
        </div>
        <form class="form-grid compact-grid" data-action="save-edit" data-collection="${escapeHtml(editTarget.collection)}" data-id="${escapeHtml(editTarget.id)}">
          ${fields.map(([key, value]) => editFieldControl(editTarget.collection, key, value)).join("")}
          <button class="button primary" type="submit">Save changes</button>
        </form>
      </section>
    </div>
  `;
}

function patientDeleteDependencies(patientId) {
  const read = (name) => safeOptionalData(() => api[name](currentUser), []);
  return linkedPatientRecords(patientId, {
    appointments: read("appointments"),
    queueTokens: read("queueTokens"),
    vitals: read("vitals"),
    consultations: read("consultations"),
    admissions: read("admissions"),
    bills: read("bills"),
    payments: read("payments"),
    checkouts: read("checkouts"),
    followUps: read("followUps")
  });
}

function deleteModal() {
  if (!deleteTarget) return "";
  const record = collectionRows(deleteTarget.collection).find((item) => item.id === deleteTarget.id);
  const title = record?.name || record?.title || record?.patientName || record?.email || record?.id || "this record";
  const isPatient = deleteTarget.collection === "patients";
  return `
    <div class="modal-backdrop">
      <section class="modal-card confirm-card" role="dialog" aria-modal="true">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Confirm delete</p>
            <h3>Delete ${escapeHtml(title)}?</h3>
            <p>${isPatient ? "This patient has no linked hospital workflow records. This action cannot be undone." : "This action can remove important hospital data. Confirm only after checking the record carefully."}</p>
          </div>
          <button class="icon-button" type="button" data-action="cancel-delete">Close</button>
        </div>
        <div class="notice danger">Deleted records cannot be restored from this screen.</div>
        <div class="button-row footer-actions">
          <button class="button ghost" type="button" data-action="cancel-delete">Cancel</button>
          <button class="button danger" type="button" data-action="confirm-delete-record" data-collection="${escapeHtml(deleteTarget.collection)}" data-id="${escapeHtml(deleteTarget.id)}">${isPatient ? "Delete Patient" : "Delete record"}</button>
        </div>
      </section>
    </div>
  `;
}

function passwordPolicyState(password = "", user = currentUser || {}) {
  const value = String(password || "");
  const lowered = value.toLowerCase();
  const emailName = String(user?.email || user?.contactEmail || "").split("@")[0]?.toLowerCase();
  const nameParts = String(user?.name || "").toLowerCase().split(/\s+/).filter((part) => part.length >= 3);
  return {
    length: value.length >= 12,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
    email: !(emailName && lowered.includes(emailName)),
    name: !nameParts.some((part) => lowered.includes(part))
  };
}

function passwordField({ label, name, required = true, minlength, autocomplete, testid, revealable = true }) {
  const attrs = [
    `name="${escapeAttribute(name)}"`,
    `type="password"`,
    required ? "required" : "",
    minlength ? `minlength="${minlength}"` : "",
    autocomplete ? `autocomplete="${escapeAttribute(autocomplete)}"` : "",
    testid ? `data-testid="${escapeAttribute(testid)}"` : ""
  ].filter(Boolean).join(" ");
  if (!revealable) return `<label>${escapeHtml(label)}<input ${attrs} /></label>`;
  return `<label>${escapeHtml(label)}<span class="password-field"><input ${attrs} /><button class="password-toggle" type="button" data-action="toggle-password-visibility" aria-label="Show password">Show</button></span></label>`;
}

function passwordPolicyHint(target = "current account") {
  return `
    <div class="password-hints" data-password-hints data-password-target="${escapeAttribute(target)}">
      <span data-rule="length">12+ characters</span>
      <span data-rule="uppercase">Uppercase letter</span>
      <span data-rule="lowercase">Lowercase letter</span>
      <span data-rule="number">Number</span>
      <span data-rule="symbol">Special character</span>
      <span data-rule="email">Does not contain your email</span>
      <span data-rule="name">Does not contain your name</span>
    </div>
  `;
}

function selectedPermissionPages(form) {
  return uniquePages([...form.querySelectorAll('input[name="allowedPages"]:checked')].map((input) => input.value));
}

function setPermissionPages(form, pages) {
  const allowed = new Set(pages);
  form.querySelectorAll('input[name="allowedPages"]').forEach((input) => {
    input.checked = allowed.has(input.value) && !input.disabled;
  });
  updatePermissionBuilder(form);
}

function updatePermissionBuilder(form) {
  if (!form?.matches?.('[data-action="create-user"]')) return;
  const selected = selectedPermissionPages(form);
  const modules = USER_ROLE_MODULES[form.jobRole?.value] || selected.map((page) => currentPageTitle(page));
  const modulesInput = form.querySelector("[data-allowed-modules]");
  if (modulesInput) modulesInput.value = modules.join(",");

  USER_PERMISSION_GROUPS.forEach((group) => {
    const count = [...form.querySelectorAll(`input[name="allowedPages"][data-group="${group.key}"]:checked`)].length;
    const counter = form.querySelector(`[data-group-count="${group.key}"]`);
    if (counter) counter.textContent = `${count} selected`;
  });

  const allowedList = form.querySelector("[data-preview-allowed]");
  const blockedList = form.querySelector("[data-preview-blocked]");
  const allPages = uniquePages(USER_PERMISSION_GROUPS.flatMap((group) => group.pages.map(([route]) => route)));
  if (allowedList) {
    allowedList.innerHTML = selected.slice(0, 12).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("") || "<li>No pages selected</li>";
  }
  if (blockedList) {
    blockedList.innerHTML = allPages.filter((page) => !selected.includes(page)).slice(0, 12).map((page) => `<li>${escapeHtml(currentPageTitle(page))}</li>`).join("");
  }

  const sensitiveChecked = [...form.querySelectorAll(".matrix-check.sensitive input:checked")];
  const warning = form.querySelector("[data-sensitive-warning]");
  if (warning) warning.classList.toggle("hidden", sensitiveChecked.length === 0);
}

function applyUserRolePreset(form) {
  const role = form.jobRole?.value;
  const preset = USER_ROLE_PRESETS[role] || ["dashboard", "tasks", "alerts"];
  const message = form.querySelector("[data-role-preset-message]");
  if (message) {
    message.textContent = role === "Custom Role"
      ? "Custom role selected. Choose pages and permissions manually before saving."
      : `Default access preset applied for ${role}. You can adjust allowed pages before saving.`;
  }
  setPermissionPages(form, preset);
}

function toast(message, type = "success") {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.innerHTML = `<span>${escapeHtml(message)}</span><i class="toast-progress" aria-hidden="true"></i>`;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}

const loadingLabels = {
  login: "Signing in...",
  "forgot-password": "Sending...",
  "reset-password": "Resetting...",
  "upload-document": "Uploading...",
  "upload-records": "Uploading...",
  "global-search": "Searching...",
  "change-password": "Changing...",
  "create-appointment": "Booking...",
  "register-patient": "Registering...",
  "generate-bill": "Generating...",
  "create-admission": "Creating...",
  "save-edit": "Saving..."
};

const clickLoadingActions = new Set([
  "run-provider-check",
  "patient-check-in",
  "download-document",
  "patient-download-document",
  "send-patient-portal-invite",
  "toggle-branch-patient-portal",
  "toggle-branch-public-booking",
  "delete-document-file",
  "review-access",
  "revoke-sensitive",
  "disable-access-user",
  "duplicate-template",
  "disable-template",
  "disable-subscription",
  "confirm-delete-record",
  "logout",
  "ack-alert",
  "task-from-alert",
  "complete-task",
  "check-in",
  "lab-ready",
  "issue-pharmacy",
  "collect-payment",
  "pay-online",
  "complete-checkout",
  "assign-bed",
  "mark-med-given",
  "accept-handover",
  "complete-discharge",
  "complete-clearance",
  "update-bed-status",
  "submit-death-summary",
  "approve-death-summary",
  "return-death-summary",
  "print-death-summary",
  "toggle-master-data",
  "mark-notification-read",
  "stock-adjust",
  "approve-purchase",
  "receive-goods",
  "manual-backup",
  "export-csv",
  "export-excel",
  "print-report",
  "print-prescription",
  "print-lab-order",
  "print-bill"
]);

function loadingLabel(action) {
  if (loadingLabels[action]) return loadingLabels[action];
  if (action?.startsWith("create-")) return "Creating...";
  if (action?.startsWith("add-")) return "Saving...";
  if (action?.startsWith("save-")) return "Saving...";
  if (action?.startsWith("update-")) return "Saving...";
  return "Working...";
}

function startButtonLoading(button, action) {
  if (!(button instanceof HTMLButtonElement) || !clickLoadingActions.has(action)) return null;
  const previous = {
    html: button.innerHTML,
    disabled: button.disabled,
    ariaBusy: button.getAttribute("aria-busy")
  };
  button.disabled = true;
  button.classList.add("is-loading");
  button.setAttribute("aria-busy", "true");
  button.innerHTML = `<span class="loading-spinner" aria-hidden="true"></span><span>${escapeHtml(loadingLabel(action))}</span>`;
  return previous;
}

function stopButtonLoading(button, previous) {
  if (!(button instanceof HTMLButtonElement) || !button.isConnected || !previous) return;
  button.disabled = previous.disabled;
  button.classList.remove("is-loading");
  button.innerHTML = previous.html;
  if (previous.ariaBusy === null) button.removeAttribute("aria-busy");
  else button.setAttribute("aria-busy", previous.ariaBusy);
}

function startFormLoading(form, submitter, action) {
  const button = submitter instanceof HTMLButtonElement ? submitter : form.querySelector('button[type="submit"]');
  const controls = [...form.querySelectorAll("button, input, select, textarea")];
  const previous = {
    button,
    buttonHtml: button?.innerHTML,
    buttonAriaBusy: button?.getAttribute("aria-busy"),
    controls: controls.map((control) => [control, control.disabled])
  };

  form.classList.add("is-loading");
  form.setAttribute("aria-busy", "true");
  controls.forEach((control) => {
    control.disabled = true;
  });
  if (button) {
    button.innerHTML = `<span class="loading-spinner" aria-hidden="true"></span><span>${escapeHtml(loadingLabel(action))}</span>`;
    button.setAttribute("aria-busy", "true");
  }
  return previous;
}

function stopFormLoading(form, previous) {
  if (!form?.isConnected || !previous) return;
  form.classList.remove("is-loading");
  form.removeAttribute("aria-busy");
  previous.controls.forEach(([control, disabled]) => {
    if (control.isConnected) control.disabled = disabled;
  });
  if (previous.button?.isConnected) {
    previous.button.innerHTML = previous.buttonHtml;
    if (previous.buttonAriaBusy === null) previous.button.removeAttribute("aria-busy");
    else previous.button.setAttribute("aria-busy", previous.buttonAriaBusy);
  }
}

function exportCsv(kind) {
  const module = kind === "audit" ? "audit" : kind === "alerts" ? "alerts" : "reports";
  if (!hasPermission(currentUser, module, "export")) {
    throw new Error("You do not have permission to perform this action.");
  }
  api.logSensitiveAction?.(currentUser, module, "Export");
  const rowsByKind = {
    audit: api.auditLogs(currentUser),
    alerts: api.alerts(currentUser),
    reports: currentUser.role === ROLES.SUPER_ADMIN ? api.hospitals(currentUser) : api.branches(currentUser)
  };
  const rows = rowsByKind[kind] || api.records(currentUser);
  const headers = Object.keys(rows[0] || { message: "No data" });
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `hocc-${kind}-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportExcel() {
  if (!hasPermission(currentUser, "reports", "export")) {
    throw new Error("You do not have permission to perform this action.");
  }
  api.logSensitiveAction?.(currentUser, "reports", "Export");
  const rows = api.records(currentUser);
  const html = `<table>${rows.map((row) => `<tr><td>${escapeHtml(row.patientId)}</td><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("")}</table>`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([html], { type: "application/vnd.ms-excel" }));
  link.download = `hocc-report-${Date.now()}.xls`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function sampleCsv() {
  return `Patient ID,Appointment ID,Department,Doctor,Arrival Time,Appointment Time,Doctor Seen Time,Wait Time
P-9001,A-9001,Emergency,Dr. Banerjee,08:10,08:00,08:54,54
P-9002,A-9002,OPD,,09:00,08:45,09:28,43
P-9002,A-9002,OPD,Dr. Nair,09:02,08:45,09:30,45
P-9003,A-9003,Unknown Dept,Dr. Rao,10:10,10:00,10:20,-5`;
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadBase64File(file) {
  const bytes = atob(file.contentBase64 || "");
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([buffer], { type: file.mimeType || "application/octet-stream" }));
  link.download = file.fileName || "document";
  link.click();
  URL.revokeObjectURL(link.href);
}

const TEXT_TEMPLATES = [
  ["", "Insert template"],
  ["Fever consultation", "Chief complaint: Fever with associated symptoms.\nClinical notes: Patient reviewed and examined. Vitals reviewed. Red flag symptoms explained.\nPlan: Investigations and follow-up to be decided by the treating doctor after clinical review."],
  ["Diabetes follow-up", "Follow-up reason: Diabetes review.\nClinical notes: Symptoms, adherence, home monitoring, and recent reports reviewed.\nPlan: Doctor to update medicines, investigations, lifestyle advice, and next follow-up manually."],
  ["Hypertension follow-up", "Follow-up reason: Blood pressure review.\nClinical notes: Readings, symptoms, adherence, and risk factors reviewed.\nPlan: Doctor to confirm treatment plan and follow-up manually."],
  ["Emergency trauma", "Emergency note: Trauma patient assessed by emergency team.\nTriage/vitals: Record findings manually.\nPlan: Stabilization, investigations, referral, OPD/IPD movement, or discharge to be decided by responsible clinician."],
  ["Daily IPD progress note", "Daily progress: Patient reviewed during rounds.\nCurrent condition:\nInvestigations:\nTreatment plan:\nPending actions:\nResponsible clinician to review and sign."],
  ["Nursing note", "Nursing observation:\nVitals:\nMedication/care provided:\nPatient comfort and safety:\nEscalation, if any:\nRecorded by nursing staff."],
  ["Discharge summary", "Discharge summary draft:\nAdmission reason:\nHospital course:\nInvestigations:\nTreatment given:\nDischarge condition:\nFollow-up advice:\nPrepared for clinician review and approval."],
  ["Death summary", "Death Summary draft:\nClinical course:\nImmediate cause:\nAntecedent/underlying cause:\nFamily informed:\nMedico-legal status:\nDraft only. Requires responsible doctor review and approval."]
];

function draftKeyFor(textarea) {
  const form = textarea.closest("form");
  const action = form?.dataset.action || "draft";
  const route = pageFromHash();
  const id = form?.admissionId?.value || form?.patientId?.value || selectedPatientId || "general";
  return `hocc:draft:${currentUser?.id || currentUser?.email}:${route}:${action}:${textarea.name || "notes"}:${id}`;
}

function enhanceDraftAreas() {
  app.querySelectorAll("textarea").forEach((textarea) => {
    const form = textarea.closest("form");
    if (!form || textarea.dataset.draftReady === "true") return;
    const action = form.dataset.action || "";
    const allowed = /consult|duty|nursing|death|discharge|handover|daily|emergency|feedback|consent|bill/i.test(action);
    if (!allowed) return;
    textarea.dataset.draftReady = "true";
    textarea.dataset.draftKey = draftKeyFor(textarea);
    const saved = localStorage.getItem(textarea.dataset.draftKey);
    if (saved && !textarea.value.trim()) textarea.value = saved;
    const tools = document.createElement("div");
    tools.className = "draft-tools";
    tools.innerHTML = `
      <select data-template-select aria-label="Insert text template">
        ${TEXT_TEMPLATES.map(([label]) => `<option value="${escapeAttribute(label)}">${escapeHtml(label || "Insert template")}</option>`).join("")}
      </select>
      <small data-draft-status>${saved ? "Saved locally ✓" : "Draft autosave ready"}</small>
    `;
    textarea.insertAdjacentElement("afterend", tools);
  });
}

function enhancePasswordHints() {
  app.querySelectorAll("[data-password-hints]").forEach((hint) => {
    if (hint.dataset.bound === "true") return;
    hint.dataset.bound = "true";
    const form = hint.closest("form");
    const input = form?.querySelector('input[name="newPassword"]');
    if (!input) return;
    const applyState = () => {
      const state = passwordPolicyState(input.value, currentUser || {});
      Object.entries(state).forEach(([rule, passed]) => {
        const node = hint.querySelector(`[data-rule="${rule}"]`);
        if (!node) return;
        node.classList.toggle("pass", Boolean(passed));
        node.classList.toggle("fail", input.value.length > 0 && !passed);
      });
    };
    input.addEventListener("input", applyState);
    applyState();
  });
}

function animateCountUps() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  app.querySelectorAll("[data-countup]").forEach((node) => {
    if (node.dataset.counted === "true") return;
    node.dataset.counted = "true";
    const target = Number(node.dataset.countup || 0);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const duration = 480;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(target * progress);
      node.textContent = String(value);
      if (progress < 1) requestAnimationFrame(step);
      else node.textContent = String(target);
    };
    requestAnimationFrame(step);
  });
}

function scheduleDraftSave(textarea) {
  const key = textarea.dataset.draftKey;
  if (!key) return;
  const status = textarea.parentElement?.querySelector("[data-draft-status]");
  const consultationStatus = textarea.closest("form")?.querySelector("[data-consultation-save-status]");
  if (status) status.textContent = "Saving...";
  if (consultationStatus) consultationStatus.textContent = "Saving...";
  clearTimeout(draftTimers.get(key));
  draftTimers.set(key, setTimeout(() => {
    localStorage.setItem(key, textarea.value);
    if (status) status.textContent = "Saved locally ✓";
    if (consultationStatus) consultationStatus.textContent = "Saved locally ✓";
  }, 700));
}

function runGlobalSearch(query, debounce = 0) {
  clearTimeout(globalSearchTimer);
  const text = String(query || "").trim();
  globalSearchQuery = query || "";
  globalSearchActiveIndex = -1;
  globalSearchError = "";
  if (text.length < 2) {
    globalSearchSuggestions = [];
    globalSearchStatus = "idle";
    render();
    return;
  }
  globalSearchStatus = "loading";
  render();
  globalSearchTimer = setTimeout(() => {
    try {
      globalSearchSuggestions = api.globalSearch(currentUser, text).slice(0, 12);
      globalSearchStatus = "ready";
      globalSearchError = "";
    } catch (error) {
      globalSearchSuggestions = [];
      globalSearchStatus = "error";
      globalSearchError = error.message || "Unable to search records. Please retry.";
    }
    render();
  }, debounce);
}

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const action = form.dataset.action;
  const values = formValues(form);
  if (event.submitter?.name) values[event.submitter.name] = event.submitter.value || "Yes";
  const loadingState = startFormLoading(form, event.submitter, action);

  try {
    if (action === "pharmacy-search") {
      setPharmacySearch(values.query);
      render();
      return;
    }
    if (action === "pharmacy-payment") {
      await api.payPharmacyPrescription(currentUser, values.prescriptionId, { billId: values.billId, method: values.method });
      toast("Payment recorded and receipt created. Prescription is ready to dispense.");
      render();
      return;
    }
    if (action === "pharmacy-dispense") {
      await api.dispensePharmacyPrescription(currentUser, values.prescriptionId, { items: dispensePayload(values) });
      toast("Prescription dispensed and batch stock deducted automatically.");
      render();
      return;
    }
    if (action === "pharmacy-return") {
      await api.returnPharmacyItem(currentUser, values.prescriptionId, values);
      toast("Return processed and stock disposition recorded.");
      render();
      return;
    }
    // Handle Mortuary module submissions
    const mortuaryResult = await handleMortuarySubmit({
      action,
      values,
      api,
      currentUser
    });
    if (mortuaryResult.handled) {
      toast(mortuaryResult.message, "success");
      render();
      return;
    }

    if (action === "login") {
      await api.login(values.loginIdentifier || values.email, values.password);
      currentUser = api.currentUser();
      if (currentUser?.role === ROLES.HOSPITAL_ADMIN) hospitalAdminBranchId = "all";
      setPage("dashboard");
      render();
      setTimeout(warmDataCache, 60);
    }
    if (action === "patient-login") {
      await api.patientLogin(values.loginIdentifier || values.email, values.password);
      currentUser = api.currentUser();
      setPage("dashboard");
      render();
    }
    if (action === "patient-accept-invite") {
      if (!values.token) throw new Error("Invite link is invalid or missing.");
      if (values.newPassword !== values.confirmPassword) throw new Error("Password and confirmation do not match.");
      if (!strongPassword(values.newPassword)) throw new Error("Use at least 12 characters with uppercase, lowercase, number, and symbol.");
      const result = await api.patientAcceptInvite({
        token: values.token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });
      toast(result.message || "Portal access set up successfully. Please sign in.");
      setPage("patient-login");
    }
    if (action === "patient-book-appointment") {
      await api.createAppointment(currentUser, values);
      toast("Appointment requested. Next action: watch your appointments list for confirmation.");
      setPage("patient-appointments");
      render();
    }
    if (action === "public-book-appointment") {
      const branchId = form.dataset.branchId;
      const result = await api.submitPublicBooking({ ...values, branchId });
      app.innerHTML = authFrame(publicBookingConfirmation(result.appointmentNumber));
    }
    if (action === "forgot-password") {
      const result = await api.forgotPassword(values.email);
      toast(result.message || "If an account exists for this email, a password reset link has been sent.");
      setPage("login");
    }
    if (action === "reset-password") {
      if (!values.token) throw new Error("Reset link is invalid or missing.");
      if (values.newPassword !== values.confirmPassword) throw new Error("New password and confirmation do not match.");
      if (!strongPassword(values.newPassword)) throw new Error("Use at least 12 characters with uppercase, lowercase, number, and symbol.");
      const result = await api.resetPassword({
        token: values.token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });
      toast(result.message || "Password reset successfully. Please sign in with your new password.");
      setPage("login");
    }
    if (action === "create-hospital") {
      if (currentUser.role === ROLES.HOSPITAL_ADMIN) {
        if (safeOptionalData(() => api.hospitals(currentUser), []).length) throw new Error("A hospital profile already exists. Use Edit Profile.");
        if (!form.checkValidity()) { form.reportValidity(); return; }
        values.hospitalCode = String(values.hospitalCode || "").trim().toUpperCase();
      }
      await api.createHospital(currentUser, values);
      createTarget = null;
      toast(currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital profile created successfully." : "Hospital customer created.");
      render();
    }
    if (action === "create-branch") {
      const required = ["name", "branchCode", "city", "state", "pinCode", "contactNumber", "status"];
      for (const name of required) {
        const field = form.elements.namedItem(name);
        if (!String(values[name] || "").trim()) field?.setCustomValidity(`${field?.closest("label")?.childNodes?.[0]?.textContent?.replace("*", "").trim() || "This field"} is required.`);
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      values.branchCode = String(values.branchCode).trim().toUpperCase();
      const existingBranches = safeOptionalData(() => api.branches(currentUser), []);
      const duplicateCode = existingBranches.some((branch) => String(branch.branchCode || branch.code || "").trim().toUpperCase() === values.branchCode);
      if (duplicateCode) {
        const codeField = form.elements.namedItem("branchCode");
        codeField?.setCustomValidity("Branch code already exists.");
        codeField?.reportValidity();
        return;
      }
      const duplicateLocation = existingBranches.some((branch) => String(branch.name || "").trim().toLowerCase() === String(values.name).trim().toLowerCase() && String(branch.city || "").trim().toLowerCase() === String(values.city).trim().toLowerCase());
      if (duplicateLocation) {
        const nameField = form.elements.namedItem("name");
        nameField?.setCustomValidity("A branch with this name and city already exists.");
        nameField?.reportValidity();
        return;
      }
      await api.createBranch(currentUser, { ...values, hospitalId: currentUser.hospitalId });
      createTarget = null;
      toast("Branch created successfully.");
      render();
    }
    if (action === "create-ward") {
      await api.createWard(currentUser, values);
      createTarget = null;
      toast("Ward created.");
      render();
    }
    if (action === "create-bed") {
      await api.createBed(currentUser, values);
      createTarget = null;
      toast("Bed created.");
      render();
    }
    if (action === "create-staff") {
      if (currentUser.role !== ROLES.HOSPITAL_ADMIN || !hasPermission(currentUser, "staffRoster", "create")) throw new Error("You do not have permission to create staff accounts.");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (values.password !== values.confirmPassword) {
        const confirm = form.elements.namedItem("confirmPassword");
        confirm?.setCustomValidity("Passwords do not match.");
        confirm?.reportValidity();
        return;
      }
      const existingUsers = safeOptionalData(() => api.users(currentUser), []);
      if (existingUsers.some((user) => String(user.email || "").toLowerCase() === String(values.email).trim().toLowerCase())) throw new Error("Username / login already exists.");
      if (existingUsers.some((user) => String(user.employeeId || "").toLowerCase() === String(values.employeeId).trim().toLowerCase())) throw new Error("Employee ID already exists.");
      const allowedPages = USER_ROLE_PRESETS[values.jobRole] || (values.jobRole === "Mortuary Officer" ? ["dashboard", "mortuary", "mortuary-register", "mortuary-storage", "mortuary-certificates", "mortuary-release", "mortuary-search"] : ["dashboard"]);
      const allowedModules = USER_ROLE_MODULES[values.jobRole] || (values.jobRole === "Mortuary Officer" ? ["Mortuary"] : []);
      delete values.confirmPassword;
      await api.createUser(currentUser, { ...values, role: ROLES.BRANCH_USER, hospitalId: currentUser.hospitalId, allowedPages, allowedModules, mustChangePassword: true });
      createTarget = null;
      toast("Staff login created successfully.");
      render();
    }
    if (action === "create-user") {
      const allowedPages = uniquePages(asArray(values.allowedPages));
      const allowedModules = asArray(values.allowedModules).flatMap((item) => String(item).split(",")).map((item) => item.trim()).filter(Boolean);
      const permissions = Object.fromEntries(Object.entries(values)
        .filter(([key]) => key.startsWith("permission:"))
        .map(([key, value]) => [key.replace("permission:", ""), asArray(value)]));
      if (currentUser.role === ROLES.BRANCH_ADMIN) {
        if (!currentUser.branchId) throw new Error("Your Branch Admin account is not assigned to a branch yet.");
        values.branchId = currentUser.branchId;
        delete values.accessExpiresAt;
        if (!String(values.department || "").trim()) {
          throw new Error("Create an active Department in Master Data for this branch before creating staff users.");
        }
      }
      const hasSensitive = Object.values(permissions).flat().some((permission) => SENSITIVE_USER_PERMISSIONS.has(permission));
      if (hasSensitive && values.sensitiveConfirmed !== "Yes") {
        throw new Error("Confirm sensitive permission access before saving.");
      }
      if (hasSensitive && !String(values.sensitiveReason || "").trim()) {
        throw new Error("Add a reason for sensitive permission access.");
      }
      await api.createUser(currentUser, { ...values, allowedModules, allowedPages, permissions });
      createTarget = null;
      toast(values.inviteMode === "Yes" ? "Invite created. User remains pending until password setup." : `User created. Login: ${values.email} / ${values.password}`);
      render();
    }
    if (action === "create-master-data") {
      if (values.type === "Service Price") {
        await api.createServicePrice(currentUser, {
          serviceName: values.name,
          serviceCode: values.code,
          category: values.category,
          department: values.department,
          price: values.price,
          taxPercentage: values.taxPercentage,
          effectiveFrom: values.effectiveFrom,
          notes: values.description
        });
      } else {
        await api.createMasterDataItem(currentUser, values);
      }
      createTarget = null;
      toast("Master record created.");
      render();
    }
    if (action === "create-permission-template") {
      await api.createPermissionTemplate(currentUser, values);
      createTarget = null;
      toast("Permission template created.");
      render();
    }
    if (action === "create-subscription") {
      await api.createSubscriptionPlan(currentUser, values);
      createTarget = null;
      toast("Subscription plan created.");
      render();
    }
    if (action === "create-offer") {
      await api.createOffer(currentUser, values);
      createTarget = null;
      toast("Offer created.");
      render();
    }
    if (action === "schedule-surgery") {
      await api.scheduleSurgery(currentUser, values);
      createTarget = null;
      toast("Surgery scheduled.");
      render();
    }
    if (action === "register-death") {
      await api.registerDeath(currentUser, values);
      createTarget = null;
      toast("Death registered in mortuary register.");
      render();
    }
    if (action === "order-radiology") {
      await api.orderRadiology(currentUser, values);
      createTarget = null;
      toast("Imaging study ordered.");
      render();
    }
    if (action === "update-profile") {
      await api.updateProfile(currentUser, { name: values.name, mobile: values.mobile });
      currentUser = api.currentUser();
      toast("Profile updated successfully.");
      render();
    }
    if (action === "change-password") {
      if (values.newPassword !== values.confirmPassword) throw new Error("New password and confirmation do not match.");
      if (!strongPassword(values.newPassword)) throw new Error("Use at least 12 characters with uppercase, lowercase, number, and symbol.");
      await api.changePassword(currentUser, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });
      currentUser = api.currentUser();
      form.reset();
      toast("Password changed successfully.");
      render();
    }
    if (action === "save-settings") {
      const queueWaitingMinutes = Number(values.queueWaitingMinutes);
      const labPendingMinutes = Number(values.labPendingMinutes);
      const radiologyPendingMinutes = Number(values.radiologyPendingMinutes);
      const pharmacyPendingMinutes = Number(values.pharmacyPendingMinutes);
      const billingPendingMinutes = Number(values.billingPendingMinutes);
      const marDueMinutes = Number(values.marDueMinutes);
      const dischargeClearanceMinutes = Number(values.dischargeClearanceMinutes);
      const reportUploadDelayMinutes = Number(values.reportUploadDelayMinutes);
      const documentReadinessMinutes = Number(values.documentReadinessMinutes);
      const goLiveChecklistReminderMinutes = Number(values.goLiveChecklistReminderMinutes);
      if (!Number.isFinite(queueWaitingMinutes) || queueWaitingMinutes < 1) throw new Error("Queue waiting threshold must be a number of minutes.");
      if (!Number.isFinite(labPendingMinutes) || labPendingMinutes < 1) throw new Error("Lab threshold must be a number of minutes.");
      if (!Number.isFinite(radiologyPendingMinutes) || radiologyPendingMinutes < 1) throw new Error("Radiology threshold must be a number of minutes.");
      if (!Number.isFinite(pharmacyPendingMinutes) || pharmacyPendingMinutes < 1) throw new Error("Pharmacy threshold must be a number of minutes.");
      if (!Number.isFinite(billingPendingMinutes) || billingPendingMinutes < 1) throw new Error("Billing threshold must be a number of minutes.");
      if (!Number.isFinite(marDueMinutes) || marDueMinutes < 1) throw new Error("MAR threshold must be a number of minutes.");
      if (!Number.isFinite(dischargeClearanceMinutes) || dischargeClearanceMinutes < 1) throw new Error("Discharge threshold must be a number of minutes.");
      if (!Number.isFinite(reportUploadDelayMinutes) || reportUploadDelayMinutes < 1) throw new Error("Report upload threshold must be a number of minutes.");
      if (!Number.isFinite(documentReadinessMinutes) || documentReadinessMinutes < 1) throw new Error("Document readiness threshold must be a number of minutes.");
      if (!Number.isFinite(goLiveChecklistReminderMinutes) || goLiveChecklistReminderMinutes < 1) throw new Error("Go-live checklist threshold must be a number of minutes.");
      await api.saveAutomationSettings(currentUser, {
        hospitalId: currentUser.hospitalId || undefined,
        branchId: currentUser.role === ROLES.BRANCH_ADMIN ? currentUser.branchId : undefined,
        queueWaitingMinutes,
        labPendingMinutes,
        radiologyPendingMinutes,
        pharmacyPendingMinutes,
        billingPendingMinutes,
        marDueMinutes,
        dischargeClearanceMinutes,
        reportUploadDelayMinutes,
        documentReadinessMinutes,
        goLiveChecklistReminderMinutes,
        autoTaskCreationEnabled: Boolean(values.autoTaskCreationEnabled),
        reminderNotificationsEnabled: Boolean(values.reminderNotificationsEnabled)
      });
      automationSettingsCache = null;
      goLiveChecklistCache = null;
      toast("Settings saved.");
      render();
    }
    if (action === "save-compliance") {
      api.logSensitiveAction?.(currentUser, "compliance", "Compliance settings updated", "Privacy controls");
      toast("Compliance settings saved.");
      render();
    }
    if (action === "request-restore") {
      await api.requestRestore(currentUser, { notes: values.notes, approvalStatus: "Requested" });
      createTarget = null;
      toast("Restore request logged for approval.");
      render();
    }
    if (action === "save-setup") {
      await api.saveSetupWizard(currentUser, values);
      goLiveChecklistCache = null;
      toast("Setup progress saved.");
      render();
    }
    if (action === "create-doctor-schedule") {
      await api.createDoctorSchedule(currentUser, values);
      toast("Doctor schedule created.");
      render();
    }
    if (action === "create-staff-roster") {
      await api.createStaffRoster(currentUser, values);
      toast("Duty roster created.");
      render();
    }
    if (action === "create-emergency") {
      await api.createEmergencyCase(currentUser, values);
      toast("Emergency case created.");
      render();
    }
    if (action === "upload-document") {
      const file = form.querySelector('input[type="file"]')?.files?.[0];
      if (file) {
        const dataUrl = await readFileAsDataUrl(file);
        values.originalFilename = file.name;
        values.mimeType = file.type;
        values.sizeBytes = file.size;
        values.contentBase64 = dataUrl.split(",")[1] || "";
      }
      await api.uploadDocument(currentUser, values);
      toast("Document uploaded.");
      render();
    }
    if (action === "create-consent") {
      await api.createConsentForm(currentUser, values);
      toast("Consent form created.");
      render();
    }
    if (action === "create-purchase-request") {
      await api.createPurchaseRequest(currentUser, values);
      toast("Purchase request created.");
      render();
    }
    if (action === "submit-feedback") {
      await api.submitFeedback(currentUser, values);
      toast("Feedback recorded.");
      render();
    }
    if (action === "global-search") {
      globalSearchQuery = values.query || "";
      render();
    }
    if (action === "create-appointment") {
      const appointment = await api.createAppointment(currentUser, values);
      selectedPatientId = appointment.patientId || values.patientId || selectedPatientId;
      createTarget = null;
      toast("Appointment booked successfully. Next action: Check In Patient or View Queue.");
      render();
    }
    if (action === "register-patient") {
      const patient = await api.registerPatient(currentUser, values);
      selectedPatientId = patient.id;
      createTarget = null;
      toast(`Patient registered successfully. MRN: ${patient.mrn || "Generated"}. Next action: Book Appointment or Check In Now.`);
      render();
    }
    if (action === "record-vitals") {
      await api.recordVitals(currentUser, values);
      selectedPatientId = values.patientId || selectedPatientId;
      toast("Vitals saved. Next action: Send to Doctor Queue or Start Consultation.");
      render();
    }
    if (action === "complete-consultation") {
      await api.completeConsultation(currentUser, values);
      selectedPatientId = values.patientId || selectedPatientId;
      toast("Consultation completed. Next action: Send to Billing, Pharmacy, Lab, or Follow-up.");
      render();
    }
    if (action === "generate-bill") {
      await api.generateBill(currentUser, values);
      selectedPatientId = values.patientId || selectedPatientId;
      createTarget = null;
      toast(values.markPaid === "Yes" ? "Payment collected. Next action: Checkout Patient or Print Receipt." : "Draft bill generated. Next action: Collect Payment.");
      render();
    }
    if (action === "add-stock") {
      await api.addMedicineStock(currentUser, values);
      createTarget = null;
      toast("Stock added successfully.");
      render();
    }
    if (action === "book-followup") {
      await api.bookFollowUp(currentUser, values);
      toast("Follow-up booked.");
      render();
    }
    if (action === "create-admission") {
      await api.createAdmissionRequest(currentUser, values);
      toast("Admission request created.");
      render();
    }
    if (action === "save-consultation-draft") {
      if (values.consultationAction === "complete") {
        const validation = form.querySelector("[data-consultation-validation]");
        const primaryDiagnosis = String(asArray(values.diagnosis)[0] || "").trim();
        const admissionReason = String(values.admissionReason || "").trim();
        const hasOrders = [...asArray(values.labTest), ...asArray(values.radiologyTest)].some((item) => String(item || "").trim());
        let validationMessage = "";
        if (!primaryDiagnosis) validationMessage = "Primary diagnosis is required before completing this consultation.";
        else if (values.admissionRecommended === "Yes" && !admissionReason) validationMessage = "Admission reason is required when admission is recommended.";
        else if (values.noInvestigationRequired === "Yes" && hasOrders) validationMessage = "Remove investigation orders or uncheck No Investigation Required.";
        if (validationMessage) {
          if (validation) { validation.textContent = `⚠ ${validationMessage}`; validation.classList.remove("hidden"); validation.scrollIntoView({ behavior: "smooth", block: "center" }); }
          throw new Error(validationMessage);
        }
        const completed = await api.completeDoctorConsultation(currentUser, values.consultationId, values);
        toast(`Consultation completed. Next stage: ${completed.downstreamStatus}.`);
        setPage("queue");
      } else {
        await api.saveConsultationDraft(currentUser, values.consultationId, values);
        toast("Consultation draft saved.");
        render();
      }
    }
    if (action === "assign-admission-bed") {
      const ward = safeOptionalData(() => api.wards(currentUser), []).find((item) => String(item.id) === String(values.wardId));
      const bed = safeOptionalData(() => api.beds(currentUser), []).find((item) => String(item.id) === String(values.bedId));
      if (!ward || !bed || String(bed.wardId || "") !== String(ward.id)) throw new Error("Select an available bed from the selected ward.");
      await api.assignBed(currentUser, values.admissionId, { bedId: bed.id, bedNumber: bed.bed || bed.bedNumber || bed.name, wardId: ward.id, ward: ward.name || ward.wardName || ward.ward });
      createTarget = null;
      selectedAdmissionId = null;
      toast("Ward and bed assigned. Next action: Admit Patient.");
      render();
    }
    if (action === "add-daily-sheet") {
      await api.addDailyPatientSheet(currentUser, values);
      toast("Daily sheet entry saved.");
      render();
    }
    if (action === "save-doctor-progress") {
      await api.saveDoctorProgressNote(currentUser, values);
      toast("Doctor progress note draft saved.");
      render();
    }
    if (action === "add-duty-note") {
      await api.addDutyDoctorNote(currentUser, values);
      toast("Duty doctor note saved.");
      render();
    }
    if (action === "add-nursing-note") {
      await api.addNursingNote(currentUser, values);
      toast("Nursing note saved.");
      render();
    }
    if (action === "record-ipd-vitals") {
      await api.recordIPDVitals(currentUser, values);
      toast("IPD vitals saved.");
      render();
    }
    if (action === "add-intake-output") {
      await api.addIntakeOutput(currentUser, values);
      toast("Intake-output chart saved.");
      render();
    }
    if (action === "add-handover-note") {
      await api.createDoctorHandover(currentUser, values);
      toast("Handover note saved.");
      render();
    }
    if (action === "create-death-summary") {
      await api.saveDeathSummary(currentUser, values.admissionId, values);
      toast("Death Summary draft created.");
      setPage("ipdPatient360", { admissionId: values.admissionId, tab: "deathSummary" });
    }
    if (action === "update-death-summary") {
      await api.updateDeathSummary(currentUser, values.admissionId, values);
      toast("Death Summary saved.");
      setPage("ipdPatient360", { admissionId: values.admissionId, tab: "deathSummary" });
    }
    if (action === "save-mapping") {
      await api.saveMapping(currentUser, values);
      toast("Mapping saved.");
      render();
    }
    if (action === "create-task") {
      await api.createTask(currentUser, values);
      createTarget = null;
      toast("Task assigned.");
      render();
    }
    if (action === "save-edit") {
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const staffEdit = form.dataset.collection === "users" && editTarget?.staffOnly;
      const hospitalProfileEdit = form.dataset.collection === "hospitals" && editTarget?.hospitalProfile;
      const changes = normalizeEditValues(form.dataset.collection, values);
      if (staffEdit) {
        changes.allowedPages = USER_ROLE_PRESETS[changes.jobRole] || (changes.jobRole === "Mortuary Officer" ? ["dashboard", "mortuary", "mortuary-register", "mortuary-storage", "mortuary-certificates", "mortuary-release", "mortuary-search"] : ["dashboard"]);
        changes.allowedModules = USER_ROLE_MODULES[changes.jobRole] || (changes.jobRole === "Mortuary Officer" ? ["Mortuary"] : []);
      }
      await api.updateRecord(currentUser, form.dataset.collection, form.dataset.id, changes);
      editTarget = null;
      toast(hospitalProfileEdit ? "Hospital profile updated successfully." : form.dataset.collection === "branches" ? "Branch updated successfully." : staffEdit ? "Staff updated successfully." : "Record updated.");
      render();
    }
    if (action === "upload-records") {
      await api.ingestRows(currentUser, pendingUpload.rows, values.recordType);
      pendingUpload = { rows: [], recordType: values.recordType, validation: null };
      toast("Records uploaded and added to drilldown.");
      setPage("records");
    }
    // ===== NEW: reception enroll patient =====
    if (action === "reception-enroll-patient") {
      // Validation
      if (!values.name) throw new Error("Full Name is required.");
      if (!values.mobile) throw new Error("Mobile Number is required.");
      if (!values.gender) throw new Error("Gender is required.");
      if (!values.address) throw new Error("Address is required.");
      if (!/^\d{10}$/.test(values.mobile)) throw new Error("Mobile must be a valid 10-digit number.");
      if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new Error("Email is invalid.");
      if (values.dob) {
        const dobDate = new Date(values.dob);
        if (dobDate > new Date()) throw new Error("Date of Birth cannot be in the future.");
      }
      if (values.age) {
        const ageNum = Number(values.age);
        if (ageNum < 0 || ageNum > 130) throw new Error("Age must be between 0 and 130.");
      }

      if (values.enrollAction === "send-to-vitals") {
        if (!values.department?.trim()) throw new Error("Department is required to send the patient to vitals.");
        if (!values.doctor?.trim()) throw new Error("Doctor is required to send the patient to vitals.");
      }
      // Call API
      const patient = await api.registerPatient(currentUser, values);
      if (values.enrollAction === "send-to-vitals") {
        await api.sendToVitals(currentUser, { patientId: patient.id, department: values.department, doctor: values.doctor, visitType: "Walk-in" });
      }
      // Set success message and re-render
      receptionEnrollMessage = values.enrollAction === "send-to-vitals" ? `Patient enrolled and sent to OPD Vitals. MRN: ${patient.mrn || "Generated"}` : `Patient enrolled successfully. MRN: ${patient.mrn || "Generated"}`;
      render();
    }
    if (action === "reception-existing-send-to-vitals") {
      await api.sendToVitals(currentUser, { patientId: values.patientId, department: values.department, doctor: values.doctor, visitType: "OPD" });
      receptionEnrollMessage = "Existing patient sent to OPD Vitals Queue.";
      render();
    }
    if (action === "add-to-vitals-queue") {
      const appointment = safeOptionalData(() => api.appointments(currentUser), []).find((item) => String(item.id) === String(values.appointmentId));
      if (!appointment) throw new Error("Please select an eligible OPD patient.");
      await api.sendToVitals(currentUser, { patientId: appointment.patientId, appointmentId: appointment.id });
      createTarget = null;
      toast("Patient added to OPD Vitals Queue.");
      render();
    }
    // ===== NEW: reception create admission =====
    if (action === "reception-create-admission") {
      // Validation
      if (!values.patientId) throw new Error("Please select a patient.");
      if (!values.admissionType) throw new Error("Admission Type is required.");
      if (!values.department) throw new Error("Department is required.");
      if (!values.admissionDate) throw new Error("Admission Date is required.");
      if (!values.admissionTime) throw new Error("Admission Time is required.");
      if (!values.paymentType) throw new Error("Payment Type is required.");

      // Prepare data for API (map field names)
      const admissionData = {
        patientId: values.patientId,
        admissionType: values.admissionType,
        department: values.department,
        doctor: values.doctor || "",
        admissionDateTime: `${values.admissionDate}T${values.admissionTime}`,
        attendantName: values.attendantName || "",
        attendantMobile: values.attendantMobile || "",
        paymentType: values.paymentType,
        insuranceCorporateName: values.insuranceCorporateName || "",
        adminNotes: values.adminNotes || ""
      };

      await api.createAdmissionRequest(currentUser, admissionData);
      receptionAdmissionMessage = "Admission created successfully.";
      render();
    }
  } catch (error) {
    toast(error.message, "error");
  } finally {
    stopFormLoading(form, loadingState);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const target = event.target.closest?.("[data-route], [data-action], [data-patient-filter], [data-admission-filter]");
  if (!target) return;
  if (target.matches("button, a, input, select, textarea")) return;
  event.preventDefault();
  target.click();
});

function emptyStateCreateAction(page) {
  const map = {
    dashboard: "register-patient", appointments: "create-appointment", patients: "register-patient", queue: "create-appointment",
    admissions: "create-admission", billing: "generate-bill", finance: "generate-bill", stock: "add-stock", inventory: "add-stock", "stock-logic": "add-stock",
    purchase: "create-purchase-request", doctorSchedule: "create-doctor-schedule", staffRoster: "create-staff", emergency: "create-emergency",
    ot: "schedule-surgery", radiology: "order-radiology", mortuary: "register-death", permissionTemplates: "create-permission-template",
    hospitals: "create-hospital", branches: "create-branch", users: "create-user", masterData: "create-master-data", subscriptions: "create-subscription", offers: "create-offer", tasks: "create-task", followups: "book-followup",
    vitals: "record-vitals", ipdVitals: "record-ipd-vitals", dailySheets: "add-daily-sheet", dutyDoctor: "add-duty-note", nursing: "add-nursing-note",
    intakeOutput: "add-intake-output", handover: "add-handover-note", documents: "upload-document", feedback: "submit-feedback",
    "lab-samples": "create-master-data", "lab-processing": "create-master-data", "lab-results": "create-master-data",
    "radiology-scheduling": "order-radiology", "radiology-queue": "order-radiology", "radiology-imaging": "order-radiology",
    wards: "create-ward", ipd: "create-admission",
  };
  return map[page] || null;
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("button, a");
  const delegatedTarget = target || event.target.closest?.("[data-route], [data-action], [data-patient-filter], [data-admission-filter]");
  if (!delegatedTarget) {
    const row = event.target.closest("tr[data-route]");
    if (!row) return;
    if (event.target.closest("button, a, input, select, textarea, label")) return;
    const patientId = row.dataset.patientId;
    const admissionId = row.dataset.admissionId;
    const tab = row.dataset.tab;
    if (patientId) selectedPatientId = patientId;
    notificationsDrawerOpen = false;
    setPage(row.dataset.route, { patientId, admissionId, tab });
    return;
  }

  if (delegatedTarget.dataset.action === "empty-state-add") {
    event.preventDefault();
    event.stopPropagation();
    const page = String(delegatedTarget.dataset.emptyPage || pageFromHash() || "dashboard");
    if (currentUser?.role === ROLES.BRANCH_USER && /^(doctor|surgeon)$/.test(String(currentUser?.jobRole || "").toLowerCase()) && page === "notifications") return;
    const formAction = emptyStateCreateAction(page);
    if (!formAction || !createForm(formAction)) {
      toast("There is no add form available for this section.", "error");
      return;
    }
    createTarget = formAction;
    render();
    return;
  }

  if (target.dataset.action === "open-create") {
    event.preventDefault();
    const formAction = String(target.dataset.formAction || "").trim();
    if (!formAction || !createForm(formAction)) {
      toast("This form is unavailable for your current access.", "error");
      return;
    }
    createTarget = formAction;
    render();
    return;
  }

  if (handleNursePatientClick(delegatedTarget)) return;

  if (delegatedTarget.dataset.route) {
    const patientId = delegatedTarget.dataset.patientId;
    const admissionId = delegatedTarget.dataset.admissionId;
    const branchId = delegatedTarget.dataset.branchId;
    const tab = delegatedTarget.dataset.tab;
    if (delegatedTarget.dataset.notification && hasPermission(currentUser, "notifications", "edit")) {
      await api.markNotificationRead(currentUser, delegatedTarget.dataset.notification).catch(() => null);
    }
    if (patientId) selectedPatientId = patientId;
    notificationsDrawerOpen = false;
    setPage(delegatedTarget.dataset.route, { patientId, admissionId, branchId, tab });
    return;
  }

  const action = delegatedTarget.dataset.action;
  if (action === "pharmacy-clear-search") {
    clearPharmacySearch();
    render();
    return;
  }
  if (action === "pharmacy-verify") {
    try {
      await api.verifyPharmacyPrescription(currentUser, delegatedTarget.dataset.prescription);
      toast("Prescription verified and moved to pending payment.");
      render();
    } catch (error) { toast(error.message, "error"); }
    return;
  }
  if (action === "pharmacy-proceed-payment") {
    setPage("pharmacy-payments");
    return;
  }
  if (delegatedTarget.dataset.patientFilter) {
    setPatientStatusFilter(delegatedTarget.dataset.patientFilter);
    render();
    return;
  }
  if (delegatedTarget.dataset.admissionFilter) {
    setAdmissionStatusFilter(delegatedTarget.dataset.admissionFilter);
    render();
    return;
  }
  if (action === "manage-admission") {
    selectedAdmissionId = target.dataset.admission;
    createTarget = "manage-admission";
    render();
    return;
  }
  if (action === "doctor-review-vitals") {
    selectedQueueTokenId = target.dataset.queueToken;
    createTarget = "review-opd-vitals";
    render();
    return;
  }
  if (action === "toggle-password-visibility") {
    const input = target.closest(".password-field")?.querySelector("input");
    if (input) {
      const revealing = input.type === "password";
      input.type = revealing ? "text" : "password";
      target.textContent = revealing ? "Hide" : "Show";
      target.setAttribute("aria-label", revealing ? "Hide password" : "Show password");
    }
    return;
  }
  const buttonLoadingState = startButtonLoading(target, action);
  try {
    if (action === "retry-page") {
      render();
    }
    if (action === "toggle-notifications") {
      notificationsDrawerOpen = !notificationsDrawerOpen;
      render();
    }
    if (action === "close-notifications") {
      notificationsDrawerOpen = false;
      render();
    }
    if (action === "mark-all-notifications-read") {
      await api.markAllNotificationsRead(currentUser);
      toast("All notifications marked read.");
      render();
    }
    if (action === "clear-read-notifications") {
      await api.clearReadNotifications(currentUser);
      toast("Read notifications cleared.");
      render();
    }
    if (action === "run-provider-check") {
      goLiveChecklistCache = null;
      const status = await api.providerStatus();
      const summary = [
        status.mongodb?.status,
        status.email?.status,
        status.storage?.status,
        status.sentry?.status,
        status.betterStack?.status
      ].filter(Boolean).join(" / ");
      toast(`Provider status refreshed: ${summary}`);
      render();
    }
    if (action === "patient-view" || action === "patient-view-history") {
      selectedPatientId = target.dataset.patient;
      toast("Patient context selected.");
      render();
    }
    if (action === "emr-select") {
      selectedPatientId = target.dataset.patient;
      render();
    }
    if (action === "emr-clear") {
      selectedPatientId = null;
      render();
    }
    if (action === "patient-book-appointment") {
      selectedPatientId = target.dataset.patient;
      createTarget = "create-appointment";
      render();
    }
    if (action === "patient-create-admission") {
      selectedPatientId = target.dataset.patient;
      setPage("admissions", { patientId: selectedPatientId });
    }
    if (action === "admit-patient") {
      await api.admitPatient(currentUser, target.dataset.admission);
      toast("Patient admitted. The admission is now visible to Nursing.");
      render();
    }
    if (action === "patient-record-vitals") {
      selectedPatientId = target.dataset.patient;
      setPage("vitals", { patientId: selectedPatientId });
    }
    if (action === "patient-start-consultation") {
      selectedPatientId = target.dataset.patient;
      setPage("consultation", { patientId: selectedPatientId });
    }
    if (action === "add-consultation-row") {
      const form = target.closest("form");
      const kind = target.dataset.rowKind;
      const list = form?.querySelector(`[data-consultation-list="${kind}"]`);
      if (!list) return;
      list.querySelector(".consultation-empty")?.remove();
      const remove = `<button class="button tiny danger" type="button" data-action="remove-consultation-row">Remove</button>`;
      const templates = {
        diagnosis: `<div class="consultation-repeat-row diagnosis-row" data-consultation-row="diagnosis"><label>Secondary Diagnosis<input name="diagnosis" /></label><label>Notes<input name="diagnosisNotes" /></label>${remove}</div>`,
        lab: `<div class="consultation-repeat-row" data-consultation-row="lab"><label>Lab Test<input name="labTest" placeholder="CBC" /></label><label>Clinical Indication<input name="labIndication" /></label><label>Priority<select name="labPriority"><option>Routine</option><option>Urgent</option><option>STAT</option></select></label><label>Notes<input name="labNotes" /></label>${remove}</div>`,
        radiology: `<div class="consultation-repeat-row" data-consultation-row="radiology"><label>Study<input name="radiologyTest" placeholder="Chest X-ray" /></label><label>Clinical Indication<input name="radiologyIndication" /></label><label>Priority<select name="radiologyPriority"><option>Routine</option><option>Urgent</option><option>STAT</option></select></label><label>Notes<input name="radiologyNotes" /></label>${remove}</div>`,
        medicine: `<div class="consultation-repeat-row medicine-row" data-consultation-row="medicine"><label>Medicine<input name="medicine" placeholder="Paracetamol" /></label><label>Strength<input name="strength" placeholder="500 mg" /></label><label>Dose<input name="dose" placeholder="1 tablet" /></label><label>Route<input name="route" placeholder="Oral" /></label><label>Frequency<input name="frequency" placeholder="Twice daily" /></label><label>Duration<input name="duration" placeholder="3 days" /></label><label>Instructions<input name="instructions" placeholder="After food" /></label>${remove}</div>`
      };
      list.insertAdjacentHTML("beforeend", templates[kind] || "");
      if (["lab", "radiology"].includes(kind)) { const noInvestigation = form.querySelector("[data-no-investigation]"); if (noInvestigation) noInvestigation.checked = false; }
      list.querySelector(`[data-consultation-row="${kind}"]:last-child input`)?.focus();
    }
    if (action === "remove-consultation-row") {
      const row = target.closest("[data-consultation-row]");
      const list = row?.parentElement;
      const kind = row?.dataset.consultationRow;
      row?.remove();
      if (list && !list.querySelector("[data-consultation-row]")) list.innerHTML = `<p class="consultation-empty">No ${kind === "medicine" ? "medicines" : kind === "lab" ? "lab orders" : kind === "radiology" ? "radiology orders" : "secondary diagnoses"} added.</p>`;
    }
    if (action === "doctor-start-consultation") {
      const encounter = { queueTokenId: target.dataset.queueToken || "", patientId: target.dataset.patientId || "", appointmentId: target.dataset.appointmentId || "" };
      if (!encounter.queueTokenId && !(encounter.patientId && encounter.appointmentId)) throw new Error("Unable to start consultation: queue encounter is incomplete.");
      const consultation = await api.startConsultation(currentUser, encounter);
      selectedPatientId = consultation.patientId;
      toast(`Consultation ${consultation.id} started.`);
      setPage("consultation", { patientId: consultation.patientId, consultationId: consultation.id });
    }
    if (action === "patient-generate-bill") {
      selectedPatientId = target.dataset.patient;
      createTarget = "generate-bill";
      render();
    }
    if (action === "open-ipd-360") {
      setPage("ipdPatient360", { admissionId: target.dataset.patient });
    }
    if (action === "patient-check-in") {
      const appointments = safeOptionalData(() => api.appointments(currentUser), []);
      const appointment = appointments.find((item) => String(item.patientId) === String(target.dataset.patient) && ["Booked", "Active"].includes(item.status || "Active"));
      if (!appointment) {
        toast("Book an appointment before check-in.", "error");
      } else {
        await api.checkInAppointment(currentUser, appointment.id);
        toast("Patient checked in. Next action: record vitals or view queue.");
        setPage("queue", { patientId: target.dataset.patient });
      }
    }
    if (action === "download-document") {
      const file = await api.downloadDocument(currentUser, target.dataset.documentId);
      downloadBase64File(file);
      toast("Document downloaded.");
    }
    if (action === "patient-download-document") {
      const file = await api.downloadPatientPortalDocument(target.dataset.documentId);
      downloadBase64File(file);
      toast("Document downloaded.");
    }
    if (action === "send-patient-portal-invite") {
      const result = await api.sendPatientPortalInvite(currentUser, target.dataset.patientId);
      toast(result.emailStatus === "skipped" ? "Portal invite recorded. Email provider is not configured, so no email was sent." : "Portal invite sent.");
      render();
    }
    if (action === "toggle-branch-patient-portal") {
      const nextEnabled = target.dataset.enabled !== "true";
      await api.setBranchPatientPortalAccess(currentUser, target.dataset.branchId, nextEnabled);
      toast(nextEnabled ? "Patient portal access enabled for this branch." : "Patient portal access disabled for this branch.");
      render();
    }
    if (action === "toggle-branch-public-booking") {
      const nextEnabled = target.dataset.enabled !== "true";
      await api.setBranchPublicBookingAccess(currentUser, target.dataset.branchId, nextEnabled);
      toast(nextEnabled ? "Public website booking enabled for this branch." : "Public website booking disabled for this branch.");
      render();
    }
    if (action === "delete-document-file") {
      await api.deleteDocumentFile(currentUser, target.dataset.documentId);
      toast("Document deleted.");
      render();
    }
    if (action === "close-create") {
      createTarget = null;
      render();
    }
    if (action === "select-permission-group" || action === "clear-permission-group") {
      const form = target.closest('form[data-action="create-user"]');
      form?.querySelectorAll(`input[name="allowedPages"][data-group="${target.dataset.group}"]`).forEach((input) => {
        if (!input.disabled) input.checked = action === "select-permission-group";
      });
      updatePermissionBuilder(form);
    }
    if (action === "preview-permissions") {
      updatePermissionBuilder(target.closest('form[data-action="create-user"]'));
      toast("Access preview updated.");
    }
    if (action === "view-access") {
      accessReviewTarget = target.dataset.user;
      render();
    }
    if (action === "review-access") {
      await api.reviewUserAccess(currentUser, target.dataset.user, target.dataset.review);
      accessReviewTarget = target.dataset.user;
      toast(target.dataset.review === "Reviewed" ? "User access marked reviewed." : "Access changes requested.");
      render();
    }
    if (action === "revoke-sensitive") {
      await api.revokeSensitivePermissions(currentUser, target.dataset.user);
      accessReviewTarget = target.dataset.user;
      toast("Sensitive permissions revoked.");
      render();
    }
    if (action === "disable-access-user") {
      await api.disableUser(currentUser, target.dataset.user);
      accessReviewTarget = target.dataset.user;
      toast("User disabled.");
      render();
    }
    if (action === "duplicate-template") {
      await api.duplicatePermissionTemplate(currentUser, target.dataset.template);
      toast("Permission template duplicated.");
      render();
    }
    if (action === "disable-template") {
      await api.disablePermissionTemplate(currentUser, target.dataset.template);
      toast("Permission template disabled.");
      render();
    }
    if (action === "subscription-info") {
      api.logSensitiveAction?.(currentUser, "subscriptions", "Plan setup opened", "Subscription plans");
      toast("Plan setup request logged. Configure billing limits with the SaaS owner.");
    }
    if (action === "disable-subscription") {
      await api.disableSubscriptionPlan(currentUser, target.dataset.plan);
      toast("Subscription plan disabled. Existing hospitals remain visible.");
      render();
    }
    if (action === "disable-offer") {
      await api.disableOffer(currentUser, target.dataset.offer);
      toast("Offer disabled.");
      render();
    }
    if (action === "ot-advance") {
      const note = target.dataset.note || "";
      await api.transitionOtBooking(currentUser, target.dataset.ot, { status: target.dataset.status, note });
      toast(`OT case moved to ${target.dataset.status}.`);
      render();
    }
    if (action === "ot-cancel") {
      await api.transitionOtBooking(currentUser, target.dataset.ot, { status: "Cancelled", note: "Cancelled from OT board." });
      toast("OT case cancelled.");
      render();
    }
    if (action === "rad-advance") {
      const nextStatus = target.dataset.status;
      const payload = { status: nextStatus };
      if (nextStatus === "Reported") {
        const impression = window.prompt("Radiologist impression (required to report):", target.dataset.impression || "");
        if (!impression) return;
        payload.impression = impression;
        payload.findings = window.prompt("Findings (optional):", "") || "";
      }
      await api.transitionRadiologyOrder(currentUser, target.dataset.rad, payload);
      toast(`Imaging study moved to ${nextStatus}.`);
      render();
    }
    if (action === "rad-cancel") {
      await api.transitionRadiologyOrder(currentUser, target.dataset.rad, { status: "Cancelled", note: "Cancelled from RIS board." });
      toast("Imaging study cancelled.");
      render();
    }
    if (action === "mortuary-release") {
      const releasedTo = window.prompt("Released to (name of person receiving the body):");
      if (!releasedTo) return;
      const relationship = window.prompt("Relationship to the deceased:") || "";
      const isMlc = target.dataset.mlc === "true";
      const policeClearance = isMlc ? window.confirm("MLC case: confirm police clearance has been obtained?") : false;
      await api.releaseMortuaryBody(currentUser, target.dataset.mortuary, { releasedTo, relationship, policeClearance });
      toast("Body released and recorded.");
      render();
    }
    if (action === "mortuary-certificate") {
      const causeOfDeath = window.prompt("Cause of death for the certificate:", target.dataset.cause || "");
      if (!causeOfDeath) return;
      await api.issueDeathCertificate(currentUser, target.dataset.mortuary, { causeOfDeath });
      toast("Death certificate issued.");
      render();
    }
    if (action === "module-toggle") {
      api.logSensitiveAction?.(currentUser, "modules", "Module configuration reviewed", target.dataset.module);
      toast(`${target.dataset.module} module configuration reviewed.`);
    }
    if (action === "select-search-result") {
      const item = globalSearchSuggestions[Number(target.dataset.searchIndex || 0)];
      if (item) {
        globalSearchQuery = item.title || globalSearchQuery;
        const route = searchResultRoute(item);
        setPage(route.page, route.query);
      }
    }
    if (action === "view-all-search") {
      setPage("globalSearch");
      render();
    }
    if (action === "retry-global-search") {
      runGlobalSearch(globalSearchQuery);
    }
    if (action === "open-edit") {
      editTarget = { collection: target.dataset.collection, id: target.dataset.id };
      render();
    }
    if (action === "edit-hospital-profile") {
      editTarget = { collection: "hospitals", id: target.dataset.id, hospitalProfile: true };
      render();
    }
    if (action === "edit-staff") {
      editTarget = { collection: "users", id: target.dataset.id, staffOnly: true };
      render();
    }
    if (action === "toggle-staff-status") {
      if (currentUser.role !== ROLES.HOSPITAL_ADMIN || !hasPermission(currentUser, "staffRoster", "edit")) throw new Error("You do not have permission to change staff status.");
      const nextStatus = String(target.dataset.status || "Active").toLowerCase() === "active" ? "Inactive" : "Active";
      await api.updateRecord(currentUser, "users", target.dataset.id, { status: nextStatus });
      toast(`Staff account ${nextStatus === "Active" ? "activated" : "deactivated"} successfully.`);
      render();
    }
    if (action === "reset-staff-password") {
      if (currentUser.role !== ROLES.HOSPITAL_ADMIN || !hasPermission(currentUser, "staffRoster", "edit")) throw new Error("You do not have permission to reset staff passwords.");
      const password = window.prompt("Enter a new temporary password (minimum 8 characters):");
      if (password === null) return;
      if (password.length < 8) { toast("Temporary password must contain at least 8 characters.", "error"); return; }
      const confirmation = window.prompt("Confirm the new temporary password:");
      if (password !== confirmation) { toast("Passwords do not match.", "error"); return; }
      await api.updateRecord(currentUser, "users", target.dataset.id, { password, mustChangePassword: true });
      toast("Staff password reset successfully. The employee must change it at next login.");
      render();
    }
    if (action === "view-branch") {
      editTarget = { collection: "branches", id: target.dataset.id, viewOnly: true };
      render();
    }
    if (action === "toggle-branch-status") {
      if (currentUser.role !== ROLES.HOSPITAL_ADMIN || !hasPermission(currentUser, "branches", "edit")) throw new Error("You do not have permission to change branch status.");
      const nextStatus = String(target.dataset.status || "Active").toLowerCase() === "active" ? "Inactive" : "Active";
      await api.updateRecord(currentUser, "branches", target.dataset.id, { status: nextStatus });
      toast(`Branch ${nextStatus === "Active" ? "activated" : "deactivated"} successfully.`);
      render();
    }
    if (action === "close-edit") {
      editTarget = null;
      render();
    }
    if (action === "delete-record") {
      if (target.dataset.collection === "patients") {
        const dependencies = patientDeleteDependencies(target.dataset.id);
        if (dependencies.length) {
          toast("Patient cannot be deleted because hospital workflow records are linked to this patient.", "error");
          return;
        }
      }
      deleteTarget = { collection: target.dataset.collection, id: target.dataset.id };
      render();
    }
    if (action === "cancel-delete") {
      deleteTarget = null;
      render();
    }
    if (action === "confirm-delete-record") {
      if (target.dataset.collection === "patients" && patientDeleteDependencies(target.dataset.id).length) {
        deleteTarget = null;
        toast("Patient cannot be deleted because an appointment or workflow record is linked.", "error");
        render();
        return;
      }
      await api.deleteRecord(currentUser, target.dataset.collection, target.dataset.id);
      if (target.dataset.collection === "patients" && String(selectedPatientId || "") === String(target.dataset.id || "")) selectedPatientId = null;
      deleteTarget = null;
      toast("Record deleted.");
      render();
    }
    if (action === "logout") {
      await api.logout(currentUser);
      currentUser = null;
      hospitalAdminBranchId = "all";
      selectedPatientId = null;
      globalSearchQuery = "";
      globalSearchSuggestions = [];
      globalSearchStatus = "idle";
      globalSearchError = "";
      notificationsDrawerOpen = false;
      setPage("login");
      render();
    }
    if (action === "sample-upload") {
      const type = document.querySelector('select[name="recordType"]')?.value || "Appointments";
      pendingUpload.rows = parseCsv(sampleCsv());
      pendingUpload.recordType = type;
      pendingUpload.validation = validateRows(pendingUpload.rows, type);
      toast("Sample CSV loaded.");
      render();
    }
    if (action === "ack-alert") {
      await api.updateAlert(currentUser, target.dataset.alert, "Acknowledged");
      toast("Alert acknowledged.");
      render();
    }
    if (action === "task-from-alert") {
      const alert = api.alerts(currentUser).find((item) => item.id === target.dataset.alert);
      await api.createTask(currentUser, {
        title: `Action: ${alert.title}`,
        description: alert.recommendation,
        linkedAlert: alert.id,
        linkedRecords: alert.linkedRecords,
        branchId: alert.branchId,
        department: alert.department,
        assignedTo: alert.owner,
        priority: alert.risk,
        due: alert.due
      });
      toast("Task created from alert.");
      setPage("tasks");
    }
    if (action === "complete-task") {
      await api.updateTask(currentUser, target.dataset.task, "Completed");
      toast("Task marked complete.");
      render();
    }
    if (action === "check-in") {
      const result = await api.checkInAppointment(currentUser, target.dataset.appointment);
      toast(result?.status === "Arrived" ? "Patient arrival confirmed. Check-In is now available." : `Patient checked in${result?.tokenNumber ? ` with token ${result.tokenNumber}` : ""}. Next action: Record Vitals or View Queue.`);
      render();
    }
    if (action === "select-admin-branch") {
      hospitalAdminBranchId = target.dataset.branchId || "all";
      render();
    }
    if (action === "send-to-vitals") {
      const appointment = safeOptionalData(() => api.appointments(currentUser), []).find((item) => String(item.id) === String(target.dataset.appointment));
      if (!appointment) throw new Error("Appointment could not be found.");
      await api.sendToVitals(currentUser, { patientId: appointment.patientId, appointmentId: appointment.id });
      toast("Patient sent to OPD Vitals Queue.");
      render();
    }
    if (action === "lab-ready") {
      await api.updateLabOrder(currentUser, target.dataset.order, {
        status: "Report Ready",
        reportFile: `Report-${target.dataset.order}.pdf`
      });
      toast("Report marked ready.");
      render();
    }
    if (action === "issue-pharmacy") {
      await api.issuePharmacy(currentUser, target.dataset.issue);
      toast("Medicines issued.");
      render();
    }
    if (action === "collect-payment") {
      await api.collectPayment(currentUser, target.dataset.bill);
      toast("Payment collected. Next action: Checkout Patient or Print Receipt.");
      render();
    }
    if (action === "pay-online") {
      const billId = target.dataset.bill;
      const order = await api.createRazorpayOrder(currentUser, billId);
      if (typeof window.Razorpay !== "function") throw new Error("Payment popup could not load. Check your connection and try again.");
      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Hospital Operations",
        description: "Bill payment",
        handler: async (response) => {
          try {
            await api.verifyRazorpayPayment(currentUser, billId, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            toast("Payment verified and recorded. Next action: Checkout Patient or Print Receipt.");
            render();
          } catch (error) {
            toast(error.message, "error");
          }
        },
        modal: {
          ondismiss: () => toast("Payment window closed. No payment was recorded.")
        }
      });
      checkout.open();
    }
    if (action === "complete-checkout") {
      await api.completeCheckout(currentUser, target.dataset.checkout);
      toast("Patient checkout completed.");
      render();
    }
    if (action === "assign-bed") {
      await api.assignBed(currentUser, target.dataset.admission, { bedId: target.dataset.bed });
      toast("Bed assigned and daily sheet created.");
      render();
    }
    if (action === "update-bed-status") {
      await api.updateRecord(currentUser, "beds", target.dataset.bed, { status: target.dataset.status });
      toast(`Bed marked ${target.dataset.status}.`);
      render();
    }
    if (action === "mark-med-given") {
      await api.markMedicationGiven(currentUser, target.dataset.mar);
      toast("Medication marked given.");
      render();
    }
    if (action === "accept-handover") {
      await api.acceptHandover(currentUser, target.dataset.handover);
      toast("Handover accepted.");
      render();
    }
    if (action === "complete-discharge") {
      await api.completeDischargeStep(currentUser, target.dataset.plan);
      toast("Discharge checklist completed.");
      render();
    }
    if (action === "complete-clearance") {
      const fieldMap = {
        doctor: { doctorAdviceCompleted: true },
        nursing: { nursingClearance: true },
        pharmacy: { pharmacyClearance: true },
        lab: { labRadiologyClearance: true },
        billing: { billingClearance: true },
        insurance: { insuranceClearance: true },
        education: { patientEducationGiven: true },
        bed: { bedReleased: true }
      };
      await api.completeClearance(currentUser, target.dataset.plan, fieldMap[target.dataset.clearance] || {});
      toast("Clearance completed.");
      render();
    }
    if (action === "submit-death-summary") {
      await api.submitDeathSummary(currentUser, target.dataset.admission);
      toast("Death Summary submitted for review.");
      setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
    }
    if (action === "approve-death-summary") {
      await api.approveDeathSummary(currentUser, target.dataset.admission);
      toast("Death Summary finalized.");
      setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
    }
    if (action === "return-death-summary") {
      await api.returnDeathSummary(currentUser, target.dataset.admission, { reason: "Correction requested from clinical review." });
      toast("Death Summary returned for correction.");
      setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
    }
    if (action === "print-death-summary") {
      await api.printDeathSummary(currentUser, target.dataset.admission);
      toast("Death Summary print/export recorded.");
      setPage("ipdPatient360", { admissionId: target.dataset.admission, tab: "deathSummary" });
      setTimeout(() => window.print?.(), 100);
    }
    if (action === "toggle-master-data") {
      const item = safeOptionalData(() => api.masterDataItems(currentUser), []).find((entry) => String(entry.id) === String(target.dataset.master));
      await api.toggleMasterDataItem(currentUser, target.dataset.master, {
        status: item?.status === "Active" ? "Inactive" : "Active",
        isActive: item?.status !== "Active"
      });
      toast("Master record updated.");
      render();
    }
    if (action === "mark-notification-read") {
      await api.markNotificationRead(currentUser, target.dataset.notification);
      toast("Notification marked read.");
      render();
    }
    if (action === "stock-adjust") {
      await api.adjustStock(currentUser, { stockId: target.dataset.stock, quantityChange: 10, reason: "Manual stock correction" });
      toast("Stock adjusted.");
      render();
    }
    if (action === "approve-purchase") {
      await api.approvePurchaseRequest(currentUser, target.dataset.request);
      toast("Purchase request approved and PO created.");
      render();
    }
    if (action === "receive-goods") {
      await api.receiveGoods(currentUser, target.dataset.po);
      toast("Goods received and stock updated.");
      render();
    }
    if (action === "manual-backup") {
      await api.runManualBackup(currentUser, {
        backupId: `check-${Date.now()}`,
        dateTime: new Date().toISOString(),
        provider: "MongoDB Atlas",
        status: "Checked",
        size: "Managed in Atlas",
        triggeredBy: currentUser.email || currentUser.name,
        notes: "Backup status check recorded. Snapshot execution remains in MongoDB Atlas."
      });
      toast("Backup check logged. Complete snapshots in MongoDB Atlas.");
      render();
    }
    if (action === "request-restore") {
      createTarget = "request-restore";
      toast("Restore request logged for manual approval.");
      render();
    }
    if (action === "export-csv") {
      exportCsv(target.dataset.kind || "records");
      toast("CSV export started.");
    }
    if (action === "export-excel") {
      exportExcel();
      toast("Excel export started.");
    }
    if (action === "print-report") {
      if (!hasPermission(currentUser, "reports", "export")) throw new Error("You do not have permission to perform this action.");
      api.logSensitiveAction?.(currentUser, "reports", "Export PDF", target.dataset.kind || "report");
      await api.printDocument(currentUser, { documentType: "Report", module: "reports", recordId: target.dataset.kind || "report" }).catch(() => null);
      window.print();
    }
    if (action === "print-prescription") {
      const id = target.dataset.id;
      await api.printDocument(currentUser, { documentType: "Prescription", module: "consultation", recordId: id }).catch(() => null);
      toast("Prescription print copy opened.");
      window.print();
    }
    if (action === "print-lab-order") {
      const id = target.dataset.id;
      await api.printDocument(currentUser, { documentType: "Lab / Radiology Order", module: "lab", recordId: id }).catch(() => null);
      toast("Order print copy opened.");
      window.print();
    }
    if (action === "print-bill") {
      const id = target.dataset.id;
      await api.printDocument(currentUser, { documentType: "Bill / Receipt", module: "billing", recordId: id }).catch(() => null);
      toast("Bill print copy opened.");
      window.print();
    }
  } catch (error) {
    toast(error.message, "error");
  } finally {
    stopButtonLoading(target, buttonLoadingState);
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.matches?.("[data-hospital-logo-input]") && event.target.files?.[0]) {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) { toast("Hospital logo must be an image file.", "error"); event.target.value = ""; return; }
    if (file.size > 2 * 1024 * 1024) { toast("Hospital logo must be smaller than 2 MB.", "error"); event.target.value = ""; return; }
    const dataUrl = await readFileAsDataUrl(file);
    const form = event.target.closest(".hospital-profile-form");
    const value = form?.querySelector("[data-hospital-logo-value]");
    const preview = form?.querySelector("[data-hospital-logo-preview]");
    if (value) value.value = dataUrl;
    if (preview) preview.innerHTML = `<img src="${escapeAttribute(dataUrl)}" alt="Hospital logo preview" />`;
    return;
  }
  if (event.target.matches?.("[data-staff-branch]")) {
    const form = event.target.closest(".staff-form");
    const department = form?.querySelector("[data-staff-department]");
    const branchId = String(event.target.value || "");
    if (department) {
      department.value = "";
      department.querySelectorAll("option[data-branch-id]").forEach((option) => {
        option.hidden = Boolean(branchId) && !["all", branchId].includes(String(option.dataset.branchId || "all"));
      });
    }
    return;
  }
  if (event.target.matches?.("[data-branch-status]")) {
    const panel = event.target.closest("[data-branch-management]");
    const status = event.target.value;
    const query = panel?.querySelector("[data-branch-search]")?.value.trim().toLowerCase() || "";
    let visible = 0;
    panel?.querySelectorAll("[data-branch-row]").forEach((row) => {
      const show = (!query || row.dataset.branchSearchText.includes(query)) && (status === "all" || row.dataset.branchStatusValue === status);
      row.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    panel?.querySelector("[data-branch-filter-empty]")?.classList.toggle("hidden", visible > 0);
    return;
  }
  const input = event.target;
  if (input.matches?.("[data-hospital-admin-branch]")) {
    hospitalAdminBranchId = input.value || "all";
    render();
    return;
  }
  if (input.matches?.("[data-progressive-toggle]")) {
    const form = input.closest("form");
    const fields = form?.querySelector(`[data-progressive-fields="${input.dataset.progressiveToggle}"]`);
    fields?.classList.toggle("hidden", !input.checked);
    return;
  }
  if (input.matches?.("[data-no-investigation]")) {
    const form = input.closest("form");
    const orderRows = form?.querySelectorAll('[data-consultation-row="lab"], [data-consultation-row="radiology"]') || [];
    if (input.checked && orderRows.length) {
      if (!window.confirm("Clear the added Lab and Radiology orders?")) { input.checked = false; return; }
      orderRows.forEach((row) => row.remove());
      ["lab", "radiology"].forEach((kind) => {
        const list = form.querySelector(`[data-consultation-list="${kind}"]`);
        if (list) list.innerHTML = `<p class="consultation-empty">No ${kind} orders added.</p>`;
      });
    }
    return;
  }
  if (input.matches?.("[data-admission-ward]")) {
    const bedSelect = input.closest("form")?.querySelector("[data-admission-bed]");
    if (bedSelect) {
      bedSelect.value = "";
      [...bedSelect.options].forEach((option) => {
        if (!option.value) return;
        const matches = String(option.dataset.wardId || "") === String(input.value || "");
        option.hidden = !matches;
        option.disabled = !matches;
      });
    }
    return;
  }
  if (input.matches?.("[data-template-select]")) {
    const textarea = input.closest("label")?.querySelector("textarea") || input.parentElement?.previousElementSibling;
    const template = TEXT_TEMPLATES.find(([label]) => label === input.value);
    if (textarea && template?.[1]) {
      textarea.value = textarea.value.trim() ? `${textarea.value.trim()}\n\n${template[1]}` : template[1];
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      toast("Template inserted as editable draft.");
      input.value = "";
    }
    return;
  }
  const appointmentForm = input.closest?.('form[data-action="create-appointment"], form[data-action="patient-book-appointment"], form[data-action="public-book-appointment"]');
  if (appointmentForm && input.matches?.("[data-existing-patient]")) {
    fillAppointmentFromPatient(appointmentForm);
    return;
  }
  if (appointmentForm && input.matches?.("[data-appointment-department]")) {
    filterAppointmentDoctors(appointmentForm);
    return;
  }
  const userForm = input.closest?.('form[data-action="create-user"]');
  if (userForm && input.name === "jobRole") {
    applyUserRolePreset(userForm);
    return;
  }
  if (userForm && input.name === "templateId" && input.value) {
    const template = api.permissionTemplates(currentUser).find((item) => item.id === input.value);
    if (template) {
      if (userForm.jobRole) userForm.jobRole.value = template.jobRole || userForm.jobRole.value;
      setPermissionPages(userForm, template.allowedPages || []);
      const modulesInput = userForm.querySelector("[data-allowed-modules]");
      if (modulesInput) modulesInput.value = (template.allowedModules || []).join(",");
      toast("Permission template applied to preview.");
    }
    return;
  }
  if (userForm && input.name === "cloneFromUserId" && input.value) {
    const source = api.users(currentUser).find((item) => item.id === input.value);
    if (source) {
      if (userForm.jobRole) userForm.jobRole.value = source.jobRole || userForm.jobRole.value;
      setPermissionPages(userForm, source.allowedPages || []);
      const modulesInput = userForm.querySelector("[data-allowed-modules]");
      if (modulesInput) modulesInput.value = (source.allowedModules || []).join(",");
      toast("Existing user permissions copied to preview.");
    }
    return;
  }
  if (userForm && (input.name === "allowedPages" || input.name?.startsWith("permission:"))) {
    if (input.name?.startsWith("permission:") && input.value !== "view" && input.checked) {
      const row = input.closest("[data-permission-row]");
      const view = row?.querySelector('input[value="view"]');
      if (view) view.checked = true;
    }
    updatePermissionBuilder(userForm);
    return;
  }
  if (input.matches('input[type="file"][name="file"]') && input.files?.[0]) {
    const type = document.querySelector('select[name="recordType"]')?.value || "Appointments";
    const text = await readFileAsText(input.files[0]);
    pendingUpload.rows = parseCsv(text);
    pendingUpload.recordType = type;
    pendingUpload.validation = validateRows(pendingUpload.rows, type);
    toast(`${pendingUpload.rows.length} rows parsed.`);
    render();
  }

  // ===== NEW: Admission patient select auto-fill =====
  if (input.matches?.("[data-admission-patient]")) {
    const form = input.closest("form");
    const selectedOption = input.options[input.selectedIndex];
    if (selectedOption && selectedOption.value) {
      const mrn = selectedOption.dataset.mrn || "";
      const mobile = selectedOption.dataset.mobile || "";
      const age = selectedOption.dataset.age || "";
      const gender = selectedOption.dataset.gender || "";
      const ageGender = age && gender ? `${age} / ${gender}` : (age || gender || "");
      form.querySelector('[name="mrn"]').value = mrn;
      form.querySelector('[name="mobile"]').value = mobile;
      form.querySelector('[name="ageGender"]').value = ageGender;
    } else {
      form.querySelector('[name="mrn"]').value = "";
      form.querySelector('[name="mobile"]').value = "";
      form.querySelector('[name="ageGender"]').value = "";
    }
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches?.('.branch-form input, .branch-form select, .staff-form input, .staff-form select, .hospital-profile-form input, .hospital-profile-form select')) event.target.setCustomValidity?.("");
  if (event.target.matches?.("[data-branch-search]")) {
    const panel = event.target.closest("[data-branch-management]");
    const query = event.target.value.trim().toLowerCase();
    const status = panel?.querySelector("[data-branch-status]")?.value || "all";
    let visible = 0;
    panel?.querySelectorAll("[data-branch-row]").forEach((row) => {
      const show = (!query || row.dataset.branchSearchText.includes(query)) && (status === "all" || row.dataset.branchStatusValue === status);
      row.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    panel?.querySelector("[data-branch-filter-empty]")?.classList.toggle("hidden", visible > 0);
    return;
  }
  if (event.target.matches("[data-vitals-patient-search], [data-existing-patient-search]")) {
    const selector = event.target.matches("[data-vitals-patient-search]") ? "[data-vitals-patient-select]" : "[data-existing-patient-select]";
    const select = event.target.closest("form")?.querySelector(selector);
    const query = event.target.value.trim().toLowerCase();
    select?.querySelectorAll("option[data-search]").forEach((option) => { option.hidden = Boolean(query) && !option.dataset.search.includes(query); });
    if (select) select.value = "";
    return;
  }
  const input = event.target;
  if (input.matches?.("[data-admission-search]")) {
    setAdmissionSearchQuery(input.value);
    render();
    return;
  }
  if (handleNursePatientInput(input)) return;
  if (input.matches?.("[data-patient-search]")) {
    setPatientSearchQuery(input.value);
    render();
    const refreshed = app.querySelector?.("[data-patient-search]");
    refreshed?.focus();
    refreshed?.setSelectionRange(refreshed.value.length, refreshed.value.length);
    return;
  }
  if (input.matches?.("[data-global-search]")) {
    runGlobalSearch(input.value, 300);
    return;
  }
  if (input.matches?.("[data-draft-key]")) {
    scheduleDraftSave(input);
    return;
  }
  if (input.matches?.("[data-permission-search]")) {
    const query = input.value.toLowerCase();
    const form = input.closest('form[data-action="create-user"]');
    form?.querySelectorAll(".check-card").forEach((card) => {
      card.classList.toggle("hidden", query && !card.textContent.toLowerCase().includes(query));
    });
  }
  if (input.matches?.("[data-audit-search]")) {
    auditSearchQuery = input.value;
    render();
  }
});

document.addEventListener("keydown", (event) => {
  const input = event.target;
  if (input.matches?.("[data-global-search]")) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      globalSearchActiveIndex = Math.min(globalSearchSuggestions.length - 1, globalSearchActiveIndex + 1);
      render();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      globalSearchActiveIndex = Math.max(-1, globalSearchActiveIndex - 1);
      render();
    }
    if (event.key === "Escape") {
      globalSearchSuggestions = [];
      globalSearchActiveIndex = -1;
      render();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = globalSearchSuggestions[globalSearchActiveIndex];
      if (selected) globalSearchQuery = selected.title || globalSearchQuery;
      else globalSearchQuery = input.value;
      setPage("globalSearch");
    }
  }
  const row = input.closest?.("tr[data-route]");
  if (row && !input.closest?.("button, a, input, select, textarea, label")) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      row.click();
    }
  }
});

window.addEventListener("hashchange", render);

let __dataRenderScheduled = false;
function scheduleDataRender() {
  if (__dataRenderScheduled) return;
  __dataRenderScheduled = true;
  const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(cb, 16);
  raf(() => { __dataRenderScheduled = false; try { render(); } catch (_e) { /* render guards itself */ } });
}
if (typeof api.onDataRefresh === "function") {
  api.onDataRefresh((_path, error) => {
    if (error && isAuthError(error)) {
      if (currentUser) {
        currentUser = null;
        setPage("login");
        renderAuth("login");
        toast("Your session expired. Please sign in again.", "error");
      }
      return;
    }
    scheduleDataRender();
  });
}

function warmDataCache() {
  if (!currentUser || typeof api.warm !== "function") return;
  const dash = currentUser.role === "SUPER_ADMIN" ? "/platform/dashboard"
    : currentUser.role === "HOSPITAL_ADMIN" ? "/hospital/dashboard" : "/branch/dashboard";
  const gatedPaths = [
    ["/notifications", "notifications"],
    ["/patients", "patients"],
    ["/appointments", "appointments"],
    ["/queue-tokens", "queue"],
    ["/patient-flows", "queue"],
    ["/lab-orders", "lab"],
    ["/pharmacy-issues", "pharmacy"],
    ["/bills", "billing"],
    ["/admissions", "admissions"],
    ["/beds", "wards"],
    ["/tasks", "tasks"],
    ["/alerts", "alerts"],
    ["/master-data", "masterData"],
    ["/branches", "branches"],
    ["/users", "users"],
    ["/discharge-plans", "discharge"],
    ["/death-summaries", "deathSummary"],
    ["/ot-bookings", "ot"],
    ["/mortuary-records", "mortuary"],
    ["/radiology-orders", "radiology"]
  ].filter(([, module]) => permitted(module)).map(([path]) => path);
  api.warm([dash, ...gatedPaths]);
}

if (!location.hash) setPage(currentUser ? "dashboard" : "login");
render();
setTimeout(warmDataCache, 60);
