import React from 'react';
import {Flex} from 'reflexbox';
import uniqueStyles from './layout.module.css';
import {cloneChildrenWithProps} from "../../../../helpers/reactHelpers";


export default ({children, h, style,   ...rest}) => (
  <Flex auto align='center' justify='space-evenly' className={uniqueStyles["viz-row"]} style={{
    height: h,
    ...style
  }}>
    {cloneChildrenWithProps(children, {...rest})}
  </Flex>
);
