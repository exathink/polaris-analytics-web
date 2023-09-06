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

