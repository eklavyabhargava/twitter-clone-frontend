import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify";

const TweetInfo = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const [tweetDetail, setTweetDetail] = useState([]);
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

    useEffect(() => {
        if (props.tweetInfo) {
            setTweetDetail(props.tweetInfo);
        }

        // eslint-disable-next-line
    }, [props.tweetInfo])

    return (
        <>
            <ToastContainer />
            {!tweetDetail < 0 ? <p>Loading...</p> :
                <div className="row g-0">
                    <div className="col-md-1">
                        <div className="user-img ps-3 pt-2">
                            <img className='img-fluid rounded-circle' src={`${API_URL}/api/user/${tweetDetail.tweetedBy._id}/profile-pic`} alt='' />
                        </div>
                    </div>
                    <div className="col-md-8 pt-1">
                        <p className="card-title fs-5 ps-1 mb-0"><button onClick={() => props.getProfile(tweetDetail.tweetedBy._id)} className='username'>@{tweetDetail.tweetedBy.username}</button> <span className='subtitle'>- {new Date(tweetDetail.createdAt).toDateString()}</span></p>
                        <div className="card-body ps-1 pt-2">
                            <p className="card-text">{tweetDetail.content}</p>
                            {tweetDetail.image && (
                                <img
                                    className="img-fluid"
                                    src={`${API_URL}/api/tweet/${tweetDetail._id}/image`}
                                    alt=""
                                />
                            )}
                            <button className='post-button me-3' onClick={(e) => { likeTweet(e, tweetDetail._id) }}>
                                <i className={tweetDetail.likes.map((like) => like._id).includes(userData.userId) ? "fa-solid fa-heart pt-2" : "fa-regular fa-heart pt-2"} style={{ color: "#ff006f" }}></i>
                                <span className='ps-1'>{tweetDetail.likes.length}</span>
                            </button>

                            <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" className='post-button me-3'>
                                <i className="fa-regular fa-comment" style={{ color: "#005eff" }}></i>
                                <span className='ps-1'>{tweetDetail.replies.length}</span>
                            </button>

                            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Tweet your reply</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <textarea value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" ref={closeButtonRef} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" onClick={(e) => { tweetReply(e, tweetDetail._id) }} className="btn btn-primary">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className='post-button me-3' onClick={(e) => { retweet(e, tweetDetail._id) }}>
                                <i className="fa-solid fa-retweet" style={{ color: "#008a1c" }}></i>
                                <span className='ps-1'>{tweetDetail.retweetBy.length}</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default TweetInfo