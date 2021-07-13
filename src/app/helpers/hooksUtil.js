import React from "react";

export function useOnlyRunOnUpdate(cb, deps) {
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Your useEffect code here to be run on update
      cb();
    }
  }, deps);
}

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