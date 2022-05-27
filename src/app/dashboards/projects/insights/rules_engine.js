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
  const isPositive = metricRuleObj.isPositive({value, target});
  if (isPositive) {
    return {isPositive, text: metricRuleObj.positiveText({value, target})};
  } else {
    return {isPositive, text: metricRuleObj.negativeText({value, target})};
  }
}
