import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const PROJECT_PIPELINE_SUMMARY_QUERY = gql`
  query projectPipelineSummary(
    $key: String!
    $defectsOnly: Boolean
    $closedWithinDays: Int
    $specsOnly: Boolean
    $referenceString: String
  ) {
    project(
      key: $key
      interfaces: [WorkItemStateTypeAggregateMetrics]
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

export function useQueryProjectPipelineSummary({instanceKey, referenceString, defectsOnly, specsOnly, closedWithinDays}) {
  return useQuery(PROJECT_PIPELINE_SUMMARY_QUERY, {
      service: analytics_service,
      variables: {
        key: instanceKey,
        referenceString: referenceString,
        defectsOnly: defectsOnly,
        closedWithinDays: closedWithinDays,
        specsOnly: specsOnly
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}