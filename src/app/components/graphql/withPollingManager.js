import React from 'react';

export const withPollingManager = (Component) => {
  return class PollingManager extends React.Component {
    state = {
      polling: false
    }

    startPolling() {
      if (!this.state.polling) {
        this.setState({polling: true})
      }
    }

    stopPolling() {
      if(this.state.polling) {
        this.setState({polling:false})
      }
    }

    render() {
      return (
        <Component
          pollingManager={{
            polling: this.state.polling,
            startPolling: this.startPolling.bind(this),
            stopPolling: this.stopPolling.bind(this)
          }}
          {...this.props}
        />
      )
    }

  }
}