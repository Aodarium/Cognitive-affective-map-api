import { Request, Response } from "express";
import Experiment from "../../models/experiment";
import { ObjectId } from 'bson';
import { collections } from "../../services/connect";

/**
 * Delete one experiment you owned.
 * @param {ObjectId}  Id - Id of the experiment to delete.
 * @param {Token} jwtToken - Token from the user.
 */

const deleteExperiment = async (req: Request, res: Response) => {

    const userId: string = req.body?.decoded?.userId as string ?? '';
    const id: string = req.body?.id as string ?? '';

    if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
        res.status(409).json({ message: "Invalid id." });
        return;
    }

    //Check if exists and break if not
    const experiment = await collections.experiments?.findOne(
        { _id: new ObjectId(id), researcherID: new ObjectId(userId) }
    ) as Experiment;

    if (!experiment) {
        res.status(404).json({ message: "This experiment does not exist." });
        return;
    }

    //update the status
    await collections.experiments?.deleteOne(
        { _id: new ObjectId(id), researcherID: new ObjectId(userId) }
    );

    res.status(200).json({ message: "Experiment has been deleted." });
    return;
};

export default deleteExperiment;