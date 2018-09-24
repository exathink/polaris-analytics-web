import React from 'react';
import {Flex} from 'reflexbox';
import {Contexts} from "../../../../meta";

export const RowNoOverflow = props => (
  <Flex style={{'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow':'ellipsis'}} {...props}>
    {props.children}
  </Flex>
);