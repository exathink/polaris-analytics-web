import React from "react";
import {
  renderedChartConfig,
  renderedTooltipConfig,
} from "../../../../framework/viz/charts/chart-test-utils";

import {
  expectSetsAreEqual,
  formatDate, formatNumber
} from "../../../../../test/test-utils";

import {WorkItemEventsTimelineChart} from "./workItemEventTimelineChart";
import {Colors} from "../../../shared/config";
import {elide, epoch, toMoment} from "../../../../helpers/utility";


// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});



const workItemFixture = {
  id: "V29ya0l0ZW06NjVlMDE1ZmEtNGI5Mi00NTU2LWIwZmItOWYyNTcxMTAzNmM5",
  name: "Show Pull Requests on Card Timeline",
  displayId: "PO-357",
  workItemType: "story",
  state: "Code-Review-Needed",
  stateType: "wip",
  workItemCommits: [],
  workItemEvents: [],
  workItemPullRequests: [],
  workItemDeliveryCycles: [],
};

const commitsFixture = [
  {
    name: "8f48c998",
    key: "ddd43e3e-6bd2-4896-a380-41b923188cd4:8f48c998fd4e686d7f15466bba04b1456d76386f",
    commitHash: "8f48c998fd4e686d7f15466bba04b1456d76386f",
    commitMessage:
      "Merge branch 'PO-357' into 'master'\n\nResolve PO-357\n\nCloses PO-357\n\nSee merge request polaris-services/polaris-vcs-service!11",
    commitDate: "2020-11-10T23:45:10",
    committer: "Krishna Kumar",
    author: "Krishna Kumar",
    authorDate: "2020-11-10T23:45:10",
    branch: "master",
    repository: "polaris-vcs-service",
  },
  {
    name: "89ab2ef6",
    key: "35714c4a-e92e-4f41-9c34-f71181dc4375:89ab2ef6221169dc50a199ec9d0f63ebc105e713",
    commitHash: "89ab2ef6221169dc50a199ec9d0f63ebc105e713",
    commitMessage:
      "Merge branch 'PO-357' into 'master'\n\nAdded end_date and closed_at\n\nCloses PO-357\n\nSee merge request polaris-dbapi/polaris-repos-db!10",
    commitDate: "2020-11-10T23:44:12",
    committer: "Krishna Kumar",
    author: "Krishna Kumar",
    authorDate: "2020-11-10T23:44:12",
    branch: "master",
    repository: "polaris-repos-db",
  },
  {
    name: "a801c7e2",
    key: "b9909691-d076-488e-a911-49596b711529:a801c7e2559f6d4eb333acfe156647c248ba38dc",
    commitHash: "a801c7e2559f6d4eb333acfe156647c248ba38dc",
    commitMessage:
      "Merge branch 'PO-357' into 'master'\n\nAdded closed_at field to pull request summary message\n\nCloses PO-357\n\nSee merge request polaris-common/polaris-messaging!10",
    commitDate: "2020-11-10T23:43:35",
    committer: "Krishna Kumar",
    author: "Krishna Kumar",
    authorDate: "2020-11-10T23:43:35",
    branch: "master",
    repository: "polaris-messaging",
  },
  {
    name: "8d8adfb1",
    key: "f6b81d4f-bee5-44a8-9ebc-662157842839:8d8adfb1cae55030e5d4e06c480da001c3c07ff6",
    commitHash: "8d8adfb1cae55030e5d4e06c480da001c3c07ff6",
    commitMessage:
      "Merge branch 'PO-357' into 'master'\n\nResolve PO-357\n\nCloses PO-357\n\nSee merge request polaris-services/polaris-analytics-service!125",
    commitDate: "2020-11-10T23:42:13",
    committer: "Krishna Kumar",
    author: "Krishna Kumar",
    authorDate: "2020-11-10T23:42:13",
    branch: "master",
    repository: "polaris-analytics-service",
  },

  {
    name: "d0ef60d8",
    key: "f6b81d4f-bee5-44a8-9ebc-662157842839:d0ef60d8cd27d28632a8bad91208bca198327bc6",
    commitHash: "d0ef60d8cd27d28632a8bad91208bca198327bc6",
    commitMessage: "Added tests for Pull request node and branchref interface\n",
    commitDate: "2020-11-09T14:44:39",
    committer: "Pragya Goyal",
    author: "Pragya Goyal",
    authorDate: "2020-11-09T14:44:39",
    branch: "PO-357",
    repository: "polaris-analytics-service",
  },
  {
    name: "ed4ab051",
    key: "35714c4a-e92e-4f41-9c34-f71181dc4375:ed4ab051bb2a7a864c5e19d9630a572e8aabea0d",
    commitHash: "ed4ab051bb2a7a864c5e19d9630a572e8aabea0d",
    commitMessage: "Migration query fix\n",
    commitDate: "2020-11-09T14:41:39",
    committer: "Pragya Goyal",
    author: "Pragya Goyal",
    authorDate: "2020-11-09T14:41:39",
    branch: "PO-357",
    repository: "polaris-repos-db",
  },
  {
    name: "7740c06b",
    key: "ddd43e3e-6bd2-4896-a380-41b923188cd4:7740c06b4ebe56dd0cdd48ddc8a2674bfaa60e02",
    commitHash: "7740c06b4ebe56dd0cdd48ddc8a2674bfaa60e02",
    commitMessage: "Fixed tests\n",
    commitDate: "2020-11-09T12:03:26",
    committer: "Pragya Goyal",
    author: "Pragya Goyal",
    authorDate: "2020-11-09T12:03:26",
    branch: "PO-357",
    repository: "polaris-vcs-service",
  },
];

const workItemsFixture = [
  {
    id: "V29ya0l0ZW1FdmVudDo2NWUwMTVmYS00YjkyLTQ1NTYtYjBmYi05ZjI1NzExMDM2Yzk6MA==",
    state: "Code-Review-Needed",
    eventDate: "2020-11-01T22:26:23.731000",
    previousState: null,
    previousStateType: null,
    newState: "created",
    newStateType: "backlog",
  },
  {
    id: "V29ya0l0ZW1FdmVudDo2NWUwMTVmYS00YjkyLTQ1NTYtYjBmYi05ZjI1NzExMDM2Yzk6MQ==",
    state: "Code-Review-Needed",
    eventDate: "2020-11-03T00:18:25.814000",
    previousState: "created",
    previousStateType: "backlog",
    newState: "In Progress",
    newStateType: "wip",
  },
  {
    id: "V29ya0l0ZW1FdmVudDo2NWUwMTVmYS00YjkyLTQ1NTYtYjBmYi05ZjI1NzExMDM2Yzk6Mg==",
    state: "Code-Review-Needed",
    eventDate: "2020-11-09T14:52:29.562000",
    previousState: "In Progress",
    previousStateType: "wip",
    newState: "Code-Review-Needed",
    newStateType: "wip",
  },
];

const pullRequestsFixture = [
  {
    id: "UHVsbFJlcXVlc3Q6NWMzNzU5OTYtY2VlZi00MGQ4LTlkY2YtMmI3MWE3ODk3NWYw",
    name: "Added end_date and closed_at",
    key: "5c375996-ceef-40d8-9dcf-2b71a78975f0",
    displayId: "10",
    state: "merged",
    age: 1.48609416666667,
    createdAt: "2020-11-09T12:04:14.517000",
    endDate: "2020-11-10T23:44:13.505000",
    repositoryName: "polaris-repos-db",
    branchName: "PO-357",
  },
  {
    id: "UHVsbFJlcXVlc3Q6YjU2YWEzOTMtN2M3Mi00NDRiLTlhZDItZGEzMmRlZTgxMWQ0",
    name: "Resolve PO-357",
    key: "b56aa393-7c72-444b-9ad2-da32dee811d4",
    displayId: "125",
    state: "merged",
    age: 5.36025982638889,
    createdAt: "2020-11-05T15:03:27.846000",
    endDate: "2020-11-10T23:42:14.964000",
    repositoryName: "polaris-analytics-service",
    branchName: "PO-357",
  },
  {
    id: "UHVsbFJlcXVlc3Q6OWY2ZmY4OWMtMGRhYy00MTNlLTg0NzAtZWMzNmU2OWI3MGMz",
    name: "Resolve PO-357",
    key: "9f6ff89c-0dac-413e-8470-ec36e69b70c3",
    displayId: "11",
    state: "merged",
    age: 5.36438644675926,
    createdAt: "2020-11-05T15:00:27.749000",
    endDate: "2020-11-10T23:45:11.238000",
    repositoryName: "polaris-vcs-service",
    branchName: "PO-357",
  },
  {
    id: "UHVsbFJlcXVlc3Q6ZDljODJlZDktY2Q1NC00NmZlLWJkYjEtMTg3NjI3NWNiMTA4",
    name: "Added closed_at field to pull request summary message",
    key: "d9c82ed9-cd54-46fe-bdb1-1876275cb108",
    displayId: "10",
    state: "merged",
    age: 5.36403539351852,
    createdAt: "2020-11-05T14:59:23.097000",
    endDate: "2020-11-10T23:43:36.218000",
    repositoryName: "polaris-messaging",
    branchName: "PO-357",
  },
];

const commonChartProps = {
  backgroundColor: Colors.Chart.backgroundColor,
  zoomType: "xy",
  panning: true,
  panKey: "shift",
};

const fixedChartConfig = {
  chart: {
    type: "scatter",
    ...commonChartProps,
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
  },
  yAxis: {
    categories: ["State Transitions", "Commits", "Review Requests"],
    reversed: true,
    title: {
      text: "Signals",
    },
    labels: {
      align: "left",
      reserveSpace: true,
    },
  },
  legend: {
    enabled: false,
  },
  time: {
    useUTC: false,
  },
};

const fixedSeriesConfig = {
  name: "timeline",
  pointWidth: expect.any(Number),
  turboThreshold: 0,
  allowPointSelect: true,
  animation: false,
};

describe("workItemEventTimelineChart", () => {
  describe("when there are no commits, events, or pull requests", () => {
    const emptyWorkItem = {
      ...workItemFixture,
      workItemCommits: [],
      workItemEvents: [],
      workItemPullRequests: [],
      workItemDeliveryCycles: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [
        {
          ...fixedSeriesConfig,
          data: [],
        },
      ],
    };

    test("it renders an empty chart config in primary view", () => {
      expect(
        renderedChartConfig(<WorkItemEventsTimelineChart workItem={emptyWorkItem} view={"primary"} />)
      ).toMatchObject(expectedChartConfig);
    });

    test("it renders an empty chart config  in detail view", () => {
      expect(
        renderedChartConfig(<WorkItemEventsTimelineChart workItem={emptyWorkItem} view={"detail"} />)
      ).toMatchObject(expectedChartConfig);
    });
  });

  describe("commits timeline", () => {
    const workItemWithCommits = {
      ...workItemFixture,
      workItemCommits: commitsFixture,
    };

    const {
      series: [{data}],
    } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={workItemWithCommits} view={"primary"} />);

    test("it renders a chart with the correct numbers of data points ", () => {
      expect(data).toHaveLength(commitsFixture.length);
    });

    test("it maps commit dates to the x axis and sets y = 1 for each commit", () => {
      expectSetsAreEqual(
        data.map((point) => [point.x, point.y]),
        commitsFixture.map((commit) => [epoch(commit.commitDate), 1])
      );
    });

    test("it sets the marker symbol for  commit dates to circles ", () => {
      expectSetsAreEqual(
        data.map((point) => point.marker.symbol),
        ["circle"]
      );
    });

    test("it sets the event type field for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.eventType),
        ["Commit"]
      );
    });

    test("it sets the reference to the work item for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.workItem),
        [workItemWithCommits]
      );
    });

    test("should render the tooltip for commit event point", async () => {
      const [actual] = await renderedTooltipConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithCommits} view={"primary"} />,
        (points) => [points[0]]
      );

      const [commit] = workItemWithCommits.workItemCommits;
      expect(actual).toMatchObject({
        header: expect.stringMatching(/^Commit:.*/),
        body: [
          ["Message: ", expect.stringMatching(elide(commit.commitMessage, 60))],
          ["Author: ", expect.stringMatching(commit.author)],
          ["Date: ", formatDate(commit.commitDate)],
        ],
      });
    });
  });

  describe("workItems timeline", () => {
    const _workItemsFixture = workItemsFixture.filter((e) =>
      workItemFixture.stateType !== "closed" ? e.newStateType !== "backlog" : true
    );
    const workItemWithEvents = {
      ...workItemFixture,
      workItemEvents: _workItemsFixture,
    };

    const {
      series: [{data}],
    } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={workItemWithEvents} view={"primary"} />);

    test("it renders a chart with the correct numbers of data points ", () => {
      expect(data).toHaveLength(_workItemsFixture.length);
    });

    test("it maps workItem dates to the x axis and sets y = 0 for each workItem", () => {
      expectSetsAreEqual(
        data.map((point) => [point.x, point.y]),
        _workItemsFixture.map((workItem) => [epoch(workItem.eventDate), 0])
      );
    });

    test("it sets the marker symbol for  unmapped and backlog workItem dates to triangle ", () => {
      const workItemWithUnmappedBacklogEvents = {
        ...workItemFixture,
        workItemEvents: [
          {
            id: "V29ya0l0ZW1FdmVudDo2NWUwMTVmYS00YjkyLTQ1NTYtYjBmYi05ZjI1NzExMDM2Yzk6MA==",
            state: "Code-Review-Needed",
            eventDate: "2020-11-01T22:26:23.731000",
            previousState: null,
            previousStateType: null,
            newState: "created",
            newStateType: "backlog",
          },
          {
            id: "V29ya0l0ZW1FdmVudDo4MGYwOWNjYi0yZTc0LTRjNzAtOTJkNC01ZDM4YmQ1MGRiMGU6MA==",
            state: "Backlog",
            eventDate: "2019-12-16T19:37:58.539000",
            previousState: null,
            previousStateType: null,
            newState: "created",
            newStateType: null, // unmapped
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithUnmappedBacklogEvents} view={"primary"} />
      );

      expectSetsAreEqual(
        data.map((point) => point.marker.symbol),
        ["triangle"]
      );
    });

    test("it sets the marker symbol for  open, wip and complete workItem dates to diamond ", () => {
      const workItemWithOpenWipCompleteEvents = {
        ...workItemFixture,
        workItemEvents: [
          {
            id: "V29ya0l0ZW1FdmVudDpkYTI2MmYyYi02YWNkLTQyNjEtOTRjMi02YTI5NjU4MTRiMmM6MQ==",
            state: "open",
            eventDate: "2019-02-08T10:31:45",
            previousState: "created",
            previousStateType: "backlog",
            newState: "open",
            newStateType: "open",
          },
          {
            id: "V29ya0l0ZW1FdmVudDo2NWUwMTVmYS00YjkyLTQ1NTYtYjBmYi05ZjI1NzExMDM2Yzk6MQ==",
            state: "Code-Review-Needed",
            eventDate: "2020-11-03T00:18:25.814000",
            previousState: "created",
            previousStateType: "backlog",
            newState: "In Progress",
            newStateType: "wip",
          },
          {
            id: "V29ya0l0ZW1FdmVudDo5ZWI0MmJjNS01MjYwLTQ3YTEtOGM5Ny05YTk2YWNiNjA0NDI6MQ==",
            state: "ABANDONED",
            eventDate: "2020-08-19T16:06:32.793000",
            previousState: "created",
            previousStateType: "backlog",
            newState: "ABANDONED",
            newStateType: "complete",
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithOpenWipCompleteEvents} view={"primary"} />
      );

      expectSetsAreEqual(
        data.map((point) => point.marker.symbol),
        ["diamond"]
      );
    });

    test("it sets the marker symbol for  closed workItem dates to triangle-down", () => {
      const workItemWithClosedEvents = {
        ...workItemFixture,
        workItemEvents: [
          {
            id: "V29ya0l0ZW1FdmVudDo5ZGM2MDcxZi0yNzQzLTQ2NmUtODE5OC0zNzc0NzZmZTA5Yzk6MQ==",
            state: "accepted",
            eventDate: "2019-09-18T16:56:53",
            previousState: "created",
            previousStateType: "backlog",
            newState: "accepted",
            newStateType: "closed",
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={workItemWithClosedEvents} view={"primary"} />);

      expectSetsAreEqual(
        data.map((point) => point.marker.symbol),
        ["triangle-down"]
      );
    });

    test("it sets the event type field for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.eventType),
        ["WorkItemEvent"]
      );
    });

    test("it sets the reference to the work item for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.workItem),
        [workItemWithEvents]
      );
    });

    test("should render the tooltip for workItem event point", async () => {
      const [actual] = await renderedTooltipConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithEvents} view={"primary"} />,
        (points) => [points[0]]
      );

      const [workItem] = workItemWithEvents.workItemEvents;
      expect(actual).toMatchObject({
        header: expect.stringMatching(/^Phase:.*/),
        body: [["Date: ", formatDate(workItem.eventDate)]],
      });
    });
  });

  describe("delivery cycle plotLines", () => {
    test("it does not show delivery cycle plotLines if there are no closed delivery cycles", () => {
      const activeWorkItem = {
        ...workItemFixture,
        workItemDeliveryCycles: [
          {
            endDate: null,
            leadTime: null,
            cycleTime: null,
          },
        ],
      };
      const {
        xAxis: {plotLines},
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={activeWorkItem} view={"primary"} />);
      expect(plotLines).toEqual([]);
    });

    test("it shows delivery cycle plotLines if there is one closed delivery cycle without a cycle time", () => {
      const endDate = "2020-11-09T14:52:29.562000";
      const activeWorkItem = {
        ...workItemFixture,
        workItemDeliveryCycles: [
          {
            endDate: endDate,
            leadTime: 2.36,
            cycleTime: null,
          },
        ],
      };
      const {
        xAxis: {plotLines},
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={activeWorkItem} view={"primary"} />);
      expect(plotLines).toMatchObject([
        {
          value: epoch(endDate)
        }
      ]);

    });

    test("it shows delivery cycle plotLine with a cycle time label if there is one closed delivery cycle with a cycle time", () => {
      const endDate = "2020-11-09T14:52:29.562000";
      const activeWorkItem = {
        ...workItemFixture,
        workItemDeliveryCycles: [
          {
            endDate: endDate,
            leadTime: 2.36,
            cycleTime: 1.0,
          },
        ],
      };
      const {
        xAxis: {plotLines},
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={activeWorkItem} view={"primary"} />);
      expect(plotLines).toMatchObject([
        {
          value: epoch(endDate),
          label: {
            text: "C=1 days"
          }
        }
      ]);

    });

    test("it shows a plotline for each closed delivery cycle", () => {

      const activeWorkItem = {
        ...workItemFixture,
        workItemDeliveryCycles: [
          {
            endDate: "2020-11-09T14:52:29.562000",
            leadTime: 2.36,
            cycleTime: 1.0,
          },
          {
            endDate: "2020-11-12T14:52:29.562000",
            leadTime: 2.36,
            cycleTime: 1.0,
          },
          {
            endDate: null,
            leadTime: null,
            cycleTime: null,
          },
        ],
      };
      const {
        xAxis: {plotLines},
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={activeWorkItem} view={"primary"} />);
      expect(plotLines.length).toBe(2)

    });
  });

  describe("pullRequests timeline", () => {
    const workItemWithPullRequests = {
      ...workItemFixture,
      workItemPullRequests: pullRequestsFixture,
    };

    const {
      series: [{data}],
    } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={workItemWithPullRequests} view={"primary"} />);

    test("it renders a chart with the correct numbers of data points ", () => {
      expect(data).toHaveLength(
        pullRequestsFixture.flatMap((p) => [[p.createdAt], ...(p.endDate != null ? [p.endDate] : [])]).length
      );
    });

    test("it maps pull request event dates to the x axis and sets y = 2 for each event", () => {
      expectSetsAreEqual(
        data.map((point) => [point.x, point.y]),
        pullRequestsFixture.flatMap((pullRequest) => [
          [epoch(pullRequest.createdAt), 2],
          [...(pullRequest.endDate != null ? [epoch(pullRequest.endDate), 2] : [])],
        ])
      );
    });

    test("it sets the marker symbol for  pull request create event dates to triangle", () => {
      const workItemWithOpenPullRequests = {
        ...workItemFixture,
        workItemPullRequests: [
          {
            id: "UHVsbFJlcXVlc3Q6MmI1ZTdhMTktNjYwMC00MmIyLTkzYTctODA4OGYwYzQ3OGRk",
            name: "Resolve PO-364",
            key: "2b5e7a19-6600-42b2-93a7-8088f0c478dd",
            displayId: "128",
            state: "open",
            age: 13.8181293821991,
            createdAt: "2020-11-10T10:59:14.586000",
            endDate: null,
            repositoryName: "polaris-analytics-service",
            branchName: "PO-364",
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={workItemWithOpenPullRequests} view={"primary"} />);

      expectSetsAreEqual(
        data.filter((point) => point.eventType === "PullRequestCreated").map((point) => point.marker.symbol),
        ["triangle"]
      );
    });

    test("it sets the marker symbol for  pull request complete event dates to triangle-down", () => {
      const workItemWithCompletedPullRequests = {
        ...workItemFixture,
        workItemPullRequests: [
          {
            id: "UHVsbFJlcXVlc3Q6ZDljODJlZDktY2Q1NC00NmZlLWJkYjEtMTg3NjI3NWNiMTA4",
            name: "Added closed_at field to pull request summary message",
            key: "d9c82ed9-cd54-46fe-bdb1-1876275cb108",
            displayId: "10",
            state: "merged",
            age: 5.36403539351852,
            createdAt: "2020-11-05T14:59:23.097000",
            endDate: "2020-11-10T23:43:36.218000",
            repositoryName: "polaris-messaging",
            branchName: "PO-357",
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithCompletedPullRequests} view={"primary"} />
      );

      expectSetsAreEqual(
        data.filter((point) => point.eventType === "PullRequestCompleted").map((point) => point.marker.symbol),
        ["triangle-down"]
      );
    });

    test("it sets the color of events for pull requests that are still open", () => {
      const workItemWithOpenPullRequests = {
        ...workItemFixture,
        workItemPullRequests: [
          {
            id: "UHVsbFJlcXVlc3Q6MmI1ZTdhMTktNjYwMC00MmIyLTkzYTctODA4OGYwYzQ3OGRk",
            name: "Resolve PO-364",
            key: "2b5e7a19-6600-42b2-93a7-8088f0c478dd",
            displayId: "128",
            state: "open",
            age: 13.8181293821991,
            createdAt: "2020-11-10T10:59:14.586000",
            endDate: null,
            repositoryName: "polaris-analytics-service",
            branchName: "PO-364",
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(<WorkItemEventsTimelineChart workItem={workItemWithOpenPullRequests} view={"primary"} />);

      expectSetsAreEqual(
        data.map((point) => point.color),
        [Colors.PullRequestStateType["open"]]
      );
    });

    test("it sets the color of events for pull requests that are completed", () => {
      const workItemWithCompletedPullRequests = {
        ...workItemFixture,
        workItemPullRequests: [
          {
            id: "UHVsbFJlcXVlc3Q6ZDljODJlZDktY2Q1NC00NmZlLWJkYjEtMTg3NjI3NWNiMTA4",
            name: "Added closed_at field to pull request summary message",
            key: "d9c82ed9-cd54-46fe-bdb1-1876275cb108",
            displayId: "10",
            state: "merged",
            age: 5.36403539351852,
            createdAt: "2020-11-05T14:59:23.097000",
            endDate: "2020-11-10T23:43:36.218000",
            repositoryName: "polaris-messaging",
            branchName: "PO-357",
          },
        ],
      };

      const {
        series: [{data}],
      } = renderedChartConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithCompletedPullRequests} view={"primary"} />
      );

      expectSetsAreEqual(
        data.map((point) => point.color),
        [Colors.PullRequestStateType["closed"]]
      );
    });

    test("it sets the event type field for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.eventType),
        ["PullRequestCreated", "PullRequestCompleted"]
      );
    });

    test("it sets the reference to the work item for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.workItem),
        [workItemWithPullRequests]
      );
    });

    test("should render the tooltip for creation event of the pull request point", async () => {
      const workItemWithOpenPullRequests = {
        ...workItemFixture,
        workItemPullRequests: [
          {
            id: "UHVsbFJlcXVlc3Q6MmI1ZTdhMTktNjYwMC00MmIyLTkzYTctODA4OGYwYzQ3OGRk",
            name: "Resolve PO-364",
            key: "2b5e7a19-6600-42b2-93a7-8088f0c478dd",
            displayId: "128",
            state: "open",
            age: 13.8181293821991,
            createdAt: "2020-11-10T10:59:14.586000",
            endDate: null,
            repositoryName: "polaris-analytics-service",
            branchName: "PO-364",
          },
        ],
      };

      const [actual] = await renderedTooltipConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithOpenPullRequests} view={"primary"} />,
        (points) => [points[0]]
      );

      const [pullRequest] = workItemWithOpenPullRequests.workItemPullRequests;
      expect(actual).toMatchObject({
        header: `${pullRequest.repositoryName}:${pullRequest.displayId}`,
        body: [
          ["Title: ", pullRequest.name],
          [`Opened: `, formatDate(pullRequest.createdAt)],
          ["Age: ", `${formatNumber(pullRequest.age)} Days`],
        ],
      });
    });

    test("should render the tooltip for completion event of the pull request point", async () => {
      const workItemWithCompletedPullRequests = {
        ...workItemFixture,
        workItemPullRequests: [
          {
            id: "UHVsbFJlcXVlc3Q6ZDljODJlZDktY2Q1NC00NmZlLWJkYjEtMTg3NjI3NWNiMTA4",
            name: "Added closed_at field to pull request summary message",
            key: "d9c82ed9-cd54-46fe-bdb1-1876275cb108",
            displayId: "10",
            state: "merged",
            age: 5.36403539351852,
            createdAt: "2020-11-05T14:59:23.097000",
            endDate: "2020-11-10T23:43:36.218000",
            repositoryName: "polaris-messaging",
            branchName: "PO-357",
          },
        ],
      };

      const [_, actual] = await renderedTooltipConfig(
        <WorkItemEventsTimelineChart workItem={workItemWithCompletedPullRequests} view={"primary"} />,
        (points) => [points[0], points[1]]
      );

      const [pullRequest] = workItemWithCompletedPullRequests.workItemPullRequests;
      expect(actual).toMatchObject({
        header: `${pullRequest.repositoryName}:${pullRequest.displayId}`,
        body: [
          ["Title: ", pullRequest.name],
          [`Merged: `, formatDate(pullRequest.endDate)],
          ["Time to Review: ", `${formatNumber(pullRequest.age)} Days`],
        ],
      });
    });
  });
});
