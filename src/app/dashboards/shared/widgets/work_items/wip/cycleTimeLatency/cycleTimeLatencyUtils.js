export const getQuadrantColor = ({cycleTime, latency, cycleTimeTarget, latencyTarget}) => {
  if (cycleTime <= cycleTimeTarget && latency <= latencyTarget) {
    return QuadrantColors.green;
  }

  if (cycleTime <= cycleTimeTarget && latency > latencyTarget) {
    return QuadrantColors.yellow;
  }

  if (cycleTime > cycleTimeTarget && latency <= latencyTarget) {
    return QuadrantColors.orange;
  }

  if (cycleTime > cycleTimeTarget && latency > latencyTarget) {
    return QuadrantColors.red;
  }
};


export const QuadrantColors = {
  green: "#2f9a32",
  yellow: "#d4ae10",
  orange: "#d08535",
  red: "#b5111a"
};