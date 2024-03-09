import "react-toastify/dist/ReactToastify.css";
import HomePage from "../components/HomePage";

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
    <div className="relative w-full">
      <HomePage
        onApiError={onApiError}
        tweetReply={tweetReply}
        tweetDetailPage={tweetDetailPage}
        handleLike={handleLike}
        getProfile={getProfile}
        handleRetweet={handleRetweet}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Home;
