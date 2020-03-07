import React from "react";
import {ViewerContext} from "../../framework/viewer/viewerContext";

export const withFeatureFlag = (featureFlag) =>
  ({whenDisabled, whenEnabled}) => (
    props =>
      <ViewerContext.Consumer>
        {
          viewerContext =>
            viewerContext.isFeatureFlagActive(featureFlag) ?
              React.createElement(
                whenEnabled,
                {viewerContext: viewerContext, ...props}
              )
              :
              React.createElement(
                whenDisabled,
                {viewerContext: viewerContext, ...props}
              )
        }
      </ViewerContext.Consumer>
  );


