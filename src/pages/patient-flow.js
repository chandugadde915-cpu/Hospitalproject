let __dataRenderScheduled, accessDeniedPanel, accessReviewTarget, actionIcon, addButtonTestId, admissionBedLabel, admissionDisplayId, admissionPatientId, admissionWardLabel, allAssignablePages, allowedCreatorRoleOptions, animateCountUps, api, app, applyUserRolePreset, appointmentDepartmentOptions, appointmentDoctorOptions, asArray, attentionPanel, auditSearchQuery, authFrame, automationAlerts, automationAlertsPanel, automationList, automationSettingsCache, automationSettingsCacheUserId, automationSettingsForScope, badge, billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, branchDepartmentOptions, branchUserPermissionBuilder, canAccessPage, canonicalRecordId, careCommandStrip, checklistPanel, clickLoadingActions, cloneUserOptions, COLLECTION_MODULES, collectionRows, collectSetupStepValues, comparisonTable, createForm, createModal, createTarget, currencyDisplay, currencyValue, currentPageTitle, currentUser, dashboardPage, dateSeriesFromRows, deathSummaryButton, deathSummaryChecklistPanel, deathSummaryForAdmission, deathSummaryForm, deathSummaryPage, deathSummaryPreview, deathSummarySection, delayLabel, deleteModal, deleteTarget, deriveBillingSuggestions, deriveNotifications, deriveOperationalData, deriveTasks, dischargeChecklistPanel, documentActions, documentAlertsPanel, documentTable, documentTypeOptions, documentUploadPanel, downloadBase64File, draftKeyFor, draftTimers, editableEntries, editFieldControl, editFieldLabel, editModal, editTarget, emergencyOneScreenPanel, emptyState, enhanceDraftAreas, enhancePasswordHints, environmentLabel, escapeAttribute, escapeHtml, exportCsv, exportExcel, fileStorageStatus, fillAppointmentFromPatient, filterAppointmentDoctors, filterByAdmission, financeSummaryFromBills, findAdmissionForPlan, findPatient, findPatientForDischarge, firstDefined, formatAuditValue, formatDateTime, formatGb, formValues, getApiMode, globalSearchActiveIndex, globalSearchError, globalSearchQuery, globalSearchStatus, globalSearchSuggestions, globalSearchTimer, goLiveChecklistCache, goLiveChecklistCacheUserId, goLiveChecklistForScope, gridActions, gridAddButton, groupSearchResults, hasPermission, iconLabel, inferredSetupProgress, initFrontendSentry, ipd360Button, ipd360Tabs, ipdAdmissionChecklistPanel, ipdAdmissionStatus, ipdHeader, ipdJourneyTracker, ipdNextActions, ipdTimelineEvents, ipdTimelinePanel, isAuthError, isBillPaidToday, isDeathOutcome, isPendingStatus, isToday, isUnauthorizedError, jobRoleOptions, journeyTracker, latestForPatient, latestPatientJourneyStage, latestRecord, livePatientFlowBoard, loadingLabel, loadingLabels, localDateInputValue, localDateKey, localFrontendMode, MASTER_MODULES, medicineField, mergeNotifications, metricCard, metricTrend, minutesSince, missingDocumentAlerts, modalSubmitTestId, money, NAV_BY_ROLE, navGroupLabel, navIcon, normalizeBranchAdminCreateUserForm, normalizeDashboardData, normalizeEditValues, normalizePageKey, normalizeSetupStep, notificationGroup, notificationsDrawerOpen, OPD_JOURNEY_STEPS, opdCheckoutChecklistPanel, opdJourneyTrackerForPatient, PAGE_TITLE_FALLBACK, pageErrorPanel, pageFromHash, pageSkeleton, parseCsv, parseHashRoute, passwordField, passwordPolicyHint, passwordPolicyState, patientActions, patientAppointmentsPage, patientBillsPage, patientCardGrid, patientDashboardPage, patientDocumentsPage, patientJourneyTimelinePanel, patientLabel, patientName, patientOption, patientPortalShell, patientRiskIndicator, patientStickyHeader, patientTimeline, pendingCount, pendingUpload, permissionMatrix, permissionMatrixRows, permissionRiskAlerts, permissionRiskPanel, permissionTemplateOptions, permitted, printableButton, priorityCards, providerStatusGrid, publicBookingConfirmation, publicBookingLinkBlock, publicBookingPage, queueDelayAlerts, queueDelayPanel, quickActionsPanel, readFileAsDataUrl, readFileAsText, recordTime, render, renderAuth, renderedPageKey, renderMustChangePasswordGate, renderNotificationsDrawer, renderPage, renderPatientPortal, renderPublicBooking, renderShell, resolveDischargePatient, resolveMedicationName, riskClass, riskSummary, roleDashboardPanel, roleLabels, ROLES, roleSmartCards, roleWorkQueue, routeKey, rowRouteButton, runGlobalSearch, safeAiAssistantPanel, safeData, safeMrn, safeOptionalData, safeRenderPage, sameId, sampleCsv, scheduleDataRender, scheduleDraftSave, scopeDescription, searchFilterBar, searchResultRoute, selectedPatientId, selectedPermissionPages, selectPatientPanel, SENSITIVE_USER_PERMISSIONS, sensitivePermissionList, setPage, setPermissionPages, SETUP_STEP_ALIASES, SETUP_WIZARD_STEPS, setupPercent, setupProgressSummary, severityForDelay, shouldStagePage, simpleOpsPage, skeletonLine, skeletonMetricCards, skeletonTable, smartBillingDraftPanel, stagedPageKey, stagedPageTimer, startButtonLoading, startFormLoading, statusClass, stopButtonLoading, stopFormLoading, strongPassword, table, taskStatus, TEXT_TEMPLATES, titleCase, toast, toNumber, topSearchAutocomplete, trendChart, unauthorizedPage, uniquePages, updatePermissionBuilder, uploadValidation, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, userAccessDetail, userAccessPreview, userInitials, userPageCheckboxGroups, validateRows, warmDataCache;

import { filterPatientsForReception, getPatientFilterState, patientFilterEmptyMessage, patientWorkflowStatus } from "../modules/reception/patient-filters.js";
import { findOpdVitalsForQueue } from "../modules/opd/journey-status.js";

let admissionSearchQuery = "";
let admissionStatusFilter = "All";

export function setAdmissionSearchQuery(value) { admissionSearchQuery = String(value || ""); }
export function setAdmissionStatusFilter(value) { admissionStatusFilter = String(value || "All"); }

export function configurePageRenderers(context) {
  ({ __dataRenderScheduled, accessDeniedPanel, accessReviewTarget, actionIcon, addButtonTestId, admissionBedLabel, admissionDisplayId, admissionPatientId, admissionWardLabel, allAssignablePages, allowedCreatorRoleOptions, animateCountUps, api, app, applyUserRolePreset, appointmentDepartmentOptions, appointmentDoctorOptions, asArray, attentionPanel, auditSearchQuery, authFrame, automationAlerts, automationAlertsPanel, automationList, automationSettingsCache, automationSettingsCacheUserId, automationSettingsForScope, badge, billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, branchDepartmentOptions, branchUserPermissionBuilder, canAccessPage, canonicalRecordId, careCommandStrip, checklistPanel, clickLoadingActions, cloneUserOptions, COLLECTION_MODULES, collectionRows, collectSetupStepValues, comparisonTable, createForm, createModal, createTarget, currencyDisplay, currencyValue, currentPageTitle, currentUser, dashboardPage, dateSeriesFromRows, deathSummaryButton, deathSummaryChecklistPanel, deathSummaryForAdmission, deathSummaryForm, deathSummaryPage, deathSummaryPreview, deathSummarySection, delayLabel, deleteModal, deleteTarget, deriveBillingSuggestions, deriveNotifications, deriveOperationalData, deriveTasks, dischargeChecklistPanel, documentActions, documentAlertsPanel, documentTable, documentTypeOptions, documentUploadPanel, downloadBase64File, draftKeyFor, draftTimers, editableEntries, editFieldControl, editFieldLabel, editModal, editTarget, emergencyOneScreenPanel, emptyState, enhanceDraftAreas, enhancePasswordHints, environmentLabel, escapeAttribute, escapeHtml, exportCsv, exportExcel, fileStorageStatus, fillAppointmentFromPatient, filterAppointmentDoctors, filterByAdmission, financeSummaryFromBills, findAdmissionForPlan, findPatient, findPatientForDischarge, firstDefined, formatAuditValue, formatDateTime, formatGb, formValues, getApiMode, globalSearchActiveIndex, globalSearchError, globalSearchQuery, globalSearchStatus, globalSearchSuggestions, globalSearchTimer, goLiveChecklistCache, goLiveChecklistCacheUserId, goLiveChecklistForScope, gridActions, gridAddButton, groupSearchResults, hasPermission, iconLabel, inferredSetupProgress, initFrontendSentry, ipd360Button, ipd360Tabs, ipdAdmissionChecklistPanel, ipdAdmissionStatus, ipdHeader, ipdJourneyTracker, ipdNextActions, ipdTimelineEvents, ipdTimelinePanel, isAuthError, isBillPaidToday, isDeathOutcome, isPendingStatus, isToday, isUnauthorizedError, jobRoleOptions, journeyTracker, latestForPatient, latestPatientJourneyStage, latestRecord, livePatientFlowBoard, loadingLabel, loadingLabels, localDateInputValue, localDateKey, localFrontendMode, MASTER_MODULES, medicineField, mergeNotifications, metricCard, metricTrend, minutesSince, missingDocumentAlerts, modalSubmitTestId, money, NAV_BY_ROLE, navGroupLabel, navIcon, normalizeBranchAdminCreateUserForm, normalizeDashboardData, normalizeEditValues, normalizePageKey, normalizeSetupStep, notificationGroup, notificationsDrawerOpen, OPD_JOURNEY_STEPS, opdCheckoutChecklistPanel, opdJourneyTrackerForPatient, PAGE_TITLE_FALLBACK, pageErrorPanel, pageFromHash, pageSkeleton, parseCsv, parseHashRoute, passwordField, passwordPolicyHint, passwordPolicyState, patientActions, patientAppointmentsPage, patientBillsPage, patientCardGrid, patientDashboardPage, patientDocumentsPage, patientJourneyTimelinePanel, patientLabel, patientName, patientOption, patientPortalShell, patientRiskIndicator, patientStickyHeader, patientTimeline, pendingCount, pendingUpload, permissionMatrix, permissionMatrixRows, permissionRiskAlerts, permissionRiskPanel, permissionTemplateOptions, permitted, printableButton, priorityCards, providerStatusGrid, publicBookingConfirmation, publicBookingLinkBlock, publicBookingPage, queueDelayAlerts, queueDelayPanel, quickActionsPanel, readFileAsDataUrl, readFileAsText, recordTime, render, renderAuth, renderedPageKey, renderMustChangePasswordGate, renderNotificationsDrawer, renderPage, renderPatientPortal, renderPublicBooking, renderShell, resolveDischargePatient, resolveMedicationName, riskClass, riskSummary, roleDashboardPanel, roleLabels, ROLES, roleSmartCards, roleWorkQueue, routeKey, rowRouteButton, runGlobalSearch, safeAiAssistantPanel, safeData, safeMrn, safeOptionalData, safeRenderPage, sameId, sampleCsv, scheduleDataRender, scheduleDraftSave, scopeDescription, searchFilterBar, searchResultRoute, selectedPatientId, selectedPermissionPages, selectPatientPanel, SENSITIVE_USER_PERMISSIONS, sensitivePermissionList, setPage, setPermissionPages, SETUP_STEP_ALIASES, SETUP_WIZARD_STEPS, setupPercent, setupProgressSummary, severityForDelay, shouldStagePage, simpleOpsPage, skeletonLine, skeletonMetricCards, skeletonTable, smartBillingDraftPanel, stagedPageKey, stagedPageTimer, startButtonLoading, startFormLoading, statusClass, stopButtonLoading, stopFormLoading, strongPassword, table, taskStatus, TEXT_TEMPLATES, titleCase, toast, toNumber, topSearchAutocomplete, trendChart, unauthorizedPage, uniquePages, updatePermissionBuilder, uploadValidation, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, userAccessDetail, userAccessPreview, userInitials, userPageCheckboxGroups, validateRows, warmDataCache } = context);
}

export function appointmentsPage() {
  const appointments = api.appointments(currentUser);
  const data = deriveOperationalData();
  const patientForJourney = selectedPatientId || appointments[0]?.patientId || data.patients[0]?.id || "";
  const canCheckIn = (appointment) => ["Booked", "Active", "Arrived"].includes(appointment.status || "Active");
  return `
    ${journeyTracker(["Appointment", "Check-in", "Queue", "Vitals", "Consultation", "Lab / Pharmacy", "Billing", "Checkout"], 0, "OPD patient journey")}
    ${patientForJourney ? opdJourneyTrackerForPatient(patientForJourney, data) : ""}
    <section class="panel">
      <div class="panel-head">
        <div><h3>Appointments</h3><p>Book, check in, edit, or delete appointments from this grid.</p></div>
        <div class="button-row"><span class="badge status-active">${appointments.length} visible</span>${gridAddButton("Appointment", "create-appointment")}</div>
      </div>
      ${appointments.length ? table(["Patient", "Mobile", "Source", "Department", "Doctor", "Date", "Time", "Priority", "Status", "Actions"], appointments.map((appointment) => ({
        cells: [
        rowRouteButton(appointment.patientName || "Patient", "appointments", { patientId: appointment.patientId }),
        appointment.mobile,
        appointment.source,
        appointment.department,
        appointment.doctor,
        appointment.date,
        appointment.time,
        badge(appointment.priority, riskClass(appointment.priority === "Emergency" ? "Critical" : appointment.priority)),
        badge(appointment.status, statusClass(appointment.status)),
        `<div class="grid-actions">${hasPermission(currentUser, "queue", "create") && canCheckIn(appointment) ? (/reception/i.test(String(currentUser.jobRole || "")) ? `<button class="button tiny primary" title="Mark patient arrived and send to OPD vitals" aria-label="Send to Vitals" data-action="send-to-vitals" data-appointment="${appointment.id}" data-testid="send-to-vitals-button">Send to Vitals</button>` : `<button class="button tiny ${appointment.status === "Arrived" ? "primary" : "soft"}" title="${appointment.status === "Arrived" ? "Check in and generate token" : "Confirm arrival"}" aria-label="${appointment.status === "Arrived" ? "Check in" : "Confirm arrival"}" data-action="check-in" data-appointment="${appointment.id}" data-testid="check-in-patient-button">${appointment.status === "Arrived" ? "Check-In" : "Confirm Arrival"}</button>`) : ["Checked In", "Waiting", "Queued", "WAITING_FOR_VITALS"].includes(appointment.status) ? `<span class="badge status-in-progress">In Vitals Queue</span>` : ""}${gridActions("appointments", appointment.id)}</div>`
      ],
        attrs: {
          "data-route": "appointments",
          "data-patient-id": appointment.patientId,
          role: "button",
          tabindex: "0"
        }
      }))) : emptyState("No appointments yet. Click Add Appointment to book the first patient.")}
    </section>
  `;
}

export function patientsPage() {
  const patients = safeData(() => api.patients(currentUser));
  const data = deriveOperationalData();
  const filterState = getPatientFilterState();
  const visiblePatients = filterPatientsForReception(patients, data, currentUser.branchId);
  const selectedPatient = findPatient(patients) || null;
  const documents = hasPermission(currentUser, "documents", "view")
    ? safeOptionalData(() => api.patientDocuments(currentUser)).filter((doc) => String(doc.patientId || "") === String(selectedPatient?.id || ""))
    : [];
  const currentBranch = safeOptionalData(() => api.branches(currentUser), []).find((branch) => String(branch.id) === String(currentUser.branchId));
  const canInviteToPortal = hasPermission(currentUser, "patients", "edit") && Boolean(currentBranch?.patientPortalEnabled);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Patients</h3><p>Search, register and manage branch patients.</p></div>
        <div class="button-row">${gridAddButton("Patient", "register-patient")}</div>
      </div>
      <div class="filter-row compact workflow-filter" data-patient-filters>
        <input class="panel-search" type="search" placeholder="Search name, MRN or mobile" value="${escapeHtml(filterState.searchQuery)}" data-patient-search aria-label="Search patients" />
        <div class="chip-row">${["All", "Active", "Waiting", "Billing Pending", "Completed"].map((chip) => `<button class="chip ${filterState.statusFilter === chip ? "active" : ""}" type="button" data-patient-filter="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`).join("")}</div>
      </div>
      ${visiblePatients.length ? table(["MRN", "Patient", "Mobile", "Age / Sex", "Insurance", "Allergies", "Status", "Actions"], visiblePatients.map((patient) => ({
        cells: [
          rowRouteButton(patient.mrn || "MRN pending", "patients", { patientId: patient.id }),
          rowRouteButton(patient.name || patient.fullName || "Patient", "patients", { patientId: patient.id }),
          patient.mobile || patient.mobileNumber,
          [patient.age, patient.gender].filter(Boolean).join(" / ") || "-",
          patient.insurance,
          patient.allergies,
          badge(patientWorkflowStatus(patient, data), statusClass(patientWorkflowStatus(patient, data))),
          `<div class="patient-action-group">${patientActions(patient)}${gridActions("patients", patient.id)}${canInviteToPortal ? `<button class="button tiny soft" type="button" data-action="send-patient-portal-invite" data-patient-id="${patient.id}">Send portal invite</button>` : ""}</div>`
        ],
        attrs: {
          "data-route": "patients",
          "data-patient-id": patient.id,
          role: "button",
          tabindex: "0"
        }
      }))) : emptyState(patientFilterEmptyMessage())}
    </section>
    ${selectedPatient ? `
      <section class="panel">
        <div class="panel-head"><h3>Patient profile</h3><p>Quick view of the selected patient record.</p></div>
        <div class="mini-grid">
          <span><strong>${escapeHtml(selectedPatient.mrn || "MRN pending")}</strong><small>MRN</small></span>
          <span><strong>${escapeHtml(selectedPatient.mobile || selectedPatient.mobileNumber || "-")}</strong><small>Mobile</small></span>
          <span><strong>${escapeHtml([selectedPatient.age, selectedPatient.gender].filter(Boolean).join(" / ") || "-")}</strong><small>Age / Gender</small></span>
          <span><strong>${escapeHtml(selectedPatient.insurance || "None")}</strong><small>Insurance</small></span>
          <span><strong>${escapeHtml(selectedPatient.allergies || "None")}</strong><small>Allergies</small></span>
          <span><strong>${escapeHtml(selectedPatient.status || "Active")}</strong><small>Status</small></span>
        </div>
        <div class="next-actions"><strong>Next actions:</strong><button class="button primary" type="button" data-action="patient-book-appointment" data-patient="${escapeHtml(selectedPatient.id)}">Book OPD Appointment</button><button class="button soft" type="button" data-action="patient-create-admission" data-patient="${escapeHtml(selectedPatient.id)}">Create Admission</button></div>
        ${table(["Field", "Value"], [
          ["Hospital / Branch", [selectedPatient.hospitalName, selectedPatient.branchName].filter(Boolean).join(" / ") || "-"],
          ["OPD visits", data.appointments.filter((appointment) => String(appointment.patientId) === String(selectedPatient.id)).length],
          ["IPD admissions", data.admissions.filter((admission) => String(admission.patientId) === String(selectedPatient.id)).length],
          ["Bills", data.bills.filter((bill) => String(bill.patientId) === String(selectedPatient.id)).length],
          ["Documents", documents.length],
          ["Prescriptions", data.pharmacyIssues.filter((issue) => String(issue.patientId) === String(selectedPatient.id)).length]
        ])}
      </section>
      ${opdJourneyTrackerForPatient(selectedPatient.id, data)}
      ${patientJourneyTimelinePanel(selectedPatient, data)}
      ${opdCheckoutChecklistPanel(selectedPatient.id, data)}
      ${documentAlertsPanel(missingDocumentAlerts({ documents, patient: selectedPatient }))}
      ${documentUploadPanel({ patientId: selectedPatient.id, relatedModule: "documents", title: "Upload Patient Profile Document" })}
      <section class="panel">
        <div class="panel-head"><h3>Patient Documents</h3><p>Documents linked to ${escapeHtml(patientLabel(selectedPatient))}.</p></div>
        ${documentTable(documents)}
      </section>
    ` : ""}
  `;
}

export function queuePage() {
  const queue = safeData(() => api.queueTokens(currentUser));
  const flows = safeOptionalData(() => api.patientFlows(currentUser), []);
  // Queue users need encounter linkage to render journey completion even when
  // their role does not expose the clinical Vitals page itself.
  const vitals = safeOptionalData(() => api.vitals(currentUser), []);
  const consultations = safeOptionalData(() => api.consultations(currentUser), []);
  const labOrders = safeOptionalData(() => api.labOrders(currentUser), []);
  const radiologyOrders = safeOptionalData(() => api.radiologyOrders(currentUser), []);
  const prescriptions = safeOptionalData(() => api.prescriptions(currentUser), []);
  const bills = hasPermission(currentUser, "billing", "view") ? safeOptionalData(() => api.bills(currentUser)) : [];
  const data = { ...deriveOperationalData(), queue, vitals, consultations, bills, labOrders, radiologyOrders, prescriptions };
  const delayAlerts = queueDelayAlerts(queue, vitals, consultations, bills);
  const isDoctorQueue = ["doctor", "surgeon"].includes(String(currentUser.jobRole || "").toLowerCase());
  if (isDoctorQueue) {
    const patients = safeData(() => api.patients(currentUser));
    const appointments = safeData(() => api.appointments(currentUser));
    const seen = new Set();
    const ready = queue.filter((token) => ["Ready for Doctor", "READY_FOR_DOCTOR"].includes(token.status)).filter((token) => {
      const key = String(token.appointmentId || token.id);
      if (seen.has(key)) return false;
      seen.add(key);
      const appointment = appointments.find((item) => String(item.id) === String(token.appointmentId));
      if (appointment?.doctorId && currentUser.id) return String(appointment.doctorId) === String(currentUser.id);
      return !appointment?.department || !currentUser.department || appointment.department === currentUser.department;
    });
    return `<div class="metric-grid small">${metricCard("Ready for Consultation", ready.length, "OPD only")}${metricCard("With Doctor", queue.filter((item) => item.status === "With Doctor").length, "In progress")}</div><section class="panel"><div class="panel-head"><h3>Doctor OPD Queue</h3><p>Only encounters with completed Nurse vitals and Ready for Doctor status.</p></div>${ready.length ? table(["Token", "Patient", "MRN", "Department", "Appointment", "Waiting", "Vitals", "Status", "Action"], ready.map((token) => { const patient = findPatient(patients, token.patientId); const vital = findOpdVitalsForQueue(vitals, token); return [token.tokenNumber, patient?.name || token.patientName || "Unknown Patient", patient?.mrn || token.mrn || "-", token.department || "-", token.appointmentId, `${minutesSince(token.vitalsRecordedAt || token.checkedInAt || token.createdAt)} min`, vital ? badge("Completed", "status-active") : badge("Missing", "status-blocked"), badge(token.status, statusClass(token.status)), `<div class="grid-actions"><button class="button tiny soft" data-action="doctor-review-vitals" data-queue-token="${escapeHtml(token.id || token._id || "")}">Review Vitals</button><button class="button tiny primary" data-action="doctor-start-consultation" data-queue-token="${escapeHtml(token.id || token._id || "")}" data-patient-id="${escapeHtml(token.patientId || "")}" data-appointment-id="${escapeHtml(token.appointmentId || "")}" ${vital && token.patientId && token.appointmentId ? "" : "disabled"}>Start Consultation</button></div>`]; })) : emptyState("No Ready-for-Doctor OPD encounters are assigned to you.")}</section>`;
  }
  const stageFor = (token) => {
    if (bills.some((bill) => String(bill.patientId) === String(token.patientId) && bill.status === "Paid")) return "Billing paid";
    if (consultations.some((item) => String(item.patientId) === String(token.patientId))) return "Doctor complete";
    if (vitals.some((item) => String(item.patientId) === String(token.patientId))) return "Vitals done";
    return token.status || "Waiting";
  };
  const cards = queue.map((token) => {
    const stage = stageFor(token);
    const canVitals = hasPermission(currentUser, "vitals", "create") && !vitals.some((item) => String(item.patientId) === String(token.patientId));
    const canConsult = hasPermission(currentUser, "consultation", "create") && !consultations.some((item) => String(item.patientId) === String(token.patientId));
    const canBill = hasPermission(currentUser, "billing", "create");
    const action = canVitals ? "patient-record-vitals" : canConsult ? "patient-start-consultation" : canBill ? "patient-generate-bill" : "";
    return {
      ...token,
      mrn: token.mrn || token.tokenNumber,
      stage,
      status: stage,
      action,
      actionLabel: canVitals ? "Start Vitals" : canConsult ? "Start Consultation" : canBill ? "Send to Billing" : "",
      testId: canConsult ? "patient-action-start-consultation" : canVitals ? "patient-action-record-vitals" : "queue-next-action"
    };
  });
  return `
    ${livePatientFlowBoard(flows, queue, vitals, consultations, labOrders, radiologyOrders, prescriptions)}
    ${queue[0]?.patientId ? opdJourneyTrackerForPatient(queue[0].patientId, data) : ""}
    <div class="metric-grid small">
      ${metricCard("Waiting", queue.length, "Visible queue")}
      ${metricCard("Vitals done", vitals.length, "Ready for doctor")}
      ${metricCard("Consultations", consultations.length, "Clinical notes")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Token queue</h3><p>Checked-in patients move from reception to vitals, doctor, billing, pharmacy, and checkout.</p></div>
      ${searchFilterBar("Search queue by name / MRN / mobile", ["All", "Waiting", "Vitals Done", "With Doctor", "Billing Pending", "Emergency"])}
      ${queue.length ? patientCardGrid(cards) : emptyState("No patients are currently waiting in the queue. When reception checks in a patient, they will appear here.")}
      ${queue.length ? table(["Token", "Patient", "Department", "Doctor", "Visit", "Priority", "Waiting", "Clinical stage"], queue.map((token) => [
        token.tokenNumber,
        token.patientName,
        token.department,
        token.doctor,
        token.visitType,
        badge(token.priority, riskClass(token.priority === "Emergency" ? "Critical" : token.priority)),
        `${token.waitingMinutes || 0} min`,
        badge(stageFor(token), statusClass(stageFor(token)))
      ])) : ""}
    </section>
    ${queueDelayPanel(delayAlerts)}
  `;
}

export function vitalsPage() {
  const patients = safeData(() => api.patients(currentUser));
  const vitals = safeData(() => api.vitals(currentUser));
  const queue = hasPermission(currentUser, "queue", "view") ? safeOptionalData(() => api.queueTokens(currentUser)) : [];
  const checkedInPatients = queue.filter((token) => ["Waiting", "Vitals Pending"].includes(token.status));
  checkedInPatients.push(...queue.filter((token) => token.status === "WAITING_FOR_VITALS"));
  const selectedToken = checkedInPatients.find((token) => String(token.patientId) === String(selectedPatientId || "")) || null;
  const selectedPatient = findPatient(patients);
  const visibleVitals = selectedPatient ? vitals.filter((item) => String(item.patientId) === String(selectedPatient.id)) : vitals;
  const recordedToday = vitals.filter((item) => isToday(item.recordedAt || item.createdAt)).length;
  const trendLabels = visibleVitals.map((item) => recordTime(item.recordedAt || item.createdAt)).slice(-7);
  const data = deriveOperationalData();
  return `
    ${patientStickyHeader(selectedPatient, "Waiting for Vitals")}
    ${selectedPatient ? opdJourneyTrackerForPatient(selectedPatient.id, data) : ""}
    ${selectedPatient ? patientTimeline({ completed: ["registered", "appointment", "checkedIn"], current: "vitals" }) : ""}
    <div class="metric-grid small">
      ${metricCard("Waiting for vitals", checkedInPatients.length, "Nurse queue")}
      ${metricCard("Ready for Doctor", queue.filter((item) => ["Ready for Doctor", "READY_FOR_DOCTOR"].includes(item.status)).length, "Doctor handoff")}
      ${metricCard("Recorded Today", recordedToday, "OPD readings")}
    </div>
    ${hasPermission(currentUser, "vitals", "create") ? `
      <section class="panel">
        <div class="panel-head"><div><h3>OPD Vitals Queue</h3><p>Active OPD patients waiting for nurse screening.</p></div><button class="button small primary" type="button" data-action="open-create" data-form-action="add-to-vitals-queue" aria-label="Add patient to vitals queue">＋</button></div>
        ${!selectedToken && checkedInPatients.length ? table(["Patient", "MRN / UHID", "Age / Gender", "Department", "Doctor", "Visit Time", "Status", "Action"], checkedInPatients.map((token) => [
          token.patientName || patientName(patients, token.patientId),
          token.mrn || safeMrn(findPatient(patients, token.patientId)),
          [token.age || findPatient(patients, token.patientId)?.age, token.gender || findPatient(patients, token.patientId)?.gender].filter(Boolean).join(" / ") || "-",
          token.department,
          token.doctor,
          formatDateTime(token.visitTime || token.checkedInAt || token.createdAt),
          badge(token.status, statusClass(token.status)),
          `<button class="button tiny primary" type="button" data-action="patient-record-vitals" data-patient="${escapeHtml(token.patientId)}" data-queue-token="${escapeHtml(token.id)}" data-testid="patient-action-record-vitals">Record Vitals</button>`
        ])) : ""}
        ${!selectedToken && !checkedInPatients.length ? `<p class="compact-empty">No OPD patients are currently waiting for vitals.</p>` : ""}
        ${selectedToken ? `<div class="notice subtle"><strong>${escapeHtml(selectedPatient?.name || selectedToken.patientName || "Patient")}</strong> · ${escapeHtml(selectedPatient?.mrn || selectedToken.mrn || "MRN pending")} · Token ${escapeHtml(selectedToken.tokenNumber || "-")} · ${escapeHtml(selectedToken.department || "Department not assigned")}</div>
        <form class="form-grid" data-action="record-vitals">
          <input type="hidden" name="patientId" value="${escapeHtml(selectedToken.patientId)}" />
          <input type="hidden" name="appointmentId" value="${escapeHtml(selectedToken.appointmentId || "")}" />
          <input type="hidden" name="queueTokenId" value="${escapeHtml(selectedToken.id)}" />
          <label>Temperature<input name="temperature" placeholder="98.6 F" data-testid="form-temperature" /></label>
          <label>Blood pressure<input name="bloodPressure" required placeholder="120/80" data-testid="form-blood-pressure" /></label>
          <label>Pulse<input name="pulse" placeholder="76" /></label>
          <label>Respiratory rate<input name="respiratoryRate" placeholder="18" /></label>
          <label>SpO2<input name="spo2" placeholder="98%" data-testid="form-spo2" /></label>
          <label>Weight<input name="weight" type="number" min="0" step="0.1" placeholder="kg" /></label>
          <label>Height<input name="height" type="number" min="0" step="0.1" placeholder="cm" /></label>
          <label>Blood sugar<input name="bloodSugar" placeholder="110 mg/dL" /></label>
          <label>Pain score<input name="painScore" type="number" min="0" max="10" placeholder="0" /></label>
          <label class="span-2">Symptoms<input name="symptoms" placeholder="Patient-reported symptoms" /></label>
          <label class="span-2">Notes<textarea name="notes" placeholder="Any relevant screening notes"></textarea></label>
          <button class="button primary" type="submit" data-testid="record-vitals-button">Save & Send to Doctor</button>
        </form>` : ""}
        <div class="next-actions"><strong>Next action:</strong>
          ${hasPermission(currentUser, "consultation", "create") ? `<button class="button tiny soft" type="button" data-route="consultation" ${selectedPatient ? `data-patient-id="${escapeHtml(selectedPatient.id)}"` : ""}>Start Consultation</button>` : ""}
          ${hasPermission(currentUser, "queue", "view") ? `<button class="button tiny soft" type="button" data-route="queue">View Queue</button>` : ""}
        </div>
      </section>
    ` : ""}
    ${selectedPatient && visibleVitals.length ? `<section class="panel"><div class="panel-head"><h3>Vitals Trend</h3><p>Real saved OPD readings for ${escapeHtml(selectedPatient.name || selectedPatient.fullName || "selected patient")}.</p></div><div class="metric-grid small">${trendChart(visibleVitals.map((item) => Number.parseFloat(item.pulse) || 0).slice(-7), trendLabels)}${trendChart(visibleVitals.map((item) => Number.parseFloat(item.spo2) || 0).slice(-7), trendLabels)}${trendChart(visibleVitals.map((item) => Number.parseFloat(item.temperature) || 0).slice(-7), trendLabels)}${trendChart(visibleVitals.map((item) => Number.parseFloat(String(item.bloodPressure || "").split("/")[0]) || 0).slice(-7), trendLabels)}</div></section>` : ""}
    <section class="panel">
      <div class="panel-head"><h3>Vitals history</h3><span class="badge status-active">${visibleVitals.length}</span></div>
      ${table(["Patient", "BP", "Pulse", "SpO2", "Temperature", "Symptoms", "Notes", "Recorded By", "Recorded At", "Status"], visibleVitals.map((item) => [
        patientName(patients, item.patientId, item.patientId),
        item.bloodPressure,
        item.pulse,
        item.spo2,
        item.temperature,
        item.symptoms,
        item.notes,
        item.recordedBy,
        formatDateTime(item.recordedAt || item.createdAt),
        badge(item.status, statusClass(item.status))
      ]))}
    </section>
  `;
}

function doctorConsultationDraftPage() {
  const patients = safeData(() => api.patients(currentUser));
  const consultations = safeData(() => api.consultations(currentUser));
  const queue = safeData(() => api.queueTokens(currentUser));
  const vitals = safeData(() => api.vitals(currentUser));
  const matching = consultations.filter((item) => !selectedPatientId || String(item.patientId) === String(selectedPatientId)).sort((a, b) => new Date(b.completedAt || b.updatedAt || b.startedAt || 0) - new Date(a.completedAt || a.updatedAt || a.startedAt || 0));
  const active = matching.find((item) => ["In Progress", "Draft"].includes(item.status)) || matching.find((item) => item.status === "Completed");
  if (!active) return `<section class="panel"><div class="panel-head"><h3>Consultation</h3><p>Start a Ready-for-Doctor encounter from Doctor Queue.</p></div>${emptyState("No active OPD consultation selected.")}</section>`;
  const token = queue.find((item) => String(item.id) === String(active.queueTokenId));
  const patient = findPatient(patients, active.patientId);
  const appointment = safeOptionalData(() => api.appointments(currentUser), []).find((item) => String(item.id) === String(active.appointmentId));
  const encounterVitals = token ? vitals.filter((item) => String(item.patientId) === String(token.patientId) && (String(item.queueTokenId || "") === String(token.id) || String(item.appointmentId || "") === String(token.appointmentId))) : [];
  const latest = encounterVitals.sort((a, b) => new Date(b.recordedAt || b.createdAt || 0) - new Date(a.recordedAt || a.createdAt || 0))[0];
  const diagnoses = active.diagnoses || [];
  const medicines = active.medicines || [];
  const labOrders = active.labOrders || [];
  const radiologyOrders = active.radiologyOrders || [];
  const locked = active.status === "Completed";
  const removeButton = locked ? "" : `<button class="button tiny danger" type="button" data-action="remove-consultation-row">Remove</button>`;
  const orderRows = (kind, items, label) => items.map((item) => `<div class="consultation-repeat-row" data-consultation-row="${kind}"><label>${label}<input name="${kind}Test" value="${escapeHtml(item.test || "")}" placeholder="${label === "Lab Test" ? "CBC" : "Chest X-ray"}" /></label><label>Clinical Indication<input name="${kind}Indication" value="${escapeHtml(item.clinicalIndication || "")}" /></label><label>Priority<select name="${kind}Priority"><option ${item.priority === "Routine" ? "selected" : ""}>Routine</option><option ${item.priority === "Urgent" ? "selected" : ""}>Urgent</option><option ${item.priority === "STAT" ? "selected" : ""}>STAT</option></select></label><label>Notes<input name="${kind}Notes" value="${escapeHtml(item.notes || "")}" /></label>${removeButton}</div>`).join("");
  const medicineRows = medicines.map((item) => `<div class="consultation-repeat-row medicine-row" data-consultation-row="medicine"><label>Medicine<input name="medicine" value="${escapeHtml(item.medicine || "")}" placeholder="Paracetamol" /></label><label>Strength<input name="strength" value="${escapeHtml(item.strength || "")}" placeholder="500 mg" /></label><label>Dose<input name="dose" value="${escapeHtml(item.dose || "")}" placeholder="1 tablet" /></label><label>Route<input name="route" value="${escapeHtml(item.route || "")}" placeholder="Oral" /></label><label>Frequency<input name="frequency" value="${escapeHtml(item.frequency || "")}" placeholder="Twice daily" /></label><label>Duration<input name="duration" value="${escapeHtml(item.duration || "")}" placeholder="3 days" /></label><label>Instructions<input name="instructions" value="${escapeHtml(item.instructions || "")}" placeholder="After food" /></label>${removeButton}</div>`).join("");
  const secondary = diagnoses.filter((item) => item.type === "Secondary");
  return `<header class="consultation-context-header"><div><p class="eyebrow">Consultation</p><h2>${escapeHtml(patient?.name || token?.patientName || "Patient")}</h2><p>${escapeHtml(patient?.mrn || token?.mrn || "-")} · ${escapeHtml([patient?.age, patient?.gender].filter(Boolean).join(" / ") || "-")} · ${escapeHtml(token?.department || "-")}</p></div><div class="consultation-context-meta"><strong>${escapeHtml(active.id)}</strong><span>Token ${escapeHtml(token?.tokenNumber || "-")}</span><span>${escapeHtml(active.doctor || currentUser.name || "Doctor")}</span>${badge(locked ? "Completed" : "With Doctor", locked ? "status-active" : "status-in-progress")}</div></header>
  <nav class="consultation-section-nav"><a href="#consultation-summary">Summary</a><a href="#consultation-assessment">Assessment</a><a href="#consultation-diagnosis">Diagnosis</a><a href="#consultation-orders">Orders</a><a href="#consultation-prescription">Prescription</a><a href="#consultation-followup">Follow-Up</a></nav>
  ${locked ? `<section class="notice success consultation-complete-banner"><strong>Consultation Completed</strong><span>Completed ${escapeHtml(formatDateTime(active.completedAt))} by ${escapeHtml(active.doctor || currentUser.name || "Doctor")}.</span></section>` : ""}
  <section class="panel consultation-summary" id="consultation-summary"><div class="panel-head"><div><h3>Patient Summary</h3><p>OPD encounter identifiers</p></div>${badge(locked ? "Completed" : "With Doctor", locked ? "status-active" : "status-in-progress")}</div><div class="mini-grid"><span><strong>${escapeHtml(patient?.name || token?.patientName || "-")}</strong><small>Patient</small></span><span><strong>${escapeHtml(patient?.mrn || token?.mrn || "-")}</strong><small>MRN</small></span><span><strong>${escapeHtml([patient?.age, patient?.gender].filter(Boolean).join(" / ") || "-")}</strong><small>Age / Sex</small></span><span><strong>${escapeHtml(patient?.allergies || patient?.allergy || "None recorded")}</strong><small>Allergies</small></span><span class="id-value"><strong>${escapeHtml(appointment?.appointmentNumber || active.appointmentId || "-")}</strong><small>Appointment${appointment?.appointmentNumber ? ` · ${escapeHtml(active.appointmentId)}` : ""}</small></span><span><strong>${escapeHtml(token?.tokenNumber || "-")}</strong><small>Queue Token</small></span><span><strong>${escapeHtml(token?.department || "-")}</strong><small>Department</small></span><span><strong>${escapeHtml(active.doctor || currentUser.name || "-")}</strong><small>Doctor</small></span><span><strong>${escapeHtml(active.id)}</strong><small>Consultation ID</small></span></div></section>
  <section class="panel"><div class="panel-head"><div><h3>Latest Nurse Vitals</h3><p>Read-only measurements from this appointment.</p></div></div>${latest ? `<div class="mini-grid"><span><strong>${escapeHtml(latest.temperature || "-")}</strong><small>Temperature</small></span><span><strong>${escapeHtml(latest.bloodPressure || "-")}</strong><small>Blood Pressure</small></span><span><strong>${escapeHtml(latest.pulse || "-")}</strong><small>Pulse</small></span><span><strong>${escapeHtml(latest.respiratoryRate || "-")}</strong><small>Respiratory Rate</small></span><span><strong>${escapeHtml(latest.spo2 || "-")}</strong><small>SpO2</small></span><span><strong>${escapeHtml(latest.bloodSugar || "-")}</strong><small>Blood Sugar</small></span><span><strong>${escapeHtml(latest.painScore || "-")}</strong><small>Pain Score</small></span><span><strong>${escapeHtml(latest.symptoms || "-")}</strong><small>Symptoms</small></span><span><strong>${escapeHtml(latest.notes || "-")}</strong><small>Notes</small></span><span><strong>${escapeHtml(latest.recordedBy || "-")}</strong><small>Recorded By</small></span><span><strong>${escapeHtml(formatDateTime(latest.recordedAt || latest.createdAt))}</strong><small>Recorded At</small></span></div>` : emptyState("No encounter vitals found.")}</section>
  <form class="doctor-consultation-form ${locked ? "is-locked" : ""}" data-action="save-consultation-draft"><input type="hidden" name="consultationId" value="${escapeHtml(active.id)}"/><fieldset ${locked ? "disabled" : ""}>
    <section class="panel" id="consultation-assessment"><div class="panel-head"><h3>Clinical Assessment</h3></div><div class="form-grid consultation-clinical-grid"><label>Chief Complaint<input name="chiefComplaint" required value="${escapeHtml(active.chiefComplaint || "")}" /></label><label>History of Present Illness<textarea name="historyOfPresentIllness">${escapeHtml(active.historyOfPresentIllness || "")}</textarea></label><label>Examination<textarea name="examination" required>${escapeHtml(active.examination || "")}</textarea></label><label>Past Medical History<textarea name="pastMedicalHistory">${escapeHtml(active.pastMedicalHistory || "")}</textarea></label><label>Current Medications<textarea name="currentMedications">${escapeHtml(active.currentMedications || "")}</textarea></label><label>Allergies Review<textarea name="allergiesReview">${escapeHtml(active.allergiesReview || patient?.allergies || "")}</textarea></label><label class="span-2 clinical-notes">Clinical Notes<textarea name="notes">${escapeHtml(active.notes || "")}</textarea></label></div></section>
    <section class="panel" id="consultation-diagnosis"><div class="panel-head"><div><h3>Diagnosis</h3><p>Primary diagnosis is required for completion.</p></div>${locked ? "" : `<button class="button tiny soft" type="button" data-action="add-consultation-row" data-row-kind="diagnosis">+ Add Diagnosis</button>`}</div><div class="form-grid"><label>Primary Diagnosis *<input name="diagnosis" data-primary-diagnosis value="${escapeHtml(diagnoses.find((item) => item.type === "Primary")?.diagnosis || "")}" placeholder="Viral fever" /></label><label>Primary Diagnosis Notes<input name="diagnosisNotes" value="${escapeHtml(diagnoses.find((item) => item.type === "Primary")?.notes || "")}" /></label></div><div data-consultation-list="diagnosis">${secondary.map((item) => `<div class="consultation-repeat-row diagnosis-row" data-consultation-row="diagnosis"><label>Secondary Diagnosis<input name="diagnosis" value="${escapeHtml(item.diagnosis || "")}" /></label><label>Notes<input name="diagnosisNotes" value="${escapeHtml(item.notes || "")}" /></label>${removeButton}</div>`).join("")}</div></section>
    <section class="panel" id="consultation-orders"><div class="panel-head"><div><h3>Orders & Investigations</h3><p>Only added orders become clinical records.</p></div></div><label class="check-row"><input type="checkbox" name="noInvestigationRequired" value="Yes" data-no-investigation ${active.noInvestigationRequired ? "checked" : ""}/> No Investigation Required</label><div class="consultation-subhead"><h4>Lab Orders</h4>${locked ? "" : `<button class="button tiny soft" type="button" data-action="add-consultation-row" data-row-kind="lab">+ Add Lab Order</button>`}</div><div data-consultation-list="lab">${orderRows("lab", labOrders, "Lab Test") || `<p class="consultation-empty">No lab orders added.</p>`}</div><div class="consultation-subhead"><h4>Radiology Orders</h4>${locked ? "" : `<button class="button tiny soft" type="button" data-action="add-consultation-row" data-row-kind="radiology">+ Add Radiology Order</button>`}</div><div data-consultation-list="radiology">${orderRows("radiology", radiologyOrders, "Study") || `<p class="consultation-empty">No radiology orders added.</p>`}</div></section>
    <section class="panel" id="consultation-prescription"><div class="panel-head"><div><h3>Prescription</h3><p>One prescription linked to this consultation.</p></div>${locked ? "" : `<button class="button tiny soft" type="button" data-action="add-consultation-row" data-row-kind="medicine">+ Add Medicine</button>`}</div><div data-consultation-list="medicine">${medicineRows || `<p class="consultation-empty">No medicines added.</p>`}</div></section>
    <section class="panel" id="consultation-followup"><div class="panel-head"><h3>Advice & Follow-Up</h3></div><div class="form-grid"><label class="span-2">Doctor Advice<textarea name="advice" placeholder="Rest, hydration, warning signs and return precautions">${escapeHtml(active.advice || "")}</textarea></label><label class="check-row span-2"><input type="checkbox" name="followUpRequired" value="Yes" data-progressive-toggle="followup" ${active.followUpRequired ? "checked" : ""}/> Follow-up Required</label><div class="form-grid span-2 progressive-fields ${active.followUpRequired ? "" : "hidden"}" data-progressive-fields="followup"><label>Follow-up Date<input type="date" name="followUpDate" value="${escapeHtml(active.followUpDate || "")}" /></label><label>Reason<input name="followUpReason" value="${escapeHtml(active.followUpReason || "")}" /></label><label class="span-2">Follow-up Notes<input name="followUpNotes" value="${escapeHtml(active.followUpNotes || "")}" /></label></div></div></section>
    <section class="panel" id="consultation-admission"><div class="panel-head"><h3>Admission Recommendation</h3><p>This does not admit the patient or assign a bed.</p></div><label class="check-row"><input type="checkbox" name="admissionRecommended" value="Yes" data-progressive-toggle="admission" ${active.admissionRecommended ? "checked" : ""}/> Recommend Admission</label><div class="progressive-fields ${active.admissionRecommended ? "" : "hidden"}" data-progressive-fields="admission"><label>Admission Reason *<textarea name="admissionReason">${escapeHtml(active.admissionReason || "")}</textarea></label></div></section>
    ${locked ? "" : `<section class="panel consultation-actions"><div><h3>Consultation Actions</h3><p data-consultation-save-status>Draft autosave ready</p><div class="notice warning hidden" data-consultation-validation role="alert"></div></div><div class="grid-actions"><button class="button soft" type="submit" name="consultationAction" value="draft">Save Draft</button><button class="button primary" type="submit" name="consultationAction" value="complete" data-testid="complete-doctor-consultation">Complete Consultation</button></div></section>`}
    </fieldset>
  </form>`;
}

export function consultationPage() {
  if (["doctor", "surgeon"].includes(String(currentUser.jobRole || "").toLowerCase())) return doctorConsultationDraftPage();
  const patients = safeData(() => api.patients(currentUser));
  const consultations = safeData(() => api.consultations(currentUser));
  const vitals = hasPermission(currentUser, "vitals", "view") ? safeOptionalData(() => api.vitals(currentUser)) : [];
  const labOrders = hasPermission(currentUser, "lab", "view") ? safeOptionalData(() => api.labOrders(currentUser)) : [];
  const pharmacyIssues = hasPermission(currentUser, "pharmacy", "view") ? safeOptionalData(() => api.pharmacyIssues(currentUser)) : [];
  const queue = hasPermission(currentUser, "queue", "view") ? safeOptionalData(() => api.queueTokens(currentUser)) : [];
  const selectedPatient = findPatient(patients);
  const data = deriveOperationalData();
  const doctorQueue = queue.filter((token) => ["Ready for Doctor", "READY_FOR_DOCTOR", "With Doctor"].includes(token.status));
  const availablePatients = queue.length
    ? doctorQueue.map((token) => findPatient(patients, token.patientId) || {
        id: token.patientId,
        name: token.patientName,
        mrn: token.mrn || token.tokenNumber,
        age: token.age,
        gender: token.gender,
        priority: token.priority,
        status: token.status,
        department: token.department,
        doctor: token.doctor,
        waitingMinutes: token.waitingMinutes
      }).filter(Boolean)
    : patients;
  const latestVitals = selectedPatient ? latestForPatient(vitals, selectedPatient.id) : null;
  const journey = selectedPatient ? latestPatientJourneyStage(selectedPatient.id, data) : { completed: ["registered"], current: "appointment", label: "Waiting for Doctor" };
  return `
    ${patientStickyHeader(selectedPatient, selectedPatient ? journey.label : "")}
    ${selectedPatient ? opdJourneyTrackerForPatient(selectedPatient.id, data) : ""}
    ${selectedPatient ? patientTimeline({ completed: [...journey.completed], current: journey.current }) : ""}
    <div class="metric-grid small">
      ${metricCard("Patients visible", patients.length, "Scoped to branch")}
      ${metricCard("Vitals ready", vitals.length, "Doctor review")}
      ${metricCard("Open orders", pendingCount(labOrders, ["Report Ready"]) + pendingCount(pharmacyIssues, ["Issued"]), "Lab / pharmacy")}
    </div>
    ${!selectedPatient ? selectPatientPanel("Select a patient from the doctor queue to start consultation.", availablePatients, "patient-start-consultation") : ""}
    ${hasPermission(currentUser, "consultation", "create") && selectedPatient ? `
      <section class="panel">
        <div class="panel-head"><h3>Doctor consultation</h3><p>Review vitals, add diagnosis, prescribe medicines, order lab tests or scanning, and recommend follow-up.</p></div>
        ${latestVitals ? `<div class="notice subtle">Latest vitals for ${escapeHtml(patientName(patients, latestVitals.patientId))}: BP ${escapeHtml(latestVitals.bloodPressure)}, Pulse ${escapeHtml(latestVitals.pulse)}, SpO2 ${escapeHtml(latestVitals.spo2)}, Symptoms ${escapeHtml(latestVitals.symptoms)}.</div>` : ""}
        <form class="form-grid" data-action="complete-consultation">
          <label>Patient<select name="patientId">${patients.map((patient) => `<option value="${patient.id}" ${String(patient.id) === String(selectedPatient.id) ? "selected" : ""}>${escapeHtml(patientLabel(patient))}</option>`).join("")}</select></label>
          <label>Symptoms<input name="symptoms" placeholder="Chest discomfort" /></label>
          <label>Diagnosis<input name="diagnosis" required data-testid="form-diagnosis" /></label>
          <label>Medicine<input name="medicine" placeholder="Aspirin 75mg" data-testid="form-prescription" /></label>
          <label>Dose<input name="dose" placeholder="75mg" /></label>
          <label>Frequency<input name="frequency" placeholder="Once daily" /></label>
          <label>Duration<input name="duration" placeholder="5 days" /></label>
          <label>Quantity<input name="quantity" type="number" /></label>
          <label>Lab tests<input name="labTests" placeholder="Troponin I, CBC" /></label>
          <label>Scanning / radiology<input name="radiologyTests" placeholder="ECG" data-testid="form-radiology-tests" /></label>
          <label>Procedure request<input name="procedureRequest" placeholder="ECG review" /></label>
          <label>Consultation fee<input name="consultationFee" type="number" /></label>
          <label>Lab charges<input name="labCharges" type="number" /></label>
          <label>Radiology charges<input name="radiologyCharges" type="number" /></label>
          <label>Pharmacy charges<input name="pharmacyAmount" type="number" /></label>
          <label>Admission recommendation<input name="admissionRecommendation" placeholder="Observation if reports abnormal" /></label>
          <label>Follow-up advice<input name="followUpAdvice" placeholder="Review in 3 days with reports" /></label>
          <label class="span-2">Clinical notes<textarea name="notes" placeholder="Vitals reviewed. Ordered ECG and lab test."></textarea></label>
          <button class="button primary" type="submit" data-testid="complete-consultation-button">Save & Send to Billing</button>
        </form>
        <div class="next-actions"><strong>Next action:</strong>
          ${hasPermission(currentUser, "billing", "create") ? `<button class="button tiny soft" type="button" data-route="billing" data-patient-id="${escapeHtml(selectedPatient.id)}">Send to Billing</button>` : ""}
          ${hasPermission(currentUser, "pharmacy", "view") ? `<button class="button tiny soft" type="button" data-route="pharmacy" data-patient-id="${escapeHtml(selectedPatient.id)}">Send to Pharmacy</button>` : ""}
          ${hasPermission(currentUser, "lab", "view") ? `<button class="button tiny soft" type="button" data-route="lab" data-patient-id="${escapeHtml(selectedPatient.id)}">Order Lab</button>` : ""}
          ${hasPermission(currentUser, "followups", "create") ? `<button class="button tiny soft" type="button" data-route="followups" data-patient-id="${escapeHtml(selectedPatient.id)}">Schedule Follow-up</button>` : ""}
        </div>
      </section>
    ` : ""}
    <section class="panel">
      <div class="panel-head"><h3>Consultations</h3><span class="badge status-active">${consultations.length}</span></div>
      ${table(["Patient", "Doctor", "Diagnosis", "Orders", "Follow-up", "Status", "Print"], consultations.map((item) => [
        patientName(patients, item.patientId, item.patientId),
        item.doctor,
        item.diagnosis,
        [item.labTests, item.radiologyTests, item.procedureRequest].filter(Boolean).join(" / "),
        item.followUpAdvice,
        badge(item.status, statusClass(item.status)),
        `${printableButton("print-prescription", item.id, "Prescription", "print-prescription-button")} ${printableButton("print-lab-order", item.id, "Orders", "print-order-button")}`
      ]))}
    </section>
  `;
}

export function labPage() {
  const orders = safeData(() => api.labOrders(currentUser));
  const patients = hasPermission(currentUser, "patients", "view") ? safeOptionalData(() => api.patients(currentUser)) : [];
  const isRadiologyPage = pageFromHash() === "radiology";
  const visibleOrders = isRadiologyPage ? orders.filter((order) => order.orderType === "Radiology") : orders;
  const selectedPatient = findPatient(patients);
  const documentPatientId = selectedPatient?.id || visibleOrders[0]?.patientId || "";
  const reportDocuments = hasPermission(currentUser, "documents", "view")
    ? safeOptionalData(() => api.patientDocuments(currentUser)).filter((doc) => {
        const type = String(doc.documentType || "");
        const matchesType = isRadiologyPage ? type === "radiology-report" : ["lab-report", "radiology-report"].includes(type);
        return matchesType && (!documentPatientId || String(doc.patientId || "") === String(documentPatientId));
      })
    : [];
  return `
    ${patientStickyHeader(selectedPatient, isRadiologyPage ? "Radiology Pending" : "Lab Pending")}
    <div class="metric-grid small">
      ${metricCard("Pending orders", pendingCount(visibleOrders, ["Report Ready"]), "Samples / scans")}
      ${metricCard("Reports ready", visibleOrders.filter((order) => order.status === "Report Ready").length, "Doctor review")}
      ${metricCard("Total visible", visibleOrders.length, isRadiologyPage ? "Radiology" : "Lab / Radiology")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>${isRadiologyPage ? "Radiology / scanning orders" : "Lab / Radiology orders"}</h3><p>Update samples, scans, progress, and report readiness.</p></div>
      ${visibleOrders.length ? table(["Patient", "Type", "Tests / Scan", "Doctor", "Status", "Report", "Action"], visibleOrders.map((order) => [
        patientName(patients, order.patientId, order.patientId),
        order.orderType,
        order.tests,
        order.doctor,
        badge(order.status, statusClass(order.status)),
        order.reportFile || "-",
        `<div class="grid-actions">
          ${hasPermission(currentUser, "lab", "edit") ? `<button class="button tiny" data-action="lab-ready" data-order="${order.id}" data-testid="mark-lab-ready-button">Mark report ready</button>` : ""}
          ${printableButton("print-lab-order", order.id, order.status === "Report Ready" ? "Print report" : "Print order", "print-lab-order-button")}
        </div>`
      ])) : emptyState("No lab/radiology orders are currently assigned. Orders created during consultation will appear here.")}
    </section>
    ${documentPatientId ? documentUploadPanel({
      patientId: documentPatientId,
      relatedModule: isRadiologyPage ? "radiology" : "lab",
      types: [isRadiologyPage ? "radiology-report" : "lab-report"],
      title: isRadiologyPage ? "Upload Radiology Report" : "Upload Lab Report"
    }) : ""}
    <section class="panel">
      <div class="panel-head"><h3>${isRadiologyPage ? "Radiology Documents" : "Lab Documents"}</h3></div>
      ${documentTable(reportDocuments)}
    </section>
  `;
}

export function pharmacyPage() {
  const issues = api.pharmacyIssues(currentUser);
  const stocks = api.medicineStocks(currentUser);
  const lowStock = stocks.filter((stock) => Number(stock.quantityAvailable || 0) <= Number(stock.reorderLevel || 0));
  return `
    <div class="metric-grid small">
      ${metricCard("Pending Prescriptions", issues.filter((issue) => issue.status !== "Issued").length, "Need issue")}
      ${metricCard("Issued Today", issues.filter((issue) => issue.status === "Issued").length, "Completed")}
      ${metricCard("Low Stock", lowStock.length, "Needs refill")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Pharmacy</h3><p>Issue prescribed medicines, track availability, and surface low-stock alerts.</p></div>
      ${table(["Patient", "Medicines", "Amount", "Status", "Action"], issues.map((issue) => [
        issue.patientName,
        issue.medicines,
        `Rs. ${money(issue.amount)}`,
        badge(issue.status, statusClass(issue.status)),
        issue.status === "Issued" ? "Done" : `<div class="grid-actions">
          ${printableButton("print-prescription", issue.prescriptionId || issue.id, "Print Rx", "print-pharmacy-prescription-button")}
          ${hasPermission(currentUser, "pharmacy", "edit") ? `<button class="button tiny" data-action="issue-pharmacy" data-issue="${issue.id}" data-testid="issue-medicine-button">Issue medicines</button>` : ""}
          ${stocks.some((stock) => stock.medicine === issue.medicines && stock.quantityAvailable > 0) ? "" : hasPermission(currentUser, "stock", "create") ? `<button class="button tiny soft" data-action="open-create" data-form-action="add-stock" data-testid="add-stock-now-button">Add Stock Now</button>` : `<span class="muted">Please contact Branch Admin or Pharmacy Manager to add stock.</span>`}
        </div>`
      ]))}
    </section>
  `;
}

export function billingPage() {
  const bills = api.bills(currentUser);
  const data = deriveOperationalData();
  const pending = bills.filter((bill) => bill.status !== "Paid");
  const paid = bills.filter((bill) => bill.status === "Paid");
  const todayPaidBills = bills.filter((bill) => isBillPaidToday(bill));
  const billingPatientId = selectedPatientId || bills[0]?.patientId || "";
  const billingDocuments = hasPermission(currentUser, "documents", "view")
    ? safeOptionalData(() => api.patientDocuments(currentUser)).filter((doc) => doc.documentType === "billing-document" && (!billingPatientId || String(doc.patientId || "") === String(billingPatientId)))
    : [];
  return `
    <div class="metric-grid small">
      ${metricCard("Pending Bills", pending.length, "Needs payment")}
      ${metricCard("Paid Bills", paid.length, "Receipts ready")}
      ${metricCard("Daily Collection", `Rs. ${money(todayPaidBills.reduce((sum, bill) => sum + billPaidAmount(bill), 0))}`, "Collected")}
    </div>
    ${smartBillingDraftPanel(data)}
    <section class="panel">
      <div class="panel-head">
        <div><h3>Billing</h3><p>Generate bills, collect payments, handle insurance, and print receipts.</p></div>
        ${hasPermission(currentUser, "billing", "create") ? `<button class="button small soft" type="button" data-action="open-create" data-form-action="generate-bill" data-testid="generate-bill-button">Generate Bill</button>` : ""}
      </div>
      ${table(["Patient", "Items", "Payment", "Total", "Paid", "Status", "Action"], bills.map((bill) => [
        rowRouteButton(bill.patientName || "Patient", "billing", { patientId: bill.patientId }),
        bill.items,
        bill.paymentType,
        currencyDisplay(firstDefined(bill.totalAmount, bill.total, bill.amount, bill.billAmount, bill.netAmount, bill.grossAmount), { fallbackReason: "Billing amount is pending review." }),
        currencyDisplay(firstDefined(bill.paidAmount, bill.paid, bill.amountPaid, bill.collectedAmount, bill.receivedAmount, bill.amountReceived, bill.paymentReceived), { fallbackReason: "No payment has been recorded yet." }),
        badge(bill.status, statusClass(bill.status)),
        `<div class="grid-actions">
          ${hasPermission(currentUser, "billing", "edit") && bill.status !== "Paid" ? `<button class="button tiny" data-action="collect-payment" data-bill="${bill.id}" data-testid="collect-payment-button">Collect payment</button>` : ""}
          ${hasPermission(currentUser, "billing", "edit") && bill.status !== "Paid" ? `<button class="button tiny soft" data-action="pay-online" data-bill="${bill.id}" data-testid="pay-online-button">Pay online</button>` : ""}
          ${printableButton("print-bill", bill.id, bill.status === "Paid" ? "Print receipt" : "Print bill", "print-bill-button")}
        </div>`
      ]).map((cells, index) => ({
        cells,
        attrs: {
          "data-route": "billing",
          "data-patient-id": bills[index]?.patientId || "",
          role: "button",
          tabindex: "0"
        }
      })))}
    </section>
    ${billingDocuments.length ? `<section class="panel">
      <div class="panel-head"><h3>Billing Documents</h3><p>Billing-linked files are managed in Documents and shown here only when already uploaded.</p></div>
      ${documentTable(billingDocuments)}
    </section>` : ""}
  `;
}

export function checkoutPage() {
  const checkouts = api.checkouts(currentUser);
  return `
    ${journeyTracker(["Consultation Complete", "Lab Clear", "Pharmacy Clear", "Billing Paid", "Follow-up", "Checkout"], checkouts.some((item) => item.status === "Completed") ? 5 : 3, "Checkout readiness")}
    <section class="panel">
      <div class="panel-head"><h3>Patient checkout</h3><p>Clear lab, pharmacy, billing, follow-up, and feedback before closing the visit.</p></div>
      ${table(["Patient", "Pending Items", "Follow-up", "Feedback", "Status", "Action"], checkouts.map((checkout) => [
        checkout.patientName,
        checkout.pendingItems,
        checkout.followUpBooked ? "Booked" : "Pending",
        checkout.feedback,
        badge(checkout.status, statusClass(checkout.status)),
        hasPermission(currentUser, "checkout", "edit") && checkout.status !== "Completed" ? `<button class="button tiny" data-action="complete-checkout" data-checkout="${checkout.id}" data-testid="checkout-patient-button">Complete checkout</button>` : "Closed"
      ]))}
    </section>
  `;
}

export function followUpsPage() {
  const patients = api.patients(currentUser);
  const followUps = api.followUps(currentUser);
  return `
    ${hasPermission(currentUser, "followups", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>Book follow-up</h3></div>
        <form class="form-grid" data-action="book-followup">
          <label>Patient<select name="patientId">${patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patientLabel(patient))}</option>`).join("")}</select></label>
          <label>Doctor<input name="doctor" value="" /></label>
          <label>Department<input name="department" value="" /></label>
          <label>Date<input name="date" type="date" value="${localDateInputValue(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))}" /></label>
          <label>Reason<input name="reason" required placeholder="Review lab and ECG reports" /></label>
          <label class="span-2">Instructions<textarea name="instructions" placeholder="Bring all reports and continue medicines."></textarea></label>
          <button class="button primary" type="submit">Book follow-up</button>
        </form>
      </section>
    ` : ""}
    <section class="panel">
      <div class="panel-head"><h3>Follow-ups</h3><span class="badge status-active">${followUps.length}</span></div>
      ${table(["Patient", "Doctor", "Department", "Date", "Reason", "Reminder", "Status"], followUps.map((item) => [
        item.patientName,
        item.doctor,
        item.department,
        item.date,
        item.reason,
        item.reminderStatus,
        badge(item.status, statusClass(item.status))
      ]))}
    </section>
  `;
}

export function admissionsPage() {
  const admissions = api.admissions(currentUser);
  const admissionRecommendations = safeOptionalData(() => api.admissionRecommendations(currentUser), []);
  const patients = api.patients(currentUser);
  const beds = api.beds(currentUser);
  const deathSummaries = hasPermission(currentUser, "deathSummary", "view") ? safeOptionalData(() => api.deathSummaries(currentUser)) : [];
  const availableBeds = beds.filter((bed) => bed.status === "Available");
  const query = admissionSearchQuery.trim().toLowerCase();
  const visibleAdmissions = admissions
    .filter((item) => !currentUser.branchId || !item.branchId || String(item.branchId) === String(currentUser.branchId))
    .filter((item) => admissionStatusFilter === "All" || (item.admissionStatus || item.status) === admissionStatusFilter)
    .filter((item) => !query || `${item.patientName || ""} ${item.mrn || ""} ${item.id || ""} ${item.mobile || ""} ${item.ward || ""} ${item.bedNumber || item.bedId || ""}`.toLowerCase().includes(query));
  const today = new Date().toISOString().slice(0, 10);
  return `
    ${journeyTracker(["Admission", "Bed Assigned", "Daily Care", "Doctor / Nursing Notes", "Medication", "Clearance", "Discharge", "Bed Cleaning"], 1, "IPD journey")}
    ${admissionRecommendations.length ? `<section class="panel"><div class="panel-head"><div><h3>Doctor Admission Recommendations</h3><p>Clinical recommendations only. Ward and bed remain unassigned until Reception creates an admission request.</p></div>${badge(admissionRecommendations.length, "status-warning")}</div>${table(["Patient", "Appointment", "Consultation", "Doctor", "Reason", "Status"], admissionRecommendations.map((item) => [patientName(patients, item.patientId, item.patientId), item.appointmentId, item.consultationId, item.doctor, item.reason || "-", badge(item.status, "status-warning")]))}</section>` : ""}
    ${hasPermission(currentUser, "admissions", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>+ New Admission</h3><p>Create an inpatient request from an existing patient record.</p></div>
        <form class="form-grid" data-action="create-admission">
          <label>Patient<select name="patientId" required>${patients.map(patientOption).join("")}</select></label>
          <label>Admitting doctor<input name="admittingDoctor" value="" /></label>
          <label>Department<input name="department" value="" data-testid="form-department" /></label>
          <label>Reason for admission<input name="reason" required /></label>
          <label>Admission type<select name="admissionType"><option>Emergency</option><option>Planned</option><option>Transfer</option><option>Day Care</option></select></label>
          <label>Priority<select name="priority"><option>Normal</option><option>Urgent</option><option>Emergency</option></select></label>
          <label>Admission date/time<input name="admissionDateTime" type="datetime-local" /></label>
          <label>Preferred ward<input name="requestedWard" placeholder="Optional" /></label>
          <label>Preferred bed<input name="requestedBed" placeholder="Optional" /></label>
          <label class="span-2">Notes<textarea name="notes"></textarea></label>
          <button class="button primary" type="submit" data-testid="create-admission-button">Create admission request</button>
        </form>
      </section>
    ` : ""}
    <div class="metric-grid small">
      ${metricCard("Pending Admission", admissions.filter((a) => (a.admissionStatus || a.status) === "Admission Requested").length, "Requests")}
      ${metricCard("Awaiting Bed", admissions.filter((a) => ["Awaiting Bed", "Bed Assigned"].includes(a.admissionStatus || a.status)).length, "Placement")}
      ${metricCard("Admitted Today", admissions.filter((a) => String(a.admittedAt || "").startsWith(today)).length, "Today")}
      ${metricCard("Active Admissions", admissions.filter((a) => ["Admitted", "Under Treatment"].includes(a.admissionStatus || a.status)).length, "Nursing handoff")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Admissions</h3><p>Manage inpatient admission requests and bed assignment.</p></div>
      <input class="panel-search" data-admission-search type="search" placeholder="Search patient, MRN, admission ID, mobile, ward or bed" value="${escapeHtml(admissionSearchQuery)}" />
      <div class="chip-row">${["All", "Admission Requested", "Awaiting Bed", "Admitted", "Under Treatment", "Discharged"].map((value) => `<button type="button" class="chip ${admissionStatusFilter === value ? "active" : ""}" data-admission-filter="${value}">${value}</button>`).join("")}</div>
      ${table(["Admission ID", "Patient", "MRN", "Department", "Doctor", "Ward", "Bed", "Status", "Admission Time", "Action"], visibleAdmissions.map((item) => [
        item.id,
        patients.find((patient) => String(patient.id) === String(item.patientId))?.name || item.patientName || "Unknown Patient",
        patients.find((patient) => String(patient.id) === String(item.patientId))?.mrn || item.mrn || "MRN unavailable",
        item.department,
        item.admittingDoctor || item.requestedBy,
        item.ward || "-",
        item.bedNumber || item.bedId || "-",
        badge(item.admissionStatus || item.status, statusClass(item.admissionStatus || item.status)),
        formatDateTime(item.admittedAt || item.admissionDateTime || item.createdAt),
        ["Admission Requested", "Awaiting Bed"].includes(item.admissionStatus || item.status)
          ? `<button class="button tiny" data-action="manage-admission" data-admission="${item.id}">Assign Ward / Bed</button>`
          : (item.admissionStatus || item.status) === "Bed Assigned"
            ? `<button class="button tiny primary" data-action="admit-patient" data-admission="${item.id}" ${item.patientId && item.ward && (item.bedId || item.bedNumber) ? "" : "disabled"}>Admit Patient</button>`
            : `<button class="button tiny soft" data-route="admissions" data-admission-id="${escapeHtml(item.id)}">View Admission</button>`
      ]))}
    </section>
  `;
}

export function emergencyPage() {
  const cases = api.emergencyCases(currentUser);
  const deathSummaries = hasPermission(currentUser, "deathSummary", "view") ? safeOptionalData(() => api.deathSummaries(currentUser)) : [];
  return `
    ${emergencyOneScreenPanel(cases)}
    ${priorityCards([
      ["Critical", cases.filter((c) => c.priority === "Critical").length, "Immediate response"],
      ["High", cases.filter((c) => c.priority === "High").length, "Doctor assigned"],
      ["Medium", cases.filter((c) => c.priority === "Medium").length, "Observation"],
      ["Low", cases.filter((c) => c.priority === "Low").length, "Stable"]
    ])}
    ${hasPermission(currentUser, "emergency", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>Emergency quick registration</h3><p>Emergency patients bypass normal OPD queue. Capture essentials first, complete documents and billing later.</p></div>
        <form class="form-grid" data-action="create-emergency">
          <label>Patient name<input name="patientName" value="Unknown Patient" /></label>
          <label>Mobile<input name="mobile" value="Unknown" /></label>
          <label>Age<input name="age" type="number" value="0" /></label>
          <label>Triage<select name="triageCategory"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
          <label>Priority<select name="priority"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
          <label>Doctor<input name="doctorAssigned" value="" /></label>
          <label>Nurse<input name="nurseAssigned" placeholder="Assigned nurse" /></label>
          <label>Decision<select name="decision"><option>OPD</option><option>IPD</option><option>ICU</option><option>Transfer</option><option>Discharge</option></select></label>
          <label>Response minutes<input name="responseMinutes" type="number" /></label>
          <label class="span-2">Treatment notes<textarea name="treatmentNotes" placeholder="Treatment started immediately."></textarea></label>
          <label class="span-2">Vitals<textarea name="vitals" required placeholder="BP, SpO2, and other captured vitals"></textarea></label>
          <button class="button primary" type="submit" data-testid="create-emergency-case-button">Create emergency case</button>
        </form>
      </section>
    ` : ""}
    <div class="metric-grid">
      ${metricCard("Arrivals Today", cases.length, "Emergency")}
      ${metricCard("Critical", cases.filter((c) => c.priority === "Critical").length, "Now")}
      ${metricCard("Observation", cases.filter((c) => c.status === "Under Observation").length, "Patients")}
      ${metricCard("Admissions", cases.filter((c) => c.decision === "IPD" || c.decision === "ICU").length, "Requests")}
      ${metricCard("Transfers", cases.filter((c) => c.decision === "Transfer").length, "Today")}
      ${metricCard("Avg Response", `${Math.round(cases.reduce((s, c) => s + c.responseMinutes, 0) / Math.max(cases.length, 1))} min`, "Emergency")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Emergency cases</h3><p>Triage, treatment status, and admission or transfer decisions.</p></div>
      ${table(["EMR", "Patient", "Triage", "Doctor", "Nurse", "Decision", "Billing", "Status", "Action"], cases.map((item) => [
        item.emergencyMrn,
        item.patientName,
        badge(item.triageCategory, riskClass(item.triageCategory)),
        item.doctorAssigned,
        item.nurseAssigned,
        item.decision,
        item.billingStatus,
        badge(item.status, statusClass(item.status)),
        deathSummaryButton(item, deathSummaries) || "Open"
      ]))}
    </section>
  `;
}

export function documentsPage() {
  const docs = api.patientDocuments(currentUser);
  const consents = api.consentForms(currentUser);
  const patients = api.patients(currentUser);
  const admissions = hasPermission(currentUser, "admissions", "view") ? safeOptionalData(() => api.admissions(currentUser)) : [];
  const bills = hasPermission(currentUser, "billing", "view") ? safeOptionalData(() => api.bills(currentUser)) : [];
  const labOrders = hasPermission(currentUser, "lab", "view") ? safeOptionalData(() => api.labOrders(currentUser)) : [];
  const deathSummaries = hasPermission(currentUser, "deathSummary", "view") ? safeOptionalData(() => api.deathSummaries(currentUser)) : [];
  const selectedPatient = patients.find((patient) => String(patient.id) === String(selectedPatientId)) || patients[0] || {};
  const selectedAdmission = admissions.find((admission) => String(admissionPatientId(admission)) === String(selectedPatient.id)) || admissions[0] || null;
  const scopedDocs = docs.filter((doc) => !selectedPatient.id || String(doc.patientId || "") === String(selectedPatient.id) || String(doc.admissionId || "") === String(admissionDisplayId(selectedAdmission || {})));
  return `
    <section class="panel">
      <div class="panel-head"><h3>Storage Status</h3><p>Document uploads stay disabled until secure storage is configured.</p></div>
      ${(() => {
        const storage = fileStorageStatus();
        return `
          <div class="provider-card">
            <div><strong>${escapeHtml(storage.provider === "r2" ? "Cloudflare R2" : titleCase(storage.provider || "storage"))}</strong><small>${escapeHtml(storage.message || "Storage status unavailable.")}</small></div>
            ${badge(storage.configured ? "Configured" : "Storage not configured", storage.configured ? "status-active" : "status-draft")}
          </div>
          ${!storage.configured ? `<div class="notice subtle"><strong>Upload disabled until configured.</strong>${Array.isArray(storage.missing) && storage.missing.length ? `<div class="env-chip-row">${storage.missing.map((item) => `<span class="file-chip">${escapeHtml(item)}</span>`).join("")}</div>` : ""}</div>` : ""}
        `;
      })()}
    </section>
    <section class="panel">
      <div class="panel-head"><h3>Document Storage</h3></div>
      ${(() => {
        const storage = fileStorageStatus();
        return table(["Provider", "Status", "Limit"], [["Cloudflare R2", badge(storage.status || "Not configured", storage.configured ? "status-active" : "status-draft"), `${storage.maxUploadMb || 10} MB`]]);
      })()}
    </section>
    ${documentAlertsPanel(missingDocumentAlerts({
      documents: scopedDocs,
      admission: selectedAdmission,
      patient: selectedPatient,
      deathSummary: deathSummaries.find((summary) => String(summary.admissionId) === String(admissionDisplayId(selectedAdmission || {}))),
      labOrders: labOrders.filter((order) => !selectedPatient.id || String(order.patientId) === String(selectedPatient.id)),
      bills: bills.filter((bill) => !selectedPatient.id || String(bill.patientId) === String(selectedPatient.id))
    }))}
    ${patients.length ? documentUploadPanel({ patientId: patients[0]?.id || "", relatedModule: "documents", title: "Upload Patient Document" }) : emptyState("No patients are visible for document upload. Register or select a patient first.")}
    ${hasPermission(currentUser, "documents", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>Create consent</h3></div>
        <form class="form-grid subsection" data-action="create-consent">
          <label>Patient<select name="patientId">${patients.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}</select></label>
          <label>Patient name<input name="patientName" value="" /></label>
          <label>Consent type<input name="consentType" required placeholder="High-risk consent" /></label>
          <label>Attendant<input name="attendantName" value="" /></label>
          <label>Relationship<input name="relationship" required placeholder="Spouse" /></label>
          <label>Doctor<input name="doctorName" value="" /></label>
          <label>Procedure<input name="procedureName" required placeholder="Observation care" /></label>
          <label>Witness<input name="witnessName" value="" /></label>
          <label class="span-2">Risk explanation<textarea name="riskExplanation" required placeholder="Clinical risk explained to attendant."></textarea></label>
          <label class="span-2">Consent text<textarea name="consentText" required placeholder="Patient/attendant agrees to treatment."></textarea></label>
          <button class="button primary" type="submit">Create consent</button>
        </form>
      </section>
    ` : ""}
    <section class="panel">
      <div class="panel-head"><h3>Documents</h3></div>
      ${documentTable(docs)}
    </section>
    <section class="panel">
      <div class="panel-head"><h3>Consent forms</h3></div>
      ${table(["Type", "Patient", "Attendant", "Doctor", "Procedure", "Witness", "Status"], consents.map((item) => [
        item.consentType,
        item.patientName,
        item.attendantName,
        item.doctorName,
        item.procedureName,
        item.witnessName,
        badge(item.status, statusClass(item.status))
      ]))}
    </section>
  `;
}

export function radiologyPage() {
  const orders = safeOptionalData(() => api.radiologyOrders(currentUser), []);
  const canEdit = hasPermission(currentUser, "radiology", "edit");
  const NEXT = {
    "Ordered": ["Scheduled", "Schedule"],
    "Scheduled": ["Performed", "Mark Performed"],
    "Performed": ["Reported", "Add Report"],
    "Reported": ["Verified", "Verify"]
  };
  const count = (s) => orders.filter((o) => (o.status || "Ordered") === s).length;
  const kpis = [
    ["Ordered", count("Ordered")],
    ["Scheduled", count("Scheduled")],
    ["Performed", count("Performed")],
    ["Reported", count("Reported")],
    ["Verified", count("Verified")]
  ];
  const rows = orders
    .slice()
    .sort((a, b) => `${b.createdAt || ""}`.localeCompare(`${a.createdAt || ""}`))
    .map((o) => {
      const status = o.status || "Ordered";
      const next = NEXT[status];
      const actions = `<div class="grid-actions">${
        canEdit && next ? `<button class="button tiny primary" type="button" data-action="rad-advance" data-rad="${escapeHtml(o.id)}" data-status="${escapeHtml(next[0])}" data-impression="${escapeHtml(o.impression || "")}">${escapeHtml(next[1])}</button>` : ""
      }${
        canEdit && !["Reported", "Verified", "Cancelled"].includes(status) ? `<button class="button tiny danger" type="button" data-action="rad-cancel" data-rad="${escapeHtml(o.id)}">Cancel</button>` : ""
      }</div>`;
      return [
        `<strong>${escapeHtml(o.radOrderNumber || "")}</strong>`,
        escapeHtml(o.patientName || "") + (o.mrn ? `<br><small>${escapeHtml(o.mrn)}</small>` : ""),
        `${escapeHtml(o.modality || "")}${o.studyType ? `<br><small>${escapeHtml(o.studyType)}</small>` : ""}`,
        escapeHtml(o.bodyPart || "—"),
        badge(o.priority || "Routine", (o.priority === "STAT" ? "status-inactive" : o.priority === "Urgent" ? "status-pending" : "status-active")),
        o.impression ? `<small>${escapeHtml(String(o.impression).slice(0, 60))}</small>` : "—",
        badge(status, statusClass(status)),
        actions
      ];
    });
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Radiology (RIS)</h3><p>Imaging orders, scheduling, and radiologist reporting with verification.</p></div>
        <div class="button-row">${hasPermission(currentUser, "radiology", "create") ? gridAddButton("Imaging", "order-radiology") : ""}</div>
      </div>
      <div class="metric-grid small">
        ${kpis.map(([label, n]) => metricCard(label, String(n), "Imaging")).join("")}
      </div>
      ${orders.length
        ? table(["Order #", "Patient", "Modality / study", "Region", "Priority", "Impression", "Status", "Actions"], rows)
        : emptyState("No imaging orders yet. Use Add Imaging to raise a radiology order.")}
    </section>
  `;
}

export function emrPage() {
  const patients = safeOptionalData(() => api.patients(currentUser), []);
  const TYPE_ICON = { Appointment: "📅", Vitals: "🩺", Consultation: "👨‍⚕️", Lab: "🧪", Radiology: "🩻", Prescription: "💊", Billing: "🧾", Admission: "🏥", Surgery: "🔪", Discharge: "🚪", "Death Summary": "📋" };
  if (!selectedPatientId) {
    const q = (globalSearchQuery || "").toLowerCase();
    const list = patients
      .filter((p) => !q || `${p.name || p.fullName || ""} ${p.mrn || ""} ${p.mobile || p.mobileNumber || ""}`.toLowerCase().includes(q))
      .slice(0, 100)
      .map((p) => [
        escapeHtml(p.mrn || "—"),
        escapeHtml(p.name || p.fullName || ""),
        `${escapeHtml(String(p.age || "—"))} / ${escapeHtml(p.gender || "—")}`,
        escapeHtml(p.mobile || p.mobileNumber || "—"),
        `<button class="button tiny primary" type="button" data-action="emr-select" data-patient="${escapeHtml(p.id)}">Open EMR</button>`
      ]);
    return `
      <section class="panel">
        <div class="panel-head"><div><h3>EMR / EHR</h3><p>Select a patient to open their consolidated medical record across OPD, IPD, lab, radiology, pharmacy, billing, surgery and more.</p></div></div>
        ${patients.length
          ? table(["MRN", "Patient", "Age / Sex", "Mobile", ""], list)
          : emptyState("No patients found in your scope yet.")}
      </section>
    `;
  }
  const emr = safeOptionalData(() => api.patientEmr(currentUser, selectedPatientId), null);
  if (!emr) {
    return `<section class="panel"><div class="panel-head"><div><h3>EMR / EHR</h3><p>Loading patient record…</p></div><div class="button-row"><button class="button soft" type="button" data-action="emr-clear">← Patient list</button></div></div>${emptyState("Preparing the consolidated record…")}</section>`;
  }
  const p = emr.patient || {};
  const s = emr.summary || {};
  const lv = s.latestVitals;
  const timeline = (emr.timeline || []).map((e) => `
    <div class="emr-event">
      <div class="emr-event-icon">${TYPE_ICON[e.type] || "•"}</div>
      <div class="emr-event-body">
        <div class="emr-event-head"><strong>${escapeHtml(e.title)}</strong><span>${escapeHtml(formatDateTime(e.at))}</span></div>
        ${e.detail ? `<p>${escapeHtml(e.detail)}</p>` : ""}
        <small>${escapeHtml(e.type)}</small>
      </div>
    </div>`).join("");
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>EMR / EHR — ${escapeHtml(p.name || p.fullName || "Patient")}</h3><p>Consolidated longitudinal medical record.</p></div>
        <div class="button-row"><button class="button soft" type="button" data-action="emr-clear">← Patient list</button></div>
      </div>
      <div class="metric-grid small">
        ${metricCard("MRN", escapeHtml(String(s.mrn || "—")), "Identifier")}
        ${metricCard("Age / Sex", `${escapeHtml(String(s.age || "—"))} / ${escapeHtml(s.gender || "—")}`, "Demographics")}
        ${metricCard("Encounters", String(s.encounters || 0), "Across all modules")}
        ${metricCard("Admissions", String(s.admissions || 0), "IPD episodes")}
      </div>
      <div class="emr-banner">
        <span><strong>Allergies:</strong> ${escapeHtml(String(s.allergies || "None recorded"))}</span>
        <span><strong>Blood group:</strong> ${escapeHtml(String(s.bloodGroup || "—"))}</span>
        ${lv ? `<span><strong>Latest vitals:</strong> ${escapeHtml([lv.bp && `BP ${lv.bp}`, lv.pulse && `Pulse ${lv.pulse}`, lv.spo2 && `SpO2 ${lv.spo2}`].filter(Boolean).join(", ") || "—")}</span>` : ""}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><div><h3>Clinical timeline</h3><p>${escapeHtml(String((emr.timeline || []).length))} events, most recent first.</p></div></div>
      ${timeline ? `<div class="emr-timeline">${timeline}</div>` : emptyState("No clinical events recorded for this patient yet.")}
    </section>
  `;
}
