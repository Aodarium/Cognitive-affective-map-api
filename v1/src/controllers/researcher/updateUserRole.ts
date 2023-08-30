import { Request, Response } from "express";
import Researcher from "../../models/researcher";
import { collections } from "../../services/connect";

/**
 * Change the role of one User.
 * @param {String}  Email - Email of the user to change.
 * @param {Boolean} NewStatus - New status.
 * @param {Token} jwtToken - Token from the user.
 */

const changeUserRoleStatus = async (req: Request, res: Response) => {
    try {
        const newRole: string = req?.body?.status as string ?? "researcher";
        const emailUser: string = req.body?.email as string ?? '';

        if (
            ["assistant", "researcher", "admin"].indexOf(newRole) === -1
        ) {
            res.status(409).json({
                message:
                    "Chose a valid status from: assistant or researcher.",
            });
            return;
        }

        const researcher = await collections.researchers?.findOne(
            { email: emailUser }
        ) as Researcher;

        if (!researcher) {
            res.status(409).json({ message: "Invalide user account" });
            return;
        }

        await collections.researchers?.updateOne(
            {
                email: emailUser,
            },
            { "$set": { "role": newRole } }
        );

        res.status(201).json({ message: `Status changed - ${emailUser}'s role status is now ${newRole}` });
    }
    catch (err) {
        res.status(401).json({ message: err });
    }
    return;
};

export default changeUserRoleStatus;