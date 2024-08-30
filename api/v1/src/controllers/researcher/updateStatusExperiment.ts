import { Request, Response } from "express";
import { Experiment, Status } from "../../models/experiment";
import { User } from "../../models/researcher";
import { ObjectId } from "bson";
import { Wrapper } from "../../models/generals";
import logger from "../../services/logger";
import {
    disableExperiments,
    getExperimentById,
    getUserById,
    updateExperimentStatus,
} from "../../services/dbFuncs";

interface ExpNewInputModel {
    decoded: any;
    status: Status;
    id: string;
}
/**
 * Change the status of one experiment you owned.
 * @param {String}  userId - Id of the experiment to change.
 * @param {Status}  status - Id of the experiment to change.
 * @param {String} id - Token from the user.
 */

const changeExperimentStatus = async (
    req: Wrapper<ExpNewInputModel>,
    res: Response
) => {
    const userId: string = req.body.decoded.userId;
    const newStatus: Status = req.body.status.toUpperCase() as Status;
    const experimentId: string = req.body.id;

    if (!Object.values(Status).includes(newStatus)) {
        logger.warn("Invalide status");
        res.status(409).json({
            message: "Choose a valid status from: inactive, active, archived",
        });
        return;
    }

    // check the validity of the ids
    if (!ObjectId.isValid(experimentId) || !ObjectId.isValid(userId)) {
        logger.warn("Invalide id");
        res.status(409).json({ message: "Invalide id" });
        return;
    }

    //Check if exists, breaks if not
    const experiment = await getExperimentById(experimentId);

    if (!experiment) {
        logger.warn("Invalide id");
        res.status(409).json({ message: "Invalide experiment" });
        return;
    }

    //update the status of other experiments based on the user's paid value
    const user = await getUserById(userId);
    if (!user) {
        logger.warn("Invalide user account");
        res.status(409).json({ message: "Invalide user account" });
        return;
    }

    //if no a paid user - only one experiment can run at  the time
    if (user.paid === false && newStatus === Status.ACTIVE) {
        await disableExperiments(userId);
    }

    //update the status
    await updateExperimentStatus(experimentId, newStatus);

    res.status(201).json({
        message: `Status changed - ${experimentId} is now ${newStatus}`,
    });
    return;
};

export default changeExperimentStatus;
