import React from "react";
import {renderWithProviders, gqlUtils} from "../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_CONTRIBUTOR} from "./useUpdateContributor";
import {GET_CONTRIBUTOR_ALIASES_INFO_QUERY} from "./useQueryContributorAliasesInfo";
import {getNDaysAgo} from "../../../../test/test-utils";
import {ManageContributorsWorkflow} from "./manageContributorsWorkflow";

beforeAll(() => {
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
  describe("when there is no data for contributors", () => {});

  describe("when there are errors", () => {});

  describe("when there is data for contributors", () => {
    test("should render title for table", () => {
      renderWithProviders(<ManageContributorsWorkflow {...propsFixture} />, contributorAliasesMocks);
      screen.getByText(/Select one or more contributors to merge into a single contributor/i);
    });
  });
});
