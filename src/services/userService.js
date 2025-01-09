import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/userRepository.js';
import { createJWT } from '../utils/common/authUtils.js';
import ClientError from '../utils/error/ClientError.js';
import ValidationError from '../utils/error/validationError.js';

export const signupUserService = async (data) => {
    try {
        const newUser = await userRepository.create(data);
        return newUser;
    } catch(error) {
        console.log('user service error', error);
        if(error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }

        if(error.name === 'MongoServerError' && error.code === 11000) {
            throw new ValidationError(
                {
                    error: ['A user with same email or same username already exists']
                },
                'A user with same email or same username already exists'
            )
        }
    }
}


export const signinUserService = async (data) => {

    try {
    const user = await userRepository.getByEmail(data.email);

    if(!user) {
        throw new ClientError({
            explanation: 'Invalid data sent from user',
            message: 'User with this email is not exist',
            statusCode: StatusCodes.BAD_REQUEST
        });
    }

    const isPassword = bcrypt.compareSync(data.password, user.password);

    if(!isPassword) {
        throw new ClientError({
            explanation: 'Invalid data sent from user',
            message: 'Invalid password, please try again',
            statusCode: StatusCodes.BAD_REQUEST
        });
    }

    return {
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        token: createJWT({ id: user._id, email: user.email})
    }

    } catch(error) {
        console.log('signin service error', error);
        throw error;
    }
}