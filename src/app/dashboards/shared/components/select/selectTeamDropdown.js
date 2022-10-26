import {SelectDropdown} from "./selectDropdown";

export const defaultTeam = {key: "all", name: "All"};

export const getAllUniqueTeams = (initialTeams) => [defaultTeam, ...initialTeams];

export function SelectTeamDropdown({uniqueTeams, valueIndex, handleTeamChange, className}) {
  return (
    <SelectDropdown
      title={"Team"}
      uniqueItems={uniqueTeams}
      testId="team-dropdown"
      value={valueIndex}
      handleChange={handleTeamChange}
      layout="col"
      className={className}
    />
  );
}
