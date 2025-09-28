import { Request, Response } from 'express';
import { createPW } from '../../utils/password';
import { userService, accountService } from '../../services/serviceContainer';
import { emailService } from '../../services/emailService';
import { ApiResponse } from '../../types/responseTypes';

//new user sign up
export const userSignup = async(req: Request, res: Response) => {
    try {
        // Validation is handled by middleware, data is available in req.validatedSignup
        const { email, password, first_name, last_name, birthday, phone } = req.validatedSignup!;

        // Check if email already exists
        if(await userService.userExists(email)) {
            return res.status(400).json(new ApiResponse({ 
                success: false,
                message: "Email already associated with an existing account" 
            }));
        }

        // Create new user in user database
        const newUser = await userService.createUser({
            email,
            password: await createPW(password),
            first_name,
            last_name,
            birthday,
            phone,
            created_at: new Date(),
            last_update: new Date(),
            is_verified: false,
        });

        // Create associated bank account in account database
        const newAccount = await accountService.createAccount(newUser.id);

        // Send email verification
        await emailService.sendVerificationEmail(newUser.email);

        // Return success response
        return res.status(201).json(new ApiResponse({ 
            success: true,
            message: 'Signup successful. Please verify your email to login to your account.',
        }));

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json(new ApiResponse({ 
            success: false,
            message: "Internal server error during signup" 
        }));
    }  
};

// Export for testing/development
export const getUsers = () => userService.getAllUsers();
export const getAccounts = () => accountService.getAllAccounts();
