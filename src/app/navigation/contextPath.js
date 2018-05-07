import React from 'react';
import {connect} from 'react-redux';

import {matchPath, withRouter} from 'react-router';
import {ActiveContext} from "./context";
import contextStackActions from '../redux/navigation/contextStack/actions';


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
    const activeContext = new ActiveContext(context, index, match);
    if (route.context) {
      const rest = buildContextPath(route.context, path, matchInfo);
      if (rest) {
        return [...rest, activeContext]
      }
    } else {
      return [activeContext]
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
    const {pushContext} = this.props;
    const contextPath = buildContextPath(this.props.rootContext, this.state.location.pathname, this.props.match);
    pushContext(contextPath);
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

const {pushContext} = contextStackActions;

export default withRouter(connect(null, {pushContext})(ContextManager));

