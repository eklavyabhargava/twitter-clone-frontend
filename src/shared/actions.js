import axios from "axios";
import { reAuthenticate } from "../routes/authRoute";

const API_URL = process.env.REACT_APP_API_URL;
const jwtToken = JSON.parse(localStorage.getItem("userData"))?.token;

export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const updateUserData = (user) => ({
  type: "CHANGE_USER_DATA",
  payload: user,
});

export const followUser = (userIdToFollow) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${API_URL}/${userIdToFollow}/follow`,
      null,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.data.isSuccess) {
      // dispatch an action to update the redux store
      dispatch({ type: "FOLLOW_USER", payload: userIdToFollow });
      return { isSuccess: true };
    } else {
      return { isSuccess: false };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      reAuthenticate();
      window.location = "/login";
    }
    return { isSuccess: false };
  }
};

export const unfollowUser = (userIdToUnFollow) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${API_URL}/${userIdToUnFollow}/unfollow`,
      null,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.data.isSuccess) {
      // dispatch an action to update the redux store
      dispatch({ type: "UNFOLLOW_USER", payload: userIdToUnFollow });
      return { isSuccess: true, message: "Unfollow successful" };
    } else {
      return { isSuccess: false, message: "Unfollow failed" };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      reAuthenticate();
      window.location = "/login";
    }
    return { isSuccess: false, message: "Error occurred" };
  }
};
