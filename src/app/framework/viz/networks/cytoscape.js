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

export function getPopperContainer(instance) {
  return instance?.popperInstance?.state?.elements?.popper
}

function isInside(clickPosition, instance) {
    const tippyContainer = getPopperContainer(instance);
    if( tippyContainer && clickPosition) {
      const {clientX, clientY} = clickPosition;
      const {left, right, top, bottom} = tippyContainer.getBoundingClientRect();
      return (
        clientX >= left &&
        clientX <= right &&
        clientY >= top &&
        clientY <= bottom
      );
    }
    return false;
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

export function initContextMenu(cy, selector = null, contextMenu) {
  function createContextMenuContainer(element, contentContainer) {
    if (element.popperRef == null) {
      attachPopper(element);
    }
    const Menu = contextMenu?.menu;

    return tippy(document.createElement("div"), {
      content: contentContainer,
      getReferenceClientRect: element.popperRef().getBoundingClientRect,
      content: (instance) => {
        ReactDOM.render(
          <Menu />,
          contentContainer
        );
        return contentContainer;
      },
      onCreate: (instance) => {
        instance?.popper?.setAttribute('data-testid', 'tippy-container')
      },
      onDestroy(instance) {
        ReactDOM.unmountComponentAtNode(contentContainer);
      },
      hideOnClick: false,
      trigger: "manual"
    });
  }



  cy.on("tapselect", selector, function(event) {
      //tapselect is emitted only in a deselected state, ie a second tapselect does not
      // trigger anything
      let element = event.target;
      let instance = getScratch(element, SCRATCH.CONTEXT_MENU);

      if (instance != null) {
        // normally should not happen, but we clean up anyway before assigning
        // a new instance here.
        instance.destroy();
        setScratch(element, SCRATCH.CONTEXT_MENU, null);
      }
      // initialize the context menu.
      const contentContainer = document.createElement("div");
      instance = createContextMenuContainer(element, contentContainer);
      instance.show();
      setScratch(element, SCRATCH.CONTEXT_MENU, instance);
    }
  );


  cy.on("unselect", selector, function(event) {
      console.log("unselect");
      let element = event.target;
      let instance = getScratch(element, SCRATCH.CONTEXT_MENU);
      if (instance != null && !instance.isDestroyed) {
        const clickPosition = getScratch(cy, SCRATCH.GLOBAL_LAST_CLICK_OUTSIDE_EVENT);
        if (!isInside(clickPosition, instance)) {
          instance.destroy();
          setScratch(element, SCRATCH.CONTEXT_MENU, null);
        } else {
          // we will swallow this deselect event
          console.log("deselect swallowed");
          element.select(); // reselect the node.
          event.stopImmediatePropagation();
          setScratch(cy, SCRATCH.GLOBAL_LAST_CLICK_OUTSIDE_EVENT, null);
        }
      }
    }
  );
  cy.on("tap click", function(event) {
    // The event object has details of where the click occurred
    const evtTarget = event.target;

    if (evtTarget === cy) {
      console.log("tap on background (outside the graph)");
      // Accessing the original DOM click event
      const {clientX, clientY} = event.originalEvent;
      setScratch(cy, SCRATCH.GLOBAL_LAST_CLICK_OUTSIDE_EVENT, {clientX, clientY});
    }
  });
}