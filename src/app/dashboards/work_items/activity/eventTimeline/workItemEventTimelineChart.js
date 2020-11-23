import { Chart, tooltipHtml } from "../../../../framework/viz/charts";
import { DefaultSelectionEventHandler } from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {
  capitalizeFirstLetter,
  elide,
  pick,
  toMoment,
  epoch
} from "../../../../helpers/utility";
import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
} from "../../../shared/config";
import { formatDateTime } from "../../../../i18n";

const workItemEventSymbol = {
  unmapped: "triangle",
  backlog: "triangle",
  open: "diamond",
  wip: "diamond",
  complete: "diamond",
  closed: "triangle-down",
};

export function getWorkItemEvents(workItem) {
  return workItem.workItemEvents
    .filter(
      /* filter out backlog events for work items that are not in closed state */
      (timelineEvent) => (workItem.stateType !== "closed" ? timelineEvent.newStateType !== "backlog" : true)
    )
    .map((timelineEvent, index) => {

      const newStateType = timelineEvent.newStateType || "unmapped";
      return {
        x: epoch(timelineEvent.eventDate),
        y: 0,

        marker: {
          symbol: workItemEventSymbol[newStateType],
          radius: 6,
        },
        color: WorkItemStateTypeColor[newStateType],
        timelineEvent: timelineEvent,
        workItem: workItem,
        eventType: "WorkItemEvent",
      };
    });
}

export function getWorkItemCommitEvents(workItem) {
  return workItem.workItemCommits.map((timelineEvent, index) => {

    return {
      x: epoch(timelineEvent.commitDate),
      y: 1,

      marker: {
        symbol: "circle",
        radius: 4,
      },
      timelineEvent: timelineEvent,
      workItem: workItem,
      eventType: "Commit",
    };
  });
}


export function getWorkItemPullRequestEvents(workItem) {
  // we can get up to 2 points for a pull request, an opened point and optionally a closed/merged point
  // so we do a flatMap of an array with up to 2 points to build the pull request series data
  // from the list of pull requests.
  return workItem.workItemPullRequests.flatMap((pullRequest) => {
    return [
      {
        x: epoch(pullRequest.createdAt),
        y: 2,
        marker: {
          symbol: "triangle",
          radius: 4,
        },
        color:
          pullRequest.endDate != null
            ? Colors.PullRequestStateType["open"]
            : Colors.PullRequestStateType["closed"],
        timelineEvent: pullRequest,
        workItem: workItem,
        eventType: "PullRequestCreated",
      },
      ...(pullRequest.endDate != null
        ? [
            {
              x: epoch(pullRequest.endDate),
              y: 2,
              marker: {
                symbol: "triangle-down",
                radius: 4,
              },
              color: Colors.PullRequestStateType["closed"],
              timelineEvent: pullRequest,
              workItem: workItem,
              eventType: "PullRequestCompleted",
            },
          ]
        : []),
    ];
  });
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

  getConfig: ({ workItem, context, intl }) => {
    const series_data = [
      ...getWorkItemEvents(workItem),
      ...getWorkItemCommitEvents(workItem),
      ...getWorkItemPullRequestEvents(workItem),
    ];

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
        categories: ["Events", "Commits", "Code Reviews"],
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
          const { timelineEvent: event, eventType } = this.point;
          const formatDate = (date) =>
            `${formatDateTime(intl, toMoment(date))}`;

          // make sure eventType has matching key in this object to get the formatter
          const tooltipFormatters = {
            WorkItemEvent: () => {
              const header = `Phase: ${
                WorkItemStateTypeDisplayName[event.newStateType || "unmapped"]
              }`;
              const transition = `State: ${
                event.previousState
                  ? `${capitalizeFirstLetter(event.previousState)} -> `
                  : ``
              } ${capitalizeFirstLetter(event.newState)} `;
              return tooltipHtml({
                header: `${header}<br/>${transition}`,
                body: [
                  [
                    `Date: `,
                    `${formatDateTime(intl, toMoment(event.eventDate))}`,
                  ],
                ],
              });
            },
            Commit: () => {
              const commit = `Commit: ${event.committer} committed to ${event.repository} on branch ${event.branch}`;
              return tooltipHtml({
                header: `${commit}`,
                body: [
                  [`Message: `, `${elide(event.commitMessage, 60)}`],
                  [`Author: `, `${event.author}`],
                  [
                    `Date: `,
                    `${formatDateTime(intl, toMoment(event.commitDate))}`,
                  ],
                ],
              });
            },
            PullRequestCreated: () => {
              const {
                repositoryName,
                displayId,
                name,
                age,
                createdAt,
                endDate,
              } = event;
              const stateKey = endDate ? "Time to Review: " : "Age: ";
              return tooltipHtml({
                header: `${repositoryName}:${displayId}`,
                body: [
                  [`Title: `, name],
                  [`Opened: `, formatDate(createdAt)],
                  [stateKey, `${intl.formatNumber(age)} Days`],
                ],
              });
            },
            PullRequestCompleted: () => {
              const {
                repositoryName,
                displayId,
                name,
                age,
                state,
                endDate,
              } = event;
              return tooltipHtml({
                header: `${repositoryName}:${displayId}`,
                body: [
                  [`Title: `, name],
                  [capitalizeFirstLetter(state), formatDate(endDate)],
                  [`Time to Review: `, `${intl.formatNumber(age)} Days`],
                ],
              });
            },
          };

          return tooltipFormatters[eventType]();
        },
      },
      series: [
        {
          name: "timeline",
          pointWidth: 20,
          data: series_data,
          turboThreshold: 0,
          allowPointSelect: true,
          animation: false
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
