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


export const QuadrantColors = {
  green: "#2f9a32",
  yellow: "#d4ae10",
  orange: "#d08535",
  red: "#b5111a"
};