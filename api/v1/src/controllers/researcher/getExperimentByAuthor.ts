import { Request, Response } from "express";
import { ObjectId } from "bson";
import logger from "../../services/logger";
import { ExperimentDB } from "../../services/dbFuncs";

/**
 * Get all experiments by author.
 * @param {Token} Jwt - User's token.
 * @param {ObjectId} AuthorId - Id of the author.
 */

const getExperimentByAuthor = async (req: Request, res: Response) => {
    const userId: string = (req.body?.decoded?.userId as string) ?? "";

    if (!ObjectId.isValid(userId)) {
        logger.warn("Invalide userId", userId);
        res.status(404).json({ message: "The userId cannot be found." });
        return;
    }
    const experiments = await ExperimentDB.getExperimentsByUser(userId);

    res.status(200).json({ experiments });
    return;
};

export default getExperimentByAuthor;
