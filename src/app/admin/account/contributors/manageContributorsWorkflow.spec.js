import React from "react";
import {renderWithProviders, gqlUtils} from "../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_CONTRIBUTOR} from "./useUpdateContributor";
import {GET_CONTRIBUTOR_ALIASES_INFO_QUERY} from "./useQueryContributorAliasesInfo";
import {getNDaysAgo} from "../../../../test/test-utils";
import {ManageContributorsWorkflow as ManageContributorsWorkflowWithoutIntl} from "./manageContributorsWorkflow";
import {GraphQLError} from "graphql/error";
import {injectIntl} from "react-intl";

const ManageContributorsWorkflow = injectIntl(ManageContributorsWorkflowWithoutIntl);

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
      contributorAliasKeys: ["22a83ff0-00a1-45e1-bcfe-74542a64ceb1"],
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
  query: GET_CONTRIBUTOR_ALIASES_INFO_QUERY("account"),
  variables: {
    key: "24347f28-0020-4025-8801-dbc627f9415d",
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
  dimension: "account",
  instanceKey: "24347f28-0020-4025-8801-dbc627f9415d",
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

      beforeEach(() => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, emptyContributorsMocks);
      });

      test("should not render title for table", () => {
        expect(
          screen.queryByText(/Select one or more contributors to merge into a single contributor/i)
        ).not.toBeInTheDocument();
      });

      test("should render table with no records", () => {
        const {getByText} = within(screen.queryByTestId("select-contributors-table"));
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
      // setup initial conditions for this flow
      beforeEach(async () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, contributorAliasesMocks);
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

    describe("contributors disable behaviour", () => {
      const selectContributorsMocks = [
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
                        id: "R39udHJpYnV0b3I6MjJhODNmZjAtMDBhMS00NWUxLWJjZmUtNzQ1NDJhNjRjZWIx",
                        key: "33a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                        name: "Test Lname",
                        earliestCommit: getNDaysAgo(35),
                        latestCommit: getNDaysAgo(5),
                        commitCount: 37,
                        contributorAliasesInfo: [
                          {
                            key: "33a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                            name: "Test Lname",
                            alias: "test.lname@gslab.com",
                            latestCommit: getNDaysAgo(5),
                            earliestCommit: getNDaysAgo(35),
                            commitCount: 37,
                          },
                          {
                            key: "5e7bb925-d8f3-419e-87ab-6fd087f6734e",
                            name: "Janvi Singh",
                            alias: "janvi@exathink.com",
                            latestCommit: getNDaysAgo(4),
                            earliestCommit: getNDaysAgo(1375),
                            commitCount: 564,
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
      beforeEach(() => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, selectContributorsMocks);
      });

      test("all alias records under a parent contributor should be disabled for selection", async () => {
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const expandElements = await findAllByRole("button", {name: /Expand row/i});
        // click third element which is parent contributor
        fireEvent.click(expandElements[2]);

        const allCheckboxElements = await findAllByRole("checkbox");

        // after third element all are child nodes
        const [, , , ...childNodes] = allCheckboxElements;
        childNodes.forEach((checkboxElement) => {
          expect(checkboxElement).toBeDisabled();
        });
      });

      test("when one parent contributor record is selected, other parent contributor records should be disabled for selection", async () => {
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));

        const allCheckboxElements = await findAllByRole("checkbox");
        expect(allCheckboxElements).toHaveLength(3);

        // second and third elements are parent contributors, first is non-parent
        const [, second, third] = allCheckboxElements;

        // before
        expect(third).toBeEnabled();

        // click the second element's checkbox
        fireEvent.click(second);

        // after
        expect(third).toBeDisabled();
      });
    });
  });

  describe("SelectParentContributorPage", () => {
    const selectParentMocks = [
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
                      id: "R39udHJpYnV0b3I6MjJhODNmZjAtMDBhMS00NWUxLWJjZmUtNzQ1NDJhNjRjZWIx",
                      key: "33a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                      name: "Test Lname",
                      earliestCommit: getNDaysAgo(35),
                      latestCommit: getNDaysAgo(5),
                      commitCount: 37,
                      contributorAliasesInfo: [
                        {
                          key: "33a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                          name: "Test Lname",
                          alias: "test.lname@gslab.com",
                          latestCommit: getNDaysAgo(5),
                          earliestCommit: getNDaysAgo(35),
                          commitCount: 37,
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
    // setup initial conditions for this flow
    beforeEach(async () => {
      renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, selectParentMocks);

      // before next button is disabled
      const nextButton = screen.getByRole("button", {name: /Next/i});
      expect(nextButton).toBeDisabled();

      // find all checkbox elements
      const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
      const checkboxElements = await findAllByRole("checkbox");
      const [nonParentRecordCheckbox1, nonParentRecordCheckbox2] = checkboxElements;

      // click non-parent record checkboxes
      fireEvent.click(nonParentRecordCheckbox1);
      fireEvent.click(nonParentRecordCheckbox2);

      // after next button is enabled
      expect(nextButton).toBeEnabled();

      // click on next button, will navigate to UpdateContributors Page.
      fireEvent.click(nextButton);
    });

    test("should render correct title for selection table", async () => {
      await screen.findByText(/Select a contributor: The remaining contributors will be merged into this one/i);
    });

    test("After we have selected any record as merge target, Next button is enabled", async () => {
      const {findAllByRole} = within(await screen.findByTestId("select-parent-contributor"));
      const mergeTargetElements = await findAllByRole("radio");
      const [mergeTargetElement] = mergeTargetElements;

      // before next button is disabled
      const nextButton = screen.getByRole("button", {name: /Next/i});
      expect(nextButton).toBeDisabled();

      // click merge target record's radio button as parent contributor
      fireEvent.click(mergeTargetElement);

      expect(nextButton).toBeEnabled();
    });

    test("should navigate to UpdateContributorPage, when Next button is clicked", async () => {
      const {findAllByRole} = within(await screen.findByTestId("select-parent-contributor"));
      const mergeTargetElements = await findAllByRole("radio");
      const [mergeTargetElement] = mergeTargetElements;

      // before next button is disabled
      const nextButton = screen.getByRole("button", {name: /Next/i});
      expect(nextButton).toBeDisabled();

      // click merge target record's radio button as parent contributor
      fireEvent.click(mergeTargetElement);

      expect(nextButton).toBeEnabled();

      // click next button
      fireEvent.click(nextButton);

      // assert we are on the Update Contributor Page
      await screen.findByText(
        /Contributions from the contributors below will be merged into contributions from Aman Mavai/i
      );
    });

    test("should navigate to UpdateContributorPage, with second contributor as merge target, when Next button is clicked", async () => {
      const {findAllByRole} = within(await screen.findByTestId("select-parent-contributor"));
      const mergeTargetElements = await findAllByRole("radio");
      const [_, mergeTargetElement] = mergeTargetElements;

      // before next button is disabled
      const nextButton = screen.getByRole("button", {name: /Next/i});
      expect(nextButton).toBeDisabled();

      // click merge target record's radio button as parent contributor
      fireEvent.click(mergeTargetElement);

      expect(nextButton).toBeEnabled();

      // click next button
      fireEvent.click(nextButton);

      // assert we are on the Update Contributor Page

      await screen.findByText(
        /Contributions from the contributors below will be merged into contributions from Test Lname/i
      );
    });
  });

  describe("UpdateContributorPage", () => {
    describe("single non-parent contributor", () => {
      // setup initial conditions for this flow
      beforeEach(async () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, mocks);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");
        const nonParentRecordCheckbox = checkboxElements[0];

        // click parent record checkbox
        fireEvent.click(nonParentRecordCheckbox);

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateContributors Page.
        fireEvent.click(nextButton);
      });

      test("should render Contributor textbox with parent contributor as its initial value", async () => {
        const contributorTextbox = await screen.findByRole("textbox");
        expect(contributorTextbox.value).toBe("Aman Mavai");
      });

      test("should render exclude from analysis checkbox", async () => {
        const {findByRole, findByText} = within(await screen.findByTestId("exclude-from-analysis"));
        const excludeFromAnalsyisLabel = await findByText(/Exclude From Analysis/i);
        const excludeFromAnalsyisCheckbox = await findByRole("checkbox");
        expect(excludeFromAnalsyisLabel).toBeInTheDocument();
        expect(excludeFromAnalsyisCheckbox).toBeInTheDocument();
      });

      test("After we have edited Contributor textbox, UpdateContributor button is enabled", async () => {
        // before update contributor button is disabled
        const updateContributorButton = screen.getByRole("button", {name: /Update Contributor/i});
        expect(updateContributorButton).toBeDisabled();

        const contributorTextbox = await screen.findByRole("textbox");
        //update the textbox value
        fireEvent.change(contributorTextbox, {target: {value: "Krishna"}});

        expect(updateContributorButton).toBeEnabled();
      });

      test("After we have updated excludeFromAnalsyis checkbox, UpdateContributor button is enabled", async () => {
        // before update contributor button is disabled
        const updateContributorButton = screen.getByRole("button", {name: /Update Contributor/i});
        expect(updateContributorButton).toBeDisabled();

        const {findByRole} = within(await screen.findByTestId("exclude-from-analysis"));
        const excludeFromAnalsyisCheckbox = await findByRole("checkbox");
        expect(excludeFromAnalsyisCheckbox).toBeInTheDocument();

        fireEvent.click(excludeFromAnalsyisCheckbox);

        // after exclude from analysis checkbox is checked, update contributor button is enabled
        expect(updateContributorButton).toBeEnabled();
      });
    });

    describe("unlink flow", () => {
      // setup initial conditions for unlink flow
      beforeEach(async () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, contributorAliasesMocks);

        // before next button is disabled
        const nextButton = screen.getByRole("button", {name: /Next/i});
        expect(nextButton).toBeDisabled();

        // find all checkbox elements
        const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
        const checkboxElements = await findAllByRole("checkbox");
        const parentRecordCheckbox = checkboxElements[1];

        // click parent record checkbox
        fireEvent.click(parentRecordCheckbox);

        // after next button is enabled
        expect(nextButton).toBeEnabled();

        // click on next button, will navigate to UpdateContributors Page.
        fireEvent.click(nextButton);
      });

      test("should render correct title for the table", async () => {
        await screen.findByText(
          /Click the toggle on the right to disconnect a contributor as an alias for Krishna Kumar/i
        );
      });

      test("should render Contributor textbox with parent contributor as its initial value", async () => {
        const contributorTextbox = await screen.findByRole("textbox");
        expect(contributorTextbox.value).toBe("Krishna Kumar");
      });

      test("should not render exclude from analysis label and checkbox", async () => {
        const {queryByRole, queryByText} = within(await screen.findByTestId("exclude-from-analysis"));
        const excludeFromAnalsyisLabel = await queryByText(/Exclude From Analysis/i);
        const excludeFromAnalsyisCheckbox = await queryByRole("checkbox");
        expect(excludeFromAnalsyisLabel).not.toBeInTheDocument();
        expect(excludeFromAnalsyisCheckbox).not.toBeInTheDocument();
      });

      test("should render all toggles as checked for all records in the table", async () => {
        // find all checkbox toggle
        const {findAllByRole} = within(screen.getByTestId("select-merge-target-table"));
        const toggleElements = await findAllByRole("switch");

        expect(toggleElements).toHaveLength(3);
        toggleElements.forEach((toggleElement) => expect(toggleElement.getAttribute("aria-checked")).toBe("true"));
      });

      test("when a toggle is unchecked for a record, corresponding message for title changes", async () => {
        // find all toggle elements
        const {findAllByRole} = within(screen.getByTestId("select-merge-target-table"));
        const toggleElements = await findAllByRole("switch");

        expect(toggleElements).toHaveLength(3);
        // before all are checked to be true
        toggleElements.forEach((toggleElement) => expect(toggleElement.getAttribute("aria-checked")).toBe("true"));

        const [first, second] = toggleElements;
        fireEvent.click(first);
        await screen.findByText(/1 contributor will be unlinked from Krishna Kumar/i);

        fireEvent.click(second);
        await screen.findByText(/2 contributors will be unlinked from Krishna Kumar/i);
      });

      test("when a toggle is unchecked for a record, UpdateContributor button is enabled", async () => {
        // before update contributor button is disabled
        const updateContributorButton = screen.getByRole("button", {name: /Update Contributor/i});
        expect(updateContributorButton).toBeDisabled();

        // find all toggle elements
        const {findAllByRole} = within(screen.getByTestId("select-merge-target-table"));
        const toggleElements = await findAllByRole("switch");

        expect(toggleElements).toHaveLength(3);
        // before all are checked to be true
        toggleElements.forEach((toggleElement) => expect(toggleElement.getAttribute("aria-checked")).toBe("true"));

        // uncheck first toggle
        const [first] = toggleElements;
        fireEvent.click(first);
        await screen.findByText(/1 contributor will be unlinked from Krishna Kumar/i);

        // after update contributor button is enabled
        expect(updateContributorButton).toBeEnabled();
      });
    });

    describe("regular update contributor flow", () => {
      beforeEach(async () => {
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, contributorAliasesMocks);

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
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, [
          ...contributorAliasesMocks,
          ...mockNetworkError,
        ]);

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
        renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, [
          ...contributorAliasesMocks,
          ...mockGraphQlErrors,
        ]);

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
      describe("single non-parent contributor", () => {
        const mutationReq = {
          query: UPDATE_CONTRIBUTOR,
          variables: {
            contributorKey: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
            updatedInfo: {
              contributorName: "Aman Mavai New",
            },
          },
        };

        const singleNonParentMocks = [
          {
            request: mutationReq,
            result: {
              data: {
                updateContributor: {
                  updateStatus: {
                    success: true,
                    contributorKey: "22a83ff0-00a1-45e1-bcfe-74542a64ceb1",
                    message: null,
                    exception: null,
                  },
                },
              },
            },
          },
        ];
        test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that", async () => {
          renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, [
            ...contributorAliasesMocks,
            ...singleNonParentMocks,
          ]);

          // before next button is disabled
          const nextButton = screen.getByRole("button", {name: /Next/i});
          expect(nextButton).toBeDisabled();

          // find all checkbox elements
          const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
          const checkboxElements = await findAllByRole("checkbox");

          // click first checkbox element
          fireEvent.click(checkboxElements[0]);

          // after next button is enabled
          expect(nextButton).toBeEnabled();

          // click on next button, will navigate to UpdateContributors Page.
          fireEvent.click(nextButton);

          // find Update Contributor button
          const updateContributorButton = await screen.findByRole("button", {name: /Update Contributor/i});

          expect(updateContributorButton).toBeDisabled();

          const contributorTextbox = await screen.findByRole("textbox");
          //update the textbox value
          fireEvent.change(contributorTextbox, {target: {value: "Aman Mavai New"}});

          expect(updateContributorButton).toBeEnabled();
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

      describe("unlink flow", () => {
        const mutationReq = {
          query: UPDATE_CONTRIBUTOR,
          variables: {
            contributorKey: "4d7bb925-d8f3-419e-87ab-6fd087f6734e",
            updatedInfo: {
              contributorName: "Krishna Kumar",
              unlinkContributorAliasKeys: ["4ba4f636-b290-4602-be18-47187b9b6b5a"],
            },
          },
        };

        const unlinkMocks = [
          {
            request: mutationReq,
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
        test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that", async () => {
          renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, [
            ...contributorAliasesMocks,
            ...unlinkMocks,
          ]);

          // before next button is disabled
          const nextButton = screen.getByRole("button", {name: /Next/i});
          expect(nextButton).toBeDisabled();

          // find all checkbox elements
          const {findAllByRole} = within(screen.getByTestId("select-contributors-table"));
          const checkboxElements = await findAllByRole("checkbox");
          const parentRecordCheckbox = checkboxElements[1];

          // click parent record checkbox
          fireEvent.click(parentRecordCheckbox);

          // after next button is enabled
          expect(nextButton).toBeEnabled();

          // click on next button, will navigate to Select Merge Target Page.
          fireEvent.click(nextButton);

          // find all toggle elements
          const {findAllByRole: findAllByRoleMergeTarget} = within(screen.getByTestId("select-merge-target-table"));
          const toggleElements = await findAllByRoleMergeTarget("switch");

          expect(toggleElements).toHaveLength(3);
          // before all are checked to be true
          toggleElements.forEach((toggleElement) => expect(toggleElement.getAttribute("aria-checked")).toBe("true"));

          const [first] = toggleElements;
          fireEvent.click(first);
          await screen.findByText(/1 contributor will be unlinked from Krishna Kumar/i);

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

      describe("regular update contributor flow", () => {
        test("when UpdateContributor button is clicked, it remains disabled till the time mutation is executing, shows success message after that", async () => {
          renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, mocks);

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
