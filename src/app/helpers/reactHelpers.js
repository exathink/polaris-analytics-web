import React from "react";

export const findByProps = (children, propName, value) => {
  return React.Children.map(children, dashRow => {
    return React.Children.map(dashRow.props.children, dashItem => {
      return (dashItem.props[propName] === value ? dashItem : null)
    })
  });



};
export const cloneChildrenWithProps = (children, props) => {
  return React.Children.map(children, child => (
      React.cloneElement(child, props)
    )
  )
};