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
          <h1 className={fontStyles["text-2xl"]}>Connect your Work Tracking System</h1>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            Connecting your work tracking system allows Polaris Flow to analyze your product
            delivery process. A <em>Value Stream</em> in Polaris Flow should model a single customer facing product or product line delivered
            by this organization. A single Value Stream may be mapped to <em>one or more</em> remote projects in your work tracking system.
            Each such remote project is called a <em>Work Stream</em> in Polaris.
          </p>
          <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
            A Polaris Flow Value Stream will aggregate metrics across work streams, and also allow you
            to drill down into the details for the work streams.
          </p>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col offset={9} span={6}>
          <Button type={'primary'} size={"large"} onClick={() => context.go('.', 'new')} compact={true}>Connect Remote Projects</Button>
        </Col>
      </Row>
    </div>

  </div>
);