import express from "express";
const router = express.Router();

import signup from "../controllers/researcher/signup";
import login from "../controllers/researcher/login";
import getParticipantsByExp from "../controllers/researcher/getParticipantsByExp";
import getExperimentByAuthor from "../controllers/researcher/getExperimentByAuthor";
import addExperiment from "../controllers/researcher/addExperiment";
import changeExperimentStatus from "../controllers/researcher/updateStatusExperiment";
import deleteExperiment from "../controllers/researcher/deleteExperiment";
import updateUserRole from "../controllers/researcher/updateUserRole";
import updateUserPaid from "../controllers/researcher/updateUserPaid";

import isAdmin from "../middlewares/admin";
import isAuth from "../middlewares/auth";

router.post("/login", login);

router.post("/signup", isAdmin, signup);
router.put("/updateRole", isAdmin, updateUserRole);
router.put("/updatePaid", isAdmin, updateUserPaid);

router.post("/addExperiment", isAuth, addExperiment);
router.post("/getExperimentByAuthor", isAuth, getExperimentByAuthor);
router.post("/getExperimentById", isAuth, getParticipantsByExp);
router.put("/changeExperimentStatus", isAuth, changeExperimentStatus);
router.delete("/deleteExperiment", isAuth, deleteExperiment);

export default router;
