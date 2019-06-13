import React from 'react';

export const withMutationCache = (Component) => {
  return class MutationCache extends React.Component {
    state = {values: null, mutation: null}

    mutationWrapper(mutate, mutation=null) {
      return (values) => {
        mutate(values);
        this.setState({values,  mutation})
      }
    }

    notify(mutations) {
      for(let i=0; i< mutations.length; i++){
        const mutation = mutations[i];
        if (mutation.mutate === this.state.mutation){
          mutation.notify && mutation.notify()
        }
      }
    }

    render() {
      return <Component
        mutationCache={{
          mutate: this.mutationWrapper.bind(this),
          lastSubmission: this.state.values,
          lastMutation: this.state.mutation,
          notify: this.notify.bind(this)
        }}
        {...this.props}
      />
    }
  }
}