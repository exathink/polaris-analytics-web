import React from "react";
import {Col, Form, Radio, Row, Select} from "antd";
import {createForm} from "../../../../components/forms/createForm";

const {Option} = Select;
const ConfigureSource = (
  {
    part,
    currentValue,
    onSubmit,
    form: {
      getFieldDecorator
    }
  }
) => (
    <React.Fragment>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="">
            {getFieldDecorator('accountWorkTracking', {
              rules: [{required: true, message: 'A value must be selected'}],
              initialValue: currentValue('accountWorkTracking', 'none')
            })(
              <Radio.Group name="inputType" defaultValue={'none'} buttonStyle={"solid"}>
                <Radio.Button value={'none'}>None</Radio.Button>
                <Radio.Button value={'jira'}>Jira</Radio.Button>
                <Radio.Button value={'pivotal'}>Pivotal Tracker</Radio.Button>
                <Radio.Button value={'github'}>Github</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

        </Col>
      </Row>
    </React.Fragment>
);


export const ConfigureSourceForm = createForm(ConfigureSource, {
  drawer: false,
  title: 'New Project',
  submitTitle: 'Create',
});
