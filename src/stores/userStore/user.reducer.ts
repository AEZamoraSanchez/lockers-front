import { createReducer, on } from "@ngrx/store";
import { updateUserMain, verReducer } from "./user.actions";
import { userMain } from "../../utils/interfaces/userInterfaces/userMain.interface";

interface userState {
  user: userMain | null
}

export const userState : userState = {
  user: null
};

export const userReducer = createReducer(
  userState,
  on(updateUserMain, (state, { user }) => {
    // console.log("user:", user )
    return { ...state, user}
  }),

  on(verReducer, (state) => {
    console.log(state)
    return state
  })
)
