export const getQuadrantColor = ({cycleTime, latency, cycleTimeTarget, latencyTarget}) => {
  if (cycleTime <= cycleTimeTarget && latency <= latencyTarget) {
    return "green";
  }

  if (cycleTime <= cycleTimeTarget && latency > latencyTarget) {
    return "yellow";
  }

  if (cycleTime > cycleTimeTarget && latency <= latencyTarget) {
    return "orange";
  }

  if (cycleTime > cycleTimeTarget && latency > latencyTarget) {
    return "red";
  }
};

export const getTeam = (node) => {
  return node.teamNodeRefs.length > 0
    ? node.teamNodeRefs.length > 1
      ? "multiple"
      : node.teamNodeRefs[0].teamName
    : "Unassigned";
};
