import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from "react";

export class TrackingReceiptMonitor extends React.Component {

  constructor(props) {
    super(props)
    console.log("TRM: constructed")
    this.state = {
      polling: true,
      trackingReceiptCompleted: false
    }
  }

  refetchQueries() {
    const {client, refetchQueries} = this.props;
    if (refetchQueries) {
        refetchQueries().forEach(
          (querySpec) =>
            client.query({...querySpec, fetchPolicy: 'network-only'})
        )
    }
  }

  onTrackingReceiptInfoUpdated(data) {
    const completedAt = data?.trackingReceipt?.completedAt
    if (completedAt != null) {
      this.refetchQueries()

      this.setState({
        polling: false,
        trackingReceiptCompleted: true
      })
    } else {
      this.setState({
        polling: true
      })
    }
  }



  componentDidUpdate() {
    if(this.props.trackingReceiptKey === null & !this.state.polling) {
      this.setState({
        polling: true,
        trackingReceiptCompleted: false
      })
    }
  }

  render() {
    const {client, trackingReceiptKey, children} = this.props;
    const child = React.Children.only(children)

    return (
      trackingReceiptKey ?
        <Query
          query={gql`
              query getTrackingReceiptInfo($trackingReceiptKey: String!) {
                  trackingReceipt(key: $trackingReceiptKey) {
                      id
                      name
                      key
                      createdAt
                      completedAt
                      currentState
                      info
                  }
              }
          `
          }
          client={client}
          variables={{
            trackingReceiptKey: trackingReceiptKey
          }}
          notifyOnNetworkStatusChange={true}
          pollInterval={this.state.polling ? 1000 : 0}
          onCompleted={this.onTrackingReceiptInfoUpdated.bind(this)}
        >
          {
            ({loading, error, data}) => {
              console.log('Tracking receipt render..')
              return React.cloneElement(child, {trackingReceiptCompleted: this.state.trackingReceiptCompleted})
            }
          }
        </Query>
        :
        this.props.children
    )
  }
}