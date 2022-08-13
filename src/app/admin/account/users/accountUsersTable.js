
import React from "react";

import {Table} from "antd";

import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {withAntPagination} from "../../../components/graphql/withAntPagination";
import {EditUserForm} from "./editUserForm";
import { useQueryAccountUsers } from "./accountUsersQuery";
import { useUpdateUser } from "./editUserMutation";
import { logGraphQlError } from "../../../components/graphql/utils";
import { openNotification } from "../../../helpers/utility";

const {Column} = Table;

function notify(data) {
  if (data != null && data.updateUser) {
    if(data.updateUser.updated) {
     openNotification('success', `User ${data.updateUser.user.name} was updated`)
    }
  }
}

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

      // mutation to update user
      const [mutate, {client}] = useUpdateUser({
        onCompleted: (data) => {
          if (data.updateUser.updated) {
            notify(data)
            client.resetStore();
          } else {
            logGraphQlError("AccountUsersPaginatedTable.useUpdateUser", " ");
          }
        },
        onError: (error) => {
          logGraphQlError("AccountUsersPaginatedTable.useUpdateUser", error);
        },
      });

      if (error) return null;
      let tableData = [];
      let totalItems = 0;
      if (!loading) {
        tableData = data.account.users.edges.map((edge) => edge.node);
        totalItems = data.account.users.count;
      }

      function handleSubmit(values) {
        console.log({values});
        const orgRoles = values["organizationRoles"].map((o) => ({
          orgKey: o.scopeKey,
          role: values[o.scopeKey] === true ? "owner" : "member",
        }));
        const updatedInfo = {
          accountKey: viewer.accountKey,
          key: values.key,
          accountRole: values.role === true ? "owner" : "member",
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          organizationRoles: orgRoles,
        };
        
        // call mutation on save button click
        mutate({
          variables: {
            updateUserInput: updatedInfo
          },
        }).then((_) => {
          values.onClose();
        });
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
                    onSubmit={(values) => handleSubmit({...values, key: record.key, organizationRoles: record.organizationRoles})}
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