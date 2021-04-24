import React from 'react';
import { LayoutContentWrapper } from './layoutWrapper.style';

const LayoutWrapper = props => (
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

export default LayoutWrapper;
