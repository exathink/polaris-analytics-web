import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const PROJECT_PIPELINE_SUMMARY_QUERY = gql`
  query projectPipelineSummary(
    $key: String!
    $tags: [String]
    $defectsOnly: Boolean
    $closedWithinDays: Int
    $specsOnly: Boolean
    $referenceString: String
    $includeSubTasksInClosedState: Boolean
    $includeSubTasksInNonClosedState: Boolean  
  ) {
    project(
      key: $key
      tags: $tags
      interfaces: [FunnelViewAggregateMetrics]
      funnelViewArgs: {
          includeSubTasksInClosedState: $includeSubTasksInClosedState,
          includeSubTasksInNonClosedState: $includeSubTasksInNonClosedState
      }
      defectsOnly: $defectsOnly
      closedWithinDays: $closedWithinDays
      specsOnly: $specsOnly
      referenceString: $referenceString
    ) {
      workItemStateTypeCounts {
        backlog
        open
        wip
        complete
        closed
        unmapped
      }
      totalEffortByStateType {
        backlog
        open
        wip
        complete
        closed
        unmapped
      }
    }
  }
`;

export function useQueryProjectPipelineSummary({instanceKey, tags, referenceString, defectsOnly, specsOnly, closedWithinDays, includeSubTasks: {includeSubTasksInClosedState, includeSubTasksInNonClosedState}}) {
  return useQuery(PROJECT_PIPELINE_SUMMARY_QUERY, {
      service: analytics_service,
      variables: {
        key: instanceKey,
        tags: tags,
        referenceString: referenceString,
        defectsOnly: defectsOnly,
        closedWithinDays: closedWithinDays,
        includeSubTasksInClosedState: includeSubTasksInClosedState,
        includeSubTasksInNonClosedState: includeSubTasksInNonClosedState,
        specsOnly: specsOnly
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}