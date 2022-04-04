import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {VolumeTrendsView} from "./volumeTrendsView"
import {VolumeTrendsDetailDashboard} from "./volumeTrendsDetailDashboard";
import { getReferenceString, getServerDate } from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";


export const DimensionVolumeTrendsWidget = React.memo((
  {
    dimension,
    instanceKey,
    view,
    display,
    context,
    showAll,
    latestCommit,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    setBefore,
    setSeriesName,
    pollInterval,
    includeSubTasks,
    detailDashboardInitialMetric
  }) => {
    const [tabSelection, setTab] = React.useState("volume");
    const {loading, error, data} = useQueryDimensionFlowMetricsTrends(
      {
        dimension,
        instanceKey,
        days,
        measurementWindow,
        samplingFrequency,
        targetPercentile,
        includeSubTasks,
        referenceString: getReferenceString(latestCommit, latestWorkItemEvent)
      }
    );
    if (loading) return <Loading/>;
    if (error) {
      logGraphQlError('DimensionPredictabilityTrendsWidget.useQueryDimensionFlowMetricsTrends', error);
      return null;
    }
    const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];

    function getConsolidatedVolumeTrends() {
      const vol = (
        <VolumeTrendsView
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          view={view}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              const [{measurementDate, key}] = workItems;
              if (setBefore && setSeriesName) {
                setBefore(getServerDate(measurementDate));
                setSeriesName(key);
              }
            }
          }}
        />
      );

      if (display === "withCardDetails") {
        const table = <div>Table</div>;
        return (
          <React.Fragment>
            <GroupingSelector
              label={"View"}
              value={tabSelection}
              groupings={[
                {
                  key: "volume",
                  display: "Volume",
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
            {tabSelection==="table" ? null : vol}
            {tabSelection === "table" && table}
          </React.Fragment>
        );
      } else {
        return vol;
      }
    }

    return view === "primary" ? (
      getConsolidatedVolumeTrends()
    ) : (
      <VolumeTrendsDetailDashboard
        dimension={dimension}
        instanceKey={instanceKey}
        flowMetricsTrends={flowMetricsTrends}
        targetPercentile={targetPercentile}
        measurementWindow={measurementWindow}
        days={days}
        samplingFrequency={samplingFrequency}
        leadTimeTarget={leadTimeTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
        view={view}
        context={context}
        includeSubTasks={includeSubTasks}
        detailDashboardInitialMetric={detailDashboardInitialMetric}
      />
    );
});
