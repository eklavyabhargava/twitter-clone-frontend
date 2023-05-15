import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from '../components/homePage';

const Home = (props) => {

    return (
        <>
            <ToastContainer />
            <HomePage tweetDetailPage={props.tweetDetailPage} handleLike={props.handleLike} getProfile={props.getProfile} handleRetweet={props.handleRetweet} handleDelete={props.handleDelete} />
        </>
    )
}

export default Home;