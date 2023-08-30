import { Request, Response } from "express";
import { collections } from "../../services/connect";
import { ObjectId } from 'bson';
import Experiment from "../../models/experiment";

/**
 * Add an experiment.
 * @param {Token} jwt - User's token.
 * @param {Json} Cam - Cam model.
 * @param {String} Name - Name of the experiment.
 */

const addExperiment = async (req: Request, res: Response) => {

    const decoded = req.body?.decoded;
    const name: string = req.body?.name as string ?? '';
    const link: string = req.body?.link as string ?? '';
    const camFileRaw: string = req.body?.cam as string ?? '';
    const camFile = JSON.parse(camFileRaw);
    const cam = camFile?.CAM ?? '';
    const configcam = camFile?.config ?? '';

    if (!name || !cam || !configcam || !link) {
        res.status(401).json({ message: "Invalid content" });
        return;
    }

    try {

        const experiment: Experiment = {
            name: name,
            researcherID: new ObjectId(decoded.userId),
            creationDate: new Date(),
            config: JSON.stringify(configcam),
            cam: JSON.stringify(cam),
            link: link,
            status: "inactive",
            daughters: [],
        };

        const result = await collections.experiments?.insertOne(experiment);
        result
            ? res.status(201).send({ message: `Experiment added successfully ${result.insertedId}` })
            : res.status(500).send({ message: "Failed to create a new experiment." });

    } catch (err) {
        res.status(500).json({ message: err });
    }
    return;
};

export default addExperiment;