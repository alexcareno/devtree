import { Router } from 'express';
import { createAccount, login } from "./handlers";
import { body } from 'express-validator';
import { handleInputErrors } from './middleware/validation';

const router = Router();

router.post('/auth/register',
    body('handle').notEmpty().withMessage('El handle es obligatorio'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleInputErrors,
    createAccount
);

router.post('/auth/login',
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    login
);

export default router;