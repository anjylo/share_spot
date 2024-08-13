import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

// Define structure of a document
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: [true, 'Email is already taken'],
        lowercase: true,
        validate: {
            validator: (email) => /^[A-Za-z0-9._]+@[A-Za-z]+\.[A-Za-z]+(\.[A-Za-z]+)*$/.test(email),
            message: 'Invalid email format'
        },
    },
    username: {
        type: String,
        required: [true, 'Username required'],
        unique: [true, 'Username is already taken'],
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minLength: [8, 'Minumum password length is 8 characters']
    },
    role: {
        type: String,
        required: false,
        default: 'user',
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not supported'
        }
    }
}, { timestamps: false });

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        const salt = await bcrypt.genSalt();
        this._update.password = await bcrypt.hash(this._update.password, salt);
        next();
    }
});

const User = mongoose.model('User', userSchema);

export default User;