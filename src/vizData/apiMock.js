

export class ApiMock {

  constructor(polarisChartServiceConnection) {
    this.service = polarisChartServiceConnection;
    this.serviceMocks = {}
  }

  fetchData(dataSource, {mock, ...params}) {
    let mockData = null;
    if (mock) {
      let mockDataSource = this.serviceMocks[dataSource.name];
      if ( mockDataSource ) {
        mockData = mockDataSource.fetchData(dataSource, params)
      }
    }
    return mockData || this.service.fetchData(dataSource, params);
  }

  registerMockDataSource(dataSource, mockDataSource) {
    this.serviceMocks[dataSource.name] = mockDataSource
  }

}

