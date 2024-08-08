import * as tokenUtils from '../utils/token.js';

const authenticate = async (request, response, next) => {
    const token = request.cookies.token;
    const tokenized = token ? tokenUtils.validate(token) : null;

    const uri = [
        '/login',
        '/register',
        '/user/register'
    ];

    // If token already exist, prevent authenticated user to re-login or register new accounts. 
    if (uri.includes(request.path) && request.method === 'GET' && (token && tokenized)) {
        return response.redirect('/')
    }
    
    if (!uri.includes(request.path) && (!token || !tokenized)) {
        return response.redirect('/login')
    }
    
    next()
}

export {
    authenticate
};