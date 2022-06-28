import classNames from "classnames";
import {ClosedPullRequestCount, PullRequest} from "../../../../components/flowStatistics/flowStatistics";
import fontStyles from "../../../../../../framework/styles/fonts.module.css";

export function ClosedPullRequestsCardView({pullRequestMetricsTrends, measurementWindow}) {
  const [currentTrend] = pullRequestMetricsTrends;
  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[auto_80%] tw-gap-1">
      <div className={classNames("tw-col-span-2 tw-font-normal", fontStyles["text-lg"])}>
        Closed Pull Requests
        <span className={classNames(fontStyles["text-xs"], "tw-ml-2")}>Last {measurementWindow} days</span>
      </div>
      <ClosedPullRequestCount
        title="Total"
        displayType="card"
        currentMeasurement={currentTrend}
        displayProps={{className: "tw-p-2"}}
      />
      <PullRequest
        title={"Review Time"}
        displayType="card"
        currentMeasurement={currentTrend}
        displayProps={{className: "tw-p-2"}}
        metric="avgAge"
      />
    </div>
  );
}
