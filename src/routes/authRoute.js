import { Routes, Route, useNavigate } from 'react-router-dom';
import Profile from '../pages/profile';
import Home from '../pages/home';
import SideBar from '../components/sideBar';
import TweetDetail from '../pages/tweetDetail'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export default function AuthRoutes() {

    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    // get logged in user data
    const userData = JSON.parse(localStorage.getItem('userData'));

    const userName = userData?.name;
    const username = userData?.username;
    const userId = userData?.userId;

    const customId = "custom1";

    // get single user details
    const getUserProfile = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });
            if (response.status === 200) {
                return response.data;
            } else {
                toast.error(response.data.Error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: customId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: customId
            })
        }
    }

    const toastId = "customId123";
    const token = userData?.token;

    // handle like and unlike
    const handleLike = async (e, postId) => {
        e.preventDefault();

        // get the icon element
        const icon = e.currentTarget.querySelector('.fa-heart');

        if (icon.classList.contains('fa-regular')) {
            // like post
            try {
                const response = await axios.post(`${API_URL}/api/tweet/${postId}/like`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    toast.success('Post Liked', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                        toastId: toastId
                    });
                    // update the icon's class name
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                } else {
                    console.log(response.data.Error);
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
        } else {
            // unlike post
            try {
                const response = await axios.post(`${API_URL}/api/tweet/${postId}/dislike`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    toast.success('Post Unliked', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                        toastId: toastId
                    });
                    // update the icon's class name
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                }
            } catch (error) {
                console.log(error.response.data.Error);
                toast.error(error.response.data.Error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
            }
        }
    }

    // handle retweet
    const handleRetweet = async (e, tweetId) => {
        e.preventDefault();

        // try to retweet
        try {
            const response = await axios.post(`${API_URL}/api/tweet/${tweetId}/retweet`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success(response.data.Success, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
            } else if (response.status === 400) {
                toast.warn(response.data.Error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
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
    }

    // handle delete tweet request
    const handleDelete = async (e, tweetId) => {
        e.preventDefault();

        // delete tweet
        try {
            const response = await axios.delete(`${API_URL}/api/tweet/${tweetId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success(response.data.Success, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
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
    }

    const navigate = useNavigate();

    // navigate to profile page
    const getProfile = (getUserId) => {
        navigate(`/profile/${getUserId}`);
    }

    // go to tweet detail page
    const tweetDetailPage = (tweetId) => {
        navigate(`/tweetDetail/${tweetId}`);
    }

    return (
        <>
            <ToastContainer />
            <div className="mx-auto p-0 row container App">
                <div className='mx-auto p-0 row container'>
                    <div className='col-4 sidebar'>
                        <SideBar getUserProfile={getUserProfile} name={userName} username={username} userId={userId} />
                    </div>
                    <div className='col-8' style={{ backgroundColor: "#fff" }}>
                        <div>
                            <Routes>
                                <Route path='/' element={<Home tweetDetailPage={tweetDetailPage} getProfile={getProfile} handleRetweet={handleRetweet} handleDelete={handleDelete} handleLike={handleLike} />} />
                                <Route path='/profile/:getuserId' element={<Profile getUserProfile={getUserProfile} getProfile={getProfile} handleRetweet={handleRetweet} handleDelete={handleDelete} handleLike={handleLike} />} />
                                <Route path='/tweetDetail/:tweetId' element={<TweetDetail tweetDetailPage={tweetDetailPage} getProfile={getProfile} handleRetweet={handleRetweet} handleDelete={handleDelete} handleLike={handleLike} />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}