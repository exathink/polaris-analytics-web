import {percentileToText} from "../../../../helpers/utility";

export const cycleMetricsReferencePlotlines =
  (aggregateCycleMetrics, intl) =>
    [{
      color: 'blue',
      value: aggregateCycleMetrics.maxLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `Max Lead Time=${intl.formatNumber(aggregateCycleMetrics.maxLeadTime)} days`,
        align: `left`
      }
    }, {
      color: 'red',
      value: aggregateCycleMetrics.percentileLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Lead Time=${intl.formatNumber(aggregateCycleMetrics.percentileLeadTime)} days`,
        align: `left`
      }
    }]
