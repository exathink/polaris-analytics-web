import {tooltipHtml} from "../../../../components/charts/index";
import {ACTIVITY_LEVELS_REVERSED} from "../activityLevel";

import {Chart} from "../../../../components/charts";

export const TotalsBarChart = Chart(
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
          name: activityLevel.display_name,
          id: activityLevel.display_name,
          key: activityLevel.display_name,
          data: [totalsByActivityLevel[activityLevel.display_name]],
          color: activityLevel.color,
          pointWidth: 1000
        }));


        const title = `${props.orientation === 'vertical' ? props.model.subject_label : 'Activity Levels'} `;


        return {
          chart: {
            type: props.orientation === 'vertical' ? 'column' : 'bar',
            backgroundColor: props.chartBackgroundColor,
            spacing: [5,5,0,5]
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              dataLabels: {
                enabled: !props.minimized,
                format: `{series.name} {percentage}%`,
                rotation: props.orientation === 'vertical' ? 270 : 0
              }
            }
          },
          title: {
            text: title,
            align: props.orientation === 'vertical' ? 'center' : 'left'
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
            max: props.model.data.length,
            allowDecimals: false,
            gridLineWidth: 0,
            plotLines: props.orientation === 'vertical' ? [{
              value: props.model.data.length,
              width: 2,
              color: 'grey',
              dashStyle: 'ShortDot',
              label: {
                text: `${props.model.data.length}`,
                align: 'center',
                textAlign: 'right',
              }
            }]:[],
          },
          series: series,
          legend: {
            enabled: false
          }
        };
      }
  }
);



