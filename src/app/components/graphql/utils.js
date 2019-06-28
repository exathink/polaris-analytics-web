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