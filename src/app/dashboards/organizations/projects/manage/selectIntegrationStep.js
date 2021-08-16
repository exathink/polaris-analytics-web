import React from "react";
import {Row, Col, Card, Avatar} from "antd";
import {TRELLO_CONNECTOR} from "../../../../../config/featureFlags";
import "./addProjectsWorkflow.css";
import Button from "../../../../../components/uielements/button";
const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {
  render() {
    const {viewerContext} = this.props;

    return (
      <div className={'select-connector'}>
        <div className={"select-connector-cards"}>
          
            
              <Card hoverable={true} bordered={true} style={{width: 300, marginTop: 16}}
                    onClick={() => this.props.onConnectorTypeSelected('jira')}>
                <Meta
                  avatar={
                    <Avatar src="/images/third-party/jira-mark-contained-gradient-neutral@2x.png"/>
                  }
                  title="Jira"
                  description="Import Projects and Issues"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
              </Card>
            
            
              <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}
                    onClick={() => this.props.onConnectorTypeSelected('github')}>
                <Meta
                  avatar={
                    <Avatar src="/images/third-party/GitHub-Mark-120px-plus.png"/>
                  }
                  title="Github"
                  description="Import Repository Issues"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
              </Card>
            
            
              <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}
                    onClick={() => this.props.onConnectorTypeSelected('pivotal')}>
                <Meta
                  avatar={
                    <Avatar src="/images/third-party/Tracker_Icon.svg"/>
                  }
                  title="Pivotal Tracker"
                  description="Import Projects and Stories"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
              </Card>
            
          
          
            
              <Card
                bordered={true}
                hoverable={true}
                style={{width: 300, marginTop: 16}}
                onClick={() => this.props.onConnectorTypeSelected("gitlab")}
              >
                <Meta
                  avatar={<Avatar src="/images/third-party/gitlab-icon-rgb.svg" />}
                  title="GitLab"
                  description="Import Projects and Issues"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
              </Card>
            
            {
              viewerContext.isFeatureFlagActive(TRELLO_CONNECTOR) ?
                
                  <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}
                        onClick={() => this.props.onConnectorTypeSelected('trello')}>
                    <Meta
                      avatar={
                        <Avatar src="/images/third-party/trello.png"/>
                      }
                      title="Trello"
                      description="Import Boards and Cards"
                    />
                    <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
                  </Card>
                
                :
                null
            }
          
        </div>
      </div>
    )
  }
}