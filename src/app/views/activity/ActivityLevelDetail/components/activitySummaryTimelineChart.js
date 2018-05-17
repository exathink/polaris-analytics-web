import React from "react";
import {findVisibleLevels, getActivityLevel} from "../activityLevel";
import {tooltipHtml} from "../../../../components/charts/index";
import {formatDate} from "../../../../helpers/utility";
import {BasicChart} from "../../../../components/charts/index";


export const ActivitySummaryTimelineChart = BasicChart({
    mapPropsToState:
      (props) => ({
        model: props.model,
        selectedActivities: props.selectedActivities
      }),
    getConfig:
      (props) => {
        const model = props.model;
        const domain_data = props.selectedActivities || findVisibleLevels(model.data);
        const sortedDomainData = domain_data.sort((a, b) => a.earliest_commit.valueOf() - b.earliest_commit.valueOf());


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
            title: {text: model.subject_label},
            categories: sortedDomainData.map(activitySummary => activitySummary.entity_name),
            reversed: true
          },
          toolTip: {
            useHTML: true,
            formatter: (point) => {
              return tooltipHtml({
                header: `${model.subject_label_long}: ${point.point.yCategory}`,
                body: [
                  ['Earliest Commit: ', `${formatDate(point.point.x, 'MM-DD-YYYY')}`],
                  ['Latest Commit: ', `${formatDate(point.point.x2, 'MM-DD-YYYY')}`],
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

