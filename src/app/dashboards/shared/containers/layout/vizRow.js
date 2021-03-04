import React from 'react';
import {Flex} from 'reflexbox';
import uniqueStyles from './layout.module.css';
import {cloneChildrenWithProps} from "../../../../helpers/reactHelpers";


const VizRow = ({children, h, style,   ...rest}) => (
  <Flex auto align='center' justify='space-evenly' className={uniqueStyles["viz-row"]} style={{
    height: h,
    ...style
  }}>
    {cloneChildrenWithProps(children, {...rest})}
  </Flex>
);

export default VizRow;
