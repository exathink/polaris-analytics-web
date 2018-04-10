import React from 'react';
import ReactDOM from 'react-dom';
import DashApp from './dashApp';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.css';


console.log("Starting REACT DOM render");
ReactDOM.render(<DashApp />, document.getElementById('root'));
console.log("React DOM Render completed");

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./dashApp.js', () => {
    const NextApp = require('./dashApp').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}
//registerServiceWorker();
