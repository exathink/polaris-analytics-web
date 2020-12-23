import React from 'react';


const JiraConnectorInstructions = ({part}) => (
  part === 'instructions' ?
    <div>
      <p>
        Polaris Flow provides the <b>Polaris Flow Connector for Jira, </b> an
        <em> Atlassian Connect </em> app that lets external applications connect securely
        with Atlassian products. There
        are two steps in connecting Polaris Flow to a Jira Server.
      </p>
      <h3>Step 1. Install the Polaris Flow Connector for Jira App on your Jira Server</h3>
      <p>
        You will need administrator privileges to do this.
      </p>


      <ol>
        <li>Login to your Jira instance as an adminstrator and navigate to Jira Settings -> Apps -> Manage Apps.
        </li>
        <li>
          Click on Settings in the Manage Apps view, and enable private listings <em>and</em> development mode
          checkboxes.
          This is needed while the Polaris Flow app
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
        <h3>Step 2. Register the Atlassian Connect App in Polaris Flow</h3>
        <p>
          This step registers the app you installed on the Jira Server in Step 1, with your Polaris Flow account and
          associates it with your current
          organization.
        </p>
      </div>
      : null
);

const BitbucketConnectorInstructions = ({part}) => (
  part === 'instructions' ?
    <div>
      <p>
        Polaris Flow provides the <b>Polaris Flow Connector for Bitbucket, </b> an
        <em> Atlassian Connect </em> app that lets external applications connect securely
        with Atlassian products. There
        are two steps in connecting Polaris Flow to a Jira Server.
      </p>
      <h3>Step 1. Install the Polaris Flow Connector for Bitbucket App in your Bitbucket Cloud account</h3>
      <p>
        You will need administrator privileges to do this.
      </p>


      <ol>
        <li>Login to your Bitbucket Cloud as an adminstrator and navigate to
          Profile -> Bitbucket Settings -> Apps and Features -> Installed Apps.
        </li>
        <li>
          You should see an 'Install app from URL' link. Click on this link
        </li>
        <li>Use <em>https://polaris-services.exathink.com/vcs/atlassian_connect/descriptor</em> for
          the
          url.
        </li>
        <li>
          Click upload and wait for the installation to complete successfully.
        </li>
        <li>
          Make a note of the <em>app key</em> of the Polaris Flow Connector for Bitbucket that you just installed. You may
          need to expand the entry for the app you installed in the Bitbucket UI to see this. You will need this app key in
          the next step, where we associate this installation of the Atlassian Connect App with your Polaris account and organization
        </li>
        <li>
          Click Next below to proceed to the final step in the installation.
        </li>
      </ol>
      <ul>
        <li>
          Note that you are free to install more than one Polaris Flow Connector for Bitbucket in the
          same Bitbucket Workspace provided <em>they are registered to connectors in separate organizations in Polaris</em>.
          </li>
        <li>
          If you install more than one Polaris Flow Connector for Bitbucket in the same Bitbucket Workspace, and attempt
          to register this under the same organization in Polaris, the next step in this process will fail,
          even if your installation on Bitbucket was successful.
        </li>
        <li>
          Note also, that removing an existing Polaris Flow Connector for Bitbucket on your Bitbucket Workspace
          will orphan any data you have imported under this connector in Polaris and make your Polaris connector inoperative.
          Contact our support line if you need to migrate your Polaris connector
          to a new installation of the Atlassian Connect App installed in the same workspace, while preserving existing historical
          data imported under a previous connector.
        </li>
      </ul>
    </div>
    :
    part === 'setup' ?
      <div>
        <h3>Step 2. Register the Atlassian Connect App in Polaris Flow</h3>
        <p>
          This step registers the app you installed on Bitbucket Cloud in Step 1, with your Polaris Flow account and
          associates it with your current
          organization. The <b>Atlassian Connect App Key</b> is the value you were asked to save in the previous step.
        </p>
      </div>
      : null
);

const GithubConnectorInstructions = ({part}) => (
  part === 'instructions' &&
  <div>
    <p>The Polaris Flow Github Connector uses the Github Rest API to import repository metadata and issues. Each connector
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
      The integration process is straightforward. You will need a personal access token to authenticate Polaris Flow
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
      The Pivotal Tracker Connector for Polaris Flow integrates with the Pivotal Tracker Rest API.
      API requests have to be authenticated with an API token for a specific Tracker user,
      on whose behalf the request is being made. You should use an API token for a user who has access to
      all the Tracker Projects that you wish to import in Polaris Flow.
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


const GitlabConnectorInstructions = ({part}) => (
  part === 'instructions' &&
  <div>
    <p>The Polaris Flow Gitlab Connector uses the Gitlab Rest API to import repository metadata and issues. Each connector
      is scoped
      to a specific Gitlab user.
    </p>
    <p>
      You will need a personal access token for the user to authenticate Polaris Flow
      with Gitlab. We recommend that you use a the personal access token for a user who is either an owner
      or a member of all the projects that you need to analyze in Polaris Flow.
    </p>

    <ol>
      <li>Login to Gitlab as the user specified above,</li>
      <li>Click on your user profile on the top right corner.</li>
      <li>Navigate to Settings -> Access Tokens</li>
      <li>Name your access token. We suggest "Polaris Flow Connector"</li>
      <li>Don't specify an expiry date. </li>
      <li>For scopes
        select <em>api</em>, <em>read:user</em> <em>read:repository</em>
      </li>
      <li>Create the access token</li>
      <li>
        Copy the personal access token displayed to the clipboard and enter it as the Personal access token in the next step.
      </li>
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
    case 'bitbucket':
      return (
        <BitbucketConnectorInstructions part={part}/>

      );
    case 'gitlab':
      return(
        <GitlabConnectorInstructions part={part}/>
      )
    default:
      return `Unknown connector type: ${connectorType}`;
  }
}
