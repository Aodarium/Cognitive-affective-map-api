import { Request, Response } from "express";
import { ObjectId } from "bson";
import logger from "../../services/logger";
import { getExperimentDaughters } from "../../services/dbFuncs";

/**
 * Get all participants' data linked to one experiment you owned.
 * @param {ObjectId}  MotherId - Id of the experiment to fetch.
 * @param {Token} jwtToken - Token from the user.
 * @returns {Array} Array with participants' data.
 */

const getParticipantsByExp = async (req: Request, res: Response) => {
    const decoded = req.body?.decoded;
    const userId = decoded?.userId;

    const motherID: string = (req.query?.id as string) || "";

    if (!ObjectId.isValid(motherID) || !ObjectId.isValid(userId)) {
        logger.warn("Invalide motherID", motherID);
        res.status(404).json({ message: "The motherID cannot be found." });
        return;
    }

    const daughters = await getExperimentDaughters(motherID, userId);

    res.status(200).json(daughters);
    return;
};

export default getParticipantsByExp;
