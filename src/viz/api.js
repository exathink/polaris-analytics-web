import {getSessionKey} from "../utils";

class PolarisServiceConnection {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  buildPathExtension(dataSourceName, config, params) {
    const param_values = config.params.filter((param) => (param.url_part === 'path'))
      .map((param) => {
        const value = params[param.name];
        if (value != null) {
          return value;
        } else {
          throw new Error(`Cannot connect to service: Required parameter ${param.name} was not provided for data source ${dataSourceName}`);
        }
      });
    return param_values.join('/');
  }

  buildUrl(dataSource, params) {
    const config = dataSource.polaris_service_connection;
    if (config) {
      let url = `${this.endpoint}/${config.path}/`;
      if (config.params != null) {
        const path_extension = this.buildPathExtension(dataSource.name, config, params);
        if (path_extension != null) {
          url = `${url}${path_extension}/`;
        }
      }
      return url;
    } else {
      throw new Error(`Cannot connect to service: Datasource ${dataSource.name} does not specify 
      config for polaris_service_connection.`);
    }
  }

  async fetchData(dataSource, params) {
    const session_key = getSessionKey();
    if (session_key) {
      const response = await fetch(this.buildUrl(dataSource, params), {
        headers: {'X-XSRF-TOKEN': session_key}
      });
      return await response.json();
    } else {
      throw new Error('Cannot connect to service: No session key');
    }
  }
}
export const polarisChartsService = new PolarisServiceConnection("http://polaris-services.exathink.localdev:8200/charts");