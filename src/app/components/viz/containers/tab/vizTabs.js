import React from 'react';
import {Tabs} from 'react-tabs';

export default (props) => (
  <Tabs {...props} style={{height: "100%", width: "100%"}} >
    {props.children}
  </Tabs>
);



