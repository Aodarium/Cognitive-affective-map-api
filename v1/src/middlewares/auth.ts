import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import endpoint from "../../endpoints.config";

function isAuth(req: Request, res: Response, next: NextFunction) {
    verify(req.body?.jwt, endpoint.KEY_JWT, async (err: any, decoded: any) => {
        if (!err && decoded) {
            req.body.decoded = decoded;
            next();
        } else {
            res.status(401).json({ message: "You are not authenticated." });
        }
    });
}

export default isAuth;
