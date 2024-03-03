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

export function initContextMenu(cy, selector = null, contextMenu) {
  function createContextMenuContainer(element) {
    if (element.popperRef == null) {
      attachPopper(element);
    }
    const menuContainer = document.createElement("div");
    const ContextMenu = contextMenu?.menu;
    return tippy(document.createElement("div"), {
      getReferenceClientRect: element.popperRef().getBoundingClientRect(),
      content: menuContainer,
      onCreate: (instance) => {
        ReactDOM.render(
          <ContextMenu  tippy={instance}/>,
          menuContainer
        );
      },
      onDestroy: (instance) => {
        ReactDOM.unmountComponentAtNode(menuContainer);
      },
      hideOnClick: contextMenu?.transient,
      trigger: "manual",
    });
  }

  cy.on("tap", selector, function(event) {
      let element = event.target;
      let instance = getScratch(element, SCRATCH.CONTEXT_MENU);
      if (instance != null) {
        instance.destroy();
        setScratch(element, SCRATCH.CONTEXT_MENU, null);
      } else {
        instance = createContextMenuContainer(element);
        instance.show();
        setScratch(element, SCRATCH.CONTEXT_MENU, instance);
      }
    }
  );
}