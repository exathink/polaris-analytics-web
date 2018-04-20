export const DataSources = {
  project_repositories_activity_summary: {
    name: 'projects/activity-summary-by-repository',
    polaris_service_connection: {
      path: 'projects/activity-summary-by-repository',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        },
        {
          name: 'project',
          url_part: 'path'
        }
      ]
    },

  },
  project_activity_summary: {
    name: 'projects/activity-summary',
    polaris_service_connection: {
      path: 'projects/activity-summary',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        },
        {
          name: 'project',
          url_part: 'path'
        }
      ]
    },

  }
};

