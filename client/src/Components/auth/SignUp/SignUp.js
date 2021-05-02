import React, { useState } from "react";

import { Link } from "react-router-dom";
import Base from "../../../core/Base";
import { signup } from "../../../helper/auth";

const Signup = () => {
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { first_name, last_name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ first_name, last_name, email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
          console.log("in error");
        } else {
          setValues({
            ...values,
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
          console.log(values);
          console.log("hey i am in success");
        }
      })
      .catch((error) => console.log(error));
  };

  const signupform = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">First Name</label>
              <input
                className="form-control"
                onChange={handleChange("first_name")}
                type="text"
                value={first_name}
              />
              <label className="text-light">Last Name</label>
              <input
                className="form-control"
                onChange={handleChange("last_name")}
                type="text"
                value={last_name}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                onChange={handleChange("email")}
                type="email"
                value={email}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                className="form-control"
                onChange={handleChange("password")}
                type="password"
                value={password}
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Signup
            </button>
          </form>
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New account was created successfully. Please{" "}
            <Link to="/signin">Login Here</Link>
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base
      title="Signup Page"
      description="Hey Are u not registerd? Get Register now.."
    >
      {successMessage()}
      {errorMessage()}
      {signupform()}
    </Base>
  );
};

export default Signup;
