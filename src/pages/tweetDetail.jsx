import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TweetInfo from '../components/tweetDetail';
import TweetReplies from '../components/tweetReplies';


const TweetDetail = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';


    const { tweetId } = useParams();
    const [tweetDetail, setTweetDetail] = useState([]);

    const toastId = "toastId1";

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location = '/login';
    }

    // get tweet detail
    const getTweetDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tweet/${tweetId}`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });
            if (response.status === 200) {
                setTweetDetail(response.data.Tweet);
            } else {
                toast.error(response.data.Error || "Some Error Occurred!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error || "Internal Server Error", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId
            });
        }
    }

    useEffect(() => {
        // call function getTweetDetail
        getTweetDetail();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div>
                <p className='fw-bold fs-3'>Tweet</p>
                <TweetInfo API_URL={API_URL} tweetInfo={tweetDetail} handleLike={props.handleLike} handleRetweet={props.handleRetweet} handleDelete={props.handleDelete} getTweetDetail={getTweetDetail} />

                <p className='fw-bold fs-5 mt-4'>Replies</p>
                <TweetReplies API_URL={API_URL} tweetInfo={tweetDetail} tweetDetailPage={props.tweetDetailPage} handleLike={props.handleLike} handleRetweet={props.handleRetweet} handleDelete={props.handleDelete} getTweetDetail={getTweetDetail} />
            </div >
        </>
    )
}

export default TweetDetail;