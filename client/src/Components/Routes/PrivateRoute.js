import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { isAutheticated } from '../../helper/auth';

const PrivateRoute = ({
    component: Component,
    ...rest
  }) => (
    <Route
      {...rest}
      render={(props) =>
        !isAutheticated()  ? (
          <Redirect to='/signin' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
  

export default PrivateRoute;
