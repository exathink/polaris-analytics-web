import React from "react";
import {Loading} from "../../../components/graphql/loading";
import {useQueryWorkItemWithInstance} from "../activity/hooks/useQueryWorkItemWithInstance";
import {CardInspectorView} from "./cardInspectorView";

export function CardInspectorWidget({workItemKey, context}) {
  const {loading, error, data} = useQueryWorkItemWithInstance({workItemKey});
  if (loading) return <Loading />;
  if (error) return null;

  const workItem = data.workItem;

  return <CardInspectorView workItem={workItem} context={context} />;
}
