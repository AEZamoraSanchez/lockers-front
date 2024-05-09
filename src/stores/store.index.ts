import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { userReducer } from "./userStore/user.reducer";
import { isDevMode } from "@angular/core";

export interface State {

}

export const reducers : ActionReducerMap<State> = {
  user : userReducer
}

export const metaReducers : MetaReducer<State>[] = isDevMode() ? [] : [];
