import React from "react";
import {DashboardWidget} from "../../../framework/viz/dashboard";
import {PlusOutlined} from "@ant-design/icons";
import {Button, Table} from "antd";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {injectIntl} from "react-intl";
import {formatDateTime} from "../../../i18n/utils";
import {logGraphQlError} from "../../../components/graphql/utils";
import {Loading} from "../../../components/graphql/loading";
import {useQueryContributorAliasesInfo} from "./useQueryContributorAliasesInfo";
import styles from "./contributors.module.css";

function getTableColumns() {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      width: "40%",
      key: "latestCommit",
    },
    {
      title: "Aliases",
      dataIndex: "alias_count",
      width: "20%",
      key: "alias_count",
      align: "center",
      sorter: (a, b) => a.alias_count - b.alias_count,
      defaultSortOrder: "descend",
    },
  ];
}

function getTransformedData(data, intl) {
  if (data == null) {
    return [];
  }

  return data["account"]["contributors"]["edges"]
    .map((edge) => edge.node)
    .map((node) => {
      if (node.contributorAliasesInfo) {
        if (node.contributorAliasesInfo.length > 1) {
          return {
            ...node,
            latestCommit: formatDateTime(intl, node.latestCommit),
            alias_count: node.contributorAliasesInfo.length - 1,
          };
        } else {
          const {
            contributorAliasesInfo: [{alias}],
            ...remainingNode
          } = node;
          return {...remainingNode, latestCommit: formatDateTime(intl, node.latestCommit), alias, alias_count: 0};
        }
      }
      return {...node, latestCommit: formatDateTime(intl, node.latestCommit)};
    });
}

function AccountContributorsTable({accountKey, intl, view}) {
  const {loading, error, data} = useQueryContributorAliasesInfo({
    accountKey: accountKey,
    commitWithinDays: 60,
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    logGraphQlError("MergeContributorsTopLevelWidget.useQueryContributorAliasesInfo", error);
    return null;
  }

  const contributorsData = getTransformedData(data, intl);
  const columns = getTableColumns();
  return (
    <div className={styles.accountContributorsTableWrapper}>
      <Table
        size="middle"
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
          defaultPageSize: view === "detail" ? 10 : 5,
        }}
        dataSource={contributorsData}
        showSorterTooltip={false}
      />
    </div>
  );
}

export const AccountContributorsTableWidget = withNavigationContext(
  withViewerContext(
    injectIntl(({viewerContext: {accountKey}, context, intl, w, name, ...rest}) => {
      return (
        <DashboardWidget
          name={name}
          w={w}
          title="Contributors"
          controls={[
            () => (
              <Button
                type="primary"
                size="middle"
                onClick={() => context.go(".", "merge-contributors")}
                className={styles.mergeContributorAction}
              >
                <PlusOutlined /> {`Merge Contributors`}
              </Button>
            ),
          ]}
          render={({view}) => <AccountContributorsTable accountKey={accountKey} intl={intl} view={view} />}
          showDetail={true}
          {...rest}
        />
      );
    })
  )
);
