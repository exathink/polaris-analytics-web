import React from "react";
import {expectSetsAreEqual, renderedChartConfig} from "../../../../../test/app-test-utils";
import {WorkItemEventsTimelineChart} from "./workItemEventTimelineChart";
import {Colors} from "../../../shared/config";
import {epoch} from "../../../../helpers/utility";

const workItemFixture = {
  id: "V29ya0l0ZW06NjVlMDE1ZmEtNGI5Mi00NTU2LWIwZmItOWYyNTcxMTAzNmM5",
  name: "Show Pull Requests on Work Item Timeline",
  displayId: "PO-357",
  workItemType: "story",
  state: "Code-Review-Needed",
  stateType: "wip",
  workItemCommits: [],
  workItemEvents: [],
  workItemPullRequests: [],
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
    categories: ["Events", "Commits", "Code Reviews"],
    reversed: true,
    title: {
      text: null,
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

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [
        {
          ...fixedSeriesConfig,
          data: [],
        },
      ],
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
  });
});
