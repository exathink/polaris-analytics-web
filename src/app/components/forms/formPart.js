import React from 'react';

export function Part({partId, part, children}) {
  return part && partId ===part ? children : null
}