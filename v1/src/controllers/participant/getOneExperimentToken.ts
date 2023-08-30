import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import endpoint from '../../../endpoints.config';
import { collections } from "../../services/connect";
import { ObjectId } from 'bson';

/**
 * Get one experiment's data by token.
 * @param {Token} jwt - User's token.
 */

const getOneExperimentToken = async (req: Request, res: Response) => {
    //get the token
    const token: string = req.query?.jwt as string ?? '';
    let decoded: any = {};

    try {
        decoded = verify(token, endpoint.KEY_JWT);
    } catch (err) {
        return res.status(401).json({ message: "Invalide token" });
    }

    const experimentId = decoded.motherID;

    // connect to the database
    const experimentArray = await collections.experiments?.aggregate([
        { "$match": { "_id": new ObjectId(experimentId) } },
        { "$unwind": "$daughters" },
        { "$match": { "daughters.jwt": token } },
        { "$set": { "cam": "$daughters.cam" } },
        { "$project": { "cam": 1 } }
    ]).toArray() as any[];

    // No experiment found
    if (experimentArray?.length == 0) {
        return res.status(401).json({ message: "No input found" });
    }

    return res.status(200).json({ cam: experimentArray[0].cam });
};

export default getOneExperimentToken;

