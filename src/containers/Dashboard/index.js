import React from 'react';
import { Flex, Box } from 'reflexbox';
import ContentHolder from '../../../components/utility/contentHolder';

// This should be atomic from the outside, but may be the most cluttered
// of all the components here... (since we'll define things like holders, cards, etc)
export const DashboardItem = ({ w, children }) => {
  <Box w={x}>
    <ContentHolder>
      { children }
    </ContentHolder>
  </Box>
};

// just a flex wrapper ??
export const DashboardRow = ({ height, children }) => (
  <Flex style={{ height: '100%' }}>
    { children }
  </Flex>
);

// so, here...
export const Dashboard = () => ();
