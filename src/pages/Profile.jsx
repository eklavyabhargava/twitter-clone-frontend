import "react-toastify/dist/ReactToastify.css";
import "./profile.css";
import UserInfo from "../components/UserInfo";
import UserTweet from "../components/UserTweet";
import Loading from "../components/loading";
import { useEffect, useState } from "react";

const Profile = ({
  getUserProfile,
  getProfile,
  handleRetweet,
  handleDelete,
  handleLike,
  tweetReply,
  onApiError,
}) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const userId = params.userId;
  const [userInfo, setUserInfo] = useState({});
  const getUserInfo = async () => {
    const data = await getUserProfile(userId);
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();

    //eslint-disable-next-line
  }, [userId]);

  return (
    <>
      {!userInfo || Object.keys(userInfo) === 0 ? (
        <Loading />
      ) : (
        <>
          <div>
            <div className="profile mb-2">
              <img
                className="img-fluid mb-0 pb-0 rounded-circle ms-3 position-relative top-100 start-0 translate-middle-y"
                src={userInfo.profilePic}
                alt=""
              />
            </div>
            <div className="relative user-detail top-100 ms-3">
              <UserInfo
                userData={userInfo}
                userId={userId}
                onApiError={onApiError}
              />
              <UserTweet
                onApiError={onApiError}
                tweetReply={tweetReply}
                userId={userId}
                getProfile={getProfile}
                handleRetweet={handleRetweet}
                handleDelete={handleDelete}
                handleLike={handleLike}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
