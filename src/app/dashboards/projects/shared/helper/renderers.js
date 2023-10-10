import {Tag} from "antd";
import React from "react";
import {Highlighter} from "../../../../components/misc/highlighter";
import {truncateString, useBlurClass} from "../../../../helpers/utility";
import {PullRequestStateTypeColor, WorkItemStateTypeColor} from "../../../shared/config";
import styles from "./renderers.module.css";

// import issueType icons
import epic from "../../../../../image/issueType/epic.svg";
import story from "../../../../../image/issueType/story.svg";
import bug from "../../../../../image/issueType/bug.svg";
import task from "../../../../../image/issueType/task.svg";
import subtask from "../../../../../image/issueType/subtask.svg";
import {QuestionCircleOutlined} from "@ant-design/icons";
import classNames from "classnames";

const issueTypeImagePaths = {
  epic: epic,
  story: story,
  task: task,
  subtask: subtask,
  bug: bug,
};

export const workItemTypeImageMap = {
  epic: <img src={issueTypeImagePaths.epic} alt="#" style={{width: "16px", height: "16px"}} />,
  story: <img src={issueTypeImagePaths.story} alt="#" style={{width: "16px", height: "16px"}} />,
  task: <img src={issueTypeImagePaths.task} alt="#" style={{width: "16px", height: "16px"}} />,
  subtask: <img src={issueTypeImagePaths.subtask} alt="#" style={{width: "16px", height: "16px"}} />,
  bug: <img src={issueTypeImagePaths.bug} alt="#" style={{width: "16px", height: "16px"}} />,
  Uncategorized: <QuestionCircleOutlined />,
};

export function getStateTypeIcon(stateType, size = "16px") {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: WorkItemStateTypeColor[stateType ?? "unmapped"],
        borderRadius: "0.2rem",
        marginRight: "0.5rem",
      }}
    ></div>
  );
}

export function getPullRequestStateTypeIcon(stateType, size = "16px") {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: PullRequestStateTypeColor[stateType ?? "unmapped"],
        borderRadius: "0.2rem",
        marginRight: "0.5rem",
      }}
    ></div>
  );
}

// setPlacement is optional property when we need to specify the position of cardInspector
export function comboColumnTitleRender({setShowPanel, setWorkItemKey, setPlacement, search, ...rest}) {
  return (text, record, searchText) =>
    {
      searchText = search===false ? undefined : searchText;
      return (
        text && (
          <div
            onClick={() => {
              setPlacement?.("top");
              setShowPanel(true);
              setWorkItemKey(record.workItemKey || record.key);
            }}
            className={styles.comboCardCol}
          >
            <div className={styles.workItemType}>
              {workItemTypeImageMap[record.workItemType] ?? record.workItemType}
            </div>
            <div className={classNames(styles.title, rest.blurClass)}>
              {searchText ? (
                <Highlighter
                  highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                  searchWords={searchText || ""}
                  textToHighlight={text}
                />
              ) : (
                truncateString(text, 38, "#6b7280")
              )}
            </div>
            <div className={styles.displayId}>
              <Highlighter
                highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                searchWords={searchText || ""}
                textToHighlight={record.displayId}
              />
              {record.epicName && (
                <Tag color="#108ee9" style={{marginLeft: "30px"}}>
                  {searchText ? (
                    <Highlighter
                      highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                      searchWords={searchText || ""}
                      textToHighlight={record.epicName || ""}
                    />
                  ) : (
                    truncateString(record.epicName, 25, "#108ee9")
                  )}
                </Tag>
              )}
            </div>
          </div>
        )
      );
    }
}

export function CardCol(params) {
  const blurClass = useBlurClass();
  const record = params.data;
  return (
    <div className="tw-flex tw-items-center tw-gap-2 tw-py-2">
      <div className="">{workItemTypeImageMap[record.workItemType] ?? record.workItemType}</div>
      <div className="tw-flex tw-flex-col tw-items-start">
        <div className={classNames("tw-leading-6", blurClass)}>{truncateString(record.name, 38, "#6b7280")}</div>
        <div className={classNames("tw-flex tw-items-center tw-leading-6", blurClass)}>
          <div className="tw-text-xs tw-font-semibold">{record.displayId}</div>
          {record.epicName && (
            <Tag color="#108ee9" style={{marginLeft: "30px"}}>
              {truncateString(record.epicName, 25, "#108ee9")}
            </Tag>
          )}
        </div>
      </div>
    </div>
  );
}

export function StateTypeCol(params) {
  const record = params.data;
  return (
    <div className="tw-grid tw-cursor-pointer tw-grid-cols-[25px,auto] tw-items-center tw-gap-1">
      <div className={record.timeInStateDisplay ? "tw-row-span-2 tw-self-center tw-leading-6" : "tw-self-center tw-leading-6"}>
        {getStateTypeIcon(record.stateTypeInternal)}
      </div>
      <div className="tw-font-medium tw-lowercase tw-text-gray-300 tw-leading-6">{record.state}</div>
      {record.timeInStateDisplay && (
        <div className="tw-text-xs tw-font-normal tw-text-gray-300 tw-leading-6">entered {record.timeInStateDisplay}</div>
      )}
    </div>
  );
}

const IssueTypeMapping = {
  story: {name: "Story", icon: workItemTypeImageMap.story},
  task: {name: "Task", icon: workItemTypeImageMap.task},
  bug: {name: "Bug", icon: workItemTypeImageMap.bug},
  subtask: {name: "Sub Task", icon: workItemTypeImageMap.subtask},
}

export function IssueTypeCol(params) {
  const issueType = params.value;

  return (
    <span>
      {IssueTypeMapping[issueType]?.icon ?? issueType} {IssueTypeMapping[issueType]?.name ?? ""}
    </span>
  );
}

export function ComboCardTitleColumn({record}) {
  const blurClass = useBlurClass();
  return (
    <div className={styles.comboCardCol} style={{marginLeft: "16px", columnGap: "1rem"}}>
      <div className={styles.workItemType}>
        <img src={issueTypeImagePaths[record.workItemType]} alt="#" style={{width: "32px", height: "32px"}} />
      </div>
      <div className={classNames(styles.titleXl, blurClass)}>{truncateString(record.name, 100, "#6b7280")}</div>
      <div className={styles.textBase}>
        {record.displayId}{" "}
        {record.epicName && (
          <Tag color="#108ee9" style={{marginLeft: "30px", fontSize: "14px"}}>
            {truncateString(record.epicName, 80, "#108ee9")}
          </Tag>
        )}
      </div>
    </div>
  );
}

export function ComboCardStateTypeColumn({record}) {
  return (
    <div
      className="tw-grid tw-cursor-pointer tw-grid-cols-[25px,auto] tw-items-center tw-gap-1"
      style={{marginLeft: "16px", columnGap: "1rem"}}
    >
      <div className={record.timeInStateDisplay ? "tw-row-span-2 tw-self-center" : "tw-self-center"}>
        {getStateTypeIcon(record.stateType, "28px")}
      </div>
      <div className="tw-text-base tw-font-medium tw-lowercase tw-text-gray-300">{record.state}</div>
      {record.timeInStateDisplay && (
        <div className="tw-text-xs tw-font-normal tw-text-gray-300">entered {record.timeInStateDisplay}</div>
      )}
    </div>
  );
}

export function comboColumnStateTypeRender(setShowPanel, setWorkItemKey, setPlacement) {
  return (text, record, searchText) =>
    text && (
      <div
        onClick={() => {
          setPlacement?.("top");
          setShowPanel(true);
          setWorkItemKey(record.workItemKey || record.key);
        }}
        className="tw-grid tw-cursor-pointer tw-grid-cols-[25px,auto] tw-items-center tw-gap-1"
      >
        <div className={record.timeInStateDisplay ? "tw-row-span-2 tw-self-center" : "tw-self-center"}>
          {getStateTypeIcon(record.stateTypeInternal)}
        </div>
        <div className="tw-font-medium tw-lowercase tw-text-gray-300">{text}</div>
        {record.timeInStateDisplay && (
          <div className="tw-text-xs tw-font-normal tw-text-gray-300">entered {record.timeInStateDisplay}</div>
        )}
      </div>
    );
}

export function customColumnRender({
  setShowPanel,
  setWorkItemKey,
  setPlacement,
  colRender = (text) => text,
  className,
}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
          setPlacement?.("top");
          setShowPanel(true);
          setWorkItemKey(record.workItemKey || record.key);
        }}
        style={{cursor: "pointer"}}
        className={className}
      >
        {colRender(text, record)}
      </span>
    );
}
