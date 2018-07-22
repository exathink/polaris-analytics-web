import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import  {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";
import {ActivityLevelDetailModel} from "../../../widgets/activity/ActivityLevel";
import {ActivityLevelSummaryView} from "../../../widgets/activity/ActivityLevel/activityLevelSummaryView";
import {ActivityLevelDetailView} from "../../../widgets/activity/ActivityLevel/activityLevelDetailView";


export const AccountProjectsActivityWidget = (props) => (
  <Query
    client={analytics_service}
    query={
      gql`
       {
        account {
            id
            projects {
                commitSummaries {
                    name
                    key
                    ... CommitSummary
                }

            }
        }
       }
       ${CommitSummaryPanel.interface}
    `}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
                  data.account.projects.commitSummaries,
                  props
                );
        return (
          props.view && props.view === 'detail'?
            <ActivityLevelDetailView
              model={model}
              {...props}
            /> :
            <ActivityLevelSummaryView
              model={model}
              {...props}
            />
        )
      }
    }
  </Query>
);