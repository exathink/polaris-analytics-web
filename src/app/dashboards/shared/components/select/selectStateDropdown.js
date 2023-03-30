import {SelectDropdown} from "./selectDropdown";

export const defaultState = {key: "all", name: "All"};

export const uniqueStates = [defaultState, {key: "one", name: "One"}]

export function SelectStateDropdown({valueIndex, handleStateChange, className, wrapperClassName}) {
  return (
    <SelectDropdown
      title={"State"}
      uniqueItems={uniqueStates}
      testId="state-dropdown"
      value={valueIndex}
      handleChange={handleStateChange}
      layout="col"
      className={className}
      wrapperClassName={wrapperClassName}
    />
  );
}
