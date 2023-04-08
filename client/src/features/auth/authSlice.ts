import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("userToken") ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logout: (state) => {
      localStorage.removeItem("userToken");
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
