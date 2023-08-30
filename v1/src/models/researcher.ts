import { ObjectId } from "mongodb";

export default interface Researcher {
    _id?: ObjectId,
    email: string;
    password: string;
    role: string;
    paid: boolean;
};
