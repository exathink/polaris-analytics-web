import React from 'react';
import { LayoutContentWrapper } from './layoutWrapper.style';

export default props => (
  <LayoutContentWrapper
    className={
      props.className != null
        ? `isoLayoutContentWrapper ${props.className} `
        : 'isoLayoutContentWrapper'
    }
    {...props}
  >
    {props.children}
  </LayoutContentWrapper>
);
