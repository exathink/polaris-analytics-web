import React from 'react';
import {Col, Row, Collapse} from "antd";
import {ImportRepositoriesCard} from "../../cards/importRepositoriesCard";

const {Panel} = Collapse;


const InstructionsWrapper = ({initial, children}) => (
  <div className={'create-connector-instructions'}>
    <Collapse>
      <Panel key={'instructions'} header={'Instructions'}>
        <Row>
          <Col span={12}>
            {children}
          </Col>
        </Row>
      </Panel>
    </Collapse>
  </div>
);

const JiraConnectorInstructions = () => (
  <div>
    <h3>Create a Jira Cloud Connector</h3>
    <p>
      Urjuna provides an <a href="https://marketplace.atlassian.com/addons/app/jira" target={"_blank"}>Atlassian
      Connect</a> app for integrating with Jira Cloud. There are two steps in configuring this integration.
    </p>

    First, create an Urjuna Connector to the Jira instance.
    <ol>
      <li>Click the "Create Jira Connector" button above.</li>
      <li>Provide an name for the connector and the URL to the Jira instance that you are connecting to and click
        "Register".
      </li>
      <li>Your should now see your new connector in the table above, in the <em>awaiting_install</em> state.</li>
    </ol>
    <p>
      At this point a Connector to your Jira instance has been registered in Urjuna, but it has not yet been
      authorized to connect to that instance. To do this, you must install the Urjuna Atlassian Connect app as an add-on
      on
      your
      Jira instance. The app is not yet publicly available via the Atlassian marketplace while Urjuna is in private
      beta, but it
      can be privately installed from your Jira
      Cloud instance.You will need administrative privileges on the Jira instance to complete this step.</p>
    <ol>
      <li>Login to your Jira instance as an adminstrator and navigate to Jira Settings -> Apps -> Manage Apps.
      </li>
      <li>Click on the 'Upload App' link</li>
      <li>Use <em>https://polaris-services.exathink.com/work-tracking/atlassian_connect/descriptor</em> for
        the
        url
      </li>
      <li>Click upload and wait for the installation to complete.</li>
    </ol>

    If the installation is successful, the state of the connector in the table above should change
    to <em>enabled</em> after a few minutes.
    Your connector is now ready to use. Click "Select" to move to the next step and begin importing your projects.
  </div>
);

const GithubConnectorInstructions = () => (
  <div>
    <h3>Create a Github Connector</h3>
    <p>The Urjuna Github Connector uses the Github Rest API to import repository issues and commit data. Each connector
      is scoped
      to specific Github Organization and you must create separate connectors for each Github organization that you are
      connecting to.
    </p>
    <p>
      Github connectors for an organization can be used to import issues as well as repository and commit data. So any
      connectors you
      create will be available to use in both work tracking and version control system import workflows.
    </p>
    <p>
      The integration process is straightforward.
    </p>
    <ol>
      <li>Click the "Create Github Connector" button above.</li>
      <li>Provide a name for the connector and the Github organization you wish to connect to. We recommend using the
        Github organization name as the connector name.
      </li>
      <li>
        Provide the OAuth access token.
        <ol>
          <li>Login to Github as the user who is a member of the Github organization above.</li>
          <li>Click on your user profile on the top right corner.</li>
          <li>Navigate to Settings -> Developer Settings -> Personal Access Tokens</li>
          <li>Create a new personal access token for the connector. For scopes
            select <em>read:org</em>, <em>read:user</em> and <em>repo</em>.
          </li>
          <li>Copy the personal access token an enter it is a the OAuth access token in Create Connector form and click
            "Register".
          </li>
        </ol>
      </li>
      The new connector should display in the connectors table and its state should be <em>enabled</em>. Click "Select"
      to proceed to the next step.
    </ol>

    <p>Note 1: You may use the same personal access token across multiple connectors provided it has access to the
      Github organization it is connecting to.
      You may delete the personal access token at any time to revoke access to all connectors that use the given token.
    </p>
    <p>
      Note 2: For work tracking integration purposes, each Github repository that contains issues is considered a remote
      project. We recommend grouping
      the repositories where you maintain issues for a given product or product line and importing them as sub-projects
      of a single Urjuna Project that models this
      product or product line.
    </p>

  </div>
);

const PivotalConnectorInstructions = () => (
  <div>
    <h3>Create a Pivotal Tracker Connector</h3>
    <p>
      The Pivotal Tracker Connector for Urjuna integrates with the Pivotal Tracker Rest API.
      API requests have to be authenticated with credentials for a specific Tracker user,
      on whose behalf the request is being made. You should use an API token for a user who has access to
      all the Tracker Projects that you wish to import in Urjuna.
    </p>
    <p>
      The integration process is straightforward.
    </p>
    <ol>
      <li>Click the "Create Pivotal Tracker Connector" button.</li>
      <li>Provide a name for the connector.</li>
      <li>
        Provide the API Key
        <ol>
          <li>Login to Pivotal Tracker as the user whose API key you want to use.</li>
          <li>Click on your user profile on the top right corner and select Profile.</li>
          <li>Scroll to the bottom of the page where you will find an API Token section.</li>
          <li>Copy the API token and enter it as the API Key in the form, and click "Register".</li>
        </ol>
      </li>
      The new connector should display in the connectors table and its state should be <em>enabled</em>.

      Click "Select" to proceed to the next step and import Projects and Stories.
    </ol>

  </div>
);

export const CreateConnectorInstructions = ({initial, connectorType}) => {
  switch (connectorType) {
    case 'jira':
      return (
        <InstructionsWrapper initial={initial}>
          <JiraConnectorInstructions/>
        </InstructionsWrapper>
      );

    case 'github':
      return (
        <InstructionsWrapper>
          <GithubConnectorInstructions/>
        </InstructionsWrapper>
      );
    case 'pivotal':
      return (
        <InstructionsWrapper>
          <PivotalConnectorInstructions/>
        </InstructionsWrapper>
      );
    default:
      return `Unknown connector type: ${connectorType}`;
  }
}



