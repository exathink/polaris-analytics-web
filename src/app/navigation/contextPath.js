import React from 'react';
import {connect} from 'react-redux';

import {matchPath, withRouter} from 'react-router';
import {ActiveContext} from "./context";
import contextStackActions from '../redux/navigation/actions';
import {ContextManager} from "../components/navigation/contextManager";


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
    const activeContext = new ActiveContext(context, index, match,path);
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

export const findActiveContext = (context, path, match={}) => {
  const  routeMatch = findMatch(context, path, match);
  if(routeMatch) {
    const [route, index, matchInfo] = routeMatch;
    if (route.context) {
      const childContext = findActiveContext(route.context, path, matchInfo);
      if (childContext) {
        return childContext
      }
    } else {
      return new ActiveContext(context, index, match, path);
    }
  }

};



