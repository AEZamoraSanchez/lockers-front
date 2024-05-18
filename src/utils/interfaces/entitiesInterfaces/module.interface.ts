import { ListInterface } from "./list.interface";
import { LockerInterface } from "./locker.interface";

export interface ModuleInterface {
  id : string;
  title : string;
  ownerId ? : string;
  moduleId ? : string;
  modules : ModuleInterface[]
  lists : ListInterface[]
  lockers : LockerInterface[]

}
