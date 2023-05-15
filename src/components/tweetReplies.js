import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify";

const TweetReplies = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const [tweetDetail, setTweetDetail] = useState({});
    const [replyMsg, setReplyMsg] = useState('');
    const closeButtonRef = useRef();

    const toastId = "toastId1";

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location = '/login';
    }

    // tweet reply to someone's post
    const tweetReply = async (e, replyId) => {
        e.preventDefault();

        // tweet reply
        try {
            const response = await axios.post(`${API_URL}/api/tweet/${replyId}/reply`, { content: replyMsg }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });
            if (response.status === 200) {
                toast.success('Replied On Tweet', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
                props.getTweetDetail();
            } else {
                toast.error(response.data.Error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId
            });
        }
        closeButtonRef.current.click();
    }

    const likeTweet = async (e, tweetId) => {
        // call handleLike function
        await props.handleLike(e, tweetId);

        // update tweet detail
        props.getTweetDetail();
    }

    const retweet = async (e, tweetId) => {
        // call handleRetweet function
        await props.handleRetweet(e, tweetId);

        // update tweet detail
        props.getTweetDetail();
    }

    // navigate to reply detail
    const replyDetailPage = (replyId) => {
        window.location = `/tweetDetail/${replyId}`;
    }

    useEffect(() => {
        if (props.tweetInfo && !tweetDetail.length) {
            setTweetDetail(props.tweetInfo);
        }
    }, [props.tweetInfo, tweetDetail.length]);

    return (
        <>
            <ToastContainer />
            {tweetDetail && tweetDetail.replies && tweetDetail.replies.length !== 0 ? tweetDetail.replies.map((reply) => (
                <div onClick={() => { replyDetailPage(reply._id) }} className="card mx-auto my-2 py-1" style={{ maxWidth: "95%" }}>
                    {reply.tweetedBy._id === userData?.userId && (
                        <button className="trash-icon" onClick={(e) => { e.stopPropagation(); props.handleDelete(e, reply._id); props.getTweetDetail() }} style={{ position: "absolute", top: 10, right: 10, border: "none" }}>
                            <i className="fa-solid fa-trash-can" style={{ color: "#000000" }}></i>
                        </button>
                    )}
                    <div className="row g-0">
                        <div className="col-md-1">
                            <div className="user-img ps-3 mt-4 pt-1">
                                <img className='img-fluid rounded-circle' src={`${API_URL}/api/user/${reply.tweetedBy._id}/profile-pic`} alt='' />
                            </div>
                        </div>
                        <div className="col-md-8 pt-1">
                            <div className='p-0 ps-1 m-0 subtitle'><i className="fa-solid fa-retweet" style={{ color: "#6d6d6d" }}></i> Retweeted by {reply.retweetBy && reply.retweetBy.length > 0 && (
                                <span>{reply.retweetBy[0].username}</span>
                            )}
                            </div>
                            <p className="card-title fs-5 mt-0 pt-0 ps-1 mb-0"><button onClick={(e) => { e.stopPropagation(); props.getProfile(reply.tweetedBy._id) }} className='username'>@{reply.tweetedBy.username}</button> <span className='subtitle'>- {new Date(reply.createdAt).toDateString()}</span></p>
                            <div className="card-body ps-1 pt-2">
                                <p className="card-text">{reply.content}</p>
                                <button className='post-button me-3' onClick={(e) => { e.stopPropagation(); likeTweet(e, reply._id) }}>
                                    <i className={reply.likes.map((like) => like._id).includes(userData.userId) ? "fa-solid fa-heart pt-2" : "fa-regular fa-heart pt-2"} style={{ color: "#ff006f" }}></i>
                                    <span className='ps-1'>{reply.likes.length}</span>
                                </button>

                                <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop2" className='post-button me-3' onClick={(e) => { e.stopPropagation(); }}>
                                    <i className="fa-regular fa-comment" style={{ color: "#005eff" }}></i>
                                    <span className='ps-1'>{reply.replies.length}</span>
                                </button>

                                <div onClick={(e) => { e.stopPropagation(); }} className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Tweet your reply</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <textarea value={replyMsg} onClick={(e) => { e.stopPropagation(); }} onChange={(e) => { e.stopPropagation(); setReplyMsg(e.target.value) }} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" ref={closeButtonRef} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); tweetReply(e, reply._id) }} className="btn btn-primary">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className='post-button me-3' onClick={(e) => { e.stopPropagation(); retweet(e, reply._id) }}>
                                    <i className="fa-solid fa-retweet" style={{ color: "#008a1c" }}></i>
                                    <span className='ps-1'>{reply.retweetBy.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : null}
        </>
    )
};

export default TweetReplies;