import React, { useState } from "react";
import AuthHeading from "./utils_components/authHeading";
import AuthForm from "./utils_components/authForm";
import AuthBottom from "./utils_components/authBottom";
import "../../styles/auth/auth.css";

const AuthComponent = ({ children, onClose, currPage = "updatePassword" }) => {
   return (
      <div className="modal">
         <div className="modal-content">
            <span className="close" onClick={onClose}>
               &times;
            </span>
            {children}
            <AuthHeading currPage={currPage} />
            <AuthForm currPage={currPage} />
            <AuthBottom currPage={currPage} />
         </div>
      </div>
   );
};

export default AuthComponent;