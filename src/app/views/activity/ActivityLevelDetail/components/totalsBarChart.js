import React from 'react';
import type {Props} from "../model";
import {tooltipHtml} from "../../../../components/charts/index";
import {ACTIVITY_LEVELS_REVERSED} from "../activityLevel";

import {BasicChart} from "../../../../components/charts";

export const TotalsBarChart = BasicChart(
  {
    mapPropsToState: (props) => ({
      model: props.model
    }),
    getConfig:
      (props) => {
        const totalsByActivityLevel = props.model.data.reduce(
          (totals, activitySummary) => {
            let level = activitySummary.activity_level.display_name;
            totals[level] = (totals[level] || 0) + 1;
            return totals
          },
          {});


        const series = ACTIVITY_LEVELS_REVERSED.map(activityLevel => ({
          type: 'column',
          name: activityLevel.display_name,
          id: activityLevel.display_name,
          key: activityLevel.display_name,
          data: [totalsByActivityLevel[activityLevel.display_name]],
          color: activityLevel.color
        }));


        const title = `${props.model.subject_label}s`;


        return {
          chart: {
            type: 'column',
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              dataLabels: {
                enabled: !props.minimized,
                format: `{point.y}`,
                rotation: 270
              }
            }
          },
          title: {
            text: title
          },
          tooltip: {
            useHTML: true,
            formatter: function(){
              return tooltipHtml({
                header: `${this.series.name}`,
                body: [
                  [`${this.percentage.toFixed(0)}%`],
                  (props.minimized ? [`${this.y}`] : [``])
                ]
              });
            },
            valueDecimals: 0,
            followPointer: true
          },
          xAxis: {
            categories: [''],
            visible: false,
            allowDecimals: false
          },

          yAxis: {
            id: 'totals',
            visible: true,
            title: {
              text: null
            },
            allowDecimals: false,
            gridLineWidth: 0,
            plotLines: [{
              value: props.model.data.length,
              width: 2,
              color: 'grey',
              dashStyle: 'ShortDot',
              label: {
                text: `${props.model.data.length}`,
                align: 'center',
                textAlign: 'right',
              }
            }]
          },
          series: series,
          legend: {
            enabled: false
          }
        };
      }
  }
);



