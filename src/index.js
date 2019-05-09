import React from 'react';
import ReactDOM from 'react-dom';
import UrjunaApp from './urjunaApp';
import 'antd/dist/antd.css';

ReactDOM.render(<UrjunaApp />, document.getElementById('root'));

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./urjunaApp.js', () => {
    const NextApp = require('./urjunaApp').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}

