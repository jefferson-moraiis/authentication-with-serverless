import { IUser } from '../entities/modelUser';
import { userDatasource } from '../datasource/user.datasource'

export interface IUserRepository {
    createUser(user: IUser): Promise<IUser>
    getUser(email: string)
}

class UserRepository implements IUserRepository {

    public createUser = (user: IUser) => userDatasource.createUser(user);
    public getUser = (email: string) => userDatasource.getUser(email)

}

export const userRepository: IUserRepository = new UserRepository();
