import React from 'react';

import {useGenerateTicks} from "../../hooks/useGenerateTicks";

export const DynamicComponentCarousel = ({children, tickInterval}) => {

  const tick = useGenerateTicks(children.length, tickInterval);

  return children[tick]

}

export const ComponentCarousel = ({disabled, children, tickInterval}) => (
  !disabled ?
    <DynamicComponentCarousel {...{children, tickInterval}}/>
    :
    children[0]
)



