
export function refetchQueries(refetchSpec, props, fetchData) {
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

/*
*
* Returns a function that can be passed as the first argument to useEffect. When the effect is
* run it fetches the data and invokes the onSuccess or onError callbacks.
*/

export function fetchQueryEffect({service, query, variables, onSuccess, onError}) {
  return (
    () => {
      async function fetch() {
        try {
          const result = await service.query({
            query: query,
            variables: variables
          })
          if (result.data) {
            if (onSuccess) {
              onSuccess(result)
            }
          }
        } catch (error) {
          if (onError) {
            onError(error)
          }
        }
      }
      fetch()
    }
  );

}