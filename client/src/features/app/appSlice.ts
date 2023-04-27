import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  mobileMenuOpen: boolean;
  appModalOpen: boolean;
  appModalContent: {
    title: string;
    message: string;
    actionTitle?: string;
    actionHref?: string;
  };
}

const initialState: AppState = {
  mobileMenuOpen: false,
  appModalOpen: false,
  appModalContent: {
    title: "Problem encountered",
    message:
      "Something unexpected happened. Contact the administrator for assistance.",
    actionTitle: "Confirm",
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMobileMenuOpen: (
      state,
      action: PayloadAction<AppState["mobileMenuOpen"]>
    ) => {
      state.mobileMenuOpen = action.payload;
    },
    setAppModalOpen: (
      state,
      action: PayloadAction<AppState["appModalOpen"]>
    ) => {
      state.appModalOpen = action.payload;
    },
    setAppModalContent: (
      state,
      action: PayloadAction<AppState["appModalContent"]>
    ) => {
      const payload = { ...action.payload };
      payload.actionTitle ??= initialState.appModalContent.actionTitle;
      payload.actionHref ??= initialState.appModalContent.actionHref;
      state.appModalContent = payload;
    },
    resetAppModalContent: (state) => {
      state.appModalContent = initialState.appModalContent;
    },
  },
});

export const {
  setMobileMenuOpen,
  setAppModalOpen,
  setAppModalContent,
  resetAppModalContent,
} = appSlice.actions;

export default appSlice.reducer;
