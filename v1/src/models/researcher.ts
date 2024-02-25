import { ObjectId } from "mongodb";

export enum Role {
    STUDENT = "STUDENT",
    GUEST = "GUEST",
    RESEARCHER = "RESEARCHER",
    ADMIN = "ADMIN",
}
export interface Researcher {
    _id?: ObjectId;
    email: string;
    password: string;
    role: Role;
    paid: boolean;
}
