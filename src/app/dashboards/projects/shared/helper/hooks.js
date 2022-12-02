import React from "react";
import {useIntl} from "react-intl";
import {getWorkItemDurations} from "../../../shared/widgets/work_items/clientSideFlowMetrics";
import {getPercentage} from "./utils";

export function useResetComponentState() {
  const [resetComponentStateKey, setKey] = React.useState(1);

  function resetComponentState() {
    const newKey = resetComponentStateKey === 1 ? 2 : 1;
    setKey(newKey);
  }

  return [resetComponentStateKey, resetComponentState];
}

export function useFlowEfficiency(workItems) {
  const intl = useIntl();
  const workItemsWithAggregateDurations = React.useMemo(() => getWorkItemDurations(workItems), [workItems]);
  const totalTimeInWaitStates = workItemsWithAggregateDurations.reduce((acc, item) => {
    acc += item.timeInWaitState;
    return acc;
  }, 0);
  const totalTimeInActiveStates = workItemsWithAggregateDurations.reduce((acc, item) => {
    acc += item.timeInActiveState;
    return acc;
  }, 0);
  const fractionVal =
    totalTimeInWaitStates + totalTimeInActiveStates !== 0
      ? totalTimeInActiveStates / (totalTimeInWaitStates + totalTimeInActiveStates)
      : 0;

  return {totalTimeInWaitStates, totalTimeInActiveStates, flowEfficiencyPercentage: getPercentage(fractionVal, intl)};
}

export function useUpdateQuery(dimension, items_name) {
  return React.useCallback(
    (prevResult, {fetchMoreResult}) => {
      const mergedEdges = [...prevResult[dimension][items_name].edges, ...fetchMoreResult[dimension][items_name].edges];
      const merged = {
        [dimension]: {
          ...fetchMoreResult[dimension],
          [items_name]: {
            ...fetchMoreResult[dimension][items_name],
            edges: mergedEdges,
          },
        },
      };
      return merged;
    },
    [dimension, items_name]
  );
}
