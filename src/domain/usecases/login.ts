import * as bcrypt from 'bcrypt';
import { userService } from '../services/user.services'
import { ISignin } from '../entities/signin'
import { autorizationService } from '../services/autorization.services'
class Login {

    public comparePassword = (eventPassword, userPassword) => {
        return bcrypt.compare(eventPassword, userPassword);
    }

    public login = async (body: ISignin) => {

        try {
            const user = await userService.getUserbyEmail(body.email);
            const isValidPassword = await this.comparePassword(
                body.password,
                user[0].password
            );

            if (isValidPassword) {
                const token = await autorizationService.signToken(user[0]);

                return Promise.resolve({ auth: true, token: token, email: user[0].email, name: user[0].name });
            }
        } catch (err) {

            return Promise.reject(new Error(err));
        }
    }

}

export const login = new Login()

