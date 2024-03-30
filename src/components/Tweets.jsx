import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./tweets.css";
import Loading from "./loading";
import { useSelector } from "react-redux";

const Tweets = ({
  isTweetFetching,
  getProfile,
  handleDelete,
  handleLike,
  handleRetweet,
  tweetDetailPage,
  tweetReply,
  allTweet,
  tweets,
  onApiError,
}) => {
  const thirdLastTweetRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [replyMsg, setReplyMsg] = useState("");

  const closeButtonRef = useRef();

  const toastId = "customID123";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the target element is intersecting (i.e., coming into view)
        if (entries[0].isIntersecting) {
          allTweet();
        }
      },
      {
        threshold: 0.5, // Trigger when the element is 50% visible
      }
    );

    if (thirdLastTweetRef.current) {
      observer.observe(thirdLastTweetRef.current);
    }

    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      if (thirdLastTweetRef.current) {
        observer.unobserve(thirdLastTweetRef.current);
      }
    };
  }, [tweets, thirdLastTweetRef, allTweet]);

  // call function allTweet
  useEffect(() => {
    allTweet();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="tweets w-full">
      {!tweets || Object.keys(tweets) === 0 ? (
        <Loading />
      ) : (
        tweets.map((tweet, index) => (
          <div
            onClick={() => {
              tweetDetailPage(tweet._id);
            }}
            key={tweet._id}
            className="card border-x-0 border-t-0 w-full my-2 py-1"
            style={{ maxWidth: "95%" }}
          >
            {index === tweets.length - 3 ? (
              <div ref={thirdLastTweetRef}></div>
            ) : null}
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
            <div className="ml-2">
              {tweet.retweetBy && tweet.retweetBy.length > 0 && (
                <div className="subtitle">
                  <i
                    className="fa-solid fa-retweet"
                    style={{ color: "#6d6d6d" }}
                  ></i>{" "}
                  Retweeted by <span>{tweet.retweetBy[0].username}</span>
                </div>
              )}
              <div className="user-img flex mt-2 flex-row">
                <img
                  className="img-fluid rounded-circle"
                  src={tweet.tweetedBy.profilePic}
                  alt=""
                />
                <div className="flex flex-col ml-3 my-auto leading-tight">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      getProfile(tweet.tweetedBy._id);
                    }}
                    className="username border-none"
                  >
                    @{tweet.tweetedBy.username}
                  </button>
                  <span className="subtitle">
                    - {new Date(tweet.createdAt).toDateString()}
                  </span>
                </div>
              </div>
              <div className=" ml-[38px]">
                <p className="card-title "></p>
                <div className="card-body">
                  <p className="card-text">{tweet.content}</p>
                  {tweet.image && (
                    <img
                      className="img-fluid h-[500px] mx-auto w-auto mt-2"
                      src={tweet.image}
                      alt=""
                    />
                  )}
                  <button
                    className="post-button mr-4"
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
                    className="post-button mr-4"
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
                    className="post-button mr-4"
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
      {isTweetFetching && <Loading height={100} />}
    </div>
  );
};

export default Tweets;
