import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, elide, pick, toMoment} from "../../../../helpers/utility";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../../shared/config";
import {formatDateTime} from "../../../../i18n";

const workItemEventSymbol = {
  unmapped: "triangle",
  backlog: "triangle",
  open: "diamond",
  wip: "diamond",
  complete: "diamond",
  closed: "triangle-down",
};

// TODO: not sure about the standard colors we use
const pullRequestStateTypeColor = {
  created: "#c4ab49",
  completed: "#7824b5",
};

function getPullRequestSeries(workItem) {
  return workItem.workItemPullRequests
    .map((timelineEvent) => {
      // minimum of 1 and a maximum of two “events” from a single pull request
      // basic assumption: createdAt will always be available if pullRequest is there
      const createdAt = toMoment(timelineEvent.createdAt);
      let eventType = "created";
      const result = [
        {
          x: createdAt.valueOf(),
          y: 2,
          marker: {
            symbol: "triangle",
            radius: 4,
          },
          color: pullRequestStateTypeColor[eventType],
          timelineEvent: timelineEvent,
          workItem: workItem,
        },
      ];

      // check for an existence of endDate
      if (timelineEvent.endDate) {
        const endDate = toMoment(timelineEvent.endDate);
        eventType = "closed";
        result.push({
          x: endDate.valueOf(),
          y: 2,
          marker: {
            symbol: "triangle-down",
            radius: 4,
          },
          color: pullRequestStateTypeColor[eventType],
          timelineEvent: timelineEvent,
          workItem: workItem,
        });
      }

      return result;
    })
    .flat();
}

export const WorkItemEventsTimelineChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItem"),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) =>
    points.map((point) => ({
      workItem: point.workItem,
      event:
        point.timelineEvent.eventDate != null
          ? {
              type: "event",
              timelineEventId: point.timelineEventId,
            }
          : {
              type: "commit",
              name: point.timelineEvent.name,
              key: point.timelineEvent.key,
            },
    })),

  getConfig: ({workItem, context, intl}) => {
    const series_data = [
      ...workItem.workItemEvents
        .filter(
          /* filter out backlog events for work items that are not in closed state */
          (timelineEvent) => (workItem.stateType !== "closed" ? timelineEvent.newStateType !== "backlog" : true)
        )
        .map((timelineEvent, index) => {
          const eventDate = toMoment(timelineEvent.eventDate);
          const newStateType = timelineEvent.newStateType || "unmapped";
          return {
            x: eventDate.valueOf(),
            y: 0,
            z: 3,
            marker: {
              symbol: workItemEventSymbol[newStateType],
              radius: 6,
            },
            color: WorkItemStateTypeColor[newStateType],
            timelineEvent: timelineEvent,
            workItem: workItem,
          };
        }),
      ...workItem.workItemCommits.map((timelineEvent, index) => {
        const eventDate = toMoment(timelineEvent.commitDate);
        return {
          x: eventDate.valueOf(),
          y: 1,
          z: 3,
          marker: {
            symbol: "circle",
            radius: 4,
          },
          timelineEvent: timelineEvent,
          workItem: workItem,
        };
      }),
    ];

    const pullRequestSeries = getPullRequestSeries(workItem);

    return {
      chart: {
        type: "scatter",
        backgroundColor: Colors.Chart.backgroundColor,
        zoomType: "xy",
        panning: true,
        panKey: "shift",
      },
      title: {
        text: "Timeline",
        align: "center",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: null,
        },
      },
      yAxis: {
        id: "y-items",
        title: {
          text: null,
        },
        categories: ["Events", "Commits", "Pull Requests"],
        reversed: true,
        labels: {
          align: "left",
          reserveSpace: true,
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const event = this.point.timelineEvent;
          if (event["__typename"] === "WorkItemEvent") {
            const header = `Phase: ${WorkItemStateTypeDisplayName[event.newStateType || "unmapped"]}`;
            const transition = `State: ${
              event.previousState ? `${capitalizeFirstLetter(event.previousState)} -> ` : ``
            } ${capitalizeFirstLetter(event.newState)} `;
            return tooltipHtml({
              header: `${header}<br/>${transition}`,
              body: [[`Date: `, `${formatDateTime(intl, toMoment(event.eventDate))}`]],
            });
          } else if (event["__typename"] === "Commit") {
            const commit = `Commit: ${event.committer} committed to ${event.repository} on branch ${event.branch}`;
            return tooltipHtml({
              header: `${commit}`,
              body: [
                [`Message: `, `${elide(event.commitMessage, 60)}`],
                [`Author: `, `${event.author}`],
                [`Date: `, `${formatDateTime(intl, toMoment(event.commitDate))}`],
              ],
            });
          } else if (event["__typename"] === "PullRequest") {
            const {repositoryName, displayId, name, age, state} = event;
            const stateKey = state === "open" ? "Age: " : "Time to Review: "
            return tooltipHtml({
              header: `${repositoryName}:${displayId}`,
              body: [
                [`Title: `, name],
                [`State: `, state],
                [stateKey, `${intl.formatNumber(age)} Days`],
              ],
            });
          }
        },
      },
      series: [
        {
          name: "timeline",
          pointWidth: 20,
          data: series_data,
          turboThreshold: 0,
          allowPointSelect: true,
        },
        {
          // TODO: not sure about the naming convention for this.
          name: "pullrequest-timeline",
          pointWidth: 80,
          data: pullRequestSeries,
          turboThreshold: 0,
          allowPointSelect: true,
        },
      ],
      legend: {
        enabled: false,
      },
      time: {
        // Since we are already passing in UTC times we
        // dont need the chart to translate the time to UTC
        // This makes sure the tooltips text matches the timeline
        // on the axis.
        useUTC: false,
      },
    };
  },
});
