import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual, formatNumber, getNDaysAgo} from "../../../../../test/test-utils";
import {Colors} from "../../../shared/config";
import {WorkItemsEpicEffortChart} from "./workItemsEpicEffortChart";
import {epoch} from "../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const propsFixture = {
  workItems: [
    {
      name: "Defect Lead Time/ Cycle Time Trends",
      key: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce:4177",
      workItemKey: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce",
      displayId: "PO-494",
      epicName: "Quality Trends",
      epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
      effort: 0.5,
    },
    {
      name: "Defect Arrival Close Rate - UI",
      key: "eb5f494e-90f2-4685-a24b-da625a00931b:4265",
      workItemKey: "eb5f494e-90f2-4685-a24b-da625a00931b",
      displayId: "PO-550",
      epicName: "Quality Trends",
      epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
      effort: 1,
    },
    {
      name: "Select/Edit Contributor Test Cases",
      key: "5f65c4ac-4de8-4c76-b2a8-d3545d01a254:4269",
      workItemKey: "5f65c4ac-4de8-4c76-b2a8-d3545d01a254",
      displayId: "PO-549",
      epicName: "Contributor Alias UI",
      epicKey: "48f523d5-af3c-4462-9edf-6c7bdf0cbfb7",
      effort: 0.3,
    },
    {
      name: "Update nomenclature for Effort/Value components. ",
      key: "8042654a-50f3-4a1f-9ccd-b643256fcbc2:4211",
      workItemKey: "8042654a-50f3-4a1f-9ccd-b643256fcbc2",
      displayId: "PO-538",
      epicName: "Misc UX",
      epicKey: "b3ff1c8a-749c-4c38-9dde-d5a7b2519122",
      effort: 2.8,
    },
  ],
  specsOnly: false,
  days: 30,
  view: "primary",
};

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
    text: expect.stringContaining("Value Book:"),
    align: "left",
  },
  subtitle: {
    text: expect.stringContaining(`Volume  by Epic`),
  },
  xAxis: {
    type: "linear",

    title: {
      text: "X",
    },
  },
  yAxis: {
    type: "linear",

    title: {
      text: "x",
    },
  },
  tooltip: {
    useHTML: true,
    outside: true,
    hideDelay: 50,
  },
};

describe("WorkItemsEpicEffortChart", () => {
  describe("when there is no workItems data", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      workItems: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [{}],
    };

    test("it renders an empty chart config", () => {
      expect(renderedChartConfig(<WorkItemsEpicEffortChart {...emptyPropsFixture} />)).toMatchObject(
        expectedChartConfig
      );
    });
  });

  describe("when there is data for workItems", () => {
    describe("primary view", () => {
      const {series} = renderedChartConfig(<WorkItemsEpicEffortChart {...propsFixture} />);

      test("renders single series", () => {
        expect(series).toHaveLength(1);
      });

      test("renders correct chart config", () => {
        const expectedChartConfig = {
          ...fixedChartConfig,
          series: [
            {
              type: "treemap",
              layoutAlgorithm: "squarified",
              name: "Closed",
              dataLabels: {
                enabled: true,
                useHTML: true,
              },
            },
          ],
        };
        expect(renderedChartConfig(<WorkItemsEpicEffortChart {...propsFixture} />)).toMatchObject(expectedChartConfig);
      });

      const {workItems} = propsFixture;
      describe(`workItems by epic series`, () => {
        const [workItemsByEpicSeries] = series;

        test(`renders a chart with the correct number of data points`, () => {
          expect(workItemsByEpicSeries.data).toHaveLength(3);
        });

        test("it maps epic names to the x axis and sets y to a consolidated effort value", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => [point.name, point.value]),
            [
              ["Quality Trends", 1.5],
              ["Contributor Alias UI", 0.3],
              ["Misc UX", 2.8],
            ]
          );
        });

        test("it sets the reference to the workItems for each point ", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => point.workItems),
            [[workItems[0], workItems[1]], [workItems[2]], [workItems[3]]]
          );
        });

        test("should render the tooltip for point", async () => {
          const props = {
            ...propsFixture,
            workItems: [
              {
                name: "Defect Lead Time/ Cycle Time Trends",
                key: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce:4177",
                workItemKey: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce",
                displayId: "PO-494",
                epicName: "Quality Trends",
                epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
                effort: 0.5,
              },
              {
                name: "Defect Arrival Close Rate - UI",
                key: "eb5f494e-90f2-4685-a24b-da625a00931b:4265",
                workItemKey: "eb5f494e-90f2-4685-a24b-da625a00931b",
                displayId: "PO-550",
                epicName: "Quality Trends",
                epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
                effort: 1,
              },
            ],
          };
          const [actual] = await renderedTooltipConfig(
            <WorkItemsEpicEffortChart {...props} />,
            (points) => [points[0]],
            0
          );

          expect(actual).toMatchObject({
            header: `Quality Trends`,
            body: [
              [`Effort`, `1.5 Dev-Days`],
              [`Cards`, `2`],
            ],
          });
        });
      });
    });

    describe("detail view", () => {
      const propsFixtureForDetailView = {...propsFixture, view: "detail", showHierarchy: true};
      const {series} = renderedChartConfig(<WorkItemsEpicEffortChart {...propsFixtureForDetailView} />);

      test("renders single series", () => {
        expect(series).toHaveLength(1);
      });

      test("renders correct chart config", () => {
        const expectedChartConfig = {
          ...fixedChartConfig,
          series: [
            {
              type: "treemap",
              layoutAlgorithm: "stripes",
              alternateStartingDirection: true,
              allowPointSelect: true,
              levels: [
                {
                  level: 1,
                  layoutAlgorithm: "squarified",
                  dataLabels: {
                    enabled: true,
                    align: "center",
                    verticalAlign: "top",
                    style: {
                      fontSize: "14px",
                      fontWeight: "bold",
                    },
                  },
                },
                {
                  level: 2,
                  dataLabels: {
                    enabled: true,
                    align: "right",
                    verticalAlign: "bottom",
                    allowOverlap: true,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
              ],
            },
          ],
        };
        expect(renderedChartConfig(<WorkItemsEpicEffortChart {...propsFixtureForDetailView} />)).toMatchObject(expectedChartConfig);
      });

      const {workItems} = propsFixtureForDetailView;
      describe(`workItems by epic series`, () => {
        const [workItemsByEpicSeries] = series;

        test(`renders a chart with the correct number of data points`, () => {
          expect(workItemsByEpicSeries.data).toHaveLength(7);
        });

        test("it maps epic names to the x axis and sets y to a consolidated effort value", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => [point.name, point.value]),
            [
              ["Quality Trends", 1.5],
              ["Contributor Alias UI", 0.3],
              ["Misc UX", 2.8],
              ...propsFixture.workItems.map(x => ([x.name, x.effort]))
            ]
          );
        });

        test("it sets the reference to the workItems for each point ", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => point.workItems),
            [[workItems[0], workItems[1]], [workItems[2]], [workItems[3]]]
          );
        });

        test("should render the tooltip for point", async () => {
          const props = {
            ...propsFixture,
            workItems: [
              {
                name: "Defect Lead Time/ Cycle Time Trends",
                key: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce:4177",
                workItemKey: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce",
                displayId: "PO-494",
                epicName: "Quality Trends",
                epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
                effort: 0.5,
              },
              {
                name: "Defect Arrival Close Rate - UI",
                key: "eb5f494e-90f2-4685-a24b-da625a00931b:4265",
                workItemKey: "eb5f494e-90f2-4685-a24b-da625a00931b",
                displayId: "PO-550",
                epicName: "Quality Trends",
                epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
                effort: 1,
              },
            ],
          };
          const [actual] = await renderedTooltipConfig(
            <WorkItemsEpicEffortChart {...props} />,
            (points) => [points[0]],
            0
          );

          expect(actual).toMatchObject({
            header: `Quality Trends`,
            body: [
              [`Effort`, `1.5 Dev-Days`],
              [`Cards`, `2`],
            ],
          });
        });
      });
    });
  });
});
