import { Request } from "express";

export interface Wrapper<T> extends Request {
    body: T;
}
