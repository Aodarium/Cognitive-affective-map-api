import { ObjectId } from "mongodb";

export enum Role {
    student = "student",
    guest = "guest",
    researcher = "researcher",
    admin = "admin",
}
export interface Researcher {
    _id?: ObjectId;
    email: string;
    password: string;
    role: Role;
    paid: boolean;
}
