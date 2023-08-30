import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import endpoint from '../../../endpoints.config';
import { collections } from "../../services/connect";
import Researcher from "../../models/researcher";


const login = async (req: Request, res: Response) => {

    const email: string = req.body?.email as string ?? null;
    const password: string = req.body?.password as string ?? null;
    const user = await collections.researchers?.findOne({ email: email }) as unknown as Researcher;

    if (!user || !password) {
        res.status(401)
            .json({ message: "Authentification fail", token: "" });
        return;
    }

    const pwdUser: string = user?.password ?? "none"

    bcrypt.compare(password, pwdUser, (err: any, result: any) => {
        if (err) {
            res.status(401)
                .json({
                    message: "Authentification fail",
                    token: "",
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

            res.status(201).json({
                message: "Authentification successful",
                token,
            });
            return;
        }
        res.status(401).json({ message: "Authentification fail", token: "" });
        return;
    });
};

export default login;