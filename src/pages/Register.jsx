import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.css";
import axios from "axios";
import { useApiUrl } from "../App";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const Register = (props) => {
  const API_URL = useApiUrl();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    emailId: "",
    username: "",
    password: "",
  });
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const customId1 = "customId1";
  const customId2 = "customId2";

  const handleFocus = ({ target: { name } }) => {
    setError((err) => {
      delete err[name];
      return { ...err };
    });
  };

  const validateFormData = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)?$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let isValid = true;
    if (!userData.name || !nameRegex.test(userData.name.trim())) {
      setError((err) => {
        return { ...err, name: "Please provide valid name" };
      });
      isValid = false;
    }
    if (!userData.emailId || !emailRegex.test(userData.emailId)) {
      setError((err) => {
        return { ...err, emailId: "Please provide valid email Id" };
      });
      isValid = false;
    }
    if (!userData.username) {
      setError((err) => {
        return { ...err, username: "Please provide username" };
      });
      isValid = false;
    }
    if (!userData.password || !passwordRegex.test(userData.password)) {
      setError((err) => {
        return {
          ...err,
          password:
            "Password must have Uppercase letter, lowercase letter, number, special character and minimum 8 characters long.",
        };
      });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    const isValidData = validateFormData();
    if (!isValidData) {
      return;
    }

    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        ...userData,
      });
      setLoading(false);
      if (response.data.isSuccess) {
        toast.success("Registered Successfully!", {
          position: "bottom-right",
          toastId: customId1,
        });
        navigate("/login");
      } else {
        toast.error("Something went wrong!", {
          position: "bottom-right",
          toastId: customId1,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data.errMsg ??
          (error.response?.status === 500
            ? "Internal server error!"
            : "Something went wrong!"),
        {
          position: "bottom-right",
          toastId: customId2,
        }
      );
    }
    setLoading(false);
  };

  if (localStorage.getItem("userData")) {
    navigate("/");
  }

  const handleDataChange = ({ target: { name, value } }) => {
    setUserData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  return (
    <div className="cardBody">
      <div
        className="card mb-3 mx-auto rounded-3"
        style={{ maxWidth: "740px" }}
      >
        <div className="row g-0 cursor-default">
          <div
            className="col-md-5 login-image text-center rounded-start"
            style={{ backgroundColor: "#5dabfc" }}
          >
            <p className="fs-4 fw-bold">Join Us</p>
            <i
              className="fa-regular fa-comments"
              style={{ color: "#ffffff", fontSize: "54px" }}
            ></i>
          </div>
          <div className="col-md-7 py-4">
            <div className="card-body">
              <h5 className="card-title fw-bold fs-3">Register</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    onFocus={handleFocus}
                    className={`form-control ${
                      errors.name ? "border-danger" : "border-secondary-subtle"
                    }`}
                    value={userData.name}
                    onChange={(e) => handleDataChange(e)}
                    placeholder="Full Name"
                  />
                  {errors.name && <p className="text-danger">{errors.name}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="emailId"
                    name="emailId"
                    onFocus={handleFocus}
                    className={`form-control ${
                      errors.emailId
                        ? "border-danger"
                        : "border-secondary-subtle"
                    }`}
                    value={userData.emailId}
                    onChange={(e) => handleDataChange(e)}
                    placeholder="Email Id"
                  />
                  {errors.emailId && (
                    <p className="text-danger">{errors.emailId}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    onFocus={handleFocus}
                    className={`form-control ${
                      errors.username
                        ? "border-danger"
                        : "border-secondary-subtle"
                    }`}
                    value={userData.username}
                    onChange={(e) => handleDataChange(e)}
                    placeholder="Username"
                  />
                  {errors.username && (
                    <p className="text-danger">{errors.username}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    onFocus={handleFocus}
                    className={`form-control ${
                      errors.password
                        ? "border-danger"
                        : "border-secondary-subtle"
                    }`}
                    value={userData.password}
                    onChange={(e) => handleDataChange(e)}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}
                </div>
                <button
                  type="button"
                  value="submit"
                  onClick={handleSubmit}
                  className="px-3 py-1 rounded mb-2 text-[17px] bg-btn-bg hover:bg-btn-hover text-btnText"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="grow" size="sm" variant="light" />
                  ) : (
                    "Register"
                  )}
                </button>

                <p>
                  Already Registered?{" "}
                  <Link
                    className="text-btn-bg-hover hover:underline-offset-4 hover:underline"
                    to="/login"
                  >
                    Login Here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
