import React from "react";

import {Col, Row} from "antd";
import Button from "../../../../components/uielements/button";
import styles from "./projects.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";

export const ProjectsDashboardSetup = ({context}) => (
  <div className={'no-projects'}>
    <div style={{padding: '30px'}}>
      <Row>
        <Col offset={6} span={12} className={styles.textCenter}>
          <h1 className={fontStyles["text-2xl"]}>Connect your Projects</h1>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            A project in your work tracking system maps to a <em>Work Stream</em> in Polaris.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            A <em>Project</em> in Polaris aggregates metrics across one or more work streams.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            You connect remote projects as workstreams in Polaris  <em> Polaris Connector</em>.
          </p>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col offset={9} span={6} className={styles.textCenter}>
          <Button type={'primary'} size={"large"} onClick={() => context.go('.', 'new')} compact={true}>Connect Remote Projects</Button>
        </Col>
      </Row>
    </div>

  </div>
);