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
  leadTimeTarget: (aggregateCycleMetrics, intl, align='left', vAlign='top') => ({
    color: 'blue',
    value: aggregateCycleMetrics.leadTimeTarget,
    dashStyle: 'longdashdot',
    width: 1,
    zIndex: 10,
    label: {
      text: `${percentileToText(aggregateCycleMetrics.leadTimeConfidenceTarget)} Lead Time Target=${intl.formatNumber(aggregateCycleMetrics.leadTimeTarget)} days`,
      align: align,
      verticalAlign: vAlign,
    }
  }),
  cycleTimeTarget: (aggregateCycleMetrics, intl, align='left', vAlign='top') => ({
    color: 'orange',
    value: aggregateCycleMetrics.cycleTimeTarget,
    dashStyle: 'longdashdot',
    width: 1,
    zIndex: 10,
    label: {
      text: `${percentileToText(aggregateCycleMetrics.cycleTimeConfidenceTarget)} Cycle Time Target=${intl.formatNumber(aggregateCycleMetrics.cycleTimeTarget)} days`,
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

