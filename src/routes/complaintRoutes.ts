import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';

import { submitComplaint, getMyComplaints, deleteComplaint, updateComplaintStatus, getComplaintsAdmin, getComplaintDetails } from '../controllers/complaintController';


const router = express.Router();

router.post('/', protect, submitComplaint); 
router.get('/my', protect, getMyComplaints); 
router.delete('/:complaintId', protect, deleteComplaint); 
router.put('/status/:complaintId', protect, admin, updateComplaintStatus);

router.get('/admin', protect, admin, getComplaintsAdmin);
router.get('/:complaintId', protect, getComplaintDetails);


export default router;
