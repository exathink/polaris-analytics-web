import React from "react";
import Button from "../../../components/uielements/button";
import {Drawer, Form, Icon, notification} from "antd";
import {display_error} from "../../helpers/utility";

function withForm(FormFields, options) {
    const title = options.title;
    const drawer = options.drawer || false;

    const FormBody = (
        {
            onSubmit,
            onClose,
            currentValue,
            ...rest
        }
    ) => {
        return (
            <React.Fragment>
                <Form layout={'vertical'} hideRequiredMark onSubmit={onSubmit}>
                    <FormFields
                        currentValue={currentValue}
                        onSubmit={onSubmit}
                        {...rest}
                    />
                </Form>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}>
                    <Button tabIndex="-1" onClick={onClose} style={{marginRight: 8}}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} type="primary">
                        {'Submit'}
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    return class FormController extends React.Component {

        initialState = (values) => ({
            index: 0,
            visible: !drawer,
            values: values || {},
            notification: null
        });

        constructor(props) {
            super(props);
            this.state = this.initialState(props.error && props.values);
        };


        show() {
            this.setState({
                visible: true
            });
        };

        currentValue(field, defaultValue = null) {
            return this.state.values[field] || defaultValue;
        };

        onSubmit(e) {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    const {onSubmit} = this.props;
                    if (onSubmit) {
                        onSubmit(Object.assign(this.state.values, values))
                    }
                    this.onClose();
                }
            });
        };

        onClose = () => {
            if (this.state.notification) {
                notification.close(this.state.notification);
            }
            this.props.form.resetFields();
            this.setState(this.initialState(null));

        };

        openNotification(type, message, key, duration) {
            notification[type]({
                message: message,
                duration: duration || 0,
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
                });
                this.openNotification(
                    'error',
                    `${display_error(error)}`,
                    notificationKey,
                    0
                );
            }
        };

        componentDidMount() {
            this.checkForErrors();
        };

        componentDidUpdate() {
            this.checkForErrors();
        };


        render() {
            const {onSubmit, ...rest} = this.props;
            const disabled = this.props.disabled || false;
            return (
                drawer ?
                    <React.Fragment>
                        <Button size={'small'} type="primary" onClick={this.show.bind(this)} disabled={disabled}>
                            <Icon type="edit" />{this.props.title}
                        </Button>
                        <Drawer
                            title={this.props.title || title}
                            width={720}
                            onClose={this.onClose.bind(this)}
                            visible={this.state.visible}
                        >
                            <FormBody
                                onSubmit={this.onSubmit.bind(this)}
                                onClose={this.onClose.bind(this)}
                                currentValue={this.currentValue.bind(this)}
                                {...rest}
                            />
                        </Drawer>
                    </React.Fragment>
                    :
                    <FormBody
                        onSubmit={this.onSubmit.bind(this)}
                        onClose={this.onClose.bind(this)}
                        currentValue={this.currentValue.bind(this)}
                        {...rest}
                    />
            );
        };
    };
};

export const editForm = (FormFields, options) => Form.create(options)(withForm(FormFields, options));