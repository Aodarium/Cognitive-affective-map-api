import { Request, Response } from "express";
import { ObjectId } from "bson";
import { collections } from "../../services/connect";
import Daughter from "../../models/daughter";
import logger from "../../services/logger";

/**
 * Get all participants' data linked to one experiment you owned.
 * @param {ObjectId}  MotherId - Id of the experiment to fetch.
 * @param {Token} jwtToken - Token from the user.
 * @returns {Array} Array with participants' data.
 */

const getParticipantsByExp = async (req: Request, res: Response) => {
    const decoded = req.body?.decoded;
    const userId = new ObjectId(decoded.userId);

    const motherID: string = (req.query?.id as string) || "";

    if (!ObjectId.isValid(motherID)) {
        logger.warn("Invalide mother id", motherID);
        res.status(404).json({
            message:
                "The experiment id cannot be found in the set of experiments.",
        });
        return;
    }

    const daughters = (await collections.experiments?.findOne(
        { _id: new ObjectId(motherID), researcherID: new ObjectId(userId) }
        //{ projection: { "_id": 0, "name": 1, "daughters": 1 } }
    )) as unknown as Daughter;

    res.status(200).json(daughters);
    return;
};

export default getParticipantsByExp;
