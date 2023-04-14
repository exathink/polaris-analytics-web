import {workItemTypeImageMap} from "../../../projects/shared/helper/renderers";
import {SelectDropdown} from "./selectDropdown";

export const defaultIssueType = {value: "all", label: "All"};

export const uniqueIssueTypes = [
  defaultIssueType,
  {value: "story", label: "Story", icon: workItemTypeImageMap.story},
  {value: "task", label: "Task", icon: workItemTypeImageMap.task},
  {value: "bug", label: "Bug", icon: workItemTypeImageMap.bug},
  {value: "subtask", label: "Sub Task", icon: workItemTypeImageMap.subtask},
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
