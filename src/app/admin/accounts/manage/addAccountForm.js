import React from "react";
import Button from "../../../../components/uielements/button";
import {Col, DatePicker, Drawer, Form, Icon, Input, Row, Select} from "antd";
import {notification} from "antd";

const {Option} = Select;

class AddAccountFormDrawer extends React.Component {
  state = {visible: false};

  openNotification = (type, message, key) => {
    notification[type]({
      message: message,
      duration: 0,
      key
    });
  };


  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    if(this.state.notification){
      notification.close(this.state.notification)
    }
    this.setState({
      visible: false,
      notification: null
    });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {

        if (this.props.onSubmit) {
          this.props.onSubmit(values)
        }
        this.onClose();
      }
    });
  };

  componentDidMount() {
    if (this.props.error) {
      const notificationKey = `open${Date.now()}`;
      this.setState({
        visible: true,
        notification: notificationKey
      })
      this.openNotification(
        'error',
        `${this.props.error}`,
        notificationKey,
      );
    }
  }

  initialValue(key, defaultValue){
    if(this.state.notification) {
      if(this.props.values){
        return this.props.values[key] || defaultValue
      }
    }
    return defaultValue
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.showDrawer}>
          <Icon type="plus"/> New account
        </Button>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Company">
                  {getFieldDecorator('company', {
                    rules: [{required: true, message: 'Company name is required'}],
                    initialValue: this.initialValue('company', null)
                  })(<Input placeholder="Company"/>)}
                </Form.Item>
              </Col>
            </Row>
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
            <Button onClick={this.onClose} style={{marginRight: 8}}>
              Cancel
            </Button>
            <Button onClick={this.onSubmit} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export const AddAccountForm = Form.create()(AddAccountFormDrawer);