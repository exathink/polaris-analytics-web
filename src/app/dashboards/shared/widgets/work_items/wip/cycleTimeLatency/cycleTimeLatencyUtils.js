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
