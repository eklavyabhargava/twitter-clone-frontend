import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./homePage.css";
import Tweet from "./Tweets";
import { useApiUrl } from "../App";
import { reAuthenticate } from "../routes/AuthRoute";
import TweetModal from "./TweetModal";
import { useSelector } from "react-redux";

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

  const toastId = "Toast1";
  const closeButtonRef = useRef();
  const [page, setPage] = useState(1);
  const [tweets, setTweets] = useState([]);
  const [isTweetPosting, setTweetPosting] = useState(false);
  const user = useSelector((state) => state.user);
  const [isTweetFetching, setTweetFetching] = useState(false);
  const [hasMoreTweets, setMoreTweets] = useState(true);

  const customId = "customId1";
  const userData = JSON.parse(localStorage.getItem("userData"));

  const likeUnlikeTweet = (tweetId) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) => {
        if (tweet._id === tweetId) {
          const likedByCurrentUser = tweet.likes.some(
            (like) => like._id === user._id
          );
          if (likedByCurrentUser) {
            // User has already liked the tweet, remove their ID from likes
            tweet.likes = tweet.likes.filter((like) => like._id !== user._id);
          } else {
            // User has not liked the tweet, include their ID in likes
            tweet.likes.push({
              _id: user._id,
              name: user.name,
              username: user.username,
              profilePic: user.profilePic,
            });
          }
        }
        return tweet;
      })
    );
  };

  // get all tweets
  const allTweet = () => {
    if (isTweetFetching || !hasMoreTweets) return;
    setTweetFetching(true);

    axios
      .get(`${API_URL}/api/tweet/get-tweets?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.isSuccess) {
          setPage((curr) => curr + 1);
          const newTweets = response.data.tweets;
          if (newTweets.length === 0) {
            setMoreTweets(false); // No more tweets available
          } else {
            setTweets((prevTweets) => [...prevTweets, ...newTweets]);
          }
        } else {
          toast.error("Something went wrong!", {
            position: "bottom-right",
            delay: 500,
            toastId: toastId,
          });
        }
        setTweetFetching(false);
      })
      .catch((error) => {
        if (error.response?.status !== 500) {
          toast.error(error.response.data.errMsg || "Something went wrong!", {
            position: "bottom-right",
            delay: 500,
            toastId: toastId,
          });
          if (error.response?.status === 401) {
            toast.error(error.response.data.errMsg || "Please login again", {
              position: "bottom-right",
              delay: 500,
              toastId: toastId,
            });
            reAuthenticate();
          }
        } else {
          toast.error("Internal server error!", {
            position: "bottom-right",
            delay: 500,
            toastId: toastId,
          });
        }
        setTweetFetching(false);
      });
  };

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
        position: "bottom-right",
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

      setTweetPosting(true);
      axios
        .post(`${API_URL}/api/tweet/create-tweet`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setTweetPosting(false);
          closeButtonRef.current.click();
          toast.update(loading, {
            render: response.data.isSuccess
              ? `Tweet Posted`
              : "Something went wrong",
            type: response.data.isSuccess ? "success" : "error",
            isLoading: false,
            autoClose: 500,
          });
          setTweets((prevTweets) => {
            return [response.data.tweet, ...prevTweets];
          });
        })
        .catch((error) => {
          setTweetPosting(false);
          closeButtonRef.current.click();
          toast.update(loading, {
            render:
              error.response.status === 500
                ? "Internal server error!"
                : "Some Error Occurred!",
            isLoading: false,
            type: "error",
            autoClose: 500,
          });
          if (error.response.status === 401) {
            reAuthenticate();
          }
        });
    }
  };

  return (
    <div className="mt-1 pt-1 w-full">
      <Tweet
        setTweets={setTweets}
        likeUnlikeTweet={likeUnlikeTweet}
        isTweetFetching={isTweetFetching}
        tweets={tweets}
        allTweet={allTweet}
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
            isTweetPosting={isTweetPosting}
            closeButtonRef={closeButtonRef}
            handleTweet={handleTweet}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
