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

const BitbucketConnectorInstructions = ({part}) =>
  part === "instructions" ? (
    <div>
      <p>
        Polaris Flow provides the <b>Polaris Flow Connector for Bitbucket, </b> an
        <em> Atlassian Connect </em> app that lets external applications connect securely with Atlassian products. There
        are two steps in connecting Polaris Flow to repositories in Bitbucket Cloud.
      </p>
      <h3>Step 1. Install the Polaris Flow Connector for Bitbucket App in your Bitbucket Cloud account</h3>
      <p>You will need administrator privileges to do this.</p>

      <ol>
        <li>
          Login to your Bitbucket Cloud account as an administrator and navigate to the workspace that contains the
          repositories you want to connect to Polaris. This may be either your personal user workspace or a team workspace.
        </li>
        <li>
          Navigate to "Settings -> Installed Apps to see a list of the currently installed Atlassian Connect Apps.
        </li>
        <li>
          Click the "Enable Development Mode" checkbox. This step is necessary while the Polaris application is in
          Private Beta. Once we have released the Polaris Connector through the Atlassian Marketplace this app will be
          installed just like any other Atlassian Connect App. You should see an 'Install app from URL' link. Click on
          this link
        </li>
        <li>
          Use <em>https://polaris-services.exathink.com/vcs/atlassian_connect/descriptor</em> for the url.
        </li>
        <li>
          Click upload and wait for the installation to complete successfully. You will need to grant the permissions
          that the install ask you to give for the installation to succeed.
        </li>
        <li>
          For the next step we need to give Polaris some information about the workspace in which this Atlassian Connect
          App is installed.
          <ul>
            <li>If you installed the app in a Team workspace, then you need to make note of the workspace id which
            can be found at "Settings -> General Settings -> Workspace ID" for the Workspace.
            </li>
            <li>
              If you installed the app in your personal workspace, then you need to provide your users <em>display name </em>
              ( <b>not</b> the workspace id or username ). This can be found from "Profile -> Personal Settings -> Name".
            </li>
          </ul>

        </li>
        <li>Click Next below to proceed to the final step in the installation.</li>
      </ol>
    </div>
  ) : part === "setup" ? (
    <div>
      <h3>Step 2. Register the Atlassian Connect App in Polaris Flow</h3>
      <p>
        This step registers the app you installed on the Jira Server in Step 1, with your Polaris Flow account and
        associates it with your current organization. In this step you can give the connector a name, and also provide the
        information to look up the Bitbucket Cloud workspace in which you installed the Atlassian Connect App.
      </p>
    </div>
  ) : null;

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
