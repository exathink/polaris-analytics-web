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
      title: "Alias Count",
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

const MergeContributorsTopLevelTableWidget = withViewerContext(
  injectIntl(({viewerContext: {accountKey}, intl}) => {

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
      <Table
        size="middle"
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
        }}
        dataSource={contributorsData}
        showSorterTooltip={false}
      />
    );
  })
);

export const MergeContributorsWidget = withNavigationContext(({w, name, context}) => {
  return (
    <DashboardWidget
      name={name}
      w={w}
      title="Contributors"
      controls={[
        () => (
          <Button type="primary" onClick={() => context.go(".", "merge-contributors")}>
            <PlusOutlined /> {`Merge Contributors`}
          </Button>
        ),
      ]}
      render={() => <MergeContributorsTopLevelTableWidget />}
      showDetail={true}
    />
  );
});
