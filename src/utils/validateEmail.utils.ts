import validator from 'validator';
import User from '../models/user.model';

// Function to check if the email is valid and available
async function isValidEmail(email: string): Promise<string> {
    if (!validator.isEmail(email)) {
        return "Invalid email format";
    }

    const existingUser = await User.findOne({ email, isVerified: true }).exec();
    if (existingUser) {
        return "Email already exists";
    }

    return "Email available!";
}

// Function to check if the email is valid and not already taken by a verified user
async function isEmailValid(email: string): Promise<boolean> {
    if (validator.isEmail(email)) {
        const existingUser = await User.findOne({ email, isVerified: true }).exec();
        if (!existingUser) {
            return true;
        }
    }
    return false;
}

export { isValidEmail, isEmailValid };
