import "react-toastify/dist/ReactToastify.css";
import HomePage from "../components/homePage";

const Home = ({
  tweetDetailPage,
  handleLike,
  getProfile,
  handleRetweet,
  handleDelete,
  tweetReply,
  onApiError,
}) => {
  return (
    <>
      <HomePage
        onApiError={onApiError}
        tweetReply={tweetReply}
        tweetDetailPage={tweetDetailPage}
        handleLike={handleLike}
        getProfile={getProfile}
        handleRetweet={handleRetweet}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default Home;
