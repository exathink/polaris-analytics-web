import React from 'react';
import {findActiveContext} from "../context/contextPath";

import {withRouter} from "react-router";
import {ContextStack} from './contextStack';

const {Provider, Consumer} = React.createContext({});



class NavigationContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      contextStack: ContextStack.initContext()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location !== nextProps.location) {
      const activeContext = findActiveContext(nextProps.rootContext, nextProps.location, nextProps.match);
      activeContext.rootContext = nextProps.rootContext;
      activeContext.rootUrl = nextProps.match.url;
      activeContext.navigator = nextProps.history;
      return {
        location: nextProps.location,
        contextStack: ContextStack.pushContext(prevState.contextStack, activeContext)
      }
    } else {
      return null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.location !== nextState.location
  }

  render() {
    return (
      <Provider value={{
        navigation: this.state.contextStack,
        current: this.state.contextStack.current(),
        navigate: this.props.history
      }
    }>
        {this.props.children}
      </Provider>
    )
  }
}



export const NavigationContext = {
  Provider: withRouter(NavigationContextProvider),
  Consumer: Consumer
};

