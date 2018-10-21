import React from "react";

export class DashboardLifecycleManager extends React.Component {
  componentDidMount() {
    const {
      onMount
    } = this.props;

    if(onMount) {
      onMount();
    }
  }

  render () {
    const {
      render,
      ...rest
    } = this.props;
    return React.createElement(render, {...rest})
  }
}
