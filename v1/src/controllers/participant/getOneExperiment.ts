import {Request, Response} from "express";
import {sign} from "jsonwebtoken";
import {ObjectId} from 'bson';
import endpoint from '../../../endpoints.config';
import {collections} from "../../services/connect";
import Experiment from "../../models/experiment";

/**
 * Get one experiment by id.
 * @param {Token} Jwt - User's token.
 * @param {ObjectId}  MotherId - Id of the mother.
 * @param {Id}  ParticipantId - Id of the participant.
 * @param {String}  Cam - Cam data.
 */

const getOneExperiment = async (req: Request, res: Response) => {

    const idExpToFetch: string = req.query?.id as string ?? "";
    const participantID: string = req.query?.participantID as string ?? "";

    if (!ObjectId.isValid(idExpToFetch)) {
        return res.status(404).json({message: "Experiment unknown."});
    }

    // fetch the experiment
    let experiment: Experiment  = await collections.experiments?.findOne(
        {_id: new ObjectId(idExpToFetch)}
    ) as Experiment;

    // return the experiment's data
    const token = sign(
        {
            participantID: participantID,
            motherID: idExpToFetch,
        },
        endpoint.KEY_JWT,
        {
            expiresIn: "4h",
        }
    );

    //return null if the study is not active
    if (experiment?.status != "active") {
        return res.status(401).json({message: "This experiment is not active."});
    }

    return res.status(200).json({
        cam: experiment.cam,
        config: experiment.config,
        link: experiment.link,
        token: token,
    });
};

export default getOneExperiment;