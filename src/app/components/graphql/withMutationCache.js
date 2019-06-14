import React from 'react';

export const withMutationCache = (Component) => {
  return class MutationCache extends React.Component {
    state = {values: null}

    mutationWrapper(mutation, mutate) {
      return (values) => {
        mutate(values);
        this.setState({values,  mutation})
      }
    }

    render() {
      return <Component
        mutationCache={{
          mutate: this.mutationWrapper.bind(this),
          lastSubmission: this.state.values,
        }}
        {...this.props}
      />
    }
  }
}