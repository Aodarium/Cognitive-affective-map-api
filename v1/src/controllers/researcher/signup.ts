import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Researcher, Role } from "../../models/researcher";
import { Wrapper } from "../../models/generals";
import { collections } from "../../services/connect";

interface NewUserInputModel {
    email: string;
    password: string;
    role: Role;
}

/**
 * Register an account.
 * @param {String} email - User's email.
 * @param {String} password - User's password.
 * @returns {Token} Returns a jwt token.
 */

const signup = async (req: Wrapper<NewUserInputModel>, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const role: Role = req.body.role;

    if (!email || !password || !role) {
        res.status(401).json({ message: "Mising information" });
        return;
    }
    if (!Object.values(Role).includes(role)) {
        res.status(401).json({ message: "Incorrect role" });
        return;
    }
    const existingResearcher = await collections.researchers?.findOne({
        email: email,
    });

    if (existingResearcher) {
        res.status(409).json({ message: "Email taken" });
        return;
    }
    const hash = await bcrypt.hash(password, 10);

    if (!hash) {
        res.status(500).json({ message: "Error while comparing pwd" });
        return;
    }

    const researcher: Researcher = {
        email: email,
        password: hash,
        role: role,
        paid: false,
    };

    try {
        const insertresult = await collections.researchers?.insertOne(
            researcher
        );
        res.status(201).json({
            message: `researcher created with id ${insertresult?.insertedId}`,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
    return;
};

export default signup;
