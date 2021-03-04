import React from 'react';
import {Tabs} from 'react-tabs';

const VizTabs = (props) => (
  <Tabs {...props} style={{height: "100%", width: "100%"}} >
    {props.children}
  </Tabs>
);

export default VizTabs;
