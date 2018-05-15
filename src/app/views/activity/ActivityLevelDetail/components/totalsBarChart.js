import React from 'react';
import type {Props} from "../model";
import {tooltipHtml, ColumnSeries, Chart, HighchartsChart, Title, Tooltip, XAxis, YAxis, Debug} from "../../../../components/charts/index";
import {ACTIVITY_LEVELS_REVERSED} from "../activityLevel";

export const TotalsBarChart = (props: Props) => {
  const totalsByActivityLevel = props.model.data.reduce(
    (totals, activitySummary) => {
      let level = activitySummary.activity_level.display_name;
      totals[level] = (totals[level] || 0) + 1;
      return totals
    },
    {});


  const series = ACTIVITY_LEVELS_REVERSED.map(activityLevel => (
    <ColumnSeries
      name={activityLevel.display_name}
      id={activityLevel.display_name}
      key={activityLevel.display_name}
      data={[totalsByActivityLevel[activityLevel.display_name]]}
      color={activityLevel.color}
    />
  ));

  const formatTooltip = (point) => {
    return tooltipHtml({
      header: `${point.series.name}`,
      body: [
        [`${point.percentage.toFixed(0)}%`],
        (props.minimized? [`${point.y}`] : [``])
      ]
    });
  };

  const title = `${props.model.subject_label}s`;

  return (
    <HighchartsChart plotOptions={{
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: !props.minimized,
          format:`{point.y}`,
          rotation: 270
        }
      }
    }}>
      <Chart
        type={'column'}
      />
      <Title>{title}</Title>

      <Tooltip
        useHTML={true}
        formatter={formatTooltip}
        valueDecimals={0}
        followPointer={true}
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
        plotLines={[{
          value: props.model.data.length,
          width: 2,
          color: 'grey',
          dashStyle: 'ShortDot',
          label: {
            text: `${props.model.data.length}`,
            align: 'center',
            textAlign: 'right',
          }
        }]}
      >
      </YAxis>
      {series}
      <Debug varName={'totalsBar'}/>
    </HighchartsChart>
  )
};
