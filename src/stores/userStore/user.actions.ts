import { userMain } from "../../utils/interfaces/userInterfaces/userMain.interface";
import { createAction, props } from "@ngrx/store";

export const updateUserMain = createAction(
  '[Home Component] Update User Main',
  props<{ user : userMain }>()

)

export const verReducer = createAction(
  '[Home Component] Ver Reducer',
)
