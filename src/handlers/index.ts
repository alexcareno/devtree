import type { Request, Response } from "express";
import slugify from 'slugify';
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { check, validationResult } from "express-validator";

export const createAccount = async (req: Request, res: Response) => {
    // await User.create(req.body);

    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('El email ya está registrado');
        res.status(409).json({ error: error.message });
        return;
    }

    const handle = slugify(req.body.handle, '');
    const handleExists = await User.findOne({ handle });
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return;
    }

    const user = new User(req.body);
    user.password = await hashPassword(user.password);
    user.handle = handle;
    await user.save();
    res.status(201).send('Registro creado correctamente');
};

export const login = async (req: Request, res: Response) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Validar usuario
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('El usuario no está registrado');
        res.status(404).json({ error: error.message });
        return;
    }

    // Comprobar la contraseña
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
        const error = new Error('Contraseña Incorrecta');
        res.status(401).json({ error: error.message });
        return;
    }
};