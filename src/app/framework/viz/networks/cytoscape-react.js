/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React, { useEffect, useRef } from "react";
import cytoscape from 'cytoscape';

const Cytoscape = React.forwardRef(
  ({ elements, layout, containerStyle }, ref) => {
    const containerRef = useRef();

    useEffect(() => {
      let cy = cytoscape({
        elements
      });

      if (ref != null) {
        ref.current = cy;
      }

      return () => cy.destroy();
    }, []);

    return <div ref={containerRef} style={containerStyle}/>;
  });

export default Cytoscape;