import React from "react";
import {screen} from "@testing-library/react";
import {renderWithProviders} from "../../../../../framework/viz/charts/chart-test-utils";
import {ProjectPhaseDetailView} from "./projectPhaseDetailView";

const propsFixture = {
  view: "primary",
  workItems: [
    {
      id: "V29ya0l0ZW06NTViYWJhYWQtMzZmNi00YmFmLTljMmYtMTBjNWEyNDU5MWI4",
      name: "Implement Pull Request webhooks for Github",
      key: "55babaad-36f6-4baf-9c2f-10c5a24591b8",
      displayId: "PO-379",
      workItemType: "task",
      state: "In Progress",
      stateType: "wip",
      workItemsSourceKey: "46694f4f-e003-4430-a7a7-e4f288f40d22",
      workItemsSourceName: "Polaris",
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
    {
      id: "V29ya0l0ZW06NWViNjAxY2MtNmExZC00ODNkLWFkZDctNDE3YzMyMWU3MTA5",
      name: "Funnel closed does not match Flow Metrics Closed",
      key: "5eb601cc-6a1d-483d-add7-417c321e7109",
      displayId: "PO-396",
      workItemType: "bug",
      state: "DEPLOYED-TO-STAGING",
      stateType: "closed",
      workItemsSourceKey: "46694f4f-e003-4430-a7a7-e4f288f40d22",
      workItemsSourceName: "Polaris",
      workItemStateDetails: {
        currentStateTransition: {
          eventDate: "2020-12-09T22:06:08.221000",
        },
        currentDeliveryCycleDurations: [
          {
            state: "DEPLOYED-TO-STAGING",
            stateType: "closed",
            daysInState: null,
          },
          {
            state: "created",
            stateType: "backlog",
            daysInState: 0.0004166666666666667,
          },
          {
            state: "In Progress",
            stateType: "wip",
            daysInState: 4.343680555555555,
          },
          {
            state: "READY-FOR-DEVELOPMENT",
            stateType: "open",
            daysInState: 3.5509375,
          },
        ],
        earliestCommit: "2020-12-05T21:24:07",
        latestCommit: "2020-12-09T21:28:26",
        commitCount: 15,
        effort: 1.16666666666667,
        duration: 4.00299768518519,
      },
    },
    {
      id: "V29ya0l0ZW06MzM3NjU1MTgtMTdhNC00NTQzLTk4MzYtYWE4YzRkODMxNmQ3",
      name: "Project latest commit calc is potentially wrong  when repos are shared between projects.",
      key: "33765518-17a4-4543-9836-aa8c4d8316d7",
      displayId: "PO-307",
      workItemType: "bug",
      state: "Selected for Development",
      stateType: "backlog",
      workItemsSourceKey: "46694f4f-e003-4430-a7a7-e4f288f40d22",
      workItemsSourceName: "Polaris",
      workItemStateDetails: {
        currentStateTransition: {
          eventDate: "2020-10-20T12:27:29.068000",
        },
        currentDeliveryCycleDurations: [
          {
            state: "Selected for Development",
            stateType: "backlog",
            daysInState: null,
          },
        ],
        earliestCommit: null,
        latestCommit: null,
        commitCount: null,
        effort: null,
        duration: null,
      },
    },
    {
      id: "V29ya0l0ZW06ZjJhNjcyNTktYTk3Ni00YzM0LTlkMGQtOWNmYmJlOWI5MWU1",
      name: "Store labels for Jira issues. ",
      key: "f2a67259-a976-4c34-9d0d-9cfbbe9b91e5",
      displayId: "169109365",
      workItemType: "story",
      state: "unscheduled",
      stateType: "backlog",
      workItemsSourceKey: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
      workItemsSourceName: "Polaris Platform",
      workItemStateDetails: {
        currentStateTransition: {
          eventDate: "2019-11-30T14:23:58",
        },
        currentDeliveryCycleDurations: [
          {
            state: "created",
            stateType: "backlog",
            daysInState: 49.009039351851854,
          },
          {
            state: "unscheduled",
            stateType: "backlog",
            daysInState: null,
          },
        ],
        earliestCommit: null,
        latestCommit: null,
        commitCount: null,
        effort: null,
        duration: null,
      },
    },
    {
      id: "V29ya0l0ZW06NTIwMDBhYWItMGI5NC00MGI5LTgzNWMtN2I3ZTlkNWMyOTgz",
      name:
        "When commits without detail cannot find the commit in the source repository that repository becomes stuck and can never be processed cleanly",
      key: "52000aab-0b94-40b9-835c-7b7e9d5c2983",
      displayId: "170007619",
      workItemType: "story",
      state: "unscheduled",
      stateType: "backlog",
      workItemsSourceKey: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
      workItemsSourceName: "Polaris Platform",
      workItemStateDetails: {
        currentStateTransition: {
          eventDate: "2019-11-29T17:39:34",
        },
        currentDeliveryCycleDurations: [
          {
            state: "created",
            stateType: "backlog",
            daysInState: 1.840474537037037,
          },
          {
            state: "unscheduled",
            stateType: "backlog",
            daysInState: null,
          },
        ],
        earliestCommit: null,
        latestCommit: null,
        commitCount: null,
        effort: null,
        duration: null,
      },
    },
  ],
  projectCycleMetricsData: {
    project: {
      minLeadTime: 0.06811342592592592,
      avgLeadTime: 3.981574074074074,
      maxLeadTime: 7.895034722222222,
      minCycleTime: 7.894618055555555,
      avgCycleTime: 7.894618055555555,
      maxCycleTime: 7.894618055555555,
      percentileLeadTime: 0.06811342592592592,
      percentileCycleTime: 7.894618055555555,
      targetPercentile: 0.5,
      workItemsInScope: 2,
      workItemsWithNullCycleTime: 1,
      earliestClosedDate: "2020-12-06T18:44:16.755000",
      latestClosedDate: "2020-12-09T22:06:08.221000",
    },
  },
};

describe("PhaseDetailView", () => {
  describe("when there are no workItems", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      workItems: [],
    };

    test("renders appropriate message when there are no workItems", () => {});
  });

  describe("when there are workItems", () => {
    test("renders component without any error", () => {});

    test("renders no dropdown when there is one and less workItemSources", () => {});

    test("renders dropdown when there are 2 or more workItemSources", () => {});

    test("by default it renders selected value for dropdown to be all", () => {});

    test("when any other dropdown option is selected, workItems should be filtered based on that workItemSource", () => {});

    test("when workItemState tabs change, the workItemSources dropdown selection should not change", () => {});

    test("when groupBy tabs change, the workItemSources dropdown selection should not change", () => {});
  });

  describe("when there are errors", () => {});
});
