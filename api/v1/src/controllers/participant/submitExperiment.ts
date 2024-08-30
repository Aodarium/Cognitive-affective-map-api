import { Request, Response } from "express";
import { ObjectId } from "bson";
import Daughter from "../../models/daughter";
import { Status } from "../../models/experiment";
import { ParticipantDB, ExperimentDB } from "../../services/dbFuncs";
import Participant from "../../models/participant";

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
    const motherId = req.body?.decoded?.motherID;
    const participantId = req.body?.decoded?.participantId;

    if (!cam || !motherId || !participantId || !token) {
        return res
            .status(404)
            .json({ message: "Please submit a correct input." });
    }

    // check the validity of the id
    if (!ObjectId.isValid(motherId)) {
        return res.status(409).json({ message: "Invalid id" });
    }

    const existParticipant = await ParticipantDB.getOneParticipant(
        participantId,
        motherId
    );

    if (existParticipant) {
        return res.status(401).json({ message: "Participation already done." });
    }

    //Checks if mother exist and breaks if not
    const experimentMother = await ExperimentDB.getExperimentById(motherId);

    if (!experimentMother) {
        return res.status(404).json({ message: "The study cannot be found." });
    }

    //Insert the daughter's data into the mother's experiment
    const daughter: Daughter = {
        participantId: participantId,
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
    await ParticipantDB.addParticipantDaughter(motherId, daughter, status);

    const participant: Participant = {
        participantId: participantId,
        motherId: motherId,
    };

    // Add participant to participants' list
    await ParticipantDB.addParticipantId(participant);

    return res.status(201).json({ message: "Daughter successfully added." });
};

export default submitExperiment;
