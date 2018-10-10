import React from 'react';
import {Flex} from 'reflexbox';

export const RowNoOverflow = props => (
  <Flex title={props.title} style={{'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow':'ellipsis'}} {...props}>
    {props.children}
  </Flex>
);