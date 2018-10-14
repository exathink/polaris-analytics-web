import React from "react";

export class DashboardLifecycleManager extends React.Component {
  constructor(props) {
    super(props);
    const {
      render,
      ...rest
    } = props;

    this.state={
      // We memoize the render prop here (this is the child dashboard that is being shown)
      // since we dont need to recreate this every time the render prop updates.
      child: React.createElement(render, {...rest})
    }
  }

  componentDidMount() {
    const {
      onMount
    } = this.props;

    if(onMount) {
      onMount();
    }
  }

  render () {
    return this.state.child
  }
}
