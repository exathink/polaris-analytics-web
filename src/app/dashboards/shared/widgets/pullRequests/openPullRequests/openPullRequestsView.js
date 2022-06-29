import React from "react";
import {VizItem, VizRow} from "../../../containers/layout";
import {PullRequestAgeChart} from "./pullRequestAgeChart";
import {navigateToExternalURL} from "../../../navigation/navigate";
import {TrendIndicator} from "../../../../../components/misc/statistic/statistic";
import {FlowStatistic, OpenPullRequestCount, OpenPullRequestsAvg} from "../../../components/flowStatistics/flowStatistics";
import {average} from "../../../../../helpers/utility";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import classNames from "classnames";
import fontStyles from "../../../../../framework/styles/fonts.module.css";

const OpenPullRequestsStatsView = ({title, pullRequests, view}) => (
  <VizRow h={1}>
    <VizItem w={1 / 2}>
      <FlowStatistic
        title={title || <span>{"Open"}</span>}
        currentValue={(pullRequests && pullRequests.length) || 0}
        good={TrendIndicator.isNegative}
      />
    </VizItem>
    <VizItem w={1 / 2}>
      <FlowStatistic
        title={
          title || (
            <span>
              {"Age"}
              <sup> Avg </sup>
            </span>
          )
        }
        currentValue={average(pullRequests, (pullRequest) => pullRequest.age)}
        uom={"Days"}
        precision={1}
        good={TrendIndicator.isNegative}
      />
    </VizItem>
  </VizRow>
);

export const OpenPullRequestsCardsView = ({title, pullRequests, view, cardSelection, onClick}) => (
  <div className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[auto_80%] tw-gap-1">
    <div className={classNames("tw-col-span-2 tw-font-normal", fontStyles["text-lg"])}>Open Pull Requests</div>
    <OpenPullRequestCount
      title={"Total"}
      currentValue={(pullRequests && pullRequests.length) || 0}
      displayType="card"
      displayProps={{className: "tw-p-2", onClick, showHighlighted: cardSelection==="open"}}
    />
    <OpenPullRequestsAvg
      title={
        title || (
          <span>
            {"Age"}
            <sup> Avg </sup>
          </span>
        )
      }
      currentValue={average(pullRequests, (pullRequest) => pullRequest.age)}
      displayType="card"
      displayProps={{className: "tw-p-2", onClick, showHighlighted: cardSelection==="open"}}
    />

  </div>
);

const PullRequestChartView = ({pullRequests, view, context}) => {
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <PullRequestAgeChart
          pullRequests={pullRequests}
          title={pullRequests.length === 1 ? "Open Pull Request" : "Open Pull Requests"}
          view={view}
          onSelectionChange={(pullRequests) => {
            if (pullRequests.length === 1) {
              const pullRequest = pullRequests[0];
              if (pullRequest.workItemsSummaries.length === 1) {
                const workItem = pullRequest.workItemsSummaries[0];
                setWorkItemKey(workItem.key);
                setShowPanel(true);
              } else {
                navigateToExternalURL(pullRequests[0].webUrl);
              }
            }
          }}
        />
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          context={context}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          drawerOptions={{placement: "bottom"}}
        />
      </VizItem>
    </VizRow>
  );
};


export const OpenPullRequestsView = ({pullRequests, view, context, asStatistic, asCard}) => {
  if (asStatistic) {
    return <OpenPullRequestsStatsView pullRequests={pullRequests} view={view} />;
  }
  return <PullRequestChartView pullRequests={pullRequests} view={view} context={context} />;
};
