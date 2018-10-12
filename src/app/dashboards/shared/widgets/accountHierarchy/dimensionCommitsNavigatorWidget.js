import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'
import {CommitsTimelineChartView, CommitsTimelineTable} from "../../views/commitsTimeline";
import moment from 'moment';


export const DimensionCommitsNavigatorWidget = (
  {
    dimension,
    instanceKey,
    context,
    days,
    before,
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
  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_commits($key: String!, $days: Int, $before: DateTime) {
                ${dimension}(key: $key){
                    id
                    commits(days: $days, before: $before) {
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
        before: before != null ? moment(before) : before
      }}
      pollInterval={pollInterval || analytics_service.defaultPollInterval()}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;

          const commits = data[dimension].commits.edges.map(edge => edge.node);
          return (
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
                  shortTooltip={shortTooltip}
                  showHeader={showHeader}
                  polling={pollInterval}
                  markLatest={markLatest}
                  showTable={showTable}
                  onSelectionChange={onSelectionChange}
                />
          )
        }
      }
    </Query>
);


