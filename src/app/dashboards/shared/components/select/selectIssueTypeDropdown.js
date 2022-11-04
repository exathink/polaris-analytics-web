import {workItemTypeImageMap} from "../../../projects/shared/helper/renderers";
import {SelectDropdown} from "./selectDropdown";

export const defaultIssueType = {key: "all", name: "All"};

export const uniqueIssueTypes = [
  defaultIssueType,
  {key: "story", name: "Story", icon: workItemTypeImageMap.story},
  {key: "task", name: "Task", icon: workItemTypeImageMap.task},
  {key: "bug", name: "Bug", icon: workItemTypeImageMap.bug},
  {key: "subtask", name: "Sub Task", icon: workItemTypeImageMap.subtask},
];

export function SelectIssueTypeDropdown({valueIndex, handleIssueTypeChange, className, wrapperClassName}) {
  return (
    <SelectDropdown
      title={"Issue Type"}
      uniqueItems={uniqueIssueTypes}
      testId="issue-type-dropdown"
      value={valueIndex}
      handleChange={handleIssueTypeChange}
      layout="col"
      className={className}
      wrapperClassName={wrapperClassName}
    />
  );
}
