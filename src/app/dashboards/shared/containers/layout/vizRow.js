import React from 'react';
import {Flex} from 'reflexbox';

import {cloneChildrenWithProps} from "../../../../helpers/reactHelpers";

export default ({children, h,  ...rest}) => (
  <Flex auto align='center' justify='space-between' className="viz-row" style={{
    height: h
  }}>
    {cloneChildrenWithProps(children, {...rest})}
  </Flex>
);
