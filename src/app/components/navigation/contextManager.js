import React from "react";
import {findActiveContext} from "../../navigation/contextPath";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import contextStackActions from "../../redux/navigation/contextStack/actions";

export class ContextManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location !== nextProps.location) {
      return {location: nextProps.location}
    } else {
      return null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.location !== nextState.location
  }

  sendNotifications() {
    // Send notifications here.
    const {pushContext} = this.props;
    const activeContext = findActiveContext(this.props.rootContext, this.state.location.pathname, this.props.match);

    pushContext(activeContext);
  }

  componentDidMount() {
    this.sendNotifications();
  }

  componentDidUpdate() {
    this.sendNotifications();
  }

  render() {
    return null;
  }
}

const {pushContext} = contextStackActions;

export default withRouter(connect(null, {pushContext})(ContextManager));