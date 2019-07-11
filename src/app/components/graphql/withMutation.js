import React from 'react';
import {Mutation} from 'react-apollo';
import {refetchQueries} from "./utils";

import {TrackingReceiptMonitor} from "./trackingReceiptMonitor";

export const withMutation = ({name, mutation, client, success, error, getTrackingReceipt}, refetchSpec = null) => {
  return (Component) => {
    return props => (
      <Mutation
        mutation={mutation}
        onCompleted={data => success && success(data)}
        onError={err => error && error(err)}
        client={client}
        {...
          refetchSpec && !getTrackingReceipt ?
            {
              refetchQueries:
                (fetchData) => refetchQueries(refetchSpec, props, fetchData)
            } : {}
        }
      >
        {
          (mutate, result) => {
            const injectedProp = {

              [`${name}Mutation`]: {
                // we use the mutation name for the function for
                // cleaner calling code
                [name]: mutate,
                // we pass the generic mutate name so that clients can handle mutations generically.
                mutate: mutate,
                // same deal: named version for cleaner call site code
                [`${name}Result`]: result,
                // generic version for mutation cache etc.
                result: result,
              }
            }
            return getTrackingReceipt ?
              <TrackingReceiptMonitor
                client={client}
                trackingReceiptKey={getTrackingReceipt(result)}
                {...
                  refetchSpec ?
                    {
                      refetchQueries:
                        () => refetchQueries(refetchSpec, props)
                    } : {}
                }
              >
                <Component {...injectedProp} {...props} />
              </TrackingReceiptMonitor>
              :
              <Component {...injectedProp} {...props} />
          }
        }
      </Mutation>

    )
  }
}