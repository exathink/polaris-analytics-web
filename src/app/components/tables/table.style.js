import styled from 'styled-components';

const CompactStyle = ComponentName => styled(ComponentName)`
.ant-table {
  min-height: 40vh;
  .ant-table-content {
    .ant-table-body {
      .ant-table-thead tr th {
        padding: 7px;
      }
      .ant-table-tbody tr td {
        padding: 4px;
      }
      .ant-table-thead tr th,
      .ant-table-tbody tr td {
        white-space: nowrap;
        font-size: 11px;
        line-height: 13px;
        @media only screen and (min-width: 768px) {
          font-size: 12px;
          line-height: 14px;
        }
        @media only screen and (min-width: 992px) {
          font-size: 13px;
          line-height: 16px;
        }
        @media only screen and (min-width: 1200px) {
          font-size: 14px;
          line-height: 17px;
        }
        input {
          height: auto;
          padding: 4px;
          border-radius: 2px;
          font-size: 11px;
          @media only screen and (min-width: 768px) {
            font-size: 12px;
          }
          @media only screen and (min-width: 992px) {
            font-size: 13px;
          }
          @media only screen and (min-width: 1200px) {
            font-size: 14px;
          }
        }
      }
    }
  }
}

.ant-pagination {
  font-size: 11px;
  @media only screen and (min-width: 768px) {
    font-size: 12px;
  }
  @media only screen and (min-width: 992px) {
    font-size: 13px;
  }
  @media only screen and (min-width: 1200px) {
    font-size: 14px;
  }
}
`;

export {CompactStyle};
