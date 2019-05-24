import React from 'react';
import {notification} from "antd";
import {display_error} from "../../helpers/utility";

export const withSubmissionHandler = (Component) => {
  return class SubmissionErrorHandler extends React.Component {
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
      this.setState({
        notification: null,
        visible: false
      });
    };

    onSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {

          if (this.props.onSubmit) {
            this.props.onSubmit(values)
          }
          this.onClose();
        }
      });
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

    initialValue = (key, defaultValue) => {
      if (this.state.notification) {
        if (this.props.values) {
          return this.props.values[key] || defaultValue
        }
      }
      return defaultValue
    }

    render() {
      const {onSubmit, ...rest} = this.props;
      return <Component
        submissionHandler={{
          visible: this.state.notification || this.state.visible,
          show: this.show.bind(this),
          hide: this.onClose.bind(this),
          initialValue: this.initialValue.bind(this),
          onSubmit: this.onSubmit.bind(this)
        }}
        {...rest}
      />
    }
  }
}
