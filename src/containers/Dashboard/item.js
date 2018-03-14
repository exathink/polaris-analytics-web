import React from 'react';
import { Box } from 'reflexbox';

const ItemMenu = props => (
  <nav className="dashboard-item-menu">
      <i
        className="ion ion-arrow-expand"
        title="Expand"
        onClick={() => props.expandViz}></i>
  </nav>
);

export default ({ w=1, menuProps, children }) => (
  <Box w={w} m={1} className="dashboard-item">
    <ItemMenu {...menuProps} />
    { children }
  </Box>
);


