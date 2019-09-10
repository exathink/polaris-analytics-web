import React from 'react';


const JiraConnectorInstructions = ({part}) => (
  part === 'instructions' ?
    <div>
      <p>
        Urjuna provides the <b>Urjuna Connector for Jira, </b> an
        <em> Atlassian Connect </em> app that lets external applications connect securely
        with Atlassian products. There
        are two steps in connecting Urjuna to a Jira Server.
      </p>
      <h3>Step 1. Install the Urjuna Connector for Jira App on your Jira Server</h3>
      <p>
        You will need administrator privileges to do this.
      </p>


      <ol>
        <li>Login to your Jira instance as an adminstrator and navigate to Jira Settings -> Apps -> Manage Apps.
        </li>
        <li>
          Click on Settings in the Manage Apps view, and enable private listings <em>and</em> development mode
          checkboxes.
          This is needed while the Urjuna app
          is in private beta. Once the app is released on the Atlassian Marketplace this step will not be needed.
          You should see an 'Upload App' link (you may need to refresh your page to see this link).
        </li>
        <li>Click on the 'Upload App' link</li>
        <li>Use <em>https://polaris-services.exathink.com/work-tracking/atlassian_connect/descriptor</em> for
          the
          url.
        </li>
        <li>
          Click upload and wait for the installation to complete successfully.
        </li>
        <li>
          Click Next below to proceed to the final step in the installation.
        </li>
      </ol>
    </div>
    :
    part === 'setup' ?
      <div>
        <h3>Step 2. Register the Atlassian Connect App in Urjuna</h3>
        <p>
          This step registers the app you installed on the Jira Server in Step 1, with your Urjuna account and associates it with your current
          organization.
        </p>
      </div>
      : null
);

const GithubConnectorInstructions = ({part}) => (
  part === 'instructions' &&
    <div>
      <p>The Urjuna Github Connector uses the Github Rest API to import repository metadata and issues. Each connector
        is scoped
        to a specific Github Organization and you must create separate connectors for each Github organization that you
        are
        connecting to.
      </p>
      <p>
        If you use Github for version control as well as for issue tracking for an organization, the same connector can be
        used
        in repository and project import workflows.
      </p>
      <p>
        The integration process is straightforward. You will need a personal access token to authenticate Urjuna
        with Github.
      </p>

      <ol>
        <li>Login to Github as the user who is a member of the Github organization above.</li>
        <li>Click on your user profile on the top right corner.</li>
        <li>Navigate to Settings -> Developer Settings -> Personal Access Tokens</li>
        <li>Create a new personal access token for the connector. For scopes
          select <em>read:org</em>, <em>read:user</em> and <em>repo</em>.
        </li>
        <li>Copy the personal access token and enter it as the OAuth access token in the next step.
        </li>
      </ol>
    </div>
);

const PivotalConnectorInstructions = ({part}) => (
  part === 'instructions' &&
  <div>
    <p>
      The Pivotal Tracker Connector for Urjuna integrates with the Pivotal Tracker Rest API.
      API requests have to be authenticated with an API token for a specific Tracker user,
      on whose behalf the request is being made. You should use an API token for a user who has access to
      all the Tracker Projects that you wish to import in Urjuna.
    </p>

     The API key can be retrieved as follows.
    <ol>
      <li>Login to Pivotal Tracker as the user whose API key you want to use.</li>
      <li>Click on your user profile on the top right corner and select Profile.</li>
      <li>Scroll to the bottom of the page where you will find an API Token section.</li>
      <li>Copy the API token and enter it in the next step.</li>
    </ol>

  </div>
);

export const CreateConnectorInstructions = ({part, connectorType}) => {
  switch (connectorType) {
    case 'jira':
      return (
        <JiraConnectorInstructions part={part}/>
      );

    case 'github':
      return (
        <GithubConnectorInstructions part={part}/>
      );
    case 'pivotal':
      return (
        <PivotalConnectorInstructions part={part}/>

      );
    default:
      return `Unknown connector type: ${connectorType}`;
  }
}
