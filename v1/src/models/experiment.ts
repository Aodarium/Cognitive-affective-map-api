import { ObjectId } from "mongodb";

export default interface Experiment {
    name: string;
    researcherID: ObjectId;
    creationDate: Date,
    cam: string;
    config: string;
    link: string;
    status: string;
    daughters: any;
};
