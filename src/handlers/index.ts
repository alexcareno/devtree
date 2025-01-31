import { Request, Response } from "express";
import slugify from 'slugify';
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { validationResult } from "express-validator";

export const createAccount = async (req: Request, res: Response) => {
    // await User.create(req.body);

    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if(userExists) {
        const error = new Error('El email ya está registrado');
        res.status(409).json({ error: error.message });
        return;
    }

    const handle = slugify(req.body.handle, '');
    const handleExists = await User.findOne({ handle });
    if(handleExists) {
        const error = new Error('Nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return;
    }

    const user = new User(req.body);
    user.password = await hashPassword(user.password);
    user.handle = handle;
    await user.save();
    res.send('Registro creado correctamente');
};