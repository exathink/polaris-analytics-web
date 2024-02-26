/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

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
function Cytoscape({ elements, layout, headless, stylesheet, containerStyle, testId, ...rest }, ref) {
  const containerRef = useRef();


  /* When the config changes, re-initialize the cytoscape instance and set the ref */
  useEffect(() => {
    let cy = cytoscape({
      container: containerRef.current,
      style: stylesheet,
      headless,
      elements,
      layout,
      ...rest
    });

    if (ref != null) {
      const previous = ref.current;
      ref.current = cy;
      /* clean up the old instance */
      if (previous != null) {
        previous.destroy();
      }
    }

    return () => cy.destroy();
  }, [elements,layout]);

  return <div data-testid={testId} ref={containerRef} style={containerStyle} />;
};

export default React.forwardRef(Cytoscape);