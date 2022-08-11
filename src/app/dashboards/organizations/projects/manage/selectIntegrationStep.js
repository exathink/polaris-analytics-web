import React from "react";
import {Card, Avatar} from "antd";

import "./addProjectsWorkflow.css";
import Button from "../../../../../components/uielements/button";
import classNames from "classnames";
import fontStyles from "../../../../framework/styles/fonts.module.css";
const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {
  render() {


    return (


      <div className={"select-connector"}>
        <div className={classNames(fontStyles["font-normal"], fontStyles["text-sm"], "step-description")} data-testid="integration-step-title">
          <p>Securely import projects in your work tracking system into a Polaris Value Stream.</p>
        </div>
        <div className={"select-connector-cards"}>


          <Card hoverable={true} bordered={true} style={{ width: 300, marginTop: 16 }}
                onClick={() => this.props.onConnectorTypeSelected("jira")} data-testid="jira-card">
            <Meta
              avatar={
                <Avatar src="/images/third-party/jira-mark-contained-gradient-neutral@2x.png" />
              }
              title="Jira"
              description="Sync Projects and Issues"
            />
            <Button type="secondary" size="small" style={{ marginTop: "10px" }}>Connect</Button>
          </Card>


          <Card bordered={true} hoverable={true} style={{ width: 300, marginTop: 16 }}
                onClick={() => this.props.onConnectorTypeSelected("github")} data-testid="github-card">
            <Meta
              avatar={
                <Avatar src="/images/third-party/GitHub-Mark-120px-plus.png" />
              }
              title="Github"
              description="Sync Repository Issues"
            />
            <Button type="secondary" size="small" style={{ marginTop: "10px" }}>Connect</Button>
          </Card>


          <Card bordered={true} hoverable={true} style={{ width: 300, marginTop: 16 }}
                onClick={() => this.props.onConnectorTypeSelected("pivotal")} data-testid="pivotal-tracker-card">
            <Meta
              avatar={
                <Avatar src="/images/third-party/Tracker_Icon.svg" />
              }
              title="Pivotal Tracker"
              description="Sync Projects and Stories"
            />
            <Button type="secondary" size="small" style={{ marginTop: "10px" }}>Connect</Button>
          </Card>


          <Card
            bordered={true}
            hoverable={true}
            style={{ width: 300, marginTop: 16 }}
            onClick={() => this.props.onConnectorTypeSelected("gitlab")}
            data-testid="gitlab-card"
          >
            <Meta
              avatar={<Avatar src="/images/third-party/gitlab-icon-rgb.svg" />}
              title="GitLab"
              description="Sync Projects and Issues"
            />
            <Button type="secondary" size="small" style={{ marginTop: "10px" }}>Connect</Button>
          </Card>


          <Card bordered={true} hoverable={true} style={{ width: 300, marginTop: 16 }}
                onClick={() => this.props.onConnectorTypeSelected("trello")} data-testid="trello-card">
            <Meta
              avatar={
                <Avatar src="/images/third-party/trello.png" />
              }
              title="Trello"
              description="Sync Boards and Cards"
            />
            <Button type="secondary" size="small" style={{ marginTop: "10px" }}>Connect</Button>
          </Card>

        </div>
      </div>

    )
  }
}