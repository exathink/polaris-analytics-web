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
            delivery process. Rather than mapping projects one to one with those in your work tracking system
            we recommend that you model the primary customer facing product lines delivered by this organization
            as Urjuna Projects.
          </p>
          <p>
            A single Urjuna project may be mapped to <em>one or more</em> remote projects in your work tracking system. We will
            provide aggregate metrics across these remote projects at the Urjuna project level, as well as allow you drill down into each of the
            sub-projects in detail. This gives you consolidated visibility across product work streams in a manner
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