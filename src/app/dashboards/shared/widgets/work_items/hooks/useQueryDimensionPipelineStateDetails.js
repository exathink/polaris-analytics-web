import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const dimensionPipelineStateDetailsQuery = (dimension) => gql`
  query ${dimension}PipelineStateDetails(
    $key: String!
    $tags: [String]
    $release: String
    $specsOnly: Boolean
    $referenceString: String
    $closedWithinDays: Int
    $activeOnly: Boolean
    $funnelView: Boolean
    $includeSubTasks: Boolean
    $includeSubTasksInClosedState: Boolean
    $includeSubTasksInNonClosedState: Boolean
  ) {
    ${dimension}(key: $key, referenceString: $referenceString) {
      id
      workItems(
        activeOnly: $activeOnly
        tags: $tags
        release: $release
        closedWithinDays: $closedWithinDays
        interfaces: [WorkItemStateDetails, WorkItemsSourceRef, TeamNodeRefs, EpicNodeRef]
        specsOnly: $specsOnly
        includeSubTasks: $includeSubTasks
        funnelView: $funnelView
        funnelViewArgs: {
          includeSubTasksInClosedState: $includeSubTasksInClosedState
          includeSubTasksInNonClosedState: $includeSubTasksInNonClosedState
        }
        referenceString: $referenceString
      ) {
        edges {
          node {
            name
            key
            displayId
            workItemType
            epicName
            state
            stateType
            workItemsSourceKey
            workItemsSourceName
            workTrackingIntegrationType
            url
            tags
            storyPoints
            releases
            priority
            teamNodeRefs {
              teamName
              teamKey
            }
            workItemStateDetails {
              currentStateTransition {
                eventDate
              }
              currentDeliveryCycleDurations {
                state
                stateType
                flowType
                daysInState
              }
              earliestCommit
              latestCommit
              commitCount
              effort
              endDate
              leadTime
              cycleTime
              duration
              latency
            }
          }
        }
      }
    }
  }
`;

export function useQueryDimensionPipelineStateDetails({
  dimension,
  instanceKey,
  tags,
  release,
  specsOnly,
  referenceString,
  closedWithinDays,
  activeOnly,
  funnelView,
  includeSubTasks,
}) {
  // oddity here is to support the same api signature while allowing either
  // a boolean value for includeSubtasks or a pair for the funnelView.
  // Not ideal, but lets us keep the rest of the api relatively clean, so taking the
  // hit here on this line.
  const {includeSubTasksInNonClosedState, includeSubTasksInClosedState} =
      funnelView ? includeSubTasks : {};

    return useQuery(dimensionPipelineStateDetailsQuery(dimension), {
      service: analytics_service,
      variables: {
        key: instanceKey,
        tags: tags,
        release: release,
        specsOnly: specsOnly,
        referenceString: referenceString,
        closedWithinDays: closedWithinDays,
        activeOnly: activeOnly,
        funnelView: funnelView,
        includeSubTasks: includeSubTasks,
        includeSubTasksInClosedState: includeSubTasksInClosedState,
        includeSubTasksInNonClosedState: includeSubTasksInNonClosedState,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    });
}
