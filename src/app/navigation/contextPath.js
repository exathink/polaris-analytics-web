import React from 'react';

import {matchPath} from 'react-router';
import {ActiveContext} from "./context";

const findMatch = (context, path, match) => {
  for( let index=0; index < context.routes.length; index++ ) {
    const route = context.routes[index];
    const matchInfo = matchPath(path, {
      path: match.path ? `${match.path}/${route.match}` : '',
      exact: false,
      strict: false
    });
    if(matchInfo) {
      return [route, index, matchInfo];
    }
  }
};

export const buildContextPath = (context, path, match={}) => {
  const  routeMatch = findMatch(context, path, match);
  if(routeMatch) {
    const [route, index, matchInfo] = routeMatch;

    if(matchInfo.isExact) {
      return [new ActiveContext(context, index, matchInfo)]
    } else if (route.context) {
      const rest = buildContextPath(route.context, path, matchInfo);
      if (rest) {
        return [...rest, context]
      }
    }
  }

};

export class ContextManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location !== nextProps.location) {
      return {location: nextProps.location}
    } else {
      return null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.location !== nextState.location
  }

  sendNotifications() {
    // Send notifications here.
    const contextPath = buildContextPath(this.props.rootContext, this.state.location.pathname, this.props.match);
    console.log("Send notifications");
  }

  componentDidMount() {
    this.sendNotifications();
  }

  componentDidUpdate() {
    this.sendNotifications();
  }

  render() {
    return null;
  }
}