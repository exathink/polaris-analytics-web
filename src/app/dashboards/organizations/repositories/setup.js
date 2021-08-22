import React from "react";

import {Col, Row} from "antd";
import Button from "../../../../components/uielements/button";
import styles from "./repository.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";

export const RepositoriesDashboardSetup = ({context}) => (
  <div className={'no-repositories'}>
    <div style={{padding: '30px'}}>
      <Row>
        <Col offset={6} span={12} className={styles.textCenter}>
          <h1 className={fontStyles["text-2xl"]}>Connect your Git Repositories</h1>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            Connecting your Git repositories lets Polaris maps stories, tasks, and bugs in your work tracking system to the
            code changes needed to implement them in real time.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            You may import any number of Git repositories at a time from a supported provider and you can mix and match repositories from
            different providers. Imported repositories are scoped to organizations and can be shared across values streams in an organization.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            The import process is designed to efficiently
            extract and analyze the full commit history of each repository on initial import, and then keep things in sync
            in real-time as new commits are made.
          </p>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col offset={9} span={6} className={styles.textCenter}>
          <Button type={"primary"} size={"large"} onClick={() => context.go('.', 'new')}>Import Repositories</Button>
        </Col>
      </Row>
      <Row>
         <Col offset={6} span={12} className={styles.textCenter} style={{paddingTop: "30px"}}>
           <p className={classNames(fontStyles["font-normal"], fontStyles["text-sm"])}>
              <em>The security of your source code is important to us. Polaris only processes the git metadata that records changes being made to your source code.  It never scans your actual source files at any point.
                Each git repository is cloned and analyzed in an ephemeral container that is destroyed permanently along with any disk resources used
              immediately after each analysis. Polaris only retains the analyzed metadata.
              </em>
            </p>
         </Col>
      </Row>

    </div>

  </div>
);