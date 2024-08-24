import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

const generate = (id) => {
    const options = {
        algorithm: process.env.JWT_ALGORITHM,
        expiresIn: process.env.JWT_EXPIRES_IN
    };

    return jwt.sign({ id }, SECRET, options);
}

const validate = (token) => jwt.verify(token, SECRET);

export {
    generate,
    validate
}