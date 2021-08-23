import React from "react";
import {DashboardWidget} from "../../../framework/viz/dashboard";
import {PlusOutlined} from "@ant-design/icons";
import {Table} from "antd";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {injectIntl} from "react-intl";
import {formatDateTime} from "../../../i18n/utils";
import {logGraphQlError} from "../../../components/graphql/utils";
import {Loading} from "../../../components/graphql/loading";
import {useQueryContributorAliasesInfo} from "../../../dashboards/shared/widgets/contributors/manageAliases/useQueryContributorAliasesInfo";
import styles from "../../../dashboards/shared/widgets/contributors/manageAliases/contributors.module.css";
import {getAccountContributorsTableColumns, ACTIVE_WITHIN_DAYS} from "../../../dashboards/shared/widgets/contributors/manageAliases/utils";
import Button from "../../../../components/uielements/button";

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

function AccountContributorsTable({dimension, instanceKey, intl, view}) {
  const {loading, error, data} = useQueryContributorAliasesInfo({
    dimension,
    instanceKey,
    commitWithinDays: ACTIVE_WITHIN_DAYS,
  });

  if (loading) {
    return <Loading />;
  }
  if (error) {
    logGraphQlError("MergeContributorsTopLevelWidget.useQueryContributorAliasesInfo", error);
    return null;
  }

  const contributorsData = getTransformedData(data, intl);
  const columns = getAccountContributorsTableColumns();
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
          subtitle={`Last ${ACTIVE_WITHIN_DAYS} days`}
          controls={[
            () => (
              <Button
                type="primary"
                size="middle"
                onClick={() => context.go(".", "manage-contributors")}
                className={styles.manageContributorsAction}
              >
                <PlusOutlined /> {`Manage Contributors`}
              </Button>
            ),
          ]}
          render={({view}) => <AccountContributorsTable dimension="account" instanceKey={accountKey} intl={intl} view={view} />}
          showDetail={true}
          {...rest}
        />
      );
    })
  )
);
