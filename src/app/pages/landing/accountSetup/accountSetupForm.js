import React from 'react';
import {Input} from 'antd';
import Form from '../../../../components/uielements/form';
import Checkbox from '../../../../components/uielements/checkbox';
import Button from '../../../../components/uielements/button';
import Notification from '../../../../components/notification';

const FormItem = Form.Item;

class AccountSetupForm extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.onSubmit) {
          this.props.onSubmit(values)
        }
      }
    });
  };


  render() {
    const { form , viewer } = this.props;
    const {getFieldDecorator} = form

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Organization" hasFeedback>
          {getFieldDecorator('organization', {
            initialValue: viewer.company,
            rules: [
              {
                required: true,
                message: 'Required',
              },
            ],
          })(<Input placeholder={viewer.company} name="organization" id="organization" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Create Organization
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AccountSetupForm);
