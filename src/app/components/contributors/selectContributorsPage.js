import React from "react";
import {Table, Button} from "antd";
import {
  DaysRangeSlider,
  ONE_YEAR,
} from "../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";
import {useQueryContributorAliasesInfo} from "./useQueryContributorAliasesInfo";
import {useSelectContributorsTableColumns, getRowSelection, VERTICAL_SCROLL_HEIGHT, withChildren, NavigateOnDoneHandlers} from "./utils";
import {formatDateTime} from "../../i18n/utils";
import {Statistic} from "../misc/statistic/statistic";
import styles from "./contributors.module.css";
import {logGraphQlError} from "../graphql/utils";
import {actionTypes} from "./constants";

function hasChildren(recordKey, data) {
  const record = data.get(recordKey);
  return record != null ? record.contributorAliasesInfo != null : false;
}

function getOnlySelectedRecordWithChildren(selectedRecords) {
  const recordsWithChildren = selectedRecords.filter(withChildren);

  if (recordsWithChildren.length === 1) {
    return recordsWithChildren[0];
  }

  return null;
}

function getTransformedData(data, dimension, intl) {
  if (data == null) {
    return new Map([]);
  }

  const kvArr = data[dimension]["contributors"]["edges"]
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
          return {
            ...remainingNode,
            latestCommit: formatDateTime(intl, node.latestCommit),
            alias,
            alias_count: 0,
            keyBackup: node.key,
          };
        }
      }
      return {...node, latestCommit: formatDateTime(intl, node.latestCommit), keyBackup: node.key};
    })
    .map((node) => [node.key, node]);
  return new Map(kvArr);
}

export function SelectContributorsPage({
  dimension,
  instanceKey,
  context,
  intl,
  commitWithinDays,
  current,
  selectedRecords,
  dispatch,
}) {
  const columns = useSelectContributorsTableColumns();

  const {loading, error, data, previousData} = useQueryContributorAliasesInfo({
    dimension,
    instanceKey,
    commitWithinDays: commitWithinDays,
  });

  if (error) {
    logGraphQlError("SelectContributorsPage.useQueryContributorAliasesInfo", error);
    return null;
  }

  // transform api response to Map of contributors
  const contributorsData = getTransformedData(data || previousData, dimension, intl);

  const handleNextClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current + 1});
  };

  const handleDoneClick = () => {
    NavigateOnDoneHandlers(context)[dimension]();
  };

  function renderActionButtons() {
    const nextButtonDisabled = selectedRecords.length === 0;

    return (
      <>
        <div className={styles.selectContributorsNextAction}>
          <Button
            type="primary"
            style={nextButtonDisabled ? {} : {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            className={styles.contributorsButton}
            onClick={handleNextClick}
            disabled={nextButtonDisabled}
          >
            Next
          </Button>
        </div>
        <div className={styles.selectContributorsDoneAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </>
    );
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

  const setCommitWithinDays = (days) => {
    dispatch({type: actionTypes.UPDATE_DAYS, payload: days});
  };
  const setSelectedRecords = (records) => {
    dispatch({type: actionTypes.UPDATE_SELECTED_RECORDS, payload: records});
  };

  function getTitle() {
    if (contributorsData.size === 0) {
      return null;
    }

    return "Select one or more contributors to merge into a single contributor"
  }
  
  return (
    <div className={styles.selectContributorsLandingPage}>
      {renderActionButtons()}
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
        <div className={styles.activeContributors} data-testid="active-contributors">
          <Statistic title="Active Contributors" value={contributorsData.size} precision={0} />
        </div>
      </div>
      <div className={styles.userMessage}>{getTitle()}</div>
      <div className={styles.selectContributorsTableWrapper}>
        <Table
          loading={loading}
          size="small"
          childrenColumnName="contributorAliasesInfo"
          pagination={false}
          columns={columns}
          rowSelection={{
            ...getRowSelection(contributorsData, [selectedRecords, setSelectedRecords], {getCheckboxProps}),
          }}
          dataSource={[...contributorsData.values()]}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
          data-testid="select-contributors-table"
        />
      </div>
    </div>
  );
}
