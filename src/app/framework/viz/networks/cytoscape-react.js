/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React, { useEffect, useRef } from "react";
import cytoscape from 'cytoscape';

const Cytoscape = React.forwardRef(
  ({ elements, layout, style }, ref) => {
    const containerRef = useRef();

    useEffect(() => {
      let cy = cytoscape();

      if (ref != null) {
        ref.current = cy;
      }

      return () => cy.destroy();
    }, []);

    return <div ref={containerRef} />;
  });

export default Cytoscape;