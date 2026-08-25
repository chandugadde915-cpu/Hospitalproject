function sameId(left, right) {
  return left !== undefined && left !== null && left !== "" &&
    right !== undefined && right !== null && right !== "" &&
    String(left) === String(right);
}

export function findOpdVitalsForQueue(vitals = [], queueToken = {}) {
  return vitals.find((vital) => {
    if (!sameId(vital.patientId, queueToken.patientId)) return false;

    if (vital.queueTokenId || queueToken.id) {
      if (sameId(vital.queueTokenId, queueToken.id)) return true;
      if (vital.queueTokenId) return false;
    }

    if (vital.appointmentId || queueToken.appointmentId) {
      if (sameId(vital.appointmentId, queueToken.appointmentId)) return true;
      if (vital.appointmentId) return false;
    }

    return !vital.queueTokenId && !vital.appointmentId;
  }) || null;
}

export function opdVitalsStage(queueToken, vitals = []) {
  if (findOpdVitalsForQueue(vitals, queueToken)) return "Completed";
  if (["Waiting", "Vitals Pending", "WAITING_FOR_VITALS"].includes(queueToken?.status)) return "In Progress";
  return "Pending";
}
