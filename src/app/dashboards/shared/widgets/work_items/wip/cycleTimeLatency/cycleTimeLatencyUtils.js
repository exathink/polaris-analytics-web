export const Quadrants = {
  ok: 'ok',
  latency: 'latency',
  age: 'age',
  critical: 'critical'
}

export const getQuadrant = (cycleTime, latency, cycleTimeTarget, latencyTarget) => {
  if (cycleTime <= cycleTimeTarget && latency <= latencyTarget) {
    return Quadrants.ok;
  }

  if (cycleTime <= cycleTimeTarget && latency > latencyTarget) {
    return Quadrants.latency;
  }

  if (cycleTime > cycleTimeTarget && latency <= latencyTarget) {
    return Quadrants.age;
  }

  if (cycleTime > cycleTimeTarget && latency > latencyTarget) {
    return Quadrants.critical;
  }
};



export const QuadrantColors = {
  ok: "#2f9a32",
  latency: "#0c8fe0",
  age: "#da7304",
  critical: "#b5111a"
};

export function getQuadrantColor(cycleTime, latency, cycleTimeTarget, latencyTarget){
  return QuadrantColors[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)]
}

export const QuadrantNames = {
  ok: "On Track",
  latency: "Watch List",
  age: "Off Track",
  critical: "Critical"
};

export function getQuadrantName(cycleTime, latency, cycleTimeTarget, latencyTarget) {
  return QuadrantNames[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)]
}

