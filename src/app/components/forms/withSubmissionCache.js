import React from 'react';

export const withSubmissionCache = (Component) => {
  return class SubmissionCache extends React.Component {
    state = {values: null}

    submitWrapper(submit) {
      return (values) => {
        submit(values);
        this.setState({values})
      }
    }

    render() {
      return <Component
        submissionCache={{
          submit: this.submitWrapper.bind(this),
          lastSubmission: this.state.values
        }}
        {...this.props}
      />
    }
  }
}