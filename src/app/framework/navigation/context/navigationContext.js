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
      contextStack: ContextStack.initContext(),
      filteredTopics: null,
      navigate: props.history,
      filterTopics: this.filterTopics.bind(this),
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location !== nextProps.location) {
      const activeContext = findActiveContext(nextProps.rootContext, nextProps.location, nextProps.match);
      activeContext.rootContext = nextProps.rootContext;
      activeContext.rootUrl = nextProps.match.url;
      activeContext.navigator = nextProps.history;
      return {
        ...prevState,
        location: nextProps.location,
        contextStack: ContextStack.pushContext(prevState.contextStack, activeContext),
        filteredTopics: null
      }
    } else {
      return null;
    }
  }

  filterTopics(filteredTopics) {
    this.setState({
      ...this.state,
      filteredTopics: filteredTopics
    })
  }


  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }
}



export const NavigationContext = {
  Provider: withRouter(NavigationContextProvider),
  Consumer: Consumer
};

