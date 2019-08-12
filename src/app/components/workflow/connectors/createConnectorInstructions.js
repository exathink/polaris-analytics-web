import React from 'react';


const JiraConnectorInstructions = () => (
  <div className={'create-connector-instructions'}>
    <p>

    </p>
  </div>
);

const GithubConnectorInstructions = () => (
  <div className={'create-connector-instructions'}>
    <p>

    </p>
  </div>
);

const PivotalConnectorInstructions = () => (
  <div className={'create-connector-instructions'}>
    <p>

    </p>
  </div>
);

export  const CreateConnectorInstructions = ({connectorType}) => {
  switch(connectorType) {
    case 'jira':
      return <JiraConnectorInstructions/>;
    case 'github':
      return <GithubConnectorInstructions/>;
    case 'pivotal':
      return <PivotalConnectorInstructions/>
    default:
      return `Unknown connector type: ${connectorType}`;
  }
}



