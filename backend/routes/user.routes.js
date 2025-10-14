import {Router} from 'express';

import { registerUser,loginUser } from '../controllers/user.auth.js';

const router = Router();
// register a new user
router.post('/auth/register',registerUser);
// log in
router.post('/auth/login',loginUser);

export default router;
