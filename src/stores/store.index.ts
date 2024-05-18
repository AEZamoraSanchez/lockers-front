import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { userReducer } from "./userStore/user.reducer";
import { isDevMode } from "@angular/core";
import { moduleReducer } from "./moduleStore/module.reducer";

export interface State {

}

export const reducers : ActionReducerMap<State> = {
  user : userReducer,
  module : moduleReducer
}

export const metaReducers : MetaReducer<State>[] = isDevMode() ? [] : [];
