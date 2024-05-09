import { createAction, props } from "@ngrx/store";
import { userMain } from "../../utils/interfaces/userInterfaces/userMain.interface";

export const updateUserMain = createAction(
  '[Home Component] Update User Main',
  props<{ user : userMain }>()
)

export const verReducer = createAction(
  '[Home Component] Ver Reducer',
)
