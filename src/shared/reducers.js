const initialState = {
  user: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FOLLOW_USER":
      // add the user id in the user's following array in the state
      return {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, action.payload],
        },
      };
    case "UNFOLLOW_USER":
      // remove the user id from the user's following array in the state
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.filter((id) => id !== action.payload),
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
