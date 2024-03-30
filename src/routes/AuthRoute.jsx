import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import TweetDetail from "../pages/TweetDetail";
import { toast } from "react-toastify";
import axios from "axios";
import { useApiUrl } from "../App";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../shared/actions";
import Loading from "../components/loading";
import NavBar from "../components/NavBar";
import { useEffect } from "react";

export function reAuthenticate() {
  localStorage.removeItem("userData");
  window.location = "/login";
}

export default function AuthRoutes() {
  // api url
  const API_URL = useApiUrl();
  const user = useSelector((state) => state.user);
  let isUserActive = false;

  const dispatch = useDispatch();

  // Event listener to track user activity
  document.addEventListener("mousemove", () => {
    isUserActive = true;
  });

  // Function to send active status to server
  function sendActiveStatus() {
    if (!userData?.token) return;
    if (!isUserActive) reAuthenticate();
    axios
      .post(
        `${API_URL}/api/user/active-status`,
        { activeStatus: isUserActive },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
      .then((response) => {
        const { data } = response;
        if (data.isSuccess) {
          localStorage.setItem(
            "userData",
            JSON.stringify({
              token: data.Token,
            })
          );
        } else {
          reAuthenticate();
        }
      })
      .catch((error) => {
        reAuthenticate();
      });
    isUserActive = false;
  }

  // Send active status every hour
  setInterval(sendActiveStatus, 60 * 60 * 1000);

  function onApiError(error) {
    toast.error(
      error?.response?.data?.errMsg ??
        (error.response?.status && error.response.status === 500
          ? "Internal server error!"
          : "Something went wrong!"),
      {
        position: "bottom-right",
        autoClose: 1000,
        toastId: toastId,
      }
    );
    if (error?.response?.status && error.response.status === 401) {
      reAuthenticate();
    }
  }

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
      const response = await axios.get(
        `${API_URL}/api/user/get-user-details/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
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
  });

  return (
    <>
      {!user && <Loading />}
      {user && (
        <div className="flex flex-col justify-center w-full md:w-[80%] mx-auto">
          <div className="fixed w-full md:w-[80%] top-0 bg-white z-10">
            <NavBar onApiError={onApiError} token={token} />
          </div>
          <div
            className="relative md:w-[90%] w-full mx-auto mt-16"
            style={{ backgroundColor: "" }}
          >
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
      )}
    </>
  );
}
