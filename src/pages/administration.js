let __dataRenderScheduled, accessDeniedPanel, accessReviewTarget, actionIcon, addButtonTestId, admissionBedLabel, admissionDisplayId, admissionPatientId, admissionWardLabel, allAssignablePages, allowedCreatorRoleOptions, animateCountUps, api, app, applyUserRolePreset, appointmentDepartmentOptions, appointmentDoctorOptions, asArray, attentionPanel, auditSearchQuery, authFrame, automationAlerts, automationAlertsPanel, automationList, automationSettingsCache, automationSettingsCacheUserId, automationSettingsForScope, badge, billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, branchDepartmentOptions, branchUserPermissionBuilder, canAccessPage, canonicalRecordId, careCommandStrip, checklistPanel, clickLoadingActions, cloneUserOptions, COLLECTION_MODULES, collectionRows, collectSetupStepValues, comparisonTable, createForm, createModal, createTarget, currencyDisplay, currencyValue, currentPageTitle, currentUser, dashboardPage, dateSeriesFromRows, deathSummaryButton, deathSummaryChecklistPanel, deathSummaryForAdmission, deathSummaryForm, deathSummaryPage, deathSummaryPreview, deathSummarySection, delayLabel, deleteModal, deleteTarget, deriveBillingSuggestions, deriveNotifications, deriveOperationalData, deriveTasks, dischargeChecklistPanel, documentActions, documentAlertsPanel, documentTable, documentTypeOptions, documentUploadPanel, downloadBase64File, draftKeyFor, draftTimers, editableEntries, editFieldControl, editFieldLabel, editModal, editTarget, emergencyOneScreenPanel, emptyState, enhanceDraftAreas, enhancePasswordHints, environmentLabel, escapeAttribute, escapeHtml, exportCsv, exportExcel, fileStorageStatus, fillAppointmentFromPatient, filterAppointmentDoctors, filterByAdmission, financeSummaryFromBills, findAdmissionForPlan, findPatient, findPatientForDischarge, firstDefined, formatAuditValue, formatDateTime, formatGb, formValues, getApiMode, globalSearchActiveIndex, globalSearchError, globalSearchQuery, globalSearchStatus, globalSearchSuggestions, globalSearchTimer, goLiveChecklistCache, goLiveChecklistCacheUserId, goLiveChecklistForScope, gridActions, gridAddButton, groupSearchResults, hasPermission, iconLabel, inferredSetupProgress, initFrontendSentry, ipd360Button, ipd360Tabs, ipdAdmissionChecklistPanel, ipdAdmissionStatus, ipdHeader, ipdJourneyTracker, ipdNextActions, ipdTimelineEvents, ipdTimelinePanel, isAuthError, isBillPaidToday, isDeathOutcome, isPendingStatus, isToday, isUnauthorizedError, jobRoleOptions, journeyTracker, latestForPatient, latestPatientJourneyStage, latestRecord, livePatientFlowBoard, loadingLabel, loadingLabels, localDateInputValue, localDateKey, localFrontendMode, MASTER_MODULES, medicineField, mergeNotifications, metricCard, metricTrend, minutesSince, missingDocumentAlerts, modalSubmitTestId, money, NAV_BY_ROLE, navGroupLabel, navIcon, normalizeBranchAdminCreateUserForm, normalizeDashboardData, normalizeEditValues, normalizePageKey, normalizeSetupStep, notificationGroup, notificationsDrawerOpen, OPD_JOURNEY_STEPS, opdCheckoutChecklistPanel, opdJourneyTrackerForPatient, PAGE_TITLE_FALLBACK, pageErrorPanel, pageFromHash, pageSkeleton, parseCsv, parseHashRoute, passwordField, passwordPolicyHint, passwordPolicyState, patientActions, patientAppointmentsPage, patientBillsPage, patientCardGrid, patientDashboardPage, patientDocumentsPage, patientJourneyTimelinePanel, patientLabel, patientName, patientOption, patientPortalShell, patientRiskIndicator, patientStickyHeader, patientTimeline, pendingCount, pendingUpload, permissionMatrix, permissionMatrixRows, permissionRiskAlerts, permissionRiskPanel, permissionTemplateOptions, permitted, printableButton, priorityCards, providerStatusGrid, publicBookingConfirmation, publicBookingLinkBlock, publicBookingPage, queueDelayAlerts, queueDelayPanel, quickActionsPanel, readFileAsDataUrl, readFileAsText, recordTime, render, renderAuth, renderedPageKey, renderMustChangePasswordGate, renderNotificationsDrawer, renderPage, renderPatientPortal, renderPublicBooking, renderShell, resolveDischargePatient, resolveMedicationName, riskClass, riskSummary, roleDashboardPanel, roleLabels, ROLES, roleSmartCards, roleWorkQueue, routeKey, rowRouteButton, runGlobalSearch, safeAiAssistantPanel, safeData, safeMrn, safeOptionalData, safeRenderPage, sameId, sampleCsv, scheduleDataRender, scheduleDraftSave, scopeDescription, searchFilterBar, searchResultRoute, selectedPatientId, selectedPermissionPages, selectPatientPanel, SENSITIVE_USER_PERMISSIONS, sensitivePermissionList, setPage, setPermissionPages, SETUP_STEP_ALIASES, SETUP_WIZARD_STEPS, setupPercent, setupProgressSummary, severityForDelay, shouldStagePage, simpleOpsPage, skeletonLine, skeletonMetricCards, skeletonTable, smartBillingDraftPanel, stagedPageKey, stagedPageTimer, startButtonLoading, startFormLoading, statusClass, stopButtonLoading, stopFormLoading, strongPassword, table, taskStatus, TEXT_TEMPLATES, titleCase, toast, toNumber, topSearchAutocomplete, trendChart, unauthorizedPage, uniquePages, updatePermissionBuilder, uploadValidation, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, userAccessDetail, userAccessPreview, userInitials, userPageCheckboxGroups, validateRows, warmDataCache;

export function configurePageRenderers(context) {
  ({ __dataRenderScheduled, accessDeniedPanel, accessReviewTarget, actionIcon, addButtonTestId, admissionBedLabel, admissionDisplayId, admissionPatientId, admissionWardLabel, allAssignablePages, allowedCreatorRoleOptions, animateCountUps, api, app, applyUserRolePreset, appointmentDepartmentOptions, appointmentDoctorOptions, asArray, attentionPanel, auditSearchQuery, authFrame, automationAlerts, automationAlertsPanel, automationList, automationSettingsCache, automationSettingsCacheUserId, automationSettingsForScope, badge, billBalanceAmount, billPaidAmount, billPaymentTimestamp, billTotalAmount, branchDepartmentOptions, branchUserPermissionBuilder, canAccessPage, canonicalRecordId, careCommandStrip, checklistPanel, clickLoadingActions, cloneUserOptions, COLLECTION_MODULES, collectionRows, collectSetupStepValues, comparisonTable, createForm, createModal, createTarget, currencyDisplay, currencyValue, currentPageTitle, currentUser, dashboardPage, dateSeriesFromRows, deathSummaryButton, deathSummaryChecklistPanel, deathSummaryForAdmission, deathSummaryForm, deathSummaryPage, deathSummaryPreview, deathSummarySection, delayLabel, deleteModal, deleteTarget, deriveBillingSuggestions, deriveNotifications, deriveOperationalData, deriveTasks, dischargeChecklistPanel, documentActions, documentAlertsPanel, documentTable, documentTypeOptions, documentUploadPanel, downloadBase64File, draftKeyFor, draftTimers, editableEntries, editFieldControl, editFieldLabel, editModal, editTarget, emergencyOneScreenPanel, emptyState, enhanceDraftAreas, enhancePasswordHints, environmentLabel, escapeAttribute, escapeHtml, exportCsv, exportExcel, fileStorageStatus, fillAppointmentFromPatient, filterAppointmentDoctors, filterByAdmission, financeSummaryFromBills, findAdmissionForPlan, findPatient, findPatientForDischarge, firstDefined, formatAuditValue, formatDateTime, formatGb, formValues, getApiMode, globalSearchActiveIndex, globalSearchError, globalSearchQuery, globalSearchStatus, globalSearchSuggestions, globalSearchTimer, goLiveChecklistCache, goLiveChecklistCacheUserId, goLiveChecklistForScope, gridActions, gridAddButton, groupSearchResults, hasPermission, iconLabel, inferredSetupProgress, initFrontendSentry, ipd360Button, ipd360Tabs, ipdAdmissionChecklistPanel, ipdAdmissionStatus, ipdHeader, ipdJourneyTracker, ipdNextActions, ipdTimelineEvents, ipdTimelinePanel, isAuthError, isBillPaidToday, isDeathOutcome, isPendingStatus, isToday, isUnauthorizedError, jobRoleOptions, journeyTracker, latestForPatient, latestPatientJourneyStage, latestRecord, livePatientFlowBoard, loadingLabel, loadingLabels, localDateInputValue, localDateKey, localFrontendMode, MASTER_MODULES, medicineField, mergeNotifications, metricCard, metricTrend, minutesSince, missingDocumentAlerts, modalSubmitTestId, money, NAV_BY_ROLE, navGroupLabel, navIcon, normalizeBranchAdminCreateUserForm, normalizeDashboardData, normalizeEditValues, normalizePageKey, normalizeSetupStep, notificationGroup, notificationsDrawerOpen, OPD_JOURNEY_STEPS, opdCheckoutChecklistPanel, opdJourneyTrackerForPatient, PAGE_TITLE_FALLBACK, pageErrorPanel, pageFromHash, pageSkeleton, parseCsv, parseHashRoute, passwordField, passwordPolicyHint, passwordPolicyState, patientActions, patientAppointmentsPage, patientBillsPage, patientCardGrid, patientDashboardPage, patientDocumentsPage, patientJourneyTimelinePanel, patientLabel, patientName, patientOption, patientPortalShell, patientRiskIndicator, patientStickyHeader, patientTimeline, pendingCount, pendingUpload, permissionMatrix, permissionMatrixRows, permissionRiskAlerts, permissionRiskPanel, permissionTemplateOptions, permitted, printableButton, priorityCards, providerStatusGrid, publicBookingConfirmation, publicBookingLinkBlock, publicBookingPage, queueDelayAlerts, queueDelayPanel, quickActionsPanel, readFileAsDataUrl, readFileAsText, recordTime, render, renderAuth, renderedPageKey, renderMustChangePasswordGate, renderNotificationsDrawer, renderPage, renderPatientPortal, renderPublicBooking, renderShell, resolveDischargePatient, resolveMedicationName, riskClass, riskSummary, roleDashboardPanel, roleLabels, ROLES, roleSmartCards, roleWorkQueue, routeKey, rowRouteButton, runGlobalSearch, safeAiAssistantPanel, safeData, safeMrn, safeOptionalData, safeRenderPage, sameId, sampleCsv, scheduleDataRender, scheduleDraftSave, scopeDescription, searchFilterBar, searchResultRoute, selectedPatientId, selectedPermissionPages, selectPatientPanel, SENSITIVE_USER_PERMISSIONS, sensitivePermissionList, setPage, setPermissionPages, SETUP_STEP_ALIASES, SETUP_WIZARD_STEPS, setupPercent, setupProgressSummary, severityForDelay, shouldStagePage, simpleOpsPage, skeletonLine, skeletonMetricCards, skeletonTable, smartBillingDraftPanel, stagedPageKey, stagedPageTimer, startButtonLoading, startFormLoading, statusClass, stopButtonLoading, stopFormLoading, strongPassword, table, taskStatus, TEXT_TEMPLATES, titleCase, toast, toNumber, topSearchAutocomplete, trendChart, unauthorizedPage, uniquePages, updatePermissionBuilder, uploadValidation, USER_PERMISSION_ACTIONS, USER_PERMISSION_GROUPS, USER_ROLE_MODULES, USER_ROLE_PRESETS, userAccessDetail, userAccessPreview, userInitials, userPageCheckboxGroups, validateRows, warmDataCache } = context);
}

export function hospitalsPage() {
  if (![ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN].includes(currentUser.role)) return unauthorizedPage();
  const hospitals = api.hospitals(currentUser);
  if (currentUser.role === ROLES.HOSPITAL_ADMIN) {
    const hospital = hospitals.find((item) => String(item.id) === String(currentUser.hospitalId)) || hospitals[0] || null;
    return `<section class="panel hospital-profile-page">
      <div class="panel-head"><div><h3>Hospital Profile</h3><p>Hospital information, registration, address and contact overview.</p></div>${hospital ? `<button class="button primary" type="button" data-action="edit-hospital-profile" data-id="${escapeHtml(hospital.id)}">Edit Profile</button>` : gridAddButton("Hospital Profile", "create-hospital")}</div>
      ${hospital ? `<div class="hospital-profile-card">
        <div class="hospital-profile-identity">${hospital.logoDataUrl || hospital.logoUrl || hospital.logo ? `<img src="${escapeAttribute(hospital.logoDataUrl || hospital.logoUrl || hospital.logo)}" alt="${escapeAttribute(hospital.name)} logo" />` : `<span class="hospital-logo-placeholder">H</span>`}<div><p class="eyebrow">Parent Organization</p><h2>${escapeHtml(hospital.name)}</h2><p>${escapeHtml(hospital.hospitalType || "Hospital")}</p></div>${badge(hospital.status || "Active", statusClass(hospital.status || "Active"))}</div>
        <div class="hospital-profile-details">
          ${[["Hospital Code", hospital.hospitalCode || hospital.code], ["Hospital Type", hospital.hospitalType], ["Registration Number", hospital.registrationNumber], ["Address", hospital.address], ["City", hospital.city], ["State", hospital.state], ["PIN Code", hospital.pinCode], ["Contact Number", hospital.contactNumber || hospital.contact], ["Email", hospital.email], ["Website", hospital.website]].filter(([, value]) => value).map(([label, value]) => `<span><small>${escapeHtml(label)}</small><strong>${label === "Website" ? `<a href="${escapeAttribute(/^https?:\/\//i.test(value) ? value : `https://${value}`)}" target="_blank" rel="noreferrer">${escapeHtml(value)}</a>` : escapeHtml(value)}</strong></span>`).join("")}
        </div>
      </div>` : `<div class="compact-empty"><strong>No hospital profile has been created yet.</strong><button class="button primary small" type="button" data-action="open-create" data-form-action="create-hospital">+ Create Hospital Profile</button></div>`}
    </section>`;
  }
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>${currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital Profile" : "Hospital customers"}</h3><p>${currentUser.role === ROLES.HOSPITAL_ADMIN ? "Hospital information, registration, address and contact overview." : "Manage hospital groups. Create admin logins from the Admin Users page."}</p></div>
        <div class="button-row"><span class="badge status-active">${hospitals.length} visible</span>${gridAddButton("Hospital", "create-hospital")}</div>
      </div>
      ${table(["Hospital", "Owner", "Status", "Plan", "Branches", "Users", "Storage", "Actions"], hospitals.map((hospital) => [
        hospital.name,
        hospital.owner,
        badge(hospital.status, statusClass(hospital.status)),
        hospital.plan,
        `${api.branches({ ...currentUser, role: ROLES.SUPER_ADMIN }).filter((branch) => branch.hospitalId === hospital.id).length} / ${hospital.branchLimit ?? 0}`,
        `${hospital.userLimit ?? 0}`,
        `${formatGb(hospital.storageUsedGb)} / ${formatGb(hospital.storageGb)}`,
        gridActions("hospitals", hospital.id)
      ]))}
    </section>
  `;
}

export function branchesPage() {
  const branches = api.branches(currentUser);
  const isSuperAdmin = currentUser.role === ROLES.SUPER_ADMIN;
  const canManage = currentUser.role === ROLES.HOSPITAL_ADMIN && hasPermission(currentUser, "branches", "edit");
  const branchAdmins = safeOptionalData(() => api.users(currentUser), []).filter((user) => [ROLES.BRANCH_ADMIN, "BRANCH_ADMIN"].includes(user.role));
  const headers = ["Branch", "Code", "Location", "Contact", "Branch Admin", "Status", "Actions"];
  return `
    <section class="panel branch-management" data-branch-management>
      <div class="panel-head">
        <div><h3>Branch Management</h3><p>Create and manage hospital branches.</p></div>
        ${canManage ? `<div class="button-row">${gridAddButton("Branch", "create-branch")}<button class="button primary" type="button" data-action="open-create" data-form-action="create-branch">+ Add Branch</button></div>` : ""}
      </div>
      ${branches.length ? `
        <div class="branch-list-tools">
          <input class="panel-search" type="search" placeholder="Search branch by name, code or city" data-branch-search />
          <label class="inline-filter">Status<select data-branch-status><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
        </div>
        ${table(headers, branches.map((branch) => ({ attrs: { "data-branch-row": true, "data-branch-search-text": `${branch.name || ""} ${branch.branchCode || branch.code || ""} ${branch.city || ""}`.toLowerCase(), "data-branch-status-value": String(branch.status || "Active").toLowerCase() }, cells: [
          `<strong>${escapeHtml(branch.name)}</strong>`,
          branch.branchCode || branch.code || "-",
          [branch.city, branch.state].filter(Boolean).join(", ") || "-",
          branch.contactNumber || branch.contact || branch.phone || "-",
          branchAdmins.find((user) => String(user.branchId) === String(branch.id))?.name || "Not Assigned",
          badge(branch.status || "Active", statusClass(branch.status || "Active")),
          `<div class="grid-actions"><button class="button tiny soft" type="button" data-action="view-branch" data-id="${escapeHtml(branch.id)}">View</button>${canManage ? `<button class="button tiny soft" type="button" data-action="open-edit" data-collection="branches" data-id="${escapeHtml(branch.id)}">Edit</button><button class="button tiny ${String(branch.status || "Active").toLowerCase() === "active" ? "danger" : "soft"}" type="button" data-action="toggle-branch-status" data-id="${escapeHtml(branch.id)}" data-status="${escapeHtml(branch.status || "Active")}">${String(branch.status || "Active").toLowerCase() === "active" ? "Deactivate" : "Activate"}</button>` : ""}</div>`
        ] })))}
        <p class="compact-empty hidden" data-branch-filter-empty>No branches match your search.</p>
      ` : `<div class="compact-empty"><strong>No branches have been created yet.</strong>${canManage ? `<button class="button primary small" type="button" data-action="open-create" data-form-action="create-branch">+ Add First Branch</button>` : ""}</div>`}
    </section>
  `;
}

export function usersPage() {
  const users = api.users(currentUser);
  const branches = api.branches(currentUser);
  const branchLabel = (branchId) => {
    const branch = branches.find((item) => String(item.id) === String(branchId));
    if (!branch) return "Hospital group";
    return `${branch.branchType || "Main Branch"}: ${branch.name}`;
  };
  const title = currentUser.role === ROLES.SUPER_ADMIN ? "Hospital admin users" : currentUser.role === ROLES.HOSPITAL_ADMIN ? "Branch and sub-branch admins" : "Branch staff users";
  const note = currentUser.role === ROLES.HOSPITAL_ADMIN
    ? "Create only Branch Admin and Sub-Branch Admin logins here. Staff users are created by the assigned Branch Admin."
    : currentUser.role === ROLES.BRANCH_ADMIN
      ? "Create department-wise staff users for your assigned branch only."
      : "Create usernames, passwords, roles, and allowed modules here.";
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>${title}</h3><p>${note}</p></div>
        <div class="button-row"><span class="badge status-active">${users.length} visible</span>${gridAddButton("User", "create-user")}</div>
      </div>
      ${table(["Name", "Login", "Role", "Job Role", "Department", "Branch", "Modules", "Status", "Actions"], users.map((user) => [
        user.name,
        user.email,
        roleLabels[user.role],
        user.jobRole || roleLabels[user.role] || "-",
        user.department || "-",
        branchLabel(user.branchId),
        user.allowedModules?.join(", ") || "All permitted",
        badge(user.status, statusClass(user.status)),
        gridActions("users", user.id)
      ]))}
    </section>
  `;
}

export function accessReviewPage() {
  const users = api.accessReviewUsers(currentUser);
  const selected = users.find((user) => user.id === accessReviewTarget) || null;
  return `
    ${permissionRiskPanel(users)}
    <section class="panel" data-testid="access-review-table">
      <div class="panel-head">
        <div>
          <h3>User Access Review</h3>
          <p>Review branch and hospital users, sensitive permissions, last login, and permission changes.</p>
        </div>
        <div class="button-row">
          <span class="badge status-active">${users.length} users in scope</span>
          ${hasPermission(currentUser, "reports", "export") ? `<button class="button small soft" type="button" data-action="export-csv" data-kind="access-review">Export Access Report</button>` : ""}
        </div>
      </div>
      ${table(["User", "Username", "Job Role", "Branch", "Status", "Last Login", "Pages", "Sensitive", "Last Permission Update", "Created By", "Review", "Actions"], users.map((user) => [
        user.name,
        user.email,
        user.jobRole || roleLabels[user.role],
        user.branchName || "Hospital group",
        badge(user.status, statusClass(user.status)),
        user.lastLogin || "-",
        user.allowedPagesCount,
        user.sensitivePermissionsCount,
        user.lastPermissionUpdate || "-",
        user.createdBy || "-",
        badge(user.reviewStatus || "Not Reviewed", statusClass(user.reviewStatus || "Pending")),
        `<div class="grid-actions">
          <button class="icon-button" type="button" data-action="view-access" data-user="${escapeHtml(user.id)}">View Access</button>
          <button class="icon-button" type="button" data-action="review-access" data-review="Reviewed" data-user="${escapeHtml(user.id)}">Review Access</button>
          ${user.sensitivePermissionsCount ? `<button class="icon-button danger" type="button" data-action="revoke-sensitive" data-user="${escapeHtml(user.id)}">Revoke Sensitive</button>` : ""}
          <button class="icon-button danger" type="button" data-action="disable-access-user" data-user="${escapeHtml(user.id)}">Disable User</button>
        </div>`
      ]))}
    </section>
    ${userAccessDetail(selected)}
  `;
}

export function permissionTemplatesPage() {
  const templates = api.permissionTemplates(currentUser);
  return `
    <section class="panel" data-testid="permission-template-table">
      <div class="panel-head">
        <div>
          <h3>Permission Templates</h3>
          <p>Create reusable page and action presets. Defaults stay active, and hospital or branch templates can be added on top.</p>
        </div>
        <div class="button-row"><span class="badge status-active">${templates.length} active</span>${gridAddButton("Template", "create-permission-template")}</div>
      </div>
      ${table(["Template", "Job Role", "Scope", "Pages", "Sensitive", "Status", "Actions"], templates.map((template) => [
        template.templateName || template.name,
        template.jobRole || "-",
        template.scope || (template.isDefault ? "Default" : "Branch Scope"),
        template.allowedPages?.length || 0,
        sensitivePermissionList(template.permissions).length,
        badge(template.status || "Active", statusClass(template.status || "Active")),
        `<div class="grid-actions">
          <button class="icon-button" type="button" data-action="duplicate-template" data-template="${escapeHtml(template.id)}">Duplicate</button>
          ${template.isDefault ? "" : `<button class="icon-button danger" type="button" data-action="disable-template" data-template="${escapeHtml(template.id)}">Disable</button>`}
        </div>`
      ]))}
    </section>
  `;
}

export function masterDataPage() {
  const items = api.masterDataItems(currentUser);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Master records</h3><p>Departments, doctors, services, tests, medicines, insurance, payment modes, and thresholds.</p></div>
        <div class="button-row"><input class="panel-search" placeholder="Search or filter records" />${gridAddButton("Master Record", "create-master-data")}</div>
      </div>
      ${table(["Type", "Name", "Code", "Department", "Price", "Status", "Actions"], items.map((item) => [
        item.type,
        item.name,
        item.code || "-",
        item.department || item.departmentWard || "-",
        item.price ?? item.consultationFee ?? "-",
        badge(item.status, statusClass(item.status)),
        `<div class="grid-actions">${hasPermission(currentUser, "masterData", "edit") ? `<button class="icon-button" data-action="toggle-master-data" data-master="${item.id}">${item.status === "Active" ? "Deactivate" : "Activate"}</button>` : ""}${gridActions("masterDataItems", item.id)}</div>`
      ]))}
    </section>
  `;
}

export function setupPage() {
  const progress = api.setupProgress(currentUser)[0];
  const { completed, percent, next } = inferredSetupProgress(progress || {});
  const checklist = goLiveChecklistForScope();
  const completedItems = checklist?.items?.filter((item) => item.completed) || [];
  const pendingItems = checklist?.items?.filter((item) => !item.completed) || [];
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Setup Wizard</h3><p>Complete the required setup before starting daily hospital operations.</p></div>
        ${badge(`${percent}% complete`, progress?.status === "Completed" || percent === 100 ? "status-active" : "risk-medium")}
      </div>
      ${progress?.status === "Completed" || percent === 100 ? "" : `<div class="notice">Recommended next action: ${escapeHtml(next)}.</div>`}
      <div class="setup-progress"><span style="width:${Math.max(0, Math.min(100, Number(percent)))}%"></span></div>
      <div class="wizard guided-wizard">
        ${SETUP_WIZARD_STEPS.map((step) => `<span class="${completed.has(step) ? "done" : step === next ? "active" : ""}">${escapeHtml(step)}</span>`).join("")}
      </div>
      ${hasPermission(currentUser, "setup", "edit") ? `
        <form class="form-grid compact-grid" data-action="save-setup">
          <label class="span-2">Completed steps<input name="completedSteps" placeholder="Hospital profile, Main branch, Departments" value="${escapeHtml([...completed].join(", "))}" /></label>
          <button class="button primary" type="submit">Save Setup Draft</button>
        </form>
      ` : ""}
      ${checklist ? `
        <div class="subsection">
          <div class="panel-head compact">
            <div><h3>Hospital Go-Live Checklist</h3><p>Critical setup checks for production deployment.</p></div>
            ${badge(`${checklist.percent}% ready`, checklist.ready ? "status-active" : "risk-medium")}
          </div>
          ${checklist.blocked ? `<div class="notice">Go-live is blocked until critical items are complete. Next action: ${escapeHtml(checklist.nextRecommendedAction)}</div>` : `<div class="notice success">Critical checks are complete. Next action: ${escapeHtml(checklist.nextRecommendedAction)}</div>`}
          <div class="detail-grid">
            <span><strong>Completed</strong>${escapeHtml(String(checklist.completedCount || 0))} / ${escapeHtml(String(checklist.totalCount || 0))}</span>
            <span><strong>Critical warnings</strong>${escapeHtml(String((checklist.warnings || []).length))}</span>
          </div>
          <div class="split-grid">
            <section class="panel inset">
              <div class="panel-head compact"><h3>Completed items</h3></div>
              ${completedItems.length ? `<ul class="check-list">${completedItems.map((item) => `<li>${escapeHtml(item.label)}</li>`).join("")}</ul>` : emptyState("No go-live checklist items are complete yet.")}
            </section>
            <section class="panel inset">
              <div class="panel-head compact"><h3>Pending items</h3></div>
              ${pendingItems.length ? `<ul class="check-list">${pendingItems.map((item) => `<li><strong>${escapeHtml(item.label)}</strong> ${escapeHtml(item.action || "")}</li>`).join("")}</ul>` : emptyState("No pending go-live checklist items remain.")}
            </section>
          </div>
        </div>
      ` : ""}
    </section>
  `;
}

export function doctorSchedulePage() {
  const schedules = api.doctorSchedules(currentUser);
  const slots = api.appointmentSlots(currentUser);
  return `
    ${hasPermission(currentUser, "doctorSchedule", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>Create doctor schedule</h3><p>Available slots are generated and appointment booking checks capacity, leave, active doctor, and active department.</p></div>
        <form class="form-grid" data-action="create-doctor-schedule">
          <label>Doctor<input name="doctor" value="" /></label>
          <label>Department<input name="department" value="" /></label>
          <label>Working days<input name="workingDays" value="Monday,Tuesday,Wednesday,Thursday,Friday" /></label>
          <label>Start<input name="startTime" type="time" value="09:00" /></label>
          <label>End<input name="endTime" type="time" value="17:00" /></label>
          <label>Break<input name="breakTime" value="13:00-14:00" /></label>
          <label>Slot duration<input name="slotDuration" type="number" value="30" /></label>
          <label>Max per slot<input name="maxPatientsPerSlot" type="number" value="2" /></label>
          <label>Type<select name="consultationType"><option>OPD</option><option>Follow-up</option><option>Emergency</option><option>Teleconsultation</option></select></label>
          <button class="button primary" type="submit">Save schedule</button>
        </form>
      </section>
    ` : ""}
    <div class="metric-grid">
      ${metricCard("Today Slots", slots.length, "Visible doctors")}
      ${metricCard("Booked Slots", slots.reduce((sum, slot) => sum + slot.booked, 0), "Booked")}
      ${metricCard("Available Slots", slots.filter((slot) => slot.status === "Available").length, "Open")}
      ${metricCard("Overbooked", slots.filter((slot) => slot.booked > slot.capacity).length, "Needs action")}
      ${metricCard("No-shows", slots.reduce((sum, slot) => sum + slot.noShows, 0), "Today")}
      ${metricCard("Cancellations", slots.reduce((sum, slot) => sum + slot.cancellations, 0), "Today")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Doctor schedules</h3></div>
      ${table(["Doctor", "Department", "Days", "Time", "Break", "Slot", "Capacity", "Type", "Status"], schedules.map((item) => [
        item.doctor,
        item.department,
        item.workingDays.join(", "),
        `${item.startTime}-${item.endTime}`,
        item.breakTime,
        `${item.slotDuration} min`,
        item.maxPatientsPerSlot,
        item.consultationType,
        badge(item.status, statusClass(item.status))
      ]))}
    </section>
  `;
}

export function staffRosterPage() {
  if (currentUser.role !== ROLES.HOSPITAL_ADMIN) return unauthorizedPage();
  const branches = api.branches(currentUser);
  const staff = api.users(currentUser).filter((user) => user.role === ROLES.BRANCH_USER && !["Branch Admin", "Sub-Branch Admin"].includes(user.jobRole));
  const branchName = (branchId) => branches.find((branch) => String(branch.id) === String(branchId))?.name || "Not Assigned";
  return `
    <section class="panel staff-management">
      <div class="panel-head"><div><h3>Staff Management</h3><p>Create employee logins and assign each employee to a role, branch and department.</p></div>${hasPermission(currentUser, "staffRoster", "create") ? `<button class="button primary" type="button" data-action="open-create" data-form-action="create-staff">+ Add Staff</button>` : ""}</div>
      ${staff.length ? table(["Employee Name", "Login / Email", "Role", "Branch", "Department", "Status", "Actions"], staff.map((employee) => [
        `<strong>${escapeHtml(employee.name || "-")}</strong>${employee.employeeId ? `<small class="table-subtext">${escapeHtml(employee.employeeId)}</small>` : ""}`,
        `${escapeHtml(employee.email || "-")}${employee.contactEmail ? `<small class="table-subtext">${escapeHtml(employee.contactEmail)}</small>` : ""}`,
        employee.jobRole || "-",
        branchName(employee.branchId),
        employee.department || "Not Assigned",
        badge(employee.status || "Active", statusClass(employee.status || "Active")),
        `<div class="grid-actions"><button class="button tiny soft" type="button" data-action="edit-staff" data-id="${escapeHtml(employee.id)}">Edit</button><button class="button tiny ${String(employee.status || "Active").toLowerCase() === "active" ? "danger" : "soft"}" type="button" data-action="toggle-staff-status" data-id="${escapeHtml(employee.id)}" data-status="${escapeHtml(employee.status || "Active")}">${String(employee.status || "Active").toLowerCase() === "active" ? "Deactivate" : "Activate"}</button><button class="button tiny soft" type="button" data-action="reset-staff-password" data-id="${escapeHtml(employee.id)}">Reset Password</button></div>`
      ])) : `<div class="compact-empty"><strong>No staff accounts have been created yet.</strong>${hasPermission(currentUser, "staffRoster", "create") ? `<button class="button primary small" type="button" data-action="open-create" data-form-action="create-staff">+ Add Staff</button>` : ""}</div>`}
    </section>
  `;
}

export function financePage() {
  const bills = api.bills(currentUser);
  const financeSummary = financeSummaryFromBills(bills);
  const reports = financeSummary.reports.length ? financeSummary.reports : safeData(() => api.financeReports(currentUser));
  const report = financeSummary.todayRow;
  return `
    <div class="metric-grid">
      ${metricCard("Today's Collection", `Rs. ${money(report.totalCollection || 0)}`, "All modes")}
      ${metricCard("Cash", `Rs. ${money(report.cashCollection || 0)}`, "Cash")}
      ${metricCard("Card", `Rs. ${money(report.cardCollection || 0)}`, "Card")}
      ${metricCard("UPI", `Rs. ${money(report.upiCollection || 0)}`, "UPI")}
      ${metricCard("Insurance Pending", `Rs. ${money(report.insurancePending || 0)}`, "Claims")}
      ${metricCard("Outstanding", `Rs. ${money(report.outstandingAmount || 0)}`, "To collect")}
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h3>Finance and revenue reports</h3><p>Daily collection, payment mode, department, doctor, branch, insurance, refund, discount, pharmacy, and lab revenue.</p></div>
        ${hasPermission(currentUser, "finance", "export") || hasPermission(currentUser, "reports", "export") ? `<div class="button-row"><button class="button soft" data-action="export-csv" data-kind="reports">Excel</button><button class="button primary" data-action="print-report">PDF</button></div>` : ""}
      </div>
      ${table(["Report", "Date", "Pharmacy", "Lab", "OPD", "IPD", "Refunds", "Discounts", "Status"], reports.map((item) => [
        item.reportType || "Daily Revenue",
        item.date || "-",
        `Rs. ${money(item.pharmacySales || 0)}`,
        `Rs. ${money(item.labRevenue || 0)}`,
        `Rs. ${money(item.opdRevenue || 0)}`,
        `Rs. ${money(item.ipdRevenue || 0)}`,
        `Rs. ${money(item.refunds || 0)}`,
        `Rs. ${money(item.discounts || 0)}`,
        badge(item.status || "Generated", statusClass(item.status || "Generated"))
      ])) || emptyState("No revenue reports are visible for your branch yet.")}
    </section>
  `;
}

export function stockPage() {
  const stocks = safeData(() => api.medicineStocks(currentUser));
  const lowStock = stocks.filter((item) => Number(item.quantityAvailable || 0) <= Number(item.reorderLevel || 0));
  return `
    <div class="metric-grid small">
      ${metricCard("Medicines", stocks.length, "Batch-wise")}
      ${metricCard("Low Stock", lowStock.length, "Below reorder")}
      ${metricCard("Expired", stocks.filter((item) => item.status === "Expired").length, "Blocked")}
    </div>
    <section class="panel">
      <div class="panel-head">
        <div><h3>Pharmacy stock</h3><p>Batch-wise stock, expiry checks, low-stock alerts, returns, and adjustments.</p></div>
        ${gridAddButton("Stock", "add-stock")}
      </div>
      ${searchFilterBar("Search stock by medicine / batch / supplier", ["All", "Low Stock", "Out of Stock", "Expiring", "Expired"])}
      ${stocks.length ? table(["Medicine", "Batch", "Expiry", "Supplier", "Qty", "Reorder", "Location", "Status", "Action"], stocks.map((item) => [
        item.medicine,
        item.batchNumber,
        item.expiryDate,
        item.supplier,
        item.quantityAvailable,
        item.reorderLevel,
        item.storageLocation,
        badge(item.status, item.status === "Expired" ? "risk-critical" : statusClass(item.status)),
        hasPermission(currentUser, "stock", "edit") ? `<button class="button tiny" data-action="stock-adjust" data-stock="${item.id}">Adjust +10</button>` : "View"
      ])) : emptyState("No low-stock medicines. Inventory is healthy.")}
    </section>
  `;
}

export function purchasePage() {
  const requests = safeData(() => api.purchaseRequests(currentUser));
  const orders = safeData(() => api.purchaseOrders(currentUser));
  return `
    ${hasPermission(currentUser, "purchase", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>Create purchase request</h3></div>
        <form class="form-grid" data-action="create-purchase-request">
          <label>Item<input name="requestedItem" required placeholder="Aspirin 75mg" /></label>
          <label>Quantity<input name="quantity" type="number" required /></label>
          <label>Department<input name="department" required placeholder="Pharmacy" /></label>
          <label>Priority<select name="priority"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
          <label class="span-2">Reason<textarea name="reason" placeholder="Low stock detected."></textarea></label>
          <button class="button primary" type="submit">Create request</button>
        </form>
      </section>
    ` : ""}
    <section class="panel">
      <div class="panel-head"><h3>Purchase requests</h3></div>
      ${searchFilterBar("Search purchase requests", ["All", "Requested", "Approved", "Received"])}
      ${requests.length ? table(["Item", "Qty", "Department", "Requested By", "Priority", "Status", "Action"], requests.map((item) => [
        item.requestedItem,
        item.quantity,
        item.department,
        item.requestedBy,
        badge(item.priority, riskClass(item.priority)),
        badge(item.status, statusClass(item.status)),
        hasPermission(currentUser, "purchase", "approve") && item.status === "Requested" ? `<button class="button tiny" data-action="approve-purchase" data-request="${item.id}">Approve</button>` : "Open"
      ])) : emptyState("No purchase requests found. Create a purchase request when stock needs replenishment.")}
    </section>
    <section class="panel">
      <div class="panel-head"><h3>Purchase orders</h3></div>
      ${orders.length ? table(["Vendor", "Items", "Qty", "Total", "Expected", "Status", "Action"], orders.map((item) => [
        item.vendor,
        item.items,
        item.quantity,
        `Rs. ${money(item.totalAmount)}`,
        item.expectedDeliveryDate,
        badge(item.status, statusClass(item.status)),
        hasPermission(currentUser, "purchase", "edit") && item.status !== "Received" ? `<button class="button tiny" data-action="receive-goods" data-po="${item.id}">Receive</button>` : "Done"
      ])) : emptyState("No purchase orders found. Approved requests will appear here for goods receipt.")}
    </section>
  `;
}

export function feedbackPage() {
  const feedback = safeData(() => api.patientFeedback(currentUser));
  const complaints = safeOptionalData(() => api.complaints(currentUser));
  const patients = hasPermission(currentUser, "patients", "view") ? safeOptionalData(() => api.patients(currentUser)) : [];
  return `
    ${hasPermission(currentUser, "feedback", "create") ? `
      <section class="panel">
        <div class="panel-head"><h3>Record patient feedback</h3><p>Low score automatically creates complaint and alert.</p></div>
        <form class="form-grid" data-action="submit-feedback">
          <label>Patient<select name="patientId">${patients.map((p) => `<option value="${p.id}">${escapeHtml(patientLabel(p))}</option>`).join("")}</select></label>
          <label>Rating<input name="rating" type="number" min="1" max="5" value="2" /></label>
          <label>Reception<input name="receptionExperience" type="number" value="3" /></label>
          <label>Doctor<input name="doctorExperience" type="number" value="4" /></label>
          <label>Nursing<input name="nursingExperience" type="number" value="3" /></label>
          <label>Billing<input name="billingExperience" type="number" value="2" /></label>
          <label>Cleanliness<input name="cleanliness" type="number" value="4" /></label>
          <label>Waiting<input name="waitingTime" type="number" value="2" /></label>
          <label class="span-2">Comments<textarea name="comments">Billing took too long.</textarea></label>
          <button class="button primary" type="submit">Save feedback</button>
        </form>
      </section>
    ` : ""}
    <section class="panel">
      <div class="panel-head"><h3>Feedback</h3></div>
      ${searchFilterBar("Search feedback by patient / status / owner", ["All", "Open", "High Priority", "Resolved"])}
      ${feedback.length ? table(["Patient", "Rating", "Reception", "Doctor", "Nursing", "Billing", "Cleanliness", "Status"], feedback.map((item) => [
        item.patientId,
        item.rating,
        item.receptionExperience,
        item.doctorExperience,
        item.nursingExperience,
        item.billingExperience,
        item.cleanliness,
        badge(item.status, statusClass(item.status))
      ])) : emptyState("No feedback records found. Patient feedback and complaints will appear here once submitted.")}
    </section>
    <section class="panel">
      <div class="panel-head"><h3>Complaints</h3></div>
      ${complaints.length ? table(["Patient", "Type", "Risk", "Assigned", "Due", "Status"], complaints.map((item) => [
        item.patientId,
        item.complaintType,
        badge(item.riskLevel, riskClass(item.riskLevel)),
        item.assignedTo,
        item.dueDate,
        badge(item.status, statusClass(item.status))
      ])) : emptyState("No complaint records found. Quality incidents will appear here after feedback is submitted.")}
    </section>
  `;
}

export function backupPage() {
  const logs = api.backupLogs(currentUser);
  const status = api.backupStatus?.(currentUser) || {};
  const lastRun = status.lastBackupRun;
  const lastDrill = status.lastRestoreDrill;
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>System backup</h3><p>Automated application-level backups and restore drills run on schedule. Full continuous Atlas backup needs a dedicated cluster tier.</p></div>
        <div class="button-row">
          ${hasPermission(currentUser, "settings", "view") ? `<button class="button soft" type="button" data-action="run-provider-check">Run Provider Check</button>` : ""}
          ${hasPermission(currentUser, "backup", "create") ? `<button class="button soft" data-action="open-create" data-form-action="request-restore">Request restore</button><button class="button primary" data-action="manual-backup">Record backup check</button>` : ""}
        </div>
      </div>
      <div class="metric-grid small">
        ${metricCard("Backup Provider", status.provider || "MongoDB Atlas", "Managed")}
        ${metricCard("Last Backup", logs[0]?.dateTime || status.lastBackupTime || "No backup log yet", "Check")}
        ${metricCard("Next Backup", "Scheduled in Atlas", status.frequency || "Atlas policy")}
        ${metricCard("Retention", status.retention || "7 daily / 4 weekly / 12 monthly", "Policy")}
        ${metricCard("Last Automated Backup", lastRun ? `${formatDateTime(lastRun.dateTime)} (${lastRun.totalDocuments} docs)` : "No automated run yet", lastRun ? lastRun.status : "Run npm run backup:run")}
        ${metricCard("Last Restore Drill", lastDrill ? `${formatDateTime(lastDrill.dateTime)} → ${lastDrill.targetDatabase}` : "No restore drill yet", lastDrill ? lastDrill.status : "Run npm run backup:restore-drill")}
      </div>
      <div class="notice subtle">
        Automated backups export every collection on a schedule and are logged below as "backup_run" entries. Restore drills replay a backup into a separate sandbox database (never production) and are logged as "restore_drill" entries, so the restore path is actually tested rather than only documented. Manual restore requests still require Super Admin approval before any Atlas-side action.
      </div>
      ${providerStatusGrid()}
      ${table(["Backup / Request ID", "Date/Time", "Provider", "Status", "Size", "Requested By", "Notes"], logs.map((item) => [
        item.backupId,
        item.dateTime,
        item.provider || "MongoDB Atlas",
        badge(item.status, statusClass(item.status)),
        item.size,
        item.triggeredBy,
        item.notes
      ]))}
    </section>
  `;
}

export function compliancePage() {
  const logs = api.privacyAccessLogs(currentUser);
  return `
    <div class="metric-grid">
      ${metricCard("Patient Views", logs.filter((l) => l.action.includes("Patient")).length, "Today")}
      ${metricCard("Reports Exported", logs.filter((l) => l.action.includes("export")).length, "Today")}
      ${metricCard("Failed Logins", api.auditLogs(currentUser).filter((l) => l.action === "Failed login").length, "Security")}
      ${metricCard("Sensitive Access", logs.filter((l) => l.sensitive).length, "Audited")}
      ${metricCard("Document Downloads", logs.filter((l) => l.action.includes("Document")).length, "Today")}
      ${metricCard("Permission Changes", api.auditLogs(currentUser).filter((l) => l.action.includes("Permission")).length, "Today")}
    </div>
    <section class="panel">
      <div class="panel-head"><h3>Privacy and compliance</h3><p>Session timeout, password policy, MFA readiness, data retention, export permission, and sensitive access logs.</p></div>
      <form data-action="save-compliance">
        <div class="settings-grid">
          <label class="toggle-row"><input type="checkbox" checked /> Log patient record views</label>
          <label class="toggle-row"><input type="checkbox" checked /> Mask patient data for limited users</label>
          <label class="toggle-row"><input type="checkbox" /> Enable MFA after provider setup</label>
          <label class="toggle-row"><input type="checkbox" checked /> Require report export audit</label>
        </div>
        <div class="button-row footer-actions"><button class="button primary" type="submit">Save compliance settings</button></div>
      </form>
      <div class="subsection">
        ${table(["Time", "User", "Role", "Module", "Action", "Patient", "Sensitive", "Status"], logs.map((log) => [
          log.createdAt,
          log.userId,
          log.userRole,
          log.module,
          log.action,
          log.patientId,
          log.sensitive ? "Yes" : "No",
          badge(log.status, statusClass(log.status))
        ]))}
      </div>
    </section>
  `;
}

export function auditPage() {
  const query = auditSearchQuery.trim().toLowerCase();
  const logs = api.auditLogs(currentUser).filter((log) => {
    if (!query) return true;
    return [log.at, log.user, log.role, log.module, log.action, formatAuditValue(log.oldValue), formatAuditValue(log.newValue), log.ip]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });
  return `
    <section class="panel">
      <div class="panel-head">
        <div><h3>Audit trail</h3><p>Searchable record of important actions across visible tenant scope.</p></div>
        <div class="button-row">
          <input class="panel-search" value="${escapeHtml(auditSearchQuery)}" placeholder="Search user, module, action, value, or IP" data-audit-search />
          ${hasPermission(currentUser, "audit", "export") ? `<button class="button soft" type="button" data-action="export-csv" data-kind="audit" data-testid="audit-filter-button">Export audit</button>` : ""}
        </div>
      </div>
      ${table(["Date/time", "User", "Role", "Module", "Action", "Old Value", "New Value", "IP"], logs.map((log) => [
        log.at,
        log.user,
        log.role,
        log.module,
        log.action,
        formatAuditValue(log.oldValue),
        formatAuditValue(log.newValue),
        log.ip
      ]))}
    </section>
  `;
}

export function settingsPage() {
  const providers = safeOptionalData(() => api.providerStatus(currentUser), {});
  const automationSettings = automationSettingsForScope();
  const canManageAutomation = hasPermission(currentUser, "settings", "manageSettings");
  return `
    <section class="panel">
      <div class="panel-head"><h3>Settings</h3><p>Security, notifications, thresholds, and support access.</p></div>
      <div class="button-row"><button class="button small soft" type="button" title="Refresh provider status" aria-label="Refresh provider status" data-action="run-provider-check">${iconLabel(actionIcon("refresh provider"), "Refresh provider status")}</button></div>
      <div class="provider-grid">
        ${[
          ["MongoDB Atlas", providers.mongodb],
          ["Cloudflare R2", providers.storage],
          ["Email Provider", providers.email],
          ["Sentry", providers.sentry],
          ["Backup", providers.backup || { status: "Review Required", message: "Manual backup and restore readiness should be verified before go-live." }]
        ].map(([label, item]) => `
          <article class="provider-card">
            <div><strong>${escapeHtml(label)}</strong><small>${escapeHtml(item?.message || "Status unavailable.")}</small></div>
            ${badge(item?.status || "Unknown", String(item?.status || "").toLowerCase().includes("config") || String(item?.status || "").toLowerCase().includes("connect") ? "status-active" : "risk-medium")}
          </article>
        `).join("")}
      </div>
      <form data-action="save-settings">
        <div class="settings-grid">
          <label class="toggle-row"><input type="checkbox" checked /> Email verification required</label>
          <label class="toggle-row"><input type="checkbox" /> Optional multi-factor authentication</label>
          <label class="toggle-row"><input type="checkbox" checked /> Audit every report export</label>
          <label class="toggle-row"><input type="checkbox" /> Temporary support access to sensitive records</label>
          <label class="toggle-row"><input type="checkbox" name="autoTaskCreationEnabled" ${automationSettings.autoTaskCreationEnabled ? "checked" : ""} ${canManageAutomation ? "" : "disabled"} /> Auto task creation enabled</label>
          <label class="toggle-row"><input type="checkbox" name="reminderNotificationsEnabled" ${automationSettings.reminderNotificationsEnabled ? "checked" : ""} ${canManageAutomation ? "" : "disabled"} /> Notification reminders enabled</label>
        </div>
        <div class="subsection">
          <h3>Automation thresholds</h3>
          <p>${escapeHtml(automationSettings.scopeLevel === "branch" ? "These settings apply to the current branch." : "These settings apply as the hospital default.")}</p>
          <div class="form-grid">
            <label>Queue waiting-time alert threshold, minutes<input name="queueWaitingMinutes" type="number" min="1" max="480" value="${escapeHtml(String(automationSettings.queueWaitingMinutes || 45))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Lab pending alert threshold, minutes<input name="labPendingMinutes" type="number" min="1" max="1440" value="${escapeHtml(String(automationSettings.labPendingMinutes || 120))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Radiology pending alert threshold, minutes<input name="radiologyPendingMinutes" type="number" min="1" max="1440" value="${escapeHtml(String(automationSettings.radiologyPendingMinutes || 120))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Pharmacy pending alert threshold, minutes<input name="pharmacyPendingMinutes" type="number" min="1" max="1440" value="${escapeHtml(String(automationSettings.pharmacyPendingMinutes || 60))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Billing pending alert threshold, minutes<input name="billingPendingMinutes" type="number" min="1" max="1440" value="${escapeHtml(String(automationSettings.billingPendingMinutes || 90))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>MAR due reminder threshold, minutes<input name="marDueMinutes" type="number" min="1" max="720" value="${escapeHtml(String(automationSettings.marDueMinutes || 30))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Discharge clearance reminder threshold, minutes<input name="dischargeClearanceMinutes" type="number" min="1" max="1440" value="${escapeHtml(String(automationSettings.dischargeClearanceMinutes || 180))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Report upload delay threshold, minutes<input name="reportUploadDelayMinutes" type="number" min="1" max="1440" value="${escapeHtml(String(automationSettings.reportUploadDelayMinutes || 180))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Document readiness delay threshold, minutes<input name="documentReadinessMinutes" type="number" min="1" max="2880" value="${escapeHtml(String(automationSettings.documentReadinessMinutes || 240))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            <label>Go-live checklist reminder threshold, minutes<input name="goLiveChecklistReminderMinutes" type="number" min="1" max="10080" value="${escapeHtml(String(automationSettings.goLiveChecklistReminderMinutes || 1440))}" required ${canManageAutomation ? "" : "disabled"} /></label>
            ${canManageAutomation ? `<button class="button primary" type="submit" title="Save settings" aria-label="Save settings">${iconLabel("OK", "Save settings")}</button>` : `<div class="notice subtle span-2">Only administrators with settings access can modify automation thresholds.</div>`}
          </div>
        </div>
      </form>
    </section>
  `;
}
