import React from 'react';
import {notification} from "antd";
import {display_error} from "../../helpers/utility";

export const withSubmissionHandler = (Component) => {
  return class SubmissionHandler extends React.Component {
    state = {
      notification: null,
      visible: false
    }

    openNotification = (type, message, key, duration) => {
      notification[type]({
        message: message,
        duration: 0,
        key
      });
    };

    show() {
      this.setState({
        visible: true
      })
    }


    onClose = () => {
      if (this.state.notification) {
        notification.close(this.state.notification)
      }
      this.props.form.resetFields()
      this.setState({
        notification: null,
        visible: false
      });

    };

    onSubmit(values) {
      if (this.props.onSubmit) {
        this.props.onSubmit(values)
      }
      this.onClose();
    };

    componentDidMount() {
      const {values, error } = this.props;
      const notificationKey = `open${Date.now()}`;
      if (error) {
        this.setState({
          notification: notificationKey
        })
        this.openNotification(
          'error',
          `${display_error(error)}`,
          notificationKey,
          0
        );
      }
    }

    render() {
      const {onSubmit, lastSubmission, error, ...rest} = this.props;
      return <Component
        submissionHandler={{
          visible: this.state.notification != null || this.state.visible,
          show: this.show.bind(this),
          hide: this.onClose.bind(this),
          lastSubmission: error ? lastSubmission : null,
          onSubmit: this.onSubmit.bind(this)
        }}
        {...rest}
      />
    }
  }
}
