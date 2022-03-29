import { IUser } from '../entities/modelUser';
import { userRepository } from '../repositories/user.repositories';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';



class UserService {

    public newUser = async (user: IUser) => {

        const passwordHash = await bcrypt.hash(user.password, 8);

        delete user.password;
        const params = {
            id: uuid(),
            name: user.name,
            email: user.email,
            password: passwordHash,
            role: user.role
        }

        const createNewUser = await userRepository.createUser(params)

        return createNewUser


    }

    public getUserbyEmail = async (email: string) => {

        const user = await userRepository.getUser(email)

        return user
    }

}

export const userService = new UserService()


