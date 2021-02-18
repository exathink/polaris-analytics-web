import React from "react";
import {screen} from "@testing-library/react";
import {ProjectPipelineImplementationCostView} from "./projectPipelineImplementationCostView";
import {renderWithProviders} from "../../../../../framework/viz/charts/chart-test-utils";

describe("ProjectPipelineImplementationCostView", () => {
  let viewPropsFixture = {
    specsOnly: false,
    workItemScope: "all",
    workItems: [
      {
        id: "V29ya0l0ZW06NTViYWJhYWQtMzZmNi00YmFmLTljMmYtMTBjNWEyNDU5MWI4",
        name: "Implement Pull Request webhooks for Github",
        key: "55babaad-36f6-4baf-9c2f-10c5a24591b8",
        displayId: "PO-379",
        workItemType: "task",
        state: "In Progress",
        stateType: "wip",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: "2020-12-09T22:31:01.244000",
          },
          currentDeliveryCycleDurations: [
            {
              state: "In Progress",
              stateType: "wip",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              daysInState: 0.0005092592592592592,
            },
            {
              state: "Selected for Development",
              stateType: "backlog",
              daysInState: 21.253032407407407,
            },
          ],
          earliestCommit: "2020-12-07T16:56:22",
          latestCommit: "2020-12-09T22:30:42",
          commitCount: 7,
          effort: 3.66666666666667,
          duration: 2.23217592592593,
        },
      },
    ],
    context: {},
  };

  describe("when in primary view", () => {
    test("renders component without any error", async () => {
      renderWithProviders(<ProjectPipelineImplementationCostView {...viewPropsFixture} view="primary" />);
      expect(await screen.findByText(/show/i)).toBeInTheDocument();
    });

    test("when workitem scope 'specs' is selected, have legend text as Specs", async () => {
      const propsFixture = {
        ...viewPropsFixture,
        specsOnly: true,
        workItemScope: "specs",
      };
      renderWithProviders(<ProjectPipelineImplementationCostView {...propsFixture} view="primary"/>);
      //asserting on the title first, IMP: this assertion makes sure chart is rendered, as chart is rendered async
      await screen.findAllByText(/effort/i);

      // both workitem scope and legend text as Specs
      const specsElem = await screen.findAllByText(/specs/i);
      expect(specsElem).toHaveLength(2);
    });

    test("when workitem scope 'all' is selected, have legend text as Cards", async () => {
      const propsFixture = {
        ...viewPropsFixture,
        specsOnly: false,
        workItemScope: "all",
      };
      renderWithProviders(<ProjectPipelineImplementationCostView {...propsFixture} view="primary"/>);
      // asserting on the title of the chart first
      await screen.findAllByText(/effort/i);

      const specsElem = await screen.findAllByText(/specs/i);
      expect(specsElem).toHaveLength(1);

      expect(await screen.findByText(/work items/i)).toBeInTheDocument();
    });
  });

  describe("when in detail view", () => {
    test("renders component without any error", async () => {
      renderWithProviders(<ProjectPipelineImplementationCostView {...viewPropsFixture} view="detail"/>);
      expect(await screen.findByText(/show/i)).toBeInTheDocument();
    });

    test("when workitem scope 'specs' is selected, have legend text as Specs", async () => {
      const propsFixture = {
        ...viewPropsFixture,
        specsOnly: true,
        workItemScope: "specs",
      };
      renderWithProviders(<ProjectPipelineImplementationCostView {...propsFixture} view="detail"/>);
      //asserting on the title first, IMP: this assertion makes sure chart is rendered, as chart is rendered async
      await screen.findAllByText(/effort/i);

      // both workitem scope and legend text as Specs
      const specsElem = await screen.findAllByText(/specs/i);
      expect(specsElem).toHaveLength(2);
    });

    test("when workitem scope 'all' is selected, have legend text as Cards", async () => {
      const propsFixture = {
        ...viewPropsFixture,
        specsOnly: false,
        workItemScope: "all",
      };
      renderWithProviders(<ProjectPipelineImplementationCostView {...propsFixture} view="detail"/>);
      // asserting on the title of the chart first
      await screen.findAllByText(/effort/i);

      const specsElem = await screen.findAllByText(/specs/i);
      expect(specsElem).toHaveLength(1);

      expect(await screen.findByText(/work items/i)).toBeInTheDocument();
    });
  });
});
