import React from "react";
import {Table} from "antd";
import {DaysRangeSlider, THREE_MONTHS} from "../../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";
import {useSearch} from "../../../components/tables/hooks";
import {useQueryContributorAliasesInfo} from "./useQueryContributorAliasesInfo";
import {diff_in_dates} from "../../../helpers/utility";
import {formatDateTime} from "../../../i18n/utils";
import {Statistic} from "../../../components/misc/statistic/statistic";
import styles from "./contributors.module.css";
import {useOnlyRunOnUpdate} from "../../../helpers/hooksUtil";
import {logGraphQlError} from "../../../components/graphql/utils";

const VERTICAL_SCROLL_HEIGHT = "50vh";

function hasChildren(recordKey, data) {
  const record = data.get(recordKey);
  return record != null ? record.contributorAliasesInfo != null : false;
}

function useTableColumns() {
  const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
      width: "25%",
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      ...aliasSearchState,
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      width: "17%",
      key: "latestCommit",
      sorter: (a, b) => diff_in_dates(a.latestCommit, b.latestCommit),
    },
    {
      title: "Total Commits",
      dataIndex: "commitCount",
      width: "17%",
      key: "commitCount",
      align: "center",
      sorter: (a, b) => a.commitCount - b.commitCount,
    },
    {
      title: "Aliases",
      dataIndex: "alias_count",
      width: "16%",
      key: "alias_count",
      align: "center",
      sorter: (a, b) => a.alias_count - b.alias_count,
      defaultSortOrder: "ascend",
    },
  ];
  return columns;
}

function getTransformedData(data, intl) {
  if (data == null) {
    return new Map([]);
  }

  const kvArr = data["account"]["contributors"]["edges"]
    .map((edge) => edge.node)
    .map((node) => {
      if (node.contributorAliasesInfo) {
        if (node.contributorAliasesInfo.length > 1) {
          return {
            ...node,
            key: node.id, // as top level contributor's key is same as one of its children, we are keeping contributor's id as key for top level
            latestCommit: formatDateTime(intl, node.latestCommit),
            alias_count: node.contributorAliasesInfo.length - 1,
            alias: "",
            contributorAliasesInfo: node.contributorAliasesInfo.map((alias) => ({
              ...alias,
              latestCommit: formatDateTime(intl, alias.latestCommit),
              parent: node.key, // adding parent property to all children
            })),
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
    })
    .map((node) => [node.key, node]);
  return new Map(kvArr);
}

function getOnlySelectedRecordWithChildren(selectedRecords) {
  const recordsWithChildren = selectedRecords.filter((s) => s.contributorAliasesInfo != null);

  if (recordsWithChildren.length === 1) {
    return recordsWithChildren[0];
  }

  return null;
}

export function SelectContributorsPage({accountKey, intl, selectedContributorsState, renderActionButtons}) {
  const [commitWithinDays, setCommitWithinDays] = React.useState(60);
  const [selectedRecords, setSelectedRecords] = selectedContributorsState;
  const columns = useTableColumns();

  const {loading, error, data, previousData} = useQueryContributorAliasesInfo({
    accountKey: accountKey,
    commitWithinDays: commitWithinDays,
  });

  useOnlyRunOnUpdate(() => {
    // clear selected records whenever days range change.
    setSelectedRecords([]);
  }, [commitWithinDays]);

  if (error) {
    logGraphQlError("SelectContributorsPage.useQueryContributorAliasesInfo", error);
    return null;
  }

  // transform api response to Map of contributors
  const contributorsData = getTransformedData(data || previousData, intl);

  const rowSelection = (data) => ({
    hideSelectAll: true,
    selectedRowKeys: selectedRecords.map((s) => s.key),
    onSelect: (_record, _selected, selectedRows) => {
      setSelectedRecords(selectedRows.map((x) => data.get(x.key)));
    },
    getCheckboxProps: (record) => {
      const onlySelectedRecordWithChildren = getOnlySelectedRecordWithChildren(selectedRecords);
      if (onlySelectedRecordWithChildren != null) {
        if (hasChildren(record.key, data)) {
          return {
            disabled: record.key !== onlySelectedRecordWithChildren.key, // disable other records(except selected record with children) with children
            name: record.name,
          };
        }
      }

      return {
        disabled: record.parent != null, // disable all children records
        name: record.name,
      };
    },
  });

  function isNextButtonDisabled() {
    if (selectedRecords.length === 1) {
      const [{key}] = selectedRecords;
      const selectedRecord = contributorsData.get(key);
      // if only selected record has children
      if (selectedRecord && selectedRecord.contributorAliasesInfo != null) {
        return false;
      }
    }
    if (selectedRecords.length > 1) {
      return false;
    }

    return true;
  }

  return (
    <div className={styles.selectContributorsLandingPage}>
      {renderActionButtons(isNextButtonDisabled())}
      <div className={styles.selectContributorsSlider}>
        <div>Active Within</div>
        <div className={styles.rangeSliderWrapper}>
          <DaysRangeSlider
            title=""
            initialDays={commitWithinDays}
            setDaysRange={setCommitWithinDays}
            range={THREE_MONTHS}
          />
        </div>
        <div>Days</div>
        <div className={styles.activeContributors}>
          <Statistic title="Active Contributors" value={contributorsData.size} precision={0} />
        </div>
      </div>
      <div className={styles.userMessage}>Select one or more contributors to merge into a single contributor</div>
      <div className={styles.selectContributorsTableWrapper}>
        <Table
          loading={loading}
          size="middle"
          childrenColumnName="contributorAliasesInfo"
          pagination={false}
          columns={columns}
          rowSelection={{...rowSelection(contributorsData)}}
          dataSource={[...contributorsData.values()]}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
        />
      </div>
    </div>
  );
}
