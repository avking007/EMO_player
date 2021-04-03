import React from 'react'
import { Link, withRouter} from "react-router-dom"
import { isAutheticated, signout } from '../helper/auth'




const currentTab =(history, path) =>{
    if( history.location.pathname === path)
    {
        return {color :	"#b0b3b8" }
    }
    else{
        return { color: "white"}
    }
}

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-dark">
            {!isAutheticated() && (
                <li className="nav-item">
                <Link 
                style = { currentTab(history, "/") }
                className="nav-link" to="/">Home</Link>
            </li>
            )}
         
          
        
           {!isAutheticated() && (
            <li className="nav-item">
            <Link 
            style = { currentTab(history, "/signup") }
            className="nav-link" to="/signup">Signup</Link>
        </li>
    
           )}
        
        
        {!isAutheticated() && (
            <li className="nav-item">
            <Link 
            style = { currentTab(history, "/signin") }
            className="nav-link" to="/signin">Signin</Link>
        </li>
        )}
        {isAutheticated() && (
            <li className="nav-item">
                <span className="nav-link text-warning" onClick={() => {
                    signout(() =>{
                        history.push('/')
                    })
                }}>
                    Signout
                </span>
            </li>
        )}
            
          
        </ul>
    </div>

)


export default withRouter(Menu)