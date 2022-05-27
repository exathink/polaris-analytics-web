import {Tooltip} from "antd";
import cn from "classnames";
import {getMetricUtils} from "../../../components/misc/statistic/statistic";
import { TOOLTIP_COLOR } from "../../../helpers/utility";
import {getMetricInsight} from "./rules_engine";

function getClassNames(isPositive) {
  return cn("tw-p-2 tw-rounded-sm", isPositive ? "tw-bg-green-200" : "tw-bg-red-200");
}

function getTooltipElement({target, value, uom, metric, metricLabel}) {
  const {isPositive} = getMetricInsight({metric: metric, target, value});
  const {metricValue, suffix} = getMetricUtils({
    target,
    value,
    uom,
    good: () => isPositive,
    valueRender: (text) => text,
  });
  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-text-gray-300">
      <div className="tw-flex tw-items-center">
        <div>{metricLabel}: </div>
        <div className="tw-ml-2">
          {metricValue} {suffix}
        </div>
      </div>
      <div className="tw-flex tw-items-center">
        <div>{metricLabel} Target: </div>
        <div className="tw-ml-2">{target} days</div>
      </div>
    </div>
  );
}
export function CycleTimeHealth({target, value}) {
  const METRIC = "cycleTime";
  const {isPositive, text} = getMetricInsight({metric: METRIC, target, value});

  const tooltipElement = getTooltipElement({target, value, uom: "days", metric: METRIC, metricLabel: "CYCLE TIME"});
  return (
    <div className={getClassNames(isPositive)}>
      <div className="tw-font-semibold">CYCLE TIME</div>
      <div className="tw-flex tw-items-center tw-justify-between">
        <div>{text}</div>
        <Tooltip title={tooltipElement} color={TOOLTIP_COLOR}>
          <div className="tw-cursor-pointer tw-text-xs tw-text-blue-200">Details</div>
        </Tooltip>
      </div>
    </div>
  );
}

export function LeadTimeHealth({target, value}) {
  const METRIC = "leadTime";
  const {isPositive, text} = getMetricInsight({metric: METRIC, target, value});

  const tooltipElement = getTooltipElement({target, value, uom: "days", metric: METRIC, metricLabel: "LEAD TIME"});
  return (
    <div className={getClassNames(isPositive)}>
      <div className="tw-font-semibold">LEAD TIME</div>
      <div className="tw-flex tw-items-center tw-justify-between">
        <div>{text}</div>
        <Tooltip title={tooltipElement} color={TOOLTIP_COLOR}>
          <div className="tw-cursor-pointer tw-text-xs tw-text-blue-200">Details</div>
        </Tooltip>
      </div>
    </div>
  );
}

export function ResponseTimeInsights({title, subTitle, leadTime, cycleTime, cycleTimeTarget, leadTimeTarget}) {
  return (
    <div className="tw-ml-2 tw-mt-2 tw-flex tw-flex-col tw-justify-center tw-space-y-2 tw-bg-white tw-p-4">
      <div className="tw-flex  tw-justify-between tw-text-center">
        <div className="tw-text-lg tw-font-semibold">{title}</div>
        <div className="tw-text-xs">{subTitle}</div>
      </div>
      <CycleTimeHealth target={cycleTimeTarget} value={cycleTime} />
      <LeadTimeHealth target={leadTimeTarget} value={leadTime} />
    </div>
  );
}
