import React from 'react';
import {Box} from 'reflexbox';

import {cloneChildrenWithProps} from "../../../../helpers/reactHelpers";

export default ({children, name, w, itemSelected, url,  navigate, ...rest}) => (
  <Box w={w} m={1} className="viz-item">
    {cloneChildrenWithProps(children, {navigate, itemSelected, ...rest})}
  </Box>
);