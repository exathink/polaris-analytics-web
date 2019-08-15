import React from "react";

import {Col, Row} from "antd";
import {ImportProjectsCard} from "../../../components/cards/importProjectCard";

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
            The Urjuna project will aggregate metrics across its remote sub-projects, as well as allow you drill down into each of the
            sub-projects in further detail. This gives you consolidated visibility across product work streams in a manner
            that aligns with the way your products are delivered to customers, while also getting granular visibility into
            execution work streams in your work tracking system.
          </p>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col offset={9} span={6}>
          <ImportProjectsCard onClick={() => context.go('.', 'new')} compact={true}/>
        </Col>
      </Row>
    </div>

  </div>
);