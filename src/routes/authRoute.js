import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "../pages/profile";
import Home from "../pages/home";
import SideBar from "../components/sideBar";
import TweetDetail from "../pages/tweetDetail";
import { toast } from "react-toastify";
import axios from "axios";
import { useApiUrl } from "../App";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../shared/actions";
import Loading from "../components/loading";

export function reAuthenticate() {
  localStorage.removeItem("userData");
  window.location = "/login";
}

export default function AuthRoutes() {
  // api url
  const API_URL = useApiUrl();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  function onApiError(error) {
    toast.error(
      error?.response?.data?.errMsg ??
        (error.response.status === 500
          ? "Internal server error!"
          : "Some Error Occurred!"),
      {
        position: "bottom-right",
        autoClose: 5000, // Adjust the duration as needed
        toastId: toastId,
      }
    );
    if (error.response.status === 401) {
      reAuthenticate();
      navigate("/login");
    }
  }

  const refreshUserData = async () => {
    if (!user && userData) {
      try {
        const response = await axios.get(`${API_URL}/api/user/get-details`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        if (response.data.isSuccess) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        onApiError(error);
      }
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  // get logged in user data
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData || !userData?.token) {
    window.location = "/login";
  }

  const customId = "custom1";

  // get single user details
  const getUserProfile = async (userId) => {
    if (userId === user._id) {
      return user;
    }

    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.data.isSuccess) {
        return response.data;
      } else {
        toast.error(response.data.errMsg, {
          position: "bottom-right",
          autoClose: 500,
          toastId: customId,
        });
      }
    } catch (error) {
      onApiError(error);
    }
  };

  const toastId = "customId123";
  const token = userData?.token;

  // handle like and unlike
  const handleLike = async (e, postId) => {
    e.preventDefault();

    // get the icon element
    const icon = e.currentTarget.querySelector(".fa-heart");

    if (icon.classList.contains("fa-regular")) {
      // like post
      try {
        const response = await axios.post(
          `${API_URL}/api/tweet/like/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.isSuccess) {
          toast.success("Post Liked", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId,
          });
          // update the icon's class name
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        } else {
          toast.error(response.data.errMsg, {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId,
          });
        }
      } catch (error) {
        onApiError(error);
      }
    } else {
      // unlike post
      try {
        const response = await axios.post(
          `${API_URL}/api/tweet/dislike/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.isSuccess) {
          toast.success("Post Unliked", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId,
          });
          // update the icon's class name
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      } catch (error) {
        onApiError(error);
      }
    }
  };

  // handle retweet
  const handleRetweet = async (e, tweetId) => {
    e.preventDefault();

    // try to retweet
    try {
      const response = await axios.post(
        `${API_URL}/api/tweet/retweet/${tweetId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        toast.success(response.data.msg, {
          position: "bottom-right",
          autoClose: 500,
          toastId: toastId,
        });
      } else if (response.status === 400) {
        toast.warn(response.data.errMsg, {
          position: "bottom-right",
          autoClose: 500,
          toastId: toastId,
        });
      } else {
        toast.error(response.data.errMsg, {
          position: "bottom-right",
          autoClose: 500,
          toastId: toastId,
        });
      }
    } catch (error) {
      onApiError(error);
    }
  };

  // reply tweet
  const tweetReply = async (e, tweetId, replyMsg) => {
    e.preventDefault();

    // tweet reply
    try {
      const response = await axios.post(
        `${API_URL}/api/tweet/reply/${tweetId}`,
        { content: replyMsg },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      onApiError(error);
    }
  };

  // handle delete tweet request
  const handleDelete = async (e, tweetId) => {
    e.preventDefault();

    // delete tweet
    try {
      const response = await axios.delete(
        `${API_URL}/api/tweet/delete/${tweetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        toast.success(response.data.msg, {
          position: "bottom-right",
          autoClose: 500,
          toastId: toastId,
        });
      } else {
        toast.error(response.data.errMsg, {
          position: "bottom-right",
          autoClose: 500,
          toastId: toastId,
        });
      }
    } catch (error) {
      onApiError(error);
    }
  };

  const navigate = useNavigate();

  // navigate to profile page
  const getProfile = (userId) => {
    navigate(`/profile?userId=${userId}`);
  };

  // go to tweet detail page
  const tweetDetailPage = (tweetId) => {
    navigate(`/tweetDetail/${tweetId}`);
  };

  return (
    <>
      {!user && <Loading />}
      {user && (
        <>
          <div className="mx-auto p-0 row container App">
            <div className="mx-auto p-0 row container">
              <div className="col-4 sidebar">
                <SideBar />
              </div>
              <div className="col-8" style={{ backgroundColor: "#fff" }}>
                <div>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Home
                          onApiError={onApiError}
                          tweetReply={tweetReply}
                          tweetDetailPage={tweetDetailPage}
                          getProfile={getProfile}
                          handleRetweet={handleRetweet}
                          handleDelete={handleDelete}
                          handleLike={handleLike}
                        />
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <Profile
                          onApiError={onApiError}
                          tweetReply={tweetReply}
                          getUserProfile={getUserProfile}
                          getProfile={getProfile}
                          handleRetweet={handleRetweet}
                          handleDelete={handleDelete}
                          handleLike={handleLike}
                        />
                      }
                    />
                    <Route
                      path="/tweetDetail/:tweetId"
                      element={
                        <TweetDetail
                          onApiError={onApiError}
                          tweetReply={tweetReply}
                          tweetDetailPage={tweetDetailPage}
                          getProfile={getProfile}
                          handleRetweet={handleRetweet}
                          handleDelete={handleDelete}
                          handleLike={handleLike}
                        />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
