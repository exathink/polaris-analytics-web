import React from 'react';
import type {Props} from "../types";
import {tooltipHtml, ColumnSeries, Chart, HighchartsChart, Title, Tooltip, XAxis, YAxis} from "../../../charts";
import {activity_levels} from "../activityLevel";

export const TotalsBarChart = (props: Props) => {
  const totalsByActivityLevel = props.viz_domain.data.reduce(
    (totals, activitySummary) => {
      let level = activitySummary.activity_level.display_name;
      totals[level] = (totals[level] || 0) + 1;
      return totals
    },
    {});

  const series = [...activity_levels].reverse().map(activityLevel => (
    <ColumnSeries
      name={activityLevel.display_name}
      data={[totalsByActivityLevel[activityLevel.display_name]]}
      color={activityLevel.color}
    />
  ));

  const formatTooltip = (point) => {
    return tooltipHtml({
      header: `${point.series.name}`,
      body: [
        [`${point.percentage.toFixed(0)}%`]
      ]
    });
  };

  return (
    <HighchartsChart plotOptions={{
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          format:`{point.y}`,
          rotation: 270
        }
      }
    }}>
      <Chart
        type={'column'}
      />
      <Title>Totals</Title>

      <Tooltip
        useHTML={true}
        formatter={formatTooltip}
        valueDecimals={0}
      />

      <XAxis
        categories={['']}
        visible={false}
        allowDecimals={false}
      />


      <YAxis
        id="totals"
        visible={true}
        allowDecimals={false}
        gridLineWidth={0}
      >
      </YAxis>
      {series}
    </HighchartsChart>
  )
};
