import React from "react";
import {getChartConfig, renderChart} from "../../../../../test/app-test-utils";
import {
  getWorkItemCommitEvents,
  getWorkItemEvents,
  getWorkItemPullRequestEvents,
  WorkItemEventsTimelineChart,
} from "./workItemEventTimelineChart";
import {getWorkItem} from "./workItemEventTimelineWidget";

const mockApiResponse = require("../../../../../mockApiResponse/workItem_workItemEvents.json");

describe("workItemEventTimelineChart", () => {
  const workItem = getWorkItem(mockApiResponse.data);
  // render the chart with mocked api response
  const configSpy = jest.fn((x) => x);
  const _props = {
    workItem,
    view: "primary",
    context: {},
    configSpy,
  };
  renderChart(<WorkItemEventsTimelineChart {..._props} />);

  const configFromChart = getChartConfig(configSpy);

  // essentially testing return value of getConfig (from configProvider) function.
  test("Given the props for Chart Component, HighChart should receive correct config", () => {
    const expected = {
      chart: {
        type: "scatter",
      },
      title: {
        text: "Timeline",
      },
      xAxis: {
        type: "datetime",
      },
      yAxis: {
        categories: ["Events", "Commits", "Code Reviews"],
        reversed: true,
        labels: {
          align: "left",
        },
      },
      series: [
        {
          name: "timeline",
        },
      ],
      legend: {
        enabled: false,
      },
      time: {
        useUTC: false,
      },
    };

    const actual = {
      chart: {
        type: configFromChart.chart.type,
      },
      title: {
        text: configFromChart.title.text,
      },
      xAxis: {
        type: configFromChart.xAxis.type,
      },
      yAxis: {
        categories: configFromChart.yAxis.categories,
        reversed: configFromChart.yAxis.reversed,
        labels: {
          align: configFromChart.yAxis.labels.align,
        },
      },
      series: [
        {
          name: configFromChart.series[0].name,
        },
      ],
      legend: {
        enabled: configFromChart.legend.enabled,
      },
      time: {
        useUTC: configFromChart.time.useUTC,
      },
    };

    // asserting on main properties of returned config from Chart component.
    expect(expected).toEqual(actual);
  });

  test("should return correct points for workItem events given the data from api", () => {
    const series_data = [
      ...getWorkItemEvents(workItem),
      ...getWorkItemCommitEvents(workItem),
      ...getWorkItemPullRequestEvents(workItem),
    ];
    const expectedPoints = series_data;
    const actualPoints = configFromChart.series[0].data;

    expect(expectedPoints).toEqual(actualPoints);
  });


  test("render minimum one and maximum two points on chart for every pull request", () => {
    const p1 = mockApiResponse.data.workItem.pullRequests.edges.filter(
      (e) => e.node.createdAt != null && e.node.endDate != null
    ).length;
    const p2 = mockApiResponse.data.workItem.pullRequests.edges.filter((e) => e.node.endDate == null).length;
  
    const actualPoints = configFromChart.series[0].data;
    const pullReqEvents = actualPoints.filter(
      (p) => p.eventType === "PullRequestCreated" || p.eventType === "PullRequestCompleted"
    ).length;
  
    expect(2*p1 + p2).toBe(pullReqEvents)
  });

});

