import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import endpoint from "../../endpoints.config";

function isAuth(req: Request, res: Response, next: NextFunction) {
    const authKey = req.cookies["CAM-API-KEY"] as string;

    if (authKey === undefined || authKey === "") {
        res.status(401).json({ message: "You are not authenticated." });
        return;
    }

    verify(authKey, endpoint.KEY_JWT, async (err: any, decoded: any) => {
        if (!err && decoded) {
            req.body.decoded = decoded;
            next();
        } else {
            res.status(401).json({ message: "You are not authenticated." });
            return;
        }
    });
}

export default isAuth;
