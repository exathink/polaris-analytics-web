export const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: "Lead Time",
    value: (cycle) => cycle.leadTime,
    targetMetric: 'leadTime',
    uom: 'Days',
  },
  cycleTime: {
    display: "Cycle Time",
    value: (cycle) => cycle.cycleTime,
    targetMetric: 'cycleTime',
    uom: 'Days',
  },
  duration: {
    display: "Duration",
    value: (cycle) => cycle.duration,
    targetMetric: 'cycleTime',
    uom: 'Days',
  },
  latency: {
    display: "Delivery Latency",
    value: (cycle) => cycle.latency,
    targetMetric: 'cycleTime',
    uom: 'Days',
  },
  effort: {
    display: "Effort",
    value: (cycle) => cycle.effort,
    uom: 'Dev-Days',
  },
  authors: {
    display: "Authors",
    value: (cycle) => cycle.authorCount,
    uom: 'Authors',
  },
  backlogTime: {
    display: "Backlog Time",
    value: (cycle) => (cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0),
    targetMetric: 'leadTime',
    uom: 'Days',
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

