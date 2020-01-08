import React from 'react';
import ReactDOM from 'react-dom';
import PolarisFlowApp from './polarisFlow';
import 'antd/dist/antd.css';

ReactDOM.render(<PolarisFlowApp />, document.getElementById('root'));

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./polarisFlow.js', () => {
    const NextApp = require('./polarisFlow').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}

