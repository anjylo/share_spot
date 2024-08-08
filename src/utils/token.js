import jwt from 'jsonwebtoken';

const SECRET = '123456789';

const generate = (id) => {
    const options = {
        algorithm: 'HS256',
        expiresIn: '1h'
    };

    return jwt.sign({ id }, SECRET, options);
}

const validate = (token) => jwt.verify(token, SECRET);

export {
    generate,
    validate
}