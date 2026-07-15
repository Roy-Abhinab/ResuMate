import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Resume from "../models/Resume"; 


export const createResume = async (req: AuthRequest, res: Response): Promise<Response | any> => {
    try {
        const userId = req.userId as string;
        const { title } = req.body;

        
        const newResume = await Resume.create({ userId, title });
        
        
        return res.status(201).json({ 
            message: 'Resume created successfully', 
            resume: newResume 
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}


export const deleteResume = async (req: AuthRequest, res: Response): Promise<Response | any> => {
    try {
        const userId = req.userId as string ;
        const resumeId = req.params.resumeId as string;

        await Resume.findOneAndDelete({ userId, _id: resumeId });

        
        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}


export const getResumeById = async (req: AuthRequest, res: Response): Promise<Response | any> => {
    try {
        const userId = req.userId as string;
        const resumeId = req.params.resumeId as string;

        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        
        (resume as any).__v = undefined;
        (resume as any).createdAt = undefined;
        (resume as any).updatedAt = undefined;

        return res.status(200).json({ resume });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}


export const getPublicResumeById = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const resumeId = req.params.resumeId as string;
        
        
        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ resume });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}


export const updateResume = async (req: AuthRequest, res: Response): Promise<Response | any> => {
    try {
        const userId = req.userId as string;
        const { resumeId, resumeData, removeBackground } = req.body;
        
        
        const image = (req as any).file; 

        let resumeDataCopy = JSON.parse(resumeData);

        
        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId as string },
            resumeDataCopy,
            { new: true }
        );

        return res.status(200).json({ message: 'Saved successfully', resume });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}