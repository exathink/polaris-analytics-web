import {getLocation, go, goBack, goForward, push, replace} from "react-router-redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

export const withNavigation = (Component) => {
  const mapStateToProps = (state, ownProps) => ({
    ...ownProps,
    location: getLocation(state),
    navigation: state.navigation.toJS()
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
  return withRouter(connect(mapStateToProps, mapDispatchToProps)(Component))
};