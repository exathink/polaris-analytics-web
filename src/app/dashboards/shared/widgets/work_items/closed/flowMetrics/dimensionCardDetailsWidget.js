import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {CardDetailsView} from "./dimensionCardDetailsView";

export function CardDetailsWidget({
  dimension,
  instanceKey,
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
  const {loading, error, data} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days: _days,
    defectsOnly,
    specsOnly,
    before,
    includeSubTasks,
    referenceString: latestWorkItemEvent,
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
    />
  );
}
