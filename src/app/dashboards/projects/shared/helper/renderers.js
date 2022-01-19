import {Tag, Tooltip} from "antd";
import React from "react";
import { WorkItemStateTypeColor } from "../../../shared/config";
import styles from "./renderers.module.css";

const workItemTypeImageMap = {
  story: <img src="/images/icons/story.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  task: <img src="/images/icons/task.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  subtask: <img src="/images/icons/subtask.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  bug: <img src="/images/icons/bug.svg" alt="#" style={{width: "16px", height: "16px"}} />,
};

export function getStateTypeIcon(workItemType) {
  return <div style={{width: "16px", height: "16px", backgroundColor: WorkItemStateTypeColor[workItemType], borderRadius: "0.2rem", marginRight: "0.5rem"}}></div>
}

function truncateString(str, len, color="#108ee9") {
  if (str.length>len) {
    const temp = str.substring(0,len) + "...";
    return <Tooltip title={str} color={color}>
      {temp}
    </Tooltip>
  } else {
    return str;
  }
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
        <div className={styles.title}>{truncateString(text, 38, "#6b7280")}</div>
        <div className={styles.displayId}>
          {record.displayId}{" "}
          {record.epicName && (
            <Tag color="#108ee9" style={{marginLeft: "30px"}}>
              {truncateString(record.epicName, 25, "#108ee9")}
            </Tag>
          )}
        </div>
      </div>
    );
}

export function ComboCardTitleColumn({record}) {
  return (
    <div className={styles.comboCardCol} style={{marginLeft: "16px"}}>
      <div className={styles.workItemType}>{workItemTypeImageMap[record.workItemType] ?? record.workItemType}</div>
      <div className={styles.title}>{truncateString(record.name, 50, "#6b7280")}</div>
      <div className={styles.displayId}>
        {record.displayId}{" "}
        {record.epicName && (
          <Tag color="#108ee9" style={{marginLeft: "30px"}}>
            {truncateString(record.epicName, 35, "#108ee9")}
          </Tag>
        )}
      </div>
    </div>
  );
}

export function ComboCardStateTypeColumn({record}) {
  return (
    <div className={styles.comboCardCol} style={{marginLeft: "16px"}}>
      <div className={styles.stateTypeIcon}>{getStateTypeIcon(record.stateType)}</div>
      <div className={styles.stateType}>{record.state}</div>
      <div className={styles.entered}>entered {record.timeInStateDisplay}</div>
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
        className={styles.comboCardCol}
      >
        <div className={styles.stateTypeIcon}>{getStateTypeIcon(record.stateTypeInternal)}</div>
        <div className={styles.stateType}>{text}</div>
        <div className={styles.entered}>
          entered {record.timeInStateDisplay}
        </div>
      </div>
    );
}

export function customColumnRender({setShowPanel, setWorkItemKey, setPlacement, colRender = (text) => text, className}) {
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