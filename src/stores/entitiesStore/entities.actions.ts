import { createAction, props } from "@ngrx/store";
import { ModuleInterface } from "../../utils/interfaces/entitiesInterfaces/module.interface";

export const updateModule = createAction(
  '[Home Component Update module]',
  props<{ module: ModuleInterface }>()
)
