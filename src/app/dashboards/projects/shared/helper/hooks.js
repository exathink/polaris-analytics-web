import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";

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
  const {search, state={}} = location;
  const history = useHistory();

  const queryParams = React.useMemo(() => new URLSearchParams(search), [search]);

  function setQueryParam({key, value, stateSlice}) {
    queryParams.set(key, value);
    const newState = {...state, [key]: stateSlice}
    history.push({...location, search: queryParams.toString(), state: newState});
  }

  function removeQueryParam(key) {
    queryParams.delete(key);
    const {[key]: _discard, ...remainingState} = state;
    history.push({...location, search: queryParams.toString(), state: remainingState});
  }

  return {queryParams, state: location.state, setQueryParam, removeQueryParam};
}