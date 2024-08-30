import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import endpoint from "../../../endpoints.config";
import { Wrapper } from "../../models/generals";
import logger from "../../services/logger";
import { getUserByEmail } from "../../services/dbFuncs";

interface UserInputModel {
    email: string;
    password: string;
}

const login = async (req: Wrapper<UserInputModel>, res: Response) => {
    const userEmail: string = req.body.email as string;
    const password: string = req.body.password as string;
    console.log(req.body);

    if (!userEmail || !password) {
        logger.warn("Missing information while loging");
        res.status(401).json({ message: "Missing information" });
        return;
    }

    const user = await getUserByEmail(userEmail);

    if (!user) {
        logger.warn("Invalide credentials");
        res.status(403).json({ message: "Invalide credentials" });
        return;
    }

    const pwdUser: string = user?.password ?? "none";

    bcrypt.compare(password, pwdUser, (err: any, result: any) => {
        if (err) {
            logger.warn("Bad credentials");
            res.status(401).json({
                message: "Authentification fail",
            });
            return;
        }
        if (result) {
            const token = sign(
                {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                },
                endpoint.KEY_JWT,
                {
                    expiresIn: "6h",
                }
            );
            logger.info("User logged in");
            res.status(200).json({
                token,
            });
            return;
        }
        logger.warn("Bad credentials");
        res.status(403).json({ message: "Invalide credentials" });
        return;
    });
};

export default login;
