import { Request, Response } from 'express';
import Complaint from '../models/complaintModel';
import { getIo } from '../config/socket';


export const submitComplaint = async (req: any, res: Response) => {
    const { title, description, categories } = req.body; 
    try {
        const complaint = new Complaint({
            title,
            description,
            categories, 
            user: req.user._id, 
            status: 'PENDING',
        });

        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ message: 'Error submitting complaint', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};



export const getMyComplaints = async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const complaints = await Complaint.find({ user: req.user._id }).skip(skip).limit(limit);
        const total = await Complaint.countDocuments({ user: req.user._id });

        res.json({
            complaints,
            page,
            totalPages: Math.ceil(total / limit),
            totalComplaints: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
    const { complaintId } = req.params;
    const { status } = req.body;
  
    try {
        const complaint = await Complaint.findById(complaintId);
    
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
    
        complaint.status = status;
        await complaint.save();
    
        const io = getIo();
        io.emit(`complaintStatusUpdated:${complaint.user.toString()}`, {
            complaintId: complaint._id.toString(),
            status: complaint.status,
        });
    
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Error updating complaint status', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const deleteComplaint = async (req: any, res: Response) => {
    const { complaintId } = req.params;

    try {
        const complaint = await Complaint.findOneAndDelete({ _id: complaintId, user: req.user._id });

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found or not authorized' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting complaint', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getComplaintsAdmin = async (req: Request, res: Response) => {
    let query = {};

    if (req.query.status) {
        query = { ...query, status: req.query.status };
    }
    if (req.query.user) {
        query = { ...query, user: req.query.user };
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const complaints = await Complaint.find(query).skip(skip).limit(limit).exec();
        const total = await Complaint.countDocuments(query);
        
        res.json({
            success: true,
            count: complaints.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: complaints,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getComplaintDetails = async (req: any, res: Response) => {
    const { complaintId } = req.params;

    try {
        const complaint = await Complaint.findOne({ _id: complaintId, user: req.user._id });
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaint details', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};