import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApiUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../shared/actions";
import { reAuthenticate } from "../routes/AuthRoute";
import { useSelector } from "react-redux";
import UploadImage from "./UploadImage";
import EditProfileModal from "./EditProfile";

const UserInfo = ({ userData, userId, onApiError }) => {
  // api url
  const API_URL = useApiUrl();
  const [userInfo, setUserInfo] = useState({});
  const [followers, setFollowers] = useState(userInfo?.followers ?? []);
  const user = useSelector((state) => state.user);
  const [disableBtn, setDisableBtn] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const toastId = "customID1";
  const toastId2 = "customID2";

  const closeButtonRef = useRef();

  const loggedInUser = JSON.parse(localStorage.getItem("userData"));
  if (!loggedInUser) {
    navigate("/login");
  }
  const token = loggedInUser?.token;

  // handle follow request
  const handleFollow = () => {
    const followingId = userInfo._id;
    setDisableBtn(true);
    dispatch(followUser(followingId))
      .then((response) => {
        if (response.isSuccess) {
          setFollowers((currFollowers) => {
            return [...currFollowers, user._id];
          });
        } else {
          toast.error("Unexpected error occurred!", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId2,
          });

          if (response.status && response.status === 401) {
            reAuthenticate();
            navigate("/login");
          }
        }
      })
      .catch((error) => {
        onApiError(error);
      });
    setDisableBtn(false);
  };

  // handle unfollow request
  const handleUnfollow = () => {
    const followingId = userInfo._id;
    setDisableBtn(true);
    dispatch(unfollowUser(followingId))
      .then((response) => {
        if (response.isSuccess) {
          setFollowers((currFollowers) => {
            const indexToRemove = currFollowers.findIndex(
              (follower) => follower === user._id
            );
            if (indexToRemove !== -1) {
              currFollowers.splice(indexToRemove, 1);
            }

            return [...currFollowers];
          });
        } else {
          toast.error("Unexpected error occurred", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId2,
          });

          if (response.status && response.status === 401) {
            reAuthenticate();
            navigate("/login");
          }
        }
      })
      .catch((error) => {
        onApiError(error);
      });

    setDisableBtn(false);
  };

  // request to change profile info
  const editProfile = async () => {
    if (!userInfo.name || !userInfo.location || !userInfo.dob) {
      toast.error("Mandatory fields are missing!", {
        position: "bottom-right",
        autoClose: 500,
        toastId: toastId2,
      });
    } else {
      try {
        const response = await axios.put(
          `${API_URL}/api/user/edit-profile/${userId}`,
          { ...userInfo },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.isSuccess) {
          toast.success(response.data.msg ?? "Profile updated!", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId,
          });
          closeButtonRef.current.click();
          dispatch(userInfo);
        }
        if (response.status === 401) {
          reAuthenticate();
          navigate("/login");
          return;
        } else {
          toast.error(response.data.errMsg || "Some Error Occurred!", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId2,
          });
        }
      } catch (error) {
        onApiError(error);
      }
    }
  };

  // upload profile picture
  const uploadProfilePic = async () => {
    const imgFile = document.querySelector("#inputGroupFile02").files[0];

    if (!imgFile) {
      toast.error("No file chosen!", {
        position: "bottom-right",
        autoClose: 500,
        toastId: toastId,
      });
    } else {
      const formData = new FormData();
      formData.append("profilePic", imgFile);

      try {
        const response = await axios.post(
          `${API_URL}/api/user/upload-profile-pic/${userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.isSuccess) {
          toast.success(response.data.msg, {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId,
          });
          window.location.reload(true);
        } else {
          toast.error(response.data.errMsg || "Some Error Occurred!", {
            position: "bottom-right",
            autoClose: 500,
            toastId: toastId2,
          });
        }
        closeButtonRef.current.click();
      } catch (error) {
        closeButtonRef.current.click();
        onApiError(error);
      }
    }
  };

  useEffect(() => {
    if (userData && Object.keys(userData)) {
      setUserInfo(userData);
      setFollowers(userData?.followers ?? []);
    }
  }, [userData]);

  return (
    <div className="flex flex-col">
      {userInfo && Object.keys(userInfo) && (
        <>
          {userId === user._id ? (
            <div className={`absolute top-0 end-0 hidden md:flex`}>
              <button
                type="button"
                className="me-1 px-3 py-2 bg-btn-bg hover:bg-btn-hover text-btnText rounded"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop2"
              >
                Upload Picture
              </button>
              <button
                type="button"
                className="ms-2 me-3 px-3 py-2 border-[1px] border-secondary hover:bg-secBtn-hover hover:text-btnText rounded"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Edit
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={disableBtn}
              onClick={() => {
                user?.followings && user.followings.includes(userId)
                  ? handleUnfollow()
                  : handleFollow();
              }}
              className="follow-btn me-2 absolute top-0 end-0 bg-[#474747] text-btnText hover:bg-[#1a1b1c] px-3 py-2 rounded hidden sm:flex"
            >
              {user?.followings && user?.followings.includes(userId)
                ? "followings"
                : "Follow"}
            </button>
          )}

          <div
            className="modal fade"
            id="staticBackdrop2"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <UploadImage
              uploadProfilePic={uploadProfilePic}
              closeButtonRef={closeButtonRef}
            />
          </div>

          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <EditProfileModal
              editProfile={editProfile}
              closeButtonRef={closeButtonRef}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          </div>
          <p className="mb-0 fw-bold fs-5">{userInfo?.name}</p>
          <p className="fs-5 mb-0" style={{ color: "#5a5a5a" }}>
            @{userInfo?.username}
          </p>
          <div className="flex md:flex-row flex-col mt-3 mb-1">
            <div className="mb-1 md:mb-0">
              <i
                className="fa-solid fa-calendar"
                style={{ color: "#333333" }}
              ></i>
              <span style={{ color: "#535353" }}>
                {" "}
                DOB:{" "}
                {userInfo?.dob ? new Date(userInfo?.dob).toDateString() : null}
              </span>
            </div>
            <div className="ml-0 md:ml-3">
              <i
                className="fa-solid fa-location-dot"
                style={{ color: "#333333" }}
              ></i>
              <span style={{ color: "#535353" }}>
                {" "}
                Location: {userInfo?.location}
              </span>
            </div>
          </div>
          <div className="mb-2">
            <i
              className="fa-regular fa-calendar"
              style={{ color: "#333333" }}
            ></i>
            <span style={{ color: "#535353" }}>
              {" "}
              Joined {new Date(userInfo?.createdAt).toDateString()}
            </span>
          </div>
          {userId === user._id ? (
            <div className={`md:hidden flex`}>
              <button
                type="button"
                className="me-1 px-3 py-2 bg-btn-bg hover:bg-btn-hover text-btnText rounded"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop2"
              >
                Upload Picture
              </button>
              <button
                type="button"
                className="ms-2 me-3 px-3 py-2 border-[1px] border-secondary hover:bg-secBtn-hover hover:text-btnText rounded"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Edit
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={disableBtn}
              onClick={() => {
                user?.followings && user.followings.includes(userId)
                  ? handleUnfollow()
                  : handleFollow();
              }}
              className="follow-btn me-2 absolute top-0 end-0 bg-[#474747] text-btnText hover:bg-[#1a1b1c] px-3 py-2 rounded hidden sm:flex"
            >
              {user?.followings && user?.followings.includes(userId)
                ? "followings"
                : "Follow"}
            </button>
          )}
          <div className="mt-3 d-flex flex-row fw-bold">
            <p className="me-3">
              {userInfo?.followings?.length ?? 0} Followings
            </p>
            <p>{followers.length ?? 0} Followers</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
