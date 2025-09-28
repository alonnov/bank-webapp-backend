import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

export const createPW = async(pw: string) : Promise<string> => {
    
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(pw, salt);

    return hashed;
}

