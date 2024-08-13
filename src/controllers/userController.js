import User from '../collections/user.js';
import * as tokenUtils from '../utils/token.js';
import * as mongooseUtils from '../utils/mongoose.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'user', 'user.html'));
}

const getUsers = async (request, response) => {
    try {
        const users = await User.find();

        return response.json({
            data: users
        });
    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: error
        });
    }
}

const getUser = async (request, response) => {
    const id = request.body.id ? request.body.id : (tokenUtils.validate(request.cookies.token)).id;
    
    if (!mongooseUtils.isValidObjectId(id)) {
        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: 'Invalid object id'
        });
    }

    try {
        const user = await User.findById({ _id: id });

        if (!user) {
            return response.status(400).json({
                status: 'error',
                message: 'an error has occured',
                errors: {'message': 'User not found'}
            });
        }

        return response.status(200).json({
            status: 'success',
            message: 'User fetched',
            data: {
                id: user._id,
                email: user.email,
                username: user.username,
            }
        });
    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: error.message
        });
    }
}

const createUser = async (request, response) => {
    try {
        const user = new User(request.body);
        
        const validation = user.validateSync();

        if (validation) {
            const errors = Object.keys(validation.errors).reduce((accumulator, error) => {
                accumulator[error] = validation.errors[error].message;
                return accumulator;
            }, {});
            
            throw new Error(JSON.stringify(errors));
        }

        await user.save();

        const token = tokenUtils.generate(user._id);

        // Set cookie header

        const duration = 1000 * 60 * 60 // 1 hour
        
        response.cookie('token', token, { maxAge: duration, httpOnly: true });

        return response.status(201).json({
            status: 'success',
            message: 'registration successful',
            'data': {
                token: token,
                email: user.email,
                username: user.username,
            }
         });

    } catch (error) {
        if (error.code && error.code === 11000) {
            const field = Object.keys(error.keyPattern);
            
            return response.status(409).json({
                status: 'error',
                message: `${field} must be unique`,
                errors: { [field]: `${field} must be unique` }
            });
        }
        
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: JSON.parse(error.message)
        });
    }
}

const updateUser = async (request, response) => {
    const id = request.body.id ? request.body.id : (tokenUtils.validate(request.cookies.token)).id;

    if (!mongooseUtils.isValidObjectId(id)) {
        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: 'Invalid object id'
        });
    }

    try {
        const objId = mongooseUtils.toValidObjectId(id);

        const duplicate = await User.findOne({
            $and: [
                { _id: { $ne: objId } },
                {
                    $or: [
                        { email: request.body.email },
                        { username: request.body.username }
                    ]
                }
            ]
        });
        
        if (duplicate) {
            let errors = [];

            if (duplicate.email === request.body.email) errors.push('Email already taken');
            if (duplicate.username === request.body.username) errors.push('Username already taken');
       
            return response.status(400).json({
                status: 'error',
                message: 'An error has occurred',
                errors: errors
            });
        }

        const data = {}

        if (request.body.email) data.email = request.body.email;
        if (request.body.username) data.username = request.body.username;
        if (request.body.password) data.password = request.body.password;

        const options = { runValidators: true };
        const user = await User.findByIdAndUpdate(id, data, options);

        if (!user) {
            return response.status(404).json({
                status: 'error',
                message: 'User not found',
             });
        }

        return response.status(200).json({
            status: 'success',
            message: 'user updated',
         });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(500).json({
                status: 'error',
                message: 'an error has occured',
                errors: Object.keys(error.errors).reduce((accumulator, key) => {
                    const { path, message } = error.errors[key].properties;
                    accumulator[path] = message;
                    return accumulator;
                }, {})
            });
        }

        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: error.message
        });
    }
}

export {
    index,
    getUsers,
    getUser,
    createUser,
    updateUser
}