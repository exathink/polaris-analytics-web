import React from "react";
import Button from "../../../components/uielements/button";
import {Drawer, Form, Icon, Select} from "antd";
import {withSubmissionHandler} from "./withSubmissionHandler";

const {Option} = Select;

export function withFormDrawer(title, FormView, submitTitle='Submit', parts=[]) {
  return class FormDrawer extends React.Component {
    constructor(props) {
      super(props);
      const {submissionHandler} = props;
      this.state = {
        index: 0,
        values: submissionHandler && submissionHandler.lastSubmission || {}
      }

    }

    onNext() {
      this.props.form.validateFields(
        (errors, values) => {
          if(!errors) {
            this.setState({
              index: this.state.index+1,
              values: Object.assign(this.state.values, values)
            })
          }
        }
      )
    }

    onPrev() {
      const values = this.props.form.getFieldsValue()
      this.setState({
        index: this.state.index-1,
        values: Object.assign(this.state.values, values)
      })
    }

    currentValue(field, defaultValue=null) {
      return this.state.values[field] || defaultValue
    }

    onSubmit(e) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {submissionHandler} = this.props;
          if (submissionHandler) {
            submissionHandler.onSubmit(Object.assign(this.state.values, values))
          }
        }
      });
    };

    render() {
      const {
        submissionHandler: {
          visible,
          show,
          hide
        }
      } = this.props;

      return (
        <React.Fragment>
          <Button type="primary" onClick={show}>
            <Icon type="plus"/> {title}
          </Button>
          <Drawer
            title={title}
            width={720}
            onClose={hide}
            visible={visible}
          >
            <Form layout="vertical" hideRequiredMark onSubmit={parts.length == 0 ? this.onSubmit.bind(this) : null}>
              <FormView part={parts.length > 0 ? parts[this.state.index] : null} currentValue={this.currentValue.bind(this)} {...this.props} />
            </Form>
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button tabIndex="-1" onClick={hide} style={{marginRight: 8}}>
                Cancel
              </Button>
              {
                (0 <= this.state.index) && (this.state.index < parts.length-1) ?
                  <Button tabIndex="-1" onClick={this.onNext.bind(this)} style={{marginRight: 8}}>
                    Next
                  </Button>
                :
                null
              }
              {
                (0 < this.state.index) && (this.state.index  < parts.length) ?
                  <Button tabIndex="-1" onClick={this.onPrev.bind(this)} style={{marginRight: 8}}>
                    Previous
                  </Button>
                :
                null
              }
              {
                parts.length == 0 || this.state.index === parts.length - 1 ?
                  <Button onClick={this.onSubmit.bind(this)} type="primary">
                    {submitTitle}
                  </Button>
                  :null
              }
            </div>
          </Drawer>
        </React.Fragment>
      )
    }
  }
}


