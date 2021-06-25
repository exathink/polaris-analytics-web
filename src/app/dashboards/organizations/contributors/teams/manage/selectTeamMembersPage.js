import React from "react";
import {Button} from "antd";
import {DaysRangeSlider, ONE_YEAR} from "../../../../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./teams.module.css";
import {actionTypes} from "./constants";
import {useQueryOrganizationContributors} from "./useQueryOrganizationContributors";
import {getRowSelection, SelectTeamMembersTable, useSelectTeamMembersColumns} from "./selectTeamMembersTable";
import {Statistic} from "../../../../../components/misc/statistic/statistic";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {formatDateTime} from "../../../../../i18n/utils";

function getTransformedData(data, intl) {
  if (data == null) {
    return new Map([]);
  }

  const kvArr = data["organization"]["contributors"]["edges"]
    .map((edge) => edge.node)
    .map((node) => {
      return {
        ...node,
        latestCommit: formatDateTime(intl, node.latestCommit),
      };
    })
    .map((node) => [node.key, node]);
  return new Map(kvArr);
}

export function SelectTeamMembersPage({
  organizationKey,
  context,
  intl,
  commitWithinDays,
  current,
  selectedRecords,
  dispatch,
}) {
  const columns = useSelectTeamMembersColumns();

  const {loading, error, data, previousData} = useQueryOrganizationContributors({
    organizationKey: organizationKey,
    commitWithinDays: commitWithinDays,
  });

  if (error) {
    logGraphQlError("SelectTeamMembersPage.useQueryOrganizationContributors", error);
    return null;
  }

  // transform api response to Map of contributors
  const teamsData = getTransformedData(data || previousData, intl);

  const handleNextClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current + 1});
  };

  const handleDoneClick = () => {
    context.go("..", "contributors");
  };

  function renderActionButtons() {
    const nextButtonDisabled = selectedRecords.length === 0;

    return (
      <>
        <div className={styles.selectTeamMembersNextAction}>
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
        <div className={styles.selectTeamMembersDoneAction}>
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

  const setCommitWithinDays = (days) => {
    dispatch({type: actionTypes.UPDATE_DAYS, payload: days});
  };
  const setSelectedRecords = (records) => {
    dispatch({type: actionTypes.UPDATE_SELECTED_RECORDS, payload: records});
  };

  function getTitle() {
    if (teamsData.size === 0) {
      return null;
    }

    return "Select one or more contributors to add to a new or existing team.";
  }

  function getCheckboxProps(record) {
    return {
      disabled: false,
      name: record.name,
    };
  }

  return (
    <div className={styles.selectTeamMembersPage}>
      {renderActionButtons()}
      <div className={styles.selectTeamMembersSlider}>
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
          <Statistic title="Active Contributors" value={teamsData.size} precision={0} />
        </div>
      </div>
      <div className={styles.userMessage}><span>{getTitle()}</span></div>
      <div className={styles.selectTeamMembersTableWrapper}>
        <SelectTeamMembersTable
          tableData={[...teamsData.values()]}
          columns={columns}
          loading={loading}
          testId="select-team-members-table"
          rowSelection={{
            ...getRowSelection(teamsData, [selectedRecords, setSelectedRecords], {getCheckboxProps}),
          }}
        />
      </div>
    </div>
  );
}
