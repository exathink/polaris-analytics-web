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

export const GET_ORGANIZATION_PROJECTS_QUERY = gql`
    query organizationProjects(
        $organizationKey: String!
        $days: Int!
        $measurementWindow: Int!
        $samplingFrequency: Int!
        $specsOnly: Boolean!
        $includeSubTasks: Boolean!
    ) {
        organization(key: $organizationKey) {
            id
            name
            key
            projects(
                interfaces: [CommitSummary, RepositoryCount, WorkItemEventSpan, CycleMetricsTrends, ContributorCount, ArchivedStatus]
                cycleMetricsTrendsArgs: {
                    days:$days,
                    measurementWindow:$measurementWindow,
                    samplingFrequency:$samplingFrequency,
                    specsOnly: $specsOnly
                    includeSubTasks: $includeSubTasks
                    metrics: [avg_lead_time, avg_cycle_time, total_effort, work_items_with_commits]
                }
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
                        cycleMetricsTrends {
                            avgLeadTime
                            avgCycleTime
                            totalEffort
                            workItemsWithCommits
                        }
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
                                               days,
                                               measurementWindow,
                                               samplingFrequency,
                                               specsOnly,
                                               includeSubTasks
                                             }) {
  return useQuery(GET_ORGANIZATION_PROJECTS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      specsOnly: specsOnly,
      includeSubTasks: includeSubTasks
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });
}

function OrganizationProjectsNetwork({
   organizationKey,
   days,
   measurementWindow,
   samplingFrequency,
   specsOnly,
   includeSubTasks,
   cytoscapeOptions,
   testId,

 }, ref) {

  const cyRef = React.useRef();

  useImperativeHandle(ref, () => ({
    cy: () => cyRef.current?.cy()
  }));

  const {loading, error, data} = useQuery(GET_ORGANIZATION_PROJECTS_QUERY, {
    variables: {organizationKey, days, measurementWindow, samplingFrequency, specsOnly, includeSubTasks}
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  const elements = graphqlConnectionToCyElements(data, "organization", "projects");

  return (
    <Cytoscape ref={cyRef} testId={testId} elements={elements} {...cytoscapeOptions} />
  );
};

export default React.forwardRef(OrganizationProjectsNetwork);