import React from "react";

export const findByProps = (children, propName, value) => {
  return React.Children.map(children, dashRow => {
    return dashRow && React.Children.map(dashRow.props.children, dashItem => {
      return (dashItem && dashItem.props[propName] === value ? dashItem : null)
    })
  });
}

function findFirstDescendantBreadthFirst(children, propName, value) {
  if(children.length > 0) {
    const child = children.shift()
    if (child.props[propName] !== value) {

      return findFirstDescendantBreadthFirst(
        [
          ...children,
          ...React.Children.toArray(child.props.children)
        ],
        propName,
        value
      )
    } else {
      return child
    }

  } else {
    return null
  }
}

export const findFirstDescendant = (children, propName, value) => {
  return findFirstDescendantBreadthFirst(React.Children.toArray(children), propName, value)
}


export const cloneChildrenWithProps = (children, props, filter = child => child) => {
  return React.Children.map(children, child => (
      filter(child) ? React.cloneElement(child, props) : () => null
    )
  )
};