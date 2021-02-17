import React from "react";
import {renderWithProviders, gqlUtils} from "../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_CONTRIBUTOR} from "./useUpdateContributor";
import {GET_CONTRIBUTOR_ALIASES_INFO_QUERY} from "./useQueryContributorAliasesInfo";
import {getNDaysAgo} from "../../../../test/test-utils";
import {ManageContributorsWorkflow} from "./manageContributorsWorkflow";
import {GraphQLError} from "graphql/error";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const gqlMutationRequest = {
  query: UPDATE_CONTRIBUTOR,
  variables: {
    contributorKey: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
    updatedInfo: {
      contributorName: "Krishna Kumar",
      contributorAliasKeys: ["5b7eecb4-b0c2-4001-904d-542c28fd3204"],
    },
  },
};

const updateContributorMocks = [
  {
    request: gqlMutationRequest,
    result: {
      data: {
        updateContributor: {
          updateStatus: {
            success: true,
            contributorKey: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
            message: null,
            exception: null,
          },
        },
      },
    },
  },
];

const gqlRequest = {
  query: GET_CONTRIBUTOR_ALIASES_INFO_QUERY,
  variables: {
    accountKey: "24347f28-0020-4025-8801-dbc627f9415d",
    commitWithinDays: 30,
  },
};

const contributorAliasesMocks = [
  {
    request: gqlRequest,
    result: {
      data: {
        account: {
          contributors: {
            edges: [
              {
                node: {
                  id: "Q29udHJpYnV0b3I6MjJhODNmZjAtMDBhMS00NWUxLWJjZmUtNzQ1NDJhNjRjZWIx",
                  key: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                  name: "Aman Mavai",
                  earliestCommit: getNDaysAgo(35),
                  latestCommit: getNDaysAgo(5),
                  commitCount: 378,
                  contributorAliasesInfo: [
                    {
                      key: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                      name: "Aman Mavai",
                      alias: "aman.mavai@gslab.com",
                      latestCommit: getNDaysAgo(5),
                      earliestCommit: getNDaysAgo(35),
                      commitCount: 378,
                    },
                  ],
                },
              },
              {
                node: {
                  id: "Q29udHJpYnV0b3I6NGQ3YmI5MjUtZDhmMy00MTllLTg3YWItNmZkMDg3ZjY3MzRl",
                  key: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
                  name: "Krishna Kumar",
                  earliestCommit: getNDaysAgo(1375),
                  latestCommit: getNDaysAgo(4),
                  commitCount: 7917,
                  contributorAliasesInfo: [
                    {
                      key: "4ba4f636-b290-4602-be18-47187b9b6b5a",
                      name: "krishnaku",
                      alias: "kkumar@exathink.com",
                      latestCommit: getNDaysAgo(180),
                      earliestCommit: getNDaysAgo(1000),
                      commitCount: 569,
                    },
                    {
                      key: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
                      name: "Krishna Kumar",
                      alias: "kkumar@exathink.com",
                      latestCommit: getNDaysAgo(4),
                      earliestCommit: getNDaysAgo(1375),
                      commitCount: 6944,
                    },
                    {
                      key: "5b7eecb4-b0c2-4001-904d-542c28fd3204",
                      name: "Pragya Goyal",
                      alias: "pragya@64sqs.com",
                      latestCommit: getNDaysAgo(5),
                      earliestCommit: getNDaysAgo(365),
                      commitCount: 397,
                    },
                    {
                      key: "64814d00-e3e0-45b0-b4a2-f863c490dddd",
                      name: "krishna",
                      alias: "kkumar@exathink.com",
                      latestCommit: getNDaysAgo(1544),
                      earliestCommit: getNDaysAgo(1644),
                      commitCount: 7,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];

const mocks = [...contributorAliasesMocks, ...updateContributorMocks];

const propsFixture = {
  accountKey: "24347f28-0020-4025-8801-dbc627f9415d",
  context: {go: jest.fn()},
};

describe("ManageContributorsWorkflow", () => {
  describe("SelectContributorsPage", () => {
    describe("when there is no data for contributors", () => {
      const emptyContributorsMocks = [
        {
          request: gqlRequest,
          result: {
            data: {
              account: {
                contributors: {
                  edges: [],
                },
              },
            },
          },
        },
      ];

      test("should not render title for table", () => {
        // TOBE Done
        // renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, emptyContributorsMocks);
        // expect(
        //   screen.queryByText(/Select one or more contributors to merge into a single contributor/i)
        // ).not.toBeInTheDocument();
      });

      test("should render table with no records", () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, emptyContributorsMocks);
        const {getByText} = within(screen.queryByTestId("select-contributors-table"));
        getByText(/no data/i);
      });

      test("should render active contributors as zero", () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, emptyContributorsMocks);
        const {getByText} = within(screen.queryByTestId("active-contributors"));
        getByText(/0/i);
      });

      test("should render Next button as disabled", () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, emptyContributorsMocks);
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();
      });
    });

    describe("when there are errors", () => {
      let logGraphQlError;
      beforeEach(() => {
        logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
      });
      afterEach(() => {
        logGraphQlError.mockRestore();
      });

      const mockNetworkError = [
        {
          request: gqlRequest,
          error: new Error("A network error Occurred"),
        },
      ];

      const mockGraphQlErrors = [
        {
          request: gqlRequest,
          result: {
            errors: [new GraphQLError("A GraphQL Error Occurred")],
          },
        },
      ];

      test("it renders nothing and logs the error when there is a network error", async () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, mockNetworkError);
        // before
        expect(screen.queryByTestId("select-contributors-table")).toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByTestId("select-contributors-table")).not.toBeInTheDocument();
      });

      test("it renders nothing and logs the error when there is a GraphQl error", async () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, mockGraphQlErrors);
        // before
        expect(screen.queryByTestId("select-contributors-table")).toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByTestId("select-contributors-table")).not.toBeInTheDocument();
      });
    });

    describe("when there is data for contributors", () => {
      test("should render title for table", () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, contributorAliasesMocks);
        screen.getByText(/Select one or more contributors to merge into a single contributor/i);
      });

      test("should render slider with knob at mark 30", () => {});

      test("should render active contributors label and count correctly", async () => {
        // TODO
        // renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, contributorAliasesMocks);
        // const {findByText} = within(screen.queryByTestId("active-contributors"))
        // expect(await findByText(/0/i)).toBeInTheDocument();
      });

      test("should render select contributors table with correct no of contributos", () => {});

      test("should render collapsible records for contributors, when there are more than 1 aliases under a contributor", () => {});

      test("when one collapsible record is selected, other collapsible records should be disabled for selection", () => {});

      test("all alias records under a collapsible contributor should be disabled for selection", () => {});

      test("all top level contributors should be enabled for selection", () => {});

      test("when none of the records are selected, Next button should be disabled", () => {});

      test("when any of the records is selected, Next button should be enabled", () => {});

      test("when Next button is clicked, it should move to UpdateContributor page", () => {});
    });
  });

  describe("SelectParentContributorPage", () => {
    test("should render correct title for selection table", () => {});

    test("Next button is disabled initially", () => {});

    test("After we have selected any record as merge target, Next button is enabled", () => {});

    test("should navigate to UpdateContributorPage, when Next button is clicked", () => {});
  });

  describe("UpdateContributorPage", () => {
    describe("single non-parent contributor", () => {
      test("should render Contributor textbox with parent contributor as its initial value", () => {});

      test("should render exclude from analysis checkbox", () => {});

      test("should render UpdateContributor button as disabled initially", () => {});

      test("After we have edited Contributor textbox or excludeFromAnalsyis checkbox, UpdateContributor button is enabled", () => {});

      test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that, then navigates to select contributors page", () => {});
    });

    describe("unlink flow", () => {
      test("should render correct title for the table", () => {});
      test("should render Contributor textbox with parent contributor as its initial value", () => {});
      test("should not render exclude from analysis checkbox", () => {});
      test("should not render checkbox for any record in the table", () => {});
      test("should render toggle for all records in the table", () => {});
      test("should render all toggles as checked for all records in the table", () => {});
      test("when a toggle is unchecked for a record, corresponding message for title changes", () => {});
      test("should render UpdateContributor button as disabled initially", () => {});
      test("when a toggle is unchecked for a record, UpdateContributor button is enabled", () => {});
      test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that, then navigates to select contributors page", () => {});
    });

    describe("regular update contributor flow", () => {
      test("should render correct title for the table", () => {});

      test("should render checkbox for all records in the table", () => {});

      test("should render Contributor textbox with parent contributor as its initial value", () => {});

      test("should render exclude from analysis checkbox", () => {});

      test("should render all non-parent contributors to be selected by default inside the table", () => {});

      test("when all non-parent contributors are unchecked, Next button should be disabled, assuming textbox and checkbox are untouched", () => {});

      test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that, then navigates to select contributors page", () => {});
    });
  });
});
