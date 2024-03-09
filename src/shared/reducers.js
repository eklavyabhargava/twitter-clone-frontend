const initialState = {
  user: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FOLLOW_USER":
      // add the user id in the user's followings array in the state
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW_USER":
      // remove the user id from the user's followings array in the state
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (id) => id !== action.payload
          ),
        },
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "CHANGE_USER_DATA":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
