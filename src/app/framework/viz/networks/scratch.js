/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import tippy from "tippy.js";

export const SCRATCH = {
  CONTEXT_MENU: "_tippyContextMenu",
  GLOBAL_LAST_CLICK_OUTSIDE_EVENT: "_globalLastClickOutside"
};

export function getScratch(element, key) {
  return element.scratch(key);
}

// All the scratch keys we will be maintaining.
export function setScratch(element, key, value) {
  element.scratch(key, value);
}