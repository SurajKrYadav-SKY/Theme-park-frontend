import React, { useState } from "react";
import Hero from "../../assets/hero1.png";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";
import { useAppStore } from "../../store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  // const { setUserInfo } = useAppStore();

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password should be matching");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
          navigate(response.data.profileSetup ? "/home" : "/profile");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201 && response.data.id) {
          setUserInfo(response.data);
          navigate(response.data.profileSetup ? "/chat" : "/profile");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-content">
          <h1>Welcome</h1>
          <p>Fill in the details to get started</p>

          <div className="tabs">
            <button
              className={`tab-trigger ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-trigger ${
                activeTab === "signup" ? "active" : ""
              }`}
              onClick={() => setActiveTab("signup")}
            >
              SignUp
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "login" ? (
              <div className="form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="input"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input"
                />
                <button onClick={handleLogin} className="btn">
                  Login
                </button>
              </div>
            ) : (
              <div className="form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="input"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="input"
                />
                <button onClick={handleSignup} className="btn">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="auth-image">
          <img src={Hero} alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
