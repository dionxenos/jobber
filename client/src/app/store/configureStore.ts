import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { skillSlice } from "../../features/skills/skillSlice";
import { accountSlice } from "../../features/account/accountSlice";
import { userSlice } from "../../features/user/userSlice";

export const store = configureStore({
  reducer: {
    skill: skillSlice.reducer,
    account: accountSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
