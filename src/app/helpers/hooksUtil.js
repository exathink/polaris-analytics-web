import React from "react";
import { useQueryParamState } from "../dashboards/projects/shared/helper/hooks";
import { getReferenceString } from "./utility";
import { useQueryDimensionWorkItemDetails } from "../dashboards/shared/widgets/work_items/hooks/useQueryDimensionWorkItemDetails";


// A utility to set a child component take a parent hook state and override it locally
// if it is not provided. We use this for example in overriding specs/All control state in
// a child widget while allowing it to be overridden by parent control.
// See: dashboard/widgets/work_items/valueStreamPhaseDetail/dimensionValueStreamPhaseDetailWidget.js
// for a sample use in this manner

export function useChildState(parentState, parentSetState, defaultValue) {
  const [childState, childSetState] = React.useState(parentState || defaultValue);
  const effectiveState = parentState || childState;
  const effectiveSetState = parentSetState || childSetState;
  return [effectiveState, effectiveSetState];
}

// A utility to set a local selected value and
export function useSelectWithDelegate(initialSelection, onSelectionChanged) {
  const [selectedValue, setSelectedValue] = React.useState(initialSelection);
  const setSelection = (value) => {
    setSelectedValue(value);
    onSelectionChanged(value);
  };
  // Note we are passing the local selected value and the wrapped delegate to
  // the caller. This ensures the delegate is called whenever the selection changes.
  return [selectedValue, setSelection];
}

/**
 * 
 * @param {string} key 
 * @param {string} initialValue 
 */
export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    const item = window.localStorage.getItem(key);
    let result;
    try {
      result = item ? JSON.parse(item) : initialValue;
    } catch (error) {
      window.localStorage.clear();
      result = initialValue;
      console.warn(`Error getting localStorage key “${key}”:`, error);
    }

    return result;
  };

  const [storedValue, setStoredValue] = React.useState(readValue);

  const setValue = (value) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}

export function readLocalStorage(key, initialValue) {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : initialValue;
}

export function useWipData({wipDataAll, specsOnly, dimension}) {
  const wipItems = React.useMemo(() => {
    const edges = wipDataAll?.[dimension]?.["workItems"]?.["edges"] ?? [];
    const nodes = edges.map((edge) => edge.node);
    const wipSpecsWorkItems = nodes.filter((node) => node.workItemStateDetails.latestCommit != null);
    const wipWorkItems = specsOnly ? wipSpecsWorkItems : nodes;
    return {wipWorkItems, wipSpecsWorkItems};
  }, [wipDataAll, dimension, specsOnly]);

  return wipItems;
}
/**
 * 
 * Keep the wip query in single place, so that its logic remains consistent
 */
export function useWipQuery({dimensionSettings}) {
  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors ?? [];
  const release = state?.release?.releaseValue;

  const queryVars = {
    dimension: dimensionSettings.dimension,
    instanceKey: dimensionSettings.key,
    tags: workItemSelectors,
    release,
    specsOnly: false,
    activeOnly: true,
    referenceString: getReferenceString(dimensionSettings.latestWorkItemEvent, dimensionSettings.latestCommit),
    includeSubTasks: dimensionSettings.settingsWithDefaults.includeSubTasksWipInspector,
  };

  return useQueryDimensionWorkItemDetails(queryVars);
}
