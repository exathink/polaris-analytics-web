
import React from "react";

import {Table} from "antd";

import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {withAntPagination} from "../../../components/graphql/withAntPagination";
import {EditUserForm} from "./editUserForm";
import { useQueryAccountUsers } from "./accountUsersQuery";
import { useUpdateUser } from "./editUserMutation";
import { logGraphQlError } from "../../../components/graphql/utils";

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

      // mutation to update user
      const [mutate, {loading: mutationLoading, client}] = useUpdateUser({
        onCompleted: ({updateContributor: {updateStatus}}) => {
          //  {success, contributorKey, message, exception}
          if (updateStatus.success) {
            // dispatch({type: actionTypes.UPDATE_SUCCESS_MESSAGE, payload: "Updated Successfully."});
            client.resetStore();
            // dispatch({type: actionTypes.UPDATE_TIMEOUT_EXECUTING, payload: true});
          } else {
            logGraphQlError("AccountUsersPaginatedTable.useUpdateUser", updateStatus.message);
            // dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: updateStatus.message});
          }
        },
        onError: (error) => {
          logGraphQlError("AccountUsersPaginatedTable.useUpdateUser", error);
          // dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: error.message});
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
        const orgRoles = values["organizationRoles"].map(o => ({orgKey: o.organizationKey, role: values[o.organizationKey]}))
        const updatedInfo = {
          accountKey: viewer.accountKey,
          key: values.key,
          accountRole: values.role === true ? "owner" : "member",
          active: values.active,
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