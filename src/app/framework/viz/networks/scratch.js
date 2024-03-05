/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

export const SCRATCH = {
  SELECTION_DETAIL_COMPONENT: "_tippyContextMenu",
  GLOBAL_LAST_CLICK_OUTSIDE_EVENT: "_globalLastClickOutside"
};

export function getScratch(element, key) {
  return element.scratch(key);
}

// All the scratch keys we will be maintaining.
export function setScratch(element, key, value) {
  element.scratch(key, value);
}