import React, {useState } from "react"

import { Link, Redirect } from "react-router-dom"
import Base from "./core/Base"
import { authenticate, isAutheticated, signin } from "./helper/auth"


const Signin = () => {

    const [values, setValues] = useState({
        email:"",
        password:"",
        error:"",
        loading:false,
        didRedirect:false
    })
    const {email, password, error, loading, didRedirect} = values

    const { user } = isAutheticated()
    console.log(user)

    const handleChange = name => event => {
        setValues({...values, error:false, [name]: event.target.value})
    }

    const onSubmit = event => {
        event.preventDefault()
        setValues({...values, error: false, loading:true})
        console.log(email, password)
        signin({email,password})
        .then(data => {
            if(data.error) {
                console.log("hello")
                setValues({...values, error:data.error, email:"",
                password:"",loading: false})
            }else{
                authenticate(data, () => {
                    setValues({
                        ...values,
                
                        didRedirect:true,

                    })
                })
            }
        })
        .catch(error => console.log("error in siginin"))
    }

    const performRedirect = () => {


        if(didRedirect){
            if( user){
                return <Redirect to="/user/dashboard" />
            }
        }
        if(isAutheticated()){
            return <Redirect to="/signin" />
        }
    }

    const signinform = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3            text-left">
                    <form>
                        
                        <div className="form-group">
                            <label className="text-light">
                                Email
                            </label>
                            <input className="form-control" 
                            onChange={handleChange("email")}
                            value={email}
                            type="email" />
                        </div>
                        <div className="form-group">
                            <label className="text-light">
                                Password
                            </label>
                            <input className="form-control" 
                            onChange={handleChange("password")}
                            value={password}
                            type="password" />
                        </div>
                        <button 
                        onClick={onSubmit}
                        className="btn btn-success btn-block">Signin</button>
                    
                    </form>
                </div>
        
            </div>
        )
}

const loadingMessage = () => {
    return (
      loading && (
          <div className="">
            <h2>Loading...</h2>
          </div>
      )
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



    return(
        <Base title="Signin Page" description="Login user">
            {loadingMessage()}
            {errorMessage()}
            {signinform()}
            {performRedirect()}
        
        </Base>
    )
}

export default Signin