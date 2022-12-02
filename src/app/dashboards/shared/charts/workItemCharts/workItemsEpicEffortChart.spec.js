import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual} from "../../../../../test/test-utils";
import {Colors} from "../../../shared/config";
import {WorkItemsEpicEffortChart} from "./workItemsEpicEffortChart";

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
    outside: false,
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

        test("it maps epic names and consolidated effort value to a tree map chart view", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => [point.name, point.value]),
            [
              ["Quality Trends", 2],
              ["Contributor Alias UI", 1],
              ["Misc UX", 1],
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
              [`Effort`, `1.5 FTE Days`],
              [`Work Items`, `2`],
            ],
          });
        });

        test("should render the tree map chart for epics having all items with effort equal to null", () => {
          const props = {
            ...propsFixture,
            workItems: [
              {
                name: "Gitlab enhancement type displays as undefined on UI. ",
                key: "0eef4d17-8882-4d5e-a32e-dab51ec8e869:4266",
                workItemKey: "0eef4d17-8882-4d5e-a32e-dab51ec8e869",
                workItemType: "bug",
                displayId: "PO-548",
                epicName: "Gitlab Work Tracking",
                epicKey: "90f21323-1020-4783-abad-fb672d4a888b",
                effort: null,
              },
              {
                name: "Defect Lead Time/ Cycle Time Trends",
                key: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce:4177",
                workItemKey: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce",
                displayId: "PO-494",
                epicName: "Gitlab Work Tracking",
                epicKey: "90f21323-1020-4783-abad-fb672d4a888b",
                effort: null,
              },
            ],
          };
          const {series} = renderedChartConfig(<WorkItemsEpicEffortChart {...props} />);
          const [{data}] = series;
          expect(data).toHaveLength(1);

          const pointWithNoEffort = data[0];
          expect(pointWithNoEffort.value).toBe(2);
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
        expect(renderedChartConfig(<WorkItemsEpicEffortChart {...propsFixtureForDetailView} />)).toMatchObject(
          expectedChartConfig
        );
      });

      const {workItems} = propsFixtureForDetailView;
      describe(`workItems by epic series`, () => {
        const [workItemsByEpicSeries] = series;

        test(`renders a chart with the correct number of data points`, () => {
          expect(workItemsByEpicSeries.data).toHaveLength(7);
        });

        test("it maps epic names and consolidated effort value to a tree map chart view", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => [point.name, point.value]),
            [
              ["Quality Trends", 2],
              ["Contributor Alias UI", 1],
              ["Misc UX", 1],
              ...propsFixtureForDetailView.workItems.map((x) => [x.name, 1]),
            ]
          );
        });

        test("it sets the reference to the workItems or workItem domain object for each point ", () => {
          expectSetsAreEqual(
            workItemsByEpicSeries.data.map((point) => point.workItems || point.workItem),
            [[workItems[0], workItems[1]], [workItems[2]], [workItems[3]], ...workItems.map((wi) => wi)]
          );
        });

        test("should render the tooltip for point", async () => {
          const props = {
            ...propsFixtureForDetailView,
            workItems: [
              {
                name: "Defect Lead Time/ Cycle Time Trends",
                key: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce:4177",
                workItemKey: "7f7d0bdd-a862-4b81-a3f0-d3c1266762ce",
                workItemType: "story",
                displayId: "PO-494",
                epicName: "Quality Trends",
                epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
                effort: 0.5,
              },
              {
                name: "Defect Arrival Close Rate - UI",
                key: "eb5f494e-90f2-4685-a24b-da625a00931b:4265",
                workItemKey: "eb5f494e-90f2-4685-a24b-da625a00931b",
                workItemType: "story",
                displayId: "PO-550",
                epicName: "Quality Trends",
                epicKey: "89285627-0dd9-4b5b-8800-740dc68d7428",
                effort: 1,
              },
            ],
          };
          const [actual] = await renderedTooltipConfig(
            <WorkItemsEpicEffortChart {...props} />,
            (points) => [points[1]],
            0
          );

          expect(actual).toMatchObject({
            header: expect.stringContaining("Quality Trends"),
            body: [["Story", `Defect Lead Time/ Cycle Time Trends`], ["Effort", "0.5 FTE Days"]],
          });
        });

        test("should render the tree map chart for epics having all items with effort equal to null", () => {
          const props = {
            ...propsFixtureForDetailView,
            workItems: [
              {
                name: "Gitlab enhancement type displays as undefined on UI. ",
                key: "0eef4d17-8882-4d5e-a32e-dab51ec8e869:4266",
                workItemKey: "0eef4d17-8882-4d5e-a32e-dab51ec8e869",
                workItemType: "bug",
                displayId: "PO-548",
                epicName: "Gitlab Work Tracking",
                epicKey: "90f21323-1020-4783-abad-fb672d4a888b",
                effort: null,
              },
            ],
          };
          const {series} = renderedChartConfig(<WorkItemsEpicEffortChart {...props} />);
          const [{data}] = series;
          expect(data).toHaveLength(2);

          const pointWithNoEffort = data[1];
          expect(pointWithNoEffort.value).toBe(1);
        });
      });
    });
  });
});
