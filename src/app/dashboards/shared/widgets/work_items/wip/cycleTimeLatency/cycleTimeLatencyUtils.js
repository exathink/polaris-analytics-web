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
  [Quadrants.ok]: "#4ade80",
  [Quadrants.latency]: "#facc15",
  [Quadrants.age]: "#fb923c",
  [Quadrants.critical]: "#f87171"
};

export function getQuadrantColor(cycleTime, latency, cycleTimeTarget, latencyTarget){
  return QuadrantColors[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)]
}

export const QuadrantNames = {
  [Quadrants.ok]: "Moving",
  [Quadrants.latency]: "Slowing",
  [Quadrants.age]: "Delayed",
  [Quadrants.critical]: "Stalled"
};

export function getQuadrantName(cycleTime, latency, cycleTimeTarget, latencyTarget) {
  return QuadrantNames[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)]
}

