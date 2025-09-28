import { securityConfig } from '../../config/config';
import { z } from '../../lib/zod-to-openapi';

//Email validation
export const emailValidator = z.email({ message: "Invalid Email"});


//Password Validation
const requirements: string[] = [];
const patternParts: string[] = [];

if (securityConfig.passwordRequireLowercase) {
    requirements.push("lowercase letter");
    patternParts.push('(?=.*[a-z])');
}
if (securityConfig.passwordRequireUppercase) {
    requirements.push("uppercase letter");
    patternParts.push('(?=.*[A-Z])');
}
if (securityConfig.passwordRequireNumbers) {
    requirements.push("digit");
    patternParts.push('(?=.*\\d)');
}
if (securityConfig.passwordRequireSpecialChars) {
    requirements.push("symbol");
    patternParts.push('(?=.*[^a-zA-Z\\d])');
}

const passwordRegex = new RegExp(`^${patternParts.join('')}.+$`);
const requirementsMessage = `Password must contain at least one of each of the following: ${requirements.join(", ")}`;

export const passwordValidator = z
  .string()
  .min(securityConfig.passwordMinLength, { 
      message: `Password must be at least ${securityConfig.passwordMinLength} characters` 
  })
  .max(securityConfig.passwordMaxLength, { 
      message: `Password must be no more than ${securityConfig.passwordMaxLength} characters` 
  })
  .regex(passwordRegex, { message: requirementsMessage });

  
//First and Last name validation
export const nameValidator = z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be 50 characters or fewer" });


//Phone number validation
export const phoneValidator = z
    .string()
    .trim()
    .regex(/^\+?\d+$/, {message: "phone number must only contain digits"});

    
//Birthdate validation (format and if over 18)
export const birthdateValidator = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" })
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
  .refine(
    (date) => {
      const adultDate = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate());
      return adultDate <= new Date();
    },
    { message: "Age must be over 18" });

    
//Transaction sum validation
export const sumValidator = z
    .number()
    .min(1, { message: "Sum must be at least 1" });
