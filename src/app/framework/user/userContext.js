import React from 'react';

export const UserContext = React.createContext({});

export const withUserContext = Component => (
  props =>
    <UserContext.Consumer>
      {
        userContext =>
          <Component {...userContext} {...props}/>
      }
    </UserContext.Consumer>
);