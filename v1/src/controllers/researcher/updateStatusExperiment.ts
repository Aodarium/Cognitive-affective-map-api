import { Request, Response } from "express";
import Experiment from "../../models/experiment";
import Researcher from "../../models/researcher";
import { ObjectId } from 'bson';
import { collections } from "../../services/connect";

/**
 * Change the status of one experiment you owned.
 * @param {ObjectId}  MotherId - Id of the experiment to change.
 * @param {Token} jwtToken - Token from the user.
 */

const changeExperimentStatus = async (req: Request, res: Response) => {

    const decoded: any = req.body?.decoded ?? '';
    const newStatus: string = req?.body?.status as string ?? "inactive";
    const idExperiment: string = req.body?.id as string ?? '';

    if (
        ["inactive", "active", "completed", "archived"].indexOf(newStatus) === -1
    ) {
        res.status(409).json({
            message:
                "Chose a valid status from: inactive, active, completed, archived",
        });
        return;
    }

    // check the validity of the id
    if (!ObjectId.isValid(idExperiment)) {
        res.status(409).json({ message: "Invalide id" });
        return;
    }

    //Check if exists and break if not
    const experiment = await collections.experiments?.findOne(
        { _id: new ObjectId(String(idExperiment)) }
    ) as Experiment;

    if (!experiment) {
        res.status(409).json({ message: "Invalide experiment" });
        return;
    }

    //update the status of other experiments based on the user's paid value
    const researcher = await collections.researchers?.findOne(
        { _id: new ObjectId(decoded.userId) }
    ) as Researcher;

    if (!researcher) {
        res.status(409).json({ message: "Invalide user account" });
        return;
    }

    //if no a paid user - only one experiment can run at  the time
    if (researcher.paid === false && newStatus === "active") {
        await collections.experiments?.updateMany(
            {
                researcherID: new ObjectId(decoded.userId),
                status: "active",
            },
            { "$set": { status: "inactive" } }
        );
    }

    //update the status
    const resultId = await collections.experiments?.updateOne(
        { _id: new ObjectId(idExperiment) },
        { "$set": { status: newStatus } }
    );
    res.status(201).json({ message: `Status changed - ${idExperiment} is now ${newStatus}` });
    return;
};

export default changeExperimentStatus;