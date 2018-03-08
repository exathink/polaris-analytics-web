export const DataSources = {
  project_summary: {
    name: 'project-summary',
    polaris_service_connection: {
      path: 'charts/project-summary',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        }
      ]
    },

  }
};

