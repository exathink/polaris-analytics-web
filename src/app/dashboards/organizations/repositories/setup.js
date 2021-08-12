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
          <h1 className={fontStyles["text-2xl"]}>Connect your Version Control System</h1>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            Connecting your version control system allows Polaris Flow to analyze the changes in the code that goes into your product.
            This analysis gives valuable insights into the day to day engineering practices on your team and connects code deliverables
            to product deliverables.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            You may import any number of Git repositories at a time from a supported provider. The import process is designed to efficiently
            extract and analyze the full commit history of each repository on initial import, and then keep the analysis updated automatically
            in real-time as new commits are made.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            Note: <em>Each git repository is cloned and analyzed in an ephemeral container that is destroyed permanently along with any disk resources used
            to persist copies of your source code, immediately after each analysis of a repository. Polaris Flow only retains the analyzed commit history and never makes copies
            of your source code other than when it is under active analysis.</em>
          </p>


        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col offset={9} span={6}>
          <Button type={"primary"} size={"large"} onClick={() => context.go('.', 'new')}>Import Repositories</Button>
        </Col>
      </Row>
    </div>

  </div>
);