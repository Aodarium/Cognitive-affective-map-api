import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import endpoint from "../../../endpoints.config";
import { collections } from "../../services/connect";
import { ObjectId } from "bson";
import { ExperimentDB } from "../../services/dbFuncs";

/**
 * Get one experiment's data by token.
 * @param {Token} jwt - User's token.
 * @return {Experiment} - The experiment's data.
 */

const getOneExperimentToken = async (req: Request, res: Response) => {
    //get the token
    const token: string = (req.query?.jwt as string) ?? "";
    let decoded: any = {};

    try {
        decoded = verify(token, endpoint.KEY_JWT);
    } catch (err) {
        return res.status(401).json({ message: "Invalide token" });
    }

    const experimentId = decoded.motherID;

    const experimentArray = await ExperimentDB.getExperimentToken(
        experimentId,
        token
    );

    // No experiment found
    if (experimentArray?.length == 0) {
        return res.status(401).json({ message: "No input found" });
    }

    return res.status(200).json({ cam: experimentArray[0].cam });
};

export default getOneExperimentToken;
