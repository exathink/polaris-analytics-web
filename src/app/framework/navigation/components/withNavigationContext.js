import React from 'react';
import {NavigationContext} from "../context/navigationContext";

export const withNavigationContext = Component => (
  props =>
    !props.context ? (
      <NavigationContext.Consumer>
        {
          navigationContext =>
            <Component
              context = {navigationContext.current}
              navigation = {navigationContext.navigation}
              navigate = {navigationContext.navigate}
              {...props}
            />
        }
      </NavigationContext.Consumer>
      ) : (
       <Component {...props}/>
    )
  );
