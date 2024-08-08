import mongoose from 'mongoose';

const isValidObjectId = (id) => {
    const {Types: {ObjectId}} = mongoose;

    return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
}

const toValidObjectId = (id) => new mongoose.Types.ObjectId(id);

export {
    isValidObjectId,
    toValidObjectId
}