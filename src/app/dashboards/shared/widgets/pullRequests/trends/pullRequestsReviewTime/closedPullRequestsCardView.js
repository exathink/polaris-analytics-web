import classNames from "classnames";
import {ClosedPullRequestCount, PullRequest} from "../../../../components/flowStatistics/flowStatistics";
import fontStyles from "../../../../../../framework/styles/fonts.module.css";
import {useIntl} from "react-intl";
import {i18nNumber} from "../../../../../../helpers/utility";

export function ClosedPullRequestsCardView({
  pullRequestMetricsTrends,
  measurementWindow,
  cardSelection,
  onClick,
  latencyTarget,
}) {
  const intl = useIntl();
  const [currentTrend, previousTrend] = pullRequestMetricsTrends;
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
        previousMeasurement={previousTrend}
        displayProps={{className: "tw-p-2", onClick, showHighlighted: cardSelection === "closed"}}
      />
      <PullRequest
        title={"Review Time"}
        displayType="card"
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        target={latencyTarget}
        displayProps={{
          className: "tw-p-2",
          onClick,
          showHighlighted: cardSelection === "closed",
          ...(latencyTarget ? {supportingMetric: <span>Target {i18nNumber(intl, latencyTarget, 1)} Days</span>} : {}),
        }}
        metric="avgAge"
      />
    </div>
  );
}
