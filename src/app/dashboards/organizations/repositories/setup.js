import React from "react";

import {Col, Row} from "antd";
import {ImportRepositoriesCard} from "../../../components/cards/importRepositoriesCard";

export const RepositoriesDashboardSetup = ({context}) => (
  <div className={'no-repositories'}>
    <div style={{padding: '30px'}}>
      <Row>
        <Col offset={6} span={12}>
          <h1>Connect your Version Control System</h1>
          <p>
            Connecting your version control system allows Urjuna to analyze the changes in the code that goes into your product.
            This analysis gives valuable insights into the day to day engineering practices on your team and connects code deliverables
            to product deliverables.
          </p>
          <p>
            You may import any number of Git repositories at a time from a supported provider. The import process is designed to efficiently
            extract and analyze the full commit history of each repository on initial import, and then keep the analysis updated automatically
            in real-time as new commits are made.
          </p>
          <p>
            Note: <em>Each git repository is cloned and analyzed in an ephemeral container that is destroyed permanently along with any disk resources used
            to persist copies of your source code, immediately after each analysis of a repository. Urjuna only retains the analyzed commit history and never makes copies
            of your source code other than when it is under active analysis.</em>
          </p>


        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col offset={9} span={6}>
          <ImportRepositoriesCard onClick={() => context.go('.', 'new')} compact={true}/>
        </Col>
      </Row>
    </div>

  </div>
);