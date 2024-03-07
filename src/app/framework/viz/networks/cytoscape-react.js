/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React, {useEffect, useImperativeHandle, useRef} from "react";
import {cytoscape, headlessModePatch, initSelectionDetailView, attachTooltips, initPopper} from "./cytoscape";


/**
 * Initializes a Cytoscape instance and renders it in a container element.
 *
 * @param {Object} config - The configuration options for Cytoscape.
 * @param {Array} config.elements - An array of node and edge elements to render.
 * @param {Object} config.layout - The layout options for the graph.
 * @param {Object} config.containerStyle - The CSS styles for the container element.
 * @param (Object) config.stylesheet - the stylesheet that is passed to the cytoscape object via the "style" option.
 * @param {Object} ref - The reference to the Cytoscape instance, if provided.
 *
 * @return {React.ReactElement} - The React element representing the Cytoscape graph.
 */
function Cytoscape(
  {
    elements,
    layout,
    headless,
    stylesheet,
    containerStyle,
    testId,
    tooltip={enable: false, tooltip: () => ``},
    selectionDetailView = {
      enable: false,
      component: (
        {
          graphElement, // The component that was clicked
          tippyInstance // The tippy instance that holds the component
        }) => null, transient: false},
    ...rest
  }, ref) {
  const containerRef = useRef();
  const cyRef = useRef();

  function initCytoscape() {
    let cy = cytoscape({
      container: containerRef.current,
      style: stylesheet,
      headless,
      elements,
      layout: headlessModePatch(headless, layout),
      ...rest
    });
    const previous = cyRef.current;
    cyRef.current = cy;
    if (previous != null) {
      previous.destroy();
    }
    // set up popper
    initPopper(cy, 'node');
    return cy;
  }

  useImperativeHandle(ref, () => {
    return {
      cy() {
        return cyRef.current;
      }
    };
  });


  /* When the config changes, re-initialize the cytoscape instance and set the ref */
  useEffect(() => {
    const cy = initCytoscape();
    if (tooltip?.enable) {
      attachTooltips(cy, "node", tooltip);
    }

    if (selectionDetailView?.enable) {
      initSelectionDetailView(cy, "node", selectionDetailView);
    }

    return () => {
      if (cyRef.current != null) {
        cyRef.current.destroy();
      }
    };
  }, [elements, layout]);


  return <div data-testid={testId} ref={containerRef} style={containerStyle} className="tw-w-full tw-h-full" />;
};

export default React.forwardRef(Cytoscape);