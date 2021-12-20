import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual, formatNumber} from "../../../../../../test/test-utils";
import {Colors} from "../../../config";
import {PullRequestAgeChart} from "./pullRequestAgeChart";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const pullRequestsFixture = [
  {
    id: "UHVsbFJlcXVlc3Q6NWExZDFjODAtY2I1Zi00ZGQzLThhYjYtOTI4NzZjZGU3YmZh",
    name: 'PO-397 "Testing"',
    key: "5a1d1c80-cb5f-4dd3-8ab6-92876cde7bfa",
    displayId: "118",
    state: "open",
    repositoryKey: "a4cb90a1-dcf5-4768-b140-295c97be9ee0",
    repositoryName: "polaris-analytics-web",
    age: 11.7565974084259,
    webUrl: "https://gitlab.com/polaris-apps/polaris-analytics-web/-/merge_requests/118",
    workItemsSummaries: [
      {
        displayId: "PO-397",
        key: "13f98361-9dd6-45ea-a832-8dec0d9ace55",
        state: "Code-Review-Needed",
        stateType: "wip",
      },
    ],
  },
  {
    id: "UHVsbFJlcXVlc3Q6NWExZDFjabctY2I1Zi00ZGQzLThhYjYtOTI4NzZjZGU3YmZh",
    name: 'PO-399 "Testing"',
    key: "5a1d1c80-cxyzf-4dd3-8ab6-92876cde7bfa",
    displayId: "198",
    state: "open",
    repositoryKey: "a4cb90a1-dcf5-4768-b140-295c97be9ee0",
    repositoryName: "polaris-analytics-web",
    age: 18.7565974084259,
    webUrl: "https://gitlab.com/polaris-apps/polaris-analytics-web/-/merge_requests/198",
    workItemsSummaries: [],
  },
];

const commonChartProps = {
  backgroundColor: Colors.Chart.backgroundColor,
  panning: true,
  panKey: "shift",
  zoomType: "xy",
};

const fixedChartConfig = {
  chart: {
    ...commonChartProps,
  },
  title: {
    text: expect.stringMatching(`Pull Requests`),
    align: "left",
  },
  subtitle: {
    align: "left",
  },
  xAxis: {
    type: "category",
    visible: false,
    title: {
      text: null,
    },
  },
  yAxis: {
    type: "logarithmic",
    allowDecimals: false,
    title: {
      text: "Age in Days",
    },
  },

  tooltip: {
    useHTML: true,
    hideDelay: 50,
  },
  plotOptions: {
    series: {
      animation: false,
    },
  },
  legend: {
    title: {
      text: null,
      style: {
        fontStyle: "italic",
      },
    },
    align: "right",
    layout: "vertical",
    verticalAlign: "middle",
    itemMarginBottom: 3,
    enabled: true,
  },
};

const fixedSeriesConfig = {};

describe("PullRequestAgeChart", () => {
  describe("when there are no points", () => {
    const emptyPullRequests = [];

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [
        {
          ...fixedSeriesConfig,
          data: [],
        },
        {
          ...fixedSeriesConfig,
          data: [],
        },
      ],
    };

    test("it renders an empty chart config in primary view", () => {
      expect(
        renderedChartConfig(<PullRequestAgeChart pullRequests={emptyPullRequests} view={"primary"} />)
      ).toMatchObject(expectedChartConfig);
    });

    test("it renders an empty chart config  in detail view", () => {
      expect(
        renderedChartConfig(<PullRequestAgeChart pullRequests={emptyPullRequests} view={"detail"} />)
      ).toMatchObject(expectedChartConfig);
    });
  });

  describe("when there are points on the chart", () => {
    describe("test plot lines", () => {
      const {
        series: [{data: specsData}, {data: noSpecsData}],
      } = renderedChartConfig(<PullRequestAgeChart pullRequests={pullRequestsFixture} view={"primary"} />);

      const cases = [
        {type: "Specs", data: specsData, fixture: pullRequestsFixture.filter((x) => x.workItemsSummaries.length > 0)},
        {
          type: "No Specs",
          data: noSpecsData,
          fixture: pullRequestsFixture.filter((x) => x.workItemsSummaries.length === 0),
        },
      ];
      // Generating test cases for similar usecases
      cases.forEach(({type, data, fixture}, index) => {
        describe(`series ${type}`, () => {
          test(`it renders the correct number of data points`, () => {
            expect(data).toHaveLength(fixture.length);
          });

          test(`it sets y to pull request age`, () => {
            expectSetsAreEqual(
              data.map((point) => [point.y]),
              fixture.map((pullRequest) => {
                return [pullRequest.age];
              })
            );
          });

          test(`it sets the reference to the pullRequest for each point`, () => {
            expectSetsAreEqual(
              data.map((point) => point.pullRequest),
              fixture
            );
          });

          test(`should render the tooltip of point`, async () => {
            const [actual] = await renderedTooltipConfig(
              <PullRequestAgeChart pullRequests={fixture} view={"primary"} />,
              (points) => [points[0]],
              index
            );

            const firstPoint = fixture[0];

            expect(actual).toMatchObject({
              header: expect.stringMatching(`Review Request:`),
              body: [
                [
                  `Card(s): `,
                  firstPoint.workItemsSummaries.length > 0
                    ? `${firstPoint.workItemsSummaries.map((workItem) => workItem.displayId).join()}`
                    : "None",
                ],
                [`Age: `, `${formatNumber(firstPoint.age)} Days`],
              ],
            });
          });
        });
      });
    });
  });
});
