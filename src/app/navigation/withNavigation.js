import {go, goBack, goForward, push, replace} from "react-router-redux";
import {connect} from "react-redux";

export const withNavigation = (Component) => {
  const mapStateToProps = (state, ownProps) => ({
    ...ownProps,
    navigation: state.navigation
  });

  const mapDispatchToProps = (dispatch) => (
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
  return connect(mapStateToProps, mapDispatchToProps)(Component)
};