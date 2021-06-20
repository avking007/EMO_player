import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "My description",
  className = "bg-dark text-white p-4",
  children,
}) => (
  <div>
   
    <div className="container-fluid p-4">
      <div className="jumbbotron bg-dark text-white text-center"></div>
      <div className={className}>{children}</div>
    </div>
 
    <footer className="footer">
      <div className="container  text-white text-center ">
        <h6 className="text-muted">
          If u got any questions feel free to reach out..
        </h6>
        <button className="btn  btn-success p-2">Contact Us</button>
      </div>
 
    </footer>
   
   
    
  </div>
);

export default Base;
