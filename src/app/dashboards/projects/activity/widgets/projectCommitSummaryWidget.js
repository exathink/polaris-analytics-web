import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";


export const ProjectCommitSummaryWidget = ({projectKey}) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query projectCommitSummary($projectKey: String!) {
            project(projectKey: $projectKey ) {
                commitSummary {
                    forProject {
                        ... CommitSummary
                    }
                }
            }
           }
          ${CommitSummaryPanel.interface}
      `}
    variables={{projectKey}}
    errorPolicy={'all'}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        return (
          <CommitSummaryPanel
            commitSummary={data.project.commitSummary.forProject}
          />
        );

      }
    }
  </Query>
);



