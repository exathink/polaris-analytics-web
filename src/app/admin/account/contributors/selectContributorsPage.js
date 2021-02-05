import React from "react";
import {Table} from "antd";
import {DaysRangeSlider, THREE_MONTHS} from "../../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";
import {useSearch} from "../../../components/tables/hooks";
import {useQueryContributorAliasesInfo} from "./useQueryContributorAliasesInfo";
import {Loading} from "../../../components/graphql/loading";
import {diff_in_dates} from "../../../helpers/utility";
import {formatDateTime} from "../../../i18n/utils";
import {injectIntl} from "react-intl";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import styles from "./contributors.module.css";

function hasChildren(recordKey, data) {
  const record = data.find((x) => x.key === recordKey);
  return record != null ? record.contributorAliasesInfo != null : false;
}

function useTableColumns() {
  const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
      width: "30%",
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      ...aliasSearchState,
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      width: "20%",
      key: "latestCommit",
      sorter: (a, b) => diff_in_dates(a.latestCommit, b.latestCommit),
    },
    {
      title: "Total Commits",
      dataIndex: "commitCount",
      width: "20%",
      key: "commitCount",
      sorter: (a, b) => a.commitCount - b.commitCount,
    },
  ];
  return columns;
}

function getTransformedData(data, intl) {
  return data["account"]["contributors"]["edges"]
    .map((edge) => edge.node)
    .map((node) => {
      if (node.contributorAliasesInfo) {
        if (node.contributorAliasesInfo.length > 1) {
          const {alias} = node.contributorAliasesInfo.find((x) => x.key === node.key);
          return {
            ...node,
            latestCommit: formatDateTime(intl, node.latestCommit),
            alias,
            contributorAliasesInfo: node.contributorAliasesInfo
              .filter((x) => x.key !== node.key)
              .map((alias) => ({...alias, latestCommit: formatDateTime(intl, alias.latestCommit), parent: node.key})), // adding parent property to all children
          };
        } else {
          const {
            contributorAliasesInfo: [{alias}],
            ...remainingNode
          } = node;
          return {...remainingNode, latestCommit: formatDateTime(intl, node.latestCommit), alias};
        }
      }
      return {...node, latestCommit: formatDateTime(intl, node.latestCommit)};
    });
}

function SelectContributorsPage({viewerContext: {accountKey}, intl, selectedContributorsState, renderActionButtons}) {
  const [commitWithinDays, setCommitWithinDays] = React.useState(60);
  const [selectedRecords, setSelectedRecords] = selectedContributorsState;
  const columns = useTableColumns();

  const {loading, error, data} = useQueryContributorAliasesInfo({
    accountKey: accountKey,
    commitWithinDays: commitWithinDays,
  });

  if (error) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  // transform api response to array of contributors
  const contributorsData = getTransformedData(data, intl);

  const rowSelection = {
    selectedRowKeys: selectedRecords,
    onSelect: (_record, _selected, selectedRows) => {
      setSelectedRecords(selectedRows.map((x) => x.key));
    },
    getCheckboxProps: (record) => {
      if (selectedRecords.length === 1) {
        const [key] = selectedRecords;
        const selectedRecord = contributorsData.find((x) => x.key === key);

        if (selectedRecord.contributorAliasesInfo != null && hasChildren(record.key, contributorsData)) {
          return {
            disabled: record.key !== selectedRecord.key, // disable other records(except selected record with children) with children
            name: record.name,
          };
        }
      }

      if (selectedRecords.length === 2) {
        return {
          disabled: selectedRecords.includes(record.key) === false,
          name: record.name,
        };
      }

      return {
        disabled: record.parent != null, // disable all children records
        name: record.name,
      };
    },
  };

  function isNextButtonDisabled() {
    if (selectedRecords.length === 1) {
      const [key] = selectedRecords;
      const selectedRecord = contributorsData.find((x) => x.key === key);
      // if only selected record has children
      if (selectedRecord.contributorAliasesInfo != null) {
        return false;
      }
    }
    if (selectedRecords.length === 2) {
      return false;
    }

    return true;
  }

  return (
    <div className={styles.selectContributorsLandingPage}>
      {renderActionButtons(isNextButtonDisabled())}
      <div className={styles.selectContributorsSlider}>
        <div>Latest Contribution</div>
        <div className={styles.rangeSliderWrapper}>
          <DaysRangeSlider
            title=""
            initialDays={commitWithinDays}
            setDaysRange={setCommitWithinDays}
            range={THREE_MONTHS}
          />
        </div>
        <div>Days Ago</div>
      </div>
      <div className={styles.selectContributorsTableWrapper}>
        <Table
          childrenColumnName="contributorAliasesInfo"
          pagination={false}
          columns={columns}
          rowSelection={{...rowSelection}}
          dataSource={contributorsData}
        />
      </div>
    </div>
  );
}

export default withViewerContext(injectIntl(SelectContributorsPage));
