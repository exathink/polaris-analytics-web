import React from 'react';
import {Mutation} from 'react-apollo';

export const withMutation = (mutation, {name, client}) => {
  return (Component) => {
    return props => (
      <Mutation
        mutation={mutation}
        client={client}
      >
        {
          (mutate, result) => {
            const injectedProp = {
              [`${name}Mutation`]: {
                [name]: mutate,
                [`${name}Result`]: result
              }
            }
            return <Component { ...injectedProp } {...props} />
          }
        }
      </Mutation>

    )
  }
}