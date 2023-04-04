import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type RootState } from "../../app/store";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState): AuthState["token"] =>
  state.auth.token;
