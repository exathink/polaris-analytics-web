import React from 'react';

export const UserContext = React.createContext({});

export const withUserContext = Component => (
  props =>
    <UserContext.Consumer>
      {
        userContext =>
          <Component
            account={userContext.get('account')}
            user={userContext.get('user')}
            {...props}/>
      }
    </UserContext.Consumer>
);