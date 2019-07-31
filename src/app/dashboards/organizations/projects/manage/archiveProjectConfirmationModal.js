import React from 'react';
import {Modal} from 'antd';
import Button from "../../../../../components/uielements/button";

const ArchiveProjectConfirmationModal = ({record, onProjectArchived, onDone}) => {
  return (
    <Modal
      title={`Archive Project ${record.name}? `}
      visible={true}
      onOk={
        () => {
          onProjectArchived(record)
          onDone()
        }
      }
      onCancel={
        () => {
          onDone()
        }}
      okText={'Archive'}
    >
      <p>Archived projects will no longer be visible in the application and any remote sub-projects will no longer be updated.</p>
    </Modal>
  )
}


export class ArchiveProjectConfirmationModalButton extends React.Component {

  state = {
    modal: false
  }

  swapModal() {
    this.setState({
      modal: !this.state.modal
    })
  }

  render() {
    const {record, onProjectArchived} = this.props;

    return (
      <React.Fragment>
        <Button
          size={"small"}
          type={'primary'}
          onClick={this.swapModal.bind(this)}
        >
          Archive
        </Button>
        {
          this.state.modal &&
          <ArchiveProjectConfirmationModal
            record={record}
            onProjectArchived={onProjectArchived}
            onDone={this.swapModal.bind(this)}
          />
        }
      </React.Fragment>
    )
  }
}