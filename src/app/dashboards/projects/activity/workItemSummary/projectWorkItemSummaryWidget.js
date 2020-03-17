import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";
import {WorkItemSummaryPanel} from "./workItemSummaryPanelView";

import {PROJECT_WORK_ITEM_SUMMARIES} from "../queries";

export const ProjectWorkItemSummaryWidget = (
  {
    instanceKey,
    pollInterval
  }) => (
  <Query
    client={analytics_service}
    query={PROJECT_WORK_ITEM_SUMMARIES}
    variables={{key: instanceKey}}
    errorPolicy={'all'}
    pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const {...workItemStateTypeCounts} = data['project']['workItemStateTypeCounts'];
            return(
                <WorkItemSummaryPanel
                  model={
                    {

                      ...workItemStateTypeCounts

                    }
                  }
                />
            )

      }
    }
  </Query>
);



