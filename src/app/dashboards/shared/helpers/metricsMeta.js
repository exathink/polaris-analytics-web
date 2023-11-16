// This class exists mainly to serve as a bridge between the back end api definitions
// of metrics and how we have ended displaying them on the front end.
// Ideally we would not need this class, but the rules around naming
// depending on phase have gotten pretty complex, and for now this class is a
// decent solution to manage the complexity. Ideally we should refactor
// all the code that lives around this class into a single class that can
// encapsulate all the complicated logic around translating metric names into
// display names. Even more ideal would be to make all the back end interfaces
// consistent with the front end usages, but that is a big task that may not be fully
// worth the squeeze at this time.
import { ResponseTimeMetricsColor, WorkItemStateTypes } from "../config";

export const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: "Lead Time",
    shortDisplay: "LT",
    value: (cycle) => cycle.leadTime,
    targetMetric: 'leadTime',
    uom: 'days',
  },
  // Cycle time and Age are synonyms
  // for the same underlying cycle time data point
  // on the back end api.
  // For closed items we call this data point cycle time in
  // the UI and for non-closed we call this the age.
  // The next two entries encapsulate this logic in metricsMeta
  cycleTime: {
    display: "Cycle Time",
    shortDisplay: "CT",
    value: (cycle) => cycle.cycleTime,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  age: {
    display: "Age",
    shortDisplay: "AG",
    value: (cycle) => cycle.cycleTime,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  //
  duration: {
    display: "Coding",
    shortDisplay: "CD",
    value: (cycle) => cycle.duration,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  // Latency and Delivery are synonyms
  // for the same underlying latency data point
  // on the back end api.
  // For closed items we call this data point delivery in
  // the UI and for non-closed we call this the latency.
  // The next two entries encapsulate this logic in metricsMeta
  latency: {
    display: "Last Moved",
    shortDisplay: "LM",
    value: (cycle) => cycle.latency,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  delivery: {
    display: "Shipping",
    shortDisplay: "SH",
    value: (cycle) => cycle.latency,
    targetMetric: 'cycleTime',
    uom: 'days',
  },
  //
  effort: {
    display: "Effort",
    shortDisplay: "EF",
    value: (cycle) => cycle.effort,
    uom: 'FTE Days',
  },
  authors: {
    display: "Authors",
    shortDisplay: "AU",
    value: (cycle) => cycle.authorCount,
    uom: 'authors',
  },
  backlogTime: {
    display: "Define Time",
    shortDisplay: "DT",
    value: (cycle) => (cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0),
    targetMetric: 'leadTime',
    uom: 'days',
  },
  pullRequestAvgAge: {
    display: "Time to Review",
    shortDisplay: "RT",
    value: (cycle) => cycle.pullRequestAvgAge,
    targetMetric: 'pullRequestAvgAge',
    uom: 'days',
  },

  getTargetsAndConfidence: (selectedMetric, targetMetrics) => {
    const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = targetMetrics;
    switch (projectDeliveryCycleFlowMetricsMeta[selectedMetric].targetMetric) {
      case 'leadTime': {
        return [leadTimeTarget, leadTimeConfidenceTarget]
      }
      case 'cycleTime': {
        return [cycleTimeTarget, cycleTimeConfidenceTarget]
      }
      default: {
        return [null, null]
      }
    }
  }
};

export function getMetricsMetaKey(selectedMetric, selectedStateType) {
  if (selectedMetric === "leadTimeOrAge") {
    if (selectedStateType === WorkItemStateTypes.closed) {
      return "leadTime";
    } else {
      return "age";
    }
  }
  if (selectedMetric === "cycleTimeOrLatency") {
    if (selectedStateType === WorkItemStateTypes.closed) {
      return "cycleTime";
    } else {
      return "latency";
    }
  }
  if(selectedMetric === 'latency') {
    if (selectedStateType === WorkItemStateTypes.closed) {
      return 'delivery'
    } else {
      return 'latency'
    }
  }
  return selectedMetric;
}

export function getDefaultMetricKey(stateType) {
  if (stateType === WorkItemStateTypes.closed) {
    return "cycleTime";
  } else {
    return "age";
  }
}

export function getSelectedMetricDisplayName(selectedMetric, selectedStateType) {
  return (
    projectDeliveryCycleFlowMetricsMeta[getMetricsMetaKey(selectedMetric, selectedStateType)]?.display ?? selectedMetric
  );
}

export function getSelectedMetricKey(selectedMetric, selectedStateType) {
  return (
    projectDeliveryCycleFlowMetricsMeta[getMetricsMetaKey(selectedMetric, selectedStateType)]?.targetMetric ?? selectedMetric
  );
}

export function getSelectedPullRequestMetricDisplayName(selectedMetric, selectedStateType) {
  return selectedStateType === WorkItemStateTypes.closed ? 'Time to Review' : 'Age'
}

export function getSelectedMetricColor(selectedMetric, selectedStateType) {
  return ResponseTimeMetricsColor[getMetricsMetaKey(selectedMetric, selectedStateType)] ?? ResponseTimeMetricsColor.leadTime;
}