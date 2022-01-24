import {Tag, Tooltip} from "antd";
import React from "react";
import {Highlighter} from "../../../../components/misc/highlighter";
import { WorkItemStateTypeColor } from "../../../shared/config";
import styles from "./renderers.module.css";

const issueTypeImagePaths = {
  story: "/images/icons/story.svg",
  task: "/images/icons/task.svg",
  subtask: "/images/icons/subtask.svg",
  bug: "/images/icons/bug.svg",
}

const workItemTypeImageMap = {
  story: <img src={issueTypeImagePaths.story} alt="#" style={{width: "16px", height: "16px"}} />,
  task: <img src={issueTypeImagePaths.task} alt="#" style={{width: "16px", height: "16px"}} />,
  subtask: <img src={issueTypeImagePaths.subtask} alt="#" style={{width: "16px", height: "16px"}} />,
  bug: <img src={issueTypeImagePaths.bug} alt="#" style={{width: "16px", height: "16px"}} />,
};

export function getStateTypeIcon(workItemType, size="16px") {
  return <div style={{width: size, height: size, backgroundColor: WorkItemStateTypeColor[workItemType], borderRadius: "0.2rem", marginRight: "0.5rem"}}></div>
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
      <div className={styles.workItemType}><img src={issueTypeImagePaths[record.workItemType]} alt="#" style={{width: "32px", height: "32px"}}/></div>
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
    <div className={styles.comboCardCol} style={{marginLeft: "16px", columnGap: "1rem"}}>
      <div className={styles.stateTypeIcon}>{getStateTypeIcon(record.stateType, "28px")}</div>
      <div className={styles.state}>{record.state}</div>
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