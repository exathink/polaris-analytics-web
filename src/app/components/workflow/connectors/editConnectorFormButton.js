import React from "react";
import {Col, Form, Input, Row, Icon} from "antd";
import {createForm} from "../../forms/createForm";

const EditConnectorForm = (
    {
        connector,
        connectorType,
        currentValue,
        form: {
            getFieldDecorator
        }
    }
) => {
    const {name, baseUrl} = connector;
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
                                    initialValue: currentValue('apiKey', null)
                                })(<Input placeholder="New API key (optional)" />)}
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
                                    initialValue: currentValue('githubAccessToken', null)
                                })(<Input placeholder="New access token (optional)" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    :
                    null
            }
            {
                connectorType === 'gitlab' ?
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Personal Access Token">
                                {getFieldDecorator('gitlabPersonaAccessToken', {
                                    initialValue: currentValue('gitlabPersonalAccessToken', null)
                                })(<Input placeholder="New access token (optional)" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    :
                    null
            }
        </React.Fragment>
    )
}
export const EditConnectorFormButton = createForm(EditConnectorForm, {
    drawer: true,
    title: 'Edit Connector',
    buttonSize: 'small',
    icon: <Icon type={'edit'}/>
});