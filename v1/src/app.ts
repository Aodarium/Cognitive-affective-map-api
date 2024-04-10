import express, { Express, NextFunction, Request, Response } from "express";
import { connectToDatabase } from "./services/connect";
import participantsRoutes from "./routes/participants";
import researchersRoutes from "./routes/researchers";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import path from "path";

const app: Express = express();

connectToDatabase();

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);
app.use(limiter);
app.use(
    morgan(":date[iso] :remote-addr :method :url :status", {
        stream: accessLogStream,
    })
);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With,Content-Type,Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET POST PUT DELETE");
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.use("/participants", participantsRoutes);
app.use("/researchers", researchersRoutes);

/** Error handling */
app.use((_req: Request, res: Response) => {
    return res.status(404).json({
        message: "invalid request",
    });
});

export = app;
