import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import endpoint from "../../endpoints.config";
import { Role } from "../models/researcher";

function isAdmin(req: Request, res: Response, next: NextFunction) {
    const authKey = req.header("CAM-API-KEY") as string;

    verify(authKey, endpoint.KEY_JWT, async (err: any, decoded: any) => {
        if (!err && decoded) {
            req.body.decoded = decoded;
            if (decoded.role === Role.ADMIN) {
                next();
            } else {
                res.status(401).json({ message: "Action forbidden" });
            }
        } else {
            res.status(401).json({ message: "You are not authenticated." });
        }
    });
}
export default isAdmin;
