import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./homePage.css";
import Tweet from "./Tweets";
import { useApiUrl } from "../App";
import { reAuthenticate } from "../routes/AuthRoute";
import TweetModal from "./TweetModal";

const HomePage = ({
  tweetDetailPage,
  handleDelete,
  handleLike,
  handleRetweet,
  getProfile,
  tweetReply,
  onApiError,
}) => {
  // api url
  const API_URL = useApiUrl();

  const navigate = useNavigate();
  const closeButtonRef = useRef();

  const customId = "customId1";
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    navigate("/login");
  }

  const token = userData?.token;

  const handleTweet = (content) => {
    const loading = toast.loading("Loading...", { toastId: customId });

    // check for blank content msg
    if (content === "") {
      toast.update(loading, {
        render: `Content Message is blank.`,
        type: "error",
        isLoading: false,
        autoClose: 500,
      });
    } else {
      // get the image file from input element
      const imgFile = document.querySelector("#formFile").files[0];

      // create formData object to store both file and tweet msg
      const formData = new FormData();

      // append content to formData
      formData.append("content", content);

      // append image file if available
      if (imgFile) {
        formData.append("image", imgFile);
      }

      axios
        .post(`${API_URL}/api/tweet/create-tweet`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.update(loading, {
            render: response.data.isSuccess
              ? `Tweet Posted`
              : "Something went wrong",
            type: response.data.isSuccess ? "success" : "error",
            isLoading: false,
            autoClose: 500,
          });
          closeButtonRef.current.click();
        })
        .catch((error) => {
          closeButtonRef.current.click();
          toast.error(
            error.response.data.errMsg ??
              (error.response.status === 500
                ? "Internal server error!"
                : "Some Error Occurred!"),
            {
              position: "bottom-right",
              autoClose: 500,
              toastId: "toast",
            }
          );
          if (error.response.status === 401) {
            reAuthenticate();
            navigate("/login");
          }
        });
    }
  };

  return (
    <div className="mt-1 pt-1 w-full">
      <Tweet
        tweetReply={tweetReply}
        tweetDetailPage={tweetDetailPage}
        handleLike={handleLike}
        getProfile={getProfile}
        handleRetweet={handleRetweet}
        handleDelete={handleDelete}
        onApiError={onApiError}
      />
      <div className="w-full flex justify-end">
        <div
          className="cursor-pointer p-2 bg-btn-bg hover:bg-btn-hover rounded-3xl fixed bottom-5 right-5 shadow-md"
          data-bs-toggle="modal"
          data-bs-target="#tweetModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-white block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <div
          className="modal fade"
          id="tweetModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <TweetModal
            closeButtonRef={closeButtonRef}
            handleTweet={handleTweet}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
