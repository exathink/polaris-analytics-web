import React from 'react';
import { LayoutContentWrapper } from './layoutWrapper.style';

export default props => (
  <LayoutContentWrapper
    className={
      props.className != null
        ? `${props.className} isoLayoutContentWrapper`
        : 'isoLayoutContentWrapper'
    }
    {...props}
  >
    {console.log('props:', props)}
    {props.children}
  </LayoutContentWrapper>
);
