import React from "react";
import { TABLE_PAGINATION } from "../../../../../../../config/featureFlags";
import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {DEFAULT_PAGE_SIZE} from "../../../../../../components/tables/tableUtils";
import {useFeatureFlag} from "../../../../../../helpers/utility";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {CardDetailsView} from "./dimensionCardDetailsView";

export function CardDetailsWidget({
  dimension,
  instanceKey,
  tags,
  release,
  days,
  initialDays=days,
  specsOnly,
  defectsOnly,
  before,
  includeSubTasks,
  referenceString: latestWorkItemEvent,
  view,
  context,
  supportsFilterOnCard,
  workItemTypeFilter,
}) {
  let _days = before === undefined ? initialDays : days;
  const isFeatureFlagActive = useFeatureFlag(TABLE_PAGINATION, true);
  const {loading, error, data, fetchMore} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    tags,
    release,
    instanceKey,
    days: _days,
    defectsOnly,
    specsOnly,
    before,
    includeSubTasks,
    referenceString: latestWorkItemEvent,
    first: isFeatureFlagActive ? DEFAULT_PAGE_SIZE : null,
    after: null,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("CardDetailsWidget.useQueryProjectClosedDeliveryCycleDetail", error);
    return null;
  }

  return (
    <CardDetailsView
      data={data}
      dimension={dimension}
      view={view}
      specsOnly={specsOnly}
      context={context}
      supportsFilterOnCard={supportsFilterOnCard}
      workItemTypeFilter={workItemTypeFilter}
      fetchMore={fetchMore}
    />
  );
}
