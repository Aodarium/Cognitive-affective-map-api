import { Request, Response } from "express";
import { Experiment, Status } from "../../models/experiment";
import { Researcher } from "../../models/researcher";
import { ObjectId } from "bson";
import { collections } from "../../services/connect";
import { Wrapper } from "../../models/generals";
import logger from "../../services/logger";

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
    const newStatus: Status = req.body.status;
    const idExperiment: string = req.body.id;

    if (!Object.values(Status).includes(newStatus)) {
        logger.warn("Invalide status");
        res.status(409).json({
            message: "Chose a valid status from: inactive, active, archived",
        });
        return;
    }

    // check the validity of the id
    if (!ObjectId.isValid(idExperiment)) {
        logger.warn("Invalide id");
        res.status(409).json({ message: "Invalide id" });
        return;
    }

    //Check if exists and break if not
    const experiment = (await collections.experiments?.findOne({
        _id: new ObjectId(String(idExperiment)),
    })) as Experiment;

    if (!experiment) {
        logger.warn("Invalide id");
        res.status(409).json({ message: "Invalide experiment" });
        return;
    }

    //update the status of other experiments based on the user's paid value
    const researcher = (await collections.researchers?.findOne({
        _id: new ObjectId(userId),
    })) as Researcher;

    if (!researcher) {
        logger.warn("Invalide user account");
        res.status(409).json({ message: "Invalide user account" });
        return;
    }

    //if no a paid user - only one experiment can run at  the time
    if (researcher.paid === false && newStatus === Status.ACTIVE) {
        await collections.experiments?.updateMany(
            {
                researcherID: new ObjectId(userId),
                status: Status.ACTIVE,
            },
            { $set: { status: Status.INACTIVE } }
        );
    }

    //update the status
    await collections.experiments?.updateOne(
        { _id: new ObjectId(idExperiment) },
        { $set: { status: newStatus } }
    );
    res.status(201).json({
        message: `Status changed - ${idExperiment} is now ${newStatus}`,
    });
    return;
};

export default changeExperimentStatus;
