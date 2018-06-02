import React from "react";
import {findActiveContext} from "../context/contextPath";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {navigationDispatch} from "../context/withNavigation";

import contextStackActions from "../../redux/navigation/actions";

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
    const {pushContext, navigate} = this.props;
    const activeContext = findActiveContext(this.props.rootContext, this.state.location, this.props.match);
    activeContext.rootContext = this.props.rootContext;
    activeContext.rootUrl = this.props.match.url;
    activeContext.navigator = navigate;

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

export default withRouter(connect(null, navigationDispatch)(connect(null, {pushContext})(ContextManager)));