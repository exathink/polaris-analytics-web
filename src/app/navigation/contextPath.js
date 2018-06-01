import {matchPath} from 'react-router';
import {ActiveContext} from "./activeContext";


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

export const findActiveContext = (context, location, match={}) => {
  const  routeMatch = findMatch(context, location.pathname, match);
  if(routeMatch) {
    const [route, index, matchInfo] = routeMatch;
    if (route.context) {
      const childContext = findActiveContext(route.context, location, matchInfo);
      if (childContext) {
        return childContext
      }
    } else {
      return new ActiveContext(context, index, match, location);
    }
  }

};



