export const DataSources = {
  organization_projects_activity_summary: {
    name: 'organization-projects-activity-summary',
    polaris_service_connection: {
      path: 'organization-projects-activity-summary',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        }
      ]
    },

  },
  account_organizations_activity_summary: {
    name: 'account-organizations-activity-summary',
    polaris_service_connection: {
      path: 'account-organizations-activity-summary',
      params: [
      ]
    },

  }
};

