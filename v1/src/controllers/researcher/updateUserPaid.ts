import { Request, Response } from "express";
import Researcher from "../../models/researcher";
import { collections } from "../../services/connect";

/**
 * Change the status of one User.
 * @param {String}  Email - Email of the user to change.
 * @param {Boolean} NewStatus - New status.
 * @param {Token} jwtToken - Token from the user.
 */

const changeUserPaidStatus = async (req: Request, res: Response) => {
    try {
        const newStatus: boolean = req?.body?.status as boolean ?? false;
        const emailUser: string = req.body?.email as string ?? '';

        //update the status of other experiments based on the user's paid value
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
            { "$set": { "paid": newStatus } }
        );

        res.status(201).json({ message: `Status changed - ${emailUser}'s paid status is now ${newStatus}` });
    }
    catch (err) {
        res.status(401).json({ message: err });
    }
    return;
};

export default changeUserPaidStatus;