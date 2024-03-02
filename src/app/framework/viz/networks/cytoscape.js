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
import {Menu} from "antd";
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

/**
 * Initializes default tooltips for the given cytoscape collection.
 * @param {cytoscape.Core} cy - The cytoscape instance to attach tooltips to.
 */
export function attachTooltips(collection) {
    collection.forEach(
      element => {
        element.popper({
          content: () => {
            let div = document.createElement("div");
            div.innerHTML = ``;
            document.body.appendChild(div);
            return div;
          },
          popper: {}
        });
        element.on("mouseover", function(event) {
          const node = event.target;
          const instance = tippy(document.createElement("div"), {
            getReferenceClientRect: () => node.popperRef().getBoundingClientRect(),
            content: () => {
              const div = document.createElement("div");
              div.innerHTML = event.target.data("tooltip") ? event.target.data("tooltip")() : ``;
              return div;
            },
            theme: "light",
            arrow: true,
            trigger: "click"
          });

          instance.show();

          event.target.on("mouseout", function(event) {
            instance.destroy();
          });
        });
      }
    );

  }


export function initContextMenu(cy) {
  cy.on("tap", "node", function(event) {
      let node = event.target;
      let instance = getScratch(node, SCRATCH.CONTEXT_MENU);
      if (instance != null) {
        instance.destroy();
        setScratch(node, SCRATCH.CONTEXT_MENU, null);
      } else {
        instance = tippy(document.createElement("div"), {
          content: () => {
            let div = document.createElement("div");
            ReactDOM.render(
              <Menu
                mode="horizontal"
                theme="dark"
              >
                <Menu.Item key="1">A</Menu.Item>
                <Menu.Item key="2">B</Menu.Item>
                <Menu.Item key="3">C</Menu.Item>
              </Menu>,
              div
            );
            return div;
          },
          hideOnClick: false,
          trigger: "manual",
          getReferenceClientRect: node.popperRef().getBoundingClientRect
        });
        instance.show();
        setScratch(node, SCRATCH.CONTEXT_MENU, instance);
      }
    }
  );
}