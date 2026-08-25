import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const application = readFileSync(new URL("../src/core/application.js", import.meta.url), "utf8");
const rbac = readFileSync(new URL("../src/lib/rbac.js", import.meta.url), "utf8");

test("Hospital Admin sidebar is organized as an operational command center", () => {
  const nav = application.match(/const HOSPITAL_ADMIN_NAV = \[([\s\S]*?)\n\];/)?.[1] || "";
  for (const group of ["OVERVIEW", "ORGANIZATION", "OPERATIONS", "FINANCE", "SUPPORT SERVICES", "INSIGHTS", "SYSTEM"]) assert.match(nav, new RegExp(group));
  for (const label of ["Hospital Profile", "Branch Management", "Branch Admins", "Departments", "Staff Management", "Roles & Permissions", "OPD / IPD", "Wards & Beds", "Services & Pricing", "Pharmacy Inventory", "Laboratory Management", "Radiology Management", "Reports & Analytics", "Audit Logs"]) assert.match(nav, new RegExp(label.replace(/[&/]/g, ".")));
  for (const clinical of ["EMR / EHR", "IPD Patient 360", "Vitals", "Doctor Consultation", "MAR", "Nursing Care"]) assert.doesNotMatch(nav, new RegExp(clinical));
});

test("Hospital Admin permissions exclude clinical data modules", () => {
  const activeRbac = rbac.slice(rbac.lastIndexOf("export const ROLE_PERMISSIONS = {"));
  const permissions = activeRbac.match(/\[ROLES\.HOSPITAL_ADMIN\]: \{([\s\S]*?)\n  \},\n  \[ROLES\.BRANCH_ADMIN\]/)?.[1] || "";
  for (const module of ["emr", "queue", "vitals", "consultation", "lab", "radiology", "pharmacy", "dailySheets", "dutyDoctor", "nursing", "ipdVitals", "mar", "intakeOutput", "handover", "deathSummary"]) assert.doesNotMatch(permissions, new RegExp(`\\b${module}:`));
  for (const module of ["branches", "users", "appointments", "patients", "billing", "wards", "finance", "stock", "inventory", "reports", "audit", "settings"]) assert.match(permissions, new RegExp(`\\b${module}:`));
});

test("Hospital Admin dashboard uses live branch-scoped operational datasets", () => {
  assert.match(application, /function hospitalAdminDashboardPage\(\)/);
  assert.match(application, /data-hospital-admin-branch/);
  for (const label of ["Total Patients", "Today's Appointments", "Current Admissions", "Bed Occupancy", "Today's Revenue", "Pending Bills", "Staff on Duty", "Operational Alerts", "Branch Overview", "Bed & Ward Overview", "Revenue Summary", "Staff Overview"]) assert.match(application, new RegExp(label.replace(/[&]/g, ".")));
  assert.doesNotMatch(application.match(/function hospitalAdminPatientsPage\(\) \{([\s\S]*?)\n\}/)?.[1] || "", /diagnos|prescription|vitals|clinical notes/i);
});
