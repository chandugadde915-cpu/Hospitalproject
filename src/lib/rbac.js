// export const ROLES = {
//   SUPER_ADMIN: "SUPER_ADMIN",
//   HOSPITAL_ADMIN: "HOSPITAL_ADMIN",
//   BRANCH_ADMIN: "BRANCH_ADMIN",
//   BRANCH_USER: "BRANCH_USER",
//   PATIENT: "PATIENT"
// };

// const ROLE_ALIASES = {
//   superadmin: ROLES.SUPER_ADMIN,
//   super_admin: ROLES.SUPER_ADMIN,
//   "super admin": ROLES.SUPER_ADMIN,
//   hospitaladmin: ROLES.HOSPITAL_ADMIN,
//   hospital_admin: ROLES.HOSPITAL_ADMIN,
//   "hospital admin": ROLES.HOSPITAL_ADMIN,
//   branchadmin: ROLES.BRANCH_ADMIN,
//   branch_admin: ROLES.BRANCH_ADMIN,
//   "branch admin": ROLES.BRANCH_ADMIN,
//   branchuser: ROLES.BRANCH_USER,
//   branch_user: ROLES.BRANCH_USER,
//   "branch user": ROLES.BRANCH_USER,
//   nurse: "Nurse",
//   dutydoctor: "Duty Doctor",
//   duty_doctor: "Duty Doctor",
//   "duty doctor": "Duty Doctor",
//   labuser: "Lab User",
//   lab_user: "Lab User",
//   "lab user": "Lab User",
//   reception: "Reception",
//   "reception user": "Reception",
//   receptionist: "Reception",
//   doctor: "Doctor"
// };

// function compactToken(value) {
//   return String(value || "").trim().toLowerCase().replace(/[-_\s/]+/g, "");
// }

// export function normalizeRoleName(value) {
//   const raw = String(value || "").trim();
//   return ROLE_ALIASES[raw.toLowerCase()] || ROLE_ALIASES[compactToken(raw)] || raw;
// }

// export function normalizeSubRoleName(user = {}) {
//   return normalizeRoleName(user.subRole || user.jobRole || user.roleName || user.roleTitle || "");
// }

// export const ACTIONS = [
//   "view",
//   "create",
//   "edit",
//   "delete",
//   "approve",
//   "export",
//   "assignTask",
//   "escalate",
//   "refund",
//   "manageUsers",
//   "manageSettings"
// ];

// export const MODULES = [
//   "dashboard",
//   "hospitals",
//   "branches",
//   "users",
//   "accessReview",
//   "permissionTemplates",
//   "roles",
//   "appointments",
//   "patients",
//   "emr",
//   "queue",
//   "vitals",
//   "consultation",
//   "lab",
//   "radiology",
//   "pharmacy",
//   "billing",
//   "checkout",
//   "followups",
//   "admissions",
//   "masterData",
//   "setup",
//   "doctorSchedule",
//   "staffRoster",
//   "emergency",
//   "documents",
//   "notifications",
//   "finance",
//   "stock",
//   "stockLogic",
//   "purchase",
//   "feedback",
//   "backup",
//   "compliance",
//   "globalSearch",
//   "ipd",
//   "wards",
//   "dailySheets",
//   "dutyDoctor",
//   "nursing",
//   "ipdVitals",
//   "mar",
//   "intakeOutput",
//   "handover",
//   "discharge",
//   "ot",
//   "deathSummary",
//   "mortuary",
//   "ipdReports",
//   "ipdAlerts",
//   "claims",
//   "uploads",
//   "mapping",
//   "records",
//   "alerts",
//   "tasks",
//   "reports",
//   "audit",
//   "settings",
//   "productFlow",
//   "subscriptions",
//   "modules",
//   "inventory",
//   "incidents",
//   "beds",
//   "staff"
// ];

// const allActions = Object.fromEntries(ACTIONS.map((action) => [action, true]));
// const readExport = { view: true, export: true };
// const readWrite = { view: true, create: true, edit: true };
// const opsActions = { view: true, create: true, edit: true, delete: true, export: true, assignTask: true, escalate: true };
// const clinicalActions = { view: true, create: true, edit: true, delete: true, export: true, assignTask: true };

// export const ROLE_PERMISSIONS = {
//   [ROLES.SUPER_ADMIN]: {
//     dashboard: allActions,
//     hospitals: allActions,
//     branches: { view: true },
//     users: allActions,
//     subscriptions: allActions,
//     offers: allActions,
//     modules: allActions,
//     reports: readExport,
//     audit: readExport,
//     settings: allActions,
//     productFlow: { view: true },
//     backup: allActions,
//     compliance: readExport,
//     notifications: readWrite,
//     globalSearch: { view: true },
//     alerts: { view: true, assignTask: true, escalate: true },
//     tasks: opsActions
//   },
//   [ROLES.HOSPITAL_ADMIN]: {
//     dashboard: readExport,
//     hospitals: { view: true },
//     branches: allActions,
//     users: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     accessReview: { view: true, edit: true, export: true, manageUsers: true },
//     permissionTemplates: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     reports: readExport,
//     audit: readExport,
//     settings: { view: true, edit: true, manageSettings: true },
//     productFlow: { view: true },
//     masterData: allActions,
//     setup: allActions,
//     doctorSchedule: allActions,
//     staffRoster: allActions,
//     documents: readExport,
//     notifications: readWrite,
//     finance: readExport,
//     stock: readExport,
//     purchase: readExport,
//     feedback: readExport,
//     compliance: readExport,
//     globalSearch: { view: true },
//     alerts: opsActions,
//     tasks: opsActions,
//     appointments: readExport,
//     patients: readExport,
//     emr: readExport,
//     queue: readExport,
//     vitals: readExport,
//     consultation: readExport,
//     lab: readExport,
//     radiology: readExport,
//     pharmacy: readExport,
//     billing: readExport,
//     checkout: readExport,
//     followups: readExport,
//     admissions: readExport,
//     ipd: readExport,
//     wards: readExport,
//     dailySheets: readExport,
//     dutyDoctor: readExport,
//     nursing: readExport,
//     ipdVitals: readExport,
//     mar: readExport,
//     intakeOutput: readExport,
//     handover: readExport,
//     discharge: readExport,
//     ot: readExport,
//     deathSummary: readExport,
//     mortuary: readExport,
//     ipdReports: readExport,
//     ipdAlerts: readExport,
//     claims: readExport,
//     records: readExport,
//     staff: readExport,
//     beds: readExport,
//     inventory: readExport,
//     incidents: readExport
//   },
//   [ROLES.BRANCH_ADMIN]: {
//     dashboard: readExport,
//     hospitals: { view: true },
//     branches: { view: true },
//     users: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     accessReview: { view: true, edit: true, export: true, manageUsers: true },
//     permissionTemplates: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     roles: allActions,
//     uploads: { view: true, create: true, edit: true },
//     mapping: { view: true, create: true, edit: true },
//     records: opsActions,
//     alerts: opsActions,
//     tasks: opsActions,
//     appointments: clinicalActions,
//     patients: clinicalActions,
//     emr: readExport,
//     queue: clinicalActions,
//     vitals: clinicalActions,
//     consultation: clinicalActions,
//     lab: clinicalActions,
//     radiology: clinicalActions,
//     pharmacy: clinicalActions,
//     billing: clinicalActions,
//     checkout: clinicalActions,
//     followups: clinicalActions,
//     admissions: clinicalActions,
//     ipd: clinicalActions,
//     wards: clinicalActions,
//     dailySheets: clinicalActions,
//     dutyDoctor: clinicalActions,
//     nursing: clinicalActions,
//     ipdVitals: clinicalActions,
//     mar: clinicalActions,
//     intakeOutput: clinicalActions,
//     handover: clinicalActions,
//     discharge: clinicalActions,
//     ot: { ...clinicalActions, approve: true },
//     deathSummary: { ...clinicalActions, approve: true },
//     mortuary: { ...clinicalActions, approve: true },
//     ipdReports: readExport,
//     ipdAlerts: clinicalActions,
//     claims: clinicalActions,
//     reports: readExport,
//     audit: readExport,
//     settings: { view: true, edit: true, manageSettings: true },
//     productFlow: { view: true },
//     masterData: allActions,
//     setup: allActions,
//     doctorSchedule: allActions,
//     staffRoster: allActions,
//     emergency: clinicalActions,
//     documents: clinicalActions,
//     notifications: readWrite,
//     finance: readExport,
//     stock: allActions,
//     purchase: allActions,
//     feedback: opsActions,
//     compliance: readExport,
//     globalSearch: { view: true },
//     staff: allActions,
//     beds: allActions,
//     inventory: allActions,
//     incidents: opsActions
//   },
//   [ROLES.BRANCH_USER]: {
//     dashboard: { view: true },
//     records: readWrite,
//     alerts: { view: true },
//     tasks: { view: true, edit: true },
//     reports: readExport
//   },
//   [ROLES.PATIENT]: {
//     appointments: { view: true, create: true }
//   }
// };

// export const PAGE_KEY_ALIASES = {
//   registerPatient: "patients",
//   "reception-register-patient": "patients",
//   patientRecords: "patients",
//   "reception-patient-records": "patients",
//   admitPatient: "admissions",
//   "reception-admit-patient": "admissions",
//   admissionRecords: "admissions",
//   "reception-admission-records": "admissions",
//   createInvoice: "billing",
//   payments: "billing",
//   receipts: "billing",
//   stocklogic: "stock",
//   "stock-logic": "stock",
//   "stock logic": "stock",
//   stockLogic: "stock",
//   ipdvitals: "ipdVitals",
//   "ipd-vitals": "ipdVitals",
//   "ipd vitals": "ipdVitals",
//   dutydoctor: "dutyDoctor",
//   "duty-doctor": "dutyDoctor",
//   "duty doctor": "dutyDoctor",
//   ipdnursing: "nursing",
//   "ipd-nursing": "nursing",
//   "ipd nursing": "nursing",
//   nursingnotes: "nursing",
//   intakeoutput: "intakeOutput",
//   "intake-output": "intakeOutput",
//   "intake output": "intakeOutput",
//   dailyipdreport: "ipdReports",
//   "daily-ipd-report": "ipdReports",
//   "daily ipd report": "ipdReports",
//   ipdoverview: "ipd",
//   "ipd-overview": "ipd",
//   "ipd overview": "ipd",
//   mytasks: "tasks",
//   "my-tasks": "tasks",
//   "my tasks": "tasks",
//   ipdpatient360: "ipdPatient360",
//   "ipd-patient-360": "ipdPatient360",
//   "ipd patient 360": "ipdPatient360",
//   ot: "ot",
//   operationtheatre: "ot",
//   "operation-theatre": "ot",
//   "operation theatre": "ot",
//   "operation theater": "ot",
//   "ot management": "ot",
//   surgery: "ot",
//   mortuary: "mortuary",
//   "death registration": "mortuary",
//   "death register": "mortuary",
//   "mortuary management": "mortuary",
//   morgue: "mortuary",
//   emr: "emr",
//   ehr: "emr",
//   "medical record": "emr",
//   "patient record": "emr",
//   "health record": "emr"
// };

// export const NAV_BY_ROLE = {
//   [ROLES.SUPER_ADMIN]: [
//     ["dashboard", "Dashboard"],
//     ["hospitals", "Hospital Customers"],
//     ["users", "Admin Users"],
//     ["subscriptions", "Subscriptions"],
//     ["offers", "Offers & Coupons"],
//     ["modules", "Modules"],
//     ["reports", "Usage Analytics"],
//     ["backup", "System Backup"],
//     ["compliance", "Compliance"],
//     ["audit", "Audit Logs"],
//     ["settings", "System Settings"],
//     ["productFlow", "Product Flow"]
//   ],
//   [ROLES.HOSPITAL_ADMIN]: [
//     ["dashboard", "Dashboard"],
//     ["branches", "Hospital Branches"],
//     ["users", "Branch Admins"],
//     ["records", "Operations Overview"],
//     ["appointments", "Appointments"],
//     ["patients", "Patients"],
//     ["emr", "EMR / EHR"],
//     ["queue", "Patient Flow"],
//     ["ipd", "IPD Overview"],
//     ["ipdPatient360", "IPD Patient 360"],
//     ["ot", "Operation Theatre"],
//     ["mortuary", "Mortuary & Death Reg."],
//     ["ipdReports", "Daily IPD Report"],
//     ["billing", "Billing"],
//     ["stock", "Stock Logic"],
//     ["claims", "Claims"],
//     ["setup", "Setup Wizard"],
//     ["masterData", "Master Data"],
//     ["doctorSchedule", "Doctor Schedule"],
//     ["staffRoster", "Duty Roster"],
//     ["finance", "Finance"],
//     ["documents", "Documents"],
//     ["notifications", "Notifications"],
//     ["feedback", "Feedback"],
//     ["compliance", "Compliance"],
//     ["globalSearch", "Global Search"],
//     ["alerts", "Alerts"],
//     ["reports", "Reports"],
//     ["accessReview", "User Access Review"],
//     ["permissionTemplates", "Permission Templates"],
//     ["audit", "Audit Trail"],
//     ["settings", "Settings"],
//     ["productFlow", "Product Flow"]
//   ],
//   [ROLES.BRANCH_ADMIN]: [
//     ["dashboard", "Dashboard"],
//     ["appointments", "Appointments"],
//     ["patients", "Patients"],
//     ["emr", "EMR / EHR"],
//     ["queue", "Queue"],
//     ["vitals", "Vitals"],
//     ["consultation", "Doctor Consultation"],
//     ["lab", "Lab (LIS)"],
//     ["radiology", "Radiology (RIS)"],
//     ["pharmacy", "Pharmacy"],
//     ["billing", "Billing"],
//     ["checkout", "Checkout"],
//     ["followups", "Follow-ups"],
//     ["admissions", "Admissions"],
//     ["setup", "Setup Wizard"],
//     ["masterData", "Master Data"],
//     ["doctorSchedule", "Doctor Schedule"],
//     ["staffRoster", "Duty Roster"],
//     ["emergency", "Emergency"],
//     ["documents", "Documents"],
//     ["notifications", "Notifications"],
//     ["finance", "Finance"],
//     ["stock", "Stock Logic"],
//     ["purchase", "Purchase"],
//     ["feedback", "Feedback"],
//     ["compliance", "Compliance"],
//     ["globalSearch", "Global Search"],
//     ["ipd", "IPD Patients"],
//     ["ipdPatient360", "IPD Patient 360"],
//     ["wards", "Wards / Beds"],
//     ["dailySheets", "Daily Sheets"],
//     ["dutyDoctor", "Duty Doctor"],
//     ["nursing", "IPD Nursing"],
//     ["ipdVitals", "IPD Vitals"],
//     ["mar", "MAR"],
//     ["intakeOutput", "Intake / Output"],
//     ["handover", "Handover"],
//     ["discharge", "Discharge"],
//     ["ot", "Operation Theatre"],
//     ["deathSummary", "Death Summary"],
//     ["mortuary", "Mortuary & Death Reg."],
//     ["ipdReports", "Daily IPD Report"],
//     ["ipdAlerts", "IPD Alerts"],
//     ["uploads", "Upload Records"],
//     ["mapping", "Data Mapping"],
//     ["records", "Records"],
//     ["alerts", "Alerts"],
//     ["tasks", "Tasks"],
//     ["staff", "Staff"],
//     ["beds", "Beds / Rooms"],
//     ["inventory", "Inventory"],
//     ["incidents", "Incidents"],
//     ["reports", "Reports"],
//     ["accessReview", "User Access Review"],
//     ["permissionTemplates", "Permission Templates"],
//     ["users", "Staff Users"],
//     ["audit", "Audit Trail"],
//     ["settings", "Settings"],
//     ["productFlow", "Product Flow"]
//   ],
//   [ROLES.BRANCH_USER]: [
//     ["dashboard", "My Dashboard"],
//     ["appointments", "Appointments"],
//     ["patients", "Patients"],
//     ["emr", "EMR / EHR"],
//     ["queue", "Queue"],
//     ["vitals", "Vitals"],
//     ["consultation", "Consultation"],
//     ["lab", "Lab / Radiology"],
//     ["radiology", "Radiology"],
//     ["pharmacy", "Pharmacy"],
//     ["billing", "Billing"],
//     ["claims", "Claims"],
//     ["checkout", "Checkout"],
//     ["followups", "Follow-ups"],
//     ["admissions", "Admissions"],
//     ["emergency", "Emergency"],
//     ["documents", "Documents"],
//     ["notifications", "Notifications"],
//     ["stock", "Stock"],
//     ["inventory", "Inventory"],
//     ["purchase", "Purchase"],
//     ["feedback", "Feedback"],
//     ["globalSearch", "Global Search"],
//     ["ipd", "IPD Patients"],
//     ["ipdPatient360", "IPD Patient 360"],
//     ["wards", "Wards / Beds"],
//     ["dailySheets", "Daily Sheets"],
//     ["dutyDoctor", "Duty Doctor"],
//     ["nursing", "IPD Nursing"],
//     ["ipdVitals", "IPD Vitals"],
//     ["mar", "MAR"],
//     ["intakeOutput", "Intake / Output"],
//     ["handover", "Handover"],
//     ["discharge", "Discharge"],
//     ["ot", "Operation Theatre"],
//     ["deathSummary", "Death Summary"],
//     ["mortuary", "Mortuary & Death Reg."],
//     ["ipdReports", "IPD Report"],
//     ["ipdAlerts", "IPD Alerts"],
//     ["records", "My Records"],
//     ["tasks", "My Tasks"],
//     ["alerts", "Alerts"],
//     ["staff", "Staff"],
//     ["staffRoster", "Duty Roster"],
//     ["doctorSchedule", "Doctor Schedule"],
//     ["incidents", "Incidents"],
//     ["accessReview", "User Access Review"],
//     ["reports", "Reports"]
//   ]
// };

// const PAGE_LABELS = {
//   dashboard: "Dashboard",
//   users: "Users & Roles",
//   accessReview: "User Access Review",
//   permissionTemplates: "Permission Templates",
//   appointments: "Appointments",
//   patients: "Patient Flow",
//   emr: "EMR / EHR",
//   queue: "Patient Flow",
//   vitals: "Vitals",
//   consultation: "Consultation",
//   lab: "Lab",
//   radiology: "Radiology",
//   pharmacy: "Pharmacy",
//   billing: "Billing",
//   checkout: "Checkout",
//   followups: "Follow-ups",
//   admissions: "Admissions",
//   masterData: "Master Data",
//   setup: "Setup",
//   doctorSchedule: "Doctor Schedule",
//   staffRoster: "Staff Roster",
//   emergency: "Emergency",
//   documents: "Documents",
//   notifications: "Notifications",
//   finance: "Finance",
//   stock: "Stock",
//   purchase: "Purchase",
//   feedback: "Feedback",
//   backup: "Backup",
//   compliance: "Compliance",
//   globalSearch: "Global Search",
//   ipd: "IPD",
//   ipdPatient360: "IPD Patient 360",
//   wards: "IPD",
//   dailySheets: "IPD",
//   dutyDoctor: "Duty Doctor",
//   nursing: "IPD Nursing",
//   ipdVitals: "IPD Vitals",
//   mar: "MAR",
//   intakeOutput: "Intake / Output",
//   handover: "Handover",
//   discharge: "Discharge",
//   ot: "Operation Theatre",
//   deathSummary: "Death Summary",
//   mortuary: "Mortuary & Death Registration",
//   ipdReports: "IPD Reports",
//   ipdAlerts: "IPD Alerts",
//   claims: "Claims",
//   reports: "Reports",
//   audit: "Audit Logs",
//   inventory: "Inventory",
//   incidents: "Incidents",
//   settings: "Settings",
//   productFlow: "Product Flow"
// };

// const MODULE_ALIASES = {
//   "my dashboard": "dashboard",
//   dashboard: "dashboard",
//   ...PAGE_KEY_ALIASES,
//   billing: "billing",
//   bills: "billing",
//   "generate bill": "billing",
//   "collect payment": "billing",
//   refunds: "billing",
//   pharmacy: "pharmacy",
//   prescriptions: "pharmacy",
//   "medicine issue": "pharmacy",
//   "add stock": "stock",
//   "stock view": "stock",
//   inventory: "inventory",
//   reports: "reports",
//   "finance reports": "finance",
//   "audit logs": "audit",
//   "users & roles": "users",
//   "user roles": "users",
//   "user access review": "accessReview",
//   "permission templates": "permissionTemplates",
//   "discharge planning": "discharge",
//   "discharge summary": "ipdReports",
//   "death summary": "deathSummary",
//   "mortality summary": "deathSummary"
// };

// const ACTION_ALIASES = {
//   "add stock": "create",
//   "generate bill": "create",
//   "issue medicine": "edit",
//   "collect payment": "edit",
//   "process refund": "refund",
//   "view audit logs": "view",
//   "export audit logs": "export",
//   "export report": "export",
//   "manage users": "manageUsers",
//   "manage settings": "manageSettings",
//   "assign task": "assignTask"
// };

// function normalizeToken(value) {
//   return String(value || "").trim();
// }

// export function normalizePageKey(page) {
//   const raw = normalizeToken(page);
//   const lowered = raw.toLowerCase();
//   const compact = compactToken(raw);
//   return PAGE_KEY_ALIASES[raw] || PAGE_KEY_ALIASES[lowered] || PAGE_KEY_ALIASES[compact] || raw;
// }

// function normalizeModule(module) {
//   const raw = normalizeToken(module);
//   const lowered = raw.toLowerCase();
//   const pageKey = normalizePageKey(raw);
//   if (pageKey !== raw) return pageKey;
//   if (MODULE_ALIASES[lowered]) return MODULE_ALIASES[lowered];
//   if (MODULE_ALIASES[compactToken(raw)]) return MODULE_ALIASES[compactToken(raw)];
//   const direct = MODULES.find((item) => item.toLowerCase() === lowered);
//   if (direct) return direct;
//   const labelMatch = Object.entries(PAGE_LABELS).find(([, label]) => label.toLowerCase() === lowered);
//   return labelMatch?.[0] || raw;
// }

// function normalizeAction(action) {
//   const raw = normalizeToken(action);
//   const lowered = raw.toLowerCase();
//   if (ACTION_ALIASES[lowered]) return ACTION_ALIASES[lowered];
//   const direct = ACTIONS.find((item) => item.toLowerCase() === lowered);
//   return direct || lowered.replace(/\s+/g, "");
// }

// function matrixAllows(user, module, action) {
//   const permissions = user?.permissions || {};
//   const keys = [module, PAGE_LABELS[module], normalizeToken(module)].filter(Boolean);
//   const entryKey = keys.find((key) => permissions[key] !== undefined);
//   if (!entryKey) return null;
//   const actions = Array.isArray(permissions[entryKey]) ? permissions[entryKey] : Object.entries(permissions[entryKey] || {}).filter(([, value]) => Boolean(value)).map(([key]) => key);
//   return actions.map(normalizeAction).includes(action);
// }

// function normalizedListIncludes(values = [], module) {
//   return (values || []).some((value) => normalizeModule(value) === module);
// }

// function branchUserPageAllowed(user, module) {
//   const subRole = normalizeSubRoleName(user);
//   if (module === "tasks") return true;
//   if (["nursing", "intakeOutput", "ipdVitals", "dutyDoctor", "handover"].includes(module)) return subRole === "Nurse";
//   if (["dutyDoctor", "ipdVitals"].includes(module)) return subRole === "Duty Doctor";
//   return false;
// }

// function branchUserSupportPermission(user, module, action) {
//   if (action !== "view") return false;
//   const subRole = normalizeSubRoleName(user);
//   const supportBySubRole = {
//     Nurse: new Set(["admissions", "ipd", "ipdPatient360", "wards", "dailySheets", "nursing", "mar", "ipdVitals", "dutyDoctor", "intakeOutput", "handover", "tasks"]),
//     "Duty Doctor": new Set(["admissions", "ipd", "ipdPatient360", "dailySheets", "dutyDoctor", "ipdVitals", "handover", "discharge", "ipdAlerts", "tasks"])
//   };
//   return supportBySubRole[subRole]?.has(module) || false;
// }

// export function can(user, module, action = "view") {
//   if (!user) return false;
//   const role = normalizeRoleName(user.role || user.roleLevel);
//   const normalizedModule = normalizeModule(module);
//   const normalizedAction = normalizeAction(action);
//   if (role === ROLES.BRANCH_USER) {
//     if (normalizeSubRoleName(user) === "Reception") {
//       const receptionModules = new Set(["dashboard", "patients", "admissions", "billing"]);
//       if (!receptionModules.has(normalizedModule)) return false;
//       if (normalizedModule === "dashboard") return normalizedAction === "view";
//       return ["view", "create", "edit", "export"].includes(normalizedAction);
//     }
//     if (normalizeSubRoleName(user) === "Reception" && normalizedModule === "patients" && normalizedAction === "delete") return true;
//     const allowedPage = normalizedListIncludes(user.allowedPages, normalizedModule) ||
//       normalizedListIncludes(user.allowedModules, normalizedModule) ||
//       (normalizedAction === "view" && branchUserPageAllowed(user, normalizedModule)) ||
//       branchUserSupportPermission(user, normalizedModule, normalizedAction);
//     if (!allowedPage) return false;
//     if (normalizedAction === "view") return true;
//     const matrixDecision = matrixAllows(user, normalizedModule, normalizedAction);
//     if (matrixDecision !== null) return matrixDecision;
//     return ["create", "edit", "export", "assignTask", "escalate"].includes(normalizedAction);
//   }
//   const rolePermissions = ROLE_PERMISSIONS[role] || {};
//   const modulePermissions = rolePermissions[normalizedModule] || {};
//   if (modulePermissions[normalizedAction]) return true;
//   return false;
// }

// export function hasPermission(user, module, action = "view") {
//   return can(user, module, action);
// }

// export function canAccessPage(user, page) {
//   const normalizedPage = normalizePageKey(page);
//   if (!user) return normalizedPage === "login";
//   if (page === "profile") return true;
//   const role = normalizeRoleName(user.role || user.roleLevel);
//   if (normalizedPage === "ipdPatient360") return hasPermission(user, "ipd", "view");
//   if (normalizedPage === "hospitals" && role !== ROLES.SUPER_ADMIN) return false;
//   if (normalizedPage === "branches" && ![ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN].includes(role)) return false;
//   return hasPermission(user, normalizedPage, "view");
// }

// export function scopeDescription(user) {
//   if (!user) return "Signed out";
//   if (user.role === ROLES.SUPER_ADMIN) return "Platform-wide access";
//   if (user.role === ROLES.HOSPITAL_ADMIN) return "Hospital group access";
//   if (user.role === ROLES.BRANCH_ADMIN) return "Assigned branch access";
//   return "Assigned module access";
// }

// export function canSeeRecord(user, record) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   if (user.role === ROLES.HOSPITAL_ADMIN) return record.hospitalId === user.hospitalId;
//   if (user.role === ROLES.BRANCH_ADMIN) return record.hospitalId === user.hospitalId && record.branchId === user.branchId;
//   return record.hospitalId === user.hospitalId && record.branchId === user.branchId && user.allowedModules.includes(record.type);
// }

// export function canSeeWorkflowItem(user, item, module) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   if (user.role === ROLES.HOSPITAL_ADMIN) return item.hospitalId === user.hospitalId;
//   if (user.role === ROLES.BRANCH_ADMIN) return item.hospitalId === user.hospitalId && item.branchId === user.branchId;
//   return item.hospitalId === user.hospitalId && item.branchId === user.branchId && hasPermission(user, module, "view");
// }

// export function canSeeHospital(user, hospitalId) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   return user.hospitalId === hospitalId;
// }

// export function canSeeBranch(user, branchId, branch) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   if (!branch) return false;
//   if (user.role === ROLES.HOSPITAL_ADMIN) return branch.hospitalId === user.hospitalId;
//   return user.branchId === branchId || user.allowedBranchIds?.includes(branchId);
// }

// export const ROLES = {
//   SUPER_ADMIN: "SUPER_ADMIN",
//   HOSPITAL_ADMIN: "HOSPITAL_ADMIN",
//   BRANCH_ADMIN: "BRANCH_ADMIN",
//   BRANCH_USER: "BRANCH_USER",
//   PATIENT: "PATIENT"
// };

// const ROLE_ALIASES = {
//   superadmin: ROLES.SUPER_ADMIN,
//   super_admin: ROLES.SUPER_ADMIN,
//   "super admin": ROLES.SUPER_ADMIN,
//   hospitaladmin: ROLES.HOSPITAL_ADMIN,
//   hospital_admin: ROLES.HOSPITAL_ADMIN,
//   "hospital admin": ROLES.HOSPITAL_ADMIN,
//   branchadmin: ROLES.BRANCH_ADMIN,
//   branch_admin: ROLES.BRANCH_ADMIN,
//   "branch admin": ROLES.BRANCH_ADMIN,
//   branchuser: ROLES.BRANCH_USER,
//   branch_user: ROLES.BRANCH_USER,
//   "branch user": ROLES.BRANCH_USER,
//   nurse: "Nurse",
//   dutydoctor: "Duty Doctor",
//   duty_doctor: "Duty Doctor",
//   "duty doctor": "Duty Doctor",
//   labuser: "Lab User",
//   lab_user: "Lab User",
//   "lab user": "Lab User",
//   reception: "Reception",
//   "reception user": "Reception",
//   receptionist: "Reception",
//   doctor: "Doctor"
// };

// function compactToken(value) {
//   return String(value || "").trim().toLowerCase().replace(/[-_\s/]+/g, "");
// }

// export function normalizeRoleName(value) {
//   const raw = String(value || "").trim();
//   return ROLE_ALIASES[raw.toLowerCase()] || ROLE_ALIASES[compactToken(raw)] || raw;
// }

// export function normalizeSubRoleName(user = {}) {
//   return normalizeRoleName(user.subRole || user.jobRole || user.roleName || user.roleTitle || "");
// }

// export const ACTIONS = [
//   "view",
//   "create",
//   "edit",
//   "delete",
//   "approve",
//   "export",
//   "assignTask",
//   "escalate",
//   "refund",
//   "manageUsers",
//   "manageSettings"
// ];

// export const MODULES = [
//   "dashboard",
//   "hospitals",
//   "branches",
//   "users",
//   "accessReview",
//   "permissionTemplates",
//   "roles",
//   "appointments",
//   "patients",
//   "emr",
//   "queue",
//   "vitals",
//   "consultation",
//   "lab",
//   "radiology",
//   "pharmacy",
//   "billing",
//   "checkout",
//   "followups",
//   "admissions",
//   "masterData",
//   "setup",
//   "doctorSchedule",
//   "staffRoster",
//   "emergency",
//   "documents",
//   "notifications",
//   "finance",
//   "stock",
//   "stockLogic",
//   "purchase",
//   "feedback",
//   "backup",
//   "compliance",
//   "globalSearch",
//   "ipd",
//   "wards",
//   "dailySheets",
//   "dutyDoctor",
//   "nursing",
//   "ipdVitals",
//   "mar",
//   "intakeOutput",
//   "handover",
//   "discharge",
//   "ot",
//   "deathSummary",
//   "mortuary",
//   "ipdReports",
//   "ipdAlerts",
//   "claims",
//   "uploads",
//   "mapping",
//   "records",
//   "alerts",
//   "tasks",
//   "reports",
//   "audit",
//   "settings",
//   "productFlow",
//   "subscriptions",
//   "modules",
//   "inventory",
//   "incidents",
//   "beds",
//   "staff"
// ];

// const allActions = Object.fromEntries(ACTIONS.map((action) => [action, true]));
// const readExport = { view: true, export: true };
// const readWrite = { view: true, create: true, edit: true };
// const opsActions = { view: true, create: true, edit: true, delete: true, export: true, assignTask: true, escalate: true };
// const clinicalActions = { view: true, create: true, edit: true, delete: true, export: true, assignTask: true };

// export const ROLE_PERMISSIONS = {
//   [ROLES.SUPER_ADMIN]: {
//     dashboard: allActions,
//     hospitals: allActions,
//     branches: { view: true },
//     users: allActions,
//     subscriptions: allActions,
//     offers: allActions,
//     modules: allActions,
//     reports: readExport,
//     audit: readExport,
//     settings: allActions,
//     productFlow: { view: true },
//     backup: allActions,
//     compliance: readExport,
//     notifications: readWrite,
//     globalSearch: { view: true },
//     alerts: { view: true, assignTask: true, escalate: true },
//     tasks: opsActions
//   },
//   [ROLES.HOSPITAL_ADMIN]: {
//     dashboard: readExport,
//     hospitals: { view: true },
//     branches: allActions,
//     users: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     accessReview: { view: true, edit: true, export: true, manageUsers: true },
//     permissionTemplates: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     reports: readExport,
//     audit: readExport,
//     settings: { view: true, edit: true, manageSettings: true },
//     productFlow: { view: true },
//     masterData: allActions,
//     setup: allActions,
//     doctorSchedule: allActions,
//     staffRoster: allActions,
//     documents: readExport,
//     notifications: readWrite,
//     finance: readExport,
//     stock: readExport,
//     purchase: readExport,
//     feedback: readExport,
//     compliance: readExport,
//     globalSearch: { view: true },
//     alerts: opsActions,
//     tasks: opsActions,
//     appointments: readExport,
//     patients: readExport,
//     emr: readExport,
//     queue: readExport,
//     vitals: readExport,
//     consultation: readExport,
//     lab: readExport,
//     radiology: readExport,
//     pharmacy: readExport,
//     billing: readExport,
//     checkout: readExport,
//     followups: readExport,
//     admissions: readExport,
//     ipd: readExport,
//     wards: readExport,
//     dailySheets: readExport,
//     dutyDoctor: readExport,
//     nursing: readExport,
//     ipdVitals: readExport,
//     mar: readExport,
//     intakeOutput: readExport,
//     handover: readExport,
//     discharge: readExport,
//     ot: readExport,
//     deathSummary: readExport,
//     mortuary: readExport,
//     ipdReports: readExport,
//     ipdAlerts: readExport,
//     claims: readExport,
//     records: readExport,
//     staff: readExport,
//     beds: readExport,
//     inventory: readExport,
//     incidents: readExport
//   },
//   [ROLES.BRANCH_ADMIN]: {
//     dashboard: readExport,
//     hospitals: { view: true },
//     branches: { view: true },
//     users: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     accessReview: { view: true, edit: true, export: true, manageUsers: true },
//     permissionTemplates: { view: true, create: true, edit: true, delete: true, manageUsers: true },
//     roles: allActions,
//     uploads: { view: true, create: true, edit: true },
//     mapping: { view: true, create: true, edit: true },
//     records: opsActions,
//     alerts: opsActions,
//     tasks: opsActions,
//     appointments: clinicalActions,
//     patients: clinicalActions,
//     emr: readExport,
//     queue: clinicalActions,
//     vitals: clinicalActions,
//     consultation: clinicalActions,
//     lab: clinicalActions,
//     radiology: clinicalActions,
//     pharmacy: clinicalActions,
//     billing: clinicalActions,
//     checkout: clinicalActions,
//     followups: clinicalActions,
//     admissions: clinicalActions,
//     ipd: clinicalActions,
//     wards: clinicalActions,
//     dailySheets: clinicalActions,
//     dutyDoctor: clinicalActions,
//     nursing: clinicalActions,
//     ipdVitals: clinicalActions,
//     mar: clinicalActions,
//     intakeOutput: clinicalActions,
//     handover: clinicalActions,
//     discharge: clinicalActions,
//     ot: { ...clinicalActions, approve: true },
//     deathSummary: { ...clinicalActions, approve: true },
//     mortuary: { ...clinicalActions, approve: true },
//     ipdReports: readExport,
//     ipdAlerts: clinicalActions,
//     claims: clinicalActions,
//     reports: readExport,
//     audit: readExport,
//     settings: { view: true, edit: true, manageSettings: true },
//     productFlow: { view: true },
//     masterData: allActions,
//     setup: allActions,
//     doctorSchedule: allActions,
//     staffRoster: allActions,
//     emergency: clinicalActions,
//     documents: clinicalActions,
//     notifications: readWrite,
//     finance: readExport,
//     stock: allActions,
//     purchase: allActions,
//     feedback: opsActions,
//     compliance: readExport,
//     globalSearch: { view: true },
//     staff: allActions,
//     beds: allActions,
//     inventory: allActions,
//     incidents: opsActions
//   },
//   [ROLES.BRANCH_USER]: {
//     dashboard: { view: true },
//     records: readWrite,
//     alerts: { view: true },
//     tasks: { view: true, edit: true },
//     reports: readExport
//   },
//   [ROLES.PATIENT]: {
//     appointments: { view: true, create: true }
//   }
// };

// export const PAGE_KEY_ALIASES = {
//   registerPatient: "patients",
//   "reception-register-patient": "patients",
//   patientRecords: "patients",
//   "reception-patient-records": "patients",
//   admitPatient: "admissions",
//   "reception-admit-patient": "admissions",
//   admissionRecords: "admissions",
//   "reception-admission-records": "admissions",
//   createInvoice: "billing",
//   payments: "billing",
//   receipts: "billing",
//   stocklogic: "stock",
//   "stock-logic": "stock",
//   "stock logic": "stock",
//   stockLogic: "stock",
//   ipdvitals: "ipdVitals",
//   "ipd-vitals": "ipdVitals",
//   "ipd vitals": "ipdVitals",
//   dutydoctor: "dutyDoctor",
//   "duty-doctor": "dutyDoctor",
//   "duty doctor": "dutyDoctor",
//   ipdnursing: "nursing",
//   "ipd-nursing": "nursing",
//   "ipd nursing": "nursing",
//   nursingnotes: "nursing",
//   intakeoutput: "intakeOutput",
//   "intake-output": "intakeOutput",
//   "intake output": "intakeOutput",
//   dailyipdreport: "ipdReports",
//   "daily-ipd-report": "ipdReports",
//   "daily ipd report": "ipdReports",
//   ipdoverview: "ipd",
//   "ipd-overview": "ipd",
//   "ipd overview": "ipd",
//   mytasks: "tasks",
//   "my-tasks": "tasks",
//   "my tasks": "tasks",
//   ipdpatient360: "ipdPatient360",
//   "ipd-patient-360": "ipdPatient360",
//   "ipd patient 360": "ipdPatient360",
//   ot: "ot",
//   operationtheatre: "ot",
//   "operation-theatre": "ot",
//   "operation theatre": "ot",
//   "operation theater": "ot",
//   "ot management": "ot",
//   surgery: "ot",
//   mortuary: "mortuary",
//   "death registration": "mortuary",
//   "death register": "mortuary",
//   "mortuary management": "mortuary",
//   morgue: "mortuary",
//   "mortuary-register-death": "mortuary",
//   "mortuary-storage": "mortuary",
//   "mortuary-certificates": "mortuary",
//   "mortuary-release": "mortuary",
//   "mortuary-register": "mortuary",
//   "mortuary-search": "mortuary",
//   emr: "emr",
//   ehr: "emr",
//   "medical record": "emr",
//   "patient record": "emr",
//   "health record": "emr"
// };

// export const NAV_BY_ROLE = {
//   [ROLES.SUPER_ADMIN]: [
//     ["dashboard", "Dashboard"],
//     ["hospitals", "Hospital Customers"],
//     ["users", "Admin Users"],
//     ["subscriptions", "Subscriptions"],
//     ["offers", "Offers & Coupons"],
//     ["modules", "Modules"],
//     ["reports", "Usage Analytics"],
//     ["backup", "System Backup"],
//     ["compliance", "Compliance"],
//     ["audit", "Audit Logs"],
//     ["settings", "System Settings"],
//     ["productFlow", "Product Flow"]
//   ],
//   [ROLES.HOSPITAL_ADMIN]: [
//     ["dashboard", "Dashboard"],
//     ["branches", "Hospital Branches"],
//     ["users", "Branch Admins"],
//     ["records", "Operations Overview"],
//     ["appointments", "Appointments"],
//     ["patients", "Patients"],
//     ["emr", "EMR / EHR"],
//     ["queue", "Patient Flow"],
//     ["ipd", "IPD Overview"],
//     ["ipdPatient360", "IPD Patient 360"],
//     ["ot", "Operation Theatre"],
//     ["mortuary", "Mortuary & Death Reg."],
//     ["ipdReports", "Daily IPD Report"],
//     ["billing", "Billing"],
//     ["stock", "Stock Logic"],
//     ["claims", "Claims"],
//     ["setup", "Setup Wizard"],
//     ["masterData", "Master Data"],
//     ["doctorSchedule", "Doctor Schedule"],
//     ["staffRoster", "Duty Roster"],
//     ["finance", "Finance"],
//     ["documents", "Documents"],
//     ["notifications", "Notifications"],
//     ["feedback", "Feedback"],
//     ["compliance", "Compliance"],
//     ["globalSearch", "Global Search"],
//     ["alerts", "Alerts"],
//     ["reports", "Reports"],
//     ["accessReview", "User Access Review"],
//     ["permissionTemplates", "Permission Templates"],
//     ["audit", "Audit Trail"],
//     ["settings", "Settings"],
//     ["productFlow", "Product Flow"]
//   ],
//   [ROLES.BRANCH_ADMIN]: [
//     ["dashboard", "Dashboard"],
//     ["appointments", "Appointments"],
//     ["patients", "Patients"],
//     ["emr", "EMR / EHR"],
//     ["queue", "Queue"],
//     ["vitals", "Vitals"],
//     ["consultation", "Doctor Consultation"],
//     ["lab", "Lab (LIS)"],
//     ["radiology", "Radiology (RIS)"],
//     ["pharmacy", "Pharmacy"],
//     ["billing", "Billing"],
//     ["checkout", "Checkout"],
//     ["followups", "Follow-ups"],
//     ["admissions", "Admissions"],
//     ["setup", "Setup Wizard"],
//     ["masterData", "Master Data"],
//     ["doctorSchedule", "Doctor Schedule"],
//     ["staffRoster", "Duty Roster"],
//     ["emergency", "Emergency"],
//     ["documents", "Documents"],
//     ["notifications", "Notifications"],
//     ["finance", "Finance"],
//     ["stock", "Stock Logic"],
//     ["purchase", "Purchase"],
//     ["feedback", "Feedback"],
//     ["compliance", "Compliance"],
//     ["globalSearch", "Global Search"],
//     ["ipd", "IPD Patients"],
//     ["ipdPatient360", "IPD Patient 360"],
//     ["wards", "Wards / Beds"],
//     ["dailySheets", "Daily Sheets"],
//     ["dutyDoctor", "Duty Doctor"],
//     ["nursing", "IPD Nursing"],
//     ["ipdVitals", "IPD Vitals"],
//     ["mar", "MAR"],
//     ["intakeOutput", "Intake / Output"],
//     ["handover", "Handover"],
//     ["discharge", "Discharge"],
//     ["ot", "Operation Theatre"],
//     ["deathSummary", "Death Summary"],
//     ["mortuary", "Mortuary & Death Reg."],
//     ["ipdReports", "Daily IPD Report"],
//     ["ipdAlerts", "IPD Alerts"],
//     ["uploads", "Upload Records"],
//     ["mapping", "Data Mapping"],
//     ["records", "Records"],
//     ["alerts", "Alerts"],
//     ["tasks", "Tasks"],
//     ["staff", "Staff"],
//     ["beds", "Beds / Rooms"],
//     ["inventory", "Inventory"],
//     ["incidents", "Incidents"],
//     ["reports", "Reports"],
//     ["accessReview", "User Access Review"],
//     ["permissionTemplates", "Permission Templates"],
//     ["users", "Staff Users"],
//     ["audit", "Audit Trail"],
//     ["settings", "Settings"],
//     ["productFlow", "Product Flow"]
//   ],
//   [ROLES.BRANCH_USER]: [
//     ["dashboard", "My Dashboard"],
//     ["appointments", "Appointments"],
//     ["patients", "Patients"],
//     ["emr", "EMR / EHR"],
//     ["queue", "Queue"],
//     ["vitals", "Vitals"],
//     ["consultation", "Consultation"],
//     ["lab", "Lab / Radiology"],
//     ["radiology", "Radiology"],
//     ["pharmacy", "Pharmacy"],
//     ["billing", "Billing"],
//     ["claims", "Claims"],
//     ["checkout", "Checkout"],
//     ["followups", "Follow-ups"],
//     ["admissions", "Admissions"],
//     ["emergency", "Emergency"],
//     ["documents", "Documents"],
//     ["notifications", "Notifications"],
//     ["stock", "Stock"],
//     ["inventory", "Inventory"],
//     ["purchase", "Purchase"],
//     ["feedback", "Feedback"],
//     ["globalSearch", "Global Search"],
//     ["ipd", "IPD Patients"],
//     ["ipdPatient360", "IPD Patient 360"],
//     ["wards", "Wards / Beds"],
//     ["dailySheets", "Daily Sheets"],
//     ["dutyDoctor", "Duty Doctor"],
//     ["nursing", "IPD Nursing"],
//     ["ipdVitals", "IPD Vitals"],
//     ["mar", "MAR"],
//     ["intakeOutput", "Intake / Output"],
//     ["handover", "Handover"],
//     ["discharge", "Discharge"],
//     ["ot", "Operation Theatre"],
//     ["deathSummary", "Death Summary"],
//     ["mortuary", "Mortuary & Death Reg."],
//     ["ipdReports", "IPD Report"],
//     ["ipdAlerts", "IPD Alerts"],
//     ["records", "My Records"],
//     ["tasks", "My Tasks"],
//     ["alerts", "Alerts"],
//     ["staff", "Staff"],
//     ["staffRoster", "Duty Roster"],
//     ["doctorSchedule", "Doctor Schedule"],
//     ["incidents", "Incidents"],
//     ["accessReview", "User Access Review"],
//     ["reports", "Reports"]
//   ]
// };

// const PAGE_LABELS = {
//   dashboard: "Dashboard",
//   users: "Users & Roles",
//   accessReview: "User Access Review",
//   permissionTemplates: "Permission Templates",
//   appointments: "Appointments",
//   patients: "Patient Flow",
//   emr: "EMR / EHR",
//   queue: "Patient Flow",
//   vitals: "Vitals",
//   consultation: "Consultation",
//   lab: "Lab",
//   radiology: "Radiology",
//   pharmacy: "Pharmacy",
//   billing: "Billing",
//   checkout: "Checkout",
//   followups: "Follow-ups",
//   admissions: "Admissions",
//   masterData: "Master Data",
//   setup: "Setup",
//   doctorSchedule: "Doctor Schedule",
//   staffRoster: "Staff Roster",
//   emergency: "Emergency",
//   documents: "Documents",
//   notifications: "Notifications",
//   finance: "Finance",
//   stock: "Stock",
//   purchase: "Purchase",
//   feedback: "Feedback",
//   backup: "Backup",
//   compliance: "Compliance",
//   globalSearch: "Global Search",
//   ipd: "IPD",
//   ipdPatient360: "IPD Patient 360",
//   wards: "IPD",
//   dailySheets: "IPD",
//   dutyDoctor: "Duty Doctor",
//   nursing: "IPD Nursing",
//   ipdVitals: "IPD Vitals",
//   mar: "MAR",
//   intakeOutput: "Intake / Output",
//   handover: "Handover",
//   discharge: "Discharge",
//   ot: "Operation Theatre",
//   deathSummary: "Death Summary",
//   mortuary: "Mortuary & Death Registration",
//   ipdReports: "IPD Reports",
//   ipdAlerts: "IPD Alerts",
//   claims: "Claims",
//   reports: "Reports",
//   audit: "Audit Logs",
//   inventory: "Inventory",
//   incidents: "Incidents",
//   settings: "Settings",
//   productFlow: "Product Flow"
// };

// const MODULE_ALIASES = {
//   "my dashboard": "dashboard",
//   dashboard: "dashboard",
//   ...PAGE_KEY_ALIASES,
//   billing: "billing",
//   bills: "billing",
//   "generate bill": "billing",
//   "collect payment": "billing",
//   refunds: "billing",
//   pharmacy: "pharmacy",
//   prescriptions: "pharmacy",
//   "medicine issue": "pharmacy",
//   "add stock": "stock",
//   "stock view": "stock",
//   inventory: "inventory",
//   reports: "reports",
//   "finance reports": "finance",
//   "audit logs": "audit",
//   "users & roles": "users",
//   "user roles": "users",
//   "user access review": "accessReview",
//   "permission templates": "permissionTemplates",
//   "discharge planning": "discharge",
//   "discharge summary": "ipdReports",
//   "death summary": "deathSummary",
//   "mortality summary": "deathSummary"
// };

// const ACTION_ALIASES = {
//   "add stock": "create",
//   "generate bill": "create",
//   "issue medicine": "edit",
//   "collect payment": "edit",
//   "process refund": "refund",
//   "view audit logs": "view",
//   "export audit logs": "export",
//   "export report": "export",
//   "manage users": "manageUsers",
//   "manage settings": "manageSettings",
//   "assign task": "assignTask"
// };

// function normalizeToken(value) {
//   return String(value || "").trim();
// }

// export function normalizePageKey(page) {
//   const raw = normalizeToken(page);
//   const lowered = raw.toLowerCase();
//   const compact = compactToken(raw);
//   return PAGE_KEY_ALIASES[raw] || PAGE_KEY_ALIASES[lowered] || PAGE_KEY_ALIASES[compact] || raw;
// }

// function normalizeModule(module) {
//   const raw = normalizeToken(module);
//   const lowered = raw.toLowerCase();
//   const pageKey = normalizePageKey(raw);
//   if (pageKey !== raw) return pageKey;
//   if (MODULE_ALIASES[lowered]) return MODULE_ALIASES[lowered];
//   if (MODULE_ALIASES[compactToken(raw)]) return MODULE_ALIASES[compactToken(raw)];
//   const direct = MODULES.find((item) => item.toLowerCase() === lowered);
//   if (direct) return direct;
//   const labelMatch = Object.entries(PAGE_LABELS).find(([, label]) => label.toLowerCase() === lowered);
//   return labelMatch?.[0] || raw;
// }

// function normalizeAction(action) {
//   const raw = normalizeToken(action);
//   const lowered = raw.toLowerCase();
//   if (ACTION_ALIASES[lowered]) return ACTION_ALIASES[lowered];
//   const direct = ACTIONS.find((item) => item.toLowerCase() === lowered);
//   return direct || lowered.replace(/\s+/g, "");
// }

// function matrixAllows(user, module, action) {
//   const permissions = user?.permissions || {};
//   const keys = [module, PAGE_LABELS[module], normalizeToken(module)].filter(Boolean);
//   const entryKey = keys.find((key) => permissions[key] !== undefined);
//   if (!entryKey) return null;
//   const actions = Array.isArray(permissions[entryKey]) ? permissions[entryKey] : Object.entries(permissions[entryKey] || {}).filter(([, value]) => Boolean(value)).map(([key]) => key);
//   return actions.map(normalizeAction).includes(action);
// }

// function normalizedListIncludes(values = [], module) {
//   return (values || []).some((value) => normalizeModule(value) === module);
// }

// function branchUserPageAllowed(user, module) {
//   const subRole = normalizeSubRoleName(user);
//   if (module === "tasks") return true;
//   if (["nursing", "intakeOutput", "ipdVitals", "dutyDoctor", "handover"].includes(module)) return subRole === "Nurse";
//   if (["dutyDoctor", "ipdVitals"].includes(module)) return subRole === "Duty Doctor";
//   return false;
// }

// function branchUserSupportPermission(user, module, action) {
//   if (action !== "view") return false;
//   const subRole = normalizeSubRoleName(user);
//   const supportBySubRole = {
//     Nurse: new Set(["admissions", "ipd", "ipdPatient360", "wards", "dailySheets", "nursing", "mar", "ipdVitals", "dutyDoctor", "intakeOutput", "handover", "tasks"]),
//     "Duty Doctor": new Set(["admissions", "ipd", "ipdPatient360", "dailySheets", "dutyDoctor", "ipdVitals", "handover", "discharge", "ipdAlerts", "tasks"])
//   };
//   return supportBySubRole[subRole]?.has(module) || false;
// }

// export function can(user, module, action = "view") {
//   if (!user) return false;
//   const role = normalizeRoleName(user.role || user.roleLevel);
//   const normalizedModule = normalizeModule(module);
//   const normalizedAction = normalizeAction(action);
//   if (role === ROLES.BRANCH_USER) {
//     if (normalizeSubRoleName(user) === "Reception") {
//       const receptionModules = new Set(["dashboard", "patients", "admissions", "billing"]);
//       if (!receptionModules.has(normalizedModule)) return false;
//       if (normalizedModule === "dashboard") return normalizedAction === "view";
//       return ["view", "create", "edit", "export"].includes(normalizedAction);
//     }
//     if (normalizeSubRoleName(user) === "Reception" && normalizedModule === "patients" && normalizedAction === "delete") return true;
//     const allowedPage = normalizedListIncludes(user.allowedPages, normalizedModule) ||
//       normalizedListIncludes(user.allowedModules, normalizedModule) ||
//       (normalizedAction === "view" && branchUserPageAllowed(user, normalizedModule)) ||
//       branchUserSupportPermission(user, normalizedModule, normalizedAction);
//     if (!allowedPage) return false;
//     if (normalizedAction === "view") return true;
//     const matrixDecision = matrixAllows(user, normalizedModule, normalizedAction);
//     if (matrixDecision !== null) return matrixDecision;
//     return ["create", "edit", "export", "assignTask", "escalate"].includes(normalizedAction);
//   }
//   const rolePermissions = ROLE_PERMISSIONS[role] || {};
//   const modulePermissions = rolePermissions[normalizedModule] || {};
//   if (modulePermissions[normalizedAction]) return true;
//   return false;
// }

// export function hasPermission(user, module, action = "view") {
//   return can(user, module, action);
// }

// export function canAccessPage(user, page) {
//   const normalizedPage = normalizePageKey(page);
//   if (!user) return normalizedPage === "login";
//   if (page === "profile") return true;
//   const role = normalizeRoleName(user.role || user.roleLevel);
//   if (normalizedPage === "ipdPatient360") return hasPermission(user, "ipd", "view");
//   if (normalizedPage === "hospitals" && role !== ROLES.SUPER_ADMIN) return false;
//   if (normalizedPage === "branches" && ![ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN].includes(role)) return false;
//   return hasPermission(user, normalizedPage, "view");
// }

// export function scopeDescription(user) {
//   if (!user) return "Signed out";
//   if (user.role === ROLES.SUPER_ADMIN) return "Platform-wide access";
//   if (user.role === ROLES.HOSPITAL_ADMIN) return "Hospital group access";
//   if (user.role === ROLES.BRANCH_ADMIN) return "Assigned branch access";
//   return "Assigned module access";
// }

// export function canSeeRecord(user, record) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   if (user.role === ROLES.HOSPITAL_ADMIN) return record.hospitalId === user.hospitalId;
//   if (user.role === ROLES.BRANCH_ADMIN) return record.hospitalId === user.hospitalId && record.branchId === user.branchId;
//   return record.hospitalId === user.hospitalId && record.branchId === user.branchId && user.allowedModules.includes(record.type);
// }

// export function canSeeWorkflowItem(user, item, module) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   if (user.role === ROLES.HOSPITAL_ADMIN) return item.hospitalId === user.hospitalId;
//   if (user.role === ROLES.BRANCH_ADMIN) return item.hospitalId === user.hospitalId && item.branchId === user.branchId;
//   return item.hospitalId === user.hospitalId && item.branchId === user.branchId && hasPermission(user, module, "view");
// }

// export function canSeeHospital(user, hospitalId) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   return user.hospitalId === hospitalId;
// }

// export function canSeeBranch(user, branchId, branch) {
//   if (user.role === ROLES.SUPER_ADMIN) return true;
//   if (!branch) return false;
//   if (user.role === ROLES.HOSPITAL_ADMIN) return branch.hospitalId === user.hospitalId;
//   return user.branchId === branchId || user.allowedBranchIds?.includes(branchId);
// }

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HOSPITAL_ADMIN: "HOSPITAL_ADMIN",
  BRANCH_ADMIN: "BRANCH_ADMIN",
  BRANCH_USER: "BRANCH_USER",
  PATIENT: "PATIENT"
};

const ROLE_ALIASES = {
  superadmin: ROLES.SUPER_ADMIN,
  super_admin: ROLES.SUPER_ADMIN,
  "super admin": ROLES.SUPER_ADMIN,
  hospitaladmin: ROLES.HOSPITAL_ADMIN,
  hospital_admin: ROLES.HOSPITAL_ADMIN,
  "hospital admin": ROLES.HOSPITAL_ADMIN,
  branchadmin: ROLES.BRANCH_ADMIN,
  branch_admin: ROLES.BRANCH_ADMIN,
  "branch admin": ROLES.BRANCH_ADMIN,
  branchuser: ROLES.BRANCH_USER,
  branch_user: ROLES.BRANCH_USER,
  "branch user": ROLES.BRANCH_USER,
  nurse: "Nurse",
  dutydoctor: "Duty Doctor",
  duty_doctor: "Duty Doctor",
  "duty doctor": "Duty Doctor",
  labuser: "Lab User",
  lab_user: "Lab User",
  "lab user": "Lab User",
  reception: "Reception",
  "reception user": "Reception",
  receptionist: "Reception",
  doctor: "Doctor"
};

function compactToken(value) {
  return String(value || "").trim().toLowerCase().replace(/[-_\s/]+/g, "");
}

export function normalizeRoleName(value) {
  const raw = String(value || "").trim();
  return ROLE_ALIASES[raw.toLowerCase()] || ROLE_ALIASES[compactToken(raw)] || raw;
}

export function normalizeSubRoleName(user = {}) {
  return normalizeRoleName(user.subRole || user.jobRole || user.roleName || user.roleTitle || "");
}

export const ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "export",
  "assignTask",
  "escalate",
  "refund",
  "manageUsers",
  "manageSettings"
];

export const MODULES = [
  "dashboard",
  "hospitals",
  "branches",
  "users",
  "accessReview",
  "permissionTemplates",
  "roles",
  "appointments",
  "patients",
  "emr",
  "queue",
  "vitals",
  "consultation",
  "lab",
  "radiology",
  "pharmacy",
  "billing",
  "checkout",
  "followups",
  "admissions",
  "masterData",
  "setup",
  "doctorSchedule",
  "staffRoster",
  "emergency",
  "documents",
  "notifications",
  "finance",
  "stock",
  "stockLogic",
  "purchase",
  "feedback",
  "backup",
  "compliance",
  "globalSearch",
  "ipd",
  "wards",
  "dailySheets",
  "dutyDoctor",
  "nursing",
  "ipdVitals",
  "mar",
  "intakeOutput",
  "handover",
  "discharge",
  "ot",
  "deathSummary",
  "mortuary",
  "ipdReports",
  "ipdAlerts",
  "claims",
  "uploads",
  "mapping",
  "records",
  "alerts",
  "tasks",
  "reports",
  "audit",
  "settings",
  "productFlow",
  "subscriptions",
  "modules",
  "inventory",
  "incidents",
  "beds",
  "staff"
];

const allActions = Object.fromEntries(ACTIONS.map((action) => [action, true]));
const readExport = { view: true, export: true };
const readWrite = { view: true, create: true, edit: true };
const opsActions = { view: true, create: true, edit: true, delete: true, export: true, assignTask: true, escalate: true };
const clinicalActions = { view: true, create: true, edit: true, delete: true, export: true, assignTask: true };

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    dashboard: allActions,
    hospitals: allActions,
    branches: { view: true },
    users: allActions,
    subscriptions: allActions,
    offers: allActions,
    modules: allActions,
    reports: readExport,
    audit: readExport,
    settings: allActions,
    productFlow: { view: true },
    backup: allActions,
    compliance: readExport,
    notifications: readWrite,
    globalSearch: { view: true },
    alerts: { view: true, assignTask: true, escalate: true },
    tasks: opsActions
  },
  [ROLES.HOSPITAL_ADMIN]: {
    dashboard: readExport,
    hospitals: { view: true, create: true, edit: true },
    branches: allActions,
    users: { view: true, create: true, edit: true, delete: true, manageUsers: true },
    accessReview: { view: true, edit: true, export: true, manageUsers: true },
    permissionTemplates: { view: true, create: true, edit: true, delete: true, manageUsers: true },
    reports: readExport,
    audit: readExport,
    settings: { view: true, edit: true, manageSettings: true },
    productFlow: { view: true },
    masterData: allActions,
    setup: allActions,
    doctorSchedule: allActions,
    staffRoster: allActions,
    documents: readExport,
    notifications: readWrite,
    finance: readExport,
    stock: readExport,
    purchase: readExport,
    feedback: readExport,
    compliance: readExport,
    globalSearch: { view: true },
    alerts: opsActions,
    tasks: opsActions,
    appointments: readExport,
    patients: readExport,
    billing: readExport,
    checkout: readExport,
    followups: readExport,
    admissions: readExport,
    ipd: readExport,
    wards: readExport,
    discharge: readExport,
    mortuary: readExport,
    claims: readExport,
    records: readExport,
    staff: readExport,
    beds: readExport,
    inventory: readExport,
    incidents: readExport
  },
  [ROLES.BRANCH_ADMIN]: {
    dashboard: readExport,
    hospitals: { view: true },
    branches: { view: true },
    users: { view: true, create: true, edit: true, delete: true, manageUsers: true },
    accessReview: { view: true, edit: true, export: true, manageUsers: true },
    permissionTemplates: { view: true, create: true, edit: true, delete: true, manageUsers: true },
    roles: allActions,
    uploads: { view: true, create: true, edit: true },
    mapping: { view: true, create: true, edit: true },
    records: opsActions,
    alerts: opsActions,
    tasks: opsActions,
    appointments: clinicalActions,
    patients: clinicalActions,
    emr: readExport,
    queue: clinicalActions,
    vitals: clinicalActions,
    consultation: clinicalActions,
    lab: clinicalActions,
    radiology: clinicalActions,
    pharmacy: clinicalActions,
    billing: clinicalActions,
    checkout: clinicalActions,
    followups: clinicalActions,
    admissions: clinicalActions,
    ipd: clinicalActions,
    wards: clinicalActions,
    dailySheets: clinicalActions,
    dutyDoctor: clinicalActions,
    nursing: clinicalActions,
    ipdVitals: clinicalActions,
    mar: clinicalActions,
    intakeOutput: clinicalActions,
    handover: clinicalActions,
    discharge: clinicalActions,
    ot: { ...clinicalActions, approve: true },
    deathSummary: { ...clinicalActions, approve: true },
    mortuary: { ...clinicalActions, approve: true },
    ipdReports: readExport,
    ipdAlerts: clinicalActions,
    claims: clinicalActions,
    reports: readExport,
    audit: readExport,
    settings: { view: true, edit: true, manageSettings: true },
    productFlow: { view: true },
    masterData: allActions,
    setup: allActions,
    doctorSchedule: allActions,
    staffRoster: allActions,
    emergency: clinicalActions,
    documents: clinicalActions,
    notifications: readWrite,
    finance: readExport,
    stock: allActions,
    purchase: allActions,
    feedback: opsActions,
    compliance: readExport,
    globalSearch: { view: true },
    staff: allActions,
    beds: allActions,
    inventory: allActions,
    incidents: opsActions
  },
  [ROLES.BRANCH_USER]: {
    dashboard: { view: true },
    records: readWrite,
    alerts: { view: true },
    tasks: { view: true, edit: true },
    reports: readExport
  },
  [ROLES.PATIENT]: {
    appointments: { view: true, create: true }
  }
};

export const PAGE_KEY_ALIASES = {
  registerPatient: "patients",
  "reception-register-patient": "patients",
  patientRecords: "patients",
  "reception-patient-records": "patients",
  admitPatient: "admissions",
  "reception-admit-patient": "admissions",
  admissionRecords: "admissions",
  "reception-admission-records": "admissions",
  createInvoice: "billing",
  payments: "billing",
  receipts: "billing",
  stocklogic: "stock",
  "stock-logic": "stock",
  "stock logic": "stock",
  stockLogic: "stock",
  ipdvitals: "ipdVitals",
  "ipd-vitals": "ipdVitals",
  "ipd vitals": "ipdVitals",
  dutydoctor: "dutyDoctor",
  "duty-doctor": "dutyDoctor",
  "duty doctor": "dutyDoctor",
  ipdnursing: "nursing",
  "ipd-nursing": "nursing",
  "ipd nursing": "nursing",
  nursingnotes: "nursing",
  intakeoutput: "intakeOutput",
  "intake-output": "intakeOutput",
  "intake output": "intakeOutput",
  dailyipdreport: "ipdReports",
  "daily-ipd-report": "ipdReports",
  "daily ipd report": "ipdReports",
  ipdoverview: "ipd",
  "ipd-overview": "ipd",
  "ipd overview": "ipd",
  mytasks: "tasks",
  "my-tasks": "tasks",
  "my tasks": "tasks",
  ipdpatient360: "ipdPatient360",
  "ipd-patient-360": "ipdPatient360",
  "ipd patient 360": "ipdPatient360",
  ot: "ot",
  operationtheatre: "ot",
  "operation-theatre": "ot",
  "operation theatre": "ot",
  "operation theater": "ot",
  "ot management": "ot",
  surgery: "ot",
  mortuary: "mortuary",
  "death registration": "mortuary",
  "death register": "mortuary",
  "mortuary management": "mortuary",
  morgue: "mortuary",
  // Removed aliases for mortuary child routes; they will be handled directly in canAccessPage
  emr: "emr",
  ehr: "emr",
  "medical record": "emr",
  "patient record": "emr",
  "health record": "emr"
};

export const NAV_BY_ROLE = {
  [ROLES.SUPER_ADMIN]: [
    ["dashboard", "Dashboard"],
    ["hospitals", "Hospital Customers"],
    ["users", "Admin Users"],
    ["subscriptions", "Subscriptions"],
    ["offers", "Offers & Coupons"],
    ["modules", "Modules"],
    ["reports", "Usage Analytics"],
    ["backup", "System Backup"],
    ["compliance", "Compliance"],
    ["audit", "Audit Logs"],
    ["settings", "System Settings"],
    ["productFlow", "Product Flow"]
  ],
  [ROLES.HOSPITAL_ADMIN]: [
    ["dashboard", "Dashboard"],
    ["hospitals", "Hospital Profile"],
    ["branches", "Branch Management"],
    ["users", "Branch Admins"],
    ["masterData", "Departments"],
    ["staffRoster", "Staff Management"],
    ["permissionTemplates", "Roles & Permissions"],
    ["patients", "Patients"],
    ["appointments", "Appointments"],
    ["ipd", "OPD / IPD"],
    ["wards", "Wards & Beds"],
    ["billing", "Billing"],
    ["finance", "Services & Pricing"],
    ["stock", "Pharmacy Inventory"],
    ["records", "Laboratory Management"],
    ["compliance", "Radiology Management"],
    ["inventory", "Inventory"],
    ["reports", "Reports & Analytics"],
    ["notifications", "Notifications"],
    ["audit", "Audit Logs"],
    ["settings", "Settings"]
  ],
  [ROLES.BRANCH_ADMIN]: [
    ["dashboard", "Dashboard"],
    ["appointments", "Appointments"],
    ["patients", "Patients"],
    ["emr", "EMR / EHR"],
    ["queue", "Queue"],
    ["vitals", "Vitals"],
    ["consultation", "Doctor Consultation"],
    ["lab", "Lab (LIS)"],
    ["radiology", "Radiology (RIS)"],
    ["pharmacy", "Pharmacy"],
    ["billing", "Billing"],
    ["checkout", "Checkout"],
    ["followups", "Follow-ups"],
    ["admissions", "Admissions"],
    ["setup", "Setup Wizard"],
    ["masterData", "Master Data"],
    ["doctorSchedule", "Doctor Schedule"],
    ["staffRoster", "Duty Roster"],
    ["emergency", "Emergency"],
    ["documents", "Documents"],
    ["notifications", "Notifications"],
    ["finance", "Finance"],
    ["stock", "Stock Logic"],
    ["purchase", "Purchase"],
    ["feedback", "Feedback"],
    ["compliance", "Compliance"],
    ["globalSearch", "Global Search"],
    ["ipd", "IPD Patients"],
    ["ipdPatient360", "IPD Patient 360"],
    ["wards", "Wards / Beds"],
    ["dailySheets", "Daily Sheets"],
    ["dutyDoctor", "Duty Doctor"],
    ["nursing", "IPD Nursing"],
    ["ipdVitals", "IPD Vitals"],
    ["mar", "MAR"],
    ["intakeOutput", "Intake / Output"],
    ["handover", "Handover"],
    ["discharge", "Discharge"],
    ["ot", "Operation Theatre"],
    ["deathSummary", "Death Summary"],
    ["mortuary", "Mortuary & Death Reg."],
    ["ipdReports", "Daily IPD Report"],
    ["ipdAlerts", "IPD Alerts"],
    ["uploads", "Upload Records"],
    ["mapping", "Data Mapping"],
    ["records", "Records"],
    ["alerts", "Alerts"],
    ["tasks", "Tasks"],
    ["staff", "Staff"],
    ["beds", "Beds / Rooms"],
    ["inventory", "Inventory"],
    ["incidents", "Incidents"],
    ["reports", "Reports"],
    ["accessReview", "User Access Review"],
    ["permissionTemplates", "Permission Templates"],
    ["users", "Staff Users"],
    ["audit", "Audit Trail"],
    ["settings", "Settings"],
    ["productFlow", "Product Flow"]
  ],
  [ROLES.BRANCH_USER]: [
    ["dashboard", "My Dashboard"],
    ["appointments", "Appointments"],
    ["patients", "Patients"],
    ["emr", "EMR / EHR"],
    ["queue", "Queue"],
    ["vitals", "Vitals"],
    ["consultation", "Consultation"],
    ["lab", "Lab / Radiology"],
    ["radiology", "Radiology"],
    ["pharmacy", "Pharmacy"],
    ["billing", "Billing"],
    ["claims", "Claims"],
    ["checkout", "Checkout"],
    ["followups", "Follow-ups"],
    ["admissions", "Admissions"],
    ["emergency", "Emergency"],
    ["documents", "Documents"],
    ["notifications", "Notifications"],
    ["stock", "Stock"],
    ["inventory", "Inventory"],
    ["purchase", "Purchase"],
    ["feedback", "Feedback"],
    ["globalSearch", "Global Search"],
    ["ipd", "IPD Patients"],
    ["ipdPatient360", "IPD Patient 360"],
    ["wards", "Wards / Beds"],
    ["dailySheets", "Daily Sheets"],
    ["dutyDoctor", "Duty Doctor"],
    ["nursing", "IPD Nursing"],
    ["ipdVitals", "IPD Vitals"],
    ["mar", "MAR"],
    ["intakeOutput", "Intake / Output"],
    ["handover", "Handover"],
    ["discharge", "Discharge"],
    ["ot", "Operation Theatre"],
    ["deathSummary", "Death Summary"],
    ["mortuary", "Mortuary & Death Reg."],
    ["ipdReports", "IPD Report"],
    ["ipdAlerts", "IPD Alerts"],
    ["records", "My Records"],
    ["tasks", "My Tasks"],
    ["alerts", "Alerts"],
    ["staff", "Staff"],
    ["staffRoster", "Duty Roster"],
    ["doctorSchedule", "Doctor Schedule"],
    ["incidents", "Incidents"],
    ["accessReview", "User Access Review"],
    ["reports", "Reports"]
  ]
};

const PAGE_LABELS = {
  dashboard: "Dashboard",
  users: "Users & Roles",
  accessReview: "User Access Review",
  permissionTemplates: "Permission Templates",
  appointments: "Appointments",
  patients: "Patient Flow",
  emr: "EMR / EHR",
  queue: "Patient Flow",
  vitals: "Vitals",
  consultation: "Consultation",
  lab: "Lab",
  radiology: "Radiology",
  pharmacy: "Pharmacy",
  billing: "Billing",
  checkout: "Checkout",
  followups: "Follow-ups",
  admissions: "Admissions",
  masterData: "Master Data",
  setup: "Setup",
  doctorSchedule: "Doctor Schedule",
  staffRoster: "Staff Roster",
  emergency: "Emergency",
  documents: "Documents",
  notifications: "Notifications",
  finance: "Finance",
  stock: "Stock",
  purchase: "Purchase",
  feedback: "Feedback",
  backup: "Backup",
  compliance: "Compliance",
  globalSearch: "Global Search",
  ipd: "IPD",
  ipdPatient360: "IPD Patient 360",
  wards: "IPD",
  dailySheets: "IPD",
  dutyDoctor: "Duty Doctor",
  nursing: "IPD Nursing",
  ipdVitals: "IPD Vitals",
  mar: "MAR",
  intakeOutput: "Intake / Output",
  handover: "Handover",
  discharge: "Discharge",
  ot: "Operation Theatre",
  deathSummary: "Death Summary",
  mortuary: "Mortuary & Death Registration",
  ipdReports: "IPD Reports",
  ipdAlerts: "IPD Alerts",
  claims: "Claims",
  reports: "Reports",
  audit: "Audit Logs",
  inventory: "Inventory",
  incidents: "Incidents",
  settings: "Settings",
  productFlow: "Product Flow"
};

const MODULE_ALIASES = {
  "my dashboard": "dashboard",
  dashboard: "dashboard",
  ...PAGE_KEY_ALIASES,
  billing: "billing",
  bills: "billing",
  "generate bill": "billing",
  "collect payment": "billing",
  refunds: "billing",
  pharmacy: "pharmacy",
  prescriptions: "pharmacy",
  "medicine issue": "pharmacy",
  "add stock": "stock",
  "stock view": "stock",
  inventory: "inventory",
  reports: "reports",
  "finance reports": "finance",
  "audit logs": "audit",
  "users & roles": "users",
  "user roles": "users",
  "user access review": "accessReview",
  "permission templates": "permissionTemplates",
  "discharge planning": "discharge",
  "discharge summary": "ipdReports",
  "death summary": "deathSummary",
  "mortality summary": "deathSummary"
};

const ACTION_ALIASES = {
  "add stock": "create",
  "generate bill": "create",
  "issue medicine": "edit",
  "collect payment": "edit",
  "process refund": "refund",
  "view audit logs": "view",
  "export audit logs": "export",
  "export report": "export",
  "manage users": "manageUsers",
  "manage settings": "manageSettings",
  "assign task": "assignTask"
};

function normalizeToken(value) {
  return String(value || "").trim();
}

export function normalizePageKey(page) {
  const raw = normalizeToken(page);
  const lowered = raw.toLowerCase();
  const compact = compactToken(raw);
  return PAGE_KEY_ALIASES[raw] || PAGE_KEY_ALIASES[lowered] || PAGE_KEY_ALIASES[compact] || raw;
}

function normalizeModule(module) {
  const raw = normalizeToken(module);
  const lowered = raw.toLowerCase();
  const pageKey = normalizePageKey(raw);
  if (pageKey !== raw) return pageKey;
  if (MODULE_ALIASES[lowered]) return MODULE_ALIASES[lowered];
  if (MODULE_ALIASES[compactToken(raw)]) return MODULE_ALIASES[compactToken(raw)];
  const direct = MODULES.find((item) => item.toLowerCase() === lowered);
  if (direct) return direct;
  const labelMatch = Object.entries(PAGE_LABELS).find(([, label]) => label.toLowerCase() === lowered);
  return labelMatch?.[0] || raw;
}

function normalizeAction(action) {
  const raw = normalizeToken(action);
  const lowered = raw.toLowerCase();
  if (ACTION_ALIASES[lowered]) return ACTION_ALIASES[lowered];
  const direct = ACTIONS.find((item) => item.toLowerCase() === lowered);
  return direct || lowered.replace(/\s+/g, "");
}

function matrixAllows(user, module, action) {
  const permissions = user?.permissions || {};
  const keys = [module, PAGE_LABELS[module], normalizeToken(module)].filter(Boolean);
  const entryKey = keys.find((key) => permissions[key] !== undefined);
  if (!entryKey) return null;
  const actions = Array.isArray(permissions[entryKey]) ? permissions[entryKey] : Object.entries(permissions[entryKey] || {}).filter(([, value]) => Boolean(value)).map(([key]) => key);
  return actions.map(normalizeAction).includes(action);
}

function normalizedListIncludes(values = [], module) {
  return (values || []).some((value) => normalizeModule(value) === module);
}

function branchUserPageAllowed(user, module) {
  const subRole = normalizeSubRoleName(user);
  if (module === "tasks") return true;
  if (["nursing", "intakeOutput", "ipdVitals", "dutyDoctor", "handover"].includes(module)) return subRole === "Nurse";
  if (["dutyDoctor", "ipdVitals"].includes(module)) return subRole === "Duty Doctor";
  return false;
}

function branchUserSupportPermission(user, module, action) {
  if (action !== "view") return false;
  const subRole = normalizeSubRoleName(user);
  const supportBySubRole = {
    Nurse: new Set(["admissions", "ipd", "ipdPatient360", "wards", "dailySheets", "nursing", "mar", "ipdVitals", "dutyDoctor", "intakeOutput", "handover", "tasks"]),
    "Duty Doctor": new Set(["admissions", "ipd", "ipdPatient360", "dailySheets", "dutyDoctor", "ipdVitals", "handover", "discharge", "ipdAlerts", "tasks"])
  };
  return supportBySubRole[subRole]?.has(module) || false;
}

export function can(user, module, action = "view") {
  if (!user) return false;
  const role = normalizeRoleName(user.role || user.roleLevel);
  const normalizedModule = normalizeModule(module);
  const normalizedAction = normalizeAction(action);
  if (role === ROLES.BRANCH_USER) {
    if (normalizeSubRoleName(user) === "Reception") {
      const receptionModules = new Set(["dashboard", "patients", "admissions", "billing"]);
      if (!receptionModules.has(normalizedModule)) return false;
      if (normalizedModule === "dashboard") return normalizedAction === "view";
      return ["view", "create", "edit", "export"].includes(normalizedAction);
    }
    if (normalizeSubRoleName(user) === "Reception" && normalizedModule === "patients" && normalizedAction === "delete") return true;
    const allowedPage = normalizedListIncludes(user.allowedPages, normalizedModule) ||
      normalizedListIncludes(user.allowedModules, normalizedModule) ||
      (normalizedAction === "view" && branchUserPageAllowed(user, normalizedModule)) ||
      branchUserSupportPermission(user, normalizedModule, normalizedAction);
    if (!allowedPage) return false;
    if (normalizedAction === "view") return true;
    const matrixDecision = matrixAllows(user, normalizedModule, normalizedAction);
    if (matrixDecision !== null) return matrixDecision;
    return ["create", "edit", "export", "assignTask", "escalate"].includes(normalizedAction);
  }
  const rolePermissions = ROLE_PERMISSIONS[role] || {};
  const modulePermissions = rolePermissions[normalizedModule] || {};
  if (modulePermissions[normalizedAction]) return true;
  return false;
}

export function hasPermission(user, module, action = "view") {
  return can(user, module, action);
}

export function canAccessPage(user, page) {
  const rawPage = String(page || "").trim();
  const normalizedPage = normalizePageKey(rawPage);

  if (!user) return normalizedPage === "login";
  if (rawPage === "profile") return true;

  const role = normalizeRoleName(user.role || user.roleLevel);

  const hospitalAdminClinicalPages = new Set([
    "emr",
    "queue",
    "vitals",
    "consultation",
    "lab",
    "radiology",
    "pharmacy",
    "dailySheets",
    "dutyDoctor",
    "nursing",
    "ipdVitals",
    "mar",
    "intakeOutput",
    "handover",
    "ot",
    "deathSummary",
    "ipdReports",
    "ipdAlerts",
    "ipdPatient360"
  ]);

  if (role === ROLES.HOSPITAL_ADMIN && hospitalAdminClinicalPages.has(normalizedPage)) {
    return false;
  }

  if (normalizedPage === "ipdPatient360") {
    return hasPermission(user, "ipd", "view");
  }

  if (
    normalizedPage === "hospitals" &&
    ![ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN].includes(role)
  ) {
    return false;
  }

  if (
    normalizedPage === "branches" &&
    ![ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN].includes(role)
  ) {
    return false;
  }

  const mortuaryPages = new Set([
    "mortuary",
    "mortuary-register-death",
    "mortuary-storage",
    "mortuary-certificates",
    "mortuary-release",
    "mortuary-register",
    "mortuary-search"
  ]);

  if (mortuaryPages.has(rawPage)) {
    return hasPermission(user, "mortuary", "view");
  }

  return hasPermission(user, normalizedPage, "view");
}

export function scopeDescription(user) {
  if (!user) return "Signed out";
  if (user.role === ROLES.SUPER_ADMIN) return "Platform-wide access";
  if (user.role === ROLES.HOSPITAL_ADMIN) return "Hospital group access";
  if (user.role === ROLES.BRANCH_ADMIN) return "Assigned branch access";
  return "Assigned module access";
}

export function canSeeRecord(user, record) {
  if (user.role === ROLES.SUPER_ADMIN) return true;
  if (user.role === ROLES.HOSPITAL_ADMIN) return record.hospitalId === user.hospitalId;
  if (user.role === ROLES.BRANCH_ADMIN) return record.hospitalId === user.hospitalId && record.branchId === user.branchId;
  return record.hospitalId === user.hospitalId && record.branchId === user.branchId && user.allowedModules.includes(record.type);
}

export function canSeeWorkflowItem(user, item, module) {
  if (user.role === ROLES.SUPER_ADMIN) return true;
  if (user.role === ROLES.HOSPITAL_ADMIN) {
    return item.hospitalId === user.hospitalId && hasPermission(user, module, "view");
  }
  if (user.role === ROLES.BRANCH_ADMIN) return item.hospitalId === user.hospitalId && item.branchId === user.branchId;
  return item.hospitalId === user.hospitalId && item.branchId === user.branchId && hasPermission(user, module, "view");
}

export function canSeeHospital(user, hospitalId) {
  if (user.role === ROLES.SUPER_ADMIN) return true;
  return user.hospitalId === hospitalId;
}

export function canSeeBranch(user, branchId, branch) {
  if (user.role === ROLES.SUPER_ADMIN) return true;
  if (!branch) return false;
  if (user.role === ROLES.HOSPITAL_ADMIN) return branch.hospitalId === user.hospitalId;
  return user.branchId === branchId || user.allowedBranchIds?.includes(branchId);
}
