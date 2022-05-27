export const RULES_MESSAGES = {
    leadTime: ["", ""],
    cycleTime: ["", ""]
}

export const RULES_ENGINE = {
  cycleTime: (value, target, {positiveText, negativeText}) => {
    if (value > target) {
      return positiveText;
    } else {
      return negativeText;
    }
  },
  leadTime: (value, target, {positiveText, negativeText}) => {
    if (value < target) {
      return positiveText;
    } else {
      return negativeText;
    }
  },
};
