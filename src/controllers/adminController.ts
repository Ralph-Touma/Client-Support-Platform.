import { Request, Response } from 'express';
import ComplaintCategory from '../models/complaintCategoryModel';

export const addComplaintCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
        const categoryExists = await ComplaintCategory.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await ComplaintCategory.create({
            name,
            description,
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error adding new category', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getComplaintCategoriesPaginated = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const categories = await ComplaintCategory.find().skip(skip).limit(limit);
        const total = await ComplaintCategory.countDocuments();

        res.json({
            categories,
            page,
            totalPages: Math.ceil(total / limit),
            totalCategories: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaint categories', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getComplaintCategoryDetails = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    try {
        const category = await ComplaintCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category details', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const updateComplaintCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    try {
        const category = await ComplaintCategory.findByIdAndUpdate(categoryId, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const deleteComplaintCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    try {
        const category = await ComplaintCategory.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};
