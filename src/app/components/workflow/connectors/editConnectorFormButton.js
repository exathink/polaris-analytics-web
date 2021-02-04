import React from "react";
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Row } from "antd";
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
                connectorType === 'jira' ?
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
                connectorType === 'bitbucket' ?
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Bitbucket Workspace">
                                {getFieldDecorator('bitbucketPrincipalName', {
                                    initialValue: currentValue('bitbucketPrincipalName')
                                })(
                                    <Input placeholder="Updated Bitbucket Workspace (optional)" />
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
                                {getFieldDecorator('gitlabPersonalAccessToken', {
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
    icon: <LegacyIcon type={'edit'}/>
});