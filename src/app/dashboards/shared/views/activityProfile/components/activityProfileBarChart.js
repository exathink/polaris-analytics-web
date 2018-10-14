import {tooltipHtml} from "../../../../../framework/viz/charts/index";
import {ACTIVITY_LEVELS_REVERSED} from "../../../helpers/activityLevel";
import {Chart} from "../../../../../framework/viz/charts/index";
import {formatTerm} from "../../../../../i18n/index";



export const ActivityProfileBarChart = Chart(
  {
    chartUpdateProps: ({model}) => ({
      model
    }),
    getConfig:
      ({model,  orientation, minimized, chartBackgroundColor,  intl}) => {
        let totalsByActivityLevel = null;
        if (model.activityLevelSummary != null){
          // use the precomputed summary values from server. Constant size regardless of data size.
          totalsByActivityLevel = ACTIVITY_LEVELS_REVERSED.reduce(
            (totals, level) => {
              const levelTotal = model.activityLevelSummary[level.activity_level_summary_property]
              totals[level.display_name] = levelTotal;
              totals.total = totals.total + levelTotal;
              return totals;
            },
            {total: 0}
          )
        } else {
          // compute the summary value on the client from the underlying row data
          // will be slow for large data sizes
          totalsByActivityLevel = model.data.reduce(
            (totals, activitySummary) => {
              let level = activitySummary.activity_level.display_name;
              totals[level] = (totals[level] || 0) + 1;
              return totals
            },
            {total: model.data.length});
        }

        const series = ACTIVITY_LEVELS_REVERSED.map(activityLevel => ({
          name: formatTerm(intl, activityLevel.display_name),
          id: activityLevel.display_name,
          key: activityLevel.display_name,
          data: [totalsByActivityLevel[activityLevel.display_name]],
          color: activityLevel.color,
          pointWidth: 1000
        }));


        const title = `${orientation === 'vertical' ? formatTerm(intl, 'Profile') : formatTerm(intl, 'Activity Profile')} `;


        return {
          chart: {
            type: orientation === 'vertical' ? 'column' : 'bar',
            backgroundColor: chartBackgroundColor,
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
                rotation: orientation === 'vertical' ? 270 : 0,
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
            align: orientation === 'vertical' ? 'center' : 'left'
          },
          tooltip: {
            useHTML: true,
            formatter: function(){
              return tooltipHtml({
                header: `${this.series.name}`,
                body: [
                  [`${this.y} ${orientation !== 'vertical' ? ` (${this.percentage.toFixed(0)}%)` :``}`]
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
            max: totalsByActivityLevel.total,
            allowDecimals: false,
            gridLineWidth: 0,
            plotLines: orientation === 'vertical' ? [{
              value: model.data.length,
              width: 2,
              color: 'grey',
              dashStyle: 'ShortDot',
              label: {
                text: `${model.data.length}`,
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



