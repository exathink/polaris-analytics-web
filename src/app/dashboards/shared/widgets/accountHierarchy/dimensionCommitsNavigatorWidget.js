import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'
import {CommitsTimelineChartView, CommitsTimelineTable} from "../../views/commitsTimeline";
import moment from 'moment';
import {toMoment} from "../../../../helpers/utility";


function getViewCacheKey(instanceKey, display) {
  return `DimensionCommitsNavigator:${instanceKey}:${display}`
}

export const DimensionCommitsNavigatorWidget = (
  {
      dimension,
      instanceKey,
      context,
      days,
      before,
      latestCommit,
      latest,
      view,
      groupBy,
      smartGrouping,
      display,
      shortTooltip,
      markLatest,
      showHeader,
      suppressHeaderDataLabels,
      showTable,
      onSelectionChange,
      pollInterval,
      referenceDate,

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_commits($key: String!, $days: Int, $before: DateTime, $latest: Int, $referenceDate: DateTime) {
                ${dimension}(key: $key, referenceDate: $referenceDate){
                    id
                    commits(days: $days, before: $before, first: $latest, referenceDate: $referenceDate) {
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
                                stats {
                                    files
                                    lines
                                    insertions
                                    deletions
                                }
                                workItemsSummaries {
                                    name
                                    key
                                    displayId
                                    url
                                }

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
        before: before != null ? moment(before) : (latestCommit ? toMoment(latestCommit) : null),
        latest: latest,
        referenceDate: referenceDate
      }}
      pollInterval={pollInterval || analytics_service.defaultPollInterval()}
    >
      {
        ({loading, error, data}) => {
          if (loading) return context.getCachedView(getViewCacheKey(instanceKey, display)) || <Loading/>;
          if (error) return null;

          const commits = data[dimension].commits.edges.map(edge => edge.node);
          const totalCommits = data[dimension].commits.count;
          context.cacheView(getViewCacheKey(instanceKey, display), (
            display === 'table' ?
                <CommitsTimelineTable commits={commits}/>
                :
                <CommitsTimelineChartView
                  commits={commits}
                  context={context}
                  instanceKey={instanceKey}
                  view={view}
                  groupBy={groupBy}
                  smartGrouping={smartGrouping}
                  days={days}
                  before={before}
                  latestCommit={latestCommit}
                  latest={latest}
                  totalCommits={totalCommits}
                  shortTooltip={shortTooltip}
                  showHeader={showHeader}
                  polling={pollInterval}
                  markLatest={markLatest}
                  showTable={showTable}
                  onSelectionChange={onSelectionChange}
                />
          ));
          return context.getCachedView(getViewCacheKey(instanceKey, display));
        }
      }
    </Query>
);


