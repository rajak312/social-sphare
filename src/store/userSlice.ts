// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  name: string | null;
}

const initialState: UserState = {
  email: null,
  name: null,
};

// Attempt to get initial user state from localStorage
const savedUser = localStorage.getItem("loggedInUser");
if (savedUser) {
  const parsedUser: UserState = JSON.parse(savedUser);
  initialState.email = parsedUser.email;
  initialState.name = parsedUser.name;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<{ email: string; name: string }>) {
      state.email = action.payload.email;
      state.name = action.payload.name;

      // Persist to localStorage on login
      localStorage.setItem("loggedInUser", JSON.stringify(state));
    },
    logoutUser(state) {
      state.email = null;
      state.name = null;

      // Clear from localStorage on logout
      localStorage.removeItem("loggedInUser");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
