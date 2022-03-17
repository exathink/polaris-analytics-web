export const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: "Lead Time",
    value: (cycle) => cycle.leadTime,
    targetMetric: 'leadTime',
    uom: 'days',
  },
  cycleTime: {
    display: "Cycle Time",
    value: (cycle) => cycle.cycleTime,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  duration: {
    display: "Coding",
    value: (cycle) => cycle.duration,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  latency: {
    display: "Delivery",
    value: (cycle) => cycle.latency,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  effort: {
    display: "Effort",
    value: (cycle) => cycle.effort,
    uom: 'dev-days',
  },
  authors: {
    display: "Authors",
    value: (cycle) => cycle.authorCount,
    uom: 'authors',
  },
  backlogTime: {
    display: "Define Time",
    value: (cycle) => (cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0),
    targetMetric: 'leadTime',
    uom: 'days',
  },

  getTargetsAndConfidence: (selectedMetric, targetMetrics) => {
    const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = targetMetrics;
    switch (projectDeliveryCycleFlowMetricsMeta[selectedMetric].targetMetric) {
      case 'leadTime': {
        return [leadTimeTarget, leadTimeConfidenceTarget]
      }
      case 'cycleTime': {
        return [cycleTimeTarget, cycleTimeConfidenceTarget]
      }
      default: {
        return [null, null]
      }
    }
  }
};

