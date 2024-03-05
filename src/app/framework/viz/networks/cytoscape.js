/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

// Cytoscape
import cytoscape_ from "cytoscape";
import popper from "cytoscape-popper";
// Tippy
import tippy_ from "tippy.js";
import "tippy.js/themes/light.css";
import {getScratch, SCRATCH, setScratch} from "./scratch";
import ReactDOM from "react-dom";

import React from "react";

export const cytoscape = cytoscape_;
export const tippy = tippy_;

// Register cytoscape plugins
cytoscape.use(popper);

//
export function headlessModePatch(headless, layout) {
  /* when running in headless mode, layouts need an explicit bounding box provided*/
  if (headless) {
    return ({
      boundingBox: {
        x1: 0,
        y1: 0,
        w: 10,
        h: 10
      },
      ...layout
    });
  }
  return layout;
}

const attachPopper = element => {
  element.popper({
    content: () => {
      let div = document.createElement("div");
      div.innerHTML = ``;
      document.body.appendChild(div);
      return div;
    },
    popper: {}
  });
};

export function initPopper(cy, selector) {
  cy.elements(selector).forEach(
    attachPopper
  );
}


/**
 * Initializes default tooltips for the given cytoscape collection.
 * Expects that initPopper has been called first.
 * @param {cytoscape.Core} cy - The cytoscape instance to attach tooltips to.
 * @param {string} events - The events to bind the tooltips to.
 * @param {string} selector - The optional selector to filter elements that tooltips should be attached to.
 */
export function attachTooltips(cy, selector = false, tooltip) {
  cy.on("mouseover", selector, function(event) {
      const element = event.target;
      if (element.popperRef == null) {
        attachPopper(element);
      }

      const instance = tippy(document.createElement("div"), {
        getReferenceClientRect: () => element.popperRef().getBoundingClientRect(),
        content: () => {
          const div = document.createElement("div");
          div.innerHTML = tooltip?.tooltip(element) || ``;
          return div;
        },
        theme: "light",
        arrow: true,
        trigger: "click"
      });

      instance.show();

      element.on("mouseout", function(event) {
        instance.destroy();
      });
    }
  );

}

export function initSelectionDetailView(cy, selector = null, selectionDetailView) {
  function createContextMenuContainer(element, contentContainer) {
    if (element.popperRef == null) {
      attachPopper(element);
    }
    const ViewComponent = selectionDetailView?.component;

    return tippy(document.createElement("div"), {
      getReferenceClientRect: element.popperRef().getBoundingClientRect,
      content: (instance) => {
        ReactDOM.render(
          <div style={{
            zIndex: 10, // need to make sure this sits on top of the cytoscape canvas and grabs events first.
            pointerEvents: "all" // workaround setting tippy.interactive: true causes some odd failures, but we force it in the CSS instead,
          }}>
            <ViewComponent />
          </div>,
          contentContainer
        );
        return contentContainer;
      },
      onCreate: (instance) => {
        instance?.popper?.setAttribute("data-testid", "tippy-container");
      },
      onDestroy(instance) {
        ReactDOM.unmountComponentAtNode(contentContainer);
      },
      hideOnClick: false,
      // explicitly setting to false here because there are odd errors when it is set to
      // true. We are compensating for this by setting the css properties of the div in which the react DOM
      // is mounted
      interactive: false,

      trigger: "manual"
    });
  }


  cy.on("tapselect", selector, function(event) {
      //tapselect is emitted only in a deselected state, ie a second tapselect does not
      // trigger anything
      let element = event.target;
      let instance = getScratch(element, SCRATCH.SELECTION_DETAIL_COMPONENT);

      if (instance != null) {
        // normally should not happen, but we clean up anyway before assigning
        // a new instance here.
        instance.destroy();
        setScratch(element, SCRATCH.SELECTION_DETAIL_COMPONENT, null);
      }
      // initialize the context menu.
      const contentContainer = document.createElement("div");
      instance = createContextMenuContainer(element, contentContainer);
      instance.show();
      setScratch(element, SCRATCH.SELECTION_DETAIL_COMPONENT, instance);
    }
  );


  cy.on("unselect", selector, function(event) {
      let element = event.target;
      let instance = getScratch(element, SCRATCH.SELECTION_DETAIL_COMPONENT);
      if (instance != null && !instance.isDestroyed) {
        instance.destroy();
        setScratch(element, SCRATCH.SELECTION_DETAIL_COMPONENT, null);
      }
    }
  );

  cy.on("free", selector,  function(event) {
      let element = event.target;
      let instance = getScratch(element, SCRATCH.SELECTION_DETAIL_COMPONENT);
      if(instance != null) {
        instance.popperInstance?.update();
      }
  })
}