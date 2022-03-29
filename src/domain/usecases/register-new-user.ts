import { userService } from '../services/user.services'
import { IUser } from '../entities/modelUser'

class ResgisterNewUser {

    public registerUser = async (params: IUser) => {

        const newRegister = await userService.newUser(params)

        return newRegister

    }

}

export const registerNewUser = new ResgisterNewUser()

