import bcrypt from 'bcrypt';
import User from '../collections/user.js';
import * as tokenUtils from '../utils/token.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = async (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
}

const login = async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username })
        
        if (!user || !await bcrypt.compare(request.body.password, user.password)) {
            return response.status(400).json({
                status: 'error',
                message: 'an error has occured',
                errors: {'message': 'User authentication failed'}
            });
        }
 
        const token = tokenUtils.generate(user._id);

        // Set cookie header

        const duration = 1000 * 60 * 60; // 1 hour
        
        response.cookie('token', token, { maxAge: duration, httpOnly: true });
        
        return response.status(200).json({
            status: 'success',
            message: 'Login successful!',
            data: {
                message: 'User authentication success',
            }
        });

    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: JSON.parse("{'message':'Something went wrong'}")
        });
    }
}

const logout = (request, response) => {
    response.cookie('token', '', { maxAge: 1 });
    response.cookie('user', '', { maxAge: 1 });

    return response.redirect('/');
}

export {
    index,
    login,
    logout
}