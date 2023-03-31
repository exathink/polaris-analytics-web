import {SelectDropdown} from "./selectDropdown";

export const defaultState = {key: "all", name: "All"};

export function SelectStateDropdown({uniqueItems, valueIndex, handleStateChange, className, wrapperClassName}) {
  return (
    <SelectDropdown
      title={"State"}
      uniqueItems={[defaultState, ...uniqueItems]}
      testId="state-dropdown"
      value={valueIndex}
      handleChange={handleStateChange}
      layout="col"
      className={className}
      wrapperClassName={wrapperClassName}
    />
  );
}
