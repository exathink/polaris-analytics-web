
import React from "react";

import {Table} from "antd";

import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {withAntPagination} from "../../../components/graphql/withAntPagination";
import {EditUserForm} from "./editUserForm";
import { useQueryAccountUsers } from "./accountUsersQuery";

const {Column} = Table;

const AccountUsersPaginatedTable = ({
  view,
  viewerContext: {viewer},
  paging,
  pageSize,
  currentCursor,
  onNewPage,
  newData,
}) => {
      const {error, loading, data} = useQueryAccountUsers({
        pageSize,
        currentCursor,
        accountKey: viewer.accountKey,
        newData,
      });

      if (error) return null;
      let tableData = [];
      let totalItems = 0;
      if (!loading) {
        tableData = data.account.users.edges.map((edge) => edge.node);
        totalItems = data.account.users.count;
      }
      return (
        <Table
          dataSource={tableData}
          size="middle"
          loading={loading}
          rowKey={(record) => record.id}
          pagination={{
            total: totalItems,
            defaultPageSize: pageSize,
            hideOnSinglePage: true,
          }}
          onChange={onNewPage}
        >
          <Column title={"Name"} dataIndex={"name"} key={"name"} />
          <Column title={"Email"} dataIndex={"email"} key={"email"} />
          <Column title={"Role"} dataIndex={"role"} key={"role"} />
          {view === "detail" && (
            <Column
              title={""}
              dataIndex={""}
              key={"edit"}
              width="5%"
              render={(value, record) => {
                return (
                  <EditUserForm
                    onSubmit={(values) => {
                      console.log({values});
                    }}
                    initialValues={{
                      email: record.email,
                      firstName: record.firstName,
                      lastName: record.lastName,
                      role: record.role==="owner",
                      organizationRoles: record.organizationRoles,
                      ...record.organizationRoles.reduce((acc, item) => {
                        acc[item.organizationKey] = item.organizationRole;
                        return acc;
                      }, {}),
                    }}
                  />
                );
              }}
            />
          )}
        </Table>
      );
}


export const AccountUsersTableWidget = withViewerContext(withAntPagination(AccountUsersPaginatedTable), ['account-owner'])