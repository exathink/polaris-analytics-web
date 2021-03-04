import React from 'react';
import {Box} from 'reflexbox';
import uniqueStyles from './layout.module.css';
import {cloneChildrenWithProps} from "../../../../helpers/reactHelpers";

const VizItem = ({children, name, w, itemSelected, url,  navigate, style, ...rest}) => (
  <Box w={w} m={1} className={uniqueStyles["viz-item"]} style={style}>
    {cloneChildrenWithProps(children, {navigate, itemSelected, ...rest})}
  </Box>
);

export default VizItem;
