import { createReducer, on } from "@ngrx/store";
import { ModuleInterface } from '../../utils/interfaces/entitiesInterfaces/module.interface';
import { updateModule } from "./module.actions";

interface moduleState {
  module : ModuleInterface | null;
}

export const moduleState : moduleState = {
  module : null
}

export const moduleReducer = createReducer(
  moduleState,
  on(updateModule, (state, { module }) => {
    return {
     ...state,
      module
    }
  })
)
