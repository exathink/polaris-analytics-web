import React from 'react';
import {Mutation} from 'react-apollo';

export const withMutation = ({name, mutation, client, notification}) => {
  return (Component) => {
    return props => (
      <Mutation
        mutation={mutation}
        onCompleted={ data => notification && notification(data)}
        client={client}
      >
        {
          (mutate, result) => {
            const injectedProp = {

              [`${name}Mutation`]: {
                // we use the mutation name for the function for
                // cleaner calling code
                [name]: mutate,
                // we pass the generic mutate name so that clients can handle mutations generically.
                mutate: mutate,
                // same deal: named version for cleaner call site code
                [`${name}Result`]: result,
                // generic version for mutation cache etc.
                result: result,
              }
            }
            return <Component { ...injectedProp } {...props} />
          }
        }
      </Mutation>

    )
  }
}