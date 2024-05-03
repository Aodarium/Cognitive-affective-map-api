import express from 'express';

import getOneExperimentToken from '../controllers/participant/getOneExperimentToken';
import getOneExperiment from '../controllers/participant/getOneExperiment';
import submitExperiment from '../controllers/participant/submitExperiment';
import isAuth from "../middlewares/auth";

const router = express.Router();

router.get('/getOneExperiment', getOneExperiment);
router.post('/addExperience', isAuth, submitExperiment);
router.get('/getOneExperimentToken', getOneExperimentToken);

export default router;