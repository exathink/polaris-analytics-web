import {percentileToText} from "../../../../helpers/utility";

export const PlotLines = {
  maxLeadTime:  (aggregateCycleMetrics, intl, align='left') => (
    {
      color: 'blue',
      value: aggregateCycleMetrics.maxLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `Max Lead Time=${intl.formatNumber(aggregateCycleMetrics.maxLeadTime)} days`,
        align: align
      }
    }
  ),
  percentileLeadTime: (aggregateCycleMetrics, intl, align='left') => (
    {
      color: 'red',
      value: aggregateCycleMetrics.percentileLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Lead Time=${intl.formatNumber(aggregateCycleMetrics.percentileLeadTime)} days`,
        align: align
      }
    }
  ),
  percentileCycleTime: (aggregateCycleMetrics, intl, align='left') => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.percentileCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Cycle Time=${intl.formatNumber(aggregateCycleMetrics.percentileCycleTime)} days`,
        align: align
      }
    }
  ),
  avgCycleTime: (aggregateCycleMetrics, intl, align=`left`) => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.avgCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: ` Avg. Cycle Time ${intl.formatNumber(aggregateCycleMetrics.avgCycleTime)} days`,
        align: align
      }
    }
  )

}

