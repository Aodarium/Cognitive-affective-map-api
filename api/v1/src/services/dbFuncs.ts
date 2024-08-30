import { ObjectId, WithId } from "mongodb";
import { Experiment, Status } from "../models/experiment";
import { User, Role } from "../models/researcher";
import { collections } from "./connect";
import Daughter from "../models/daughter";
import Participant from "../models/participant";

class UserDB {
    static async getUserById(userId: string): Promise<User> {
        return (await collections.users?.findOne({
            _id: new ObjectId(userId),
        })) as User;
    }

    static async getUserByEmail(emailUser: string): Promise<User> {
        return (await collections.users?.findOne({
            email: emailUser,
        })) as User;
    }

    static async updateUserRole(emailUser: string, newRole: Role) {
        await collections.users?.updateOne(
            {
                email: emailUser,
            },
            { $set: { role: newRole } }
        );
    }
    static async updateUserStatus(emailUser: string, newStatus: boolean) {
        await collections.users?.updateOne(
            {
                email: emailUser,
            },
            { $set: { paid: newStatus } }
        );
    }
    static async addUser(user: User): Promise<undefined | string> {
        try {
            const insertresult = await collections.users?.insertOne(user);
            return insertresult?.insertedId as unknown as string;
        } catch (err) {
            return err as string;
        }
    }
}
class ExperimentDB {
    static async addOneExperiment(
        experiment: Experiment
    ): Promise<undefined | string> {
        try {
            const insertresult = await collections.experiments?.insertOne(
                experiment
            );
            return insertresult?.insertedId as unknown as string;
        } catch (err) {
            return err as string;
        }
    }

    static async getExperimentById(idExperiment: string): Promise<Experiment> {
        return (await collections.experiments?.findOne({
            _id: new ObjectId(idExperiment),
        })) as Experiment;
    }

    static async deleteExperiment(userId: string, experimentId: string) {
        await collections.experiments?.deleteOne({
            _id: new ObjectId(experimentId),
            researcherID: new ObjectId(userId),
        });
    }

    static async updateExperimentStatus(
        idExperiment: string,
        newStatus: Status
    ) {
        await collections.experiments?.updateOne(
            { _id: new ObjectId(idExperiment) },
            { $set: { status: newStatus } }
        );
    }

    static async disableExperiments(userId: string) {
        await collections.experiments?.updateMany(
            {
                researcherID: new ObjectId(userId),
                status: Status.ACTIVE,
            },
            { $set: { status: Status.INACTIVE } }
        );
    }

    static async getExperimentDaughters(
        motherID: string,
        userId: string
    ): Promise<Daughter> {
        return (await collections.experiments?.findOne(
            { _id: new ObjectId(motherID), researcherID: new ObjectId(userId) }
            //{ projection: { "_id": 0, "name": 1, "daughters": 1 } }
        )) as unknown as Daughter;
    }

    static async getExperimentsByUser(userId: string): Promise<Experiment[]> {
        return (await collections.experiments
            ?.aggregate([
                { $match: { researcherID: new ObjectId(userId) } },
                { $set: { numberCams: { $size: "$daughters" } } },
                { $project: { daughters: 0, researcherID: 0 } },
            ])
            .toArray()) as Experiment[];
    }

    static async getExperimentToken(
        experimentId: string,
        token: string
    ): Promise<any[]> {
        return (await collections.experiments
            ?.aggregate([
                { $match: { _id: new ObjectId(experimentId) } },
                { $unwind: "$daughters" },
                { $match: { "daughters.jwt": token } },
                { $set: { cam: "$daughters.cam" } },
                { $project: { cam: 1 } },
            ])
            .toArray()) as any[];
    }
}

class ParticipantDB {
    static async getOneParticipant(
        participantID: string,
        motherId: string
    ): Promise<Participant | undefined | null> {
        return await collections.participants?.findOne({
            participantID: participantID,
            idMother: new ObjectId(motherId),
        });
    }

    static async addParticipantDaughter(
        motherId: string,
        daughter: Daughter,
        newStatus: Status
    ): Promise<undefined | string> {
        try {
            const result = await collections.experiments?.updateOne(
                { _id: new ObjectId(motherId) },
                [
                    { $push: { daughters: daughter as any } },
                    { $set: { status: newStatus as string } },
                ]
            );
            return result as unknown as string;
        } catch (err) {
            return err as string;
        }
    }

    static async addParticipantId(
        participant: Participant
    ): Promise<undefined | string> {
        try {
            const insertresult = await collections.participants?.insertOne(
                participant
            );
            return insertresult?.insertedId as unknown as string;
        } catch (err) {
            return err as string;
        }
    }
}

export { ParticipantDB, UserDB, ExperimentDB };
