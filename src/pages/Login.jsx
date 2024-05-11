import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import "./login.css";
import { useApiUrl } from "../App";
import { setUser } from "../shared/actions";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // api url
  const API_URL = useApiUrl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoginSuccess, setLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    usernameOrEmailId: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const customId1 = "customId1";
  const customId2 = "customId2";

  const validateForm = () => {
    let isValid = true;
    if (!credentials.usernameOrEmailId) {
      setError((err) => {
        err["usernameOrEmailId"] = "Please provide valid username or email id";
        return { ...err };
      });
      isValid = false;
    }
    if (!credentials.password) {
      setError((err) => {
        err["password"] = "Password is required!";
        return { ...err };
      });
      isValid = false;
    }

    return isValid;
  };

  const handleFocus = ({ target: { name } }) => {
    setError((err) => {
      delete err[name];
      return { ...err };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidData = validateForm();
    if (!isValidData) {
      return;
    }

    toast.error("Couldn't connect to server! Working on it...", {
      position: "top-center",
      autoClose: 1000,
      toastId: customId1,
    });
    return;

    // setLoading(true);

    // axios
    //   .post(`${API_URL}/api/auth/login`, { ...credentials })
    //   .then((response) => {
    //     if (response.data.isSuccess) {
    //       localStorage.setItem(
    //         "userData",
    //         JSON.stringify({
    //           token: response.data.Token,
    //         })
    //       );
    //       dispatch(setUser(response.data.user));
    //       toast.success("Login Successful!", {
    //         position: "bottom-right",
    //         autoClose: 800,
    //         toastId: customId1,
    //       });
    //       setLoading(false);
    //       dispatch(setUser(response.data.user)).then(() => {
    //         setLogin(true);
    //       });
    //     } else {
    //       toast.error(response.data.errMsg ?? "Something went wrong!", {
    //         position: "bottom-right",
    //         autoClose: 800,
    //         toastId: customId2,
    //       });
    //       setLoading(false);
    //     }
    //   })
    //   .catch((error) => {
    //     // handle error
    //     toast.error(
    //       error.response.data.errMsg ||
    //         (error.response?.status === 500
    //           ? "Internal server error!"
    //           : "Something went wrong!"),
    //       {
    //         position: "bottom-right",
    //         autoClose: 800,
    //         toastId: customId2,
    //       }
    //     );
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/");
    }
  }, [isLoginSuccess, navigate]);

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      navigate("/");
    }
  });

  const handleDataChange = ({ target: { name, value } }) => {
    setCredentials((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  return (
    <div className="cardBody">
      <div
        className="card mb-3 mx-auto rounded-3"
        style={{ maxWidth: "740px" }}
      >
        <div className="row g-0 cursor-default" onClick={() => {}}>
          <div
            className="col-md-5 login-image text-center rounded-start"
            style={{ backgroundColor: "#5dabfc" }}
          >
            <p className="fs-4 fw-bold">Welcome Back</p>
            <i
              className="fa-regular fa-comments"
              style={{ color: "#ffffff", fontSize: "54px" }}
            ></i>
          </div>
          <div className="col-md-7 py-4">
            <div className="card-body">
              <h5 className="card-title fw-bold fs-3">Log in</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    onFocus={handleFocus}
                    name="usernameOrEmailId"
                    className={`form-control ${
                      error.usernameOrEmailId
                        ? "border-danger"
                        : "border-secondary-subtle"
                    }`}
                    value={credentials.usernameOrEmailId}
                    onChange={(e) => handleDataChange(e)}
                    placeholder="Username"
                  />
                  {error.usernameOrEmailId && (
                    <p className="text-danger">{error.usernameOrEmailId}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    onFocus={handleFocus}
                    name="password"
                    className={`form-control ${
                      error.password
                        ? "border-danger"
                        : "border-secondary-subtle"
                    }`}
                    value={credentials.password}
                    onChange={(e) => handleDataChange(e)}
                    placeholder="Password"
                  />
                  {error.password && (
                    <p className="text-danger">{error.password}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-3 py-1 transition-all duration-300 rounded mb-2 text-[17px] bg-btn-bg hover:bg-btn-hover text-btnText"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="grow" size="sm" variant="light" />
                  ) : (
                    "Login"
                  )}
                </button>

                <p>
                  Don't have an account?{" "}
                  <Link
                    className="text-btn-bg hover:text-btn-hover hover:underline-offset-4 hover:underline"
                    to="/register"
                  >
                    Register Here
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

export default Login;
