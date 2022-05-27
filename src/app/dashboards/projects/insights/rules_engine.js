export const RULES_ENGINE = {
  leadTime: {
    isPositive: ({target, value}) => {
      return value <= target;
    },
    positiveText: ({target, value}) => "metric health is good",
    negativeText: ({target, value}) => "metric health is not good",
  },
  cycleTime: {
    isPositive: ({target, value}) => {
      return value <= target;
    },
    positiveText: ({target, value}) => "metric health is good",
    negativeText: ({target, value}) => "metric health is not good",
  },
};

export function getMetricInsight({metric, target, value}) {
  const metricRuleObj = RULES_ENGINE[metric];
  if (metricRuleObj.isPositive({value, target})) {
    return metricRuleObj.positiveText({value, target})
  } else {
    return metricRuleObj.negativeText({value, target})
  }
}