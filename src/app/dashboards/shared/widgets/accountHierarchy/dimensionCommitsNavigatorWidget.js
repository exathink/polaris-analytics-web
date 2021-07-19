import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React, {useState} from 'react';

import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from '../../../../services/graphql/index'
import {CommitsTimelineChartView} from "../../views/commitsTimeline";
import moment from 'moment';
import {toMoment, getReferenceString} from "../../../../helpers/utility";
import {navigateToContext} from "../../navigation/navigate";
import {CardInspectorWithDrawer, useCardInspector} from "../../../work_items/cardInspector/cardInspectorUtils";

export {HeaderMetrics} from "../../views/commitsTimeline";

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
    latestWorkItemEvent,
    nospecsOnly,
    excludeMerges,
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
    onCategoryItemSelected,
    pollInterval,
    referenceDate,

  }) => {
  const [daysRange, setDaysRange] = useState(days || 1);
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <Query
      client={analytics_service}
      query={
        gql`
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
        `
      }
      variables={{
        key: instanceKey,
        days: (days && daysRange) || null,
        before: before != null ? moment(before) : (latestCommit ? toMoment(latestCommit) : null),
        latest: latest,
        referenceDate: referenceDate,
        referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
        nospecsOnly: nospecsOnly
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
            <CommitsTimelineChartView
              commits={commits}
              context={context}
              instanceKey={instanceKey}
              view={view}
              groupBy={groupBy}
              groupings={groupings}
              smartGrouping={smartGrouping}
              days={days && daysRange}
              setDaysRange={setDaysRange}
              before={before}
              latestCommit={latestCommit}
              latest={latest}
              excludeMerges={excludeMerges}
              totalCommits={totalCommits}
              shortTooltip={shortTooltip}
              showHeader={showHeader}
              polling={pollInterval}
              markLatest={markLatest}
              showTable={showTable}
              onSelectionChange={onSelectionChange}
              onCategoryItemSelected={(category, name, key) => {
                if(category === "workItem"){
                  setWorkItemKey(key);
                  setShowPanel(true);
                  return;
                }
                navigateToContext(context, category, name, key)
              }}
            />
          ));
          return (
            <React.Fragment>
              {context.getCachedView(getViewCacheKey(instanceKey, display))}
              <CardInspectorWithDrawer
                workItemKey={workItemKey}
                showPanel={showPanel}
                setShowPanel={setShowPanel}
                context={context}
              />
            </React.Fragment>
          );
        }
      }
    </Query>
  )
};
