import { IUserDynamooseModel } from '../datasource/models/user-dynamoose.model'
import { IUser } from '../entities/modelUser';


export interface IUserDataSource {
    createUser(user: IUser): Promise<IUser>;
    getUser(email: string)
}


class UserDatasource implements IUserDataSource {


    /**
     * 
     * @param user
     */

    public createUser = async (user: IUser) => {

        try {
            return await IUserDynamooseModel.create(user, { overwrite: false, return: 'document' }) as IUser
        } catch (error) {
            throw Error(`Erro no persist dos dados no Dynamo: ${JSON.stringify(error)}`);
        }

    }

    /**
     * 
     * @param user
     */

    public getUser = async (email: string) => {

        try {
            const response = await IUserDynamooseModel.scan('email').contains(email)
                .exec();

            return response.toJSON()

        } catch (error) {
            throw Error(`Erro no persist dos dados no Dynamo: ${JSON.stringify(error)}`);
        }

    }

}

export const userDatasource: IUserDataSource = new UserDatasource()
