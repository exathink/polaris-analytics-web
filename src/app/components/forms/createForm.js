import React from "react";
import Button from "../../../components/uielements/button";
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Drawer, notification } from "antd";
import {display_error} from "../../helpers/utility";
import styles from "./createForm.module.css";

function withForm(FormFields, options) {
  const title = options.title
  const submitTitle = options.submitTitle || 'Submit';
  const parts = options.parts || [];
  const hasParts = parts.length > 0;

  const partOptions = options.partOptions || {}
  const drawer = options.drawer || false;
  const drawerButtonTitle = options.drawerButtonTitle || title
  const layout = options.layout || 'vertical';
  const buttonSize = options.buttonSize || 'default'
  const noPlus = options.noPlus || false
  const drawerButtonIcon = options.icon
  const isIconOnly = options.buttonType === "iconOnly";
  const FormBody = (
    {
      part,
      partProps,
      onSubmit,
      onClose,
      onNext,
      onPrev,
      currentValue,
      ...rest
    }
  ) => {
    return (
      <React.Fragment>
        <Form layout={layout} hideRequiredMark onSubmit={!hasParts ? onSubmit : null}>
          <FormFields
            part={hasParts ? parts[part] : null}
            currentValue={currentValue}
            onSubmit={onSubmit}
            {...rest}
          />
        </Form>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button tabIndex="-1" onClick={onClose} style={{marginRight: 8}}>
            Cancel
          </Button>
          {
            (0 < part) && (part < parts.length) ?
              <Button tabIndex="-1" onClick={onPrev} style={{marginRight: 8}}>
                Previous
              </Button>
              :
              null
          }
          {
            (0 <= part) && (part < parts.length - 1) ?
              <Button tabIndex="-1" onClick={onNext} style={{marginRight: 8}}>
                Next
              </Button>
              :
              null
          }
          {
            parts.length === 0 || part === parts.length - 1 ?
              <Button onClick={onSubmit} type="primary">
                {submitTitle}
              </Button>
              : null
          }
        </div>
      </React.Fragment>
    )
  }

  return class FormController extends React.Component {

    initialState = (values) => ({
      index: 0,
      visible: !drawer,
      values: values || {},
      notification: null,
    })

    constructor(props) {
      super(props);
      this.state = this.initialState(props.error && props.values)
    }


    show() {
      this.setState({
        visible: true
      })
    }

    onNext() {
      this.props.form.validateFields(
        (errors, values) => {
          if (!errors) {
            this.setState({
              index: this.state.index + 1,
              values: Object.assign(this.state.values, values)
            })
          }
        }
      )
    }

    onPrev() {
      const values = this.props.form.getFieldsValue()
      this.setState({
        index: this.state.index - 1,
        values: Object.assign(this.state.values, values)
      })
    }

    currentValue(field, defaultValue = null) {
      return this.state.values[field] || defaultValue
    }

    onSubmit(e) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {onSubmit} = this.props;
          if (onSubmit) {
            onSubmit(Object.assign(this.state.values, values))
          }
          this.onClose()
        }
      });
    };

    onClose = () => {
      if (this.state.notification) {
        notification.close(this.state.notification)
      }
      this.props.form.resetFields()
      this.setState(this.initialState(null));

    };

    openNotification(type, message, key, duration) {
      notification[type]({
        message: message,
        duration: 0,
        key
      });
    };

    checkForErrors() {
      const {error, lastSubmission} = this.props;
      const notificationKey = `open${Date.now()}`;
      if (error && error !== this.state.lastSubmissionError) {
        this.setState({
          visible: true,
          values: lastSubmission || this.state.values,
          notification: notificationKey,
          lastSubmissionError: error,
        })
        this.openNotification(
          'error',
          `${display_error(error)}`,
          notificationKey,
          0
        );
      }
    }

    componentDidMount() {
      this.checkForErrors()
    }

    componentDidUpdate() {
      this.checkForErrors()
    }


    render() {
      const part = this.state.index;
      const partProps = hasParts && (partOptions[parts[part]] || {})
      // We want to override the submitted props to do field validation before submit.
      const {onSubmit, ...rest} = this.props;
      const disabled = this.props.enabled != null && !this.props.enabled
      return drawer ?
        <React.Fragment>
          {!isIconOnly && (
            <Button size={buttonSize} type="primary" onClick={this.show.bind(this)} disabled={disabled} data-testid="create-connector-button">
              {drawerButtonIcon || noPlus || <PlusOutlined />}
              {this.props.title || drawerButtonTitle}
            </Button>
          )}
          {isIconOnly && (
            <div className={styles.iconOnlyButton}>
              <Button size={buttonSize} type="secondary" onClick={this.show.bind(this)} disabled={disabled}>
                {drawerButtonIcon}
              </Button>
            </div>
          )}
          <Drawer
            title={this.props.title || partProps.title || title}
            width={720}
            onClose={this.onClose.bind(this)}
            visible={this.state.visible}
          >
            <FormBody
              part={part}
              partProps={partProps}
              onSubmit={this.onSubmit.bind(this)}
              onClose={this.onClose.bind(this)}
              onNext={this.onNext.bind(this)}
              onPrev={this.onPrev.bind(this)}
              currentValue={this.currentValue.bind(this)}
              {...rest}
            />
          </Drawer>
        </React.Fragment>
        :
        <FormBody
          part={this.state.index}
          partProps={partProps}
          onSubmit={this.onSubmit.bind(this)}
          onClose={this.onClose.bind(this)}
          onNext={this.onNext.bind(this)}
          onPrev={this.onPrev.bind(this)}
          currentValue={this.currentValue.bind(this)}
          {...rest}
        />;
    }
  };
}

export const createForm = (FormFields, options) => Form.create(options)(withForm(FormFields, options))