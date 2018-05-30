export const DataSources = {
  project_repositories_activity_summary: {
    name: 'projects/activity-summary-by-repository',
    polaris_service_connection: {
      path: 'activity-level/project/repository',
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
      path: 'activity-summary/project',
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

