import React from 'react';
import {Mutation} from 'react-apollo';

function refetchQueries(refetchSpec, props, fetchData) {
  return refetchSpec.map(
    spec => ({
      query: spec.query,
      variables: spec.variables || spec.mapPropsToVariables ? Object.assign(
        spec.variables || {},
        spec.mapPropsToVariables ? spec.mapPropsToVariables(props, fetchData) : {}
      ) : {}
    })
  )
}

export const withMutation = ({name, mutation, client, success, error }, refetchSpec = null) => {
  return (Component) => {
    return props => (
      <Mutation
        mutation={mutation}
        onCompleted={data => success && success(data)}
        onError={err => error && error(err)}
        client={client}
        {...
          refetchSpec ?
            {
              refetchQueries:
                (fetchData) => refetchQueries(refetchSpec, props, fetchData)
            } : {}
        }
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
            return <Component {...injectedProp} {...props} />
          }
        }
      </Mutation>

    )
  }
}