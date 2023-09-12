import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useProjectContext } from "../../projectDashboard";

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
  const location = useLocation();
  const history = useHistory();

  const queryParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  function setQueryParam({key, value}) {
    queryParams.set(key, value);
    history.replace({...location, search: queryParams.toString()});
  }

  function removeQueryParam(key) {
    queryParams.delete(key);
    history.replace({...location, search: queryParams.toString()});
  }

  return {queryParams, setQueryParam, removeQueryParam};
}