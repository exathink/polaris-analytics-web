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
            {...props}
          />
      }
    </NavigationContext.Consumer>
  );
