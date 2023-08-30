import { Request, Response } from "express";
import Experiment from "../../models/experiment";
import { ObjectId } from 'bson';
import { collections } from "../../services/connect";

/**
 * Get all experiments by author.
 * @param {Token} Jwt - User's token.
 * @param {ObjectId} AuthorId - Id of the author.
 */

const getExperimentByAuthor = async (req: Request, res: Response) => {

    const userId: string = req.body?.decoded?.userId as string ?? '';

    let experiments = await collections.experiments?.aggregate(
        [
            { "$match": { researcherID: new ObjectId(userId) } },
            { "$set": { numberCams: { "$size": "$daughters" } } },
            { "$project": { daughters: 0, researcherID: 0 } }
        ]
    ).toArray() as Experiment[];

    res.status(200).json({ experiments });
    return;
};

export default getExperimentByAuthor;