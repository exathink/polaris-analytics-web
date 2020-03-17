import gql from "graphql-tag";

export const PROJECT_WORK_ITEM_SUMMARIES = gql`
           query projectWorkItemSummaries($key: String!) {
            project(key: $key, interfaces: [WorkItemStateTypeCounts]) {
                id
                ... on WorkItemStateTypeCounts {
                  workItemStateTypeCounts {
                    backlog
                    open
                    wip
                    complete
                    closed
                }
               }
                
            }
           }
      `