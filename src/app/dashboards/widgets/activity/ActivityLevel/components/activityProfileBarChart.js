import {tooltipHtml} from "../../../../../framework/viz/charts/index";
import {ACTIVITY_LEVELS_REVERSED} from "../activityLevel";

import {Chart} from "../../../../../framework/viz/charts/index";

import {i18n} from "../../../../../i18n/index";

Math.easeOutBounce = function (pos) {
  if ((pos) < (1 / 2.75)) {
    return (7.5625 * pos * pos);
  }
  if (pos < (2 / 2.75)) {
    return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
  }
  if (pos < (2.5 / 2.75)) {
    return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
  }
  return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

export const ActivityProfileBarChart = Chart(
  {
    chartUpdateProps: (props) => ({
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

        const intl = props.intl;


        const series = ACTIVITY_LEVELS_REVERSED.map(activityLevel => ({
          name: i18n(intl, activityLevel.display_name),
          id: activityLevel.display_name,
          key: activityLevel.display_name,
          data: [totalsByActivityLevel[activityLevel.display_name]],
          color: activityLevel.color,
          pointWidth: 1000
        }));


        const title = `${props.orientation === 'vertical' ? i18n(intl, 'Profile') : i18n(intl, 'Activity Profile')} `;


        return {
          chart: {
            type: props.orientation === 'vertical' ? 'column' : 'bar',
            backgroundColor: props.chartBackgroundColor,
            spacing: [5,5,5,5]
          },
          plotOptions: {
            series: {
              stacking: 'normal',
              animation: {
                duration: 300
              },
              dataLabels: {
                enabled: true,
                align: 'center',
                format: `<b>{series.name}</b><br>{percentage:.1f} %`,
                rotation: props.orientation === 'vertical' ? 270 : 0,
                filter: {
                  property: 'percentage',
                  operator: '>',
                  value: 10
                }
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



