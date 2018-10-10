import React from 'react';
import {analytics_service} from "../../services/graphql";
import gql from "graphql-tag";
import {Loading} from "../../components/graphql/loading";
import {Query} from "react-apollo";


export const WithCommit = ({commitKey, render}) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query commit_detail($key: String!) {
                commit(key: $key){
                    id
                    name
                    commitHash
                    repository
                    repositoryKey
                    repositoryUrl
                    author
                    authorDate
                    authorKey
                    committer
                    committerKey
                    commitDate
                    commitMessage
                    branch
                    stats {
                        files
                        lines
                        insertions
                        deletions
                    }
                    fileTypesSummary {
                        fileType
                        count
                    }
                }
            }
        `
      }
      variables={{
        key: commitKey,
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const commit = data.commit;
          return React.createElement(render, {commit})
        }
      }
    </Query>
);




