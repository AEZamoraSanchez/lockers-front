export interface LockerInterface {
  id : string;
  title : string;
  description? : string;
  ownerId ? : string;
  moduleId ? : string;
  lockerTasks : string[]

}
