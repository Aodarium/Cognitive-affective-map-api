import { Request, Response } from "express";
import { collections } from "../../services/connect";
import { ObjectId } from "bson";
import { Experiment, Status } from "../../models/experiment";
import logger from "../../services/logger";
import { isNameValid, isNumberValid, isUrlValid } from "../../services/utils";

/**
 * Add an experiment.
 * @param {Token} jwt - User's token.
 * @param {Json} Cam - Cam model.
 * @param {String} Name - Name of the experiment.
 */

const addExperiment = async (req: Request, res: Response) => {
    const decoded = req.body?.decoded;

    const link: string = (req.body?.link as string) ?? "";
    if (!isUrlValid(link)) {
        logger.warn("The provided link is not valide");
        res.status(400).json({ message: "The provided link is not valide" });
        return;
    }

    const name: string = (req.body?.name as string) ?? "";
    if (!isNameValid(name)) {
        logger.warn("The provided name is not valide");
        res.status(400).json({ message: "The provided name is not valide" });
        return;
    }

    const numberOfParticipantsWanted: number =
        (req.body?.numberOfParticipantsWanted as number) ?? 50;
    if (!isNumberValid(numberOfParticipantsWanted)) {
        logger.warn("The provided numberOfParticipantsWanted is not valide");
        res.status(400).json({
            message: "The provided numberOfParticipantsWanted is not valide",
        });
        return;
    }

    const configuration: string = (req.body?.configuration as string) ?? "";
    const camFile = JSON.parse(configuration);
    const cam = camFile?.CAM ?? "";
    const configcam = camFile?.config ?? "";

    //if (!cam || !configcam) {
    //    logger.warn("The provided template is not valide");
    //    res.status(400).json({
    //        message: "The provided template is not valide",
    //    });
    //    return;
    //}

    try {
        const experiment: Experiment = {
            name: name,
            researcherID: new ObjectId(decoded.userId),
            creationDate: new Date(),
            config: JSON.stringify(configcam),
            cam: JSON.stringify(cam),
            link: link,
            status: Status.INACTIVE,
            daughters: [],
            numberOfParticipantsWanted: numberOfParticipantsWanted,
        };

        const result = await collections.experiments?.insertOne(experiment);
        if (result) {
            res.status(201).send({
                message: `Experiment added successfully ${result.insertedId}`,
            });
        } else {
            logger.warn("Failed to create a new experiment.");
            res.status(400).send({
                message: "Failed to create a new experiment.",
            });
        }
    } catch (err) {
        logger.error("Failed to create a new experiment: ", err);
        res.status(500).json({ message: err });
    }
    return;
};

export default addExperiment;
