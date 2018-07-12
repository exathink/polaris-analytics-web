import React from 'react';

export const CardContent = props => (
  <div className={'isoCardContent'} {...props}>
    {props.children}
  </div>
);
