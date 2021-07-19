import React, {useState} from "react";

import {Loading} from "../../../../components/graphql/loading";

import {analytics_service} from "../../../../services/graphql/index";
import {CommitsTimelineChartView} from "../../views/commitsTimeline";
import moment from "moment";
import {toMoment, getReferenceString} from "../../../../helpers/utility";
import {navigateToContext} from "../../navigation/navigate";
import {CardInspectorWithDrawer, useCardInspector} from "../../../work_items/cardInspector/cardInspectorUtils";
import {useQueryDimensionCommits} from "./useQueryDimensionCommits";

export {HeaderMetrics} from "../../views/commitsTimeline";

function getViewCacheKey(instanceKey, display) {
  return `DimensionCommitsNavigator:${instanceKey}:${display}`;
}

export const DimensionCommitsNavigatorWidget = ({
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
  const {loading, error, data} = useQueryDimensionCommits({
    dimension,
    instanceKey,
    days: (days && daysRange) || null,
    before: before != null ? moment(before) : latestCommit ? toMoment(latestCommit) : null,
    latest,
    referenceDate,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
    nospecsOnly,
    pollInterval: pollInterval || analytics_service.defaultPollInterval(),
  });
  
  const commits = React.useMemo(() => {
    const edges = data?.[dimension]?.commits?.edges ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  if (loading) return context.getCachedView(getViewCacheKey(instanceKey, display)) || <Loading />;
  if (error) return null;

  const totalCommits = data[dimension].commits.count;
  context.cacheView(
    getViewCacheKey(instanceKey, display),
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
        if (category === "workItem") {
          setWorkItemKey(key);
          setShowPanel(true);
          return;
        }
        navigateToContext(context, category, name, key);
      }}
    />
  );
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
};
