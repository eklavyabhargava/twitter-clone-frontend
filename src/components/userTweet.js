import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const UserTweet = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const { getuserId } = useParams();
    const [tweets, setTweets] = useState([]);
    const [replyMsg, setReplyMsg] = useState('');

    const toastId = "customID1";
    const toastId2 = "customID2";

    const closeButtonRef = useRef();

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location = '/login';
    }
    const token = userData?.token;
    const userId = userData?.userId;

    // like tweet
    const likeTweet = async(e, postId) => {
        // call handleLike function
        await props.handleLike(e, postId);

        // update tweets
        allTweet();
    };

    // delete tweet
    const deleteTweet = async(e, postId) => {
        // call handleDelete function
        await props.handleDelete(e, postId);

        // update tweets
        allTweet();
    };

    // Retweet
    const Retweet = async(e, postId) => {
        // call handleRetweet function
        await props.handleRetweet(e, postId);

        // update tweets
        allTweet();
    }

    const tweetReply = async (e, tweetId) => {
        e.preventDefault();

        // tweet reply
        try {
            const response = await axios.post(`${API_URL}/api/tweet/${tweetId}/reply`, { content: replyMsg }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success('Replied On Tweet', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
                allTweet();
            } else {
                toast.error(response.data.Error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId2
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId2
            });
        }
        closeButtonRef.current.click();
    };

    // get all tweets
    const allTweet = () => {
        axios.get(`${API_URL}/api/tweet`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setTweets(response.data.AllTweet);
        }).catch((error) => {
            console.log(error);
        });
    };

    // call function allTweet
    useEffect(() => {
        allTweet();
        // eslint-disable-next-line
    }, []);


    return (
        <>
            <ToastContainer />
            <div className='mt-3'>
                <p className='text-center fw-bold fs-5'>Tweets and Replies</p><div className='tweets'>
                    <div className='tweets'>
                        {!tweets < 0 ? <p>Loading...</p> : tweets.map((tweet) => (
                            tweet.tweetedBy._id === getuserId ? (
                                <div className="card mx-auto my-2 py-1" style={{ maxWidth: "95%" }}>
                                    {tweet.tweetedBy._id === userId && (
                                        <button className="trash-icon" onClick={(e) => deleteTweet(e, tweet._id)} style={{ position: "absolute", top: 10, right: 10, border: "none" }}>
                                            <i className="fa-solid fa-trash-can" style={{ color: "#000000" }}></i>
                                        </button>
                                    )}
                                    <div className="row g-0">
                                        <div className="col-md-1">
                                            <div className="user-img ps-3 pt-2">
                                                <img className='img-fluid rounded-circle' src={`${API_URL}/api/user/${tweet.tweetedBy._id}/profile-pic`} alt='' />
                                            </div>
                                        </div>
                                        <div className="col-md-8 pt-1">
                                            <p className="card-title fs-5 ps-1 mb-0"><button onClick={() => props.getProfile(tweet.tweetedBy._id)} className='username'>@{tweet.tweetedBy.username}</button> <span className='subtitle'>- {new Date(tweet.createdAt).toDateString()}</span></p>
                                            <div className="card-body ps-1 pt-2">
                                                <p className="card-text">{tweet.content}</p>
                                                {tweet.image && (
                                                    <img
                                                        className="img-fluid"
                                                        src={`${API_URL}/api/tweet/${tweet._id}/image`}
                                                        alt=""
                                                    />
                                                )}
                                                <button className='post-button me-3' onClick={(e) => { likeTweet(e, tweet._id) }}>
                                                    <i className={tweet.likes.map((like) => like._id).includes(userId) ? "fa-solid fa-heart pt-2" : "fa-regular fa-heart pt-2"} style={{ color: "#ff006f" }}></i>
                                                    <span className='ps-1'>{tweet.likes.length}</span>
                                                </button>

                                                <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" className='post-button me-3'>
                                                    <i className="fa-regular fa-comment" style={{ color: "#005eff" }}></i>
                                                    <span className='ps-1'>{tweet.replies.length}</span>
                                                </button>

                                                <div onClick={(e) => { e.stopPropagation(); }} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                                                <button type="button" onClick={(e) => { tweetReply(e, tweet._id) }} className="btn btn-primary">Reply</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className='post-button me-3' onClick={(e) => { Retweet(e, tweet._id) }}>
                                                    <i className="fa-solid fa-retweet" style={{ color: "#008a1c" }}></i>
                                                    <span className='ps-1'>{tweet.retweetBy.length}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null)
                        )}
                    </div>
                </div>
            </div>
        </>
    )
};

export default UserTweet;