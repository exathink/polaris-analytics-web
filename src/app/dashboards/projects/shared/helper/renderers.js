import {Tag} from "antd";
import React from "react";
import {Highlighter} from "../../../../components/misc/highlighter";
import {truncateString} from "../../../../helpers/utility";
import {WorkItemStateTypeColor} from "../../../shared/config";
import styles from "./renderers.module.css";

// import issueType icons
import epic from "../../../../../image/issueType/epic.svg";
import story from "../../../../../image/issueType/story.svg";
import bug from "../../../../../image/issueType/bug.svg";
import task from "../../../../../image/issueType/task.svg";
import subtask from "../../../../../image/issueType/subtask.svg";
import {QuestionCircleOutlined} from "@ant-design/icons";

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
  Uncategorized:<QuestionCircleOutlined />
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

// setPlacement is optional property when we need to specify the position of cardInspector
export function comboColumnTitleRender(setShowPanel, setWorkItemKey, setPlacement) {
  return (text, record, searchText) =>
    text && (
      <div
        onClick={() => {
          setPlacement?.("top");
          setShowPanel(true);
          setWorkItemKey(record.workItemKey || record.key);
        }}
        className={styles.comboCardCol}
      >
        <div className={styles.workItemType}>{workItemTypeImageMap[record.workItemType] ?? record.workItemType}</div>
        <div className={styles.title}>
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
    );
}

export function ComboCardTitleColumn({record}) {
  return (
    <div className={styles.comboCardCol} style={{marginLeft: "16px", columnGap: "1rem"}}>
      <div className={styles.workItemType}>
        <img src={issueTypeImagePaths[record.workItemType]} alt="#" style={{width: "32px", height: "32px"}} />
      </div>
      <div className={styles.titleXl}>{truncateString(record.name, 100, "#6b7280")}</div>
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
    <div className="tw-grid tw-grid-cols-[25px,auto] tw-gap-1 tw-cursor-pointer tw-items-center" style={{marginLeft: "16px", columnGap: "1rem"}}>
      <div className={record.timeInStateDisplay ? "tw-row-span-2 tw-self-center" : "tw-self-center"}>{getStateTypeIcon(record.stateType, "28px")}</div>
      <div className="tw-lowercase tw-text-gray-300 tw-font-medium tw-text-base">{record.state}</div>
      {record.timeInStateDisplay && <div className="tw-text-xs tw-text-gray-300 tw-font-normal">entered {record.timeInStateDisplay}</div>}
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
        className="tw-grid tw-grid-cols-[25px,auto] tw-gap-1 tw-cursor-pointer tw-items-center"
      >
        <div className={record.timeInStateDisplay ? "tw-row-span-2 tw-self-center" : "tw-self-center"}>{getStateTypeIcon(record.stateTypeInternal)}</div>
        <div className="tw-lowercase tw-text-gray-300 tw-font-medium">{text}</div>
        {record.timeInStateDisplay && <div className="tw-text-xs tw-text-gray-300 tw-font-normal">entered {record.timeInStateDisplay}</div>}
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
