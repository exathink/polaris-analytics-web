import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_COMMITS_QUERY = (dimension) => gql`
query ${dimension}_commits(
$key: String!, 
$days: Int, 
$before: DateTime, 
$latest: Int, 
$referenceDate: DateTime, 
$referenceString: String,
$nospecsOnly: Boolean
) {
    ${dimension}(key: $key, referenceString: $referenceString){
        id
        commits(
            days: $days, 
            before: $before, 
            first: $latest, 
            interfaces:[WorkItemsSummaries, CommitTeamNodeRefs], 
            referenceDate: $referenceDate,
            nospecsOnly: $nospecsOnly
        ) {
            count
            edges {
                node {
                    id
                    name
                    key
                    author
                    authorDate
                    authorKey
                    committer
                    commitDate
                    commitMessage
                    branch
                    repository
                    repositoryKey
                    numParents
                    stats {
                        files
                        lines
                        insertions
                        deletions
                    }
                    workItemsSummaries {
                        workItemType
                        name
                        key
                        displayId
                        url
                        stateType
                        state
                    }
                    authorTeamKey
                    authorTeamName
                    committerTeamKey
                    committerTeamName

                }
            }
        }
    }
}
`;

export function useQueryDimensionCommits({dimension, instanceKey, days, before, latest, referenceDate, nospecsOnly, referenceString, pollInterval}) {
  return useQuery(GET_COMMITS_QUERY(dimension), {
    service: analytics_service,
    variables: {
        key: instanceKey,
        days: days,
        before: before,
        latest: latest,
        referenceDate: referenceDate,
        referenceString: referenceString,
        nospecsOnly: nospecsOnly
    },
    errorPolicy: "all",
    pollInterval: pollInterval
  });
}
