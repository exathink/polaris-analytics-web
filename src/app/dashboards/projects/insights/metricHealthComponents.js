import cn from "classnames";
import {getMetricInsight} from "./rules_engine";

function getClassNames(isPositive) {
  return cn("tw-p-2 tw-rounded-sm", isPositive ? "tw-bg-green-200" : "tw-bg-red-200");
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

export function FlowInsights({leadTime, cycleTime, cycleTimeTarget, leadTimeTarget, measurementWindow}) {
  return (
    <div className="tw-ml-2 tw-mt-2 tw-flex tw-flex-col tw-justify-center tw-space-y-2 tw-bg-white tw-p-4">
      <div className="tw-text-center  tw-flex tw-justify-between">
        <div className="tw-text-lg tw-font-semibold">Flow Insights</div>
        <div className="tw-text-xs">Last {measurementWindow} days</div>
      </div>
      <CycleTimeHealth target={cycleTimeTarget} value={cycleTime} />
      <LeadTimeHealth target={leadTimeTarget} value={leadTime} />
    </div>
  );
}
