import {go, goBack, goForward, push, replace} from "react-router-redux";
import {connect} from "react-redux";

export const navigationState = (state) => ({
    navigation: state.navigation
  });

export const navigationDispatch = (dispatch) => (
    {
      navigate:
        {
          push: (args) => {
            dispatch(push(args))
          },
          replace: (args) => {
            dispatch(replace(args))
          },
          go: (args) => {
            dispatch(go(args))
          },
          goBack: (args) => {
            dispatch(goBack(args))
          },
          goForward: (args) => {
            dispatch(goForward(args))
          }
        }
    });

export const withNavigationDispatch = (Component) => {
  return connect(null, navigationDispatch)(Component)
}

