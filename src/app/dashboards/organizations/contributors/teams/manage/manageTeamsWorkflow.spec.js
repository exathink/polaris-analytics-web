import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_TEAMS} from "./useUpdateTeams";
import {GET_ORGANIZATION_CONTRIBUTORS_QUERY} from "./useQueryOrganizationContributors";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {ManageTeamsWorkflow as ManageTeamsWorkflowWithoutIntl} from "./manageTeamsWorkflow";
import {GraphQLError} from "graphql/error";
import {injectIntl} from "react-intl";

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

const gqlRequest = {
  query: GET_ORGANIZATION_CONTRIBUTORS_QUERY,
  variables: {
    key: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
    commitWithinDays: 30,
  },
};

const gqlMutationRequest = {
  query: UPDATE_TEAMS,
  variables: {
    organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
    contributorTeamAssignments: [
      {
        contributorKey: "5b7eecb4-b0c2-4001-904d-542c28fd3204",
        newTeamKey: "540444dd-c045-41ed-a017-0b3326620901",
        capacity: 0.5
      },
      {
        contributorKey: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
        newTeamKey: "f3bd6f1d-5c6a-41d2-81de-dfce5e794580",
        capacity: 0.5
      },
      {
        contributorKey: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
        newTeamKey: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
        capacity: 0.5
      },
    ],
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
                  capacity: 0.5
                },
              },
              {
                node: {
                  name: "Krishna Kumar",
                  key: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
                  teamName: "Team Alpha",
                  teamKey: "f3bd6f1d-5c6a-41d2-81de-dfce5e794580",
                  earliestCommit: getNDaysAgo(255),
                  latestCommit: getNDaysAgo(9),
                  commitCount: 7881,
                  capacity: 0.5
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
                  capacity: 0.5
                },
              },
            ],
          },
        },
      },
    },
  },
];

const propsFixture = {
  organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
  teamsList: [
    {
      name: "Team Theta",
      key: "540444dd-c045-41ed-a017-0b3326620901",
      contributorCount: 2,
    },
    {
      name: "Team Alpha",
      key: "f3bd6f1d-5c6a-41d2-81de-dfce5e794580",
      contributorCount: null,
    },
    {
      name: "Team Bravo",
      key: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
      contributorCount: 1,
    },
  ],
  context: {go: jest.fn()},
};

describe("ManageTeamsWorkflow", () => {
  describe("SelectTeamMembersPage", () => {
    describe("when there is no data for contributors", () => {
      const emptyContributorsMocks = [
        {
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
        },
      ];

      beforeEach(() => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, emptyContributorsMocks);
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
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, mockNetworkError);
        // before
        expect(screen.queryByTestId("select-team-members-table")).toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByTestId("select-team-members-table")).not.toBeInTheDocument();
      });

      test("it renders nothing and logs the error when there is a GraphQl error", async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, mockGraphQlErrors);
        // before
        expect(screen.queryByTestId("select-team-members-table")).toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByTestId("select-team-members-table")).not.toBeInTheDocument();
      });
    });

    describe("when there is data for contributors", () => {
      // setup initial conditions for this flow
      beforeEach(async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, contributorMocks);
      });

      test("should render title for table", async () => {
        await screen.findByText(/Select one or more contributors to add to a new or existing team/i);
      });

      test("should render slider with knob at mark 30", () => {
        const daysRangeSlider = screen.getByRole("slider");
        expect(daysRangeSlider).toBeInTheDocument();
        expect(daysRangeSlider.getAttribute("aria-valuenow")).toBe("30");
      });

      test("should render active contributors label and count correctly", async () => {
        const {findByText} = within(screen.getByTestId("active-contributors"));
        expect(await findByText(/Active Contributors/i)).toBeInTheDocument();
        expect(await findByText(/3/i)).toBeInTheDocument();
      });

      test("should render table with correct no of contributors", async () => {
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkBoxElements = await findAllByRole("checkbox");

        expect(checkBoxElements).toHaveLength(3);
      });

      test("when any of the records is selected, Next button should be enabled", async () => {
        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkboxElements = await findAllByRole("checkbox");
        const [first] = checkboxElements;

        // click checkbox for any record
        fireEvent.click(first);

        // after next button is enabled
        expect(nextButton).toBeEnabled();
      });

      test("when Next button is clicked, it should move to UpdateTeams page", async () => {
        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkboxElements = await findAllByRole("checkbox");
        const [first, second] = checkboxElements;

        // click checkboxes for both records
        fireEvent.click(first);
        fireEvent.click(second);

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click next button
        fireEvent.click(nextButton);

        // assert we are on the update teams page
        await screen.findByText(/Update target team and allocation capacity for below contributors/i);
      });
    });
  });

  describe("UpdateTeamsPage", () => {
    describe("regular update teams flow", () => {
      beforeEach(async () => {
        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, contributorMocks);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateTeams Page.
        fireEvent.click(nextButton);
      });

      test("should render correct title for the table", async () => {
        await screen.findByText(/Update target team and allocation capacity for below contributors/i);
      });

      test("should render all selected contributors from previous page to be selected by default", async () => {
        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("update-teams-table"));
        const checkboxElements = await findAllByRole("checkbox");

        expect(checkboxElements).toHaveLength(3);
        checkboxElements.forEach((checkboxElement) => {
          expect(checkboxElement.checked).toBe(true);
        });
      });

      test("when all the contributors are unchecked, Update Team button should be disabled", async () => {
        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("update-teams-table"));
        const checkboxElements = await findAllByRole("checkbox");

        expect(checkboxElements).toHaveLength(3);
        checkboxElements.forEach((checkboxElement) => {
          expect(checkboxElement.checked).toBe(true);
        });

        // before update team button is enabled
        const updateTeamsButton = screen.getByRole("button", {name: /Update Team/i});
        expect(updateTeamsButton).toBeEnabled();

        // uncheck the checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after update team button is disabled
        expect(checkboxElements[0].checked).toBe(false);
        expect(updateTeamsButton).toBeDisabled();
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
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateTeams Page.
        fireEvent.click(nextButton);

        // find Update Team button
        const updateTeamButton = await screen.findByRole("button", {name: /Update Team/i});

        // before
        expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();

        // click update team button
        fireEvent.click(updateTeamButton);

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
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateTeams Page.
        fireEvent.click(nextButton);

        // find Update Team button
        const updateTeamButton = await screen.findByRole("button", {name: /Update Team/i});

        // before
        expect(screen.queryByText(/graphql error/i)).not.toBeInTheDocument();

        // click update contributor button
        fireEvent.click(updateTeamButton);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        // after
        expect(screen.queryByText(/graphql error/i)).toBeInTheDocument();
      });
    });

    describe("when there is success on update team action", () => {
      test("when Update Team button is clicked, it remains disabled till the time mutation is executing, shows success message after that", async () => {
        const mutationReq = {
          query: UPDATE_TEAMS,
          variables: {
            organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
            // as we have selected team bravo below, make sure to pass same team key here
            contributorTeamAssignments: [
              {
                contributorKey: "5b7eecb4-b0c2-4001-904d-542c28fd3204",
                newTeamKey: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
                capacity: 0.5
              },
              {
                contributorKey: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
                newTeamKey: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
                capacity: 0.5
              },
              {
                contributorKey: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                newTeamKey: "e0f303ea-b52e-424d-a00e-e5f4376283e0",
                capacity: 0.5
              },
            ],
          },
        };

        const updateContributorMocks = [
          {
            request: mutationReq,
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

        const customMocks = [...contributorMocks, ...updateContributorMocks];

        renderWithProviders(<ManageTeamsWorkflow {...propsFixture} />, customMocks);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-team-members-table"));
        const checkboxElements = await findAllByRole("checkbox");

        // click all checkbox
        checkboxElements.forEach((checkboxElement) => {
          fireEvent.click(checkboxElement);
        });

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateTeams Page.
        fireEvent.click(nextButton);

        // Select Target Team (By Default First Team from the dropdown is selected)
        const selectContainer = screen.getByTestId("update-teams-select");
        const {getByRole, getByText} = within(selectContainer);
        const selectElement = getByRole("combobox");

        // select team bravo
        fireEvent.mouseDown(selectElement);
        fireEvent.click(getByText(/team bravo/i));

        // find Update Team button
        const updateTeamButton = await screen.findByRole("button", {name: /Update Team/i});

        // before
        expect(screen.queryByText(/success/i)).not.toBeInTheDocument();

        // click update contributor button
        fireEvent.click(updateTeamButton);

        // update team button is disabled till the time mutation is executing
        expect(updateTeamButton).toBeDisabled();

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        // after
        expect(await screen.findByText(/success/i)).toBeInTheDocument();
      });
    });
  });
});
