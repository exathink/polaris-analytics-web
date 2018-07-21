import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';


export const Loading = () => (
   <ReactPlaceholder
      showLoadingAnimation
      type="media"
      rows={1}
      ready={false}
    />
);
