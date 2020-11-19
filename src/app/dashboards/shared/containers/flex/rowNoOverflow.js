import React from 'react';
import {Flex} from 'reflexbox';

export const RowNoOverflow = props => (
  <Flex title={props.title} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow:'ellipsis'}} {...props}>
    {props.children}
  </Flex>
);