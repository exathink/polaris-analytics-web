import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../../hooks/useQueryProjectPipelineStateDetails";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {CycleTimeLatencyTableView} from "./cycleTimeLatencyTableView";

export const CycleTimeLatencyTableWidget = ({
  instanceKey,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  includeSubTasks,
  callBacks,
  appliedFilters
}) => {
  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("ProjectPipelineStateDetailsWidget.pipelineStateDetails", error);
    return null;
  }

  return (
    <CycleTimeLatencyTableView data={data} callBacks={callBacks} appliedFilters={appliedFilters}/>
  );
};
