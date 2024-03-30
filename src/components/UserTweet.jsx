import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApiUrl } from "../App";
import Loading from "./loading";
import { useSelector } from "react-redux";

const UserTweet = ({
  userId,
  handleLike,
  handleRetweet,
  handleDelete,
  getProfile,
  tweetReply,
  onApiError,
}) => {
  // api url
  const API_URL = useApiUrl();
  const [tweets, setTweets] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const user = useSelector((state) => state.user);

  const toastId = "customID1";

  const closeButtonRef = useRef();

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
    const postIndex = tweets.findIndex((tweet) => tweet._id === postId);
    if (tweets[postIndex]?.retweetBy.includes(user._id)) {
      toast.error("Already retweeted!", {
        position: "bottom-right",
        delay: 500,
        toastId: toastId,
      });
      return;
    }
    // call handleRetweet function
    await handleRetweet(e, postId);

    // // update tweets
    allTweet();
  };

  const handleTweetReply = async (e, tweetId) => {
    const response = await tweetReply(e, tweetId, replyMsg);
    if (response.data.isSuccess) {
      toast.success("Reply tweeted", {
        position: "bottom-right",
        autoClose: 500,
        toastId: toastId,
      });
      allTweet();
    } else {
      toast.error("Something went wrong!", {
        position: "bottom-right",
        autoClose: 500,
        toastId: toastId,
      });
    }
    closeButtonRef.current.click();
  };

  // get all tweets
  const allTweet = () => {
    axios
      .get(`${API_URL}/api/tweet/user-tweets/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.isSuccess) {
          setTweets(response.data.tweets);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((error) => {
        onApiError(error);
      });
  };

  // call function allTweet
  useEffect(() => {
    allTweet();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <>
      <div className="mt-3">
        <p className="text-center fw-bold fs-5">Tweets and Replies</p>
        <div className="tweets">
          <div className="tweets">
            {!tweets || tweets.length < 0 ? (
              <Loading />
            ) : (
              tweets.map((tweet) => (
                <div
                  className="card mx-auto my-2 py-1"
                  style={{ maxWidth: "95%" }}
                  key={tweet._id}
                >
                  {tweet.tweetedBy._id === user._id && (
                    <button
                      className="trash-icon"
                      onClick={(e) => deleteTweet(e, tweet._id)}
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
                      <div className="user-img ps-3 pt-2">
                        <img
                          className="img-fluid rounded-circle"
                          src={tweet.tweetedBy.profilePic}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="col-md-8 pt-1">
                      <p className="card-title fs-5 ps-1 mb-0">
                        <button
                          onClick={() => getProfile(tweet.tweetedBy._id)}
                          className="username"
                        >
                          @{tweet.tweetedBy.username}
                        </button>{" "}
                        <span className="subtitle">
                          - {new Date(tweet.createdAt).toDateString()}
                        </span>
                      </p>
                      <div className="card-body ps-1 pt-2">
                        <p className="card-text">{tweet.content}</p>
                        {tweet.image && (
                          <img className="img-fluid" src={tweet.image} alt="" />
                        )}
                        <button
                          className="post-button me-3"
                          onClick={(e) => {
                            likeTweet(e, tweet._id);
                          }}
                        >
                          <i
                            className={
                              tweet.likes.includes(user._id)
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
                          data-bs-target="#commentBackdrop"
                          className="post-button me-3"
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
                          id="commentBackdrop"
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
                                  onChange={(e) => setReplyMsg(e.target.value)}
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
        </div>
      </div>
    </>
  );
};

export default UserTweet;
