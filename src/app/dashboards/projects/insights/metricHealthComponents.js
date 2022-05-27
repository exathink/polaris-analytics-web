import cn from "classnames";
import {getMetricInsight} from "./rules_engine";

function getClassNames(isPositive) {
  return cn("tw-p-2", isPositive ? "tw-bg-blue-100" : "tw-bg-gray-200");
}
export function CycleTimeHealth({target, value}) {
  const METRIC = "cycleTime";
  const {isPositive, text} = getMetricInsight({metric: METRIC, target, value});
  return (
    <div className={getClassNames(isPositive)}>
      <div className="tw-font-semibold">CYCLE TIME</div>
      <div>{text}</div>
    </div>
  );
}

export function LeadTimeHealth({target, value}) {
  const METRIC = "leadTime";
  const {isPositive, text} = getMetricInsight({metric: METRIC, target, value});
  return (
    <div className={getClassNames(isPositive)}>
      <div className="tw-font-semibold">LEAD TIME</div>
      <div>{text}</div>
    </div>
  );
}
