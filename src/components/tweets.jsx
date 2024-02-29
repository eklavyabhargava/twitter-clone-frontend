import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./tweets.css";
import axios from "axios";
import { useApiUrl } from "../App";
import Loading from "./loading";
import { useSelector } from "react-redux";
import { reAuthenticate } from "../routes/authRoute";
import { useNavigate } from "react-router-dom";

const Tweets = ({
  getProfile,
  handleDelete,
  handleLike,
  handleRetweet,
  tweetDetailPage,
  tweetReply,
}) => {
  // api url
  const API_URL = useApiUrl();
  const user = useSelector((state) => state.user);
  const [tweets, setTweets] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const navigate = useNavigate();

  const closeButtonRef = useRef();

  const toastId = "customID123";
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  // like tweet
  const likeTweet = async (e, postId) => {
    // call handleLike function
    await handleLike(e, postId);

    // update tweets
    allTweet();
  };

  // delete tweet
  const deleteTweet = async (e, postId) => {
    // call handleDelete function
    await handleDelete(e, postId);

    // update tweets
    allTweet();
  };

  // Retweet
  const Retweet = async (e, postId) => {
    // call handleRetweet function
    await handleRetweet(e, postId);

    // update tweets
    allTweet();
  };

  const handleTweetReply = async (e, tweetId) => {
    // tweet replyS
    const response = await tweetReply(e, tweetId, replyMsg);
    if (response.isSuccess) {
      toast.success("Reply tweeted", {
        position: "bottom-right",
        toastId: toastId,
        autoClose: 500,
      });
    } else {
      toast.error("Something went wrong!", {
        position: "bottom-right",
        toastId: toastId,
        autoClose: 500,
      });
    }
    closeButtonRef.current.click();
  };

  // get all tweets
  const allTweet = () => {
    axios
      .get(`${API_URL}/api/tweet/get-tweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.isSuccess) {
          setTweets(response.data.tweets);
        } else {
          toast.error("Something went wrong!", {
            position: "bottom-right",
            delay: 500,
            toastId: toastId,
          });
        }
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
            navigate("/login");
          }
        } else {
          toast.error("Internal server error!", {
            position: "bottom-right",
            delay: 500,
            toastId: toastId,
          });
        }
      });
  };

  // call function allTweet
  useEffect(() => {
    allTweet();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="tweets">
      {!tweets || Object.keys(tweets) === 0 ? (
        <Loading />
      ) : (
        tweets.map((tweet) => (
          <div
            onClick={() => {
              tweetDetailPage(tweet._id);
            }}
            key={tweet._id}
            className="card mx-auto my-2 py-1"
            style={{ maxWidth: "95%" }}
          >
            {tweet.tweetedBy._id === user._id && (
              <button
                className="trash-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTweet(e, tweet._id);
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  border: "none",
                }}
              >
                <i
                  className="fa-solid fa-trash-can"
                  style={{ color: "#000000" }}
                ></i>
              </button>
            )}
            <div className="row g-0">
              <div className="col-md-1">
                <div className="user-img ps-3 mt-4 pt-1">
                  <img
                    className="img-fluid rounded-circle"
                    src={`${API_URL}/${tweet.tweetedBy._id}/profile-pic`}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-md-8 pt-1">
                <div className="p-0 ps-1 m-0 subtitle">
                  <i
                    className="fa-solid fa-retweet"
                    style={{ color: "#6d6d6d" }}
                  ></i>{" "}
                  Retweeted by{" "}
                  {tweet.retweetBy && tweet.retweetBy.length > 0 && (
                    <span>{tweet.retweetBy[0].username}</span>
                  )}
                </div>
                <p className="card-title fs-5 mt-0 pt-0 ps-1 mb-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      getProfile(tweet.tweetedBy._id);
                    }}
                    className="username"
                  >
                    @{tweet.tweetedBy.username}
                  </button>{" "}
                  <span className="subtitle">
                    - {new Date(tweet.createdAt).toDateString()}
                  </span>
                </p>
                <div className="card-body ps-1 pt-1">
                  <p className="card-text mb-2">{tweet.content}</p>
                  {tweet.image && (
                    <img
                      className="img-fluid mt-0"
                      src={`${API_URL}/post-image/${tweet._id}`}
                      alt=""
                    />
                  )}
                  <button
                    className="post-button me-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      likeTweet(e, tweet._id);
                    }}
                  >
                    <i
                      className={
                        tweet.likes.map((like) => like._id).includes(user._id)
                          ? "fa-solid fa-heart pt-2"
                          : "fa-regular fa-heart pt-2"
                      }
                      style={{ color: "#ff006f" }}
                    ></i>
                    <span className="ps-1">{tweet.likes.length}</span>
                  </button>

                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#replyBackdrop"
                    className="post-button me-3"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <i
                      className="fa-regular fa-comment"
                      style={{ color: "#005eff" }}
                    ></i>
                    <span className="ps-1">{tweet.replies.length}</span>
                  </button>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="modal fade"
                    id="replyBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="staticBackdropLabel"
                          >
                            Tweet your reply
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <textarea
                            value={replyMsg}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onChange={(e) => {
                              e.stopPropagation();
                              setReplyMsg(e.target.value);
                            }}
                            className="form-control"
                            rows="3"
                          ></textarea>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            ref={closeButtonRef}
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTweetReply(e, tweet._id);
                            }}
                            className="btn btn-primary"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="post-button me-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      Retweet(e, tweet._id);
                    }}
                  >
                    <i
                      className="fa-solid fa-retweet"
                      style={{ color: "#008a1c" }}
                    ></i>
                    <span className="ps-1">{tweet.retweetBy.length}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tweets;
