import { ObjectId } from "mongodb";
import { Experiment, Status } from "../models/experiment";
import { User, Role } from "../models/researcher";
import { collections } from "./connect";
import Daughter from "../models/daughter";

async function getUserById(userId: string): Promise<User> {
    return (await collections.users?.findOne({
        _id: new ObjectId(userId),
    })) as User;
}

async function getUserByEmail(emailUser: string): Promise<User> {
    return (await collections.users?.findOne({
        email: emailUser,
    })) as User;
}

async function addOneExperiment(
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

async function getExperimentById(idExperiment: string): Promise<Experiment> {
    return (await collections.experiments?.findOne({
        _id: new ObjectId(idExperiment),
    })) as Experiment;
}

async function deleteExperiment(userId: string, experimentId: string) {
    await collections.experiments?.deleteOne({
        _id: new ObjectId(experimentId),
        researcherID: new ObjectId(userId),
    });
}

async function updateUserRole(emailUser: string, newRole: Role) {
    await collections.users?.updateOne(
        {
            email: emailUser,
        },
        { $set: { role: newRole } }
    );
}
async function updateUserStatus(emailUser: string, newStatus: boolean) {
    await collections.users?.updateOne(
        {
            email: emailUser,
        },
        { $set: { paid: newStatus } }
    );
}

async function updateExperimentStatus(idExperiment: string, newStatus: Status) {
    await collections.experiments?.updateOne(
        { _id: new ObjectId(idExperiment) },
        { $set: { status: newStatus } }
    );
}

async function disableExperiments(userId: string) {
    await collections.experiments?.updateMany(
        {
            researcherID: new ObjectId(userId),
            status: Status.ACTIVE,
        },
        { $set: { status: Status.INACTIVE } }
    );
}

async function addUser(user: User): Promise<undefined | string> {
    try {
        const insertresult = await collections.users?.insertOne(user);
        return insertresult?.insertedId as unknown as string;
    } catch (err) {
        return err as string;
    }
}

async function getExperimentDaughters(motherID: string, userId: string) {
    return (await collections.experiments?.findOne(
        { _id: new ObjectId(motherID), researcherID: new ObjectId(userId) }
        //{ projection: { "_id": 0, "name": 1, "daughters": 1 } }
    )) as unknown as Daughter;
}

async function getExperimentsByUser(userId: string) {
    return (await collections.experiments
        ?.aggregate([
            { $match: { researcherID: new ObjectId(userId) } },
            { $set: { numberCams: { $size: "$daughters" } } },
            { $project: { daughters: 0, researcherID: 0 } },
        ])
        .toArray()) as Experiment[];
}

export {
    addOneExperiment,
    addUser,
    disableExperiments,
    deleteExperiment,
    getExperimentById,
    getExperimentsByUser,
    getExperimentDaughters,
    getUserById,
    getUserByEmail,
    updateExperimentStatus,
    updateUserRole,
    updateUserStatus,
};
