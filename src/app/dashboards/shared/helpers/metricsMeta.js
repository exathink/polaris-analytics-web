export const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: "Lead Time",
    value: (cycle) => cycle.leadTime,
  },
  cycleTime: {
    display: "Cycle Time",
    value: (cycle) => cycle.cycleTime,
  },
  duration: {
    display: "Duration",
    value: (cycle) => cycle.duration,
  },
  latency: {
    display: "Delivery Latency",
    value: (cycle) => cycle.latency,
  },
  effort: {
    display: "Effort",
    value: (cycle) => cycle.effort,
  },
  authors: {
    display: "Authors",
    value: (cycle) => cycle.authorCount,
  },
  backlogTime: {
    display: "Backlog Time",
    value: (cycle) => (cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0),
  },
};
