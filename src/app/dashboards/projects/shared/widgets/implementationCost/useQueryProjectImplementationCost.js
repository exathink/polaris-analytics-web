import {useQuery, gql, useMutation} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectImplementationCost({instanceKey, activeOnly, specsOnly, days, includeSubTasks, referenceString}) {
  return useQuery(
    gql`
        query getProjectImplementationCost(
            $projectKey: String!, 
            $activeOnly: Boolean,
            $specsOnly: Boolean,
            $days: Int,
            $includeSubTasks: Boolean,
            $referenceString: String) {
            project(key: $projectKey, referenceString: $referenceString) {
                id
                workItemDeliveryCycles(
                    interfaces: [ImplementationCost, EpicNodeRef],
                    activeOnly: $activeOnly, 
                    specsOnly: $specsOnly,
                    closedWithinDays: $days,
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
query getProjectImplementationCost($projectKey: String!, $days: Int, $includeSubTasks: Boolean, $referenceString: String) {
  project(key: $projectKey, referenceString: $referenceString) {
    id
    workItems(
      interfaces: [ImplementationCost, EpicNodeRef, DevelopmentProgress]
      includeEpics: true
      activeWithinDays: $days
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

export function useQueryImplementationCostTable({instanceKey, days, includeSubTasks, referenceString}) {
  return useQuery(
    GET_PROJECT_IMPLEMENTATION_COST_TABLE,
    {
      service: analytics_service,
      variables: {
        projectKey: instanceKey,
        days: days,
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
