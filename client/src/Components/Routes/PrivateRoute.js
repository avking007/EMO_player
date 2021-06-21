import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  render: Renderer,
  ...rest
}) => {
  const renderComponent = (props) => Component ? (
    <Component {...props} /> ) : (
      Renderer()
    )
 
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Redirect to='/signin' />
        ) : renderComponent(props)
      }
    />
  );
}

const mapper = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapper)(PrivateRoute);
