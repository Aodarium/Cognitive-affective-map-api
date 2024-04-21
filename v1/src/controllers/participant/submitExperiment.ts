import { Request, Response } from "express";
import { ObjectId } from "bson";
import { collections } from "../../services/connect";
import Daughter from "../../models/daughter";
import { Status } from "../../models/experiment";

/**
 * Add one experiment by participant.
 * @param {Token} jwt - User's token.
 * @param {ObjectId}  MotherId - Id of the mother.
 * @param {String}  Cam - Cam data.
 */

const submitExperiment = async (req: Request, res: Response) => {
    //get the participant's token
    const cam: string = (req.body?.cam as string) ?? "";
    const token: string = (req?.body?.jwt as string) ?? "";
    const idMother: string = (req.body?.decoded?.motherID as string) ?? "";
    const participantID: string =
        (req.body?.decoded?.participantID as string) ?? "";

    if (!cam || !idMother || !participantID || !token) {
        return res
            .status(404)
            .json({ message: "Please submit a correct input." });
    }

    // check the validity of the id
    if (!ObjectId.isValid(idMother)) {
        return res.status(409).json({ message: "Invalid id" });
    }

    const existParticipant = await collections.participants?.findOne({
        participantID: participantID,
        idMother: new ObjectId(idMother),
    });

    if (existParticipant) {
        return res.status(401).json({ message: "Participation already done." });
    }

    //Checks if mother exist and breaks if not
    const experimentMother = await collections.experiments?.findOne({
        _id: new ObjectId(idMother),
    });
    if (!experimentMother) {
        return res.status(404).json({ message: "The study cannot be found." });
    }

    //Insert the daughter's data into the mother's experiment
    const daughter: Daughter = {
        participantID: participantID,
        jwt: token,
        creationDate: new Date(),
        cam: JSON.stringify(cam),
    };

    let status = experimentMother.status;
    if (
        experimentMother.numberOfParticipantsWanted >=
        experimentMother.daughters.length + 1
    ) {
        status = Status.COMPLETE;
    }
    collections.experiments?.updateOne({ _id: new ObjectId(idMother) }, [
        { $push: { daughters: daughter as any } },
        { $set: { status: status as string } },
    ]);

    const participant = {
        participantID: participantID,
        idMother: new ObjectId(idMother),
    };

    // Add participant to participants' list
    await collections.participants?.insertOne(participant);

    return res.status(201).json({ message: "Daughter successfully added." });
};

export default submitExperiment;
