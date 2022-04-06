import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";


import {useQueryDimensionWorkBalanceTrends} from "./useQueryDimensionWorkBalanceTrends";
import {WorkBalanceTrendsView} from "./workBalanceTrendsView";
import {DimensionWorkBalanceTrendsDetailDashboard} from "./workBalanceTrendsDetailDashboard";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {WorkBalanceTrendsTable} from "./workBalanceTrendsTable";

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
    includeSubTasks
  }) => {
  
  const [tabSelection, setTab] = React.useState("balance");
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
      />
    );

    if (display === "withCardDetails") {
      const table = <WorkBalanceTrendsTable tableData={cycleMetricsTrends}/>;
      return (
        <React.Fragment>
          <GroupingSelector
            label={"View"}
            value={tabSelection}
            groupings={[
              {
                key: "balance",
                display: "Work Balance",
              },
              {
                key: "table",
                display: "Card Detail",
              },
            ]}
            initialValue={tabSelection}
            onGroupingChanged={setTab}
            className="tw-ml-auto tw-mr-10"
          />
          {tabSelection !== "table" && workBalance}
          {tabSelection === "table" && table}
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
        samplingFrequency,
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
