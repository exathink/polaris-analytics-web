import React from "react";
import {Table} from "antd";
import {
  DaysRangeSlider,
  ONE_YEAR,
} from "../../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";
import {useQueryContributorAliasesInfo} from "./useQueryContributorAliasesInfo";
import {useSelectContributorsTableColumns, getRowSelection, VERTICAL_SCROLL_HEIGHT} from "./utils";
import {formatDateTime} from "../../../i18n/utils";
import {Statistic} from "../../../components/misc/statistic/statistic";
import styles from "./contributors.module.css";
import {useOnlyRunOnUpdate} from "../../../helpers/hooksUtil";
import {logGraphQlError} from "../../../components/graphql/utils";


function hasChildren(recordKey, data) {
  const record = data.get(recordKey);
  return record != null ? record.contributorAliasesInfo != null : false;
}

function getOnlySelectedRecordWithChildren(selectedRecords) {
  const recordsWithChildren = selectedRecords.filter((s) => s.contributorAliasesInfo != null);

  if (recordsWithChildren.length === 1) {
    return recordsWithChildren[0];
  }

  return null;
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
            keyBackup: node.key, // keeping key for backup for later use
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
          return {...remainingNode, latestCommit: formatDateTime(intl, node.latestCommit), alias, alias_count: 0, keyBackup: node.key};
        }
      }
      return {...node, latestCommit: formatDateTime(intl, node.latestCommit), keyBackup: node.key};
    })
    .map((node) => [node.key, node]);
  return new Map(kvArr);
}

export function SelectContributorsPage({accountKey, intl, sliderState, selectContributorsState, renderActionButtons}) {
  const [commitWithinDays, setCommitWithinDays] = sliderState;
  const [selectedRecords, setSelectedRecords] = selectContributorsState;
  const columns = useSelectContributorsTableColumns();

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

  function isNextButtonDisabled() {
    return selectedRecords.length === 0;
  }

  function getCheckboxProps(record) {
    const onlySelectedRecordWithChildren = getOnlySelectedRecordWithChildren(selectedRecords);
    if (onlySelectedRecordWithChildren != null) {
      if (hasChildren(record.key, contributorsData)) {
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
  }

  return (
    <div className={styles.selectContributorsLandingPage}>
      {renderActionButtons({isNextButtonDisabled: isNextButtonDisabled()})}
      <div className={styles.selectContributorsSlider}>
        <div>Active Within</div>
        <div className={styles.rangeSliderWrapper}>
          <DaysRangeSlider
            title=""
            initialDays={commitWithinDays}
            setDaysRange={setCommitWithinDays}
            range={ONE_YEAR}
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
          size="small"
          childrenColumnName="contributorAliasesInfo"
          pagination={false}
          columns={columns}
          rowSelection={{...getRowSelection(contributorsData, selectContributorsState, {getCheckboxProps})}}
          dataSource={[...contributorsData.values()]}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
        />
      </div>
    </div>
  );
}
