import { ObjectId } from "mongodb";

export default interface Daughter {
  _id?: ObjectId,
  participantID: string;
  creationDate: Date;
  cam: string;
  jwt: string;
};
