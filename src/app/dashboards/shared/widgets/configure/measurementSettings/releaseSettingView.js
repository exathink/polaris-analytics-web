import {Alert, Checkbox} from "antd";
import React from "react";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {useDimensionUpdateSettings} from "../../../hooks/useQueryProjectUpdateSettings";
import {releaseActionTypes, mode} from "./constants";
import Button from "../../../../../../components/uielements/button";
import {capitalizeFirstLetter} from "../../../../../helpers/utility";
import {releaseSettingReducer} from "./releaseSettingReducer";

export function ReleaseSettingView({dimension, instanceKey, releaseSettingFlag}) {
  const initialState = {
    releaseSetting: releaseSettingFlag,
    initialReleaseSetting: releaseSettingFlag,
    mode: mode.INIT,
    errorMessage: "",
  };

  const [state, dispatch] = React.useReducer(releaseSettingReducer, initialState);

  // mutation to update project analysis periods
  const [mutate, {loading, client}] = useDimensionUpdateSettings({
    dimension: dimension,
    onCompleted: ({[`update${capitalizeFirstLetter(dimension)}Settings`]: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: releaseActionTypes.MUTATION_SUCCESS});
        client.resetStore();
      } else {
        logGraphQlError("ReleaseSettingView.useProjectUpdateSettings", errorMessage);
        dispatch({type: releaseActionTypes.MUTATION_FAILURE, payload: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("ReleaseSettingView.useProjectUpdateSettings", error);
      dispatch({type: releaseActionTypes.MUTATION_FAILURE, payload: error.message});
    },
  });

  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: releaseActionTypes.UPDATE_DEFAULTS,
      payload: releaseSettingFlag,
    });
  }, [releaseSettingFlag]);

  function handleReleaseSettingChange(e) {
    dispatch({type: releaseActionTypes.UPDATE_RELEASE_SETTING, payload: e.target.checked});
  }

  function handleSaveClick() {
    // add mutation related logic here
    mutate({
      variables: {
        instanceKey: instanceKey,
        releasesSettings: {
          enableReleases: state.releaseSetting,
        },
      },
    });
  }

  function handleCancelClick() {
    dispatch({type: releaseActionTypes.RESET_RELEASE_SETTING});
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className="tw-ml-auto" type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button
            onClick={handleSaveClick}
            className="tw-mr-2"
            type="primary"
            size="small"
            shape="round"
          >
            Save
          </Button>
          <Button onClick={handleCancelClick} type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
      );
    }

    if (state.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Release setting updated successfully."
          type="success"
          showIcon
          closable
          className="tw-ml-auto"
          onClose={() => dispatch({type: releaseActionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }

    if (state.mode === mode.ERROR) {
      return (
        <Alert
          message={state.errorMessage}
          type="error"
          showIcon
          closable
          className="tw-ml-auto"
          onClose={() => dispatch({type: releaseActionTypes.RESET_RELEASE_SETTING})}
        />
      );
    }
  }

  return (
    <div className="tw-mr-auto tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-bg-white">
      <div className="tw-mb-3 tw-flex tw-w-full tw-items-center tw-p-1">
        <div className="tw-ml-auto tw-h-8">{getButtonElements()}</div>
      </div>
      <div className="tw-flex tw-justify-center tw-text-lg">
        <div>Releases</div>
      </div>

      <div className="tw-mt-4 tw-w-4/5 tw-border tw-border-solid tw-border-gray-100 tw-p-1">
        <div className="tw-p-1">
          <Checkbox onChange={handleReleaseSettingChange} name="releaseSetting" checked={state.releaseSetting}>
            Enable
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
