import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { sendEmail } from '../config/emailService'; 

export const signUp = async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, isVIP = false, isAdmin } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            isVIP,
            isAdmin
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An error occurred' });
    }
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
          res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const changePassword = async (req: any, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);

        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'The current password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};


export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail(email, "Your OTP", `Your OTP is ${otp}. It expires in 10 minutes.`);

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};
