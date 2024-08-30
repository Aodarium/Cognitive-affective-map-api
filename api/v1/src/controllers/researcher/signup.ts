import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { User, Role } from "../../models/researcher";
import { Wrapper } from "../../models/generals";
import logger from "../../services/logger";
import { UserDB } from "../../services/dbFuncs";

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
        logger.warn("Mising information");
        res.status(401).json({ message: "Mising information" });
        return;
    }
    if (!Object.values(Role).includes(role)) {
        logger.warn("Incorrect role: ", role);
        res.status(401).json({ message: "Incorrect role" });
        return;
    }
    const existingResearcher = await UserDB.getUserByEmail(email);

    if (existingResearcher) {
        logger.warn("Email taken");
        res.status(409).json({ message: "Email taken" });
        return;
    }
    const hash = await bcrypt.hash(password, 10);

    if (!hash) {
        logger.error("Error while comparing pwd");
        res.status(500).json({ message: "Error while comparing pwd" });
        return;
    }

    const researcher: User = {
        email: email,
        password: hash,
        role: role,
        paid: false,
    };

    try {
        const insertresult = await UserDB.addUser(researcher);
        res.status(201).json({
            message: `researcher created with id ${insertresult}`,
        });
    } catch (err) {
        logger.error("Error:", err);
        res.status(500).json({ message: err });
    }
    return;
};

export default signup;
