import classNames from "classnames";
import React from "react";
import {useIntl} from "react-intl";
import {getPercentage} from "../../../../../projects/shared/helper/utils";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms} from "../../../../config";
import {getFlowEfficiencyUtils} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";

export const DimensionQuadrantSummaryView = ({
  dimension,
  stageName,
  data,
  stateTypes,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  displayBag,
  specsOnly,
  tooltipType,
  view,
  context,
}) => {
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const {flowEfficiencyFraction} = getFlowEfficiencyUtils(workItems, stateTypes);

  const intl = useIntl();
  const flowEfficiencyPercentage = getPercentage(flowEfficiencyFraction, intl)
  return (
    <PlainCard
      title="Flow Efficiency"
      value={flowEfficiencyPercentage}
      info={{title: "Flow Efficiency"}}
      detailsView={{
        title: (
          <div className="tw-text-lg tw-text-gray-300">
            Flow Efficiency,{" "}
            <span className="tw-text-base tw-italic">
              {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}
            </span>
          </div>
        ),
        placement: "bottom",
        content: <FlowEfficiencyDetailsView workItems={workItems} />,
      }}
      className="tw-h-full"
    >
      <QuadrantSummaryPanel
        workItems={workItems}
        stateTypes={stateTypes}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        className={classNames("tw-mx-auto tw-h-full tw-w-[98%]", displayBag?.fontSize)}
      />
    </PlainCard>
  );
};
