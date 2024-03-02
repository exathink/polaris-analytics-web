/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import tippy from "tippy.js";

export const SCRATCH = {
  CONTEXT_MENU: "_tippyContextMenu"
};

export function getScratch(node, key) {
  return node.scratch(key);
}

// All the scratch keys we will be maintaining.
export function setScratch(node, key, value) {
  node.scratch(key, value);
}