import React from 'react';
import {withNavigation} from "./withNavigation";

const {Provider, Consumer} = React.createContext({});

const NavigationContextProvider = withNavigation(props => (
  React.createElement(
    Provider,
    {
      value: {
        navigation: props.navigation,
        current: props.navigation.current(),
        navigate: props.navigate
      }
    },
    props.children
  )
));

export const NavigationContext = {
  Provider: NavigationContextProvider,
  Consumer: Consumer
};

