import React from "react";
import {Col, Form, Input, Row} from "antd";
import {editForm} from "../../forms/editForm";

const EditConnectorForm = (
    {
        connector,
        currentValue,
        form: {
            getFieldDecorator
        }
    }
) => {
    const {name, connectorType, baseUrl} = connector;
    return (
        <React.Fragment>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Name">
                        {getFieldDecorator('name', {
                            rules: [
                                {required: true, message: 'Name is required'}
                            ],
                            initialValue: currentValue('name', name)
                        })(<Input placeholder="name" />)}
                    </Form.Item>
                </Col>
            </Row>
            {
                connectorType === 'atlassian' ?
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Atlassian Server URL">
                                {getFieldDecorator('baseUrl', {
                                    initialValue: currentValue('baseUrl', baseUrl)
                                })(
                                    <Input
                                        disabled
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    :
                    null
            }
            {
                connectorType === 'pivotal' ?
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="API Key">
                                {getFieldDecorator('apiKey', {
                                    rules: [
                                        {required: true, message: 'Api Key is required'}
                                    ],
                                    initialValue: currentValue('apiKey', null)
                                })(<Input placeholder="API Key" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    :
                    null
            }
            {
                connectorType === 'github' ?
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="OAuth Access Token">
                                {getFieldDecorator('githubAccessToken', {
                                    rules: [
                                        {required: true, message: 'OAuth Access Token'}
                                    ],
                                    initialValue: currentValue('githubAccessToken', null)
                                })(<Input placeholder="OAuth Access Token" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    :
                    null
            }
        </React.Fragment>
    )
}
export const EditConnectorFormButton = editForm(EditConnectorForm, {
    drawer: true,
    title: 'Edit Connector'
});