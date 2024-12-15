import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string | null;
  email: string | null;
  displayName: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
}

const initialState: User = {
  id: null,
  email: null,
  displayName: null,
  bio: null,
  profilePictureUrl: null,
};

const savedUser = localStorage.getItem("loggedInUser");
if (savedUser) {
  const parsedUser: Partial<User> = JSON.parse(savedUser);
  initialState.id = parsedUser.id || null;
  initialState.email = parsedUser.email || null;
  initialState.displayName = parsedUser.displayName || null;
  initialState.bio = parsedUser.bio || null;
  initialState.profilePictureUrl = parsedUser.profilePictureUrl || null;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<User>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.bio = action.payload.bio || null;
      state.profilePictureUrl = action.payload.profilePictureUrl || null;
      localStorage.setItem("loggedInUser", JSON.stringify(state));
    },
    updateUser(state, action: PayloadAction<User>) {
      if (action.payload.displayName !== undefined) {
        state.displayName = action.payload.displayName;
      }
      if (action.payload.bio !== undefined) {
        state.bio = action.payload.bio;
      }
      if (action.payload.profilePictureUrl !== undefined) {
        state.profilePictureUrl = action.payload.profilePictureUrl;
      }
      localStorage.setItem("loggedInUser", JSON.stringify(state));
    },
    logoutUser(state) {
      state.id = null;
      state.email = null;
      state.displayName = null;
      state.bio = null;
      state.profilePictureUrl = null;
      localStorage.removeItem("loggedInUser");
    },
  },
});

export const { loginUser, updateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
