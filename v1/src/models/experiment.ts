import { ObjectId } from "mongodb";
import Daughter from "./daughter";

export default interface Experiment {
    name: string;
    researcherID: ObjectId;
    creationDate: Date;
    cam: string;
    config: string;
    link: string;
    status: string;
    daughters: Daughter[];
}
