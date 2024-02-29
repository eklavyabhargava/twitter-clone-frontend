import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TweetInfo from "../components/tweetDetail";
import TweetReplies from "../components/tweetReplies";
import { useApiUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { reAuthenticate } from "../routes/authRoute";

const TweetDetail = ({
  tweetReply,
  handleDelete,
  handleLike,
  handleRetweet,
  tweetDetailPage,
  onApiError,
}) => {
  // api url
  const API_URL = useApiUrl();
  const navigate = useNavigate();

  const { tweetId } = useParams();
  const [tweetDetail, setTweetDetail] = useState([]);

  const toastId = "toastId1";

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    reAuthenticate();
    navigate("/login");
  }

  // get tweet detail
  const getTweetDetail = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/tweet/tweet-detail/${tweetId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        setTweetDetail(response.data.Tweet);
      } else {
        toast.error(response.data.errMsg || "Some Error Occurred!", {
          position: "bottom-right",
          autoClose: 500,
          toastId: toastId,
        });
      }
    } catch (error) {
      onApiError(error);
    }
  };

  useEffect(() => {
    // call function getTweetDetail
    getTweetDetail();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div>
        <p className="fw-bold fs-3">Tweet</p>
        <TweetInfo
          onApiError={onApiError}
          tweetReply={tweetReply}
          tweetInfo={tweetDetail}
          handleLike={handleLike}
          handleRetweet={handleRetweet}
          handleDelete={handleDelete}
          getTweetDetail={getTweetDetail}
        />

        <p className="fw-bold fs-5 mt-4">Replies</p>
        <TweetReplies
          onApiError={onApiError}
          tweetReply={tweetReply}
          tweetInfo={tweetDetail}
          tweetDetailPage={tweetDetailPage}
          handleLike={handleLike}
          handleRetweet={handleRetweet}
          handleDelete={handleDelete}
          getTweetDetail={getTweetDetail}
        />
      </div>
    </>
  );
};

export default TweetDetail;
