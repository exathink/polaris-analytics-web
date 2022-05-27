import React from "react";
import {RULES_ENGINE, RULES_MESSAGES} from "./rules_engine";

export function InsightsDashboard() {
  // if its on-demand insights, it could be very scalable (we can have few insights ready initially)
  const metric = "cycleTime";
  const ruleFn = RULES_ENGINE[metric];
  const text = ruleFn(3, 7, {positiveText: RULES_MESSAGES[metric][0], negativeText: RULES_MESSAGES[metric][1]});

  return (
    <div className="">
      Insights Module
      <div>{text}</div>
    </div>
  );
}

export default InsightsDashboard;
