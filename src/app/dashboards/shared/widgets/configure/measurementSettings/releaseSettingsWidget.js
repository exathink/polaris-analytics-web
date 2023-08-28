import { ReleaseSettingView } from "./releaseSettingView";

export const ReleaseSettingsWidget = ({dimension, instanceKey, releaseSettingFlag}) => {
    return (
      <ReleaseSettingView
        dimension={dimension}
        instanceKey={instanceKey}
        releaseSettingFlag={releaseSettingFlag}
      />
    );
  };
  