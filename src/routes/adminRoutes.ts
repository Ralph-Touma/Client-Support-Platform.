import express from 'express';
import { addComplaintCategory } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';
import {
    getComplaintCategoriesPaginated,
    getComplaintCategoryDetails,
    updateComplaintCategory,
    deleteComplaintCategory,
} from '../controllers/adminController';

const router = express.Router();

router.post('/complaint-category', protect, admin, addComplaintCategory);
router.get('/complaint-categories', protect, admin, getComplaintCategoriesPaginated);
router.get('/complaint-category/:categoryId', protect, admin, getComplaintCategoryDetails);
router.put('/complaint-category/:categoryId', protect, admin, updateComplaintCategory);
router.delete('/complaint-category/:categoryId', protect, admin, deleteComplaintCategory);



export default router;
