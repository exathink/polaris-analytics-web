import {findVisibleLevels, getActivityLevel} from "../../../helpers/activityLevel";
import {Chart, tooltipHtml} from "../../../../../framework/viz/charts/index";
import {displaySingular, formatTerm} from "../../../../../i18n/index";

export const ActivityLevelsTimelineChart = Chart({
    chartUpdateProps:
      (props) => ({
        model: props.model,
        selectedActivities: props.selectedActivities
      }),
    getConfig:
      (props) => {
        const model = props.model;
        const domain_data = props.selectedActivities || findVisibleLevels(model.data);
        const sortedDomainData = domain_data.sort((a, b) => a.earliest_commit.valueOf() - b.earliest_commit.valueOf());
        const intl = props.intl;
        const childContextName = displaySingular(intl, model.childContext);

        return {
          chart: {
            type: 'xrange',
          },
          title: {
            text: null
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Timeline'
            }
          },
          yAxis: {
            id: 'y-items',
            title: {text: childContextName},
            categories: sortedDomainData.map(activitySummary => `${activitySummary.entity_name}`),
            reversed: true,
            labels: {
              useHTML: true,
              events: {
                /* This code relies on the custom events module which is breaks core highcharts code in many places
                *  so we have turned it off for now and this click event will have no effect. Revisit when we
                *  can use the module more reliably.
                * */
                click: function () {
                  const cat_index = this.axis.categories.indexOf(this.value);
                  const activity_summary = sortedDomainData[cat_index];
                  model.context.navigate(model.childContext, activity_summary.entity_name, activity_summary.id)
                }
              }
            }
          },
          tooltip: {
            useHTML: true,
            formatter: function(){
              return tooltipHtml({
                header: `${childContextName}: ${this.point.yCategory}`,
                body: [
                  [`${formatTerm(intl, 'Earliest Commit')}: `, `${intl.formatDate(this.point.x)}`],
                  [`${formatTerm(intl, 'Latest Commit')}: `, `${intl.formatDate(this.point.x2)}`],
                ]
              });
            }
          },
          series: [
            {
              key: 'timeline',
              id: 'timeline',
              name: model.level,
              maxPointWidth: 10,
              data: sortedDomainData.map((activitySummary, index) => ({
                x: activitySummary.earliest_commit.valueOf(),
                x2: activitySummary.latest_commit.valueOf(),
                y: index,
                color: getActivityLevel(activitySummary).color
              }))
            }
          ],
          legend: {
            enabled: false
          }
        };
      }


  }
);

