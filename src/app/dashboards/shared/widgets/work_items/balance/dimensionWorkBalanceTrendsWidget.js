import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";


import {useQueryDimensionWorkBalanceTrends} from "./useQueryDimensionWorkBalanceTrends";
import {WorkBalanceTrendsView} from "./workBalanceTrendsView";
import {DimensionWorkBalanceTrendsDetailDashboard} from "./workBalanceTrendsDetailDashboard";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {getServerDate, i18nDate} from "../../../../../helpers/utility";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import { WorkItemStateTypes } from '../../../config';
import {useIntl} from "react-intl";

export const DimensionWorkBalanceTrendsWidget = (
  {
    dimension,
    instanceKey,
    view,
    display,
    context,
    showContributorDetail,
    showEffort,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    pollInterval,
    chartConfig,
    includeSubTasks,
    showAnnotations,
  }) => {
  const [before, setBefore] = React.useState();
  const [tabSelection, setTab] = React.useState("balance");
  const intl = useIntl();
  const [selectedFilter, setFilter] = React.useState(null);
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  function handleClearClick() {
    setTab("balance");
    setBefore(undefined);
    setFilter(null);
    resetComponentState();
  }

  const {loading, error, data} = useQueryDimensionWorkBalanceTrends(
    {
      dimension: dimension,
      instanceKey: instanceKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      showContributorDetail: showContributorDetail,
      includeSubTasks: includeSubTasks
    }
  );
  if (loading) return <Loading/>;
  if (error) return null;
  const {capacityTrends, contributorDetail, cycleMetricsTrends} = data[dimension];

  function getConsolidatedWorkBalanceTrends() {
    const workBalance = (
      <WorkBalanceTrendsView
        key={resetComponentStateKey}
        context={context}
        capacityTrends={capacityTrends}
        contributorDetail={contributorDetail}
        cycleMetricsTrends={cycleMetricsTrends}
        showContributorDetail={showContributorDetail}
        showEffort={showEffort}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        asStatistic={asStatistic}
        target={target}
        chartConfig={chartConfig}
        view={view}
        showAnnotations={showAnnotations}
        onPointClick={({x, y}) => {
          setTab("table");
          setBefore(x)
          setFilter(y)
        }}
      />
    );

    if (display === "withCardDetails") {
      const table = (
        <DimensionDeliveryCycleFlowMetricsWidget
          key={resetComponentStateKey}
          dimension={dimension}
          instanceKey={instanceKey}
          specsOnly={true}
          view={view}
          context={context}
          showAll={true}
          latestWorkItemEvent={latestWorkItemEvent}
          days={days}
          before={getServerDate(before)}
          initialDays={30}
          initialMetric={"leadTime"}
          includeSubTasks={includeSubTasks}
          chartOrTable={"table"}
        />
      );
      return (
        <React.Fragment>
          <div className="tw-ml-auto tw-flex tw-items-center">
            {selectedFilter != null && (
              <div className="tw-mr-8">
                <ClearFilters
                  selectedFilter={`${days} days ending ${i18nDate(intl, getServerDate(before))}`}
                  selectedMetric={`Cards Closed`}
                  stateType={WorkItemStateTypes.closed}
                  handleClearClick={handleClearClick}
                />
              </div>
            )}
            <GroupingSelector
              label={"View"}
              value={tabSelection}
              groupings={[
                {
                  key: "balance",
                  display: "Effort",
                },
                {
                  key: "table",
                  display: "Card Detail",
                },
              ]}
              initialValue={tabSelection}
              onGroupingChanged={setTab}
              className="tw-ml-auto tw-mr-10"
              layout="col"
            />
          </div>
          <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full"}>{workBalance}</div>
          <div className={tabSelection === "table" ? "" : "tw-hidden"}>{table}</div>
        </React.Fragment>
      );
    } else {
      return workBalance;
    }
  }

  return view !== "detail" ? (
    getConsolidatedWorkBalanceTrends()
  ) : (
    <DimensionWorkBalanceTrendsDetailDashboard
      {...{
        dimension,
        instanceKey,
        days,
        measurementWindow,
        samplingFrequency: 1,
        target,
        view,
        includeSubTasks,
        showContributorDetail,
        showEffort,
        context,
      }}
    />
  );
}
