import React, { useState } from "react";
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { login } from '../../../actions/auth';

const SignIn = ({ isAuthenticated, login }) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    login(user);
  };

  if (isAuthenticated) {
    return <Redirect to='/home' />
  }

  return (
    <div className="container-fluid p-4" style={{height: '100vh'}}>

      <div className="col-md-6 offset-sm-3 text-left">
        <form>
          <div className="form-group">
            <label className="text-light">Email</label>
            <input
              className="form-control"
              name="email"
              onChange={handleChange}
              value={user.email}
              type="email"
            />
          </div>

          <div className="form-group">
            <label className="text-light">Password</label>
            <input
              className="form-control"
              onChange={handleChange}
              name="password"
              value={user.password}
              type="password"
            />
          </div>

          <button onClick={onSubmit} className="btn btn-success btn-block">
            Signin
          </button>
        </form>
      </div>

    </div>
  );
};

const mapper = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapper, { login })(SignIn);
