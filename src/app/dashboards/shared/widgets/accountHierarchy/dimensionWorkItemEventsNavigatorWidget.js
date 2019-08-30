import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {getLatest} from "../../../../helpers/utility";
import {analytics_service} from '../../../../services/graphql/index'
import {WorkItemEventsTimelineChartView} from "../../views/workItemEventsTimeline";
import moment from 'moment';


function getReferenceString(latestWorkItemEvent, latestCommit) {
  const eventValue = latestWorkItemEvent ? moment(latestWorkItemEvent).valueOf() : 0;
  const commitValue = latestCommit ? moment(latestCommit).valueOf() : 0;
  return `${commitValue + eventValue}`
}


function getViewCacheKey(instanceKey, display) {
  return `DimensionWorkItemEventsNavigator:${instanceKey}:${display}`
}

export const DimensionWorkItemEventsNavigatorWidget = (
  {
      dimension,
      instanceKey,
      context,
      days,
      before,
      latestWorkItemEvent,
      latestCommit,
      latest,
      view,
      groupBy,
      groupings,
      smartGrouping,
      display,
      shortTooltip,
      markLatest,
      showHeader,
      suppressHeaderDataLabels,
      showTable,
      onSelectionChange,
      pollInterval,
      commitsReferenceDate,

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_workItemEvents($key: String!, $days: Int, $before: DateTime, $referenceString: String, $latest: Int) {
                ${dimension}(key: $key, referenceString: $referenceString){
                    id
                    workItemEvents(days: $days, before: $before, first: $latest) {
                        count
                        edges {
                            node {
                                id
                                workItemsSourceName
                                workItemType
                                name
                                key
                                displayId
                                state
                                eventDate
                                previousState
                                newState
                            }
                        }
                    }
                    workItemCommits(days: $days, before: $before, first: $latest) {
                       count
                       edges {
                        node {
                            workItemName
                            workItemKey
                            workItemsSourceName
                            workItemType
                            name
                            key
                            displayId
                            commitHash
                            commitMessage
                            committer
                            commitDate
                            author
                            authorDate
                            branch
                            repository
                        }
                       }
                    }
                }
            }
        `
      }
      variables={{
        key: instanceKey,
        days: days || 0,
        before: before || getLatest(latestWorkItemEvent, latestCommit),
        referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
        latest: latest
      }}
      pollInterval={pollInterval || analytics_service.defaultPollInterval()}
    >
      {
        ({loading, error, data}) => {
          if (loading) return context.getCachedView(getViewCacheKey(instanceKey, display)) || <Loading/>;
          if (error) return null;

          const workItemEvents = data[dimension].workItemEvents.edges.map(edge => edge.node);
          const workItemCommits = data[dimension].workItemCommits.edges.map(edge => edge.node);
          const totalEvents = data[dimension].workItemEvents.count;
          context.cacheView(getViewCacheKey(instanceKey, display), (
                <WorkItemEventsTimelineChartView
                  workItemEvents={workItemEvents}
                  workItemCommits={workItemCommits}
                  context={context}
                  instanceKey={instanceKey}
                  view={view}
                  groupBy={groupBy}
                  groupings={groupings}
                  smartGrouping={smartGrouping}
                  days={days}
                  before={before}
                  latest={latest}
                  latestEvent={getLatest(latestWorkItemEvent, latestCommit)}
                  totalEvents={totalEvents}
                  shortTooltip={shortTooltip}
                  showHeader={showHeader}
                  polling={pollInterval}
                  markLatest={markLatest}
                  onSelectionChange={onSelectionChange}
                />
          ));
          return context.getCachedView(getViewCacheKey(instanceKey, display));
        }
      }
    </Query>
);
