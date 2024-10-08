import * as mongoDB from "mongodb";
import endpoint from "../../endpoints.config";
import { Experiment } from "../models/experiment";
import Participant from "../models/participant";
import { User } from "../models/researcher";

export const collections: {
    participants?: mongoDB.Collection<Participant>;
    experiments?: mongoDB.Collection<Experiment>;
    users?: mongoDB.Collection<User>;
} = {};

export async function connectToDatabase() {
    // Create a new MongoDB client with the connection string from .env
    const client = new mongoDB.MongoClient(endpoint.DB_LINK);

    // Connect to the cluster
    await client.connect();

    // Connect to the database with the name specified in .env
    const db = client.db("Camel");

    const experimentsCollection = db.collection<Experiment>("experiments");
    collections.experiments = experimentsCollection;

    const researcherCollection = db.collection<User>("users");
    collections.users = researcherCollection;

    const participantCollection = db.collection<Participant>("participants");
    collections.participants = participantCollection;

    console.log(`Successfully connected to database: ${db.databaseName}`);
}
