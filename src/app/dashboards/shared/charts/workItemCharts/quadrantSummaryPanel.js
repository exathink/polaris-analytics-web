import classNames from "classnames";
import { getQuadrantCounts } from "../../widgets/work_items/clientSideFlowMetrics";
import { Popover } from "antd";

import {
  filterByStateTypes,
  getQuadrantDescription,
  getQuadrantLegacy,
  QuadrantColors,
  QuadrantNames,
  Quadrants
} from "../../widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { useIntl } from "react-intl";
import { i18nNumber } from "../../../../helpers/utility";

function getTotalAgeByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalAge, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalAge[quadrant]) {
      totalAge[quadrant] += item.cycleTime;
    } else {
      totalAge[quadrant] = item.cycleTime;
    }
    return totalAge;
  }, {});
}

function getTotalLatencyByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalLatency, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalLatency[quadrant]) {
      totalLatency[quadrant] += item.latency;
    } else {
      totalLatency[quadrant] = item.latency;
    }
    return totalLatency;
  }, {});
}

function getTotalEffortByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalEffort, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalEffort[quadrant]) {
      totalEffort[quadrant] += item.effort;
    } else {
      totalEffort[quadrant] = item.effort;
    }
    return totalEffort;
  }, {});
}

function QuadrantBox({name, val, total, totalAge, totalLatency, quadrantEffort, totalEffort, quadrantDescription, color, onQuadrantClick, className, fontClass, testId, size}) {
  const intl = useIntl();

  const percentageCount = total === 0 ? 0 : (val / total) * 100;
  const percentageCountDisplay =
    total >= 0 ? `${i18nNumber(intl, percentageCount, 0)} %` : <span className="tw-text-base">N/A</span>;

  const averageAge = totalAge/val;
  const averageAgeDisplay = val > 0 ? `${i18nNumber(intl, averageAge,averageAge < 10 ? 1 :0)}`: '';

  const averageLatency = totalLatency/val;
  const averageLatencyDisplay = val > 0 ? `${i18nNumber(intl, averageLatency,averageAge < 10 ? 1 :0)}`: '';

  const wipEffortDisplay = total > 0 ?  `${i18nNumber(intl,quadrantEffort, 0 ) } ` : '';

  const pairRender = (label, value, uom) => (
    <div className="tw-flex tw-items-baseline tw-space-x-2">
      <div className="tw-text-xl tw-tracking-wide">{label}</div>
      <div className="tw-flex tw-items-baseline tw-space-x-2">
        <div className="tw-text-2xl tw-font-medium tw-leading-3 tw-text-black">{value}</div>
        <div className="tw-text-sm tw-font-normal">{uom}</div>
      </div>
    </div>
  );

  const tooltipContent = val > 0 && (
    <div className="tw-p-2 tw-grid tw-gap-2 tw-text-gray-300">
      {pairRender(`Avg. Age:`, averageAgeDisplay, `Days`)}
      {pairRender(`Avg. Days Since Last Move:`, averageLatencyDisplay, ``)}
      {pairRender(`Effort:`, wipEffortDisplay, `FTE Days (${i18nNumber(intl,(quadrantEffort/totalEffort)*100, 0 ) }%)`)}
    </div>
  )
  const tooltipTitle = (
    <div className="tw-p-2 tw-text-gray-300 tw-text-xl tw-tracking-wide">
      <div>
        {`${val} ${name}`}
      </div>
      <div className={classNames("tw-font-normal tw-italic tw-text-xs")}>
        {quadrantDescription}
      </div>
    </div>
  )
  return (
    <Popover content={tooltipContent} title={tooltipTitle} trigger={"hover"}>
      <div
        className={classNames("tw-flex tw-cursor-pointer tw-flex-col tw-items-center tw-justify-center tw-rounded-md", className, {"2xl:tw-space-y-1  tw-p-1":size!=="small"})}
        style={{backgroundColor: color}}
        onClick={onQuadrantClick}
        data-testid={testId}
      >
        <div className={classNames({"tw-text-xs": size==="small"}, {"2xl:tw-text-2xl": size!=="small"})}>{name}</div>
        <div className={classNames("tw-text-black tw-text-opacity-80", fontClass)}>{percentageCountDisplay}</div>
        <div
          className={classNames(
            "tw-truncate tw-text-xs tw-text-black tw-text-opacity-80",
            val === 0 ? "tw-invisible" : ""
          )}
        >
          {val > 0 ? `Avg. Age ${averageAgeDisplay} Days` : "random text"}
        </div>
      </div>
    </Popover>
  );
}

export function QuadrantSummaryPanel({
  workItems,
  cycleTimeTarget,
  latencyTarget,
  className,
  onQuadrantClick,
  selectedQuadrant,
  valueFontClass = "tw-text-2xl",
  size
}) {
  const intl = useIntl();

  const quadrantCounts = getQuadrantCounts({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantAge = getTotalAgeByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantLatency = getTotalLatencyByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantEffort = getTotalEffortByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const totalEffort = Object.keys(quadrantEffort).reduce(
    (totalEffort, current) => totalEffort + quadrantEffort[current],
    0
  );

  const selectedBorderClasses = "tw-border-2 tw-border-solid tw-border-gray-300";
  const quadrantDescription = getQuadrantDescription({intl, cycleTimeTarget, latencyTarget});

  //TODO: remove abandoned for now, from the quadrant summary panel
  const {[Quadrants.abandoned]: _ignore, ...restQuadrants} = QuadrantNames;
  const allQuadrants = Object.entries(restQuadrants).map(([key, value]) => ({
    quadKey: key,
    name: value,
    val: quadrantCounts[key] ?? 0,
    totalAge: quadrantAge[key] ?? 0,
    totalLatency: quadrantLatency[key] ?? 0,
    quadrantEffort: quadrantEffort[key] ?? 0,
    quadrantDescription: quadrantDescription[key],
    color: QuadrantColors[key],
    className: selectedQuadrant === key ? selectedBorderClasses : "",
  }));

  const allElements = allQuadrants.map((q) => {
    return (
      <QuadrantBox
        key={q.quadKey}
        testId={q.quadKey}
        {...q}
        fontClass={valueFontClass}
        total={workItems.length}
        totalEffort={totalEffort}
        onQuadrantClick={() => onQuadrantClick(q.quadKey)}
        size={size}
      />
    );
  });
  return <div className={classNames("tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1", className)}>{allElements}</div>;
}
