import express, { Express, NextFunction, Request, Response } from "express";
import { connectToDatabase } from "./services/connect";
import participantsRoutes from "./routes/participants";
import researchersRoutes from "./routes/researchers";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(
    morgan(":date[iso] :remote-addr :method :url :status", {
        stream: accessLogStream,
    })
);
app.use(helmet());
app.use(express.urlencoded({ extended: false, limit: "25mb" }));
app.use(express.json({ limit: "25mb" }));
//app.use(mongoSanitize());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

/** Routes */
app.use("/participants", participantsRoutes);
app.use("/researchers", researchersRoutes);
app.get("/", (req, res) => {
    res.status(201).send({
        message: `Application is Alive`,
    });
});

/** Error handling */
app.use((_req: Request, res: Response) => {
    return res.status(404).json({
        message: "invalid request",
    });
});

export = app;
