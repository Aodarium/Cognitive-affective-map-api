import { Request, Response } from "express";
import { Researcher, Role } from "../../models/researcher";
import { collections } from "../../services/connect";
import { Wrapper } from "../../models/generals";
import logger from "../../services/logger";

interface UserRoleInput {
    role: string;
    email: string;
}

/**
 * Change the role of one User.
 * @param {String}  Email - Email of the user to change.
 * @param {Role} newRole - New role.
 */

const changeUserRoleStatus = async (
    req: Wrapper<UserRoleInput>,
    res: Response
) => {
    const newRole = req.body.role as Role;
    const emailUser = req.body.email;

    if (!Object.values(Role).includes(newRole)) {
        logger.warn("Invalide status");
        res.status(403).json({
            message:
                "Choose a valid status from: student, guest, or researcher.",
        });
        return;
    }

    const researcher = (await collections.researchers?.findOne({
        email: emailUser,
    })) as Researcher;

    if (!researcher) {
        logger.warn("Invalide user account");
        res.status(404).json({ message: "Invalide user account" });
        return;
    }

    await collections.researchers?.updateOne(
        {
            email: emailUser,
        },
        { $set: { role: newRole } }
    );

    res.status(201).json({
        message: `Role changed - ${emailUser}'s role status is now ${newRole}`,
    });

    return;
};

export default changeUserRoleStatus;
