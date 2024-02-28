/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import {useQuery, gql} from "@apollo/client";

import {analytics_service} from "../../../services/graphql";
import React, {useEffect, useImperativeHandle, useRef} from "react";

import {graphqlConnectionToCyElements} from "../../../framework/viz/networks/graphql-cytoscape";
import Cytoscape from "../../../framework/viz/networks/cytoscape-react";

export const GET_ORGANIZATION_PROJECTS_NETWORK_QUERY = gql`
    query organizationProjectsNetwork(
        $organizationKey: String!
    ) {
        organization(key: $organizationKey) {
            id
            name
            key
            projects(
                interfaces: [CommitSummary, RepositoryCount, ContributorCount]
                contributorCountDays: 30
            ) {
                count
                edges {
                    node {
                        id
                        name
                        key
                        archived
                        contributorCount
                        repositoryCount
                        latestCommit
                        latestWorkItemEvent
                        workItemsSources {
                            count
                            edges {
                                node {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export function useQueryOrganizationProjects({
                                               organizationKey,
                                             }) {
  return useQuery(GET_ORGANIZATION_PROJECTS_NETWORK_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });
}

function OrganizationProjectsNetwork({
   organizationKey,
   cytoscapeOptions,
   testId,
 }, ref) {

  const cyRef = React.useRef();

  useImperativeHandle(ref, () => ({
    cy: () => cyRef.current?.cy()
  }));

  const {loading, error, data} = useQuery(GET_ORGANIZATION_PROJECTS_NETWORK_QUERY, {
    variables: {organizationKey}
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  const elements = graphqlConnectionToCyElements(data, "organization", "projects");

  return (
    <Cytoscape ref={cyRef} testId={testId} elements={elements} {...cytoscapeOptions} />
  );
};

export default React.forwardRef(OrganizationProjectsNetwork);