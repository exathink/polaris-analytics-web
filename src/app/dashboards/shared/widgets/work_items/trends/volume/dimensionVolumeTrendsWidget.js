import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {VolumeTrendsView} from "./volumeTrendsView"
import {VolumeTrendsDetailDashboard} from "./volumeTrendsDetailDashboard";
import { getReferenceString, getServerDate } from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";


export const DimensionVolumeTrendsWidget = React.memo((
  {
    dimension,
    tags,
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
    detailDashboardInitialMetric,
    tabSelection,
    setTab,
    effortOnly
  }) => {
    const displayProps = React.useMemo(() => ({chartOrTable: "table", tabSelection, setTab}), [tabSelection, setTab])
    const {loading, error, data} = useQueryDimensionFlowMetricsTrends(
      {
        dimension,
        tags,
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

    if (view === 'primary' && display === "withCardDetails") {
      return <VolumeTrendsDetailDashboard
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
          displayProps={displayProps}
        />
    }
    return (
      view === 'primary' ?
        <VolumeTrendsView
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          view={view}
          effortOnly={effortOnly}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              const [{measurementDate, key}] = workItems;
              if (setBefore && setSeriesName) {
                setBefore(getServerDate(measurementDate));
                setSeriesName(key);
                setTab?.("table");
              }
            }
          }}
        />
        :
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
          displayProps={{chartOrTable: "table"}}
        />
    )
});
