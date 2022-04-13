import React from "react";
import {Avatar, Card} from "antd";
import Button from "../../../../../components/uielements/button";
import styles from "./addRepositoryWorkflow.module.css";
import classNames from "classnames";
import fontStyles from "../../../../framework/styles/fonts.module.css";

const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {


  render() {
    return (
      <div className={styles.selectConnector}>
        <div className={classNames(fontStyles["font-normal"], fontStyles["text-sm"], styles["flex-center"], styles.subTitle)}>
          <p>Securely connect to Git repositories in your DevOps platform</p>
        </div>
        <div className={styles.selectConnectorCards}>
          
            
              <Card
                bordered={true}
                hoverable={true}
                style={{width: 300, marginTop: 16}}
                onClick={() => this.props.onConnectorTypeSelected("github")}
              >
                <Meta
                  avatar={<Avatar src="/images/third-party/GitHub-Mark-120px-plus.png" />}
                  title="Github"
                  description="Sync Commits & Pull Requests"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Connect</Button>
              </Card>
            

            
              <Card
                bordered={true}
                hoverable={true}
                style={{width: 300, marginTop: 16}}
                onClick={() => this.props.onConnectorTypeSelected("bitbucket")}
              >
                <Meta
                  avatar={<Avatar src="/images/third-party/bitbucket-mark-contained-gradient-neutral@2x.png" />}
                  title="Bit Bucket"
                  description="Sync Commits & Pull Requests"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Connect</Button>
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
                  description="Sync Commits & Merge Requests"
                />
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Connect</Button>
              </Card>

              <Card
                  bordered={true}
                  hoverable={true}
                  style={{width: 300, marginTop: 16}}
                  onClick={() => this.props.onConnectorTypeSelected("azure")}
                >
                  <Meta
                    avatar={<Avatar src="/images/third-party/AzureDevOps.png" />}
                    title="Azure DevOps"
                    description="Sync Commits & Pull Requests"
                  />
                  <Button type="secondary" size="small" style={{marginTop: "10px"}}>Connect</Button>
              </Card>
            
          
        </div>
        <div style={{marginTop: "30px"}}>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-xs"], styles.subTitle)}>
              <em>The security of your source code is important to us. Polaris only processes the git metadata that records changes being made to your source code.  It never scans your actual source files at any point.
                Each git repository is cloned and analyzed in an ephemeral container that is destroyed permanently along with any disk resources used,
              immediately after each analysis. Polaris only retains the analyzed metadata.
              </em>
            </p>
        </div>
      </div>
    );
  }
}