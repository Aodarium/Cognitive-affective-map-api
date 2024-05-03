import { ObjectId } from "mongodb";

export default interface Participant {
    participantID: string;
    idMother: ObjectId;
}
