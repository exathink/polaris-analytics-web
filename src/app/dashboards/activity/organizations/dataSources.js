export const DataSources = {
  organization_projects_activity_summary: {
    name: 'organizations/activity-summary-by-project',
    polaris_service_connection: {
      path: 'organizations/activity-summary-by-project',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        }
      ]
    },

  },
  organization_activity_summary: {
    name: 'organizations/activity-summary',
    polaris_service_connection: {
      path: 'organizations/activity-summary',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        }
      ]
    },

  }
};

