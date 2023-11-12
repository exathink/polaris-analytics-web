import {percentileToText} from "../../../../helpers/utility";

export const PlotLines = {
  maxLeadTime:  (aggregateCycleMetrics, intl, align='left', vAlign='top') => (
    {
      color: 'blue',
      value: aggregateCycleMetrics.maxLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `Max LT=${intl.formatNumber(aggregateCycleMetrics.maxLeadTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),
  percentileLeadTime: (aggregateCycleMetrics, intl, align='left', vAlign='top') => (
    {
      color: 'red',
      value: aggregateCycleMetrics.percentileLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} LTe=${intl.formatNumber(aggregateCycleMetrics.percentileLeadTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),
  leadTime: (metricTarget, targetConfidence, intl, align='left', vAlign='top') => ({
    color: 'blue',
    value: metricTarget,
    dashStyle: 'longdashdot',
    width: 1,
    zIndex: 7,// seems tooptip z-index is 8 (so keeping just below it, also we wanna keep it above chart point z-index)
    label: {
      text: `${percentileToText(targetConfidence)} LT Target=${intl.formatNumber(metricTarget)} days`,
      align: align,
      verticalAlign: vAlign,
    }
  }),
  cycleTime: (metricTarget, targetConfidence, intl, align='left', vAlign='top') => ({
    color: 'orange',
    value: metricTarget,
    dashStyle: 'longdashdot',
    width: 1,
    zIndex: 7,
    label: {
      text: `${percentileToText(targetConfidence)} CT Target=${intl.formatNumber(metricTarget)} days`,
      align: align,
      verticalAlign: vAlign,
    }
  }),
  percentileCycleTime: (aggregateCycleMetrics, intl, align='left', vAlign='top') => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.percentileCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} CT=${intl.formatNumber(aggregateCycleMetrics.percentileCycleTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),
  avgCycleTime: (aggregateCycleMetrics, intl, align=`left`, vAlign='top') => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.avgCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: ` Avg. CT ${intl.formatNumber(aggregateCycleMetrics.avgCycleTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),
  maxCycleTime: (aggregateCycleMetrics, intl, align=`left`, vAlign='top') => (
    {
      color: 'orange',
      value: aggregateCycleMetrics.maxCycleTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: ` Max. CT ${intl.formatNumber(aggregateCycleMetrics.maxCycleTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),



}

