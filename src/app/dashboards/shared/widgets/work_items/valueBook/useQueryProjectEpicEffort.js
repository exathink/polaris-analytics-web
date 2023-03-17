import {useQuery, gql, useMutation} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectEpicEffort({instanceKey, tags, activeOnly, specsOnly, days, includeSubTasks, referenceString}) {
  return useQuery(
    gql`
        query getProjectImplementationCost(
            $projectKey: String!, 
            $tags: [String],
            $activeOnly: Boolean,
            $specsOnly: Boolean,
            $days: Int,
            $includeSubTasks: Boolean,
            $referenceString: String) {
            project(key: $projectKey, referenceString: $referenceString) {
                id
                workItems(
                    interfaces: [ImplementationCost, EpicNodeRef],
                    activeOnly: $activeOnly, 
                    tags: $tags,
                    specsOnly: $specsOnly,
                    activeWithinDays: $days,
                    includeSubTasks: $includeSubTasks
                ) {
                    edges {
                        node {
                            name
                            key
                            workItemKey
                            workItemType
                            displayId
                            epicName
                            epicKey
                            effort
                        }
                    }
                }
            }
          }
    `,
    {
      service: analytics_service,
      variables: {
        projectKey: instanceKey,
        tags,
        activeOnly: activeOnly,
        specsOnly: specsOnly,
        days: days,
        includeSubTasks: includeSubTasks,
        referenceString: referenceString,
      },
      errorPolicy: "all",
    }
  );
}

export const GET_PROJECT_IMPLEMENTATION_COST_TABLE = gql`
query getProjectImplementationCostTable($projectKey: String!,$tags: [String] , $closedWithinDays: Int, $includeSubTasks: Boolean, $referenceString: String, $specsOnly: Boolean, $activeOnly: Boolean) {
  project(key: $projectKey, referenceString: $referenceString) {
    id
    workItems(
      interfaces: [ImplementationCost, EpicNodeRef, DevelopmentProgress]
      tags: $tags,
      includeEpics: true
      specsOnly: $specsOnly
      activeOnly: $activeOnly
      activeWithinDays: $closedWithinDays
      includeSubTasks: $includeSubTasks
    ) {
      edges {
        node {
          id
          displayId
          name
          key
          workItemType
          epicName
          epicKey
          effort
          duration
          authorCount
          budget
          startDate
          endDate
          closed
          lastUpdate
          elapsed
        }
      }
    }
  }
}
`;

export function useQueryImplementationCostTable({instanceKey, tags, closedWithinDays, specsOnly, activeOnly, includeSubTasks, referenceString}) {
  return useQuery(
    GET_PROJECT_IMPLEMENTATION_COST_TABLE,
    {
      service: analytics_service,
      variables: {
        projectKey: instanceKey,
        tags: tags,
        closedWithinDays: closedWithinDays,
        activeOnly: activeOnly,
        specsOnly: specsOnly,
        includeSubTasks: includeSubTasks,
        referenceString: referenceString,
      },
      errorPolicy: "all",
    }
  );
}

//  [{workItemKey: $workItemKey, budget: $budget}]
export const UPDATE_PROJECT_WORKITEMS = gql`
  mutation updateProjectWorkItems($projectKey: String!, $workItemsInfo: [WorkItemsInfo]!) {
    updateProjectWorkItems(updateProjectWorkItemsInput: {projectKey: $projectKey, workItemsInfo: $workItemsInfo}) {
      updateStatus {
        workItemsKeys
        success
        message
        exception
      }
    }
  }
`;
export function useUpdateProjectWorkItems({onCompleted, onError}) {
  return useMutation(UPDATE_PROJECT_WORKITEMS, {onCompleted, onError});
}
