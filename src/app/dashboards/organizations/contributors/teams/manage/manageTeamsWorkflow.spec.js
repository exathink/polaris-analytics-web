import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_TEAMS} from "./useUpdateTeams";
import {GET_ORGANIZATION_CONTRIBUTORS_QUERY} from "./useQueryOrganizationContributors";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {ManageTeamsWorkflow as ManageTeamsWorkflowWithoutIntl} from "./manageTeamsWorkflow";
import {GraphQLError} from "graphql/error";
import {injectIntl} from "react-intl";
import {GET_ORGANIZATION_TEAMS_QUERY} from "../useQueryOrganizationTeams";

const ManageTeamsWorkflow = injectIntl(ManageTeamsWorkflowWithoutIntl);

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
  query: UPDATE_TEAMS,
  variables: {
    organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
    contributorTeamAssignments: [
      {
        contributorKey: "5b7eecb4-b0c2-4001-904d-542c28fd3204",
        newTeamKey: "540444dd-c045-41ed-a017-0b3326620901",
      },
      {
        contributorKey: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
        newTeamKey: "540444dd-c045-41ed-a017-0b3326620901",
      },
    ],
  },
};

const updateContributorMocks = [
  {
    request: gqlMutationRequest,
    result: {
      data: {
        updateContributorTeamAssignments: {
          success: true,
          errorMessage: null,
          updateCount: 2,
        },
      },
    },
  },
];

const gqlRequest = {
  query: GET_ORGANIZATION_CONTRIBUTORS_QUERY,
  variables: {
    key: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
    commitWithinDays: 30,
  },
};

const gqlRequest2 = {
  query: GET_ORGANIZATION_TEAMS_QUERY,
  variables: {
    organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
  },
};

const contributorMocks = [
  {
    request: gqlRequest,
    result: {
      data: {
        organization: {
          contributors: {
            edges: [
              {
                node: {
                  name: "Pragya Goyal",
                  key: "5b7eecb4-b0c2-4001-904d-542c28fd3204",
                  teamName: "Team Theta",
                  teamKey: "540444dd-c045-41ed-a017-0b3326620901",
                  earliestCommit: getNDaysAgo(225),
                  latestCommit: getNDaysAgo(11),
                  commitCount: 746,
                },
              },
              {
                node: {
                  name: "Krishna Kumar",
                  key: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
                  teamName: "Team Theta",
                  teamKey: "540444dd-c045-41ed-a017-0b3326620901",
                  earliestCommit: getNDaysAgo(255),
                  latestCommit: getNDaysAgo(9),
                  commitCount: 7881,
                },
              },
              {
                node: {
                  name: "Aman Mavai",
                  key: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                  teamName: "Team Bravo",
                  teamKey: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
                  earliestCommit: getNDaysAgo(200),
                  latestCommit: getNDaysAgo(10),
                  commitCount: 858,
                },
              },
            ],
          },
        },
      },
    },
  },
];

const mocks = [...contributorMocks, ...updateContributorMocks];

const propsFixture = {
  organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
  context: {go: jest.fn()},
};

describe("ManageTeamsWorkflow", () => {
  describe("SelectTeamMembersPage", () => {
    describe("when there is no data for contributors", () => {
      const emptyContributorsMocks = {
        request: gqlRequest,
        result: {
          data: {
            organization: {
              contributors: {
                edges: [],
              },
            },
          },
        },
      };

      const emptyTeamsMocks = {
        request: gqlRequest2,
        result: {
          organization: {
            teams: {
              edges: [
                {
                  node: {
                    name: "Team Theta",
                    key: "540444dd-c045-41ed-a017-0b3326620901",
                    contributorCount: 2,
                  },
                },
                {
                  node: {
                    name: "Team Alpha",
                    key: "f3bd6f1d-5c6a-41d2-81de-dfce5e794580",
                    contributorCount: null,
                  },
                },
                {
                  node: {
                    name: "Team Bravo",
                    key: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
                    contributorCount: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const emptyMocks = [emptyTeamsMocks, emptyContributorsMocks];
      beforeEach(() => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, emptyMocks);
      });

      test("should not render title for table", () => {
        expect(
          screen.queryByText(/Select one or more contributors to add to a new or existing team/i)
        ).not.toBeInTheDocument();
      });

      test("should render table with no records", () => {
        const {getByText} = within(screen.queryByTestId("select-team-members-table"));
        getByText(/no data/i);
      });

      test("should render active contributors as zero", () => {
        const {getByText} = within(screen.queryByTestId("active-contributors"));
        getByText(/0/i);
      });

      test("should render Next button as disabled", () => {
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();
      });
    });

    describe.skip("when there are errors", () => {
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
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, mockNetworkError);
        // before
        expect(screen.queryByTestId("select-contributors-table")).toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByTestId("select-contributors-table")).not.toBeInTheDocument();
      });

      test("it renders nothing and logs the error when there is a GraphQl error", async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, mockGraphQlErrors);
        // before
        expect(screen.queryByTestId("select-contributors-table")).toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByTestId("select-contributors-table")).not.toBeInTheDocument();
      });
    });

    describe.skip("when there is data for contributors", () => {
      // setup initial conditions for this flow
      beforeEach(async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, contributorMocks);
      });

      test("should render title for table", async () => {
        await screen.findByText(/Select one or more contributors to merge into a single contributor/i);
      });

      test("should render slider with knob at mark 30", () => {
        const daysRangeSlider = screen.getByRole("slider");
        expect(daysRangeSlider).toBeInTheDocument();
        expect(daysRangeSlider.getAttribute("aria-valuenow")).toBe("30");
      });

      test("should render active contributors label and count correctly", async () => {
        const {findByText} = within(screen.getByTestId("active-contributors"));
        expect(await findByText(/Active Contributors/i)).toBeInTheDocument();
        expect(await findByText(/2/i)).toBeInTheDocument();
      });

      test("should render select contributors table with correct no of contributors", async () => {
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkBoxElements = await findAllByRole("checkbox");

        expect(checkBoxElements).toHaveLength(2);
      });

      test("when any of the records is selected, Next button should be enabled", async () => {
        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");
        const [first] = checkboxElements;

        // click checkbox for any record
        fireEvent.click(first);

        // after next button is enabled
        expect(nextButton).toBeEnabled();
      });

      test("when Next button is clicked, it should move to UpdateContributor page", async () => {
        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");
        const [first, second] = checkboxElements;

        // click checkboxes for both records
        fireEvent.click(first);
        fireEvent.click(second);

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click next button
        fireEvent.click(nextButton);

        // assert we are on the update contributor page
        await screen.findByText(
          /Contributions from the contributors below will be merged into contributions from Krishna Kumar/i
        );
      });
    });
  });

  describe.skip("UpdateTeamsPage", () => {
    describe("regular update contributor flow", () => {
      beforeEach(async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, contributorMocks);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateContributors Page.
        fireEvent.click(nextButton);
      });

      test("should render correct title for the table", async () => {
        await screen.findByText(
          /Contributions from the contributors below will be merged into contributions from Krishna Kumar/i
        );
      });

      test("should render Contributor textbox with parent contributor as its initial value", async () => {
        const contributorTextbox = await screen.findByRole("textbox");
        expect(contributorTextbox.value).toBe("Krishna Kumar");
      });

      test("should render exclude from analysis label and checkbox", async () => {
        const {findByRole, findByText} = within(await screen.findByTestId("exclude-from-analysis"));
        const excludeFromAnalsyisLabel = await findByText(/Exclude From Analysis/i);
        const excludeFromAnalsyisCheckbox = await findByRole("checkbox");
        expect(excludeFromAnalsyisLabel).toBeInTheDocument();
        expect(excludeFromAnalsyisCheckbox).toBeInTheDocument();
      });

      test("should render all non-parent contributors to be selected by default inside the table", async () => {
        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("update-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");

        expect(checkboxElements).toHaveLength(1);
        expect(checkboxElements[0].checked).toBe(true);
      });

      test("when all non-parent contributors are unchecked, Update Contributor button should be disabled, assuming textbox and checkbox are untouched", async () => {
        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("update-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");

        expect(checkboxElements).toHaveLength(1);
        expect(checkboxElements[0].checked).toBe(true);

        // before update contributor button is enabled
        const updateContributorButton = screen.getByRole("button", {name: /Update Contributor/i});
        expect(updateContributorButton).toBeEnabled();

        // uncheck the checkbox
        fireEvent.click(checkboxElements[0]);

        // after update contributor button is disabled
        expect(checkboxElements[0].checked).toBe(false);
        expect(updateContributorButton).toBeDisabled();
      });
    });

    describe("when there are errors", () => {
      let logGraphQlError;
      beforeAll(() => {
        // changing the mockImplementation to be no-op, so that console remains clean. as we only need to assert whether it has been called.
        logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
      });
      afterAll(() => {
        logGraphQlError.mockRestore();
      });

      const mockNetworkError = [
        {
          request: gqlMutationRequest,
          error: new Error("A network error Occurred"),
        },
      ];

      const mockGraphQlErrors = [
        {
          request: gqlMutationRequest,
          result: {
            errors: [new GraphQLError("A GraphQL Error Occurred")],
          },
        },
      ];

      test("it renders network error message and logs the error when there is a network error", async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, [...contributorMocks, ...mockNetworkError]);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateContributors Page.
        fireEvent.click(nextButton);

        // find Update Contributor button
        const updateContributorButton = await screen.findByRole("button", {name: /Update Contributor/i});

        // before
        expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();

        // click update contributor button
        fireEvent.click(updateContributorButton);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());

        // after
        expect(screen.queryByText(/network error/i)).toBeInTheDocument();
      });

      test("it renders graphql error message and logs the error when there is a GraphQl error", async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, [...contributorMocks, ...mockGraphQlErrors]);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateContributors Page.
        fireEvent.click(nextButton);

        // find Update Contributor button
        const updateContributorButton = await screen.findByRole("button", {name: /Update Contributor/i});

        // before
        expect(screen.queryByText(/graphql error/i)).not.toBeInTheDocument();

        // click update contributor button
        fireEvent.click(updateContributorButton);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByText(/graphql error/i)).toBeInTheDocument();
      });
    });

    describe("when there is success on update contributor action", () => {
      describe("regular update contributor flow", () => {
        test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that", async () => {
          renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, mocks);

          // before next button is disabled
          const nextButton = screen.getByRole("button", {name: /Next/i});
          expect(nextButton).toBeDisabled();

          // find all checkbox elements
          const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
          const checkboxElements = await findAllByRole("checkbox");

          // click all checkbox
          checkboxElements.forEach((checkboxElement) => {
            fireEvent.click(checkboxElement);
          });

          // after next button is enabled
          expect(nextButton).toBeEnabled();

          // click on next button, will navigate to UpdateContributors Page.
          fireEvent.click(nextButton);

          // find Update Contributor button
          const updateContributorButton = await screen.findByRole("button", {name: /Update Contributor/i});

          // before
          expect(screen.queryByText(/success/i)).not.toBeInTheDocument();

          // click update contributor button
          fireEvent.click(updateContributorButton);

          // update contributor button is disabled till the time mutation is executing
          expect(updateContributorButton).toBeDisabled();

          const inProgressElement = screen.getByText(/Processing.../i);
          expect(inProgressElement).toBeInTheDocument();

          // after
          expect(await screen.findByText(/success/i)).toBeInTheDocument();
        });
      });
    });
  });
});
