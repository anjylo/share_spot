import Post from '../collections/post.js';
import * as mongooseUtils from '../utils/mongoose.js';
import * as tokenUtils from '../utils/token.js';

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

        if (!mongooseUtils.isValidObjectId(tokenId)) {
            return response.status(500).json({
                status: 'error',
                message: 'An error has occurred',
                error: 'Invalid object id'
            });
        }

        request.body.user = mongooseUtils.toValidObjectId(tokenId);
        
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
        const posts = await Post.find();

        return response.json({
            data: posts
        });
    } catch (error) {
        return response.status(500).json({
            status: 'error',
            message: 'an error has occured',
            errors: error
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

    const data = { 
        title: request.body.title, 
        content: request.body.content, 
        tags: request.body.tags 
    }

    const options = { runValidators: true }

    if (!mongooseUtils.isValidObjectId(id)) {
        return response.status(500).json({
            status: 'error',
            message: 'An error has occurred',
            error: 'Invalid object id'
        });
    }

    try {
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
    const id = request.body.id;

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
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
}