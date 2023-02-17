export const joinTeams = (node) => {
  return node.teamNodeRefs
    .map((t) => t.teamName)
    .sort()
    .join(", ");
};

export const metricsMapping = {
  CYCLE_TIME: "avgCycleTime",
  LEAD_TIME: "avgLeadTime",
  DURATION: "avgDuration",
  EFFORT: "avgEffort",
  LATENCY: "avgLatency",
  PULLREQUEST: "pullRequestAvgAge",
  WIP_TOTAL: "wipTotal",
  AVG_AGE: "avgAge"
};
