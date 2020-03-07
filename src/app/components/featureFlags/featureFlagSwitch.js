import React from "react";
import {ViewerContext} from "../../framework/viewer/viewerContext";


export const FeatureFlagSwitch = ({featureFlag, whenDisabled, whenEnabled, ...rest}) => (
  <ViewerContext.Consumer>
        {
          viewerContext =>
            viewerContext.isFeatureFlagActive(featureFlag) ?
              React.createElement(
                whenEnabled,
                {viewerContext: viewerContext, ...rest}
              )
              :
              React.createElement(
                whenDisabled,
                {viewerContext: viewerContext, ...rest}
              )
        }
      </ViewerContext.Consumer>
)