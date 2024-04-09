import { useState } from "react";
import logo from "./../assets/Amazon_logo.webp";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { IoAlertCircleOutline } from "react-icons/io5";
import jwt_decode from "jwt-decode";

const formInitialState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const AuthPage = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formDetails, setFormDetails] = useState(formInitialState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    setFormDetails((prevState) => {
      const newFormDetails = { ...prevState };
      let modifiedField = e.target.id;
      if (modifiedField === "confirm-password") {
        modifiedField = "passwordConfirm";
      }
      newFormDetails[modifiedField] = e.target.value;
      return newFormDetails;
    });
  };

  const authToggleHandler = (e) => {
    // On switch b/w login and sign up, error set to null and empty form fields
    setError(null);
    setFormDetails(formInitialState);
    setIsLogIn((prevState) => !prevState);
  };

  const authRequest = async (path, body) => {
    try {
      const res = await axiosInstance.post(path, body);
      const token = res.data.token;
      const { id } = jwt_decode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      navigate("/products");
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  };

  const userFormSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      if (isLogIn) {
        await authRequest("/api/v1/users/login", {
          email: formDetails.email,
          password: formDetails.password,
        });
      } else {
        await authRequest("/api/v1/users/signup", formDetails);
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="main-container">
        <div className="title-container">
          <h2 className="title">{isLogIn ? "Login" : "Sign up"}</h2>
        </div>
        {error && (
          <p className="alert alert-danger">
            <IoAlertCircleOutline className="alert-icon" />
            <span>{error}</span>
          </p>
        )}
        <div className="auth-user-container">
          <form className="form-user" onSubmit={userFormSubmitHandler}>
            {!isLogIn && (
              <div className="form-name-container">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  onChange={inputChangeHandler}
                  value={formDetails.name}
                />
              </div>
            )}
            <div className="form-email-container">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                onChange={inputChangeHandler}
                value={formDetails.email}
              />
            </div>
            <div className="form-password-container">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                onChange={inputChangeHandler}
                value={formDetails.password}
              />
            </div>
            {!isLogIn && (
              <div className="form-confirm-password-container">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  onChange={inputChangeHandler}
                  value={formDetails.passwordConfirm}
                />
              </div>
            )}
            <button type="submit" className="btn-auth--primary">
              {isLoading ? "Loading..." : isLogIn ? "Login" : "Sign up"}
            </button>
          </form>
          <div className="devider">
            <h5>{isLogIn ? "New to Amazon?" : "Already have an account?"}</h5>
          </div>
          <button
            type="button"
            className="btn-auth--secondary"
            onClick={authToggleHandler}
          >
            {isLogIn ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
