import {percentileToText} from "../../../../helpers/utility";

export const PlotLines = {
  maxLeadTime:  (aggregateCycleMetrics, intl) => (
    {
      color: 'blue',
      value: aggregateCycleMetrics.maxLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `Max Lead Time=${intl.formatNumber(aggregateCycleMetrics.maxLeadTime)} days`,
        align: `left`
      }
    }
  ),
  percentileLeadTime: (aggregateCycleMetrics, intl) => (
    {
      color: 'red',
      value: aggregateCycleMetrics.percentileLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Lead Time=${intl.formatNumber(aggregateCycleMetrics.percentileLeadTime)} days`,
        align: `left`
      }
    }
  ),
  percentileCycleTime: (aggregateCycleMetrics, intl) => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.percentileCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Cycle Time=${intl.formatNumber(aggregateCycleMetrics.percentileCycleTime)} days`,
        align: `left`
      }
    }
  ),
  avgCycleTime: (aggregateCycleMetrics, intl) => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.avgCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: ` Avg. Cycle Time ${intl.formatNumber(aggregateCycleMetrics.avgCycleTime)} days`,
        align: `left`
      }
    }
  )

}

