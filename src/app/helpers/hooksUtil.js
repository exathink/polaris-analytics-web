import React from "react";



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