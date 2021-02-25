import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {useQueryProjectBacklogTrends} from "../../hooks/useQueryProjectBacklogTrends";
import {DefectBacklogTrendsView} from "./defectBacklogTrendsView";

export const DefectBacklogTrendsWidget = ({instanceKey, view, days, measurementWindow, samplingFrequency}) => {
  const {loading, error, data} = useQueryProjectBacklogTrends({
    instanceKey: instanceKey,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    defectsOnly: true,
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DefectBacklogTrendsWidget.useQueryProjectBacklogTrends", error);
    return null;
  }

  const {backlogTrends} = data["project"];

  return (
    <DefectBacklogTrendsView
      instanceKey={instanceKey}
      backlogTrends={backlogTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      samplingFrequency={samplingFrequency}
      view={view}
    />
  );
};
