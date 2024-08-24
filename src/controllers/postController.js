import Post from '../collections/post.js';
import * as mongooseUtils from '../utils/mongoose.js';
import * as tokenUtils from '../utils/token.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = async (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'post', 'post.html'));
}

const createPost = async (request, response) => {
    try {
        const tokenId = (tokenUtils.validate(request.cookies.token)).id;

        if (!tokenId) {
            return response.status(500).json({
                status: 'error',
                message: 'An error has occurred',
                error: 'Invalid session token'
            });
        }

        request.body.user = tokenId
        
        const post = new Post(request.body);
        
        const validation = post.validateSync();

        if (validation) {
            const errors = Object.keys(validation.errors).reduce((accumulator, error) => {
                accumulator[error] = validation.errors[error].message;
                return accumulator;
            }, {});
            
            throw new Error(JSON.stringify(errors));
        }

        await post.save();

        return response.status(201).json({
            status: 'success',
            message: 'post created',
         });

    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: JSON.parse(error.message)
        });
    }
}

const getPosts = async (request, response) => {
    try {
        const user = request.query.id;
        const offset = request.query.offset || 0;
        const limit = 10

        const condition = user ? { user } : {}

        const posts = await Post.find(condition).skip(offset).limit(limit);

        return response.json({
            data: posts
        });
    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: error.message
        });
    }
}

const getPost = async (request, response) => {
    const id = request.body.id;

    if (!mongooseUtils.isValidObjectId(id)) {
        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: 'Invalid object id'
        });
    }

   try {
        const post = await Post.findById({ _id: id });

        if (!post) {
            return response.status(400).json({
                status: 'error',
                message: 'an error has occured',
                errors: {'message': 'Post not found'}
            });
        }

        return response.status(200).json({
            status: 'success',
            message: 'Post fetched',
            data: {
                email: post.title,
                content: post.content,
                tags: post.tags,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
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

const updatePost = async (request, response) => {
    const id = request.body.id;

    if (!mongooseUtils.isValidObjectId(id)) {
        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: 'Invalid object id'
        });
    }

    try {
        const data = { 
            title: request.body.title, 
            content: request.body.content, 
            tags: request.body.tags 
        }
    
        const options = { runValidators: true }
        
        const post = await Post.findByIdAndUpdate(id, data, options);

        if (!post) {
            return response.status(404).json({
                status: 'error',
                message: 'Post not found',
             });
        }

        return response.status(200).json({
            status: 'success',
            message: 'post updated',
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

const deletePost = async (request, response) => {
    const id = request.params.id;

    if (!mongooseUtils.isValidObjectId(id)) {
        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: 'Invalid object id'
        });
    }

    try {
        await Post.findByIdAndDelete(id);
        
        return response.json({
            status: 'success',
            message: 'post deleted'
        });
    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: error.message
        });
    }
}

export {
    index,
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
}