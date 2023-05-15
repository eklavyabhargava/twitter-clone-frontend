import { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './tweets.css'
import axios from 'axios';

const Tweets = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const [tweets, setTweets] = useState([]);
    const [replyMsg, setReplyMsg] = useState('');

    const closeButtonRef = useRef();

    const toastId = "customID123";
    const toastId2 = "customID12345";
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = userData?.token;


    // like tweet
    const likeTweet = async (e, postId) => {
        // call handleLike function
        await props.handleLike(e, postId);

        // update tweets
        allTweet();
    };

    // delete tweet
    const deleteTweet = async (e, postId) => {
        // call handleDelete function
        await props.handleDelete(e, postId);

        // update tweets
        allTweet();
    };

    // Retweet
    const Retweet = async (e, postId) => {
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
        console.log(API_URL);
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
        <div className='tweets'>
            <ToastContainer />
            {!tweets ? <p>Loading...</p> : tweets.map((tweet) => (
                <div onClick={() => { props.tweetDetailPage(tweet._id) }} className="card mx-auto my-2 py-1" style={{ maxWidth: "95%" }}>
                    {tweet.tweetedBy._id === userData?.userId && (
                        <button className="trash-icon" onClick={(e) => { e.stopPropagation(); deleteTweet(e, tweet._id) }} style={{ position: "absolute", top: 10, right: 10, border: "none" }}>
                            <i className="fa-solid fa-trash-can" style={{ color: "#000000" }}></i>
                        </button>
                    )}
                    <div className="row g-0">
                        <div className="col-md-1">
                            <div className="user-img ps-3 mt-4 pt-1">
                                <img className='img-fluid rounded-circle' src={`${API_URL}/api/user/${tweet.tweetedBy._id}/profile-pic`} alt='' />
                            </div>
                        </div>
                        <div className="col-md-8 pt-1">
                            <div className='p-0 ps-1 m-0 subtitle'><i className="fa-solid fa-retweet" style={{ color: "#6d6d6d" }}></i> Retweeted by {tweet.retweetBy && tweet.retweetBy.length > 0 && (
                                <span>{tweet.retweetBy[0].username}</span>
                            )}
                            </div>
                            <p className="card-title fs-5 mt-0 pt-0 ps-1 mb-0"><button onClick={(e) => { e.stopPropagation(); props.getProfile(tweet.tweetedBy._id) }} className='username'>@{tweet.tweetedBy.username}</button> <span className='subtitle'>- {new Date(tweet.createdAt).toDateString()}</span></p>
                            <div className="card-body ps-1 pt-1">
                                <p className="card-text mb-2">{tweet.content}</p>
                                {tweet.image && (
                                    <img
                                        className="img-fluid mt-0"
                                        src={`${API_URL}/api/tweet/${tweet._id}/image`}
                                        alt=""
                                    />
                                )}
                                <button className='post-button me-3' onClick={(e) => { e.stopPropagation(); likeTweet(e, tweet._id) }}>
                                    <i className={tweet.likes.map((like) => like._id).includes(userData.userId) ? "fa-solid fa-heart pt-2" : "fa-regular fa-heart pt-2"} style={{ color: "#ff006f" }}></i>
                                    <span className='ps-1'>{tweet.likes.length}</span>
                                </button>

                                <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" className='post-button me-3' onClick={(e) => { e.stopPropagation(); }}>
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
                                                <textarea value={replyMsg} onClick={(e) => { e.stopPropagation(); }} onChange={(e) => { e.stopPropagation(); setReplyMsg(e.target.value) }} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" ref={closeButtonRef} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); tweetReply(e, tweet._id) }} className="btn btn-primary">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className='post-button me-3' onClick={(e) => { e.stopPropagation(); Retweet(e, tweet._id) }}>
                                    <i className="fa-solid fa-retweet" style={{ color: "#008a1c" }}></i>
                                    <span className='ps-1'>{tweet.retweetBy.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Tweets;