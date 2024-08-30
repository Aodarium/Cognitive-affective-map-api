import { ObjectId } from "mongodb";

export default interface Daughter {
    _id?: ObjectId;
    participantId: string;
    creationDate: Date;
    cam: string;
    jwt: string;
}
