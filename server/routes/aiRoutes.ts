import express from "express";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from "../controllers/aiController";
import protect from "../middlewares/auth";


const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);

export default aiRouter;