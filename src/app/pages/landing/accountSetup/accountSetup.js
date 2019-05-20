import React from 'react';

import gql from "graphql-tag";
import {Mutation} from "react-apollo";

import AccountSetupForm from './accountSetupForm';
import Box from '../../../../components/utility/box';
import LayoutWrapper from '../../../../components/utility/layoutWrapper.js';
import PageHeader from '../../../../components/utility/pageHeader';
import {ViewerContext} from "../../../framework/viewer/viewerContext";
import Notification from "../../../../components/notification";

const INIT_VIEWER_ACCOUNT = gql`
    mutation InitViewerAccount ($initViewerAccountInput: InitViewerAccountInput! ){
        initViewerAccount(initViewerAccountInput: $initViewerAccountInput) {
            viewer {
                ...ViewerInfoFields
            }
        }
    }
    ${ViewerContext.fragments.viewerInfoFields}
`;

const UPDATE_VIEWER_INFO_CACHE = gql`
    query viewer_info {
        viewer {
            ...ViewerInfoFields
        }
    }
    ${ViewerContext.fragments.viewerInfoFields}
`

export const AccountSetup = ({viewerContext}) => {

  return (
    <Mutation mutation={INIT_VIEWER_ACCOUNT}>
      {initViewerAccount => {
        const {viewer} = viewerContext
        return (
          <LayoutWrapper>
            <PageHeader>
              Welcome {viewer.firstName}. Lets setup your Organization!
            </PageHeader>

            <Box>
              <AccountSetupForm
                viewer={viewer}
                onSubmit={
                  (values) => initViewerAccount({
                    variables: {
                      initViewerAccountInput: {
                        organizationName: values.organization
                      }
                    },
                    update: (cache, {data: {initViewerAccount}}) => {
                      if (initViewerAccount) {
                        cache.writeQuery({
                          query: UPDATE_VIEWER_INFO_CACHE,
                          data: initViewerAccount
                        })

                        Notification(
                          'success',
                          `Organization ${values.organization} created`
                        );

                        viewerContext.refresh()
                      }
                    }
                  })
                }
              />
            </Box>
          </LayoutWrapper>
        );
      }}
    </Mutation>
  );

};