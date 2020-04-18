import {useState, useEffect} from 'react';
import {analytics_service} from "../../../../services/graphql";
import gql from "graphql-tag";

import {fetchQueryEffect} from "../../../../components/graphql/utils";

export function useFetchProjectWorkItemSourcesStateMappings(projectKey) {
  const [workItemStateMappings, setStateMappings] = useState(null);

  useEffect(fetchQueryEffect({
      service: analytics_service,
      query: gql`
            query getProjectWorkItemSourceStateMappings($projectKey: String!) {
              project(key: $projectKey) {
                id
                workItemsSources(interfaces: [WorkItemStateMappings]) {
                  edges {
                    node {
                      id
                      workItemStateMappings {
                        state
                        stateType
                      }
                    }
                  }
                }
              }
            }`,
      variables: {
        projectKey: projectKey
      },
      onSuccess: (result) => (
        setStateMappings(result.data.project.workItemsSources.edges.map(
          edge => edge.node.workItemStateMappings
        ))
      ),
      onError: (error) => {
        console.log(error)
      }
    },
  ), [projectKey])

  return workItemStateMappings;
}