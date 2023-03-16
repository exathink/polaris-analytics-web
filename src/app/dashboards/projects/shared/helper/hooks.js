import React from "react";
import { useLocation } from "react-router";

export function useResetComponentState() {
  const [resetComponentStateKey, setKey] = React.useState(1);

  function resetComponentState() {
    const newKey = resetComponentStateKey === 1 ? 2 : 1;
    setKey(newKey);
  }

  return [resetComponentStateKey, resetComponentState];
}

export function useUpdateQuery(dimension, list_prop) {
  return React.useCallback(
    (prevResult, {fetchMoreResult}) => {
      const mergedEdges = [...prevResult[dimension][list_prop].edges, ...fetchMoreResult[dimension][list_prop].edges];
      const merged = {
        [dimension]: {
          ...fetchMoreResult[dimension],
          [list_prop]: {
            ...fetchMoreResult[dimension][list_prop],
            edges: mergedEdges,
          },
        },
      };
      return merged;
    },
    [dimension, list_prop]
  );
}

// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQueryParamState() {
  const { search, state={} } = useLocation();

  const queryParams = React.useMemo(() => new URLSearchParams(search), [search]);
  return {queryParams, state};
}