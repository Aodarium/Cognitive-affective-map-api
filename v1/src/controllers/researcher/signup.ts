import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import Researcher from "../../models/researcher";
import { collections } from "../../services/connect";

/**
 * To get the login token.
 * @param {String} email - User's email.
 * @param {String} password - User's password.
 * @returns {Token} Returns a jwt token.
 */

const signup = async (req: Request, res: Response) => {
    const email: string = req.body?.email as string ?? '';
    const password: string = req.body?.password as string ?? '';

    const existingResearcher = await collections.researchers?.findOne({ email: email });

    if (existingResearcher) {
        res.status(409).json({ message: "Email taken" });
        return;
    }
    const hash = await bcrypt.hash(password, 10);

    if (!hash) {
        res.status(500).json({ message: "err" });
        return;
    }

    const researcher: Researcher = {
        email: email,
        password: hash,
        role: "researcher",
        paid: false
    };

    try {
        const insertresult = await collections.researchers?.insertOne(researcher)
        res.status(201).json({ message: `researcher created with id ${insertresult}` });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
    return;
}

export default signup;