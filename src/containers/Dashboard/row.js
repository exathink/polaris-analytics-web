import React from 'react';
import { Flex } from 'reflexbox';

export default ({ h, children }) => (
  <Flex auto align='center' justify='space-between' className="dashboard-row" style={{
    height: h
  }}>
    { children }
  </Flex>
);

