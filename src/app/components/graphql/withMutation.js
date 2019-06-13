import React from 'react';
import {Mutation} from 'react-apollo';

export const withMutation = ({name, mutation, client, notification}) => {
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
                // we use the mutation name for the function for
                // cleaner calling code
                [name]: mutate,
                // we pass the generic mutate name so that callers
                // checking for the mutation without knowing which mutation it is can
                // use this field.
                mutate: mutate,
                [`${name}Result`]: result,
                notify: () => notification && result.data && notification(result.data)
              }
            }
            return <Component { ...injectedProp } {...props} />
          }
        }
      </Mutation>

    )
  }
}