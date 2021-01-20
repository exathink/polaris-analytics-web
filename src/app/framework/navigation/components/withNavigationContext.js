import React from 'react';
import {NavigationContext} from "../context/navigationContext";

export const withNavigationContext = Component => (
  props =>
    <NavigationContext.Consumer>
      {
        navigationContext =>
          <Component
            context = {navigationContext.contextStack.current()}
            navigation = {navigationContext.contextStack}
            navigate = {navigationContext.navigate}
            filterTopics = {navigationContext.filterTopics}
            filteredTopics = {navigationContext.filteredTopics}
            showOptionalTopics = {navigationContext.showOptionalTopics}
            optionalTopics = {navigationContext.optionalTopics}
            setPolling = {navigationContext.setPolling}
            polling = {navigationContext.polling}
            setEnableVideo = {navigationContext.setEnableVideo}
            enableVideo = {navigationContext.enableVideo}
            setFullScreen = {navigationContext.setFullScreen}
            fullScreen = {navigationContext.fullScreen}
            {...props}
          />
      }
    </NavigationContext.Consumer>
  );
