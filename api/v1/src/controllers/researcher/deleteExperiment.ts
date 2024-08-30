import { Request, Response } from "express";
import { Experiment } from "../../models/experiment";
import { ObjectId } from "bson";
import { collections } from "../../services/connect";
import logger from "../../services/logger";
import { getExperimentById } from "../../services/dbFuncs";

/**
 * Delete one experiment you owned.
 * @param {ObjectId}  Id - Id of the experiment to delete.
 * @param {Token} jwtToken - Token from the user.
 */

const deleteExperiment = async (req: Request, res: Response) => {
    const userId = req.body?.decoded?.userId;
    const experimentId = req.body?.id;

    if (!ObjectId.isValid(experimentId) || !ObjectId.isValid(userId)) {
        logger.warn("Invalid id.");
        res.status(409).json({ message: "Invalid id." });
        return;
    }

    //Check if exists and break if not
    const experiment = await getExperimentById(experimentId);

    if (!experiment) {
        logger.warn(`This experiment ${experimentId} does not exist.`);
        res.status(404).json({
            message: `This experiment ${experimentId} does not exist.`,
        });
        return;
    }

    //update the status
    await deleteExperiment(userId, experimentId);

    res.status(200).json({ message: "Experiment has been deleted." });
    return;
};

export default deleteExperiment;
