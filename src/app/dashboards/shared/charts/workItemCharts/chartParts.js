import {percentileToText} from "../../../../helpers/utility";

export const PlotLines = {
  maxLeadTime:  (aggregateCycleMetrics, intl, align='left', vAlign='top') => (
    {
      color: 'blue',
      value: aggregateCycleMetrics.maxLeadTime,
      dashStyle: 'longdashdot',
      width: 1,
      label: {
        text: `Max Lead Time=${intl.formatNumber(aggregateCycleMetrics.maxLeadTime)} days`,
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
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Lead Time=${intl.formatNumber(aggregateCycleMetrics.percentileLeadTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),
  leadTimeTarget: (targetMetrics, intl, align='left', vAlign='top') => ({
    color: 'blue',
    value: targetMetrics.leadTimeTarget,
    dashStyle: 'longdashdot',
    width: 1,
    zIndex: 7,// seems tooptip z-index is 8 (so keeping just below it, also we wanna keep it above chart point z-index)
    label: {
      text: `${percentileToText(targetMetrics.leadTimeConfidenceTarget)} Lead Time Target=${intl.formatNumber(targetMetrics.leadTimeTarget)} days`,
      align: align,
      verticalAlign: vAlign,
    }
  }),
  cycleTimeTarget: (targetMetrics, intl, align='left', vAlign='top') => ({
    color: 'orange',
    value: targetMetrics.cycleTimeTarget,
    dashStyle: 'longdashdot',
    width: 1,
    zIndex: 7,
    label: {
      text: `${percentileToText(targetMetrics.cycleTimeConfidenceTarget)} Cycle Time Target=${intl.formatNumber(targetMetrics.cycleTimeTarget)} days`,
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
        text: `${percentileToText(aggregateCycleMetrics.targetPercentile)} Cycle Time=${intl.formatNumber(aggregateCycleMetrics.percentileCycleTime)} days`,
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
        text: ` Avg. Cycle Time ${intl.formatNumber(aggregateCycleMetrics.avgCycleTime)} days`,
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
        text: ` Max. Cycle Time ${intl.formatNumber(aggregateCycleMetrics.maxCycleTime)} days`,
        align: align,
        verticalAlign: vAlign,
      }
    }
  ),



}

