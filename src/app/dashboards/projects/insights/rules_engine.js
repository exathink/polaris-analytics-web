export const RULES_ENGINE = {
  leadTime: {
    isPositive: ({target, value}) => {
      return value <= target;
    },
    positiveText: ({target, value}) => "metric health improved",
    negativeText: ({target, value}) => "metric health went down",
  },
  cycleTime: {
    isPositive: ({target, value}) => {
      return value <= target;
    },
    positiveText: ({target, value}) => "metric health improved",
    negativeText: ({target, value}) => "metric health went down",
  },
};

export function getMetricInsight({metric, target, value}) {
  const ruleObj = RULES_ENGINE[metric];
  if (ruleObj.isPositive({value, target})) {
    return ruleObj.positiveText({value, target})
  } else {
    return ruleObj.negativeText({value, target})
  }
}