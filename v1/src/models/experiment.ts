import { ObjectId } from "mongodb";
import Daughter from "./daughter";

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
    COMPLETE = "COMPLETE",
}
export interface Experiment {
    name: string;
    researcherID: ObjectId;
    creationDate: Date;
    cam: string;
    config: string;
    link: string;
    status: Status;
    daughters: Daughter[];
    numberOfParticipantsWanted: number;
}
