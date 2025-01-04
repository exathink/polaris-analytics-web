/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React, {useState} from "react";
import {Loading} from "../../../../../components/graphql/loading";


import {FlowMetricsScatterPlotChart} from "../../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {XmRChart} from "./xmrChart";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {polarisTimestamp, toGraphQLDate, toMoment} from "../../../../../helpers/utility";
import moment from "moment";

export const ProjectXmrWidget = ({
                                   dimension,
                                   instanceKey,
                                   specsOnly,
                                   view,
                                   context,
                                   latestWorkItemEvent,
                                   leadTimeTarget,
                                   cycleTimeTarget,
                                   leadTimeConfidenceTarget,
                                   cycleTimeConfidenceTarget,
                                   days,
                                   defectsOnly,
                                   initialMetric
                                 }) => {
  const [selectedMetric, setSelectedMetric] = useState(initialMetric);
  const selectedMetricMeta = projectDeliveryCycleFlowMetricsMeta[selectedMetric];


  const {loading, error, data} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days,
    before: toGraphQLDate(latestWorkItemEvent),
    defectsOnly,
    specsOnly,
    referenceString: latestWorkItemEvent
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("ProjectFlowMetricsSettingWidget.useQueryProjectClosedDeliveryCycleDetail", error);
    return null;
  }
  const deliveryCycleData = data["project"]["workItemDeliveryCycles"]["edges"].map(edge => edge.node);

  return (
    <XmRChart
      data={deliveryCycleData}
      days={days}
      displayType={"scatter"}
      xAttributeMeta={selectedMetricMeta}
      timestampAttribute={"endDate"}
      view={view}
    />
  );
};
