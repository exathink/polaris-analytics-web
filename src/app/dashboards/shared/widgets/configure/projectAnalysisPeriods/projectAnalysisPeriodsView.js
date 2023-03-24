import React from "react";
import {actionTypes, mode} from "./constants";
import {analysisPeriodsReducer} from "./analysisPeriodsReducer";
import {Alert, Col, Form, Input, Row} from "antd";
import {useDimensionUpdateSettings} from "../../../hooks/useQueryProjectUpdateSettings";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import styles from "./projectAnalysisPeriods.module.css";
import {AnalysisPeriodsSliders} from "./analysisPeriodsSliders";
import Button from "../../../../../../components/uielements/button";
import {capitalizeFirstLetter} from "../../../../../helpers/utility";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";

export const ProjectAnalysisPeriodsView = ({
  dimension,
  instanceKey,
  name,
  wipAnalysisPeriod,
  flowAnalysisPeriod,
  trendsAnalysisPeriod,
}) => {
  const initialState = {
    wipPeriod: wipAnalysisPeriod,
    flowPeriod: flowAnalysisPeriod,
    trendsPeriod: trendsAnalysisPeriod,
    initialAnalysisPeriods: {wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod},
    initialName: name,
    name: name,
    mode: mode.INIT,
    errorMessage: "",
  };

  const [state, dispatch] = React.useReducer(analysisPeriodsReducer, initialState);
  const sliderProps = {...state, dispatch};

  // mutation to update project analysis periods
  const [mutate, {loading, client}] = useDimensionUpdateSettings({
    dimension: dimension,
    onCompleted: ({[`update${capitalizeFirstLetter(dimension)}Settings`]: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      } else {
        logGraphQlError("ProjectAnalysisPeriodsView.useProjectUpdateSettings", errorMessage);
        dispatch({type: actionTypes.MUTATION_FAILURE, payload: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("ProjectAnalysisPeriodsView.useProjectUpdateSettings", error);
      dispatch({type: actionTypes.MUTATION_FAILURE, payload: error.message});
    },
  });

  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: {wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod, name},
    });
  }, [wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod, name]);


  const handleInputChange = (values) => {
    dispatch({type: actionTypes.UPDATE_NAME, payload: values.name});
  };

  function handleSaveClick() {
    const payload = {
      wipAnalysisPeriod: state.wipPeriod,
      flowAnalysisPeriod: state.flowPeriod,
      trendsAnalysisPeriod: state.trendsPeriod,
    };

    // call mutation on save button click
    mutate({
      variables: {
        instanceKey: instanceKey,
        name: state.name,
        analysisPeriods: payload,
      },
    });
  }

  // utilizing this trick to reset component (changing the key will remount the chart component with same props)
  const [resetComponentStateKey, resetState] = useResetComponentState();

  function handleCancelClick() {
    dispatch({type: actionTypes.RESET_SLIDERS});
    resetState();
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button
            onClick={handleSaveClick}
            className={styles["analysisSave"]}
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
          message="Analysis Periods updated successfully."
          type="success"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }

    if (state.mode === mode.ALERT) {
      return (
        <Alert
          message={state.errorMessage}
          type="warning"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.CLOSE_ALERT_MODAL})}
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
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.RESET_SLIDERS})}
        />
      );
    }
  }

  return (
    <div className={styles["analysisPeriodControlsWrapper"]} data-testid="analysis-periods-view">
      <div className={styles["analysisPeriodTopBar"]}>
        <div className={styles["analysisPeriodsButtons"]} data-testid="analysis-period-buttons">
          {getButtonElements()}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center tw-col-start-2 tw-col-end-3 tw-pl-8">
        <Form
          layout="horizontal"
          requiredMark={false}
          onValuesChange={handleInputChange}
          initialValues={{name: name}}
          key={resetComponentStateKey}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={"name"}
                label="Name"
                rules={[{required: true, message: "Name is required"}]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <div className={styles["titleWrapper"]}>
        <div className={styles["analysisPeriodTitle"]}>Analysis Periods</div>
      </div>
      <AnalysisPeriodsSliders {...sliderProps} />
    </div>
  );
};
