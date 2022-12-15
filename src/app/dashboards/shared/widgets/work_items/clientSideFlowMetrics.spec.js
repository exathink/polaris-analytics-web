import {getNDaysAgo} from "../../../../../../cypress/support/utils";
import { WorkItemStateTypes } from "../../config";
import {getFlowEfficiencyUtils} from "./clientSideFlowMetrics";

describe("Flow Efficiency Measurement", () => {
  test("when there are no workItems, flow efficiency should be zero", () => {
    const workItems = [];
    const result = getFlowEfficiencyUtils(workItems);
    expect(result.flowEfficiencyFraction).toEqual(0);
  });

  test("when there is single wip workItem and it has backlog entry in transitions, skip the calculation for backlog entry of inprogress workItem", () => {
    const workItems = [
      {
        name: "Cycle Time Card on Flow Summary not updating when specs/all is toggled. ",
        key: "335acba7-2b8c-433b-abc3-df3cea1e15e4",
        displayId: "PP-299",
        workItemType: "bug",
        epicName: null,
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        teamNodeRefs: [
          {
            teamName: "App Team",
            teamKey: "f260ee33-c46a-4eb2-bb45-13b8c75e3c45",
          },
        ],
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(10),
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 2.828414351851852,
            },
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
          ],
        },
      },
    ];
    const {deliveryCycleDurationsByState} = getFlowEfficiencyUtils(workItems);
    expect(deliveryCycleDurationsByState).toHaveProperty("CODE REVIEW");
    expect(Number(deliveryCycleDurationsByState["CODE REVIEW"].daysInState)).toBeCloseTo(10, 0);

    expect(deliveryCycleDurationsByState).not.toHaveProperty("created");
  });

  test("when there is single closed workItem with backlog entry in transitions, do not skip the calculation for backlog entry of closed workItem", () => {
    const workItems = [
      {
        name: "Update the layout of the Pull Requests detail view when bring it up from the Variability analysis dashboard",
        key: "44453d90-f76d-47d1-83d4-9bd934595662",
        displayId: "PP-294",
        workItemType: "story",
        epicName: "Misc UX: H2 2022",
        state: "in-prod",
        stateType: "closed",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(20),
          },
          currentDeliveryCycleDurations: [
            {
              state: "in-prod",
              stateType: "closed",
              flowType: "waiting",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.9154166666666668,
            },
          ],
        },
      },
    ];
    const {deliveryCycleDurationsByState} = getFlowEfficiencyUtils(workItems);
    expect(deliveryCycleDurationsByState).toHaveProperty("in-prod");
    // for duration.stateType===closed, clock stops ticking
    expect(Number(deliveryCycleDurationsByState["in-prod"].daysInState)).toBeCloseTo(0, 0);

    expect(deliveryCycleDurationsByState).toHaveProperty("created");
    expect(Number(deliveryCycleDurationsByState["created"].daysInState)).toBeCloseTo(1.9, 1);
  });

  /**
   *
   */
  test("when there are multiple wip workItems", () => {
    const workItems = [
      {
        name: "Cycle Time Card on Flow Summary not updating when specs/all is toggled. ",
        key: "335acba7-2b8c-433b-abc3-df3cea1e15e4",
        displayId: "PP-299",
        workItemType: "bug",
        epicName: null,
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(13)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 2.828414351851852,
            },
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "Infra for table pagination",
        key: "e95ceeec-be69-4313-b29c-6446a23ba665",
        displayId: "PP-292",
        workItemType: "story",
        epicName: "Misc UX: H2 2022",
        state: "In Progress",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(20)
          },
          currentDeliveryCycleDurations: [
            {
              state: "In Progress",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 5.839421296296297,
            },
          ],
        },
      },
      {
        name: "Update the layout of the Pull Requests detail view when bring it up from the Variability analysis dashboard",
        key: "44453d90-f76d-47d1-83d4-9bd934595662",
        displayId: "PP-294",
        workItemType: "story",
        epicName: "Misc UX: H2 2022",
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(10)
          },
          currentDeliveryCycleDurations: [
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.9154166666666668,
            },
          ],
        },
      },
      {
        name: "Layout issue on Flow Mix details dashboard",
        key: "7019b22f-e515-491c-846f-9a7c491fb68f",
        displayId: "PP-293",
        workItemType: "bug",
        epicName: "Misc UX: H2 2022",
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        teamNodeRefs: [
          {
            teamName: "Data Team",
            teamKey: "304aff69-ea3b-4a71-9433-0bb0911fc817",
          },
        ],
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(12)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.9172222222222222,
            },
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "Tool tip enhancements for time in state chart",
        key: "c27503db-4aa0-4d79-a581-22f4abb8e958",
        displayId: "PP-290",
        workItemType: "story",
        epicName: "Flow Efficiency Dashboards",
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(15)
          },
          currentDeliveryCycleDurations: [
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.1385648148148149,
            },
          ],
        },
      },
      {
        name: "Arrows on the previous and next buttons are switched on the commits timeline table",
        key: "267e99f9-3391-44ad-8af1-7ffe8b20eaad",
        displayId: "PP-251",
        workItemType: "bug",
        epicName: null,
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(10)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.8797916666666667,
            },
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "UI for excluding repos from value streams and teams. ",
        key: "b3d0149f-573c-4b98-8f7a-1530844fb99b",
        displayId: "PP-154",
        workItemType: "story",
        epicName: "Repository Exclusions",
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(20)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 2.1222800925925926,
            },
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "PR Cycle Time Detail Widget: Table View",
        key: "40d0d1fc-1348-4cfa-beb3-7b4761b7b46e",
        displayId: "PP-148",
        workItemType: "story",
        epicName: "Response Time Pull Request Details",
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(30)
          },
          currentDeliveryCycleDurations: [
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
            {
              state: "Backlog",
              stateType: "backlog",
              flowType: "waiting",
              daysInState: 8.92548611111111,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 0.04150462962962963,
            },
          ],
        },
      },
    ];
    const {deliveryCycleDurationsByState} = getFlowEfficiencyUtils(workItems);

    expect(deliveryCycleDurationsByState).toHaveProperty("ACCEPTED");
    expect(deliveryCycleDurationsByState["ACCEPTED"].daysInState).toBeCloseTo(47, 0);

    expect(deliveryCycleDurationsByState).toHaveProperty("CODE REVIEW");
    expect(deliveryCycleDurationsByState["CODE REVIEW"].daysInState).toBeCloseTo(63, 0);

    expect(deliveryCycleDurationsByState).toHaveProperty("In Progress");
    expect(deliveryCycleDurationsByState["In Progress"].daysInState).toBeCloseTo(20, 0);

    expect(deliveryCycleDurationsByState).not.toHaveProperty("created");
    expect(deliveryCycleDurationsByState).not.toHaveProperty("Backlog");
  });

  test("when there are multiple workItems, with phases open and wip", () => {
    const workItems = [
      {
        name: "Cycle Time Card on Flow Summary not updating when specs/all is toggled. ",
        key: "335acba7-2b8c-433b-abc3-df3cea1e15e4",
        displayId: "PP-299",
        workItemType: "bug",
        epicName: null,
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(13)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 2.828414351851852,
            },
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "Infra for table pagination",
        key: "e95ceeec-be69-4313-b29c-6446a23ba665",
        displayId: "PP-292",
        workItemType: "story",
        epicName: "Misc UX: H2 2022",
        state: "In Progress",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(20)
          },
          currentDeliveryCycleDurations: [
            {
              state: "In Progress",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 5.839421296296297,
            },
          ],
        },
      },
      {
        name: "Update the layout of the Pull Requests detail view when bring it up from the Variability analysis dashboard",
        key: "44453d90-f76d-47d1-83d4-9bd934595662",
        displayId: "PP-294",
        workItemType: "story",
        epicName: "Misc UX: H2 2022",
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(10)
          },
          currentDeliveryCycleDurations: [
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.9154166666666668,
            },
          ],
        },
      },
      {
        name: "Layout issue on Flow Mix details dashboard",
        key: "7019b22f-e515-491c-846f-9a7c491fb68f",
        displayId: "PP-293",
        workItemType: "bug",
        epicName: "Misc UX: H2 2022",
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        teamNodeRefs: [
          {
            teamName: "Data Team",
            teamKey: "304aff69-ea3b-4a71-9433-0bb0911fc817",
          },
        ],
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(12)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.9172222222222222,
            },
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "Tool tip enhancements for time in state chart",
        key: "c27503db-4aa0-4d79-a581-22f4abb8e958",
        displayId: "PP-290",
        workItemType: "story",
        epicName: "Flow Efficiency Dashboards",
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(15)
          },
          currentDeliveryCycleDurations: [
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.1385648148148149,
            },
          ],
        },
      },
      {
        name: "Arrows on the previous and next buttons are switched on the commits timeline table",
        key: "267e99f9-3391-44ad-8af1-7ffe8b20eaad",
        displayId: "PP-251",
        workItemType: "bug",
        epicName: null,
        state: "ACCEPTED",
        stateType: "complete",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(10)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 1.8797916666666667,
            },
            {
              state: "ACCEPTED",
              stateType: "complete",
              flowType: "waiting",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "UI for excluding repos from value streams and teams. ",
        key: "b3d0149f-573c-4b98-8f7a-1530844fb99b",
        displayId: "PP-154",
        workItemType: "story",
        epicName: "Repository Exclusions",
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(20)
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 2.1222800925925926,
            },
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
          ],
        },
      },
      {
        name: "PR Cycle Time Detail Widget: Table View",
        key: "40d0d1fc-1348-4cfa-beb3-7b4761b7b46e",
        displayId: "PP-148",
        workItemType: "story",
        epicName: "Response Time Pull Request Details",
        state: "CODE REVIEW",
        stateType: "wip",
        workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
        workItemsSourceName: "Polaris Platform",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(30)
          },
          currentDeliveryCycleDurations: [
            {
              state: "CODE REVIEW",
              stateType: "wip",
              flowType: "active",
              daysInState: null,
            },
            {
              state: "Backlog",
              stateType: "backlog",
              flowType: "waiting",
              daysInState: 8.92548611111111,
            },
            {
              state: "created",
              stateType: "backlog",
              flowType: null,
              daysInState: 0.04150462962962963,
            },
          ],
        },
      },
    ];

    const {deliveryCycleDurationsByState} = getFlowEfficiencyUtils(workItems, [WorkItemStateTypes.open, WorkItemStateTypes.make]);
    expect(deliveryCycleDurationsByState).not.toHaveProperty("ACCEPTED");
  });
});
