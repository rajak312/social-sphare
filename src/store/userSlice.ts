import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string | null;
  email: string | null;
  display_name: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
}

const initialState: User = {
  id: null,
  email: null,
  display_name: null,
  bio: null,
  profilePictureUrl: null,
};

const savedUser = localStorage.getItem("loggedInUser");
if (savedUser) {
  const parsedUser: Partial<User> = JSON.parse(savedUser);
  initialState.id = parsedUser.id || null;
  initialState.email = parsedUser.email || null;
  initialState.display_name = parsedUser.display_name || null;
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
      state.display_name = action.payload.display_name;
      state.bio = action.payload.bio || null;
      state.profilePictureUrl = action.payload.profilePictureUrl || null;
      localStorage.setItem("loggedInUser", JSON.stringify(state));
    },
    updateUser(state, action: PayloadAction<User>) {
      if (action.payload.display_name !== undefined) {
        state.display_name = action.payload.display_name;
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
      state.display_name = null;
      state.bio = null;
      state.profilePictureUrl = null;
      localStorage.removeItem("loggedInUser");
    },
  },
});

export const { loginUser, updateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
