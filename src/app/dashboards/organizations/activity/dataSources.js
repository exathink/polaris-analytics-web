export const DataSources = {
  activity_level_for_organization_by_project: {
    name: 'activity_level_for_organization_by_project',
    polaris_service_connection: {
      path: 'activity-level/organization/project',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        }
      ]
    },

  },
  activity_level_for_organization_by_repository: {
    name: 'activity_level_for_organization_by_repository',
    polaris_service_connection: {
      path: 'activity-level/organization/repository',
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
      path: 'activity-summary/organization',
      params: [
        {
          name: 'organization',
          url_part: 'path'
        }
      ]
    },

  }
};

