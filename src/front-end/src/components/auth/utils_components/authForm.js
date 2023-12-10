import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../../../context/AppContext";
import axios from 'axios';
import styles from "../../../styles/auth/auth_form.module.css";
import { validateEmail, validatePassword } from "../../../utils/auth/validation";

const AuthForm = ({ currPage, onEmailSent, isVendor }) => {
   const navigate = useNavigate();
   const { setAuth } = useAppContext();

   // State to store email and password
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   // State to manage whether the password is shown or hidden
   const [showPassword, setShowPassword] = useState(false);

   // State to store validation error messages
   const [emailError, setEmailError] = useState('');
   const [passwordError, setPasswordError] = useState('');

   // Toggle function to change the state
   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   // Function to update email state
   const handleEmailChange = (event) => {
      setEmail(event.target.value);
   };

   // Function to update password state
   const handlePasswordChange = (event) => {
      setPassword(event.target.value);
   };

   // validation check
   useEffect(() => {
      (currPage !== "signin") && setEmailError(validateEmail(email));
   }, [email]);

   useEffect(() => {
      (currPage !== "signin") && setPasswordError(validatePassword(password));
   }, [password]);

   const updateAuthAndStore = (userData) => {
      setAuth({ isAuthenticated: true, user: userData.user, token: userData.token });
      localStorage.setItem('auth', JSON.stringify({
         isAuthenticated: true,
         user: userData.user,
         token: userData.token
      }));
   };

   // Form submission handler
   const handleSubmit = async (event) => {
      event.preventDefault();
      switch (currPage) {
         case "signup":
            if (emailError || passwordError) {
               alert("Error in email or password, please try again!");
            } else {
               try {
                  const response = await axios.post('/api/auth/signup', {
                     username: email,
                     password: password,
                     role: isVendor ? 'vendor' : 'customer'
                  });
                  // success, save user to context & close window
                  updateAuthAndStore(response.data);
                  navigate(-1);
               } catch (error) {
                  console.error('Signup error:', error.response.data);
                  alert(error);
               }
            }
            break;

         case "signin":
            try {
               const response = await axios.post('/api/auth/signin', {
                  username: email,
                  password: password
               });
               // success, save user to context & navigate
               updateAuthAndStore(response.data);
               navigate(-1);
            } catch (error) {
               console.error('Signin error:', error.response ? error.response.data : error);
               alert("Signin error: " + (error.response ? error.response.data.message : error));
            }
            break;

         case "updatePassword":
            if (!emailError) {
               // If email is valid, trigger the email sent action
               onEmailSent();
            } else {
               alert("Please enter a valid email!");
            }
            break;

         default:
            // Default action for other pages...
            break;
      }
   };

   return (
      <form action="" method="get" className={styles.authForm} onSubmit={handleSubmit}>
         <div className={`${styles.formGroup} ${styles.emailFormGroup}`}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
               type="email"
               name="email"
               id="email"
               className={styles.inputField}
               value={email}
               onChange={handleEmailChange}
               style={emailError ? errorInputStyle : null}
            />
            {emailError && <div className={styles.errorMessage}>{emailError}</div>}
         </div>
         {currPage !== 'updatePassword' && (
            <div className={styles.password}>
               <label htmlFor="password" className={styles.label}>Password</label>
               <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className={styles.inputField}
                  value={password}
                  onChange={handlePasswordChange}
                  style={passwordError ? errorInputStyle : null}
               />
               <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.showHideToggle}
                  style={passwordError ? errorShowButtonStyle : null}
               >
                  {showPassword ? "Hide" : "Show"}
               </button>
               {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
            </div>
         )}
         <div className={styles.formGroup}>
            <input
               type="submit"
               className={styles.submitButton}
               value={currPage === 'signin' ? "Sign in" : currPage === 'signup' ? "Create account" : "Update Password"}
            />
         </div>
      </form>
   );
};

// Inline styles for error input fields
const errorInputStyle = {
   borderColor: '#FC5A44',
};

const errorShowButtonStyle = {
   top: '45%',
};

export default AuthForm;
