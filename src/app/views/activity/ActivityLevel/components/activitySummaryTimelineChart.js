import {findVisibleLevels, getActivityLevel} from "../activityLevel";
import {tooltipHtml} from "../../../../components/charts/index";
import {Chart} from "../../../../components/charts/index";
import {displaySingular, i18n} from "../../../../i18n";


export const ActivitySummaryTimelineChart = Chart({
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
            categories: sortedDomainData.map(activitySummary => activitySummary.entity_name),
            reversed: true
          },
          tooltip: {
            useHTML: true,
            formatter: function(){
              return tooltipHtml({
                header: `${childContextName}: ${this.point.yCategory}`,
                body: [
                  [`${i18n(intl, 'Earliest Commit')}: `, `${intl.formatDate(this.point.x)}`],
                  [`${i18n(intl, 'Latest Commit')}: `, `${intl.formatDate(this.point.x2)}`],
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

