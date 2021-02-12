import {Input, Checkbox, Table, Alert, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {getRowSelection, useMergeContributorsTableColumns, VERTICAL_SCROLL_HEIGHT} from "./utils";
import {useUpdateContributorForContributorAliases} from "./useUpdateContributor";
import {logGraphQlError} from "../../../components/graphql/utils";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

export function MergeContributorsPage({
  accountKey,
  context,
  intl,
  renderActionButtons,
  moveToFirstStep,
  selectedRecordsWithoutChildren,
  parentContributor, // parent contributor in which to merge other contributors
}) {
  const [excludeFromAnalysis, setExcludeFromAnalysis] = React.useState(false);

  const [parentContributorName, setParentContributorName] = React.useState(parentContributor.name);
  function handleParentContributorChange(e) {
    setParentContributorName(e.target.value);
  }

  // selection state for records without children
  const contributorsState = React.useState(selectedRecordsWithoutChildren);

  const [[errorMessage, setErrorMessage], [successMessage, setSuccessMessage]] = [
    React.useState(""),
    React.useState(""),
  ];

  // mutation to update contributor
  const [mutate, {loading, client}] = useUpdateContributorForContributorAliases({
    onCompleted: ({updateContributorForContributorAliases: {updateStatus}}) => {
      //  {success, contributorKey, message, exception}
      if (updateStatus.success) {
        setSuccessMessage("Updated Successfully.");
        client.resetStore();

        setTimeout(() => {
          // if successful navigate to select contributors page after 1 sec
          moveToFirstStep();
        }, 500);
      } else {
        logGraphQlError("MergeContributorsWorkflow.useUpdateContributorForContributorAliases", updateStatus.message);
        setErrorMessage(updateStatus.message);
      }
    },
    onError: (error) => {
      logGraphQlError("MergeContributorsWorkflow.useUpdateContributorForContributorAliases", error);
      setErrorMessage(error.message);
    },
  });

  const handleMergeContributorClick = () => {
    const updatedInfo = {
      contributorName: parentContributorName,
      excludedFromAnalysis: excludeFromAnalysis,
      contributorAliasKeys: contributorsState[0].map((x) => x.key),
    };

    // call mutation on save button click
    mutate({
      variables: {
        contributorKey: parentContributor.keyBackup,
        updatedInfo: updatedInfo,
      },
    });
  };

  const data = getTransformedData(selectedRecordsWithoutChildren);
  const columns = useMergeContributorsTableColumns();

  return (
    <div className={styles.mergeContributorsLandingPage}>
      <div className={styles.messageNotification}>
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon closable onClose={() => setErrorMessage("")} />
        )}
        {successMessage && (
          <Alert message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage("")} />
        )}
        {loading && (
          <Button className={"shiftRight"} type="primary" loading>
            Processing...
          </Button>
        )}
      </div>
      <div className={styles.parentContributor}>
        <div className={styles.contributor}>Contributor</div>
        <div className={styles.inputWrapper}>
          <Input value={parentContributorName} onChange={handleParentContributorChange} />
        </div>
      </div>
      <div className={styles.excludeFromAnalysisWrapper}>
        <div className={styles.excludeFromAnalysis}>Exclude From Analysis:</div>
        <div className={styles.excludeFromAnalysisCheckbox}>
          <Checkbox
            size="large"
            checked={excludeFromAnalysis}
            onChange={() => setExcludeFromAnalysis(!excludeFromAnalysis)}
          />
        </div>
        <div className={styles.excludeFromAnalysisSubtitle}>
          After merging, excluded contributors will not appear in Polaris metrics and are not billed
        </div>
      </div>
      <div
        className={styles.mergeContributorTitle}
      >{`Contributions from the ${contributorsState[0].length} contributors below will be merged into contributions from ${parentContributorName}`}</div>
      <div className={styles.mergeContributorTable}>
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          rowSelection={{...getRowSelection(data, contributorsState)}}
          pagination={false}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
        />
      </div>
      {renderActionButtons({
        isNextButtonDisabled: contributorsState[0].length === 0 || loading,
        actionButtonHandler: handleMergeContributorClick,
      })}
    </div>
  );
}
