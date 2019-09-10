import React from "react";

import {Col, Row} from "antd";
import Button from "../../../../components/uielements/button";

export const ProjectsDashboardSetup = ({context}) => (
  <div className={'no-projects'}>
    <div style={{padding: '30px'}}>
      <Row>
        <Col offset={6} span={12}>
          <h1>Connect your Work Tracking System</h1>
          <p>
            Connecting your work tracking system allows Urjuna to analyze your product
            delivery process. A <em>Project</em> in Urjuna should model a single customer facing product or product line delivered
            by this organization. A single Urjuna project may be mapped to <em>one or more</em> remote projects in your work tracking system.
          </p>
          <p>
            The Urjuna project will aggregate metrics across its remote sub-projects, and also allow you drill down into each of the
            sub-projects in further detail.
          </p>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col offset={9} span={6}>
          <Button type={'primary'} size={"large"} onClick={() => context.go('.', 'new')} compact={true}>Import Projects</Button>
        </Col>
      </Row>
    </div>

  </div>
);