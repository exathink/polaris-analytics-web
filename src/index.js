import React from "react";
import ReactDOM from "react-dom";
// import PolarisFlowApp from "./polarisFlow";
// import PolarisDemoApp from "./polarisDemo";
import "./styles/index.css";
import "antd/dist/antd.css";

function importBuildTarget() { 
  if (process.env.REACT_APP_BUILD_TARGET === 'demo') { 
    return import("./polarisDemo.js"); 
  } else {
    return import("./polarisFlow.js"); 
  } 
}

// Import the entry point and render it's default export 
importBuildTarget().then(({ default: Environment }) => 
  ReactDOM.render( 
    <React.StrictMode> 
      <Environment /> 
    </React.StrictMode>
  , document.getElementById("root") 
  ) 
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./polarisFlow.js", () => {
    const NextApp = require("./polarisFlow").default;
    ReactDOM.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>,
      document.getElementById("root")
    );
  });
}
