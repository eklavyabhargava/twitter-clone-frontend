import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./loading";
import { useSelector } from "react-redux";

const TweetInfo = ({
  getTweetDetail,
  handleLike,
  handleRetweet,
  tweetInfo,
  tweetReply,
  getProfile,
  onApiError,
}) => {
  const user = useSelector((state) => state.user);
  const [tweetDetail, setTweetDetail] = useState({});
  const [replyMsg, setReplyMsg] = useState("");
  const closeButtonRef = useRef();
  const toastId = "toastId1";

  // tweet reply to someone's post
  const handleTweetReply = async (e, replyId) => {
    const response = await tweetReply(e, replyId, replyMsg);
    if (response.isSuccess) {
      toast.success("Reply tweeted!", {
        position: "bottom-right",
        autoClose: 500,
        toastId: toastId,
      });
      getTweetDetail();
    } else {
      toast.error("Something went wrong!", {
        position: "bottom-right",
        autoClose: 500,
        toastId: toastId,
      });
    }
    closeButtonRef.current.click();
  };

  const likeTweet = async (e, tweetId) => {
    // call handleLike function
    await handleLike(e, tweetId);

    // update tweet detail
    getTweetDetail();
  };

  const retweet = async (e, tweetId) => {
    // call handleRetweet function
    await handleRetweet(e, tweetId);

    // update tweet detail
    getTweetDetail();
  };

  useEffect(() => {
    setTweetDetail(tweetInfo);

    // eslint-disable-next-line
  }, [tweetInfo]);

  return (
    <>
      {!tweetDetail || Object.keys(tweetDetail).length === 0 ? (
        <Loading />
      ) : (
        <div className="row g-0">
          <div className="col-md-1">
            <div className="user-img ps-3 pt-2">
              <img
                className="img-fluid rounded-circle"
                src={tweetDetail.tweetedBy.profilePic}
                alt=""
              />
            </div>
          </div>
          <div className="col-md-8 pt-1">
            <p className="card-title fs-5 ps-1 mb-0">
              <button
                onClick={() => getProfile(tweetDetail.tweetedBy._id)}
                className="username"
              >
                @{tweetDetail.tweetedBy.username}
              </button>{" "}
              <span className="subtitle">
                - {new Date(tweetDetail.createdAt).toDateString()}
              </span>
            </p>
            <div className="card-body ps-1 pt-2">
              <p className="card-text">{tweetDetail.content}</p>
              {tweetDetail.image && (
                <img
                  className="img-fluid max-h-[500px] md:h-[500px] mx-auto w-auto mt-2"
                  src={tweetDetail.image}
                  alt=""
                />
              )}
              <button
                className="post-button me-3"
                onClick={(e) => {
                  likeTweet(e, tweetDetail._id);
                }}
              >
                <i
                  className={
                    tweetDetail.likes.map((like) => like._id).includes(user._id)
                      ? "fa-solid fa-heart pt-2"
                      : "fa-regular fa-heart pt-2"
                  }
                  style={{ color: "#ff006f" }}
                ></i>
                <span className="ps-1">{tweetDetail.likes.length}</span>
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
                <span className="ps-1">{tweetDetail.replies.length}</span>
              </button>

              <div
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
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">
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
                          handleTweetReply(e, tweetDetail._id);
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
                  retweet(e, tweetDetail._id);
                }}
              >
                <i
                  className="fa-solid fa-retweet"
                  style={{ color: "#008a1c" }}
                ></i>
                <span className="ps-1">{tweetDetail.retweetBy.length}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TweetInfo;
