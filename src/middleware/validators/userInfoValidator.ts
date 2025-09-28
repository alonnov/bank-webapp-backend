import { z } from '../../lib/zod-to-openapi';
import {
    emailValidator,
    passwordValidator,
    nameValidator,
    birthdateValidator,
    phoneValidator,
} from './validatorTypes';

export const userInfoSchema = z.object({
    email: emailValidator,
    password: passwordValidator,
    first_name: nameValidator,
    last_name: nameValidator,
    phone: phoneValidator,
    birthday: birthdateValidator,
});

export type InfoRequestBody = z.infer<typeof userInfoSchema>;

