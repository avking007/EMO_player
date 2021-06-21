import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { signUp } from '../../../actions/auth';


const SignUp = ({isAuthenticated, signUp}) => {

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = () => (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    signUp(user);
  };

  if (isAuthenticated) {
    return <Redirect to="/home" />
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">First Name</label>
              <input
                className="form-control"
                onChange={handleChange("first_name")}
                type="text"
                name="first_name"
                value={user.first_name}
              />
              <label className="text-light">Last Name</label>
              <input
                className="form-control"
                onChange={handleChange("last_name")}
                type="text"
                name='last_name'
                value={user.last_name}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                onChange={handleChange("email")}
                type="email"
                name="email"
                value={user.email}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                onChange={handleChange("password")}
                type="password"
                name="password"
                value={user.password}
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapper = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapper, {signUp})(SignUp);
