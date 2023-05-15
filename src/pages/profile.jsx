import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './profile.css';
import { useParams } from 'react-router-dom';
import UserInfo from '../components/userInfo';
import UserTweet from '../components/userTweet';

const Profile = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const { getuserId } = useParams();

    return (
        <>
            <ToastContainer />
            <div>
                <p className='fw-bold fs-3'>Profile</p>
                <div className='profile mb-2'>
                    <img className='img-fluid mb-0 pb-0 rounded-circle ms-3 position-relative top-100 start-0 translate-middle-y' src={`${API_URL}/api/user/${getuserId}/profile-pic`} alt='' />
                </div>
                <div className='position-relative user-detail top-100 ms-3'>
                    <UserInfo getUserProfile={props.getUserProfile} />
                    <UserTweet getProfile={props.getProfile} handleRetweet={props.handleRetweet} handleDelete={props.handleDelete} handleLike={props.handleLike} />
                </div>
            </div>
        </>
    )
}

export default Profile;