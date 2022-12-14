import {getDeliveryCycleDurationsByState} from "./clientSideFlowMetrics";

describe("Flow Efficiency Measurement", () => {
  test("when there are no workItems, flow efficiency calculation should be zero percentage", () => {
    const workItems = [];
    const result = getDeliveryCycleDurationsByState(workItems);
    expect(result).toMatchObject({});
  });

  test("when there is single wip workItem, skip the calculation for backlog entry of inprogress workItem", () => {
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
            eventDate: "2022-12-02T15:01:18.482000",
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
    const result = getDeliveryCycleDurationsByState(workItems);
    expect(result).toHaveProperty("CODE REVIEW");
    expect(result).not.toHaveProperty("created");
  });

  test("when there are multiple workItems, flow efficiency calculation should be done based on input data", () => {
    const workItems = [];
    const result = getDeliveryCycleDurationsByState(workItems);
  });

  test("when there are multiple workItems, second scenario", () => {
    const workItems = [];
    const result = getDeliveryCycleDurationsByState(workItems);
  });
});
