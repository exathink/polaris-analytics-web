import React from 'react';
import {TabPanel} from 'react-tabs';

const vizTabPanel =  (props) => (
  <TabPanel {...props} style={{height: "100%", width: "100%", paddingBottom: "45px"}}>
    {props.children}
  </TabPanel>
);
vizTabPanel.tabsRole = 'TabPanel';

export default vizTabPanel;


