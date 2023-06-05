import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, elide, epoch, getMinMaxDatesFromRange, getWeekendPlotBands, pick, toMoment} from "../../../../helpers/utility";
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
      color: timelineEvent.numParents > 1 ? Colors.Commits.merge : Colors.Commits.nonMerge,
      timelineEvent: timelineEvent,
      workItem: workItem,
      eventType: "Commit",
      cursor: 'pointer'
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
            ? Colors.PullRequestStateType["closed"]
            : Colors.PullRequestStateType["open"],
        timelineEvent: pullRequest,
        workItem: workItem,
        eventType: "PullRequestCreated",
        cursor: 'pointer'
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
              cursor: 'pointer'
            },
          ]
        : []),
    ];
  });
}

// make sure eventType has matching key in this object to get the formatter
export const tooltipFormatters = {
  WorkItemEvent: ({timelineEvent: event}, intl) => {
    const header = `Phase: ${WorkItemStateTypeDisplayName[event.newStateType || "unmapped"]}`;
    const transition = `State: ${
      event.previousState ? `${capitalizeFirstLetter(event.previousState)} -> ` : ``
    } ${capitalizeFirstLetter(event.newState)} `;
    return tooltipHtml({
      header: `${header}<br/>${transition}`,
      body: [[`Date: `, `${formatDateTime(intl, toMoment(event.eventDate))}`]],
    });
  },
  Commit: ({timelineEvent: event}, intl) => {
    const commit = `Commit: ${event.committer} committed to ${event.repository} on branch ${event.branch}`;
    return tooltipHtml({
      header: `${commit}`,
      body: [
        [`Message: `, `${elide(event.commitMessage, 60)}`],
        [`Author: `, `${event.author}`],
        [`Date: `, `${formatDateTime(intl, toMoment(event.commitDate))}`],
      ],
    });
  },
  PullRequestCreated: ({timelineEvent: event}, intl) => {
    const {repositoryName, displayId, name, age, createdAt, endDate} = event;
    const stateKey = endDate ? "Time to Review: " : "Age: ";
    return tooltipHtml({
      header: `${repositoryName}:${displayId}`,
      body: [
        [`Title: `, name],
        [`Opened: `, `${formatDateTime(intl, toMoment(createdAt))}`],
        [stateKey, `${intl.formatNumber(age)} Days`],
      ],
    });
  },
  PullRequestCompleted: ({timelineEvent: event}, intl) => {
    const {repositoryName, displayId, name, age, state, endDate} = event;
    return tooltipHtml({
      header: `${repositoryName}:${displayId}`,
      body: [
        [`Title: `, name],
        [`${capitalizeFirstLetter(state)}: `, `${formatDateTime(intl, toMoment(endDate))}`],
        [`Time to Review: `, `${intl.formatNumber(age)} Days`],
      ],
    });
  },
};

function getDeliveryCyclePlotLines(workItem, intl) {
  const {workItemDeliveryCycles} = workItem;
  return workItemDeliveryCycles.filter(
    (deliveryCycle) => deliveryCycle.endDate != null
  ).map(
    (deliveryCycle) => ({
      color: 'blue',
      value: epoch(deliveryCycle.endDate),
      dashStyle: 'solid',
      width: 1,
      label: {
        text: deliveryCycle.cycleTime ? `C=${intl.formatNumber(deliveryCycle.cycleTime)} days` : ``,
        align: 'right',
        verticalAlign: 'bottom',
      }
    })
  );
}

export const WorkItemEventsTimelineChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItem"),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => {
    // keeping values as functions for lazy evaluation.
    const events = {
      WorkItemEvent: (point) => ({
        type: "event",
        timelineEventId: point.timelineEvent.id,
      }),
      Commit: (point) => ({
        type: "commit",
        name: point.timelineEvent.name,
        key: point.timelineEvent.key,
        repositoryUrl: point.timelineEvent.repositoryUrl,
        integrationType: point.timelineEvent.integrationType,
        commitHash: point.timelineEvent.commitHash,
      }),
      PullRequestCreated: (point) => ({
        type: "pullRequest",
        webUrl: point.timelineEvent.webUrl,
      }),
      PullRequestCompleted: (point) => ({
        type: "pullRequest",
        webUrl: point.timelineEvent.webUrl,
      }),
    };

    return points.map((point) => {
      const {eventType} = point;

      return {
        workItem: point.workItem,
        event: events[eventType](point),
      };
    });
  },

  getConfig: ({workItem, context, intl, fullScreen}) => {
    const series_data = [
      ...getWorkItemEvents(workItem),
      ...getWorkItemCommitEvents(workItem),
      ...getWorkItemPullRequestEvents(workItem),
    ];

    const dateRange = [
      ...getWorkItemEvents(workItem).map((e) => toMoment(e.timelineEvent.eventDate)),
      ...getWorkItemCommitEvents(workItem).map((e) => toMoment(e.timelineEvent.commitDate)),
      ...getWorkItemPullRequestEvents(workItem).filter(e => e.timelineEvent.endDate != null).map((e) => toMoment(e.timelineEvent.endDate)),
    ];
    const [startDate, endDate] = getMinMaxDatesFromRange(dateRange);
    return {
      chart: {
        type: "scatter",
        backgroundColor: Colors.Chart.backgroundColor,
        zoomType: "xy",
        panning: true,
        panKey: "shift",
      },
      title: {
        text: "Delivery Timeline",
        align: "center",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: null,
        },
        plotLines: getDeliveryCyclePlotLines(workItem, intl),
        plotBands: [
          ...getWeekendPlotBands(startDate, endDate)
        ]
      },
      yAxis: {
        id: "y-items",
        title: {
          text: "Signals",
        },
        categories: ["State Transitions", "Commits", "Review Requests"],
        reversed: true,
        labels: {
          align: "left",
          reserveSpace: true,
        },
      },
      tooltip: {
        useHTML: true,
        outside: fullScreen === false,
        hideDelay: 50,
        formatter: function () {
          return tooltipFormatters[this.point.eventType](this.point, intl);
        },
      },
      series: [
        {
          name: "timeline",
          pointWidth: 20,
          data: series_data,
          turboThreshold: 0,
          allowPointSelect: true,
          animation: false,
          cursor: 'pointer'
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
