import React from 'react';


const JiraConnectorInstructions = ({part}) => (
  part === 'instructions' ?
    <div>
      <p>
        Polaris  provides the <b>Polaris Flow Connector for Jira, </b> an
        <em> Atlassian Connect </em> app that lets external applications connect securely
        with Atlassian products. There
        are two steps in connecting Polaris to a Jira Server.
      </p>
      <h3>Step 1. Install the Polaris Flow Connector for Jira App on your Jira Server</h3>
      <p>
        You will need administrator privileges to do this.
      </p>


      <ol>
        <li>Login to your Jira instance as an adminstrator and navigate to Jira Settings -> Apps -> Manage Apps -> Find New Apps.
          Alternatively if you are on a newer version of the Jira UI, you can also navigate to the Find New Apps view on the
          Atlassian Marketplace
          from the top level Apps menu.
        </li>
        <li>
          Search for "exathink" in the search menu. This will bring up the Polaris Flow Connector for Jira app.
        </li>
        <li>
          Click on the app icon and select "Get App" and wait for the installation to complete successfully.
        </li>
        <li>
          Click Next below to proceed to the final step in the installation.
        </li>
      </ol>
    </div>
    :
    part === 'setup' ?
      <div>
        <h3>Step 2. Register the Atlassian Connect App in Polaris </h3>
        <p>
          This step registers the app you installed on the Jira Server in Step 1, with your Polaris  account and
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
        Polaris provides the <b>Polaris Flow Connector for Bitbucket, </b> an
        <em> Atlassian Connect </em> app that lets external applications connect securely with Atlassian products. There
        are two steps in connecting Polaris  to repositories in Bitbucket Cloud.
      </p>
      <h3>Step 1. Install the Polaris Flow Connector for Bitbucket App in your Bitbucket Cloud account</h3>
      <p>You will need administrator privileges to do this.</p>

      <ol>
        <li>
          Login to your Bitbucket Cloud account as an administrator and navigate to the workspace that contains the
          repositories you want to connect to Polaris. This may be either your personal user workspace or a team workspace.
        </li>
        <li>
          Navigate to "Settings -> Marketplace. Search for the Polaris Flow Connector for Bitbucket app
          under the category "Integration". Click "Add" to install the app. You will need to grant the permissions
          requested for the installation to succeed.
        </li>
        <li>
          Before moving to the next step, make a note of one of the following values. You will need it to identify the workspace where
          you installed the app in the next step of the connector setup.
          <ul>
            <li>If you installed the app in a Team workspace, then you need to make note of the workspace id which
            can be found at "Settings -> General Settings -> Workspace ID" for the Workspace.
            </li>
            <li>
              If you installed the app in your personal workspace, then you need to make a note of your users <em>display name </em>
              ( <b>not</b> the workspace id or username ). This can be found from "Profile -> Personal Settings -> Name".
            </li>
          </ul>

        </li>
        <li>Click Next below to proceed to the final step in the installation.</li>
      </ol>
    </div>
  ) : part === "setup" ? (
    <div>
      <h3>Step 2. Register the Atlassian Connect App in Polaris </h3>
      <p>
        This step registers the app you installed on the Jira Server in Step 1, with your Polaris  account and
        associates it with your current organization. In this step you can give the connector a name, and also provide the
        information to look up the Bitbucket Cloud workspace in which you installed the Atlassian Connect App.
      </p>
    </div>
  ) : null;

const GithubConnectorInstructions = ({part}) => (
  part === 'instructions' &&
  <div>
    <p>The Polaris  Github Connector uses the Github Rest API to import repository metadata and issues. Each connector
      is scoped
      to a specific Github Organization. You must create separate connectors for each Github organization that you
      are
      connecting to.
    </p>
    <p>
      If you use Github for version control as well as for issue tracking for an organization, the same connector can be
      used
      in repository and project import workflows.
    </p>
    <p>
      The integration process is straightforward. You will need a personal access token to authenticate Polaris 
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
      The Pivotal Tracker Connector for Polaris  integrates with the Pivotal Tracker Rest API.
      API requests have to be authenticated with an API token for a specific Tracker user,
      on whose behalf the request is being made. You should use an API token for a user who has access to
      all the Tracker Projects that you wish to import in Polaris .
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


const GitlabConnectorInstructions = ({part}) =>
  part === "instructions" && (
    <div>
      <p>
        The Polaris Gitlab Connector uses the Gitlab Rest API to import repository metadata and issues. Each connector
        is scoped to a specific Gitlab user.
      </p>
      <p>
        You will need a personal access token for the user to authenticate Polaris with Gitlab. We recommend that you
        use a bot account with member level access to all the projects that you need to analyze in Polaris. If you use
        an actual user account, please create a separate access token for Polaris.
      </p>


      <ol>
        <li>Login to Gitlab as the user specified above,</li>
        <li>Click on your user profile on the top right corner.</li>
        <li>Navigate to Settings -> Access Tokens</li>
        <li>Name your access token. We suggest "Polaris Connector"</li>
        <li>Don't specify an expiry date.</li>
        <li>
          For scopes select <em>api</em>, <em>read:user</em> <em>read:repository</em>
        </li>
        <li>Create the access token</li>
        <li>
          Copy the personal access token displayed to the clipboard and enter it as the Personal access token in the
          next step.
        </li>
      </ol>

      <p>
        <em>
          Note: Polaris does not currently support scoping a connector using Gitlab Groups. All the repos accessible via
          this token will be available to Polaris under the same connector scope.
        </em>
      </p>
    </div>
  );

const TrelloConnectorInstructions = ({part}) =>
  part === "instructions" && (
    <div>
      <p>
        The Polaris  Trello Connector uses the Trello Rest API to import boards metadata and cards. Each connector
        is scoped to a specific Trello user.
      </p>
      <p>
        You will need an api key and access token for the user to authenticate Polaris  with Trello. We recommend
        that you use the api key and access token for a user who is either an owner or a member of all the projects that
        you need to analyze in Polaris .
      </p>

      <ol>
        <li>Login to Trello as the user specified above,</li>
        <li>
          Visit <cite className="urlText">https://trello.com/app-key</cite> to get your API key. You  may keep it handy to use in next step and later to create connector.
        </li>
        <li>
        Generate a read only access token visiting the below URL. Make sure to replace &lt;APIKey&gt; with the key copied in step 1. 
        This link will generate a read only access token, which will be used by this connector.<br/>

          <cite className="urlText">
            https://trello.com/1/authorize?expiration=never&amp;name=Polaris&amp;scope=read&amp;response_type=token&amp;key=&lt;APIKey&gt;
          </cite>
        </li>
        <li>
        Keep both API Key and Access Token generated in steps 2 and 3 ready to be provided on next page.
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
    case 'trello':
      return(
        <TrelloConnectorInstructions part={part}/>
      )
    default:
      return `Unknown connector type: ${connectorType}`;
  }
}
